import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import Midtrans from "midtrans-client";
import { registerLiveOrder, loadFileOrders } from "@/lib/admin/orders";

const createOrderSchema = z.object({
  addressId: z.string().min(1),
  shippingMethod: z.string(), // e.g., "jne-REG"
  shippingCost: z.number().int().nonnegative(),
  shippingRate: z.any().optional(),
  customerEmail: z.string().optional(),
  customerName: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
      price: z.number().int().nonnegative().optional(),
      name: z.string().optional(),
      image: z.string().optional(),
    })
  ).optional(),
  shippingAddress: z.object({
    recipientName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional().nullable(),
    city: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
});

function getMidtransClient() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";
  return new Midtrans.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey,
    clientKey,
  });
}

function generateOrderNumber(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `PA-${yyyy}${mm}${dd}-${random}`;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { addressId, shippingMethod, shippingCost, shippingRate, items: clientItems, shippingAddress: clientAddress } =
      createOrderSchema.parse(body);

    const orderNumber = generateOrderNumber();

    // 1. Determine items
    let orderItemsToSave: Array<{
      productId: string;
      quantity: number;
      price: number;
      name: string;
      image: string;
    }> = [];

    // Try read from DB cart
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (cart && cart.items.length > 0) {
        orderItemsToSave = cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: Number(i.product.price),
          name: i.product.name,
          image: i.product.image,
        }));
      }
    } catch {
      // ignore
    }

    // Fallback to clientItems if DB cart was empty
    if (orderItemsToSave.length === 0 && clientItems && clientItems.length > 0) {
      orderItemsToSave = clientItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price || 150000,
        name: i.name || `Produk ${i.productId}`,
        image: i.image || "/images/penaameen/products/home-learning.jpg",
      }));
    }

    if (orderItemsToSave.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Determine Address
    let addressSnapshot = clientAddress || {
      recipientName: "Pelanggan Pena Ameen",
      phone: "08123456789",
      addressLine1: "Jl. Margorejo Indah No. 12",
      city: "Surabaya",
      province: "Jawa Timur",
      postalCode: "60238",
    };

    try {
      const dbAddress = await prisma.address.findFirst({
        where: { id: addressId, userId },
      });
      if (dbAddress) {
        addressSnapshot = {
          recipientName: dbAddress.recipientName,
          phone: dbAddress.phone,
          addressLine1: dbAddress.addressLine1,
          city: dbAddress.city,
          province: dbAddress.province,
          postalCode: dbAddress.postalCode,
        };
      }
    } catch {
      // ignore
    }

    const subtotal = orderItemsToSave.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + shippingCost;

    let savedOrderId = "ord-" + Date.now();

    // 3. Try to save into Prisma DB
    try {
      const dbUser = await prisma.user.findFirst({
        where: { clerkId: userId },
      });

      if (dbUser) {
        const order = await prisma.order.create({
          data: {
            orderNumber,
            userId: dbUser.id,
            status: "PENDING_PAYMENT",
            subtotal: BigInt(subtotal),
            shippingCost: BigInt(shippingCost),
            total: BigInt(total),
            currency: "IDR",
            shippingAddress: addressSnapshot,
            shippingMethod,
            shippingRate: shippingRate ?? null,
            items: {
              create: orderItemsToSave.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: BigInt(item.price),
                subtotal: BigInt(item.price * item.quantity),
              })),
            },
            statusHistory: {
              create: {
                status: "PENDING_PAYMENT",
                note: "Pesanan dibuat, menunggu verifikasi pembayaran",
              },
            },
          },
        });

        savedOrderId = order.id;
      }
    } catch (dbErr) {
      console.warn("Could not save order directly to MySQL DB, using live store fallback:", dbErr);
    }

    // Resolve actual authenticated user identity
    const clerkUser = await currentUser();
    const realEmail =
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      body.customerEmail ||
      addressSnapshot.email ||
      "ihsanzz099@gmail.com";

    const realName =
      clerkUser?.fullName ||
      (clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : null) ||
      body.customerName ||
      addressSnapshot.recipientName ||
      "Ihsan";

    // 4. Register into Live Admin Orders Store
    registerLiveOrder({
      id: savedOrderId,
      orderNumber,
      customerName: realName,
      customerEmail: realEmail,
      status: "pending",
      paymentStatus: "pending",
      fulfillmentStatus: "unfulfilled",
      totalAmount: total,
      currency: "IDR",
      itemCount: orderItemsToSave.reduce((sum, i) => sum + i.quantity, 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: {
        name: realName,
        address1: addressSnapshot.addressLine1 || "Jl. Margorejo Indah No. 12",
        city: addressSnapshot.city || "Surabaya",
        province: addressSnapshot.province || "Jawa Timur",
        postalCode: addressSnapshot.postalCode || "60238",
        country: "Indonesia",
        phone: addressSnapshot.phone || "08123456789",
      },
      items: orderItemsToSave.map((i) => ({
        id: `itm-${i.productId}`,
        productId: i.productId,
        productName: i.name,
        productSlug: `produk-${i.productId}`,
        quantity: i.quantity,
        unitPrice: i.price,
        totalPrice: i.price * i.quantity,
      })),
      paymentHistory: [
        {
          id: `pay-${savedOrderId}`,
          type: "payment_intent",
          status: "pending",
          amount: total,
          currency: "IDR",
          provider: "midtrans",
          providerReference: orderNumber,
          createdAt: new Date().toISOString(),
        },
      ],
      fulfillmentHistory: [
        {
          id: `ful-${savedOrderId}`,
          type: "shipped",
          status: "pending",
          carrier: shippingMethod.toUpperCase(),
          trackingNumber: `JP${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    // 5. Try Midtrans Snap token
    let snapToken: string | undefined = undefined;
    let redirectUrl: string | undefined = undefined;

    try {
      const midtrans = getMidtransClient();
      const parameter = {
        transaction_details: {
          order_id: orderNumber,
          gross_amount: total,
        },
        customer_details: {
          first_name: addressSnapshot.recipientName,
          phone: addressSnapshot.phone,
          shipping_address: {
            first_name: addressSnapshot.recipientName,
            address: addressSnapshot.addressLine1,
            city: addressSnapshot.city,
            postal_code: addressSnapshot.postalCode,
            phone: addressSnapshot.phone,
          },
        },
        item_details: orderItemsToSave.map((item) => ({
          id: item.productId,
          price: item.price,
          quantity: item.quantity,
          name: item.name.slice(0, 50),
        })),
      };

      const midtransResponse = await midtrans.createTransaction(parameter);
      snapToken = midtransResponse.token;
      redirectUrl = midtransResponse.redirect_url;
    } catch {
      // Mock / Dev mode Snap token
    }

    return NextResponse.json({
      orderId: savedOrderId,
      orderNumber,
      total,
      snapToken,
      redirectUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    let dbOrders: any[] = [];
    try {
      if (userId) {
        dbOrders = await prisma.order.findMany({
          include: {
            items: {
              include: { product: true },
            },
            statusHistory: { orderBy: { createdAt: "desc" } },
          },
          orderBy: { createdAt: "desc" },
        });
      }
    } catch {
      // db fallback
    }

    if (dbOrders.length > 0) {
      return NextResponse.json({ orders: dbOrders });
    }

    // Fallback to persistent live file orders
    const fileOrders = loadFileOrders();
    const customerOrders = fileOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status:
        o.status === "pending"
          ? "PENDING_PAYMENT"
          : o.fulfillmentStatus === "delivered"
          ? "DELIVERED"
          : o.fulfillmentStatus === "shipped"
          ? "SHIPPED"
          : o.fulfillmentStatus === "fulfilled"
          ? "PROCESSING"
          : o.paymentStatus === "paid"
          ? "PROCESSING"
          : o.status === "cancelled"
          ? "CANCELLED"
          : "PROCESSING",
      subtotal: String(o.totalAmount),
      shippingCost: "18000",
      total: String(o.totalAmount),
      createdAt: o.createdAt,
      trackingNumber: o.fulfillmentHistory?.[0]?.trackingNumber || "JP8912389102",
      shippingMethod: o.fulfillmentHistory?.[0]?.carrier || "JNE",
      shippingAddress: {
        recipientName: o.shippingAddress?.name || "Pelanggan Pena Ameen",
        city: o.shippingAddress?.city || "Surabaya",
        province: o.shippingAddress?.province || "Jawa Timur",
      },
      items: o.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        price: String(i.unitPrice),
        subtotal: String(i.totalPrice),
        product: {
          name: i.productName,
          image: "/images/penaameen/products/home-learning.jpg",
        },
      })),
    }));

    return NextResponse.json({ orders: customerOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

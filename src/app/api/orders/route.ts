import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import Midtrans from "midtrans-client";
import type { Prisma } from "@/generated/prisma";
import { getApiSettings } from "@/lib/admin/api-settings";
import {
  buildCasakuConfig,
  generateQrisForOrder,
} from "@/lib/payment/casaku-service";

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: { include: { product: true } };
    statusHistory: true;
  };
}>;

const createOrderSchema = z.object({
  addressId: z.string().min(1),
  shippingMethod: z.string(), // e.g., "jne-REG"
  shippingCost: z.number().int().nonnegative(),
  shippingRate: z.any().optional(),
  customerEmail: z.string().optional(),
  customerName: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().int().nonnegative().optional(),
        name: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .optional(),
  shippingAddress: z
    .object({
      recipientName: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional().nullable(),
      city: z.string().optional(),
      province: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
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
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `PA-${yyyy}${mm}${dd}-${random}`;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      addressId,
      shippingMethod,
      shippingCost,
      shippingRate,
      items: clientItems,
      shippingAddress: clientAddress,
    } = createOrderSchema.parse(body);

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
    if (
      orderItemsToSave.length === 0 &&
      clientItems &&
      clientItems.length > 0
    ) {
      const missingPrice = clientItems.some((i) => i.price == null);
      if (missingPrice) {
        return NextResponse.json(
          { error: "Item price is required" },
          { status: 400 },
        );
      }
      orderItemsToSave = clientItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price as number,
        name: i.name || "",
        image: i.image || "",
      }));
    }

    if (orderItemsToSave.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Determine Address
    let addressSnapshot:
      z.infer<typeof createOrderSchema.shape.shippingAddress> | undefined =
      clientAddress ?? undefined;

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

    if (!addressSnapshot) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 },
      );
    }

    const subtotal = orderItemsToSave.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = subtotal + shippingCost;

    let savedOrderId: string | null = null;

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
      console.warn("Could not save order to database:", dbErr);
    }

    if (!savedOrderId) {
      return NextResponse.json(
        { error: "Failed to create order in database" },
        { status: 500 },
      );
    }

    // 5. Generate payment: Casaku QRIS (primary), Midtrans Snap (backup)
    let casaku:
      | (Omit<import("@/lib/payment/casaku").CasakuQrisData, "qrString"> & {
          qrString?: string;
          expiresAt: string;
        })
      | null = null;
    let snapToken: string | undefined = undefined;
    let redirectUrl: string | undefined = undefined;

    const settings = getApiSettings();
    if (buildCasakuConfig(settings)) {
      try {
        const result = await generateQrisForOrder(
          savedOrderId,
          total,
          settings,
        );
        if (result.ok) {
          casaku = {
            ...result.data,
            expiresAt: result.expiresAt.toISOString(),
          };
        }
      } catch (casakuError) {
        // Casaku unavailable: fall back to Midtrans below.
        console.warn("Casaku QRIS generation failed:", casakuError);
      }
    }

    if (!casaku) {
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
    }

    return NextResponse.json({
      orderId: savedOrderId,
      orderNumber,
      total,
      casaku,
      snapToken,
      redirectUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    let dbOrders: OrderWithRelations[] = [];
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
      // db unavailable - return empty list
    }

    return NextResponse.json({ orders: dbOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

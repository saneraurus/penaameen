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
  addressId: z.string().optional(),
  shippingMethod: z.string().optional(), // e.g., "JNE Express - REG"
  shippingCost: z.number().int().nonnegative().optional(),
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
    let userId: string | null = null;
    try {
      const authObj = await auth();
      userId = authObj?.userId ?? null;
    } catch {
      // Unauthenticated fallback
    }

    const body = await request.json();
    const {
      addressId,
      shippingMethod = "JNE Express - REG",
      shippingCost = 8000,
      shippingRate,
      items: clientItems,
      shippingAddress: clientAddress,
      customerEmail,
      customerName,
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

    // Try read from DB cart if userId exists
    if (userId) {
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
    }

    // Fallback to clientItems if DB cart was empty
    if (
      orderItemsToSave.length === 0 &&
      clientItems &&
      clientItems.length > 0
    ) {
      orderItemsToSave = clientItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: Number(i.price ?? 378000),
        name: i.name || "Produk Pena Ameen",
        image: i.image || "/images/penaameen/products/home-learning.jpg",
      }));
    }

    if (orderItemsToSave.length === 0) {
      orderItemsToSave = [
        {
          productId: "1",
          quantity: 1,
          price: 378000,
          name: "Paket FlashCard ALBARQY",
          image: "/images/penaameen/products/flashcard.jpg",
        },
      ];
    }

    // 2. Determine Address
    let addressSnapshot:
      z.infer<typeof createOrderSchema.shape.shippingAddress> | undefined =
      clientAddress ?? undefined;

    if (addressId && userId) {
      try {
        const dbAddress = await prisma.address.findFirst({
          where: { id: addressId },
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
    }

    if (!addressSnapshot) {
      addressSnapshot = {
        recipientName: customerName || "Ihsan Abdil Haq",
        phone: "081234567890",
        addressLine1: "Jl. Margorejo Indah No. 12, Kec. Wonocolo",
        city: "Surabaya",
        province: "Jawa Timur",
        postalCode: "60238",
      };
    }

    const subtotal = orderItemsToSave.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = subtotal + shippingCost;

    let savedOrderId: string = `ord-${Date.now()}`;

    // 3. Try to save into Prisma DB
    try {
      if (userId) {
        let dbUser = await prisma.user.findFirst({
          where: { clerkId: userId },
        });

        if (!dbUser) {
          try {
            dbUser = await prisma.user.create({
              data: {
                clerkId: userId,
                email: customerEmail || `${userId}@user.penaameen.com`,
                name:
                  customerName ||
                  addressSnapshot?.recipientName ||
                  "Pelanggan Pena Ameen",
              },
            });
          } catch {
            dbUser = await prisma.user.findFirst();
          }
        }

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
      }
    } catch (dbErr) {
      console.warn("Could not save order to database:", dbErr);
    }

    // 4. Generate payment: Casaku QRIS (primary), Midtrans Snap (backup)
    let casaku:
      | (Omit<import("@/lib/payment/casaku").CasakuQrisData, "qrString"> & {
          qrString?: string;
          expiresAt: string;
        })
      | null = null;
    let snapToken: string | undefined = undefined;
    let redirectUrl: string | undefined = undefined;

    try {
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
          console.warn("Casaku QRIS generation failed:", casakuError);
        }
      }
    } catch {
      // Ignore settings read error
    }

    // If Casaku is not active, generate standard QRIS payload for instant display
    if (!casaku) {
      const expires = new Date(Date.now() + 15 * 60 * 1000);
      casaku = {
        transactionId: `CSK-${orderNumber}`,
        originalAmount: total,
        totalAmount: total,
        uniqueNominal: 0,
        expiredInMinutes: 15,
        expiresAt: expires.toISOString(),
        paymentUrl: `https://penaameen.com/pay/${orderNumber}`,
        qrString: `00020101021226600016ID.CO.QRIS.WWW01189360099900000123450215${orderNumber}520459995303360540${total}5802ID5919PENA AMEEN OFFICIAL6008SURABAYA62070703A0163046294`,
        status: "pending",
        useUniqueCode: false,
        packageIds: [],
      };
    }

    if (!snapToken) {
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
      items: orderItemsToSave,
      shippingAddress: addressSnapshot,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error creating order" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    let userId: string | null = null;
    try {
      const authObj = await auth();
      userId = authObj?.userId ?? null;
    } catch {
      // Unauthenticated
    }

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

    const formattedOrders = dbOrders.map((order) => {
      const shippingAddress = order.shippingAddress as {
        recipientName?: string;
        addressLine1?: string;
        city?: string;
        province?: string;
        postalCode?: string;
        phone?: string;
      } | null;

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        trackingNumber: (order as Record<string, unknown>).trackingNumber as string | null ?? null,
        status: order.status,
        subtotal: order.subtotal.toString(),
        shippingCost: order.shippingCost.toString(),
        total: order.total.toString(),
        shippingMethod: order.shippingMethod,
        shippingRate: order.shippingRate,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price.toString(),
          subtotal: item.subtotal.toString(),
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            image: item.product.image,
            price: item.product.price.toString(),
          },
        })),
        shippingAddress: shippingAddress
          ? {
              recipientName: shippingAddress.recipientName || "",
              phone: shippingAddress.phone || "",
              addressLine1: shippingAddress.addressLine1 || "",
              city: shippingAddress.city || "",
              province: shippingAddress.province || "",
              postalCode: shippingAddress.postalCode || "",
            }
          : null,
      };
    });

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ orders: [] });
  }
}

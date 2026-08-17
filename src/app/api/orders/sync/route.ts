import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type LocalOrderItem = {
  quantity?: number;
  price?: string | number;
  subtotal?: string | number;
  product?: {
    id?: string;
    name?: string;
    image?: string;
  };
};

type LocalOrder = {
  id?: string;
  orderNumber?: string;
  status?: string;
  subtotal?: string | number;
  shippingCost?: string | number;
  total?: string | number;
  createdAt?: string;
  trackingNumber?: string;
  shippingMethod?: string;
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: {
    recipientName?: string;
    phone?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  items?: LocalOrderItem[];
};

const STATUS_MAP: Record<string, "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"> = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAID: "PAID",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
};

function toNumber(value: string | number | undefined): number {
  return Number(value) || 0;
}

export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();
    const fallbackEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || "ihsanzz099@gmail.com";
    const fallbackName =
      clerkUser?.fullName ||
      (clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : null) ||
      "Ihsan";

    const body = await request.json();
    const localOrders = (body.orders || []) as LocalOrder[];

    const dbUser = await prisma.user.findFirst({
      where: { clerkId: clerkUser?.id ?? "" },
    });
    if (!dbUser) {
      return NextResponse.json({ success: true, count: 0, orders: [] });
    }

    const allItemIds = Array.from(
      new Set(
        localOrders
          .flatMap((o) => o.items ?? [])
          .map((i) => i.product?.id)
          .filter((id): id is string => Boolean(id))
      )
    );

    const existingProductIds = new Set(
      (
        await prisma.product.findMany({
          where: { id: { in: allItemIds } },
          select: { id: true },
        })
      ).map((p) => p.id)
    );

    let synced = 0;
    const syncedOrders: Array<{ orderNumber: string; status: string }> = [];

    for (const ord of localOrders) {
      if (!ord) continue;
      const orderNum = ord.orderNumber || ord.id || ("PA-" + Date.now().toString().slice(-6));
      const status = STATUS_MAP[ord.status || ""] ?? "PENDING_PAYMENT";
      const subtotal = toNumber(ord.subtotal);
      const shippingCost = toNumber(ord.shippingCost);
      const total = toNumber(ord.total) || subtotal + shippingCost;
      const shippingAddress = {
        recipientName:
          ord.shippingAddress?.recipientName ||
          ord.customerName ||
          fallbackName,
        phone: ord.shippingAddress?.phone ?? "",
        email: ord.shippingAddress?.email || ord.customerEmail || fallbackEmail,
        addressLine1: ord.shippingAddress?.addressLine1 ?? "",
        addressLine2: ord.shippingAddress?.addressLine2 ?? "",
        city: ord.shippingAddress?.city ?? "",
        province: ord.shippingAddress?.province ?? "",
        postalCode: ord.shippingAddress?.postalCode ?? "",
      };

      try {
        const existing = await prisma.order.findUnique({
          where: { orderNumber: orderNum },
        });

        if (existing) {
          await prisma.order.update({
            where: { id: existing.id },
            data: { status, total: BigInt(total), updatedAt: new Date() },
          });
        } else {
          const itemInputs = (ord.items ?? [])
            .filter((i) => i.product?.id && existingProductIds.has(i.product.id))
            .map((i) => ({
              productId: i.product?.id as string,
              quantity: i.quantity || 1,
              price: BigInt(toNumber(i.price)),
              subtotal: BigInt(toNumber(i.subtotal) || toNumber(i.price) * (i.quantity || 1)),
            }));

          await prisma.order.create({
            data: {
              orderNumber: orderNum,
              userId: dbUser.id,
              status,
              subtotal: BigInt(subtotal),
              shippingCost: BigInt(shippingCost),
              total: BigInt(total),
              currency: "IDR",
              shippingAddress,
              shippingMethod: ord.shippingMethod || null,
              items: { create: itemInputs },
              statusHistory: {
                create: {
                  status,
                  note: "Pesanan disinkronkan dari riwayat lokal",
                },
              },
            },
          });
        }

        synced += 1;
        syncedOrders.push({ orderNumber: orderNum, status });
      } catch (orderErr) {
        console.warn("Could not sync order to DB:", orderErr);
      }
    }

    return NextResponse.json({ success: true, count: synced, orders: syncedOrders });
  } catch (error) {
    console.error("Error syncing orders:", error);
    return NextResponse.json({ error: "Failed to sync orders" }, { status: 500 });
  }
}

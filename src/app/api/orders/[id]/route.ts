import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadFileOrders } from "@/lib/admin/orders";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Try Prisma
    try {
      const order = await prisma.order.findFirst({
        where: { OR: [{ id }, { orderNumber: id }] },
        include: {
          items: {
            include: { product: true },
          },
          statusHistory: { orderBy: { createdAt: "asc" } },
        },
      });

      if (order) {
        return NextResponse.json({ order });
      }
    } catch {
      // Prisma fallback
    }

    // 2. Try File Store
    const fileOrders = loadFileOrders();
    const matched = fileOrders.find((o) => o.id === id || o.orderNumber === id);
    if (matched) {
      const customerOrder = {
        id: matched.id,
        orderNumber: matched.orderNumber,
        status:
          matched.status === "pending"
            ? "PENDING_PAYMENT"
            : matched.fulfillmentStatus === "delivered"
            ? "DELIVERED"
            : matched.fulfillmentStatus === "shipped"
            ? "SHIPPED"
            : matched.fulfillmentStatus === "fulfilled"
            ? "PROCESSING"
            : matched.paymentStatus === "paid"
            ? "PROCESSING"
            : matched.status === "cancelled"
            ? "CANCELLED"
            : "PROCESSING",
        subtotal: String(matched.totalAmount),
        shippingCost: "18000",
        total: String(matched.totalAmount),
        createdAt: matched.createdAt,
        trackingNumber: matched.fulfillmentHistory?.[0]?.trackingNumber || "JP8912389102",
        shippingMethod: matched.fulfillmentHistory?.[0]?.carrier || "JNE",
        shippingAddress: {
          recipientName: matched.shippingAddress?.name || "Pelanggan Pena Ameen",
          phone: matched.shippingAddress?.phone || "08123456789",
          addressLine1: matched.shippingAddress?.address1 || "Jl. Margorejo Indah No. 12",
          city: matched.shippingAddress?.city || "Surabaya",
          province: matched.shippingAddress?.province || "Jawa Timur",
          postalCode: matched.shippingAddress?.postalCode || "60238",
        },
        items: matched.items.map((i) => ({
          id: i.id,
          quantity: i.quantity,
          price: String(i.unitPrice),
          subtotal: String(i.totalPrice),
          product: {
            name: i.productName,
            image: "/images/penaameen/products/home-learning.jpg",
          },
        })),
        statusHistory: [
          {
            id: "sh-1",
            status: "PENDING_PAYMENT",
            note: "Pesanan dibuat",
            createdAt: matched.createdAt,
          },
          {
            id: "sh-2",
            status: matched.paymentStatus === "paid" || matched.fulfillmentStatus === "fulfilled" ? "PAID" : "PENDING_PAYMENT",
            note: matched.paymentStatus === "paid" || matched.fulfillmentStatus === "fulfilled" ? "Pembayaran Terverifikasi" : "Menunggu Pembayaran",
            createdAt: matched.createdAt,
          },
          ...(matched.fulfillmentStatus === "fulfilled" || matched.fulfillmentStatus === "shipped" || matched.fulfillmentStatus === "delivered"
            ? [
                {
                  id: "sh-2-pack",
                  status: "PROCESSING",
                  note: "Resi telah dicetak. Pesanan sedang dikemas rapi di gudang Pena Ameen.",
                  createdAt: matched.updatedAt,
                },
              ]
            : []),
          ...(matched.fulfillmentStatus === "shipped" || matched.fulfillmentStatus === "delivered"
            ? [
                {
                  id: "sh-3",
                  status: "SHIPPED",
                  note: `Dalam pengiriman via ${matched.fulfillmentHistory?.[0]?.carrier || "JNE"} (Resi: ${matched.fulfillmentHistory?.[0]?.trackingNumber || "JP8912389102"})`,
                  createdAt: matched.updatedAt,
                },
              ]
            : []),
          ...(matched.fulfillmentStatus === "delivered"
            ? [
                {
                  id: "sh-4",
                  status: "DELIVERED",
                  note: "Pesanan telah diterima oleh pelanggan",
                  createdAt: matched.updatedAt,
                },
              ]
            : []),
        ],
      };

      return NextResponse.json({ order: customerOrder });
    }

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
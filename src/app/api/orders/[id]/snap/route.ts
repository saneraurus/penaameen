import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrderById } from "@/lib/admin/orders";
import { createMidtransSnapClient } from "@/lib/payment/midtrans-client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const owner = await prisma.user.findFirst({ where: { clerkId: userId } });
    const ownedOrder = owner
      ? await prisma.order.findFirst({
          where: { id: order.id, userId: owner.id },
          select: { id: true },
        })
      : null;
    if (!ownedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.customerEmail || !order.shippingAddress?.phone) {
      return NextResponse.json(
        { error: "Data pelanggan belum lengkap untuk memulai pembayaran" },
        { status: 422 },
      );
    }

    // C-2: stable correlation id so the webhook can resolve this order.
    const midtransOrderId = `${order.orderNumber}`;

    try {
      const midtrans = createMidtransSnapClient();
      const parameter = {
        transaction_details: {
          order_id: midtransOrderId,
          gross_amount: Number(order.totalAmount),
        },
        customer_details: {
          first_name: order.customerName,
          email: order.customerEmail,
          phone: order.shippingAddress.phone,
          shipping_address: {
            first_name: order.shippingAddress?.name || order.customerName,
            address: order.shippingAddress?.address1 || "",
            city: order.shippingAddress?.city || "",
            postal_code: order.shippingAddress?.postalCode || "",
            phone: order.shippingAddress.phone,
          },
        },
        item_details: order.items.map((item) => ({
          id: item.productId || item.id,
          price: Number(item.unitPrice),
          quantity: item.quantity,
          name: item.productName.slice(0, 50),
        })),
      };

      const midtransResponse = await midtrans.createTransaction(parameter);

      // C-2: persist correlation id + token idempotently.
      await prisma.order
        .update({
          where: { id: order.id },
          data: {
            midtransOrderId,
            midtransToken: midtransResponse.token,
          },
        })
        .catch(() => {
          /* non-fatal: token still returned to client */
        });

      return NextResponse.json({
        snapToken: midtransResponse.token,
        redirectUrl: midtransResponse.redirect_url,
      });
    } catch {
      // C-3 FIX: fail closed. Never return a fabricated MOCK_SNAP_ token —
      // that made the webhook correlation impossible and let orders appear
      // paid without a real transaction.
      return NextResponse.json(
        { error: "Failed to generate snap token" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error creating snap token:", error);
    return NextResponse.json(
      { error: "Failed to generate snap token" },
      { status: 500 },
    );
  }
}

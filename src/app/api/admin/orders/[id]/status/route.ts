import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getOrderById, registerLiveOrder } from "@/lib/admin/orders";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaffActor("orders:transition");
    const { id } = await params;
    const body = await request.json();

    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (body.status) order.status = body.status;
    if (body.paymentStatus) order.paymentStatus = body.paymentStatus;
    if (body.fulfillmentStatus) order.fulfillmentStatus = body.fulfillmentStatus;
    if (body.trackingNumber) {
      if (order.fulfillmentHistory && order.fulfillmentHistory.length > 0 && order.fulfillmentHistory[0]) {
        order.fulfillmentHistory[0].trackingNumber = body.trackingNumber;
      }
    }

    order.updatedAt = new Date().toISOString();

    // Update Prisma DB
    try {
      const prismaStatusMap: Record<string, "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"> = {
        pending: "PENDING_PAYMENT",
        processing: order.fulfillmentStatus === "shipped" ? "SHIPPED" : "PROCESSING",
        completed: "DELIVERED",
        cancelled: "CANCELLED",
        refunded: "REFUNDED",
      };

      const newStatus = prismaStatusMap[order.status] || "PROCESSING";

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: newStatus,
        },
      });

      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: newStatus,
          note: body.note || `Status pesanan diupdate: ${newStatus}`,
        },
      });
    } catch {
      // In-memory fallback
    }

    // Save to persistent file
    registerLiveOrder(order);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

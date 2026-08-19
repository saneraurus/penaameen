import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { auditStore } from "@/infrastructure/audit";
import { recordStaffAudit } from "@/application/audit/audit-store";
import { getOrderById } from "@/lib/admin/orders";
import { prisma } from "@/lib/prisma";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";
import { createResourceId } from "@/domain/common/identifiers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await requireStaffActor("orders:transition");
    const correlationId = createRequestCorrelationId(
      request.headers.get("x-request-id"),
    );
    const { id } = await params;
    const body = await request.json();

    const order = await getOrderById(id);
    if (!order) {
      await recordStaffAudit(auditStore, actor, {
        action: "order.status.failed",
        targetType: "order",
        targetId: createResourceId(id),
        outcome: "failed",
        correlationId,
        reason: "Order not found",
      });
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // H-1 FIX: persist a real tracking number when the admin provides one
    // (previously always 422'd). Fabrication is gone; only real resi saved.
    if (body.trackingNumber) {
      try {
        await prisma.order.update({
          where: { id },
          data: { trackingNumber: body.trackingNumber },
        });
        await recordStaffAudit(auditStore, actor, {
          action: "order.tracking.updated",
          targetType: "order",
          targetId: createResourceId(id),
          outcome: "succeeded",
          correlationId,
          after: { trackingNumber: body.trackingNumber },
        });
      } catch {
        // Non-fatal: status transition continues even if resi save fails.
      }
    }

    const before = { ...order };
    const changed: string[] = [];

    if (body.status && body.status !== order.status) {
      order.status = body.status;
      changed.push("status");
    }
    if (body.paymentStatus && body.paymentStatus !== order.paymentStatus) {
      order.paymentStatus = body.paymentStatus;
      changed.push("paymentStatus");
    }
    if (
      body.fulfillmentStatus &&
      body.fulfillmentStatus !== order.fulfillmentStatus
    ) {
      order.fulfillmentStatus = body.fulfillmentStatus;
      changed.push("fulfillmentStatus");
    }

    if (changed.length === 0) {
      return NextResponse.json({ success: true, order });
    }

    order.updatedAt = new Date().toISOString();

    // Update Prisma DB when available
    try {
      const prismaStatusMap: Record<
        string,
        | "PENDING_PAYMENT"
        | "PAID"
        | "PROCESSING"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED"
        | "REFUNDED"
      > = {
        pending: "PENDING_PAYMENT",
        processing: "PROCESSING",
        completed: "DELIVERED",
        cancelled: "CANCELLED",
        refunded: "REFUNDED",
      };

      const newStatus = prismaStatusMap[order.status] || "PROCESSING";

      await prisma.order.update({
        where: { id: order.id },
        data: { status: newStatus },
      });

      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: newStatus,
          note: body.note || `Status pesanan diupdate: ${newStatus}`,
        },
      });
    } catch {
      // DB unavailable - status change cannot be persisted
    }

    await recordStaffAudit(auditStore, actor, {
      action: "order.status",
      targetType: "order",
      targetId: createResourceId(id),
      outcome: "succeeded",
      correlationId,
      before: {
        status: before.status,
        paymentStatus: before.paymentStatus,
        fulfillmentStatus: before.fulfillmentStatus,
      },
      after: {
        status: order.status,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
      },
      reason: `Changed: ${changed.join(", ")}`,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

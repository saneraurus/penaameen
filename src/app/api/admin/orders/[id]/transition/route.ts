import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { auditStore } from "@/infrastructure/audit";
import { recordStaffAudit } from "@/application/audit/audit-store";
import {
  transitionOrder,
  getOrderById,
  type OrderTransition,
} from "@/lib/admin/orders";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";
import { createResourceId } from "@/domain/common/identifiers";
import { requireRequestOrigin } from "@/application/security/origin-guard";

const VALID_TRANSITIONS: OrderTransition[] = [
  "mark_paid",
  "mark_processing",
  "mark_completed",
  "cancel",
  "refund",
  "mark_fulfilled",
  "mark_shipped",
  "mark_delivered",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    requireRequestOrigin(request);
    const body = await request.json();
    const transition = body.transition as OrderTransition;
    const actor = await requireStaffActor(
      transition === "mark_paid" ? "payments:verify" : "orders:transition",
    );
    const correlationId = createRequestCorrelationId(
      request.headers.get("x-request-id"),
    );
    const { id } = await params;
    if (!VALID_TRANSITIONS.includes(transition)) {
      await recordStaffAudit(auditStore, actor, {
        action: "order.transition.denied",
        targetType: "order",
        targetId: createResourceId(id),
        outcome: "denied",
        correlationId,
        reason: `Invalid transition: ${String(transition)}`,
      });
      return NextResponse.json(
        { error: "Invalid transition" },
        { status: 400 },
      );
    }

    if (transition === "mark_paid" && !String(body.evidence || "").trim()) {
      return NextResponse.json(
        { error: "Bukti pembayaran wajib disertakan untuk verifikasi manual" },
        { status: 422 },
      );
    }

    const before = await getOrderById(id);
    const updated = await transitionOrder(id, transition);
    if (!updated) {
      await recordStaffAudit(auditStore, actor, {
        action: "order.transition.failed",
        targetType: "order",
        targetId: createResourceId(id),
        outcome: "failed",
        correlationId,
        reason: `Order not found or transition not allowed: ${transition}`,
      });
      return NextResponse.json(
        { error: "Order not found or transition not allowed" },
        { status: 404 },
      );
    }

    if (transition === "mark_paid" && body.evidence) {
      await recordStaffAudit(auditStore, actor, {
        action: "payment.manual_verification.evidence",
        targetType: "order",
        targetId: createResourceId(id),
        outcome: "succeeded",
        correlationId,
        reason: String(body.evidence).slice(0, 500),
      });
    }

    await recordStaffAudit(auditStore, actor, {
      action: "order.transition",
      targetType: "order",
      targetId: createResourceId(id),
      outcome: "succeeded",
      correlationId,
      before: { status: before?.status },
      after: { status: updated.status },
      reason: transition,
    });

    return NextResponse.json({ order: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

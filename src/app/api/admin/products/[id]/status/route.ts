import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { auditStore } from "@/infrastructure/audit";
import { recordStaffAudit } from "@/application/audit/audit-store";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";
import { createResourceId } from "@/domain/common/identifiers";
import { setProductStatus, getProductById } from "@/lib/admin/products";
import { updateProductInSheet } from "@/lib/admin/product-sheet-sync";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await requireStaffActor("catalog:write");
    const correlationId = createRequestCorrelationId(
      request.headers.get("x-request-id"),
    );
    const { id } = await params;
    const body = await request.json();
    const status = body.status as "published" | "draft" | "archived";

    if (!status || !["published", "draft", "archived"].includes(status)) {
      await recordStaffAudit(auditStore, actor, {
        action: "product.status.denied",
        targetType: "product",
        targetId: createResourceId(id),
        outcome: "denied",
        correlationId,
        reason: `Invalid status: ${String(status)}`,
      });
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const before = await getProductById(id);
    if (!before) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await updateProductInSheet(before, { status }, actor.email);
    const updated = await setProductStatus(id, status);
    if (!updated) {
      await recordStaffAudit(auditStore, actor, {
        action: "product.status.failed",
        targetType: "product",
        targetId: createResourceId(id),
        outcome: "failed",
        correlationId,
        reason: "Product not found",
      });
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await recordStaffAudit(auditStore, actor, {
      action: "product.status",
      targetType: "product",
      targetId: createResourceId(id),
      outcome: "succeeded",
      correlationId,
      before: { status: before?.status },
      after: { status: updated.status },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error setting product status:", error);
    return NextResponse.json(
      { error: "Failed to update product status" },
      { status: 500 },
    );
  }
}

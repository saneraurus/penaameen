import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { auditStore } from "@/infrastructure/audit";
import { recordStaffAudit } from "@/application/audit/audit-store";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";
import { createResourceId } from "@/domain/common/identifiers";
import {
  adjustStock,
  deleteStockProduct,
  updateStockProduct,
  isStockSheetConfigError,
} from "@/application/inventory/stock-service";
import {
  StockProductNotFoundError,
  StockSheetUnavailableError,
} from "@/domain/inventory/stock-sheet-port";
import { ZodError } from "zod";

async function handleWriteError(error: unknown): Promise<NextResponse> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: error.issues },
      { status: 400 },
    );
  }
  if (error instanceof StockProductNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  if (error instanceof StockSheetUnavailableError) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
  if (isStockSheetConfigError(error)) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
  console.error("Error mutating stock product:", error);
  return NextResponse.json(
    { error: "Failed to update stock product" },
    { status: 500 },
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ sku: string }> },
) {
  try {
    const actor = await requireStaffActor("inventory:write");
    const correlationId = createRequestCorrelationId(
      request.headers.get("x-request-id"),
    );
    const { sku } = await params;
    const body = await request.json();

    if (body.delta !== undefined && body.delta !== null) {
      const product = await adjustStock(
        sku,
        { delta: Number(body.delta), reason: body.reason },
        actor.email,
      );
      await recordStaffAudit(auditStore, actor, {
        action: "inventory.product.adjust",
        targetType: "product",
        targetId: createResourceId(product.sku),
        outcome: "succeeded",
        correlationId,
        after: {
          sku: product.sku,
          delta: Number(body.delta),
          stock: product.stock,
          reason: body.reason,
        },
      });
      return NextResponse.json({ success: true, product });
    }

    const product = await updateStockProduct(sku, body, actor.email);
    await recordStaffAudit(auditStore, actor, {
      action: "inventory.product.update",
      targetType: "product",
      targetId: createResourceId(product.sku),
      outcome: "succeeded",
      correlationId,
      after: { sku: product.sku, name: product.name, stock: product.stock },
    });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return handleWriteError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ sku: string }> },
) {
  try {
    const actor = await requireStaffActor("inventory:write");
    const correlationId = createRequestCorrelationId(
      request.headers.get("x-request-id"),
    );
    const { sku } = await params;
    const body = await request.json().catch(() => ({}));

    const result = await deleteStockProduct(sku, body, actor.email);

    await recordStaffAudit(auditStore, actor, {
      action: "inventory.product.delete",
      targetType: "product",
      targetId: createResourceId(result.sku),
      outcome: "succeeded",
      correlationId,
      after: { sku: result.sku, name: result.name, reason: body.reason },
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return handleWriteError(error);
  }
}

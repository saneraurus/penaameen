import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { requireRequestOrigin } from "@/application/security/origin-guard";
import { auditStore } from "@/infrastructure/audit";
import { recordStaffAudit } from "@/application/audit/audit-store";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";
import { createResourceId } from "@/domain/common/identifiers";
import {
  addStockProduct,
  getStockSheetHealth,
  listStockProducts,
  isStockSheetConfigError,
} from "@/application/inventory/stock-service";
import {
  StockProductConflictError,
  StockSheetUnavailableError,
} from "@/domain/inventory/stock-sheet-port";
import { ZodError } from "zod";

export async function GET() {
  try {
    await requireStaffActor("inventory:read");
    const health = await getStockSheetHealth();
    const products = health.configured ? await listStockProducts() : [];

    return NextResponse.json({ products, health });
  } catch (error) {
    console.error("Error fetching stock sheet products:", error);
    return NextResponse.json(
      { error: "Unauthorized or failed to fetch stock products" },
      { status: 401 },
    );
  }
}

export async function POST(request: Request) {
  try {
    requireRequestOrigin(request);
    const actor = await requireStaffActor("inventory:write");
    const correlationId = createRequestCorrelationId(
      request.headers.get("x-request-id"),
    );
    const body = await request.json();

    const product = await addStockProduct(body, actor.email);

    await recordStaffAudit(auditStore, actor, {
      action: "inventory.product.create",
      targetType: "product",
      targetId: createResourceId(product.sku),
      outcome: "succeeded",
      correlationId,
      after: { sku: product.sku, name: product.name, stock: product.stock },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validasi gagal", issues: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof StockProductConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof StockSheetUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (isStockSheetConfigError(error)) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("Error creating stock product:", error);
    return NextResponse.json(
      { error: "Failed to create stock product" },
      { status: 500 },
    );
  }
}

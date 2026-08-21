import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { auditStore } from "@/infrastructure/audit";
import { recordStaffAudit } from "@/application/audit/audit-store";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";
import { createResourceId } from "@/domain/common/identifiers";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/admin/products";
import {
  updateProductInSheet,
  deleteProductInSheet,
} from "@/lib/admin/product-sheet-sync";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireStaffActor("catalog:read");
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error getting product:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

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

    const before = await getProductById(id);
    if (!before) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await updateProductInSheet(
      before,
      {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.slug !== undefined ? { slug: body.slug } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.description !== undefined
          ? { description: body.description }
          : {}),
        ...(body.price !== undefined ? { price: Number(body.price) } : {}),
        ...(body.salePrice !== undefined
          ? { salePrice: body.salePrice ? Number(body.salePrice) : undefined }
          : {}),
        ...(body.stockQuantity !== undefined
          ? { stockQuantity: Number(body.stockQuantity) }
          : {}),
        ...(body.image !== undefined ? { image: body.image } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.sku !== undefined ? { sku: body.sku } : {}),
      },
      actor.email,
    );
    const updated = await updateProduct(id, {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.description !== undefined
        ? { description: body.description }
        : {}),
      ...(body.shortDescription !== undefined
        ? { shortDescription: body.shortDescription }
        : {}),
      ...(body.price !== undefined ? { price: Number(body.price) } : {}),
      ...(body.salePrice !== undefined
        ? { salePrice: body.salePrice ? Number(body.salePrice) : undefined }
        : {}),
      ...(body.stockQuantity !== undefined
        ? { stockQuantity: Number(body.stockQuantity) }
        : {}),
      ...(body.image !== undefined ? { image: body.image } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.sku !== undefined ? { sku: body.sku } : {}),
      ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),
      ...(body.seoDescription !== undefined
        ? { seoDescription: body.seoDescription }
        : {}),
    });

    if (!updated) {
      await recordStaffAudit(auditStore, actor, {
        action: "product.update.failed",
        targetType: "product",
        targetId: createResourceId(id),
        outcome: "failed",
        correlationId,
        reason: "Product not found",
      });
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await recordStaffAudit(auditStore, actor, {
      action: "product.update",
      targetType: "product",
      targetId: createResourceId(id),
      outcome: "succeeded",
      correlationId,
      before: before
        ? {
            name: before.name,
            slug: before.slug,
            price: before.price,
            status: before.status,
          }
        : undefined,
      after: {
        name: updated.name,
        slug: updated.slug,
        price: updated.price,
        status: updated.status,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await requireStaffActor("catalog:write");
    const correlationId = createRequestCorrelationId(
      request.headers.get("x-request-id"),
    );
    const { id } = await params;
    const before = await getProductById(id);
    if (!before) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await deleteProductInSheet(before, actor.email);
    const ok = await deleteProduct(id);
    if (!ok) {
      await recordStaffAudit(auditStore, actor, {
        action: "product.delete.failed",
        targetType: "product",
        targetId: createResourceId(id),
        outcome: "failed",
        correlationId,
        reason: "Product not found",
      });
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await recordStaffAudit(auditStore, actor, {
      action: "product.delete",
      targetType: "product",
      targetId: createResourceId(id),
      outcome: "succeeded",
      correlationId,
      before: before ? { name: before.name, slug: before.slug } : undefined,
      reason: "Destructive action; no hard-delete of order history affected",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}

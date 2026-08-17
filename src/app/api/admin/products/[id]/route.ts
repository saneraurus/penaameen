import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/admin/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaffActor("catalog:write");
    const { id } = await params;
    const body = await request.json();

    const updated = await updateProduct(id, {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.shortDescription !== undefined ? { shortDescription: body.shortDescription } : {}),
      ...(body.price !== undefined ? { price: Number(body.price) } : {}),
      ...(body.salePrice !== undefined ? { salePrice: body.salePrice ? Number(body.salePrice) : undefined } : {}),
      ...(body.stockQuantity !== undefined ? { stockQuantity: Number(body.stockQuantity) } : {}),
      ...(body.image !== undefined ? { image: body.image } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.sku !== undefined ? { sku: body.sku } : {}),
      ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),
      ...(body.seoDescription !== undefined ? { seoDescription: body.seoDescription } : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaffActor("catalog:write");
    const { id } = await params;
    const ok = await deleteProduct(id);
    if (!ok) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

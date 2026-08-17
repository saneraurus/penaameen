import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProductBySlug } from "@/lib/admin/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: { category: true },
    });

    if (product) {
      return NextResponse.json({
        product: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category.name,
          description: product.description,
          price: Number(product.price),
          image: product.image,
          stock: product.stock,
        },
      });
    }
  } catch (error) {
    console.warn(
      `Database not available for product slug ${slug}, checking persistent live products:`,
      error,
    );
  }

  const liveProduct = await getProductBySlug(slug);
  if (liveProduct && liveProduct.status !== "archived") {
    return NextResponse.json({
      product: {
        id: liveProduct.id,
        slug: liveProduct.slug,
        name: liveProduct.name,
        category: liveProduct.category,
        description: liveProduct.description,
        price: liveProduct.price,
        image: liveProduct.image,
        stock: liveProduct.stockQuantity ?? 50,
      },
    });
  }

  return NextResponse.json({ error: "Product not found" }, { status: 404 });
}

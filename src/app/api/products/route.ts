import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadFileProducts } from "@/lib/admin/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { name: "asc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      return NextResponse.json({
        products: dbProducts.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: p.category.name,
          description: p.description,
          price: Number(p.price),
          image: p.image,
          stock: p.stock,
        })),
      });
    }
  } catch (error) {
    console.warn("Database query failed, using persistent live products file:", error);
  }

  // Load from persistent products store (published only)
  const fileProducts = loadFileProducts();
  const publishedProducts = fileProducts.filter((p) => p.status === "published");

  return NextResponse.json({
    products: publishedProducts.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      image: p.image,
      stock: p.stockQuantity ?? 50,
    })),
  });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products as catalogProducts } from "@/data/products";
import {
  getSheetCatalogProducts,
  mapSheetProductToPublic,
} from "@/lib/inventory/sheets-catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sheetProducts = await getSheetCatalogProducts();
    const published = (sheetProducts ?? [])
      .filter((p) => p.status === "published")
      .map(mapSheetProductToPublic);
    if (published.length > 0) {
      return NextResponse.json({ products: published });
    }
  } catch (error) {
    console.warn("Stock sheet read failed, falling back to database:", error);
  }

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
    console.warn(
      "Database query failed, using persistent live products file:",
      error,
    );
  }

  // Fallback: static catalog (source of truth until DB is populated)
  return NextResponse.json({
    products: catalogProducts.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      image: p.image,
      stock: 0,
    })),
  });
}

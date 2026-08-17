import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getProducts, createProduct } from "@/lib/admin/products";

export async function GET(request: Request) {
  try {
    await requireStaffActor("catalog:read");
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("perPage")) || 50;
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;

    const result = await getProducts({
      page,
      perPage,
      search,
      category,
      status,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Unauthorized or failed to fetch products" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireStaffActor("catalog:write");
    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json({ error: "Nama produk dan harga wajib diisi" }, { status: 400 });
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newProduct = await createProduct({
      name: body.name,
      slug,
      category: body.category || "Umum",
      description: body.description || "",
      shortDescription: body.shortDescription || "",
      price: Number(body.price),
      salePrice: body.salePrice ? Number(body.salePrice) : undefined,
      stockQuantity: Number(body.stockQuantity) || 0,
      image: body.image || "/images/penaameen/products/home-learning.jpg",
      status: body.status || "published",
      sku: body.sku,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

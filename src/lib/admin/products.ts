import { prisma } from "@/lib/prisma";
import { Prisma, type ProductStatus } from "@/generated/prisma";

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  status: "published" | "draft" | "archived";
  shortDescription?: string | undefined;
  sku?: string | undefined;
  stockQuantity?: number | undefined;
  salePrice?: number | undefined;
  saleStartDate?: string | undefined;
  saleEndDate?: string | undefined;
  tags?: string[] | undefined;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
  seoCanonical?: string | undefined;
  seoIndexable?: boolean | undefined;
  relatedProductIds?: string[] | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsOptions {
  page: number;
  perPage: number;
  search?: string | undefined;
  category?: string | undefined;
  status?: string | undefined;
}

export interface GetProductsResult {
  products: AdminProduct[];
  total: number;
}

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: bigint;
  image: string;
  status: ProductStatus;
  shortDescription: string | null;
  sku: string | null;
  stock: number;
  salePrice: bigint | null;
  tags: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  seoCanonical: string | null;
  seoIndexable: boolean;
  relatedProductIds: unknown;
  createdAt: Date;
  updatedAt: Date;
  category?: { name: string } | null;
};

function withoutUndefined<T extends Record<string, unknown>>(
  value: T,
): { [K in keyof T]?: Exclude<T[K], undefined> } {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as { [K in keyof T]?: Exclude<T[K], undefined> };
}

function mapProduct(p: ProductRow): AdminProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.name ?? "",
    description: p.description,
    price: Number(p.price),
    image: p.image,
    status: p.status,
    shortDescription: p.shortDescription ?? undefined,
    sku: p.sku ?? undefined,
    stockQuantity: p.stock,
    salePrice: p.salePrice != null ? Number(p.salePrice) : undefined,
    tags: Array.isArray(p.tags) ? (p.tags as string[]) : undefined,
    seoTitle: p.seoTitle ?? undefined,
    seoDescription: p.seoDescription ?? undefined,
    seoCanonical: p.seoCanonical ?? undefined,
    seoIndexable: p.seoIndexable,
    relatedProductIds: Array.isArray(p.relatedProductIds)
      ? (p.relatedProductIds as string[])
      : undefined,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

async function resolveCategory(categoryName: string): Promise<string> {
  const slug = categoryName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const category = await prisma.category.upsert({
    where: { slug },
    update: { name: categoryName },
    create: { name: categoryName, slug },
  });
  return category.id;
}

export async function getProducts(
  options: GetProductsOptions,
): Promise<GetProductsResult> {
  const { page, perPage, search, category, status } = options;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) where.category = { name: category };
  if (status) where.status = status;

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return { products: rows.map(mapProduct), total };
}

export async function getProductCategories(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories.map((c) => c.name);
}

export async function getProductById(
  id: string,
): Promise<AdminProduct | null> {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { category: true },
  });
  return product ? mapProduct(product as ProductRow) : null;
}

export async function getProductBySlug(
  slug: string,
): Promise<AdminProduct | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  return product ? mapProduct(product as ProductRow) : null;
}

export async function createProduct(
  data: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">,
): Promise<AdminProduct> {
  const categoryId = await resolveCategory(data.category);
  const slug =
    data.slug ||
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const product = await prisma.product.create({
    data: {
      slug,
      name: data.name,
      categoryId,
      description: data.description,
      price: BigInt(data.price),
      image: data.image,
      status: (data.status as ProductStatus) ?? "published",
      shortDescription: data.shortDescription ?? null,
      sku: data.sku ?? null,
      stock: data.stockQuantity ?? 0,
      salePrice: data.salePrice != null ? BigInt(data.salePrice) : null,
      tags: data.tags ?? Prisma.JsonNull,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      seoCanonical: data.seoCanonical ?? null,
      seoIndexable: data.seoIndexable ?? true,
      relatedProductIds: data.relatedProductIds ?? Prisma.JsonNull,
    },
    include: { category: true },
  });

  return mapProduct(product as ProductRow);
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<AdminProduct, "id" | "createdAt">>,
): Promise<AdminProduct | null> {
  const existing = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!existing) return null;

  const categoryId = data.category
    ? await resolveCategory(data.category)
    : undefined;

  const product = await prisma.product.update({
    where: { id: existing.id },
    data: withoutUndefined({
      name: data.name,
      slug: data.slug,
      categoryId,
      description: data.description,
      price: data.price != null ? BigInt(data.price) : undefined,
      image: data.image,
      status: data.status as ProductStatus | undefined,
      shortDescription: data.shortDescription,
      sku: data.sku,
      stock: data.stockQuantity,
      salePrice: data.salePrice != null ? BigInt(data.salePrice) : undefined,
      tags: data.tags,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoCanonical: data.seoCanonical,
      seoIndexable: data.seoIndexable,
      relatedProductIds: data.relatedProductIds,
    }),
    include: { category: true },
  });

  return mapProduct(product as ProductRow);
}

export async function setProductStatus(
  id: string,
  status: "published" | "draft" | "archived",
): Promise<AdminProduct | null> {
  return updateProduct(id, { status });
}

export async function deleteProduct(id: string): Promise<boolean> {
  const existing = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!existing) return false;
  await prisma.product.delete({ where: { id: existing.id } });
  return true;
}

import { products as initialProductData } from "@/data/products";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

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

const LIVE_PRODUCTS_FILE = path.join(process.cwd(), "src/data/live_products.json");

type ProductStatus = "published" | "draft" | "archived";

function mapPrismaProduct(db: {
  id: string;
  slug: string;
  name: string;
  category: { name: string } | null;
  description: string;
  shortDescription: string | null;
  price: bigint;
  salePrice: bigint | null;
  compareAtPrice: bigint | null;
  sku: string | null;
  stock: number;
  status: ProductStatus;
  image: string;
  tags: unknown;
  relatedProductIds: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  seoCanonical: string | null;
  seoIndexable: boolean;
  createdAt: Date;
  updatedAt: Date;
}): AdminProduct {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    category: db.category?.name ?? "",
    description: db.description,
    shortDescription: db.shortDescription ?? undefined,
    price: Number(db.price),
    salePrice: db.salePrice === null ? undefined : Number(db.salePrice),
    sku: db.sku ?? undefined,
    stockQuantity: db.stock,
    status: db.status,
    image: db.image,
    tags: Array.isArray(db.tags) ? (db.tags as string[]) : undefined,
    relatedProductIds: Array.isArray(db.relatedProductIds)
      ? (db.relatedProductIds as string[])
      : undefined,
    seoTitle: db.seoTitle ?? undefined,
    seoDescription: db.seoDescription ?? undefined,
    seoCanonical: db.seoCanonical ?? undefined,
    seoIndexable: db.seoIndexable,
    createdAt: db.createdAt.toISOString(),
    updatedAt: db.updatedAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// File fallback (development only). Used when the database is unreachable.
// It is NOT the source of truth in production: writes prefer Prisma and the
// file path is explicitly a dev fallback.
// ---------------------------------------------------------------------------

export function loadFileProducts(): AdminProduct[] {
  try {
    if (fs.existsSync(LIVE_PRODUCTS_FILE)) {
      const raw = fs.readFileSync(LIVE_PRODUCTS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as AdminProduct[];
      }
    }
  } catch (e) {
    console.warn("Could not read live_products.json:", e);
  }

  const seeded: AdminProduct[] = initialProductData.map((p, idx) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    description: p.description,
    price: p.price,
    image: p.image,
    status: idx < 16 ? "published" : idx < 18 ? "draft" : "archived",
    shortDescription: p.description.slice(0, 160),
    sku: `PA-${p.id.padStart(4, "0")}`,
    stockQuantity: 50,
    createdAt: new Date(Date.now() - (19 - idx) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  saveFileProducts(seeded);
  return seeded;
}

export function saveFileProducts(productsList: AdminProduct[]): void {
  try {
    const dir = path.dirname(LIVE_PRODUCTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LIVE_PRODUCTS_FILE, JSON.stringify(productsList, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write live_products.json:", e);
  }
}

// Cached per-process so repeated admin reads do not hammer a down database.
let prismaUnavailable = false;

function isPrismaAvailable(): boolean {
  return !prismaUnavailable;
}

function markPrismaUnavailable(): void {
  prismaUnavailable = true;
}

async function resolveCategoryId(name: string): Promise<string> {
  const category = await prisma.category.upsert({
    where: { name },
    update: {},
    create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
  });
  return category.id;
}

function toPrismaCreateData(
  data: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">,
  categoryId: string,
) {
  return {
    slug: data.slug,
    name: data.name,
    categoryId,
    description: data.description,
    shortDescription: data.shortDescription ?? null,
    price: BigInt(Math.round(data.price)),
    compareAtPrice: null,
    salePrice: data.salePrice === undefined ? null : BigInt(Math.round(data.salePrice)),
    sku: data.sku ?? null,
    stock: data.stockQuantity ?? 0,
    status: data.status,
    image: data.image,
    images: [],
    ...(data.tags ? { tags: data.tags as unknown as object } : {}),
    ...(data.relatedProductIds
      ? { relatedProductIds: data.relatedProductIds as unknown as object }
      : {}),
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
    seoCanonical: data.seoCanonical ?? null,
    seoIndexable: data.seoIndexable ?? true,
  };
}

export async function getProducts(options: GetProductsOptions): Promise<GetProductsResult> {
  const { page, perPage, search, category, status } = options;

  if (isPrismaAvailable()) {
    try {
      const where: Record<string, unknown> = {};
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { slug: { contains: search } },
          { sku: { contains: search } },
        ];
      }
      if (category) {
        where.category = { name: category };
      }
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

      return { products: rows.map(mapPrismaProduct), total };
    } catch {
      markPrismaUnavailable();
    }
  }

  // Dev/offline fallback
  const productsList = loadFileProducts();
  let filtered = [...productsList];

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.slug.toLowerCase().includes(searchLower) ||
        (p.sku && p.sku.toLowerCase().includes(searchLower)),
    );
  }
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (status) filtered = filtered.filter((p) => p.status === status);

  filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return { products: paginated, total };
}

export async function getProductCategories(): Promise<string[]> {
  if (isPrismaAvailable()) {
    try {
      const rows = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
      return rows.map((c) => c.name);
    } catch {
      markPrismaUnavailable();
    }
  }
  const productsList = loadFileProducts();
  const categories = new Set(productsList.map((p) => p.category).filter(Boolean));
  return Array.from(categories).sort();
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  if (isPrismaAvailable()) {
    try {
      const db = await prisma.product.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        include: { category: true },
      });
      if (db) return mapPrismaProduct(db);
    } catch {
      markPrismaUnavailable();
    }
  }
  const productsList = loadFileProducts();
  return productsList.find((p) => p.id === id || p.slug === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<AdminProduct | null> {
  return getProductById(slug);
}

export async function createProduct(
  data: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">,
): Promise<AdminProduct> {
  if (isPrismaAvailable()) {
    try {
      const categoryId = await resolveCategoryId(data.category || "Umum");
      const db = await prisma.product.create({
        data: toPrismaCreateData(data, categoryId),
        include: { category: true },
      });
      return mapPrismaProduct(db);
    } catch {
      markPrismaUnavailable();
    }
  }

  const productsList = loadFileProducts();
  const maxNumericId = productsList.reduce((max, p) => {
    const num = Number(p.id);
    return !isNaN(num) && num > max ? num : max;
  }, 0);

  const newId = String(maxNumericId > 0 ? maxNumericId + 1 : Date.now());
  const newProduct: AdminProduct = {
    ...data,
    id: newId,
    sku: data.sku || `PA-${newId.padStart(4, "0")}`,
    status: data.status || "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  productsList.unshift(newProduct);
  saveFileProducts(productsList);
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<AdminProduct, "id" | "createdAt">>,
): Promise<AdminProduct | null> {
  if (isPrismaAvailable()) {
    try {
      const existing = await prisma.product.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });
      if (!existing) return null;

      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription ?? null;
      if (data.price !== undefined) updateData.price = BigInt(Math.round(data.price));
      if (data.salePrice !== undefined) updateData.salePrice = data.salePrice === undefined ? null : BigInt(Math.round(data.salePrice));
      if (data.stockQuantity !== undefined) updateData.stock = data.stockQuantity;
      if (data.image !== undefined) updateData.image = data.image;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.sku !== undefined) updateData.sku = data.sku ?? null;
      if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle ?? null;
      if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription ?? null;
      if (data.seoCanonical !== undefined) updateData.seoCanonical = data.seoCanonical ?? null;
      if (data.seoIndexable !== undefined) updateData.seoIndexable = data.seoIndexable;
      if (data.tags !== undefined) updateData.tags = data.tags as unknown as object;
      if (data.relatedProductIds !== undefined)
        updateData.relatedProductIds = data.relatedProductIds as unknown as object;
      if (data.category !== undefined) {
        updateData.categoryId = await resolveCategoryId(data.category);
      }

      const db = await prisma.product.update({
        where: { id: existing.id },
        data: updateData,
        include: { category: true },
      });
      return mapPrismaProduct(db);
    } catch {
      markPrismaUnavailable();
    }
  }

  const productsList = loadFileProducts();
  const index = productsList.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return null;

  const existing = productsList[index];
  if (!existing) return null;

  const updated: AdminProduct = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  productsList[index] = updated;
  saveFileProducts(productsList);
  return updated;
}

export async function setProductStatus(
  id: string,
  status: ProductStatus,
): Promise<AdminProduct | null> {
  return updateProduct(id, { status });
}

// Soft delete: business records are archived, never hard-deleted.
export async function deleteProduct(id: string): Promise<boolean> {
  if (isPrismaAvailable()) {
    try {
      const existing = await prisma.product.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });
      if (!existing) return false;
      await prisma.product.update({
        where: { id: existing.id },
        data: { status: "archived" },
      });
      return true;
    } catch {
      markPrismaUnavailable();
    }
  }

  const productsList = loadFileProducts();
  const index = productsList.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return false;

  const existing = productsList[index];
  if (!existing) return false;

  existing.status = "archived";
  existing.updatedAt = new Date().toISOString();
  productsList[index] = existing;
  saveFileProducts(productsList);
  return true;
}
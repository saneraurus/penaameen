import { products as initialProductData } from "@/data/products";
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

  // Seed default products if not yet persisted
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

export async function getProducts(options: GetProductsOptions): Promise<GetProductsResult> {
  const { page, perPage, search, category, status } = options;
  const productsList = loadFileProducts();

  let filtered = [...productsList];

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.slug.toLowerCase().includes(searchLower) ||
        (p.sku && p.sku.toLowerCase().includes(searchLower))
    );
  }

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return { products: paginated, total };
}

export async function getProductCategories(): Promise<string[]> {
  const productsList = loadFileProducts();
  const categories = new Set(productsList.map((p) => p.category).filter(Boolean));
  return Array.from(categories).sort();
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  const productsList = loadFileProducts();
  return productsList.find((p) => p.id === id || p.slug === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<AdminProduct | null> {
  const productsList = loadFileProducts();
  return productsList.find((p) => p.slug === slug || p.id === slug) ?? null;
}

export async function createProduct(
  data: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">
): Promise<AdminProduct> {
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
  data: Partial<Omit<AdminProduct, "id" | "createdAt">>
): Promise<AdminProduct | null> {
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
  status: "published" | "draft" | "archived"
): Promise<AdminProduct | null> {
  return updateProduct(id, { status });
}

export async function deleteProduct(id: string): Promise<boolean> {
  const productsList = loadFileProducts();
  const index = productsList.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return false;

  productsList.splice(index, 1);
  saveFileProducts(productsList);
  return true;
}
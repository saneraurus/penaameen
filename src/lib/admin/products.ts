import { products as productData } from "@/data/products";

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
  search?: string;
  category?: string;
  status?: string;
}

export interface GetProductsResult {
  products: AdminProduct[];
  total: number;
}

const STATUS_MAP: Record<string, "published" | "draft" | "archived"> = {
  "1": "published",
  "2": "published",
  "3": "published",
  "4": "published",
  "5": "published",
  "6": "published",
  "7": "published",
  "8": "published",
  "9": "published",
  "10": "published",
  "11": "published",
  "12": "published",
  "13": "published",
  "14": "published",
  "15": "draft",
  "16": "draft",
  "17": "draft",
  "18": "archived",
  "19": "archived",
};

const MOCK_ADMIN_PRODUCTS: AdminProduct[] = productData.map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  description: p.description,
  price: p.price,
  image: p.image,
  status: STATUS_MAP[p.id] ?? "published",
  shortDescription: p.description.slice(0, 160),
  sku: `PA-${p.id.padStart(4, "0")}`,
  stockQuantity: Math.floor(Math.random() * 100) + 1,
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export async function getProducts(options: GetProductsOptions): Promise<GetProductsResult> {
  const { page, perPage, search, category, status } = options;

  let filtered = [...MOCK_ADMIN_PRODUCTS];

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.slug.toLowerCase().includes(searchLower) ||
        p.sku?.toLowerCase().includes(searchLower)
    );
  }

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return { products: paginated, total };
}

export async function getProductCategories(): Promise<string[]> {
  const categories = new Set(MOCK_ADMIN_PRODUCTS.map((p) => p.category));
  return Array.from(categories).sort();
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  return MOCK_ADMIN_PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function createProduct(
  data: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">
): Promise<AdminProduct> {
  const newProduct: AdminProduct = {
    ...data,
    id: String(Math.max(...MOCK_ADMIN_PRODUCTS.map((p) => Number(p.id))) + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_ADMIN_PRODUCTS.push(newProduct);
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<AdminProduct, "id" | "createdAt">>
): Promise<AdminProduct | null> {
  const index = MOCK_ADMIN_PRODUCTS.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = MOCK_ADMIN_PRODUCTS[index];
  if (!existing) return null;

  const updated: AdminProduct = {
    id: existing.id,
    slug: data.slug ?? existing.slug,
    name: data.name ?? existing.name,
    category: data.category ?? existing.category,
    description: data.description ?? existing.description,
    price: data.price ?? existing.price,
    image: data.image ?? existing.image,
    status: data.status ?? existing.status,
    shortDescription: data.shortDescription ?? existing.shortDescription,
    sku: data.sku ?? existing.sku,
    stockQuantity: data.stockQuantity ?? existing.stockQuantity,
    salePrice: data.salePrice ?? existing.salePrice,
    saleStartDate: data.saleStartDate ?? existing.saleStartDate,
    saleEndDate: data.saleEndDate ?? existing.saleEndDate,
    tags: data.tags ?? existing.tags,
    seoTitle: data.seoTitle ?? existing.seoTitle,
    seoDescription: data.seoDescription ?? existing.seoDescription,
    seoCanonical: data.seoCanonical ?? existing.seoCanonical,
    seoIndexable: data.seoIndexable ?? existing.seoIndexable,
    relatedProductIds: data.relatedProductIds ?? existing.relatedProductIds,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  MOCK_ADMIN_PRODUCTS[index] = updated;
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const index = MOCK_ADMIN_PRODUCTS.findIndex((p) => p.id === id);
  if (index === -1) return false;
  MOCK_ADMIN_PRODUCTS.splice(index, 1);
  return true;
}
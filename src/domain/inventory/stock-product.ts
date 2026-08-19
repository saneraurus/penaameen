import { z } from "zod";

export const STOCK_PRODUCT_STATUSES = [
  "published",
  "draft",
  "archived",
] as const;

export type StockProductStatus = (typeof STOCK_PRODUCT_STATUSES)[number];

export const stockProductSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "SKU wajib diisi")
    .max(64, "SKU maksimal 64 karakter")
    .regex(/^[A-Za-z0-9._-]+$/, "SKU hanya boleh huruf, angka, titik, strip"),
  name: z.string().trim().min(1, "Nama produk wajib diisi").max(200),
  category: z.string().trim().min(1, "Kategori wajib diisi").max(100),
  price: z.coerce.number().int().min(0, "Harga tidak boleh negatif"),
  salePrice: z.coerce
    .number()
    .int()
    .min(0, "Harga jual tidak boleh negatif")
    .optional(),
  stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
  status: z.enum(STOCK_PRODUCT_STATUSES).default("published"),
  slug: z.string().trim().max(200).optional(),
  description: z.string().trim().max(5000).default(""),
  image: z.string().trim().max(1000).default(""),
  tags: z.string().trim().max(500).default(""),
  updatedAt: z
    .string()
    .trim()
    .default(() => new Date().toISOString()),
});

export type StockProductInput = z.input<typeof stockProductSchema>;

export type StockProduct = z.output<typeof stockProductSchema>;

export const stockProductUpdateSchema = stockProductSchema.partial();

export type StockProductUpdateInput = z.input<typeof stockProductUpdateSchema>;

export const stockAdjustSchema = z.object({
  delta: z
    .number()
    .int()
    .refine((value) => value !== 0, "Delta tidak boleh 0"),
  reason: z.string().trim().min(1, "Alasan wajib diisi").max(500),
});

export type StockAdjustInput = z.input<typeof stockAdjustSchema>;

export const stockDeleteSchema = z.object({
  reason: z.string().trim().min(1, "Alasan wajib diisi").max(500),
});

export type StockDeleteInput = z.input<typeof stockDeleteSchema>;

export function normalizeSku(value: string): string {
  return value.trim().toUpperCase();
}

export function slugifyName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

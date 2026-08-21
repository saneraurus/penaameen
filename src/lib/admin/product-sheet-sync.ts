import {
  addStockProduct,
  deleteStockProduct,
  updateStockProduct,
} from "@/application/inventory/stock-service";
import type { AdminProduct } from "@/lib/admin/products";
import {
  normalizeSku,
  type StockProduct,
} from "@/domain/inventory/stock-product";
import { getStockSheetAdapter } from "@/infrastructure/sheets/stock-sheet-adapter";

export type CatalogProductInput = {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  salePrice?: number | undefined;
  stockQuantity: number;
  image: string;
  status: "published" | "draft" | "archived";
  sku?: string | undefined;
  tags?: string[] | undefined;
};

function nextSku(products: StockProduct[]): string {
  const used = new Set(products.map((product) => normalizeSku(product.sku)));
  let number = 1;
  while (used.has(`PENA-${String(number).padStart(3, "0")}`)) number += 1;
  return `PENA-${String(number).padStart(3, "0")}`;
}

async function findSheetProduct(product: AdminProduct): Promise<StockProduct> {
  const sheetProducts = await getStockSheetAdapter().readProducts();
  const match = sheetProducts.find(
    (item) =>
      (product.sku && normalizeSku(item.sku) === normalizeSku(product.sku)) ||
      item.slug === product.slug,
  );
  if (!match) {
    throw new Error(
      `Produk "${product.name}" belum memiliki baris valid di Google Sheets`,
    );
  }
  return match;
}

export async function createProductInSheet(
  input: CatalogProductInput,
  actor: string,
): Promise<StockProduct> {
  const adapter = getStockSheetAdapter();
  const sku = input.sku?.trim() || nextSku(await adapter.readProducts());
  return addStockProduct(
    {
      sku,
      name: input.name,
      category: input.category,
      price: input.price,
      salePrice: input.salePrice,
      stock: input.stockQuantity,
      status: input.status,
      slug: input.slug,
      description: input.description,
      image: input.image,
      tags: input.tags?.join(", ") ?? "",
    },
    actor,
    adapter,
  );
}

export async function updateProductInSheet(
  current: AdminProduct,
  input: Partial<CatalogProductInput>,
  actor: string,
): Promise<StockProduct> {
  const existing = await findSheetProduct(current);
  return updateStockProduct(
    existing.sku,
    {
      ...(input.sku !== undefined ? { sku: input.sku } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
      ...(input.salePrice !== undefined ? { salePrice: input.salePrice } : {}),
      ...(input.stockQuantity !== undefined
        ? { stock: input.stockQuantity }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.image !== undefined ? { image: input.image } : {}),
      ...(input.tags !== undefined ? { tags: input.tags.join(", ") } : {}),
    },
    actor,
    getStockSheetAdapter(),
  );
}

export async function deleteProductInSheet(
  current: AdminProduct,
  actor: string,
): Promise<void> {
  const existing = await findSheetProduct(current);
  await deleteStockProduct(
    existing.sku,
    { reason: "Produk dihapus dari katalog admin" },
    actor,
    getStockSheetAdapter(),
  );
}

import { revalidateTag } from "next/cache";
import {
  normalizeSku,
  slugifyName,
  stockAdjustSchema,
  stockDeleteSchema,
  stockProductSchema,
  stockProductUpdateSchema,
  type StockAdjustInput,
  type StockDeleteInput,
  type StockProduct,
  type StockProductInput,
  type StockProductUpdateInput,
} from "@/domain/inventory/stock-product";
import type { StockMovement } from "@/domain/inventory/stock-movement";
import {
  StockProductConflictError,
  StockProductNotFoundError,
  type StockSheetHealth,
  type StockSheetPort,
} from "@/domain/inventory/stock-sheet-port";
import {
  isSheetsConfigured,
  SheetsConfigError,
} from "@/infrastructure/sheets/sheets-config";
import { getStockSheetAdapter } from "@/infrastructure/sheets/stock-sheet-adapter";

export const STOCK_SHEET_CACHE_TAG = "stock-sheet";

export function invalidateStockSheetCache(): void {
  revalidateTag(STOCK_SHEET_CACHE_TAG, "max");
}

export async function getStockSheetHealth(): Promise<StockSheetHealth> {
  if (!isSheetsConfigured()) {
    return {
      configured: false,
      connected: false,
      spreadsheetId: null,
      productSheetName: null,
      movementSheetName: null,
      error: null,
    };
  }
  return getStockSheetAdapter().health();
}

export async function listStockProducts(
  adapter: StockSheetPort = getStockSheetAdapter(),
): Promise<StockProduct[]> {
  return adapter.readProducts();
}

export async function addStockProduct(
  input: StockProductInput,
  actor: string = "system",
  adapter: StockSheetPort = getStockSheetAdapter(),
): Promise<StockProduct> {
  const parsed = stockProductSchema.parse(input);
  const product: StockProduct = {
    ...parsed,
    sku: normalizeSku(parsed.sku),
    slug: parsed.slug || slugifyName(parsed.name),
    updatedAt: new Date().toISOString(),
  };

  await adapter.ensureSchema();
  await adapter.appendProduct(product);
  await adapter.recordMovement({
    time: product.updatedAt,
    sku: product.sku,
    name: product.name,
    delta: product.stock,
    stockAfter: product.stock,
    type: "CREATED",
    reason: "Produk baru ditambahkan dari admin",
    by: actor,
    source: "admin",
  });
  invalidateStockSheetCache();
  return product;
}

export async function updateStockProduct(
  sku: string,
  input: StockProductUpdateInput,
  actor: string = "system",
  adapter: StockSheetPort = getStockSheetAdapter(),
): Promise<StockProduct> {
  const parsed = stockProductUpdateSchema.parse(input);
  const products = await adapter.readProducts();
  const normalized = normalizeSku(sku);
  const existing = products.find((p) => normalizeSku(p.sku) === normalized);
  if (!existing) {
    throw new StockProductNotFoundError(sku);
  }

  const merged = stockProductSchema.parse({
    ...existing,
    ...parsed,
    sku: parsed.sku ? normalizeSku(parsed.sku) : existing.sku,
    slug:
      parsed.slug ?? (parsed.name ? slugifyName(parsed.name) : existing.slug),
    updatedAt: new Date().toISOString(),
  });

  await adapter.updateProduct(sku, merged);

  if (parsed.stock !== undefined && parsed.stock !== existing.stock) {
    await adapter.recordMovement({
      time: merged.updatedAt,
      sku: merged.sku,
      name: merged.name,
      delta: merged.stock - existing.stock,
      stockAfter: merged.stock,
      type: "ADJUSTED",
      reason: "Perubahan stok langsung di pengelola stok",
      by: actor,
      source: "admin",
    });
  } else if (parsed.status !== undefined && parsed.status !== existing.status) {
    await adapter.recordMovement({
      time: merged.updatedAt,
      sku: merged.sku,
      name: merged.name,
      delta: 0,
      stockAfter: merged.stock,
      type: "STATUS",
      reason: `Status diubah menjadi ${merged.status}`,
      by: actor,
      source: "admin",
    });
  }

  invalidateStockSheetCache();
  return merged;
}

export async function adjustStock(
  sku: string,
  input: StockAdjustInput,
  actor: string = "system",
  adapter: StockSheetPort = getStockSheetAdapter(),
): Promise<StockProduct> {
  const parsed = stockAdjustSchema.parse(input);
  const products = await adapter.readProducts();
  const normalized = normalizeSku(sku);
  const existing = products.find((p) => normalizeSku(p.sku) === normalized);
  if (!existing) {
    throw new StockProductNotFoundError(sku);
  }

  const newStock = existing.stock + parsed.delta;
  if (newStock < 0) {
    throw new Error(
      `Stok tidak cukup: sisa stok ${existing.stock}, tidak bisa mengurangi ${Math.abs(parsed.delta)}`,
    );
  }

  const updated = stockProductSchema.parse({
    ...existing,
    stock: newStock,
    updatedAt: new Date().toISOString(),
  });

  await adapter.updateProduct(sku, {
    stock: newStock,
    updatedAt: updated.updatedAt,
  });
  await adapter.recordMovement({
    time: updated.updatedAt,
    sku: updated.sku,
    name: updated.name,
    delta: parsed.delta,
    stockAfter: newStock,
    type: "ADJUSTED",
    reason: parsed.reason,
    by: actor,
    source: "admin",
  });

  invalidateStockSheetCache();
  return updated;
}

export async function deleteStockProduct(
  sku: string,
  input: StockDeleteInput,
  actor: string = "system",
  adapter: StockSheetPort = getStockSheetAdapter(),
): Promise<{ sku: string; name: string }> {
  const parsed = stockDeleteSchema.parse(input);
  const products = await adapter.readProducts();
  const normalized = normalizeSku(sku);
  const existing = products.find((p) => normalizeSku(p.sku) === normalized);
  if (!existing) {
    throw new StockProductNotFoundError(sku);
  }

  await adapter.deleteProduct(sku);
  await adapter.recordMovement({
    time: new Date().toISOString(),
    sku: existing.sku,
    name: existing.name,
    delta: -existing.stock,
    stockAfter: 0,
    type: "DELETED",
    reason: parsed.reason,
    by: actor,
    source: "admin",
  });

  invalidateStockSheetCache();
  return { sku: existing.sku, name: existing.name };
}

export async function listStockMovements(
  adapter: StockSheetPort = getStockSheetAdapter(),
): Promise<StockMovement[]> {
  return adapter.readMovements();
}

export function isStockSheetConfigError(
  error: unknown,
): error is SheetsConfigError {
  return error instanceof SheetsConfigError;
}

export { StockProductConflictError, isSheetsConfigured };

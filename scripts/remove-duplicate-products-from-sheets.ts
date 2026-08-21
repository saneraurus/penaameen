import dotenv from "dotenv";
import { getStockSheetAdapter } from "../src/infrastructure/sheets/stock-sheet-adapter";

dotenv.config({ path: ".env.local", override: true });

async function main() {
  const adapter = getStockSheetAdapter();
  const products = await adapter.readProducts();
  const seen = new Set<string>();
  let removed = 0;

  for (const product of products) {
    const key = product.sku.toUpperCase();
    if (!seen.has(key)) {
      seen.add(key);
      continue;
    }

    await adapter.deleteProduct(product.sku);
    await adapter.recordMovement({
      time: new Date().toISOString(),
      sku: product.sku,
      name: product.name,
      delta: -product.stock,
      stockAfter: 0,
      type: "DELETED",
      reason: "Menghapus baris SKU duplikat saat sinkronisasi katalog",
      by: "system-catalog-sync",
      source: "catalog",
    });
    removed += 1;
  }

  console.log(JSON.stringify({ removed }));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

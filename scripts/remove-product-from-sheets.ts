import dotenv from "dotenv";
import { getStockSheetAdapter } from "../src/infrastructure/sheets/stock-sheet-adapter";

dotenv.config({ path: ".env.local", override: true });

async function main() {
  const adapter = getStockSheetAdapter();
  const product = (await adapter.readProducts()).find(
    (item) => item.slug === "paket-home-learning-albarqy",
  );

  if (!product) {
    console.log(JSON.stringify({ removed: false, reason: "not_found" }));
    return;
  }

  await adapter.deleteProduct(product.sku);
  await adapter.recordMovement({
    time: new Date().toISOString(),
    sku: product.sku,
    name: product.name,
    delta: -product.stock,
    stockAfter: 0,
    type: "DELETED",
    reason: "Produk dikeluarkan dari katalog berdasarkan keputusan owner",
    by: "system-catalog-sync",
    source: "catalog",
  });
  console.log(JSON.stringify({ removed: true, sku: product.sku }));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

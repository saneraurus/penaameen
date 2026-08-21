import dotenv from "dotenv";
import { products } from "../src/data/products";
import { getStockSheetAdapter } from "../src/infrastructure/sheets/stock-sheet-adapter";
import {
  normalizeSku,
  slugifyName,
} from "../src/domain/inventory/stock-product";

dotenv.config({ path: ".env.local", override: true });

function skuForProduct(id: string): string {
  return `PENA-${id.padStart(3, "0")}`;
}

async function main() {
  const adapter = getStockSheetAdapter();
  await adapter.ensureSchema();
  const existing = await adapter.readProducts();
  const existingSkus = new Set(
    existing.map((product) => normalizeSku(product.sku)),
  );
  const timestamp = new Date().toISOString();
  let added = 0;
  let updated = 0;

  for (const product of products) {
    const sku = skuForProduct(product.id);
    const imported = {
      sku,
      name: product.name,
      category: product.category,
      price: product.price,
      salePrice: product.salePrice,
      stock: 0,
      status: "published" as const,
      slug: product.slug || slugifyName(product.name),
      description: product.description,
      image: product.image,
      tags: product.category,
      updatedAt: timestamp,
    };

    if (existingSkus.has(normalizeSku(sku))) {
      await adapter.updateProduct(sku, {
        name: imported.name,
        category: imported.category,
        price: imported.price,
        salePrice: imported.salePrice,
        status: imported.status,
        slug: imported.slug,
        description: imported.description,
        image: imported.image,
        tags: imported.tags,
        updatedAt: imported.updatedAt,
      });
      updated += 1;
      continue;
    }

    await adapter.appendProduct(imported);
    await adapter.recordMovement({
      time: timestamp,
      sku,
      name: imported.name,
      delta: 0,
      stockAfter: 0,
      type: "CREATED",
      reason: "Import katalog website",
      by: "system-import",
      source: "catalog",
    });
    existingSkus.add(normalizeSku(sku));
    added += 1;
  }

  console.log(
    JSON.stringify({ sourceProducts: products.length, added, updated }),
  );
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

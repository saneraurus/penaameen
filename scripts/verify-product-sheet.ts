import dotenv from "dotenv";
import { products as sourceProducts } from "../src/data/products";
import { getStockSheetAdapter } from "../src/infrastructure/sheets/stock-sheet-adapter";

dotenv.config({ path: ".env.local", override: true });

async function main() {
  const products = await getStockSheetAdapter().readProducts();
  const sourceSkus = new Set(
    sourceProducts.map((product) => `PENA-${product.id.padStart(3, "0")}`),
  );
  const sheetSkus = new Set(products.map((product) => product.sku));
  const duplicateSkus = products
    .map((product) => product.sku)
    .filter((sku, index, values) => values.indexOf(sku) !== index);
  const duplicateSlugs = products
    .map((product) => product.slug)
    .filter((slug, index, values) => values.indexOf(slug) !== index);
  const names = [
    "Mengenal Tindak Pidana Ekonomi: Karakter dan Bentuk-bentuk Tindak Pidana Ekonomi",
    "PENGANTAR ILMU HUKUM",
    "PENGANTAR TEKNOLOGI BETON PRATEGANG",
  ];
  console.log(
    JSON.stringify({
      count: products.length,
      homeLearningPresent: products.some(
        (product) => product.slug === "paket-home-learning-albarqy",
      ),
      addedProducts: products
        .filter((product) => names.includes(product.name))
        .map((product) => ({
          sku: product.sku,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice ?? null,
          slug: product.slug,
        })),
      extraRows: products
        .filter((product) => !sourceSkus.has(product.sku))
        .map((product) => ({
          sku: product.sku,
          name: product.name,
          slug: product.slug,
        })),
      missingRows: Array.from(sourceSkus).filter((sku) => !sheetSkus.has(sku)),
      duplicateSkus,
      duplicateSlugs,
    }),
  );
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

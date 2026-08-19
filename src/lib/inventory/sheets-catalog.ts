import { unstable_cache } from "next/cache";
import { STOCK_SHEET_CACHE_TAG } from "@/application/inventory/stock-service";
import {
  slugifyName,
  type StockProduct,
} from "@/domain/inventory/stock-product";
import { isSheetsConfigured } from "@/infrastructure/sheets/sheets-config";
import { getStockSheetAdapter } from "@/infrastructure/sheets/stock-sheet-adapter";

const STOCK_SHEET_CACHE_SECONDS = 60;

const getSheetProductsCached = unstable_cache(
  async (): Promise<StockProduct[] | null> => {
    if (!isSheetsConfigured()) return null;
    try {
      const adapter = getStockSheetAdapter();
      await adapter.ensureSchema();
      return await adapter.readProducts();
    } catch (error) {
      console.warn(
        "[StockSheet] Gagal membaca produk dari spreadsheet:",
        error,
      );
      return null;
    }
  },
  ["stock-sheet-products"],
  {
    tags: [STOCK_SHEET_CACHE_TAG],
    revalidate: STOCK_SHEET_CACHE_SECONDS,
  },
);

export async function getSheetCatalogProducts(): Promise<
  StockProduct[] | null
> {
  return getSheetProductsCached();
}

export function mapSheetProductToPublic(product: StockProduct): {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  stock: number;
} {
  return {
    id: product.sku,
    slug: product.slug || slugifyName(product.name),
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    image: product.image || "/images/penaameen/products/home-learning.jpg",
    stock: product.stock,
  };
}

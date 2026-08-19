import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  StockProduct,
  StockProductUpdateInput,
} from "@/domain/inventory/stock-product";
import type { StockMovement } from "@/domain/inventory/stock-movement";
import type {
  StockSheetHealth,
  StockSheetPort,
} from "@/domain/inventory/stock-sheet-port";

const revalidateTagMock = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ revalidateTag: revalidateTagMock }));

const adapterModule = vi.hoisted(() => {
  class FakeAdapter implements StockSheetPort {
    products: StockProduct[] = [];
    movements: StockMovement[] = [];

    async ensureSchema(): Promise<void> {}
    async readProducts(): Promise<StockProduct[]> {
      return this.products;
    }
    async appendProduct(product: StockProduct): Promise<void> {
      const existing = this.products.find(
        (p) => p.sku === product.sku.toUpperCase(),
      );
      if (existing) {
        throw new StockProductConflictError(product.sku);
      }
      this.products.push(product);
    }
    async updateProduct(
      sku: string,
      fields: StockProductUpdateInput,
    ): Promise<void> {
      const index = this.products.findIndex((p) => p.sku === sku.toUpperCase());
      if (index < 0) throw new Error("NOT_FOUND");
      this.products[index] = {
        ...this.products[index]!,
        ...fields,
      } as StockProduct;
    }
    async deleteProduct(sku: string): Promise<void> {
      this.products = this.products.filter((p) => p.sku !== sku.toUpperCase());
    }
    async recordMovement(movement: StockMovement): Promise<void> {
      this.movements.unshift(movement);
    }
    async readMovements(): Promise<StockMovement[]> {
      return this.movements;
    }
    async health(): Promise<StockSheetHealth> {
      return {
        configured: true,
        connected: true,
        spreadsheetId: "fake",
        productSheetName: "Sheet1",
        movementSheetName: "MUTASI STOCK",
        error: null,
      };
    }
  }

  return {
    FakeAdapter,
    getStockSheetAdapter: vi.fn(),
  };
});

vi.mock("@/infrastructure/sheets/stock-sheet-adapter", () => ({
  getStockSheetAdapter: adapterModule.getStockSheetAdapter,
}));

import {
  addStockProduct,
  adjustStock,
  deleteStockProduct,
  getStockSheetHealth,
  listStockProducts,
  updateStockProduct,
  STOCK_SHEET_CACHE_TAG,
} from "@/application/inventory/stock-service";
import {
  StockProductConflictError,
  StockProductNotFoundError,
} from "@/domain/inventory/stock-sheet-port";

const fake = new adapterModule.FakeAdapter();

const baseProduct: StockProduct = {
  sku: "ACM-001",
  name: "Buku Metode Al-Barqy",
  category: "Metode Belajar",
  price: 75000,
  salePrice: 65000,
  stock: 10,
  status: "published",
  slug: "buku-metode-al-barqy",
  description: "",
  image: "",
  tags: "",
  updatedAt: "2026-08-20T10:00:00.000Z",
};

describe("stock-service", () => {
  beforeEach(() => {
    fake.products = [{ ...baseProduct }];
    fake.movements = [];
    adapterModule.getStockSheetAdapter.mockReturnValue(fake);
    revalidateTagMock.mockClear();
  });

  it("adds a product and records a CREATED movement", async () => {
    const product = await addStockProduct(
      {
        sku: "acm-002",
        name: "Buku Baru",
        category: "Buku",
        price: 50000,
        stock: 4,
      },
      "owner@penaameen.com",
      fake,
    );

    expect(product.sku).toBe("ACM-002");
    expect(product.slug).toBe("buku-baru");
    expect(fake.products).toHaveLength(2);
    expect(fake.movements[0]?.type).toBe("CREATED");
    expect(fake.movements[0]?.delta).toBe(4);
    expect(revalidateTagMock).toHaveBeenCalledWith(
      STOCK_SHEET_CACHE_TAG,
      "max",
    );
  });

  it("rejects duplicate SKUs", async () => {
    await expect(
      addStockProduct(
        {
          sku: "ACM-001",
          name: "Duplikat",
          category: "Buku",
          price: 1,
          stock: 0,
        },
        "owner@penaameen.com",
        fake,
      ),
    ).rejects.toBeInstanceOf(StockProductConflictError);
  });

  it("rejects invalid input via zod", async () => {
    await expect(
      addStockProduct(
        {
          sku: "BAD SKU !!!",
          name: "",
          category: "",
          price: -5,
          stock: -1,
        },
        "owner@penaameen.com",
        fake,
      ),
    ).rejects.toThrow();
  });

  it("adjusts stock with a positive delta and records movement", async () => {
    const updated = await adjustStock(
      "ACM-001",
      { delta: 5, reason: "Restok gudang" },
      "owner@penaameen.com",
      fake,
    );

    expect(updated.stock).toBe(15);
    expect(fake.movements[0]?.delta).toBe(5);
    expect(fake.movements[0]?.stockAfter).toBe(15);
    expect(fake.movements[0]?.reason).toBe("Restok gudang");
  });

  it("adjusts stock with a negative delta", async () => {
    const updated = await adjustStock(
      "ACM-001",
      { delta: -3, reason: "Stok rusak" },
      "owner@penaameen.com",
      fake,
    );
    expect(updated.stock).toBe(7);
  });

  it("refuses to reduce stock below zero", async () => {
    await expect(
      adjustStock(
        "ACM-001",
        { delta: -100, reason: "Terlalu banyak" },
        "owner@penaameen.com",
        fake,
      ),
    ).rejects.toThrow(/Stok tidak cukup/);
    expect(fake.products[0]?.stock).toBe(10);
  });

  it("throws when adjusting an unknown SKU", async () => {
    await expect(
      adjustStock(
        "NOPE-1",
        { delta: 1, reason: "tes" },
        "owner@penaameen.com",
        fake,
      ),
    ).rejects.toBeInstanceOf(StockProductNotFoundError);
  });

  it("updates fields and records an ADJUSTED movement on stock change", async () => {
    const updated = await updateStockProduct(
      "ACM-001",
      { stock: 20, price: 80000 },
      "owner@penaameen.com",
      fake,
    );
    expect(updated.stock).toBe(20);
    expect(updated.price).toBe(80000);
    expect(fake.movements[0]?.type).toBe("ADJUSTED");
    expect(fake.movements[0]?.delta).toBe(10);
  });

  it("records a STATUS movement when only the status changes", async () => {
    await updateStockProduct(
      "ACM-001",
      { status: "archived" },
      "owner@penaameen.com",
      fake,
    );
    expect(fake.movements[0]?.type).toBe("STATUS");
    expect(fake.movements[0]?.delta).toBe(0);
  });

  it("records no movement when nothing meaningful changes", async () => {
    await updateStockProduct(
      "ACM-001",
      { description: "Deskripsi baru" },
      "owner@penaameen.com",
      fake,
    );
    expect(fake.movements).toHaveLength(0);
  });

  it("deletes a product and records a DELETED movement", async () => {
    const result = await deleteStockProduct(
      "ACM-001",
      { reason: "Produk dihentikan" },
      "owner@penaameen.com",
      fake,
    );
    expect(result.sku).toBe("ACM-001");
    expect(fake.products).toHaveLength(0);
    expect(fake.movements[0]?.type).toBe("DELETED");
    expect(fake.movements[0]?.delta).toBe(-10);
  });

  it("lists products and movements", async () => {
    expect(await listStockProducts(fake)).toHaveLength(1);
    expect(await fake.readMovements()).toHaveLength(0);
  });

  it("reports health without configuration", async () => {
    delete process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON;
    const health = await getStockSheetHealth();
    expect(health.configured).toBe(false);
    expect(health.connected).toBe(false);
  });

  it("reports connected health when configured", async () => {
    process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON = "{}";
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = "fake-id";
    const health = await getStockSheetHealth();
    expect(health.configured).toBe(true);
    expect(health.connected).toBe(true);
  });
});

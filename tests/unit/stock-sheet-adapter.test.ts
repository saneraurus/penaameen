import { describe, expect, it } from "vitest";
import {
  parseInteger,
  productToRow,
  rowToProduct,
  rowToMovement,
  movementToRow,
  PRODUCT_COLUMNS,
  MOVEMENT_COLUMNS,
} from "@/infrastructure/sheets/stock-sheet-adapter";
import type { StockProduct } from "@/domain/inventory/stock-product";

const headers = [...PRODUCT_COLUMNS];

describe("stock-sheet-adapter mapping", () => {
  it("parses a product row into a StockProduct", () => {
    const row = [
      "ACM-001",
      "Buku Metode Al-Barqy",
      "Metode Belajar",
      75000,
      "Rp 65.000",
      12,
      "published",
      "buku-metode-al-barqy",
      "Deskripsi singkat",
      "/images/acm-001.jpg",
      "belajar,albarqy",
      "2026-08-20T10:00:00.000Z",
    ];
    const product = rowToProduct(headers, row);
    expect(product).not.toBeNull();
    expect(product?.sku).toBe("ACM-001");
    expect(product?.name).toBe("Buku Metode Al-Barqy");
    expect(product?.category).toBe("Metode Belajar");
    expect(product?.price).toBe(75000);
    expect(product?.salePrice).toBe(65000);
    expect(product?.stock).toBe(12);
    expect(product?.status).toBe("published");
  });

  it("normalizes status values case-insensitively", () => {
    const base = [
      "ACM-002",
      "Buku X",
      "Buku",
      10000,
      "",
      0,
      "DRAFT",
      "buku-x",
      "",
      "",
      "",
      "",
    ];
    expect(rowToProduct(headers, base)?.status).toBe("draft");
    base[6] = "ARCHIVED";
    expect(rowToProduct(headers, base)?.status).toBe("archived");
    base[6] = "PUBLISHED";
    expect(rowToProduct(headers, base)?.status).toBe("published");
  });

  it("skips empty rows", () => {
    expect(rowToProduct(headers, [])).toBeNull();
    expect(
      rowToProduct(headers, ["", "", "", "", "", "", "", "", "", "", "", ""]),
    ).toBeNull();
  });

  it("round-trips a product through productToRow", () => {
    const product: StockProduct = {
      sku: "ACM-003",
      name: "Paket Lengkap",
      category: "Paket",
      price: 150000,
      salePrice: 135000,
      stock: 3,
      status: "draft",
      slug: "paket-lengkap",
      description: "Isi paket",
      image: "/images/paket.jpg",
      tags: "paket",
      updatedAt: "2026-08-20T10:00:00.000Z",
    };
    const row = productToRow(product);
    expect(row[3]).toBe(150000);
    expect(row[5]).toBe(3);
    expect(row[6]).toBe("DRAFT");

    const parsed = rowToProduct(headers, row);
    expect(parsed).toEqual({
      ...product,
      status: "draft",
      salePrice: 135000,
    });
  });

  it("parses integer cells with separators and currency text", () => {
    expect(parseInteger("Rp 1.500.000")).toBe(1500000);
    expect(parseInteger("1,250")).toBe(1250);
    expect(parseInteger(42.9)).toBe(42);
    expect(parseInteger("abc")).toBe(0);
    expect(parseInteger(null)).toBe(0);
  });

  it("maps movements both directions", () => {
    const headersMovement = [...MOVEMENT_COLUMNS];
    const row = [
      "2026-08-20T10:00:00.000Z",
      "ACM-001",
      "Buku Metode Al-Barqy",
      5,
      17,
      "ADJUSTED",
      "Restok gudang",
      "owner@penaameen.com",
      "admin",
    ];
    const movement = rowToMovement(headersMovement, row);
    expect(movement?.sku).toBe("ACM-001");
    expect(movement?.delta).toBe(5);
    expect(movement?.stockAfter).toBe(17);
    expect(movement?.type).toBe("ADJUSTED");
    expect(movement?.reason).toBe("Restok gudang");

    const roundTrip = rowToMovement(headersMovement, movementToRow(movement!));
    expect(roundTrip).toEqual(movement);
  });

  it("skips invalid movement rows", () => {
    const headersMovement = [...MOVEMENT_COLUMNS];
    expect(rowToMovement(headersMovement, [])).toBeNull();
    expect(
      rowToMovement(headersMovement, ["", "", "", "", "", "", "", "", ""]),
    ).toBeNull();
  });
});

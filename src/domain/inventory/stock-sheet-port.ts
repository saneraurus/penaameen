import type {
  StockMovementInput,
  StockMovement,
} from "@/domain/inventory/stock-movement";
import type {
  StockProduct,
  StockProductUpdateInput,
} from "@/domain/inventory/stock-product";

export type StockSheetHealth = {
  readonly configured: boolean;
  readonly connected: boolean;
  readonly spreadsheetId: string | null;
  readonly productSheetName: string | null;
  readonly movementSheetName: string | null;
  readonly error: string | null;
};

export interface StockSheetPort {
  ensureSchema(): Promise<void>;
  readProducts(): Promise<StockProduct[]>;
  appendProduct(product: StockProduct): Promise<void>;
  updateProduct(sku: string, fields: StockProductUpdateInput): Promise<void>;
  deleteProduct(sku: string): Promise<void>;
  recordMovement(movement: StockMovementInput): Promise<void>;
  readMovements(): Promise<StockMovement[]>;
  health(): Promise<StockSheetHealth>;
}

export class StockSheetUnavailableError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "StockSheetUnavailableError";
    this.code = code;
  }
}

export class StockProductNotFoundError extends Error {
  constructor(sku: string) {
    super(`Produk dengan SKU "${sku}" tidak ditemukan di spreadsheet`);
    this.name = "StockProductNotFoundError";
  }
}

export class StockProductConflictError extends Error {
  constructor(sku: string) {
    super(`Produk dengan SKU "${sku}" sudah ada di spreadsheet`);
    this.name = "StockProductConflictError";
  }
}

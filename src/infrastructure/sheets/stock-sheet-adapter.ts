import {
  normalizeSku,
  slugifyName,
  stockProductSchema,
  type StockProduct,
  type StockProductUpdateInput,
} from "@/domain/inventory/stock-product";
import {
  stockMovementSchema,
  type StockMovement,
  type StockMovementInput,
} from "@/domain/inventory/stock-movement";
import {
  StockProductConflictError,
  StockProductNotFoundError,
  type StockSheetHealth,
  type StockSheetPort,
} from "@/domain/inventory/stock-sheet-port";
import {
  isSheetsConfigured,
  getSheetsConfig,
} from "@/infrastructure/sheets/sheets-config";
import {
  SheetsApiClient,
  sheetRange,
} from "@/infrastructure/sheets/sheets-api";

export const PRODUCT_COLUMNS = [
  "SKU",
  "NAMA",
  "KATEGORI",
  "HARGA",
  "HARGA JUAL",
  "STOK",
  "STATUS",
  "SLUG",
  "DESKRIPSI",
  "GAMBAR",
  "TAG",
  "UPDATED_AT",
] as const;

export const MOVEMENT_COLUMNS = [
  "WAKTU",
  "SKU",
  "NAMA",
  "DELTA",
  "STOK_SETELAH",
  "JENIS",
  "ALASAN",
  "OLEH",
  "SUMBER",
] as const;

const PRODUCT_ROW_LIMIT = 2000;
const MOVEMENT_ROW_LIMIT = 5000;

function stringOr(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  return String(value);
}

export function parseInteger(value: unknown): number {
  if (typeof value === "number") return Math.trunc(value);
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/[^\d-]/g, "");
  const parsed = Number.parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeStatus(value: unknown): StockProduct["status"] {
  const raw = stringOr(value).trim().toLowerCase();
  if (raw === "draft") return "draft";
  if (raw === "archived" || raw === "arsip") return "archived";
  return "published";
}

function buildHeaderIndex(headers: string[]): Map<string, number> {
  const index = new Map<string, number>();
  headers.forEach((header, column) => {
    index.set(header.trim().toUpperCase(), column);
  });
  return index;
}

export function rowToProduct(
  headers: string[],
  row: unknown[],
): StockProduct | null {
  const index = buildHeaderIndex(headers);
  const cell = (columnName: string): unknown => {
    const column = index.get(columnName);
    return column === undefined ? undefined : row[column];
  };

  const sku = stringOr(cell("SKU")).trim();
  if (!sku) return null;

  const parsed = stockProductSchema.safeParse({
    sku,
    name: stringOr(cell("NAMA")),
    category: stringOr(cell("KATEGORI")),
    price: parseInteger(cell("HARGA")),
    salePrice:
      cell("HARGA JUAL") === undefined
        ? undefined
        : parseInteger(cell("HARGA JUAL")),
    stock: parseInteger(cell("STOK")),
    status: normalizeStatus(cell("STATUS")),
    slug: stringOr(cell("SLUG")),
    description: stringOr(cell("DESKRIPSI")),
    image: stringOr(cell("GAMBAR")),
    tags: stringOr(cell("TAG")),
    updatedAt: stringOr(cell("UPDATED_AT")) || new Date().toISOString(),
  });

  if (!parsed.success) {
    return null;
  }
  return parsed.data;
}

export function productToRow(product: StockProduct): unknown[] {
  return [
    product.sku,
    product.name,
    product.category,
    product.price,
    product.salePrice ?? "",
    product.stock,
    product.status.toUpperCase(),
    product.slug,
    product.description,
    product.image,
    product.tags,
    product.updatedAt,
  ];
}

export function movementToRow(movement: StockMovement): unknown[] {
  return [
    movement.time,
    movement.sku,
    movement.name,
    movement.delta,
    movement.stockAfter,
    movement.type,
    movement.reason,
    movement.by,
    movement.source,
  ];
}

export function rowToMovement(
  headers: string[],
  row: unknown[],
): StockMovement | null {
  const index = buildHeaderIndex(headers);
  const cell = (columnName: string): unknown => {
    const column = index.get(columnName);
    return column === undefined ? undefined : row[column];
  };

  const sku = stringOr(cell("SKU")).trim();
  if (!sku) return null;

  const parsed = stockMovementSchema.safeParse({
    time: stringOr(cell("WAKTU")) || new Date().toISOString(),
    sku,
    name: stringOr(cell("NAMA")),
    delta: parseInteger(cell("DELTA")),
    stockAfter: parseInteger(cell("STOK_SETELAH")),
    type: stringOr(cell("JENIS")),
    reason: stringOr(cell("ALASAN")),
    by: stringOr(cell("OLEH")),
    source: stringOr(cell("SUMBER")),
  });

  if (!parsed.success) {
    return null;
  }
  return parsed.data;
}

export class StockSheetAdapter implements StockSheetPort {
  private readonly api: SheetsApiClient;
  private readonly spreadsheetId: string;
  private readonly productSheetName: string;
  private readonly movementSheetName: string;

  constructor(
    api: SheetsApiClient,
    spreadsheetId: string,
    productSheetName: string,
    movementSheetName: string,
  ) {
    this.api = api;
    this.spreadsheetId = spreadsheetId;
    this.productSheetName = productSheetName;
    this.movementSheetName = movementSheetName;
  }

  private productRange(range: string): string {
    return sheetRange(this.productSheetName, range);
  }

  private movementRange(range: string): string {
    return sheetRange(this.movementSheetName, range);
  }

  async ensureSchema(): Promise<void> {
    const info = await this.api.getSpreadsheetInfo();
    const existingTitles = new Set(info.sheets.map((sheet) => sheet.title));

    if (!existingTitles.has(this.productSheetName)) {
      await this.api.addSheet(this.productSheetName);
    }
    if (!existingTitles.has(this.movementSheetName)) {
      await this.api.addSheet(this.movementSheetName);
    }

    const productHeader = await this.api.valuesGet(this.productRange("A1:Z1"));
    if (stringOr(productHeader[0]?.[0]).trim().toUpperCase() !== "SKU") {
      await this.api.valuesUpdate(this.productRange("A1"), [
        [...PRODUCT_COLUMNS],
      ]);
    }

    const movementHeader = await this.api.valuesGet(
      this.movementRange("A1:Z1"),
    );
    if (stringOr(movementHeader[0]?.[0]).trim().toUpperCase() !== "WAKTU") {
      await this.api.valuesUpdate(this.movementRange("A1"), [
        [...MOVEMENT_COLUMNS],
      ]);
    }
  }

  async readProducts(): Promise<StockProduct[]> {
    const rows = await this.api.valuesGet(
      this.productRange(`A1:L${PRODUCT_ROW_LIMIT}`),
    );
    if (rows.length === 0) return [];

    const headers = (rows[0] ?? []).map((cell) => stringOr(cell));
    const products: StockProduct[] = [];
    for (const row of rows.slice(1)) {
      const product = rowToProduct(headers, row);
      if (product) products.push(product);
    }
    return products;
  }

  async appendProduct(product: StockProduct): Promise<void> {
    const existing = await this.readProducts();
    if (
      existing.some((p) => normalizeSku(p.sku) === normalizeSku(product.sku))
    ) {
      throw new StockProductConflictError(product.sku);
    }
    await this.api.valuesAppend(this.productRange("A1"), [
      productToRow(product),
    ]);
  }

  async updateProduct(
    sku: string,
    fields: StockProductUpdateInput,
  ): Promise<void> {
    const products = await this.readProducts();
    const normalized = normalizeSku(sku);
    const index = products.findIndex((p) => normalizeSku(p.sku) === normalized);
    if (index < 0) {
      throw new StockProductNotFoundError(sku);
    }

    const current = products[index]!;
    const updated = stockProductSchema.parse({
      ...current,
      ...fields,
      sku: fields.sku ? normalizeSku(fields.sku) : current.sku,
      slug:
        fields.slug ?? (fields.name ? slugifyName(fields.name) : current.slug),
      updatedAt: new Date().toISOString(),
    });

    // Row numbers are 1-based; row 1 is the header, data starts at row 2.
    const rowNumber = index + 2;
    await this.api.valuesUpdate(
      this.productRange(`A${rowNumber}:L${rowNumber}`),
      [productToRow(updated)],
    );
  }

  async deleteProduct(sku: string): Promise<void> {
    const products = await this.readProducts();
    const normalized = normalizeSku(sku);
    const index = products.findIndex((p) => normalizeSku(p.sku) === normalized);
    if (index < 0) {
      throw new StockProductNotFoundError(sku);
    }
    const rowNumber = index + 2;
    await this.api.valuesClear(
      this.productRange(`A${rowNumber}:L${rowNumber}`),
    );
  }

  async recordMovement(movement: StockMovementInput): Promise<void> {
    const parsed = stockMovementSchema.parse(movement);
    await this.api.valuesAppend(this.movementRange("A1"), [
      movementToRow(parsed),
    ]);
  }

  async readMovements(): Promise<StockMovement[]> {
    const rows = await this.api.valuesGet(
      this.movementRange(`A1:I${MOVEMENT_ROW_LIMIT}`),
    );
    if (rows.length === 0) return [];

    const headers = (rows[0] ?? []).map((cell) => stringOr(cell));
    const movements: StockMovement[] = [];
    for (const row of rows.slice(1)) {
      const movement = rowToMovement(headers, row);
      if (movement) movements.push(movement);
    }
    return movements;
  }

  async health(): Promise<StockSheetHealth> {
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

    try {
      await this.ensureSchema();
      await this.readProducts();
      return {
        configured: true,
        connected: true,
        spreadsheetId: this.spreadsheetId,
        productSheetName: this.productSheetName,
        movementSheetName: this.movementSheetName,
        error: null,
      };
    } catch (error) {
      return {
        configured: true,
        connected: false,
        spreadsheetId: this.spreadsheetId,
        productSheetName: this.productSheetName,
        movementSheetName: this.movementSheetName,
        error: error instanceof Error ? error.message : "Tidak dapat terhubung",
      };
    }
  }
}

let singletonAdapter: StockSheetAdapter | null = null;

export function getStockSheetAdapter(): StockSheetAdapter {
  if (singletonAdapter) return singletonAdapter;

  const config = getSheetsConfig();
  singletonAdapter = new StockSheetAdapter(
    new SheetsApiClient(config),
    config.spreadsheetId,
    config.productSheetName,
    config.movementSheetName,
  );
  return singletonAdapter;
}

export function resetStockSheetAdapterForTests(): void {
  singletonAdapter = null;
}

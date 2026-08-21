import dotenv from "dotenv";
import { productWeights } from "../src/data/product-weights";
import { getSheetsConfig } from "../src/infrastructure/sheets/sheets-config";
import {
  SheetsApiClient,
  sheetRange,
} from "../src/infrastructure/sheets/sheets-api";

dotenv.config({ path: ".env.local", override: true });

const SHEET_NAME = "BERAT PRODUK";
const HEADERS = [
  "KELOMPOK",
  "NAMA PRODUK",
  "UKURAN",
  "JUMLAH/HALAMAN",
  "BERAT_GRAM",
  "BERAT_SUMBER",
  "SUMBER",
  "UPDATED_AT",
] as const;

async function main() {
  const config = getSheetsConfig();
  const api = new SheetsApiClient(config);
  const spreadsheet = await api.getSpreadsheetInfo();
  if (!spreadsheet.sheets.some((sheet) => sheet.title === SHEET_NAME))
    await api.addSheet(SHEET_NAME);
  const timestamp = new Date().toISOString();
  const rows = [
    [...HEADERS],
    ...productWeights.map((product) => [
      product.group,
      product.name,
      product.size,
      product.pages,
      product.weightGrams,
      product.sourceWeight,
      "PRODUK/BERAT PRODUK ACM ABQ.xlsx",
      timestamp,
    ]),
  ];
  await api.valuesUpdate(sheetRange(SHEET_NAME, `A1:H${rows.length}`), rows);
  console.log(
    JSON.stringify({ sheet: SHEET_NAME, rows: productWeights.length }),
  );
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

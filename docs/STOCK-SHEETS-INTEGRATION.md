# Stock Sheets Integration (Manage Stocks)

**Status:** APPROVED by owner decision (D019, 2026-08-20) — Google Sheets is the
primary source of truth for product master data and stock. PostgreSQL remains
the persistence layer for orders, payments, authentication, and audit.

**Spreadsheet:** STOCK PENAAMEEN
`https://docs.google.com/spreadsheets/d/1OlK9J1kw9U4Br9OCdzVsBw5aabVQ24jwWRNCFFtHETc/edit`

## 1. Decisions

| # | Decision | Detail |
|---|---|---|
| D019 | MANAGE STOCKS on the admin PRODUCTS tab | New tab `Manage Stocks` at `/admin/products/stocks`. |
| D019 | Authentication via Google Service Account | `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON` (JSON key, Sheets API enabled) + spreadsheet shared to the service account `client_email` (Editor). |
| D019 | Sheets is the primary source for products + stock | Admin writes and storefront reads go through the spreadsheet. Empty/unavailable sheet falls back to PostgreSQL then the static catalog so the public storefront never breaks. |
| D019 | Default schema | Defined below; headers are auto-created by `ensureSchema()` when the tabs are missing or empty. |

## 2. Configuration (environment)

| Variable | Purpose | Default |
|---|---|---|
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Spreadsheet ID from the sharing URL | `1OlK9J1kw9U4Br9OCdzVsBw5aabVQ24jwWRNCFFtHETc` |
| `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON` | Service account JSON key (one line) | empty → feature disabled (fail-closed) |
| `GOOGLE_SHEETS_SHEET_NAME` | Product master tab | `Sheet1` |
| `GOOGLE_SHEETS_MOVEMENT_SHEET_NAME` | Append-only movement ledger tab | `MUTASI STOCK` |

The service account must have the **Google Sheets API** enabled and the
spreadsheet must be shared with its `client_email` (Editor). No other
credential is required; the JWT flow uses Node `crypto` only (no new
dependencies).

## 3. Spreadsheet schema (tab `Sheet1`)

| Column | Header | Example |
|---|---|---|
| A | `SKU` | `ACM-001` (unique, normalized to uppercase) |
| B | `NAMA` | `Buku Metode Al-Barqy` |
| C | `KATEGORI` | `Metode Belajar` |
| D | `HARGA` | `75000` |
| E | `HARGA JUAL` | `65000` (optional) |
| F | `STOK` | `12` |
| G | `STATUS` | `PUBLISHED` / `DRAFT` / `ARCHIVED` |
| H | `SLUG` | `buku-metode-al-barqy` |
| I | `DESKRIPSI` | product description |
| J | `GAMBAR` | `/images/...` |
| K | `TAG` | comma-separated tags |
| L | `UPDATED_AT` | ISO timestamp (auto) |

Number cells tolerate thousand separators and currency prefixes
(`"Rp 1.500.000"` → `1500000`).

## 4. Movement ledger (tab `MUTASI STOCK`)

Append-only rows, written automatically on every mutation so the sheet
records the full history ("tercatat dengan baik"):

| Column | Header | Meaning |
|---|---|---|
| A | `WAKTU` | ISO timestamp |
| B | `SKU` | product SKU |
| C | `NAMA` | product name |
| D | `DELTA` | signed quantity change |
| E | `STOK_SETELAH` | stock after the change |
| F | `JENIS` | `CREATED` / `ADJUSTED` / `STATUS` / `DELETED` |
| G | `ALASAN` | required reason |
| H | `OLEH` | actor email |
| I | `SUMBER` | `admin` |

## 5. Component layout

```text
Domain        src/domain/inventory/           stock-product, stock-movement, stock-sheet-port
Infrastructure src/infrastructure/sheets/     sheets-config, service-account-jwt, sheets-api, stock-sheet-adapter
Application   src/application/inventory/      stock-service (validation, movements, cache invalidation)
API           src/app/api/admin/inventory/    GET/POST, PATCH/DELETE [sku], GET movements
Admin UI      src/app/admin/products/stocks/  Manage Stocks page + StockSheetManager (client)
Storefront    src/lib/inventory/sheets-catalog.ts  cached sheet reader (unstable_cache, tag `stock-sheet`, 60s)
```

## 6. Behavior rules

- **Fail-closed (admin):** without `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON` the
  Manage Stocks UI shows setup instructions and mutations return `503`.
- **Fail-soft (storefront):** `/api/products` and `/api/products/[slug]` read
  the sheet first (cached 60 s, revalidated by tag on every admin mutation);
  if the sheet is unavailable or empty they fall back to PostgreSQL and then
  to the static catalog so public pages keep working.
- **Authorization:** `inventory:read` / `inventory:write` capabilities
  (admin and product_manager roles); every mutation is written to the staff
  audit log (`/admin/audit`).
- **Safety:** stock can never go below zero; duplicate SKUs are rejected
  (`409`); deleting a product clears its spreadsheet row but the movement
  ledger keeps the history.
- **Reversibility:** row edits and status changes are reversible via the
  sheet; physical delete is intentional and recorded.

## 7. Test coverage

- `tests/unit/service-account-jwt.test.ts` — JWT claims/RS256 shape, token
  exchange, failure mapping.
- `tests/unit/stock-sheet-adapter.test.ts` — row↔product/movement mapping,
  status normalization, numeric parsing, empty-row skipping.
- `tests/unit/stock-service.test.ts` — add/update/adjust/delete, movement
  recording, negative-stock guard, duplicate SKU, health states (fake
  adapter + mocked `next/cache`).

## 8. Operational setup checklist (one-time)

1. Create a service account in Google Cloud Console (or reuse one) and enable
   the Google Sheets API.
2. Download the JSON key and set `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON`.
3. Open the spreadsheet → Share → add the service account `client_email` with
   **Editor** access.
4. Restart the app. The `Sheet1` and `MUTASI STOCK` headers are created
   automatically on first connect.
# Plan: Real PostgreSQL as the Single Source of Truth

## Status of this document
Implementation-ready plan. **Blocker:** the current session runs under plan-mode
permission rules that deny all `edit`/`write` except plan files, so source edits
could not be executed here. Environment investigation, dependency installation,
and a live Postgres boot test WERE performed and are recorded below.

## 1. Why there is "no real database" today (diagnosis)

1. **Engine mismatch / no running server.** `prisma/schema.prisma:10` declares
   `provider = "mysql"`, but `.env` points at `mysql://root:…@localhost:3306/penaameen`
   (a MySQL server that is not running). The approved architecture
   (`docs/DATABASE-ARCHITECTURE.md:9`) already designates **PostgreSQL** as the
   authoritative store, so MySQL was never the intended target.
2. **No migrations exist.** `prisma/migrations/` is empty, so the schema was never
   applied to any database.
3. **Silent JSON-file fallback (the actual defect).** Every API route and both
   admin data libraries wrap Prisma calls in `try/catch` and fall back to
   `src/data/live_products.json` and `src/data/live_orders.json` (and static
   `src/data/*.ts` seed files). The app "works" only because it is really running
   on files, not a DB.
   - `src/lib/admin/products.ts` is **file-based** (`loadFileProducts`/`saveFileProducts`).
   - `src/lib/admin/orders.ts` merges Prisma + file store (`loadFileOrders`/`registerLiveOrder`).
   - `src/app/api/products/route.ts`, `products/[slug]/route.ts`,
     `orders/route.ts`, `orders/[id]/route.ts`, `orders/sync/route.ts`,
     `admin/products/*`, `admin/orders/*` all have `try/catch` file fallbacks.
4. **Storefront bypasses the DB entirely.** Pages read static seed files directly:
   `src/app/page.tsx`, `src/context/CartContext.tsx`, `src/app/produk/[slug]/page.tsx`
   (`@/data/products`, `@/data/product-rich-details`, `@/data/testimonials`);
   plus editorial `articles`, `branches`, `methods`, `history`, `testimonials`.

## 2. Goal
Stand up a **real, running PostgreSQL** and make it the **single source of truth**
for all dynamic data, removing every JSON-file / static-seed fallback.

## 3. Decisions (resolved)
- **Engine:** PostgreSQL (consistent with `DATABASE-ARCHITECTURE.md`).
- **Local provisioning:** `embedded-postgres` (already installed). It downloads and
  runs the genuine PostgreSQL 18.4 server binary in-process — a real DB, not a mock.
  **Verified live:** a test boot connected, ran `select version()`, and stopped cleanly.
- **Driver:** Prisma 7 requires a driver adapter for PostgreSQL →
  `@prisma/adapter-pg` + `pg` (both already installed) + `@types/pg`.
- **Credentials (dev):** `postgres` / `password`, port `5432`, db `penaameen`
  → `postgresql://postgres:password@localhost:5432/penaameen`.
- **Schema apply:** use `prisma db push` for the initial dev schema (reliable,
  non-interactive). A proper `prisma migrate dev --name init` can follow later;
  migrations were explicitly deferred in the architecture docs.
- **Existing runtime file data:** `live_products.json` / `live_orders.json` are
  dev artifacts with no authoritative value → **delete** and stop writing them.
  Seed catalog from the canonical `src/data/products.ts` via `prisma/seed.ts`.

## 4. Work already done this session (do not redo)
- `npm install pg @prisma/adapter-pg @types/pg` ✅
- `npm install -D embedded-postgres` (pulled `@embedded-postgres/windows-x64@18.4.0-beta.17`) ✅
- Live Postgres 18.4 boot + SQL query test ✅ (proves the approach works on this machine)

## 5. Implementation tasks

### Tier 1 — Make the DB the single source of truth (core fix, must validate)
1. **Schema engine.** In `prisma/schema.prisma` change
   `datasource db { provider = "mysql" }` → `provider = "postgresql"`.
   (`BigInt`→`bigint`, `Json`→`jsonb` are native in Postgres; no field changes needed.)
2. **Adapter wiring.**
   - `src/lib/prisma.ts`: construct `PrismaClient` with
     `new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL }))`
     (keep the global singleton + proxy pattern).
   - `prisma/seed.ts`: replace `new PrismaClient()` with the same adapter-based client.
3. **Config / env.**
   - `prisma.config.ts`: default datasource url →
     `process.env["DATABASE_URL"] ?? "postgresql://postgres:password@localhost:5432/penaameen"`.
   - `.env`: set `DATABASE_URL="postgresql://postgres:password@localhost:5432/penaameen"`.
   - `.env.example`: add the same `DATABASE_URL` (postgresql) line, documented.
   - Add `scripts/dev-db.mjs` (embedded-postgres bootstrap, keep-alive, SIGINT/SIGTERM stop).
   - `package.json` scripts: `db:start` (`node scripts/dev-db.mjs`),
     `db:push` (`prisma db push`), `db:seed` (existing `tsx prisma/seed.ts`),
     `db:reset` (`prisma db push --force-reset && npm run db:seed`).
4. **Apply + seed.** `npm run db:start` (terminal A) → `npm run db:push` → `npm run db:seed`.
5. **Rewrite `src/lib/admin/products.ts` to Prisma** (delete all `fs`/file logic):
   - `getProducts`, `getProductById`, `getProductBySlug`, `getProductCategories`,
     `createProduct`, `updateProduct`, `setProductStatus`, `deleteProduct`.
   - Map `Product` ↔ `AdminProduct`: `category` = `product.category.name`;
     `status` = `ProductStatus` enum (published/draft/archived);
     `stockQuantity` = `stock`; `price` = `Number(product.price)`; keep
     `shortDescription/sku/salePrice/tags/seo*/relatedProductIds` where present;
     `createdAt`/`updatedAt` from the row.
   - `createProduct`: resolve `categoryId` from category name (upsert category).
6. **Rewrite `src/lib/admin/orders.ts` to Prisma-only** (delete `loadFileOrders`/
   `saveFileOrders`/`registerLiveOrder` and the file-merge):
   - `getOrders`, `getOrderById`, `getOrderStatusCounts`, `getSalesAnalytics`,
     `transitionOrder`. Reuse the existing Prisma→`AdminOrder` mapping that is
     already drafted in the file (the `dbOrders.map(...)` blocks); drop the
     `catch {}` fallback and the `registerLiveOrder(order)` file write.
   - `transitionOrder` keeps `prisma.order.update` + `orderStatusHistory.create`.
7. **Clean every API route** — remove `try/catch` file fallbacks:
   - `src/app/api/products/route.ts`, `api/products/[slug]/route.ts`
   - `src/app/api/orders/route.ts` (POST: drop `registerLiveOrder`+file GET fallback;
     GET: Prisma only), `api/orders/[id]/route.ts`, `api/orders/[id]/snap/route.ts`
   - `api/orders/sync/route.ts`: rewrite to **upsert into `prisma.order`** instead of
     writing `live_orders.json` (or remove if obsolete once POST/orders is authoritative).
   - `api/admin/products/route.ts`, `api/admin/products/[id]/route.ts`,
     `api/admin/products/[id]/status/route.ts` (now call Prisma-backed lib).
   - `api/admin/orders/[id]/status/route.ts`, `api/admin/orders/[id]/transition/route.ts`
     (drop `registerLiveOrder`; rely on `transitionOrder`).
   - `api/cart/route.ts`, `api/cart/items/[productId]/route.ts`,
     `api/addresses/route.ts`, `api/addresses/[id]/route.ts`,
     `api/shipping/rates/route.ts`: confirm Prisma-only (remove any silent fallback).
   - `api/webhooks/clerk/route.ts`, `api/webhooks/midtrans/route.ts`: already Prisma; keep.
8. **Delete** `src/data/live_products.json`, `src/data/live_orders.json`.

### Tier 2 — Storefront catalog authoritative (honors "everything")
9. Replace direct `@/data/products` reads with DB-backed queries:
   - `src/app/page.tsx` (featured products) → server-side Prisma or `/api/products`.
   - `src/context/CartContext.tsx` → fetch catalog from `/api/products` (or pass via
     server component) instead of importing the static array.
   - `src/app/produk/[slug]/page.tsx` → `prisma.product.findUnique` for the product
     (keep `@/data/product-rich-details` + testimonials for Tier 3 unless also migrated).

### Tier 3 — Editorial content into the DB (largest workstream; staged)
10. Add models: `Article`, `Branch`, `Method`, `HistoryMilestone`, `Testimonial`
    (with SEO/category fields as needed) to `prisma/schema.prisma`.
11. Extend `prisma/seed.ts` to load `src/data/{articles,branches,methods,history,testimonials}.ts`
    into those tables.
12. Add a content service (e.g. `src/lib/content.ts`) and rewire the pages that
    import static data: `src/app/artikel/*`, `src/app/cabang/*`, `src/app/metode/*`,
    `src/app/sejarah/page.tsx`, `src/components/sections/HistoryTimelineSection.tsx`,
    `src/components/sections/TestimonialsSection.tsx`. These become async server
    components reading from Prisma.

> Tier 3 is the bulk of "everything" but is independent and can be staged after
> Tier 1+2 are verified, to keep the core fix safe and testable first.

## 6. Validation (run after Tier 1)
- `npm run typecheck` and `npm run lint` (must pass; current routes reference
  `loadFile*`/`registerLiveOrder` that will be removed).
- `npm run build` (Next 16 production build).
- `npm run test` (existing vitest suites; confirm none assert file-fallback behavior).
- **Live smoke test:** with `db:start` running, `db:push`, `db:seed`, then
  `curl localhost:3000/api/products` returns seeded products; create a product via
  `POST /api/admin/products`; confirm it persists by re-fetching. Confirm
  `live_*.json` are no longer written.

## 7. Risks / notes
- `embedded-postgres` is **dev-only**; production needs a managed Postgres URL in
  `DATABASE_URL` (provider-agnostic). No production credentials are set here.
- Prisma 7 driver-adapter change is mandatory; `new PrismaClient()` alone will fail
  to connect to Postgres. Both `prisma.ts` and `seed.ts` must use `PrismaPg`.
- Removing file fallbacks makes the app hard-depend on a running DB (intended), so
  `db:start` must be running for `next dev`.
- Editorial (Tier 3) pages currently import data synchronously; converting to async
  DB reads is the largest, most page-touching change and should be reviewed for
  SEO/URL stability (per AGENTS.md migration-sensitivity rules).
- `src/lib/admin/api-settings.ts` / `src/data/api_settings.json` (API-access admin)
  are out of the modeled schema; flag for a later Settings model if "everything"
  must include them.

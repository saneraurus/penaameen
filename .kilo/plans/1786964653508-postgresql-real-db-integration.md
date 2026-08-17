# Plan: Real PostgreSQL as the Single Source of Truth

## Status
Implementation was started in an implementation-capable turn and progressed far.
The **current turn is in plan mode** (permission rules deny all source edits except
this plan file), so the final cleanup + validation steps below must be run by an
implementation-capable agent / after exiting plan mode.

## 1. Why there was "no real database"
- `prisma/schema.prisma` declared `provider = "mysql"` while `.env` pointed at a
  non-running MySQL server. Approved architecture (`docs/DATABASE-ARCHITECTURE.md:9`)
  mandates **PostgreSQL**.
- No migrations existed; schema never applied.
- Every API route + both admin data libs wrapped Prisma in `try/catch` and fell back
  to `src/data/live_products.json` / `src/data/live_orders.json` (and static
  `src/data/*.ts`). The app ran on files, not a DB.
- Storefront also imported static `src/data/*` directly.

## 2. Done (already applied to the working tree)
- **Engine + drivers:** schema `provider` → `postgresql`; installed `pg`,
  `@prisma/adapter-pg`, `@types/pg`, `embedded-postgres` (dev-only).
- **Adapter wiring:** `src/lib/prisma.ts` and `prisma/seed.ts` construct
  `PrismaClient` with `new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL }))`.
- **Provisioning:** `scripts/dev-db.mjs` (embedded Postgres bootstrap, keep-alive,
  SIGINT/SIGTERM stop) + npm scripts `db:start`, `db:push`, `db:seed`, `db:reset`.
- **Env/config:** `.env` + `.env.example` + `prisma.config.ts` use
  `postgresql://postgres:password@localhost:5432/penaameen`.
- **Schema applied + seeded:** `prisma db push` succeeded against a real PostgreSQL
  18.4; `npm run db:seed` loaded 3 categories + 19 products. (Verified a live PG boot
  connects and runs SQL.)
- **Persistence layer rewritten to Prisma (file-store removed):**
  - `src/lib/admin/products.ts` — Prisma-backed (getProducts/getProductById/
    getProductBySlug/createProduct/updateProduct/setProductStatus/deleteProduct/
    getProductCategories), maps `Product` ↔ `AdminProduct`.
  - `src/lib/admin/orders.ts` — Prisma-only (getOrders/getOrderById/
    getOrderStatusCounts/getSalesAnalytics/transitionOrder + mapping), file-store
    functions deleted.
  - **No remaining references** to `loadFileProducts`/`loadFileOrders`/
    `registerLiveOrder`/`live_products.json`/`live_orders.json` anywhere in `src/`
    (grep clean).
- Additional working-tree changes already present (from the implementation pass):
  `src/app/page.tsx`, `src/app/checkout/payment/page.tsx`, `src/app/orders/[id]/page.tsx`,
  `src/app/api/orders/route.ts`, `src/app/api/orders/sync/route.ts`,
  `src/app/api/products/route.ts`, `src/app/api/admin/orders/[id]/status/route.ts`,
  `src/lib/admin/system-controls.ts`, `ProductCatalogSection.tsx`, new unit tests.

## 3. Remaining (require implementation mode — blocked here)
1. **Delete dev artifacts** (no longer referenced):
   `src/data/live_products.json`, `src/data/live_orders.json`.
2. **Restart the DB** (the background embedded-postgres was stopped when the session
   changed): `npm run db:start` (keep running for `next dev` / validation).
3. **Validate:**
   - `npm run typecheck` and `npm run lint`
   - `npm run build` (Next 16 production build)
   - `npm run test`
   - **Live smoke:** with DB up → `curl localhost:3000/api/products` returns the 19
     seeded products; `POST /api/admin/products` then re-fetch to confirm persistence;
     confirm `live_*.json` are not re-created.

## 4. Scope notes ("everything")
- The transactional/commerce layer (products, categories, cart, orders, addresses,
  users, audit, notifications, system control) is now DB-backed.
- **Editorial content is NOT yet DB-backed** (Tier 3 of the original plan): pages
  `artikel/*`, `cabang/*`, `metode/*`, `sejarah/page.tsx`,
  `TestimonialsSection.tsx`, `HistoryTimelineSection.tsx` still import static
  `src/data/{articles,branches,methods,history,testimonials}.ts`. Moving these into
  Postgres (new models + seed + content service + async page rewrites) is the
  remaining "everything" expansion and should be reviewed for SEO/URL stability per
  AGENTS.md before execution.
- `src/lib/admin/api-settings.ts` / `src/data/api_settings.json` (API-access admin)
  remain file-based config; flag for a later Settings model if required.

## 5. Risks
- `embedded-postgres` is dev-only; production needs a managed Postgres `DATABASE_URL`.
- Prisma 7 driver adapter is mandatory — both `prisma.ts` and `seed.ts` use `PrismaPg`.
- App now hard-depends on a running DB; `db:start` must be up for `next dev`.

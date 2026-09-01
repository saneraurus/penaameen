# Supabase Database Migration Plan

## Goal
Migrate all database operations from embedded local Postgres to Supabase Postgres for every environment. Clerk remains the auth provider. Prisma schema and RLS behavior are preserved.

## Current State
- Embedded Postgres via `scripts/dev-db.mjs` on port 5432
- Prisma Client 7.9.1 with `@prisma/adapter-pg` + `pg` Pool
- Schema created via `prisma db push` (no baseline migration)
- One existing migration: `20260822_rls_policies/migration.sql` (RLS only; applied manually)
- `RLS_ENABLED=false` in `.env.example` and `.env.local`; RLS not enforced
- 15 Prisma models in `prisma/schema.prisma`
- Static data in `src/data/` is seeded into DB via `prisma/seed.ts`

## Target State
- Supabase Postgres only (no embedded Postgres)
- Supabase project with:
  - Transaction pooler (port 6543) for normal app traffic + RLS enforcement
  - Direct connection (port 5432) for staff/admin operations bypassing RLS
  - Separate `penaameen_staff` DB role with `BYPASSRLS`
- Prisma migrations as source of truth for schema changes
- `RLS_ENABLED=true` enforced in all environments
- Dev startup via `supabase start` (Docker) or direct connection to Supabase cloud project

## Files Requiring Changes

| File | Change |
|------|--------|
| `.env.example` | Replace `DATABASE_URL` / `DATABASE_STAFF_URL` with `SUPABASE_DB_URL` / `SUPABASE_DB_STAFF_URL`; set `RLS_ENABLED=true` |
| `.env` | Same replacements as `.env.example` |
| `.env.local` | Same replacements as `.env.example` |
| `src/lib/prisma.ts` | Replace `process.env["DATABASE_URL"]` with `process.env["SUPABASE_DB_URL"]`; add pooler-compatible pool options |
| `src/lib/prisma-staff.ts` | Replace `process.env.DATABASE_STAFF_URL` with `process.env["SUPABASE_DB_STAFF_URL"]` |
| `prisma/seed.ts` | Replace `process.env["DATABASE_URL"]` with `process.env["SUPABASE_DB_URL"]` |
| `src/application/config/config.ts` | Replace `DATABASE_URL` readiness check with `SUPABASE_DB_URL` |
| `scripts/staging-readiness.mjs` | Replace `DATABASE_URL` required check with `SUPABASE_DB_URL` |
| `tests/unit/config.test.ts` | Update test fixtures from `DATABASE_URL` to `SUPABASE_DB_URL` |
| `package.json` | Remove `embedded-postgres`; replace `db:start`/`db:push`/`db:reset` scripts |
| `scripts/start-all.mjs` | Remove embedded Postgres logic; support `supabase start` or TCP wait on pooler URL |
| `scripts/dev-db.mjs` | Delete |
| `.gitignore` | Remove `.pgdata/` and `.pgdata-*/` entries |
| `prisma/schema.prisma` | No changes needed |
| `prisma/migrations/20260822_rls_policies/migration.sql` | No changes needed; apply as-is to Supabase |

## Environment Variables

### `.env.example` replacements

```env
# === Database (Supabase) ===
# Transaction pooler (port 6543) — normal app traffic + RLS enforcement
SUPABASE_DB_URL=postgresql://postgres:<password>@<project-ref>.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
# Direct connection (port 5432) — staff/admin operations bypassing RLS
SUPABASE_DB_STAFF_URL=postgresql://penaameen_staff:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require
RLS_ENABLED=true
```

### Connection string notes
- `SUPABASE_DB_URL` must use the **transaction pooler** (port 6543). Transaction pooling is required because Supabase only supports transaction-scoped pooling for serverless/Edge compatibility.
- `SUPABASE_DB_STAFF_URL` uses **direct connection** (port 5432) because staff operations bypass RLS and should not share pooled state.
- Both URLs require `sslmode=require` (Supabase enforces TLS).
- `client_encoding=UTF8` is preserved via `Pool` options, not connection string params, because pgBouncer strips unknown params.

## Prisma Connection Changes

### `src/lib/prisma.ts`
```typescript
const adapter = new PrismaPg(
  new Pool({
    connectionString: process.env["SUPABASE_DB_URL"],
    options: "-c client_encoding=UTF8",
    connectTimeout: 10_000,
    keepAlives: 1,
    keepAliveIdle: 30_000,
  }),
);
```

### `src/lib/prisma-staff.ts`
```typescript
const adapter = new PrismaPg(
  new Pool({
    connectionString: process.env["SUPABASE_DB_STAFF_URL"],
    options: "-c client_encoding=UTF8",
  }),
);
```

### `prisma/seed.ts`
Replace `process.env["DATABASE_URL"]` with `process.env["SUPABASE_DB_URL"]`.

## Supabase Project Setup

### SQL executed in Supabase SQL Editor

```sql
-- 1. Create staff role
CREATE ROLE IF NOT EXISTS penaameen_staff WITH LOGIN PASSWORD '<secure-password>';
GRANT BYPASSRLS TO penaameen_staff;

-- 2. Apply existing RLS policies (run full contents of migration.sql)
-- Paste the full migration.sql content here, excluding the staff role creation
-- since we already created it above.
```

### Required user inputs
- Supabase project ref
- Transaction pooler URL (port 6543)
- Direct connection URL (port 5432)
- Staff role password (chosen by team)

## Migration Path: `db push` → Prisma Migrations

Current schema was created via `prisma db push`; there is no baseline migration. We must create one before using `migrate deploy` in production.

### Step 1: Create baseline migration
```bash
npx prisma migrate dev --name baseline
```

This generates a migration from the current `schema.prisma` state. Apply it to Supabase via:
```bash
npx prisma migrate deploy
```
or via Supabase SQL Editor if direct `deploy` fails due to pooler constraints.

### Step 2: Merge existing RLS migration
The existing `20260822_rls_policies/migration.sql` contains custom SQL (roles, functions, policies). It must be applied **after** the baseline migration creates the tables.

Option A (recommended): Create a new migration that includes the RLS SQL:
```bash
npx prisma migrate dev --name apply-rls
```
Then paste the RLS SQL into the generated migration file before applying.

Option B: Apply RLS SQL manually via Supabase SQL Editor after `migrate deploy`.

### Step 3: Verify no `db push` usage
After baseline migration exists:
- Remove `db:push` script from `package.json`
- Remove `db:reset` script or replace with `prisma migrate reset && npm run db:seed`
- Ensure CI/CD uses `prisma migrate deploy`, not `db push`

## Dev Script Changes

### `scripts/start-all.mjs`
- Remove embedded Postgres spawn/wait logic (lines 61–128)
- If `SUPABASE_START_CMD` is set, spawn it and wait for `supabase start` readiness
- Otherwise, extract host/port from `SUPABASE_DB_URL` and wait for TCP connect
- Launch Next.js dev server as before
- Update log output to show `SUPABASE_DB_URL`

### `package.json` scripts
```json
{
  "db:start": "supabase start",
  "db:reset": "prisma migrate reset --force && npm run db:seed",
  "db:push": "prisma migrate dev --name init",
  "db:migration:status": "prisma migrate status"
}
```

Note: `db:push` is removed. `db:start` assumes Supabase CLI is installed.

### Removed dependencies
- `embedded-postgres` from `devDependencies`
- `scripts/dev-db.mjs` deleted

## Validation

### Pre-flight
- [ ] Supabase project created and connection strings provided
- [ ] `penaameen_staff` role created with `BYPASSRLS`
- [ ] `.env.example`, `.env`, `.env.local` updated
- [ ] All code references to `DATABASE_URL` / `DATABASE_STAFF_URL` replaced
- [ ] `embedded-postgres` removed from `package.json` and `scripts/dev-db.mjs` deleted

### Schema
- [ ] `npx prisma migrate deploy` succeeds against Supabase
- [ ] All 15 tables present in Supabase Table Editor
- [ ] Indexes present (`@@index` fields in Prisma schema)
- [ ] `prisma/migrations` directory contains baseline + RLS migrations

### RLS
- [ ] `RLS_ENABLED=true` set in `.env.local`
- [ ] Customer queries succeed for own data
- [ ] Customer queries return empty/blocked for other users' data
- [ ] Staff queries via `staffPrisma` bypass RLS and return all data

### Application
- [ ] `npm run db:seed` completes without errors
- [ ] `npm run test` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] `npm run db:migration:status` shows no pending migrations

## Risks

| Risk | Mitigation |
|------|-----------|
| pgBouncer transaction pooling + `SET LOCAL` RLS | `SET LOCAL` is transaction-scoped; compatible with transaction pooling. Verified by existing RLS migration design. |
| No baseline migration; schema drift | Generate `baseline` migration immediately after updating env vars, before any further schema changes. |
| Existing local data loss | **Requires user decision** (see open question below). |
| `prisma migrate deploy` via pooler fails | Apply migration SQL manually via Supabase SQL Editor as fallback. |
| Staff password in env files | Store `SUPABASE_DB_STAFF_URL` in deployment secrets only; never commit `.env` with real credentials. |
| `supabase start` port conflict | Supabase defaults to 54322; document this in `README` or `docs/ENVIRONMENT-STRATEGY.md`. |

## Open Decisions

1. **Local development data**: RESOLVED 2026-09-01 — discarded; Supabase seeded from `prisma/seed.ts`.
2. **Local dev mode**: RESOLVED 2026-09-01 — direct connection to the Supabase cloud project (no Docker); matches Vercel production topology exactly.
3. **Supabase region**: RESOLVED — project `pvlclmdcirhmcakqehcc` exists in `ap-south-1`; pooler host `aws-0-ap-south-1.pooler.supabase.com`.

## Execution Status (2026-09-01) — COMPLETE except owner-password reset

Done:
- Supabase linked (`supabase link`, project ref above); `.env` files rewired to `SUPABASE_DB_URL` / `SUPABASE_DB_STAFF_URL` / `SUPABASE_DB_MIGRATE_URL`, `RLS_ENABLED=true`.
- Roles: `penaameen_app` (LOGIN, NOBYPASSRLS) and `penaameen_staff` (LOGIN, BYPASSRLS) with default-privilege grants; tables/functions owned via `prisma migrate deploy` run as staff.
- Both migrations applied and recorded by Prisma (`20260821000000_baseline_schema`, `20260822000000_rls_policies` — directory renamed to canonical 14-digit form); baseline's generated `CREATE SCHEMA` statement removed (Supabase schema pre-exists; staff lacks database-level CREATE).
- Live RLS verification passed: app role blocked on anon customer insert, self-row access with `SET LOCAL app.current_clerk_id`, staff bypass insert/delete; 20 tables, 9 policy tables, 30 policies.
- DB seeded (21 products, 6 categories, articles/branches/methods/history/testimonials/admin).
- `embedded-postgres` and `scripts/dev-db.mjs` removed; `start-all.mjs` rewritten for cloud checks; `db:start`/`db:push`/`db:reset` replaced by `db:migrate`.
- Code refs updated (`prisma.ts`, `prisma-staff.ts`, `seed.ts` → staff URL, `config.ts`, `staging-readiness.mjs`, tests); 53 suites / 204 tests pass; typecheck + build pass.
- Vercel (`snrs/penaameen-web`): pushed `SUPABASE_DB_URL`, `SUPABASE_DB_STAFF_URL`, `RLS_ENABLED`, `APP_BASE_URL`, `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAILS`, `EMAIL_FROM` to production/preview/development.

Deviations from original plan: staff/migrate use the session pooler (port 5432) instead of the IPv6-only `db.<ref>` direct host (Vercel egress is IPv4); `uselibpqcompat=true&sslmode=require` in URLs because Supavisor presents an unverifiable chain (libpq-semantic encryption-only, per Supabase guidance); pooler usernames require the `.pvlclmdcirhmcakqehcc` suffix.

Remaining: user must reset the Supabase Dashboard database password (Connect → Database) to activate `SUPABASE_DB_MIGRATE_URL`; rotate the Supabase CLI access token and any secrets exposed in chat; Vercel still lacks a `CLERK_SECRET_KEY` matching its (v2-format) publishable key.

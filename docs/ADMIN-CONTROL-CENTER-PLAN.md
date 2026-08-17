# PENA AMEEN Admin Control Center — Implementation Plan

**Status:** APPROVED (owner decisions, 2026-08-17)

**Source spec:** `PENA_AMEEN_ADMIN_ARCHITECTURE.md` v1.0 (full architecture & agent
implementation specification for the Admin Control Center).

**Authority:** Per `docs/DECISION-LOG.md` D010, the Admin Control Center spec is
approved as the admin architecture and supersedes earlier ADMIN-* documents where
they conflict. D011 confirms providers by implementation. D012 retains the
capability-first RBAC model. D013 approves all spec subsystems in scope.

---

## 1. Decision summary (2026-08-17)

| # | Decision | Effect |
|---|---|---|
| D010 | Spec supersedes conflicting admin docs | Build scope follows the 16-module spec; ADMIN-PRD/ARCHITECTURE/IA remain as background |
| D011 | Providers confirmed by implementation | Midtrans, RajaOngkir, Resend, Clerk are the working stack; adapters stay isolated behind ports so future swaps are bounded |
| D012 | Capability-first RBAC retained | Existing Clerk org roles + capability map stay; spec role names (Owner, Finance, Warehouse, ...) are display labels only, mapped later |
| D013 | All spec subsystems in scope | CS inbox, workforce, automation engine, AI assistant, marketing, analytics are approved; sequenced after foundations |

## 2. Compatibility matrix (spec module vs repository vs phase)

| Spec module | Repo state (2026-08-17) | Status | Build phase |
|---|---|---|---|
| 01 Command Center | Dashboard: KPI cards, revenue chart, work queues, recent orders | PARTIAL | F + 7 |
| 02 Orders | List/detail/transition; fake tracking data | PARTIAL | F + 2 |
| 03 Products | CRUD via JSON file only; categories absent | PARTIAL | F + 2 |
| 04 Customers | Missing | BLOCKED (CUST-001) | 2 |
| 05 WhatsApp / CS | Missing (provider UNKNOWN: TECH-003) | BLOCKED | 4 |
| 06 Workforce | Mock staff list (being replaced by Clerk-derived data) | PARTIAL | F + 4 |
| 07 Automation | Missing | APPROVED, not started | 5 |
| 08 Shipping | Rates API only; invented fallback rates | PARTIAL | F + 3 |
| 09 Payments | Casaku QRIS (primary, dynamic) + Midtrans Snap (backup) + webhooks + settings; no admin module | PARTIAL | F + 3 |
| 10 Content / CMS | Static placeholders | NOT STARTED | 6 |
| 11 Marketing | Missing (promotions CDR) | BLOCKED | 6 |
| 12 Analytics | Revenue chart only (GA4/Search Console UNKNOWN) | NOT STARTED | 7 |
| 13 Integrations | API-access page; plaintext settings file | PARTIAL | F |
| 14 Users & RBAC | Clerk org roles + capability map (7 roles) | PARTIAL | F |
| 15 Audit | Type + interface only; nothing writes records | NOT STARTED | F |
| 16 Settings | API settings + staff access | PARTIAL | F + 7 |
| Notification center | Missing | NOT STARTED | F |
| Emergency controls | Missing | NOT STARTED | F |
| Task system | Missing | NOT STARTED | 4 |
| AI assistant (approval rules) | Missing | APPROVED, not started | 5 |

F = Foundation (this Step 1 package).

## 3. Phased build order

| Step | Content | Exit criteria |
|---|---|---|
| 0 | Governance reconciliation (this doc, decision log, unknown registry) | Documents committed; no feature code |
| 1 | Control-plane foundations: audit write path + `/admin/audit`, secret encryption/masking, invented-data removal, persistence unification (products → Prisma), notification center, emergency controls, real integration health checks | All new units tested; `npm run check` green — **DONE 2026-08-17**: `npm run check` green (prettier, eslint `--max-warnings=0`, `tsc --noEmit`, 91/91 vitest, production build). Owner committed the control-plane code in `e85992b` and the PostgreSQL persistence migration in `c21cf55`; honest checkout/payment fix, repo-wide format, and lint/type hygiene closed in the working tree on 2026-08-17 |
| 2 | Commerce modules: orders (notes, assignment), products (categories, variants), inventory movement ledger, customers | Typecheck + tests green |
| 3 | Integrations: Midtrans/RajaOngkir/email adapters behind existing ports; admin payment/shipping modules | Typecheck + tests green |
| 4 | Workforce + CS inbox (no AI): workers, assignments, tasks, conversation states | Typecheck + tests green |
| 5 | Automation engine: event bus, triggers/conditions/actions, retry/backoff/idempotency, workflow builder UI; AI assistant with configurable approval rules | Typecheck + tests green |
| 6 | Content & Marketing: CMS states DRAFT/REVIEW/PUBLISHED/ARCHIVED, SEO controls; campaigns after promotion policy | Typecheck + tests green |
| 7 | Analytics & Operations: dashboard consolidation, GA4/Search Console adapters (provisional), notification center completion, system health | Typecheck + tests green |
| 8 | Hardening: security/permission audit, webhook + idempotency testing, failure/retry testing, responsive QA, performance, backup/recovery test | Full build + test + audit evidence |

## 4. Non-negotiable controls (from spec §3)

- Secrets never exposed client-side; encrypted at rest; masked in UI.
- Every sensitive mutation writes an audit event (append-only).
- Payment/shipping state from verified sources only; no invented rates,
  tracking numbers, or statuses.
- Automation idempotent and retryable.
- Destructive actions require confirmation + permission.
- RBAC enforced server-side.
- No integration marked connected unless verified (health checks must be real).

## 5. Repository hygiene backlog (found during analysis)

1. Plaintext secrets in `src/data/api_settings.json` + `TEST-KEY-*` fallbacks — Step 1 (resolved).
2. Invented tracking numbers (`JP...`), fallback courier rates, mock staff — Step 1 (resolved).
3. Split-brain persistence (Prisma vs JSON) with admin writes to JSON only — Step 1 (products), Step 2 (rest); owner removed the JSON file fallbacks entirely in `c21cf55` (PostgreSQL migration).
4. No audit writes despite type/interface — Step 1 (resolved).
5. No `prisma/migrations` directory; schema never migrated — Step 1 attempt, environment-limited; resolved locally by the PostgreSQL migration in `c21cf55` (embedded Postgres via `npm run db:start`, data in `.pgdata/`).
6. Stale E2E test (`foundation.spec.ts` references removed copy) — Step 8.
7. Docs/code drift (PROJECT.md describes foundation-only; code contains full
   e-commerce + admin) — Step 0 records it; PROJECT.md updated in Step 1 close.

## 6. Definition of done (Step 1)

- AuditLog/Notification/SystemControl models exist; Prisma generated client updated;
  schema applied to the local embedded PostgreSQL (`npm run db:start`, data in `.pgdata/`)
  by the owner's migration commit `c21cf55` (2026-08-17). The earlier P1001/MySQL
  environment limitation is superseded: the stack is now PostgreSQL-only and the JSON
  file fallbacks were removed in `c21cf55`.
- Audit events recorded for: order transitions, product create/update/status,
  staff role change, API settings change, midtrans webhook outcomes,
  emergency control changes. `/admin/audit` page reads them.
- Secrets: encrypted at rest when `APP_SETTINGS_ENCRYPTION_KEY` set; masked in API
  and UI; no fake fallback keys; real health checks in `/api/admin/settings/api/test`.
- No invented tracking numbers, courier rates, staff records, or customer records remain.
  The checkout flow was made honest on 2026-08-17: `src/app/checkout/payment/page.tsx`
  no longer fabricates VA numbers, QRIS codes, tracking numbers, order refs, fallback
  addresses/customer data, or payment-success claims; `src/app/api/orders/route.ts`
  fails closed (400/500) instead of inventing prices, addresses, or order IDs; the
  admin WhatsApp number comes from `NEXT_PUBLIC_ADMIN_WHATSAPP` (see `.env.example`);
  invented contact values in `src/data/api_settings.json` were cleared.
- Admin product writes persist through Prisma (dev fallback to JSON documented).
- Notification center + emergency controls functional with elevated permission.
- Unit tests added; `npm run check` green (prettier, eslint `--max-warnings=0`,
  `tsc --noEmit`, 91/91 vitest, production build). Only known build warning:
  Next.js deprecates the `middleware` file convention in favor of `proxy` (pre-existing,
  deferred).

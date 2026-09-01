# RLS and Session Isolation Implementation

**Status:** PARTIAL. Code and migration are implemented; activation requires database-role provisioning and staging verification.

## Runtime Contract

- Clerk remains the browser identity and session provider.
- Customer routes establish `SET LOCAL app.current_clerk_id` and `SET LOCAL app.actor_kind = 'customer'` inside the same Prisma transaction used for every protected query.
- Verified provider webhooks and worker jobs use `app.actor_kind = 'system'` only after signature/authentication checks.
- Customer-owned tables use PostgreSQL native RLS with `FORCE ROW LEVEL SECURITY`.
- Staff authorization remains application-layer capability authorization and must use a separately provisioned `SUPABASE_DB_STAFF_URL` (implemented: Supabase role `penaameen_staff`, `BYPASSRLS`, session pooler port 5432).
- `RLS_ENABLED=true` is required before customer, staff, or worker context helpers execute.

## Activation Sequence

1. Provision a non-owner application database role for `SUPABASE_DB_URL`. IMPLEMENTED 2026-09-01: Supabase role `penaameen_app` (NOBYPASSRLS) behind the transaction pooler (port 6543).
2. Provision a separate audited staff role for `SUPABASE_DB_STAFF_URL`; it must have the approved permissions for staff operations and must not be silently derived from the application URL. IMPLEMENTED 2026-09-01: `penaameen_staff` (LOGIN, BYPASSRLS) on the session pooler (port 5432).
3. Apply `prisma/migrations/20260822000000_rls_policies/migration.sql` with a migration owner role. IMPLEMENTED 2026-09-01 via `prisma migrate deploy` (history table created by Prisma; directory name normalized to the 14-digit Prisma format).
4. Confirm the application role cannot bypass RLS and the staff role can perform only approved admin operations. VERIFIED 2026-09-01 against `pvlclmdcirhmcakqehcc`: anonymous customer insert blocked by RLS, identified self-row write/read passes, staff bypass confirmed, 9 policy tables / 30 policies.
5. Set `RLS_ENABLED=true` in staging.
6. Run customer A/customer B isolation tests across User, Address, Cart, CartItem, Order, OrderItem, OrderStatusHistory, ChatSession, and ChatMessage.
7. Verify signed Casaku/Midtrans webhook processing and worker jobs under system context.
8. Promote the same role and migration procedure to production.

## Non-Negotiable Rules

- Never use the PostgreSQL table-owner connection as the application runtime connection after `FORCE ROW LEVEL SECURITY` is enabled.
- Never use `SET` or `SET SESSION` for request identity with a pooled connection. Use `SET LOCAL` within the transaction that performs the query.
- Never pass an unverified provider request into system context.
- Never use system context for a customer request.
- Keep application ownership checks during rollout; RLS is defense in depth, not a reason to remove domain authorization.

## Current Blockers

- Resolved 2026-09-01: Supabase Postgres is the single database for all environments; both Prisma migrations are applied and recorded (`prisma migrate status` = up to date).
- Resolved 2026-09-01: `SUPABASE_DB_STAFF_URL` is provisioned in local, `.env.example`, and Vercel (production/preview/development).
- Owner-role `SUPABASE_DB_MIGRATE_URL` remains a placeholder until the Supabase Dashboard database-password reset; the staff-role URL currently also serves `prisma migrate deploy`.
- Database-backed cross-user isolation tests require the migration and two test identities in an isolated test database.
- Checkout order creation still requires a single transaction-client refactor before RLS activation for guest and authenticated checkout paths.

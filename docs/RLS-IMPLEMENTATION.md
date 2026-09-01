# RLS and Session Isolation Implementation

**Status:** PARTIAL. Code and migration are implemented; activation requires database-role provisioning and staging verification.

## Runtime Contract

- Clerk remains the browser identity and session provider.
- Customer routes establish `SET LOCAL app.current_clerk_id` and `SET LOCAL app.actor_kind = 'customer'` inside the same Prisma transaction used for every protected query.
- Verified provider webhooks and worker jobs use `app.actor_kind = 'system'` only after signature/authentication checks.
- Customer-owned tables use PostgreSQL native RLS with `FORCE ROW LEVEL SECURITY`.
- Staff authorization remains application-layer capability authorization and must use a separately provisioned `DATABASE_STAFF_URL`.
- `RLS_ENABLED=true` is required before customer, staff, or worker context helpers execute.

## Activation Sequence

1. Provision a non-owner application database role for `DATABASE_URL`.
2. Provision a separate audited staff role for `DATABASE_STAFF_URL`; it must have the approved permissions for staff operations and must not be silently derived from `DATABASE_URL`.
3. Apply `prisma/migrations/20260822_rls_policies/migration.sql` with a migration owner role.
4. Confirm the application role cannot bypass RLS and the staff role can perform only approved admin operations.
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

- The local database reports `20260822_rls_policies` as pending.
- `DATABASE_STAFF_URL` is not provisioned in local configuration.
- Database-backed cross-user isolation tests require the migration and two test identities in an isolated test database.
- Checkout order creation still requires a single transaction-client refactor before RLS activation for guest and authenticated checkout paths.

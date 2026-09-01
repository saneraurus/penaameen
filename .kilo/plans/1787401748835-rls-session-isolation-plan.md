# PENA AMEEN — Row-Level Security & Per-User Session Isolation Plan

**Phase:** 7 — Application Implementation (Security Hardening)
**Status:** PROPOSED — Awaiting implementation approval
**Owner:** Architecture team
**Dependencies:** Clerk authentication (existing), PostgreSQL 14+ (existing), Prisma ORM (existing)

---

## 1. Executive Summary

This plan defines the implementation of **PostgreSQL native Row-Level Security (RLS)** for customer data isolation, combined with **per-request session context propagation** via Clerk-authenticated middleware. Staff/admin authorization remains at the application layer per the approved authorization architecture.

**Key decisions (confirmed):**
- RLS: PostgreSQL native policies (defense in depth)
- Session context: `SET LOCAL app.current_user_id` per transaction (works with connection pooling)
- Actor model: RLS for customers only; staff uses application-layer capability checks
- Session store: Continue with Clerk cookies; middleware extracts `userId` and sets RLS context

---

## 2. Current State Analysis

### 2.1 Existing Authentication & Session
- **Provider:** Clerk (`@clerk/nextjs/server`)
- **Session mechanism:** HTTP-only, same-site cookies managed by Clerk
- **Identity resolution:** `auth()` returns `{ userId, orgRole, sessionClaims }`
- **Staff authorization:** Role → capability mapping in `clerk-auth.ts`
- **Customer authorization:** `authorization-service.ts` enforces ownership via `customerId`

### 2.2 Database Schema (Prisma)
Key tables with `userId` foreign keys requiring RLS:
| Table | Owner Column | Current Access Control |
|-------|--------------|------------------------|
| `User` | `id` (PK) | Application layer |
| `Address` | `userId` | Application layer |
| `Cart` | `userId` | Application layer |
| `Order` | `userId` | Application layer |
| `OrderItem` | via `Order.userId` | Application layer |
| `ChatSession` | `userId` | Application layer |

Tables NOT requiring customer RLS (public or staff-only):
- `Product`, `Category`, `Article`, `Branch`, `Method`, `HistoryMilestone`, `Testimonial`
- `AuditLog`, `Notification`, `SystemControl` (staff/system only)

### 2.3 Security Architecture References
- `docs/AUTHORIZATION-ARCHITECTURE.md` — Actor model, ownership rules, session baseline
- `docs/DATA-SECURITY-MODEL.md` — Data classification, access boundaries
- `docs/DATA-ACCESS-CONSTITUTION.md` — Repository/query ownership, transaction boundaries
- `docs/TECHNICAL-ARCHITECTURE.md` — Modular monolith, security boundaries

---

## 3. Architecture Design

### 3.1 RLS Policy Model

#### 3.1.1 Session Context Variable
```sql
-- Defined in migration; used by all RLS policies
CREATE OR REPLACE FUNCTION current_app_user_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('app.current_user_id', true), '')::uuid;
$$;
```

#### 3.1.2 Policy Pattern (per protected table)
```sql
-- Enable RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- SELECT: users see only their own row
CREATE POLICY user_select_own ON "User"
  FOR SELECT USING (id = current_app_user_id());

-- INSERT: users can only insert their own row (via upsert in webhook)
CREATE POLICY user_insert_own ON "User"
  FOR INSERT WITH CHECK (id = current_app_user_id());

-- UPDATE: users can only update their own row
CREATE POLICY user_update_own ON "User"
  FOR UPDATE USING (id = current_app_user_id());

-- DELETE: users cannot delete (soft delete via status); staff uses app layer
```

#### 3.1.3 Cascading Policies for Related Tables
```sql
-- Address: userId = current_app_user_id()
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
CREATE POLICY address_select_own ON "Address"
  FOR SELECT USING ("userId" = current_app_user_id());
CREATE POLICY address_modify_own ON "Address"
  FOR ALL USING ("userId" = current_app_user_id());

-- Cart: userId = current_app_user_id()
ALTER TABLE "Cart" ENABLE ROW LEVEL SECURITY;
CREATE POLICY cart_all_own ON "Cart"
  FOR ALL USING ("userId" = current_app_user_id());

-- Order: userId = current_app_user_id()
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
CREATE POLICY order_select_own ON "Order"
  FOR SELECT USING ("userId" = current_app_user_id());
CREATE POLICY order_insert_own ON "Order"
  FOR INSERT WITH CHECK ("userId" = current_app_user_id());

-- OrderItem: via Order join
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
CREATE POLICY orderitem_select_own ON "OrderItem"
  FOR SELECT USING (
    "orderId" IN (SELECT id FROM "Order" WHERE "userId" = current_app_user_id())
  );

-- ChatSession: userId = current_app_user_id()
ALTER TABLE "ChatSession" ENABLE ROW LEVEL SECURITY;
CREATE POLICY chatsession_all_own ON "ChatSession"
  FOR ALL USING ("userId" = current_app_user_id());
```

### 3.2 Session Context Propagation

#### 3.2.1 Middleware Design
```typescript
// src/middleware/rls-context.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function withRLSContext<T>(
  operation: () => Promise<T>
): Promise<T> {
  const { userId } = await auth();
  
  if (!userId) {
    // Unauthenticated: context is NULL; RLS policies deny all customer data
    return prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SET LOCAL "app.current_user_id" = ''`;
      return operation();
    });
  }

  // Resolve Clerk userId -> internal User.id (cuid)
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  });

  const internalUserId = dbUser?.id ?? userId; // fallback for guests

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SET LOCAL "app.current_user_id" = ${internalUserId}`;
    return operation();
  });
}
```

#### 3.2.2 Integration Points

| Layer | Integration Method |
|-------|-------------------|
| **API Routes** | Wrap handler with `withRLSContext()` |
| **Server Actions** | Wrap mutation with `withRLSContext()` |
| **Server Components** | Use `withRLSContext()` in data fetching functions |
| **Worker Jobs** | System actor: `SET LOCAL app.current_user_id = '00000000-0000-0000-0000-000000000000'` (bypasses RLS via policy exemption) |
| **Webhooks** | Clerk webhook: sets context to target user; Payment/Shipping webhooks: system context |

### 3.3 Staff/Admin Bypass Mechanism

Staff operations MUST NOT rely on RLS. Instead:

```sql
-- Superuser role for staff/admin operations
CREATE ROLE penaameen_staff NOLOGIN;

-- Grant bypass on all RLS-protected tables
GRANT SELECT, INSERT, UPDATE, DELETE ON 
  "User", "Address", "Cart", "Order", "OrderItem", "ChatSession"
  TO penaameen_staff;

-- Application connects with staff role for admin API routes
-- Middleware detects staff capability and switches connection role
```

```typescript
// src/middleware/staff-context.ts
export async function withStaffContext<T>(
  actor: StaffActor,
  operation: () => Promise<T>
): Promise<T> {
  // Verify capability at application layer first
  if (!actor.capabilities.has("required:capability")) {
    throw new AuthorizationError();
  }
  
  // Use dedicated Prisma client with staff role
  return staffPrisma.$transaction(operation);
}
```

---

## 4. Database Migration Plan

### 4.1 Migration Sequence

```sql
-- 1. Create session context function
CREATE OR REPLACE FUNCTION current_app_user_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('app.current_user_id', true), '')::uuid;
$$;

-- 2. Create staff bypass role
CREATE ROLE penaameen_staff NOLOGIN;

-- 3. Enable RLS + policies per table (see Section 3.1.2, 3.1.3)
-- Order: User → Address → Cart → Order → OrderItem → ChatSession

-- 4. Grant staff role permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON 
  "User", "Address", "Cart", "Order", "OrderItem", "ChatSession"
  TO penaameen_staff;

-- 5. Create RLS exemption policy for staff role
ALTER TABLE "User" FORCE ROW LEVEL SECURITY; -- ensures staff role also checked
-- Actually: staff connects AS penaameen_staff role, so policies don't apply
```

### 4.2 Rollback Plan
```sql
-- Disable RLS on all tables
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" DISABLE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- Drop function
DROP FUNCTION IF EXISTS current_app_user_id();

-- Drop role
DROP ROLE IF EXISTS penaameen_staff;
```

---

## 5. Implementation Tasks

### 5.1 Database Layer (Week 1)

| Task | Description | Files |
|------|-------------|-------|
| T1.1 | Create migration `20260822_rls_policies.sql` with function, role, and all policies | `prisma/migrations/.../migration.sql` |
| T1.2 | Add `penaameen_staff` role to Prisma schema datasource config | `prisma/schema.prisma` (datasource) |
| T1.3 | Create staff Prisma client factory | `src/lib/prisma-staff.ts` |
| T1.4 | Test RLS policies against all CRUD operations | `tests/integration/rls-policies.test.ts` |

### 5.2 Middleware Layer (Week 1)

| Task | Description | Files |
|------|-------------|-------|
| T2.1 | Create `withRLSContext()` utility | `src/middleware/rls-context.ts` |
| T2.2 | Create `withStaffContext()` utility | `src/middleware/staff-context.ts` |
| T2.3 | Refactor API routes to use `withRLSContext` | All `src/app/api/**/route.ts` |
| T2.4 | Refactor Server Actions to use `withRLSContext` | `src/app/**/actions.ts` |
| T2.5 | Update data fetching in Server Components | `src/app/**/page.tsx`, `layout.tsx` |

### 5.3 Application Layer Updates (Week 2)

| Task | Description | Files |
|------|-------------|-------|
| T3.1 | Remove manual `userId` filters from repositories (RLS handles it) | `src/application/repositories/**` |
| T3.2 | Add RLS context to worker job execution | `src/application/services/job-context.ts` |
| T3.3 | Update Clerk webhook to set RLS context for user sync | `src/app/api/webhooks/clerk/route.ts` |
| T3.4 | Update payment/shipping webhooks to use system context | `src/app/api/webhooks/**/route.ts` |

### 5.4 Testing & Validation (Week 2)

| Task | Description | Files |
|------|-------------|-------|
| T4.1 | Unit tests for `withRLSContext` / `withStaffContext` | `tests/unit/rls-context.test.ts` |
| T4.2 | Integration tests: customer A cannot read customer B data | `tests/integration/rls-isolation.test.ts` |
| T4.3 | Integration tests: staff bypass works for admin operations | `tests/integration/staff-bypass.test.ts` |
| T4.4 | E2E tests: session isolation across browser tabs | `tests/e2e/session-isolation.spec.ts` |
| T4.5 | Load test: RLS overhead with connection pooling | `tests/performance/rls-overhead.test.ts` |

### 5.5 Documentation & Observability (Week 2)

| Task | Description | Files |
|------|-------------|-------|
| T5.1 | Document RLS architecture in `docs/SECURITY-ARCHITECTURE.md` | `docs/SECURITY-ARCHITECTURE.md` |
| T5.2 | Add RLS context correlation ID to structured logs | `src/infrastructure/observability/console-logger.ts` |
| T5.3 | Add health check for RLS policy status | `src/app/api/v1/health/route.ts` |

---

## 6. Security Protocols

### 6.1 Session Isolation Guarantees

| Threat | Mitigation |
|--------|------------|
| Cross-user data read | RLS policy enforces `userId = current_app_user_id()` |
| Cross-user data write | RLS policy enforces `userId = current_app_user_id()` on INSERT/UPDATE |
| Session fixation | Clerk handles session rotation; RLS context derived per-request |
| Session hijacking | HTTP-only, Secure, SameSite=Strict cookies; short TTL |
| Privilege escalation (customer→staff) | Staff uses separate DB role; RLS policies don't apply to staff role |
| Connection pooling leakage | `SET LOCAL` scoped to transaction; auto-reset on release |

### 6.2 Audit Requirements

Every RLS-relevant operation logs:
```typescript
// In withRLSContext()
logger.info("RLS context established", {
  correlationId,
  actorKind: userId ? "customer" : "public",
  userId: userId ?? null,
  internalUserId: internalUserId ?? null,
});
```

### 6.3 Failure Modes

| Failure | Behavior | Recovery |
|---------|----------|----------|
| `SET LOCAL` fails | Transaction rolls back; 500 error | Retry with fresh connection |
| RLS policy missing | Data visible to wrong user (defense in depth: app layer still checks) | Migration validation test catches this |
| Staff role misconfigured | Admin operations fail closed | Alert + manual role grant |
| Clerk `userId` → `internalUserId` resolution fails | Treat as unauthenticated; RLS denies all | Log warning; user re-authenticates |

---

## 7. Performance Considerations

### 7.1 RLS Overhead
- **Expected overhead:** 1-3% per query (policy evaluation is simple equality check)
- **Connection pooling:** `SET LOCAL` works correctly with PgBouncer transaction pooling
- **Indexing:** Ensure `userId` columns are indexed (already FK indexed)

### 7.2 Optimization
```sql
-- Partial index for common query patterns
CREATE INDEX idx_order_userid_status ON "Order" ("userId", status) 
WHERE "userId" IS NOT NULL;
```

---

## 8. Migration & Rollout

### 8.1 Pre-deployment Checklist
- [ ] All repository queries tested with RLS enabled in staging
- [ ] Staff admin operations tested with `penaameen_staff` role
- [ ] Clerk webhook user sync tested with RLS context
- [ ] Payment/shipping webhooks tested with system context
- [ ] Load test passes with <5% latency increase

### 8.2 Rollout Strategy
1. **Staging:** Enable RLS, run full test suite
2. **Canary:** Enable for 5% of traffic via feature flag
3. **Full:** Enable for all traffic after 24h stability
4. **Rollback:** Disable RLS via migration if critical issue

### 8.3 Post-deployment Validation
- Monitor `pg_stat_user_tables` for sequential scans on RLS tables
- Alert on RLS policy violations (should be zero)
- Verify audit logs show correct `actorKind` per request

---

## 9. Open Questions / Client Decisions Required

| ID | Question | Impact | Status |
|----|----------|--------|--------|
| RLS-001 | Guest cart persistence: anonymous `userId` or separate `sessionId` column? | Affects `Cart` RLS policy | PENDING |
| RLS-002 | Order lookup by order number (public tracking): requires `SELECT` bypass? | Affects `Order` policy | PENDING |
| RLS-003 | Customer support "view as customer" feature: impersonation strategy? | Affects staff context | PENDING |
| RLS-004 | Data retention: do RLS policies apply to soft-deleted/archived rows? | Affects policy `USING` clause | PENDING |

---

## 10. Acceptance Criteria

1. **Isolation verified:** Customer A cannot read/update Customer B's `Order`, `Address`, `Cart`, `ChatSession` via any API route
2. **Staff operations work:** Admin API routes (with capability) perform CRUD on all customer data
3. **No regression:** All existing tests pass (`npm run check` green)
4. **Performance:** p95 latency increase <5% under load
5. **Audit trail:** Every request logs `actorKind` and `internalUserId`
6. **Rollback tested:** Migration can be reverted in <5 minutes

---

## 11. Appendix: File Map

### New Files
```
src/middleware/rls-context.ts
src/middleware/staff-context.ts
src/lib/prisma-staff.ts
prisma/migrations/20260822_rls_policies/migration.sql
tests/unit/rls-context.test.ts
tests/integration/rls-isolation.test.ts
tests/integration/staff-bypass.test.ts
tests/e2e/session-isolation.spec.ts
tests/performance/rls-overhead.test.ts
```

### Modified Files
```
prisma/schema.prisma                    # datasource staff role
src/lib/prisma.ts                       # (no change, but verify proxy works)
src/app/api/webhooks/clerk/route.ts     # RLS context for user sync
src/app/api/webhooks/casaku/route.ts    # System context
src/app/api/webhooks/midtrans/route.ts  # System context
src/app/api/**/route.ts                 # Wrap with withRLSContext()
src/application/repositories/*.ts       # Remove manual userId filters
src/application/services/job-context.ts # Worker RLS context
docs/SECURITY-ARCHITECTURE.md           # Document RLS architecture
```

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| RLS breaks existing queries | Medium | High | Comprehensive integration tests; staged rollout |
| Staff role connection pooling issues | Low | High | Dedicated staff Prisma client; separate pool config |
| Clerk `userId` → internal `id` race condition | Low | Medium | Upsert user in webhook; fallback to Clerk ID |
| Performance degradation under load | Low | Medium | Load test pre-deployment; partial indexes |
| Migration conflict with concurrent schema changes | Low | High | Coordinate with team; single migration file |

---

**Next Step:** Review plan with team → Approve → Begin Task T1.1 (migration)
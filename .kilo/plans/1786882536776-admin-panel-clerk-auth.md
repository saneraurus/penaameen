# Admin Panel + Clerk Auth Implementation Plan

## Goal
Build the admin panel MVP (Dashboard + Products + Orders) with Clerk Organizations authentication and staff profiles, aligned with existing capability-based authorization architecture.

---

## Scope (MVP)

| Route | Description | Priority |
|-------|-------------|----------|
| /admin/ | Dashboard with work queues (orders needing payment review, fulfillment-ready, blocked) | MUST HAVE |
| /admin/products/ | Product list with search/filter, create/edit/archive | MUST HAVE |
| /admin/products/[id]/ | Product detail editor (pricing, inventory, categories, media, SEO) | MUST HAVE |
| /admin/orders/ | Order list with search/filter by state | MUST HAVE |
| /admin/orders/[id]/ | Order detail with payment/fulfillment/shipping context, state transitions | MUST HAVE |
| /admin/settings/access/ | Staff user management (invite, edit capabilities, view audit) | MUST HAVE |

**Deferred (Post-MVP):** Inventory, Fulfillment/Shipping, Payments, Customers, Content, SEO/Redirects, Media, Branches/Events, Promotions, Analytics, Audit Logs UI

---

## Architecture Decisions

### Authentication: Clerk Organizations + Custom Roles
- Use **Clerk Organizations** for multi-tenant staff access (single org: penaameen-admin)
- Map Clerk **custom roles** to existing capability profiles:
  - admin to all capabilities
  - product_manager to catalog, inventory, media, SEO
  - order_manager to orders, customer context, payment/shipping status
  - fulfillment_manager to fulfillment, shipments, AWB, labels
  - content_manager to content, taxonomy, media, SEO
  - seo_manager to SEO, redirects, route context
  - customer_support to orders, customer detail, tracking
- Clerk handles: sign-in, session, MFA, org switching, user profile
- Application maps Clerk role to Actor.capabilities in authorization-service.ts

### Authorization Integration
New: src/application/auth/clerk-auth.ts
export function getActorFromClerkSession(session: ClerkSession): Actor {
  const orgRole = session.orgRole; // admin | product_manager | ...
  const capabilities = ROLE_CAPABILITY_MAP[orgRole] ?? new Set();
  return { kind: staff, staffId: session.userId, capabilities };
}

### Profile System (Staff Only)
- /admin/settings/access/ page lists all org members
- Click to detail drawer: email, name, role, capabilities, last active, audit summary
- Actions: change role, revoke access, resend invite
- Audit log shows: role changes, access grants/revokes, sensitive actions by that staff

---

## Implementation Tasks

### Phase 1: Clerk Setup & Configuration
- [ ] Add @clerk/nextjs dependency
- [ ] Create middleware.ts for auth protection on /admin/* routes
- [ ] Configure Clerk Organization: penaameen-admin
- [ ] Define custom roles in Clerk Dashboard matching capability profiles
- [ ] Add env vars: CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLERK_ORG_ID
- [ ] Create auth utility: src/application/auth/clerk-auth.ts (maps Clerk session to Actor)

### Phase 2: Admin Layout & Navigation
- [ ] Create src/app/admin/layout.tsx with admin shell (sidebar, header, Clerk UserButton)
- [ ] Create src/app/admin/page.tsx - Dashboard with work queue cards
- [ ] Create shared admin components: AdminSidebar, AdminHeader, WorkQueueCard, DataTable
- [ ] Implement route protection: redirect to Clerk sign-in if no org membership

### Phase 3: Dashboard (Work Queues)
- [ ] Build data fetchers for each queue:
  - Orders awaiting payment review
  - Paid/processing orders ready for fulfillment
  - Blocked/exception orders
  - (Stub: low-stock, SEO warnings, content drafts)
- [ ] Display as actionable cards with count + link to relevant list view
- [ ] Use existing getFoundationHealth pattern for server-side data fetching

### Phase 4: Products Management
- [ ] src/app/admin/products/page.tsx - list with search, filter (status, category), pagination
- [ ] src/app/admin/products/[id]/page.tsx - editor with tabs: General, Pricing, Inventory, Media, SEO
- [ ] Product create/edit API routes: POST/PATCH /api/admin/products
- [ ] Integrate with existing foundation-repositories.ts product repository
- [ ] Validation: required fields, SEO warnings, archive confirmation with redirect check

### Phase 5: Orders Management
- [ ] src/app/admin/orders/page.tsx - list with filters: order ref, date, customer, order state, payment state, fulfillment state
- [ ] src/app/admin/orders/[id]/page.tsx - detail view with:
  - Order lines, totals
  - Payment timeline (pending to verified/paid to refunded)
  - Fulfillment/shipping state
  - Allowed actions based on current state (e.g., Mark Paid, Create Shipment, Cancel)
- [ ] Order state transition API: PATCH /api/admin/orders/[id]/transition
- [ ] Audit logging for each state change

### Phase 6: Staff Access Management (Profiles)
- [ ] src/app/admin/settings/access/page.tsx - staff table with role badge, status, last active
- [ ] Staff detail drawer: profile info, role selector, capabilities preview, audit log summary
- [ ] API: GET/PATCH /api/admin/staff/[userId] (role changes via Clerk Admin API)
- [ ] Audit log display for access changes

### Phase 7: Integration & Polish
- [ ] Add Clerk UserButton to admin header for profile/org switching
- [ ] Implement loading/error/empty states for all admin pages
- [ ] Add TypeScript types for Clerk session extensions
- [ ] Run lint, typecheck, tests
- [ ] Document env setup in .env.example and README

---

## Data Flow

Request to middleware.ts (Clerk auth) to Clerk session
  to getActorFromClerkSession() to Actor { kind: staff, capabilities }
  to authorization-service.ts (authorizeStaffCapability)
  to Route handler / Server Component
  to Repository / Domain Service
  to Response

---

## Failure Modes & Mitigations

| Risk | Mitigation |
|------|------------|
| Clerk org role not mapped to capabilities | Default to empty set; log warning; show access denied UI |
| Staff member removed from org but session persists | Middleware checks org membership on each request; auto-redirect |
| Capability check bypassed | All admin routes use authorizeStaffCapability server-side; no client-only guards |
| Audit log missing for sensitive actions | Wrapper withAudit(command, actor, action) in application layer |

---

## Validation Plan

1. Type Safety: npm run typecheck passes
2. Lint: npm run lint passes
3. Unit Tests: 
   - clerk-auth.ts role to capability mapping
   - authorization-service.ts with Clerk-derived actors
   - Dashboard data fetchers
4. Integration Tests:
   - Middleware protects /admin/* routes
   - Role-based access: product_manager cannot access orders
   - Staff access page shows org members
5. Manual Verification:
   - Sign in as admin to see all routes
   - Sign in as product_manager to cannot access orders
   - Create/edit/archive product flow
   - Order state transitions work
   - Change staff role to reflected immediately

---

## Open Questions (Resolved)

| Question | Decision |
|----------|----------|
| Clerk orgs/roles vs custom capability model | Clerk orgs/roles mapped to capabilities |
| MVP scope | Dashboard + Products + Orders + Staff Access |
| Profiles | Staff only |

---

## Dependencies

- Clerk account with Organizations enabled
- @clerk/nextjs package
- Existing authorization-service.ts capability system
- Existing foundation-repositories.ts for product/order data

---

## File Structure (New/Modified)

src/
app/
  admin/
    layout.tsx              # Admin shell
    page.tsx                # Dashboard
    products/
      page.tsx            # Product list
      [id]/
        page.tsx        # Product editor
    orders/
      page.tsx            # Order list
      [id]/
        page.tsx        # Order detail
    settings/
      access/
        page.tsx        # Staff management
  api/
    admin/
      products/
        route.ts
      orders/
        [id]/
          transition/route.ts
      staff/
        [userId]/route.ts
application/
  auth/
    clerk-auth.ts           # Clerk session to Actor mapping
middleware.ts                   # Auth protection for /admin/*
presentation/
  components/
    admin/
      AdminSidebar.tsx
      AdminHeader.tsx
      WorkQueueCard.tsx
      DataTable.tsx

---

## Next Steps

1. Review and approve this plan
2. Switch to implementation agent to execute Phase 1-7
3. Configure Clerk Organization and custom roles in Clerk Dashboard
4. Add env vars to .env.local

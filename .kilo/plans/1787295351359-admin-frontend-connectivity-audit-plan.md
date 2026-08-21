# Admin Panel to Front End Connectivity Audit

## Audit conclusion

The Admin Panel and public Front End are **not fully connected end-to-end**. The repository contains meaningful working foundations, but the current system is a mixed implementation with conflicting data authorities, incomplete admin modules, unsafe state mutation paths, and checkout flows that can fail before payment.

Release status: **BLOCKED for production commerce operations**.

The project documentation already records Phase 7 as partial and Phase 8 QA as not started. This audit confirms that status rather than treating the existing pages as production-complete.

## Evidence summary

### Critical blockers

1. **Admin authorization can grant access from an unaccepted Clerk invitation.**
   - `src/application/auth/clerk-auth.ts:202-225`
   - Pending invitations are matched by email and unknown invitation roles default to `admin`.
   - Fix by authorizing only active membership or an explicitly approved source, with unknown roles denied.

2. **Admin order status APIs can represent payment as paid without authoritative payment evidence.**
   - `src/app/api/admin/orders/[id]/status/route.ts:59-129`
   - `src/presentation/components/admin/AdminOrdersManager.tsx:48-55`
   - The endpoint accepts client-controlled payment and fulfillment status values, while `order_manager` has `orders:transition` capability.
   - Separate payment review from order/fulfillment transitions and require verified provider evidence for paid/refund state.

3. **Admin order filtering references fields absent from Prisma schema.**
   - `src/lib/admin/orders.ts:239-263`
   - `prisma/schema.prisma:109-149`
   - `paymentStatus` and `fulfillmentStatus` are derived in memory but are not database fields.
   - Filter by the real `Order.status`/timestamps or introduce an approved normalized status model; do not leave dynamic `where` fields that Prisma cannot query.

4. **Shipping checkout sends no weight and is rejected by the shipping API.**
   - `src/app/checkout/address/page.tsx:155-171`
   - `src/app/api/shipping/rates/route.ts:160-168`
   - Product weight data exists but is not consumed by the route or checkout request.
   - Resolve weight from authoritative SKU/product data server-side and revalidate it before requesting rates.

5. **Casaku payment polling returns the pre-update order status.**
   - `src/app/api/payments/casaku/status/route.ts:30-84`
   - `src/app/checkout/payment/page.tsx:403-407`
   - The server applies the provider result but returns the stale query value; the client ignores `outcome`.
   - Return the authoritative post-application order state and test paid, pending, expired, duplicate, and failed outcomes.

6. **Product identifiers are inconsistent between Sheets, Prisma, cart, and checkout.**
   - Sheets products expose SKU as `id`: `src/lib/inventory/sheets-catalog.ts:40-59`.
   - Cart resolves only Prisma product IDs: `src/app/api/cart/route.ts:87-93`.
   - Order resolution requires a Prisma product: `src/app/api/orders/route.ts:172-213`.
   - Choose one canonical product identity and map SKU/slug to the canonical ID at the boundary. Do not allow optimistic local success when server synchronization fails.

7. **Admin product reads and writes use non-atomic, conflicting sources.**
   - Read fallback: `src/app/admin/products/page.tsx:44-48`.
   - Sheet-first writes: `src/app/api/admin/products/route.ts:83-87`, `src/app/api/admin/products/[id]/route.ts:51-97`.
   - A Sheet write can succeed while Prisma fails, and a Sheet-listed product may be impossible to edit through the Prisma-backed detail page.
   - Make Prisma the sole authoritative catalog or implement durable synchronization, idempotency, reconciliation, and visible exception state.

8. **Order synchronization trusts client-controlled local history.**
   - `src/app/orders/page.tsx:102-156`
   - `src/app/api/orders/sync/route.ts:64-171`
   - Browser data can supply order numbers, statuses, totals, addresses, and item prices.
   - Remove this as an authoritative mutation path; accept only server-issued references and verified ownership.

### High-risk incomplete or misleading surfaces

1. **Admin Content is mock data and the write button is inert.**
   - `src/app/admin/content/page.tsx:19-71`
   - It does not query the `Article` model or expose create/edit/publish behavior.

2. **Admin SEO reports hard-coded success despite incomplete migration evidence.**
   - `src/app/admin/seo/page.tsx:14-82`
   - No redirect model or health query backs the displayed metrics.

3. **Hard delete of products has no archive/SEO/redirect safeguard.**
   - `src/app/api/admin/products/[id]/route.ts:143-181`
   - `src/lib/admin/products.ts:315-321`
   - `prisma/schema.prisma:52-79`

4. **Order transition endpoint bypasses required payment/shipping evidence.**
   - `src/lib/admin/orders.ts:430-483`
   - It can mark paid, shipped, or delivered without provider evidence, shipment identity, tracking, or delivery evidence.

5. **Admin layout has no centralized authorization boundary.**
   - `src/app/admin/layout.tsx:3-11`
   - Individual pages check access, but the shell itself is not protected and future routes can omit the check.

6. **Several approved/admin-advertised domains are absent.**
   - Missing or incomplete routes include customers, payments, fulfillment, media, branches, events, promotions, analytics, catalog taxonomy, and redirects.
   - Treat blocked/conditional modules as explicit unavailable states rather than implying operational completeness.

7. **Admin sidebar calls the customer order endpoint.**
   - `src/presentation/components/admin/AdminSidebar.tsx:24-39`
   - The order badge is not an admin queue count.

8. **Notification fallback writes to `src/data` after a process-wide Prisma failure.**
   - `src/lib/admin/notifications.ts:28-31,62-109`
   - This conflicts with the control-plane document claiming JSON fallbacks were removed and is unsafe for multi-instance deployment.

### Front End connectivity gaps

1. `/shop` is a public foundation placeholder while the implemented storefront is `/produk`.
   - `src/app/shop/page.tsx:7-24`
   - `src/presentation/components/foundation/site-header.tsx:14-21`

2. `/galeri-kegiatan`, `/keranjang`, and `/checkout/*` are not represented in `PUBLIC_ROUTE_PATTERNS`.
   - `src/proxy.ts:6-28`
   - This can protect pages that are intended to be public or locally usable before sign-in.

3. Local cart state can remain after the server returns an empty cart and API mutation failures are ignored.
   - `src/context/CartContext.tsx:99-132,222-297`
   - This creates stale items and a false local/server cart state.

4. Guest checkout behavior is contradictory.
   - UI redirects to sign-in: `src/app/checkout/address/page.tsx:66-73`, `src/app/checkout/payment/page.tsx:121-129`.
   - API contains guest-order logic: `src/app/api/orders/route.ts:362-405`.
   - Apply the approved account/guest policy consistently; do not maintain an unreachable branch.

5. Public product, article, branch, gallery, and assistant data remain static or have conflicting live fallbacks.
   - Product fallbacks: `src/app/api/products/route.ts:11-64`, `src/app/api/products/[slug]/route.ts:58-70`.
   - Articles: `src/app/artikel/page.tsx`, `src/app/artikel/[slug]/page.tsx`, while `src/lib/content.ts` exists separately.
   - Branches/gallery: `src/data/branches.ts`, `src/app/galeri-kegiatan/page.tsx:8-100`.
   - Assistant: `src/lib/assistant/knowledge.ts:86-114`.

6. Contact form and social links are non-functional.
   - `src/app/kontak/page.tsx:50-165`

7. Public order list falls back to local history and can display stale or fabricated records.
   - `src/app/orders/page.tsx:120-156`

8. Public order API exposes raw database error text.
   - `src/app/api/orders/route.ts:421-429`

## Implementation plan

### Phase 1: Security and authority containment

1. Fix Clerk staff resolution to reject pending invitations and unknown roles.
2. Add a centralized admin layout gate while keeping capability checks in pages and services.
3. Remove client-controlled payment status, fulfillment status, and arbitrary order status mutation.
4. Make payment state provider-event-only or require an explicit finance capability and evidence record.
5. Add consistent safe error mapping for `401`, `403`, `400/422`, `404`, `409`, `5xx`.
6. Add origin/CSRF protection for cookie-authenticated admin mutations.
7. Couple sensitive mutations, status history, and audit records transactionally or use durable command/outbox records.

### Phase 2: Canonical commerce data flow

1. Decide and document the canonical product identity and source of truth. Recommended: Prisma canonical IDs with SKU as a unique external identity.
2. Update Sheets imports/adapters to resolve to canonical Prisma products rather than exposing SKU as a database ID.
3. Make cart add/update/remove operations reject or reconcile failed server writes; do not silently keep optimistic state as authoritative.
4. Remove local-cart fallback when an authenticated server cart is successfully returned empty.
5. Ensure checkout and order creation resolve product, price, stock, weight, and availability only on the server.
6. Remove or redesign `/api/orders/sync` so it cannot create or mutate authoritative orders from arbitrary localStorage data.
7. Resolve shipping weight server-side from verified product/SKU data and validate destination ownership for `addressId`.
8. Return post-transition order state from payment polling and add idempotency for payment/status operations.

### Phase 3: Admin operational correctness

1. Replace hard-coded Content data with the approved Article/content read model; expose explicit unavailable states for unimplemented writes.
2. Replace hard-coded SEO metrics with real checks over products, metadata, sitemap, and redirect inventory; report `UNKNOWN` where source data is unavailable.
3. Replace hard delete with archive plus migration/redirect review and audit.
4. Align order filters and status transitions with the actual Prisma model and documented state machine.
5. Add or explicitly defer missing admin domains: payments, fulfillment, customers, media, taxonomy, redirects, analytics, branches, events, promotions.
6. Replace the sidebar customer order request with an admin work-queue count.
7. Remove file-backed notification fallback or isolate it as a deliberate local-only test adapter that cannot activate after transient production DB failure.

### Phase 4: Public content and navigation consistency

1. Resolve `/shop` versus `/produk` as a documented URL/SEO decision before changing links.
2. Synchronize proxy public-route policy with intended public pages.
3. Select one live content source for products, articles, branches, gallery, and assistant knowledge, with explicit static fallback only for approved offline/foundation behavior.
4. Implement or clearly disable the contact form and social destinations.
5. Remove local order-history display as a trusted server fallback; show a clear unavailable/error state instead.

### Phase 5: Verification and acceptance

1. Run `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` on the current worktree. Historical green output in `PROJECT.md` does not validate current uncommitted changes.
2. Add integration tests for canonical product ID resolution across Sheets/Prisma/cart/order.
3. Add security tests for pending invitation rejection, role denial, capability separation, CSRF/origin checks, and order ownership.
4. Add API tests for order transition invariants, payment evidence, idempotency, safe errors, and post-payment response state.
5. Add checkout E2E tests for address ownership, weight calculation, shipping rates, stale carts, provider unavailable states, and successful/failed payment callbacks.
6. Add Admin E2E tests for product lifecycle, order queue, payment review, audit visibility, content state, and SEO unknown/error states.
7. Validate against real sandbox credentials for Clerk, PostgreSQL, Google Sheets, RajaOngkir, Midtrans, Casaku, Resend, and AI providers. Repository inspection cannot prove deployed credentials, webhook delivery, provider contracts, or production browser behavior.

## Acceptance criteria

- No unaccepted invitation or unknown role can obtain staff capabilities.
- Every admin mutation is capability-checked, state-validated, idempotent where needed, and audit-coupled.
- Payment and shipping states cannot be fabricated by browser payloads or generic order operators.
- One canonical product identity resolves consistently through admin, public catalog, cart, checkout, order, inventory, and shipping.
- Authenticated empty carts do not resurrect stale local items.
- Shipping rates are requested with verified server-derived weight and owner-authorized address context.
- Content and SEO dashboards do not display invented success metrics.
- Product archive/delete preserves migration/SEO review and stable identity.
- Public route policy matches intended navigation.
- Missing modules are explicitly marked unavailable or deferred, not presented as complete.
- Automated checks and browser E2E acceptance evidence are green in the target environment.

## External verification boundaries

The following cannot be declared connected from source inspection alone: Clerk configuration and redirects, deployed PostgreSQL/schema state, Google Sheets permissions/data, RajaOngkir account and supported endpoints, Midtrans/Casaku callbacks and signatures, Resend delivery, AI provider credentials/limits, external image/QR service availability, and production mobile/browser behavior.

## Worktree note

The audit was performed against a dirty working tree. Relevant uncommitted paths reported during verification include `package.json`, `src/data/product-weights.ts`, `scripts/import-product-weights-to-sheets.ts`, `docs/PRODUCT-MIGRATION-PLAN.md`, `docs/STOCK-SHEETS-INTEGRATION.md`, and `PRODUK/`. These changes were not modified or reverted.

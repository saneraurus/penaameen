# PENA AMEEN Master Product Requirements Document

**Phase:** 1 — Product Discovery & Master PRD
**Document status:** **PROPOSED product blueprint — ready for PENA AMEEN client review and approval.** It is not a technical architecture, database design, final UI design, provider selection, production build, or migration execution plan.
**Scope:** New PENA AMEEN single-vendor digital commerce platform and migration-sensitive public experience.
**Source foundation:** `PROJECT.md`, `AGENTS.md`, all Phase 0–0.9 discovery/migration documents under `docs/`, and the Phase 1 product brief.

---

## 1. Executive summary

PENA AMEEN is an education-oriented brand and commerce organization with current public evidence of AL-BARQY and ACM learning-method content, PENA AMEEN-managed products, educational articles, branches/community content, gallery/activity content, and WooCommerce-style commerce routes.

The new PENA AMEEN platform is a **single-vendor commerce platform**, not a multi-vendor seller marketplace. In this project, “marketplace” means the product catalog, discovery, cart, checkout, payment, shipment, tracking, and staff operations for PENA AMEEN’s own managed products.

The product goal is to connect educational discovery and brand trust to accurate product purchase and dependable post-purchase operations, while preserving valuable legacy SEO/content assets. The MVP must complete the full loop:

```text
Discovery → Product → Cart → Checkout → Payment → Order → Shipping → Tracking
```

The product blueprint is complete as a planning deliverable. Its dependent architecture and implementation are **not approved or ready to finalize** until PENA AMEEN resolves provider, policy, catalog, migration, and operations decisions documented in `docs/CLIENT-DECISION-REGISTER.md`.

---

## 2. How to read this PRD

| Label | Meaning |
|---|---|
| **CONFIRMED** | Explicit in the Phase 1 brief/project-control documents or directly supported by discovery evidence. |
| **PROPOSED** | A product recommendation that needs PENA AMEEN approval before becoming an implementation commitment. |
| **UNKNOWN** | Not established from the available source/discovery evidence. |
| **CLIENT DECISION REQUIRED** | Must be approved, chosen, or explicitly deferred before dependent architecture/implementation can be finalized. |
| **BLOCKED** | Cannot proceed safely because its decision, source evidence, provider, policy, or data dependency is unresolved. |

### Authority order

The source-of-truth hierarchy in `PROJECT.md` applies: explicit client decisions override this proposed PRD; an approved PRD then informs future IA/architecture/design/implementation. No lower-level inference may silently override a client decision or migration constraint.

---

## 3. Confirmed product foundation

| Area | Confirmed foundation | Evidence |
|---|---|---|
| Project model | Greenfield replatforming/rebranding of current PENA AMEEN website | `PROJECT.md`; decision log D001–D002 |
| Commerce model | Single-vendor commerce platform | `PROJECT.md`; no seller evidence in discovery |
| Current source | WordPress/WooCommerce-like source system with product/category/cart/checkout patterns | `docs/WEBSITE-AUDIT.md`; `docs/DISCOVERY-STATUS.md` |
| Brand/pillars | PENA AMEEN, “Belajar Tanpa Mengenal Usia,” AL-BARQY, ACM, education/community positioning | `docs/BRAND-CONTENT-AUDIT.md`; content/product inventories |
| Commerce requirement | Complete conceptual purchase/pay/shipping/tracking loop is required | Phase 1 brief; `PROJECT.md` |
| Operational requirement | Future staff must manage catalog, content, orders, payments, shipping, customers, SEO, and settings conceptually | Phase 1 brief; `PROJECT.md` |
| SEO constraint | Valuable existing URLs/content/media/metadata/internal links must be preserved or explicitly mapped | D003; SEO migration documents |
| Provider boundary | Payment and shipping providers are unknown and must remain abstract in this phase | D004–D005; Phase 1 brief |
| Discovery limitation | Product/content/URL/SEO inventories are incomplete due source access constraints | discovery status/gaps/readiness documents |

---

## 4. Product definition

### 4.1 What PENA AMEEN is

**CONFIRMED:** PENA AMEEN combines education-oriented content, AL-BARQY and ACM method positioning, community/branch context, and products. Its current site title/tagline evidence includes *“Pena Ameen | Belajar Tanpa Mengenal Usia.”*

**PROPOSED product statement:**

> PENA AMEEN is a trusted education-commerce destination where people can understand PENA AMEEN learning methods, discover appropriate materials, purchase them through a dependable transaction flow, and remain informed from order through delivery.

No unverified educational outcome, audience size, product availability, delivery promise, or business claim is asserted by this statement.

### 4.2 Role of the website

The platform should be:

1. a brand/trust destination;
2. an education/content discovery destination;
3. a PENA AMEEN-managed product storefront;
4. a post-purchase order/tracking/support destination; and
5. an authorized staff operational surface for catalog, content, order, payment, shipping, and SEO work.

### 4.3 Marketplace and vendor model

**CONFIRMED:** The platform is single-vendor. It must not introduce third-party seller onboarding, storefronts, product ownership, commissions, settlements/payouts, or seller fulfillment. Those exclusions are `REQ-OOS-001` through `REQ-OOS-004`.

### 4.4 Connected product model

```text
Education/content → organic/direct/social discovery → product/category discovery
→ cart/checkout/payment → order/fulfillment/shipment/tracking
→ support, trust, and future discovery

Branches, events, galleries, and approved testimonials → community/local trust and content context
```

Content should inform visitors; commerce should make relevant PENA AMEEN materials purchasable; branches/community should add approved context without becoming a social network or seller ecosystem.

**Detail:** `docs/PRODUCT-DEFINITION.md`.

---

## 5. Business objectives

No numerical KPI, baseline, target, measurement period, or owner is invented. PENA AMEEN must approve those after analytics and business context are available.

| ID | Confirmed objective | Candidate measurement direction — target is CLIENT DECISION REQUIRED |
|---|---|---|
| REQ-OBJ-001 | Increase product discoverability | Product/category discovery and search-to-product engagement |
| REQ-OBJ-002 | Improve organic search visibility | Priority URL/indexing/content/product discovery visibility |
| REQ-OBJ-003 | Increase product conversion | Product-to-cart-to-checkout-to-purchase progression |
| REQ-OBJ-004 | Simplify checkout | Validation/error friction and completion progression |
| REQ-OBJ-005 | Automate shipping calculation | Valid quote/selection outcomes and failure categories |
| REQ-OBJ-006 | Automate shipment creation | Shipment/AWB/label/tracking operational completion |
| REQ-OBJ-007 | Reduce administrative order work | Manual touchpoint/exception/work-queue measures |
| REQ-OBJ-008 | Improve product management | Catalog completeness and staff change-operation measures |
| REQ-OBJ-009 | Preserve SEO equity | Redirect/URL/metadata/indexing/404 comparison |
| REQ-OBJ-010 | Establish scalable content architecture | Ability to publish/reuse well-linked, metadata-managed content |

---

## 6. Users and operational capabilities

### 6.1 Primary public/customer users

| User | Status | Primary goal | Success outcome |
|---|---|---|---|
| Public visitor | CONFIRMED | Understand PENA AMEEN, learn, browse, or obtain help | Finds a relevant content/product/community path without navigation friction |
| Customer | CONFIRMED | Purchase PENA AMEEN products and stay informed | Completes approved checkout and can retrieve truthful order/tracking information |
| Parent/caregiver | INFERRED | Find relevant educational/child-learning context and materials | Can use content/product information to make an informed choice |
| Educator/tutor/institutional buyer | INFERRED | Understand educational materials and buy or make an approved enquiry | Finds relevant materials; special/B2B flow is not assumed |
| Branch/community visitor | CONFIRMED public-page context | Find approved branch/community information | Sees current, accurate branch/community content if retained |

### 6.2 Staff capability profiles

| Capability | Goal | Primary tasks |
|---|---|---|
| Administrator | Keep platform safe/operable | Settings/access, dashboard, exception oversight |
| Product manager | Keep catalog accurate/discoverable | Products, prices, inventory, categories, media, SEO |
| Order manager | Progress/support orders | Search/filter/order state/payment review/customer context |
| Fulfillment manager | Create and monitor shipments | Shipping rate/service, shipment, AWB, label, tracking exceptions |
| Content manager | Publish accurate educational/brand content | Articles, pages, taxonomy, media, links |
| SEO manager | Protect/grow organic discovery | Metadata, canonical/indexability, redirects, sitemap validation |
| Customer support | Resolve authorized customer issues | Order/tracking context, approved support/notification path |

These are not mandatory separate authentication roles. Final role combinations, permissions, approvals, and audit requirements are **CLIENT DECISION REQUIRED** (`CDR-010`).

**Detail:** `docs/ADMIN-PRD.md`; `docs/CUSTOMER-ACCOUNT-PRD.md`.

---

## 7. Customer journey requirements

### 7.1 Core end-to-end journey

| Stage | Required customer outcome | Key success state | Key failure/recovery state |
|---|---|---|---|
| Discover | Visitor reaches a relevant PENA AMEEN destination | Relevant page/product/content is findable | Legacy/no-result state offers search/navigation/support, not a dead end |
| Land | Visitor understands where they are and what to do next | Clear shop/learn/help route | Missing/retired URL is handled by redirect/404 guidance |
| Explore | Visitor can browse content, methods, categories, and community context | Useful relevant paths are linked | Sparse/unavailable content has safe fallback |
| Product discovery | Visitor finds eligible products through browse/search/content | Product card/result is accurate | No-result/unavailable search state can be refined |
| Product detail | Customer evaluates product | Accurate available product info and valid add-to-cart | Unavailable/invalid variant/price/media/add-to-cart failure is explicit |
| Cart | Customer reviews one or more products | Totals and item state are transparent | Empty, unavailable, quantity, price, promotion, or estimate state is recoverable |
| Checkout | Customer supplies valid required information | Valid customer/delivery/shipping/payment/order review | Field, rate, stock, price, or service failure gives correction/support path |
| Payment | Customer initiates/finishes approved payment | Trusted payment verification | Pending, failure, expiry, cancellation, or unverified return is clear |
| Order confirmation | Customer sees truthful order next step | Correct pending/paid/processing state and reference | No false success; support/retry where valid |
| Shipment | Staff creates valid shipment | Shipment/AWB/label state accurately represented | Quote/shipment/AWB/label failure reaches review/retry path |
| Tracking | Customer follows available shipment | Tracking number/status accessible safely | Tracking unavailable/exception uses conservative message/support |
| Delivery/post-purchase | Customer receives delivery/support outcome | Trusted delivery/refund/cancellation communication | Exception/return/refund policy route is clear |

### 7.2 Alternative journeys

| Journey | Required behavior |
|---|---|
| SEO visitor | Preserve/map the landing URL; lead to relevant content/product/category rather than unrelated homepage. |
| Direct visitor | Home/landing orientation makes shop, education, and help easy to find. |
| Returning customer | Cart/account/order-lookup policy provides a safe route to current order/tracking/support. |
| Customer searching for product | Query returns eligible product/content/category results or a useful no-result refinement. |
| Customer browsing categories | Categories retain/migrate source value and give product/contextual discovery. |
| Customer arriving from article | Article supports education and editorially appropriate links to methods/category/product. |
| Customer arriving from social media | Open Graph/landing context is accurate and gives a clear next action. |
| Customer purchasing multiple products | Cart, shipping, payment, order, and fulfillment handle valid multiple lines without ambiguity. |

**Detail:** `docs/COMMERCE-PRD.md`, `docs/SEARCH-PRD.md`, `docs/SHIPPING-PRD.md`, `docs/PAYMENT-PRD.md`.

---

## 8. Conceptual information architecture and page inventory

### 8.1 Conceptual architecture

The public experience is intentionally simple:

```text
Home
├── Shop → categories, search, product detail
├── Learn / Education → AL-BARQY, ACM, articles, retained archives
├── Community / Branches → branches, events, gallery where approved
├── About / Help → profile, contact, FAQ, legal/policy
└── Commerce utility → cart, checkout, order outcome, tracking, account if enabled

Authorized staff administration → dashboard, products, inventory, orders, payments,
shipping, customers, content, SEO, media, branches/events, promotions, settings
```

This is **PROPOSED conceptual IA**, not final route, URL, label, or menu-design work. Existing `/shop/`, `/blog/`, `/events/`, product/category/tag, article/category/tag/author, profile, gallery, and branch URL treatment must be decided through SEO migration work.

Primary navigation should prioritize Shop, an approved Learn/Education grouping, an approved Branches/Community grouping, About/Help, and Cart. Secondary/footer navigation should carry categories, policies, FAQ, contact, tracking, branches, and other contextual destinations. Account navigation is conditional on account policy.

### 8.2 Required page/screen coverage

`docs/PAGE-INVENTORY.md` defines purpose, CTAs, content, SEO importance, authentication, commerce/admin/migration dependency, and status for:

- home, shop, category/tag archive, search, product detail, AL-BARQY, ACM, article/archive/detail;
- branches, events, gallery, profile/about, contact, FAQ, legal/policy;
- cart, checkout stages, payment/order outcome, public order lookup/tracking, delivery exception;
- conditional account login/recovery/history/profile;
- dashboard, catalog/inventory, orders/payment, fulfillment/shipping, customers, content/SEO/media, branches/events, promotions, settings;
- not-found, service-error/retry, and access/session recovery states.

### 8.3 Phase boundary

Phase 1 has completed a **conceptual product IA**. Phase 2 remains responsible for the detailed, approved site/content/commerce IA, final labels/routing, taxonomy decisions, and source-to-target URL mapping. It is ready to begin only after this PRD is reviewed/approved; it has **not** been started.

---

## 9. Commerce product requirements

### 9.1 Product discovery and detail

**MUST HAVE:** product search, category browsing, product cards, meaningful filters/context where data supports them, product detail, available product price/sale-price representation, images, description, availability, quantity, add-to-cart, and SEO-safe product/category treatment.

**CONDITIONAL/UNKNOWN:** SKU customer visibility, variants, package contents, dimensions/weight display, availability rules, reviews, ratings, related-product data, promotion/coupon behavior, tax, free shipping, pricing/rounding, backorders, and merchandising sorts.

### 9.2 Cart and checkout

**MUST HAVE:** add/remove/update quantity; transparent current summary; eligibility/availability validation; shipping estimate/selection after valid destination data; validated customer/delivery/shipping/payment steps; order review; and clear error/recovery states.

**No invented rules:** The project does not yet know shipping price/coverage, tax, promotion, coupon, free-shipping, order expiry, cart persistence duration, required checkout fields, or guest/account policy.

### 9.3 Order-state principle

The future product must distinguish the following state domains:

- **order:** created/awaiting payment, processing, cancelled, refund-related states;
- **payment:** not started, initiating, pending, verified/paid, failed, expired, cancelled, refund processing/refunded, manual review;
- **fulfillment:** awaiting eligibility, ready, preparing, exception;
- **shipment:** quote selected, creation requested, created, AWB assigned, label available, dispatched, in transit, delivered, exception/cancelled/return;
- **tracking:** unavailable, tracking number available, carrier status, in transit, delivered, delayed/exception, temporarily unavailable/not found.

These are **PROPOSED conceptual states**, not a confirmed current-state mapping or provider configuration. Payment return alone must not mark an order paid; AWB alone must not mark it dispatched; tracking number alone must not mark it delivered.

**Detail:** `docs/COMMERCE-PRD.md`.

---

## 10. Shipping product requirements

### Required customer loop

1. Customer provides destination.
2. System determines eligible shipping options.
3. System calculates/returns applicable shipping cost.
4. Customer selects method.
5. Valid order is created.
6. Authorized staff creates or initiates shipment per approved workflow.
7. AWB/resi is generated or recorded.
8. Staff prints/retrieves label when provider supports it.
9. Tracking number is stored against correct order/shipment.
10. Customer can access approved tracking.

### Required customer and staff behavior

- Rate states include not requested, validating, quoting, options available, no service, incomplete, failed, expired/stale, and selected.
- Staff must distinguish rate, service selection, shipment record, AWB/resi, label, dispatch, and tracking status.
- Failure states must cover invalid/unsupported destination, missing package data, rate failure, no service, quote change/expiry, duplicate shipment risk, AWB/label/tracking failure, cancellation, return, and delivery exception.
- No carrier, rate, origin, delivery time, service level, insurance, free-shipping rule, label format, manual fallback, cancellation, or return rule is assumed.

**Critical client gate:** provider/aggregator, couriers/services, origin, package weights/dimensions, rate policy, shipment/AWB/label/tracking workflow, cancellation/returns, and SOP (`CDR-004`).

**Detail:** `docs/SHIPPING-PRD.md`.

---

## 11. Payment product requirements

### Required payment abstraction

The product must support payment initiation, pending, verified success, failure, expiration, cancellation, refund, verification, event/webhook handling, and an explicit order/payment relationship without selecting a provider.

### Required correctness behavior

- A valid checkout/order context precedes payment initiation.
- Customer sees a truthful pending/next-step state after initiation.
- Only trusted payment evidence can progress payment to verified/paid.
- Failure/expiry/cancellation/unverified-return states do not falsely confirm payment.
- Staff can inspect authorized payment context, handle approved manual-review/refund activity, and distinguish payment from order/fulfillment/shipment state.
- Event handling must accommodate delayed, repeated, out-of-order, conflicting, or unmatched events without duplicate confirmations/fulfillment/refunds.
- Refund state must be explicit; refund amount, authority, timing, partial/full behavior, and settlement are not assumed.

**Critical client gate:** provider, account owner, launch methods, status/event mapping, refund authority/process, settlement/reconciliation, test access, and finance SOP (`CDR-003`).

**Detail:** `docs/PAYMENT-PRD.md`.

---

## 12. Administrative platform requirements

### MVP administration

Authorized staff must conceptually be able to:

- view dashboard/work queues for actionable order/payment/shipping/catalog/migration exceptions;
- create/edit/archive products with prices, inventory, categories, images, SEO, and URL safeguards;
- search/filter/view/progress orders using separate payment/fulfillment/shipping statuses;
- create/manage shipments, AWB/resi, labels, tracking, and exceptions;
- find authorized customer/order context for support;
- publish/manage articles/pages/taxonomy/media/SEO/redirects;
- manage approved settings and staff capabilities under least-privilege principles.

### Conditional administration

Branch/event management, promotions, dashboard reporting, customer account/history, refunds, role combinations, approval thresholds, manual overrides, and audit/retention requirements need data or client decisions. Staff administration is a PENA AMEEN operational platform, not a seller portal.

**Detail:** `docs/ADMIN-PRD.md`.

---

## 13. Content, SEO, and migration requirements

### 13.1 Content system

The product must support articles, content categories/tags, pages, product/category content, AL-BARQY/ACM pillar pages, branches, approved event/gallery/testimonial treatment, media, internal links, and content status. No assumption is made that all source archives or all old content remain public; each needs a documented treatment.

### 13.2 SEO controls

Eligible public content must support intentional title, meta description, canonical, indexability, Open Graph, image metadata, valid structured-data inputs, internal links, sitemap inclusion, and redirects. Potential schema types are Organization, Website, Breadcrumb, Product, Article, FAQ, and branch/local types only where factual source data supports them.

### 13.3 Migration constraints

- No existing valuable/indexed URL may disappear without KEEP/REWRITE/MERGE/REDIRECT/ARCHIVE/RETIRE decision.
- Do not default unrelated legacy URLs to the homepage.
- Preserve/directly map priority homepage, product, category, article, branch, gallery, shop, blog, events, category/tag/author archive intent as appropriate.
- Preserve source content/media relationships, metadata, internal links, and product/category identity as far as export and policy permit.
- Validate source/target URLs, redirects, metadata, canonical/indexability, schema, media, internal links, sitemap, 404s, checkout/payment/shipping flows before/after launch.

**Critical source gap:** full URL, sitemap, robots, canonical, metadata, schema, media, and content inventory remains incomplete. `CDR-006` and `CDR-007` are architecture/launch gates.

**Detail:** `docs/CONTENT-SEO-PRD.md`, `docs/SEO-MIGRATION-DATA.md`, `docs/MIGRATION-CHECKLIST.md`.

---

## 14. Search requirements

### Must have

- Product search that reaches eligible products.
- Result type/context and valid link to product/content/category detail.
- Category discovery and context/filtering that does not force an unreviewed taxonomy redesign.
- Clear empty, no-result, unavailable-result, and temporary failure recovery paths.

### Should have / decision-dependent

- Article/education search; result-type-aware unified search; autocomplete/suggestions; typo tolerance; synonyms; relevance tuning; phrase/spelling policy; pricing/availability/method facets.

No search engine, index, ranking model, synonym list, query-retention model, popularity boost, or language algorithm is selected. PENA AMEEN must approve language/terminology/relevance scope (`CDR-019`).

**Detail:** `docs/SEARCH-PRD.md`.

---

## 15. Customer account requirements

### Must have outcome

A customer must receive order confirmation/communication and have an approved, privacy-safe path to eligible order/tracking information. This must not depend on automatically migrating old customer accounts.

### Proposed / conditional functionality

- Account creation/login — SHOULD HAVE if approved.
- Account order history/order detail — SHOULD HAVE for eligible account holders.
- Password recovery — SHOULD HAVE only if the selected account model needs it.
- Profile and saved addresses — OPTIONAL/NICE TO HAVE.
- Guest checkout — proposed to reduce friction, but **CLIENT DECISION REQUIRED**.
- Legacy customer-account and historical-order migration — **CLIENT DECISION REQUIRED**.

Privacy, consent, account authentication, order lookup factors, historical data visibility, profile fields, retention, and notification channel policy are unknown.

**Detail:** `docs/CUSTOMER-ACCOUNT-PRD.md`.

---

## 16. Notification requirements

The product must define state-appropriate transactional notifications for order created, payment pending/success/failure/expiry/cancellation, processing, shipment/AWB/tracking, shipped, delivered, cancellation, and refund. Messages must be triggered by meaningful verified business state — not by a front-end click or unverified provider return.

A baseline essential transaction channel is required, with email proposed as a candidate; email, WhatsApp, SMS, and in-app channel selection, consent, sender, fallback, template/process ownership, and provider remain **CLIENT DECISION REQUIRED**. Staff-facing exception alerts are SHOULD HAVE.

**Detail:** `docs/NOTIFICATION-PRD.md`.

---

## 17. Analytics requirements

The future platform must be able to measure, subject to approved consent/privacy governance:

- page, category, product, search/product-search, add-to-cart, cart, checkout, payment-start/pending/success/failure, purchase, coupon use if approved, shipment/AWB/shipped/tracking events;
- content/product/category progression and zero-result/refinement behavior;
- priority redirects, 404s, sitemap/indexability signals, and SEO migration health;
- operational payment/shipping/notification exception categories without treating analytics as the source of truth.

No analytics provider, tag manager, consent solution, dashboard, target, retention period, customer identity strategy, or transaction-data policy is chosen. Existing analytics/Search Console access is UNKNOWN.

**Detail:** `docs/ANALYTICS-PRD.md`.

---

## 18. Non-functional product requirements

The MVP must meet approved acceptance criteria for:

| Area | Requirement |
|---|---|
| Performance | Priority public and staff-critical journeys remain efficient enough for approved device/network contexts. |
| SEO | Crawlability, metadata, canonical/indexability, schema where valid, sitemap, redirects, and migration validation are first-class. |
| Accessibility | Core public/staff tasks support understandable semantic, keyboard, form, status, and media behavior. |
| Security/privacy | Customer/order/staff/payment/shipping data is protected through approved access, validation, consent, and safe error/recovery behavior. |
| Responsiveness | Mobile-first public experience and approved staff device contexts remain usable. |
| Reliability | No false payment/shipment/delivery outcome; delayed/repeated/failed state has a recovery path. |
| Observability | Authorized staff can identify material operational, notification, SEO, and migration exceptions. |
| Maintainability | Future changes do not casually bind business behavior to unknown providers/policies or destroy migration assets. |
| Scalability | Catalog/content/order/traffic growth can be accommodated without premature multi-vendor/ERP/global scope. |

No performance/availability/accessibility/security numerical target is invented. Target setting requires client, legal/security, and future architecture input.

**Detail:** `docs/NFR-PRD.md`.

---

## 19. MVP scope

### Must have — MVP

1. Simple public discovery through Shop, core AL-BARQY/ACM education/content, search/category/product routes, contact, and core policy pages.
2. Accurate product detail and multi-item cart.
3. Validated checkout with customer/destination, shipping selection/cost, payment selection/initiation, and recovery states.
4. Verified payment lifecycle and truthful pending/success/failure/expiry/cancellation outcomes.
5. Distinct order, payment, fulfillment, shipment, and tracking states.
6. Staff operational workflow through shipment creation, AWB/resi, label where supported, tracking, and exception handling.
7. Customer post-purchase confirmation/notification and approved tracking access.
8. Product/content/category/SEO/redirect/migration safeguards and core staff admin management.
9. Baseline quality, analytics, observability, and migration validation.

### Should have — post-MVP / approved enhancement

- richer related product/content linking;
- article search, autocomplete/suggestions/relevance enhancement;
- accounts, account order history, password recovery;
- customer management workspace, branch/community management, media remediation, staff alerts;
- richer branch/gallery/FAQ/delivery-exception self-service once source/policy is ready.

### Nice to have

- product comparison, wishlist/saved cart, advanced recommendation/personalization, ratings/reviews program, back-in-stock alerts, in-app notification center, advanced branch/event mapping, advanced merchandising/A-B testing.

### Client decision required

Catalog/data source, payment, shipping, legal/policy, customer/account/history, migration export/redirect/content treatment, staff/SOP/permission, notifications/analytics, promotions, market/language, search scope, branches/events/gallery all require approved decision or explicit deferral.

**Detail:** `docs/MVP-SCOPE.md`.

---

## 20. Explicit out of scope

Unless PENA AMEEN approves a future separate business case, do not build:

- multi-vendor marketplace, seller dashboards, seller payouts/commissions, vendor-owned catalog/fulfillment;
- advanced loyalty/wallet/referral/gamification;
- complex ERP/accounting/procurement/warehouse platform;
- advanced AI/behavioral recommendation engine;
- native mobile application;
- real-time chat or social network/community profiles/feeds/messaging;
- subscriptions/recurring billing, installments/BNPL, COD/manual/offline payment by default;
- international/multi-currency/multi-language commerce or multi-origin/cross-border shipping by default;
- default customer/history migration, review/moderation program, promotions engine, event ticketing/branch portal, marketing automation/retargeting/session replay;
- provider-specific payment/shipping implementation, application code, database migrations, framework installation, production changes, or final UI design in Phase 1.

**Detail:** `docs/OUT-OF-SCOPE.md`.

---

## 21. Requirement traceability

`docs/REQUIREMENT-MATRIX.md` provides a requirement ID, requirement, source, priority, status, dependency, migration impact, and unknown dependency for every major blueprint requirement.

Current matrix summary:

| Category | Count |
|---|---:|
| Total traceable requirements | 174 |
| MUST HAVE | 111 |
| SHOULD HAVE | 14 |
| NICE TO HAVE | 1 |
| CLIENT DECISION REQUIRED | 26 |
| OUT OF SCOPE | 22 |
| Confirmed status | 104 |
| Proposed status | 43 |
| Blocked status | 27 |

The client-decision register contains **29 decision records** after the Phase 5 brand-design addition; the Phase 1 matrix has 26 decision-gated requirements because it also captures decision-gated capability scope.

---

## 22. Critical migration constraints

The following are non-negotiable product/migration guardrails:

1. Do not remove, rename, merge, archive, or abandon existing valuable URLs without a documented migration decision and SEO review.
2. Preserve or explicitly map homepage, products, categories/tags, articles/categories/tags/author archives, branches, galleries, `/shop/`, `/blog/`, `/events/`, cart/checkout utility routes as appropriate once inventory is complete.
3. Do not use a homepage redirect as a generic replacement for unrelated old content.
4. Preserve source product/content/media relationships, slugs, metadata, structured data, internal links, and images where source data/rights permit.
5. Complete source-to-target inventory, redirect, metadata, schema, canonical/indexability, media, content, product, checkout/payment/shipping/tracking validation before launch.
6. Monitor redirects, 404s, sitemap/indexing, orders, payment, shipping, tracking, customer support, and analytics after launch.

---

## 23. Known unknowns and blockers

### Critical blockers for final architecture/implementation

| Blocker | Current status | Consequence |
|---|---|---|
| Complete active catalog, SKU, inventory, variants/bundles, price, media, weights/dimensions/package data | UNKNOWN | Product, cart, stock, pricing, shipping, migration cannot be finalized safely |
| Payment provider/method/account/webhook/status/refund/settlement model | UNKNOWN | Payment/order/notification architecture blocked |
| Shipping provider/courier/origin/rate/package/AWB/label/tracking/returns model | UNKNOWN | Checkout fulfillment/tracking architecture blocked |
| Full URL/sitemap/robots/canonical/metadata/schema/internal-link inventory and redirect matrix | PARTIAL/UNKNOWN | Final IA/routing/SEO migration blocked |
| Full content/media export, rights, branch/event data, content treatment | UNKNOWN/PARTIAL | Public content/migration and local/community scope blocked |
| Privacy, terms, shipping, returns/refund, tax/price/consent policy | UNKNOWN | Checkout/customer/account/notification/analytics legal readiness blocked |
| Guest/account/order lookup/customer migration/historical-order decision | CLIENT DECISION REQUIRED | Customer experience/data architecture blocked |
| Staff roles, order/fulfillment SOP, manual fallback, refund authority, reporting needs | UNKNOWN/CLIENT DECISION REQUIRED | Admin/operations architecture blocked |
| Analytics/Search Console/consent access/governance | UNKNOWN | Measurement/migration monitoring scope blocked |

### Full register

See `docs/UNKNOWN-REGISTRY.md` (65 source unknowns after Phase 5 design-governance additions) and `docs/CLIENT-DECISION-REGISTER.md` (29 decision records after the Phase 5 brand-design addition, 11 critical).

---

## 24. Contradictions and reconciliation

No unresolvable business contradiction was discovered. The following evidence differences are explicitly reconciled rather than silently normalized:

| Observation | Reconciliation |
|---|---|
| “Marketplace” wording versus no seller evidence | `PROJECT.md` defines a single-vendor platform; marketplace means PENA AMEEN’s catalog/storefront, not multi-vendor. |
| Initial discovery counted 6 products, later snippets reveal at least 4 additional possible product names | Catalog completeness remains UNKNOWN; no total is claimed. Full WooCommerce export is required. |
| First URL inventory listed 18 URLs, Phase 0.5 found at least 30 URL patterns/entries | URL inventory remains PARTIAL; no migration matrix can be finalized from either partial count alone. |
| Existing migration readiness says committed architecture is not ready, while Phase 1 planning proceeds | Not a conflict: Phase 1 is product discovery; provider/data-specific architecture and implementation remain blocked. |
| Phase 1 includes conceptual IA while Phase 2 is named Information Architecture | Not a conflict: Phase 1 defines conceptual product destinations/navigation; Phase 2 will define detailed approved routes, taxonomy, and URL mapping. |

---

## 25. Approval and next-phase gate

### For PENA AMEEN approval

Approve or amend:

1. product definition and single-vendor boundary;
2. MVP and post-MVP scope;
3. client decision register outcomes/deferments;
4. source-data/access handover plan;
5. migration URL/content/SEO governance;
6. staff operational and legal/policy owner assignments.

### Phase status

- **T001 — Product Discovery & Master PRD:** documentation deliverable COMPLETE.
- **T002 — Information Architecture:** READY, but **not started**. It may begin after client review/approval of this blueprint and must retain all migration constraints.
- **Technical/data/design/implementation phases:** remain blocked from finalization by the critical decisions and source-data gaps above.

No Phase 2 work, provider selection, application build, database, dependency installation, production modification, or final UI design has been started by this PRD.

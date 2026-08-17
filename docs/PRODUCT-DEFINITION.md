# PENA AMEEN Product Definition

**Phase:** 1 — Product Discovery & Master PRD
**Document status:** PROPOSED product blueprint; ready for client review, not an implementation or architecture decision.
**Evidence basis:** `PROJECT.md`, Phase 0–0.9 discovery and migration documents under `docs/`, and the Phase 1 product brief.

## 1. Status language

| Label | Meaning in this document |
|---|---|
| **CONFIRMED** | Directly stated by the project brief/control documents or supported by discovery evidence. |
| **PROPOSED** | A product recommendation that needs approval before it becomes an implementation commitment. |
| **UNKNOWN** | Not established by the available evidence. |
| **CLIENT DECISION REQUIRED** | A decision that must be made by PENA AMEEN before dependent architecture or implementation is finalized. |

## 2. What PENA AMEEN is

### CONFIRMED

PENA AMEEN is an education-oriented organization and commerce brand. Its current public site combines educational material, products, community/branch activity, and brand information. The public evidence identifies **AL-BARQY** and **ACM / Aku Cepat Membaca** as core educational content and product pillars, and uses the brand message *“Belajar Tanpa Mengenal Usia.”*

The new platform is a greenfield replatforming and rebranding of the current website. The current website remains the source system for migration-sensitive content, product, media, and SEO decisions.

### PROPOSED product statement

> PENA AMEEN is a trusted education-commerce destination where people can understand PENA AMEEN learning methods, discover the appropriate learning materials, purchase them through a clear and dependable transaction flow, and remain informed from order through delivery.

This statement deliberately does **not** promise unverified learning outcomes, geographic coverage, product availability, or customer segments.

## 3. The role of the website

The website should operate as one connected public and operational platform:

1. **Brand and trust destination** — explain PENA AMEEN, its educational methods, community, branches, and approved proof points.
2. **Educational discovery destination** — help visitors find articles and method information about AL-BARQY, ACM, literacy, Qur'an learning, parenting, and related approved topics.
3. **Single-vendor storefront** — let customers browse PENA AMEEN’s own catalog, evaluate products, purchase, pay, receive shipment information, and track delivery.
4. **Operational control surface** — give authorized staff the information and tools needed to maintain catalog/content and manage order, payment, shipping, and customer-support work.
5. **SEO preservation and growth surface** — preserve valuable existing URLs and content while establishing reusable product and content structures for organic discovery.

## 4. Marketplace meaning and operating model

### CONFIRMED — single-vendor commerce platform

The target operating model is a **single-vendor commerce platform**. `PROJECT.md` explicitly defines the project as a modern single-vendor digital commerce platform, and discovery found PENA AMEEN product/content ecosystem evidence but no evidence of third-party sellers, seller listings, seller onboarding, commissions, payouts, or seller fulfillment.

### CONFIRMED — meaning of “marketplace” in this project

In this project, “marketplace” means a searchable, browseable catalog and purchase experience for PENA AMEEN-managed products. It does **not** mean a multi-vendor marketplace.

### Explicit boundary

The following are **out of scope unless separately approved**:

- third-party seller registration or verification;
- seller-owned catalog management;
- vendor storefronts;
- commission calculation;
- seller settlement or payouts;
- vendor-specific shipping fulfillment;
- marketplace dispute workflows.

This boundary is tracked by `REQ-OOS-001` and is not a provider or technical selection.

## 5. Primary users

| User group | Evidence/status | What they need from the platform |
|---|---|---|
| **Public visitor** | CONFIRMED public-site audience; exact segments are partly inferred | Understand the brand and methods, find useful content, browse products, locate branches/contact information, and begin a purchase without friction. |
| **Customer** | CONFIRMED by commerce/cart/checkout evidence | Evaluate products, add one or more products to a cart, complete payment, receive order updates, and track delivery. |
| **Parent/caregiver** | INFERRED from parenting/child-learning content | Find age- and use-case-relevant educational materials and explanatory content. |
| **Educator/tutor/institutional buyer** | INFERRED from educational methods and packages | Understand learning-method materials and make an appropriate product enquiry or purchase. Whether special institutional purchasing is needed is UNKNOWN. |
| **Authorized PENA AMEEN staff** | CONFIRMED future admin requirement | Keep products/content accurate and operate orders, payments, fulfillment, shipping, and support. |
| **Branch/community stakeholder** | CONFIRMED branch/community pages; operational role UNKNOWN | Have current, approved branch/community information represented publicly. Branch self-service access is not assumed. |

The customer and staff capability requirements are detailed in `docs/CUSTOMER-ACCOUNT-PRD.md` and `docs/ADMIN-PRD.md`.

### 5.1 Role and capability matrix

The matrix deliberately describes **permission boundaries**, not final authentication roles. Public visitor access does not require authentication. Customer account/guest policy and staff role combinations remain client/architecture decisions; a single staff member may hold more than one staff capability.

| Requirement ID / role | Goals | Conceptual permissions | Primary tasks | Key information | Pain points / unknowns | Success criteria |
|---|---|---|---|---|---|---|
| **REQ-USR-001 — Public visitor** | Understand PENA AMEEN, explore education/community context, find products/help | View only approved public content, products, categories, contact/policy, and public tracking entry points; no private customer/staff data | Browse, search, read, locate branch/contact, begin purchase | Brand/method context, product/category information, approved contact/policy | Mixed current hierarchy; incomplete content/catalog; an old URL may be missing unless migrated | Finds a relevant and accurate next step without account or insider knowledge |
| **REQ-USR-002 — Customer** | Evaluate and purchase products; stay informed after purchase | Manage own cart; submit approved checkout information; access only authorized own order/tracking/account data through approved guest/account model | Add/edit cart, checkout, pay, view confirmation, track, seek support | Accurate product/price/availability, shipping/payment choice, order/tracking status, support/policy | Payment/shipping/account/lookup/returns policy unknown; product data may be incomplete | Completes a valid purchase and can obtain truthful post-purchase status |
| **REQ-USR-003 — Administrator** | Keep platform secure, configured, and operational | Authorized cross-functional oversight/settings/access only; exact role and sensitive-action approval are not assumed | Review dashboard/exceptions, manage approved settings/access, coordinate escalation | Cross-domain work state, policy references, audit/exception context | Staff roles, reporting, audit, manual fallback, and integrations unknown | Authorized operations are visible and safe configuration/escalation is possible |
| **REQ-USR-004 — Content manager** | Publish accurate, useful, discoverable content | Create/edit/publish approved content/media/taxonomy/SEO fields within assigned scope; final publishing/redirect permission TBD | Manage articles/pages/categories/tags/media/internal links/metadata | Approved source content, media rights, taxonomy, SEO/migration warnings | Full content export, claims, media rights, archive treatment, and editorial workflow unknown | Approved content is published/updated without breaking public URLs or links |
| **REQ-USR-005 — Order manager** | Progress orders and resolve customer/operational issues | View authorized order/customer/payment/shipping context and take only approved state actions; refund/payment override authority is not assumed | Search/filter orders, review status, coordinate payment/fulfillment/support, escalate exceptions | Order lines/totals, approved customer contact/destination, payment evidence/state, shipment/tracking history | Provider state mapping, fulfillment SOP, refund/cancellation policy, support path unknown | Every assigned order has a clear accurate next action or review route |
| **REQ-USR-006 — Product manager** | Keep catalog purchasable, accurate, and discoverable | Create/edit/archive approved product, category, price, inventory, media, and SEO data within assigned authority; pricing/inventory approval boundary TBD | Maintain product description/status/SKU/category/media/price/inventory/SEO; flag data issues | Source identity/SKU, product data, stock, variants/package, media, URL/SEO state | Complete catalog, variants, stock, packaging, rights, promotion/price policy unknown | Active product data is accurate, approved, and migration/SEO-safe |

## 6. Business problem the new platform solves

### CONFIRMED constraints from discovery

- Existing commerce, content, branch/community, and education experiences coexist but may have a mixed hierarchy.
- Product catalog data, catalog completeness, inventory data, checkout behavior, payment and shipping integrations, and fulfillment rules are not fully known.
- Valuable product, category, article, branch, gallery, and homepage URLs already have SEO value and must not disappear without an explicit migration decision.
- The present source system appears WordPress/WooCommerce-like, but the new platform is greenfield.

### PROPOSED problem framing

The platform should replace a fragmented or difficult-to-verify source experience with a clear end-to-end customer and staff experience that:

- connects educational intent to relevant product discovery;
- makes product information, prices, availability, cart, checkout, payment, and delivery status understandable;
- reduces manual reconciliation and repeated order-status enquiries for staff;
- gives staff controlled management of catalog, content, SEO, and fulfillment data;
- preserves existing discoverability while enabling future content growth.

This framing does not assert the current site has a specific conversion rate, manual-work volume, or customer satisfaction problem; those measurements are UNKNOWN.

## 7. Relationship of content, education, community, branches, and commerce

The platform should treat these as mutually reinforcing, not separate silos.

```text
Educational methods and helpful content
              ↓
Trust, organic discovery, and informed visitors
              ↓
Relevant method/category/product discovery
              ↓
Single-vendor commerce and fulfillment
              ↓
Post-purchase support, tracking, and repeat confidence

Community, events, galleries, and branches ──→ brand trust, local relevance, and content context
```

- **Content and education** explain concepts, use cases, methods, and approved guidance. They create context for a visitor who is not ready to buy yet.
- **Commerce** makes PENA AMEEN-managed learning materials discoverable and purchasable without treating content as a disguised checkout funnel.
- **Community, galleries, events, and branches** provide approved social/contextual proof and local relevance. Their exact active inventory, ownership, and operating model remain UNKNOWN.
- **SEO** connects these areas through durable URLs, metadata, internal links, structured data, sitemaps, and redirects.

## 8. What users should primarily do

### Public visitors and customers

1. Discover PENA AMEEN through search, direct links, social content, branches, or recommendations.
2. Learn enough from clear brand, method, article, and product information to make an informed choice.
3. Search or browse the catalog, compare relevant items, and add one or more products to a cart.
4. Complete checkout with validated contact/delivery information, a selected shipping option, and a payment method.
5. Receive a dependable order confirmation and status updates.
6. Track a shipment after a tracking number is available.
7. Return to content, products, or order support when needed.

### Administrators and staff

1. Maintain accurate product, category, price, inventory, media, and SEO information.
2. Review and progress orders based on verified payment and fulfillment state.
3. Create/manage shipments through the future provider-agnostic shipping capability, print labels when supported, and record or synchronize tracking numbers.
4. Publish and maintain articles, pages, branch/community material, and SEO metadata without casually breaking migration-sensitive URLs.
5. Find customer and order context for support and reconciliation.
6. Monitor operational exceptions, not only successful orders.

### 8.1 Journey requirements

| Requirement ID | Journey requirement | Status | Essential outcome / recovery condition |
|---|---|---|---|
| REQ-JRN-001 | Support the full discover → land → explore → product discovery → product detail → cart → checkout → payment → order confirmation → shipment → tracking → delivery → post-purchase journey. | MUST HAVE / CONFIRMED | Customer and staff can distinguish success, pending, and failure/recovery states at every commerce handoff. |
| REQ-JRN-002 | Support SEO, direct, social-media, and article-origin visitors with a relevant landing and next step. | MUST HAVE / CONFIRMED | A legacy/organic/content link resolves directly or through a meaningful documented redirect, not a dead end. |
| REQ-JRN-003 | Support product-search and category-browsing discovery journeys. | MUST HAVE / CONFIRMED | Customer can refine a result/category or recover from no result/empty/unavailable state. |
| REQ-JRN-004 | Support returning-customer, account-holder, and approved guest order-tracking/support journeys. | MUST HAVE / PROPOSED | Customer accesses only authorized order/tracking context; account/guest lookup policy remains a client decision. |
| REQ-JRN-005 | Support valid multi-product purchase through cart, checkout, payment, fulfillment, and tracking. | MUST HAVE / CONFIRMED | Multiple product lines are represented accurately without ambiguous price/shipping/order state. |

## 9. Business objectives

No numerical KPI is invented in this phase. Each objective has a measurable outcome type, but its baseline, target, measurement window, and owner are **CLIENT DECISION REQUIRED**.

| Requirement ID | Objective | Measurement direction / candidate measure | Status |
|---|---|---|---|
| REQ-OBJ-001 | Increase product discoverability | Product/category search impressions, product views, search-to-product engagement | CONFIRMED objective; target unknown |
| REQ-OBJ-002 | Improve organic search visibility | Indexed valid URLs, organic landing-page visibility, content/product impressions | CONFIRMED objective; target unknown |
| REQ-OBJ-003 | Increase product conversion | Add-to-cart, checkout-start, payment-success, and purchase completion progression | CONFIRMED objective; target unknown |
| REQ-OBJ-004 | Simplify checkout | Checkout validation/error frequency and checkout completion progression | CONFIRMED objective; target unknown |
| REQ-OBJ-005 | Automate shipping calculation | Rate-quote availability, quote errors, selected-shipping completion | CONFIRMED objective; provider/rules unknown |
| REQ-OBJ-006 | Automate shipment creation | Shipment creation completion, AWB availability, label availability where supported | CONFIRMED objective; provider/workflow unknown |
| REQ-OBJ-007 | Reduce administrative order work | Manual order-touch points, exception queues, time-to-fulfillment measures | CONFIRMED objective; baseline/target unknown |
| REQ-OBJ-008 | Improve product management | Product data completeness and staff catalog-management completion measures | CONFIRMED objective; target unknown |
| REQ-OBJ-009 | Preserve existing SEO equity | Redirect success, priority URL availability, metadata/indexing comparison, 404 monitoring | CONFIRMED objective; baseline/target unknown |
| REQ-OBJ-010 | Establish scalable content architecture | Ability to publish reusable articles/pages/category content with metadata and links | CONFIRMED objective; volume/target unknown |

## 10. Product principles

1. **Education before pressure.** Product discovery should be informed by useful, accurate educational context.
2. **Commerce correctness before novelty.** Price, availability, payment, shipping, order state, and support information must be trustworthy.
3. **One organization, one catalog owner.** Do not introduce vendor complexity without an explicit later decision.
4. **Migration safety is product safety.** Existing valuable URLs and content are customer-discovery assets, not disposable implementation details.
5. **Provider-agnostic operations.** Payment and shipping behavior are defined as business capabilities before a provider is selected.
6. **Clear recovery paths.** Customers and staff need understandable states and next steps when payment, rate calculation, shipment, or tracking fails.
7. **Simple public navigation.** A visitor should not need to understand internal organization structure to find products, content, or help.
8. **No invented policies.** Pricing rules, coupons, tax, returns, legal policy, product variants, account policy, and operational SOPs remain unknown until supplied or approved.

## 11. Product boundaries and known unknowns

### CONFIRMED boundaries

- The platform must support a complete conceptual commerce loop: discovery → product → cart → checkout → payment → order → shipping → tracking.
- Payment and shipping must remain provider-agnostic at this phase.
- SEO migration constraints apply to existing valuable URLs and related metadata/media/internal links.
- The project is not a multi-vendor marketplace.

### CLIENT DECISION REQUIRED / UNKNOWN

- Launch country/market and language strategy (`BUS-003`).
- Confirmed customer segments, B2B/institutional workflows, and merchandising priorities (`BUS-004`).
- Complete product catalog, SKU/inventory, variants/bundles, price, weight, and package rules.
- Payment provider, payment methods, refunds, settlement, and webhook/status rules.
- Shipping provider, couriers, origin, rate rules, AWB/label workflow, returns, and cancellation workflow.
- Guest checkout, account registration, customer migration, and historical order migration policy.
- Legal terms, privacy, shipping, return, refund, tax, and consent policy.
- Full source URL, metadata, media, content, branch, and Search Console inventory.

See `docs/CLIENT-DECISION-REGISTER.md` for the decision-oriented register and `docs/UNKNOWN-REGISTRY.md` for the source unknown registry.

## 12. Non-goals for this phase

This document does not select providers, define a technical architecture, define a database schema, design final user interfaces, create migrations, set commercial targets, or approve unverified business policy.

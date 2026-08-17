# PENA AMEEN Administrative Platform Requirements

**Phase:** 1 — Product Discovery
**Status:** PROPOSED administrative capability blueprint. It does not implement an admin system, authentication model, permissions model, provider integration, dashboard metric, or data schema.

> **SUPERSEDED (2026-08-17, D010):** The approved Admin Control Center specification
> (`PENA_AMEEN_ADMIN_ARCHITECTURE.md` v1.0) supersedes this document where they
> conflict. Implementation follows `docs/ADMIN-CONTROL-CENTER-PLAN.md`. This
> document remains valid as background for capability profiles and boundaries.

## 1. Administrative product purpose

The administrative platform should let authorized PENA AMEEN staff maintain accurate public catalog/content/SEO information and operate the order-to-fulfillment lifecycle with clear exceptions and audit-aware controls.

The administrative platform is not a seller portal. It manages PENA AMEEN’s own single-vendor catalog and operations.

## 2. Staff capability model

### Core principle

The following are **capability profiles**, not a required set of distinct authenticated roles. One staff member may hold several capabilities; a small operation may combine all of them under an administrator. Final identity, permission, approval, and audit rules remain **CLIENT DECISION REQUIRED**.

| Capability profile | Goals | Typical primary tasks | Information needed | Boundaries/pain points | Success criterion |
|---|---|---|---|---|---|
| Administrator | Keep the platform safe, configured, and operable | Review dashboard, maintain settings/access, oversee exceptions | Cross-functional operational state, approved policies, audit context | Needs broad visibility without unsafe exposure | Correct staff access and reliable operational visibility |
| Product manager | Keep catalog purchasable and discoverable | Create/edit/archive product, maintain price/category/media/SEO | Product identity, SKU, description, price, status, media, taxonomy | Source catalog/variant/inventory data is incomplete | Accurate approved catalog changes without URL/data loss |
| Order manager | Progress and support customer orders | Search/filter order, inspect payment/fulfillment state, communicate/escalate | Order/customer/payment/shipping context and history | State ambiguity and manual reconciliation | Each order has clear next action or exception path |
| Fulfillment/shipping manager | Create and monitor shipments | Review eligibility, create shipment, record AWB, print label, track exceptions | Destination, selected service, package, shipping state | Provider/origin/package/SOP unknown | Valid shipment/tracking work without duplicate or false status |
| Content manager | Publish useful accurate content | Create/edit articles/pages/categories, schedule/publish where approved | Source content, media, authorship, editorial policy | Full content inventory and treatment not available | Approved content is publishable and correctly linked |
| SEO manager | Preserve and improve findability | Maintain metadata/canonical/indexability/redirects/sitemap review | URL inventory, source SEO data, redirects, page/product content | Source URL/metadata inventory is incomplete | Priority URLs and metadata are protected and changes are traceable |
| Customer support | Resolve customer questions safely | Find customer/order/tracking context, route issue, send approved communication | Authorized customer/order/status data | Privacy, support SOP, and contact channels unknown | Customer receives accurate next action without data leakage |

## 3. Administrative requirements

| Requirement ID | Capability | Priority | Status | Critical dependencies |
|---|---|---|---|---|
| REQ-ADM-001 | Dashboard exposes actionable operational work and approved summary indicators, not invented KPIs. | MUST HAVE | PROPOSED | Reporting needs, data availability, permissions |
| REQ-ADM-002 | Products can be created, edited, archived/deleted under approved retention/SEO controls. | MUST HAVE | CONFIRMED product requirement | Catalog source, product lifecycle/redirect policy |
| REQ-ADM-003 | Staff can maintain product pricing, approved sales/promotion data, availability/inventory, categories, images, and SEO. | MUST HAVE | CONFIRMED product requirement | Catalog/SKU/stock/media/promotion policy |
| REQ-ADM-004 | Staff can find, filter, inspect, and progress orders using distinct order/payment/fulfillment/shipment states. | MUST HAVE | CONFIRMED product requirement | Order workflow, payment/shipping state mapping |
| REQ-ADM-005 | Authorized staff can perform approved shipping operations: rate review, shipment creation, AWB/resi, label, and tracking. | MUST HAVE | CONFIRMED product requirement | Provider/SOP/package/origin/permissions |
| REQ-ADM-006 | Staff can find customer profiles and relevant order/contact context within approved privacy boundaries. | SHOULD HAVE | PROPOSED | Customer policy/migration/consent |
| REQ-ADM-007 | Staff can maintain articles, pages, categories, metadata, canonicals, redirects, internal links, and sitemap-relevant content. | MUST HAVE | CONFIRMED product requirement | Content/SEO export, redirect matrix, permissions |
| REQ-ADM-008 | Staff can manage approved branch/community records, events, and media when these sections continue. | CLIENT DECISION REQUIRED | BLOCKED | Branch/event data and retention decision |
| REQ-ADM-009 | Staff can manage promotions only after coupon/discount policy is approved. | CLIENT DECISION REQUIRED | BLOCKED | Pricing/promotion policy |
| REQ-ADM-010 | Settings can represent approved business configuration without embedding provider-specific assumptions. | MUST HAVE concept | PROPOSED | Client policies, final architecture |
| REQ-ADM-011 | Permissions are based on least-privilege capabilities, sensitive-action controls, and audit needs; final roles are not assumed. | MUST HAVE concept | PROPOSED | Client operations/security decision |
| REQ-ADM-012 | Operational exceptions, failures, and manual-review queues are visible to the appropriate staff. | MUST HAVE | PROPOSED | SOP, payment/shipping event behavior |

## 4. Dashboard

### Purpose

The dashboard is an operational starting point, not a vanity-metrics page. It should surface tasks that staff can act on.

### Proposed dashboard areas

| Area | Examples of actionable information | Status |
|---|---|---|
| Order work | Orders awaiting payment review, paid/processing orders, fulfillment-ready orders, blocked orders | MUST HAVE concept |
| Payment exceptions | Pending too long, verification/manual-review, failed/expired/cancelled states, refund actions | MUST HAVE concept; exact thresholds unknown |
| Shipping work | Orders awaiting shipment, rate/shipment/AWB/label/tracking failures, delivery exceptions | MUST HAVE concept |
| Inventory/catalog health | Unavailable/low-stock indicators if approved, products missing required data/media/SEO | SHOULD HAVE; thresholds/data unknown |
| Content/SEO health | Draft/review needs, redirect/metadata warnings, priority URL migration status | SHOULD HAVE |
| Customer support | Orders/tracking requiring follow-up, approved contact tasks | SHOULD HAVE |
| Business reporting | Approved revenue/order/conversion/operational reporting | CLIENT DECISION REQUIRED |

No numerical targets, revenue figures, conversion rates, low-stock thresholds, SLA timers, or alert rules are defined in Phase 1.

## 5. Product and catalog management

### Required functions

1. **Create product** — capture approved product identity and publish readiness; no assumed required fields beyond data contract until catalog policy is confirmed.
2. **Edit product** — maintain name, description, short description, source identity/SKU, status, price/sale price, categories/tags, images, inventory-related data, variants if verified, related content/products if approved, and SEO fields.
3. **Archive/delete** — prevent accidental removal of an active or indexed product; require a documented product/URL/content treatment and redirect review when needed.
4. **Pricing** — maintain regular/sale price and approved validity/rules; do not invent tax, sale schedule, rounding, discount, or currency behavior.
5. **Inventory** — view/update validated stock status/quantity and approved backorder/threshold behavior; all source stock rules are currently UNKNOWN.
6. **Categories/taxonomy** — maintain category/tag identity, descriptions, hierarchy, and SEO safely; source taxonomy cannot be casually collapsed.
7. **Images/media** — assign approved product media, preserve usable accessibility metadata, and honor rights/ownership information.
8. **SEO** — maintain title, description, canonical, indexability, structured-data inputs, and internal links as approved; cannot replace source metadata without migration review.

### Product lifecycle controls — PROPOSED

- Preserve stable internal/source identity even if a display name changes.
- Warn before changing a slug/URL or archiving/deleting a page with migration/SEO impact.
- Record who changed sensitive commercial/catalog information and when, subject to final audit policy.
- Validate fields needed for a product to be purchasable; the precise “publish-ready” checklist depends on verified product/operations data.
- Separate product visibility from inventory availability where the business needs both; exact policy is UNKNOWN.

## 6. Order, payment, and fulfillment management

### 6.1 Orders

The order workspace must support:

- list/search/filter by order reference, date, customer context, order state, payment state, fulfillment state, and shipping/tracking state where approved;
- order detail with product lines, totals, approved customer/delivery information, payment context, fulfillment/shipment context, and status history;
- clear next allowed actions and exception reasons;
- non-destructive notes/support context only if approved by policy;
- customer communication triggers/templates only after notification policy is defined;
- safe treatment of cancellation/refund/return actions according to approved policy.

### 6.2 Payment status

Staff must distinguish at least conceptual `pending`, `verified/paid`, `failed`, `expired`, `cancelled`, `refund processing`, `refunded`, and `manual review` states where applicable. Exact state mapping, evidence, manual override rules, finance approval, and settlement handling remain provider/SOP decisions.

### 6.3 Fulfillment and shipping

The staff workspace must support the conceptual sequence:

```text
Eligible order → package/shipping review → rate/service selection if needed
→ shipment creation → AWB/resi capture → label print/retrieve → dispatch/tracking monitoring
```

Requirements include:

- show selected customer shipping option and required package/order context;
- guard against shipment creation for an ineligible order under the future SOP;
- create/retry/review shipment action without falsely marking the order shipped;
- display/store verified AWB/resi and tracking state;
- print/retrieve a label when the future provider supports it;
- show shipping/tracking exceptions and an approved support/escalation action;
- separate shipment creation, AWB assignment, label availability, dispatch, and delivery states.

## 7. Customer management

### Proposed customer record view

An authorized staff member may need:

- permitted customer name/contact information;
- customer’s order references/history if policy and migration permit;
- billing/shipping address context only as necessary for operations/support;
- consent/preferences if maintained and legally valid;
- approved support/communication history or notes, if such feature is approved;
- links to relevant order/payment/shipment context.

### Boundaries

- Customer account migration is a client decision (`CUST-001`).
- Customer fields, consent, retention, marketing use, privacy policy, and support-note policy are UNKNOWN.
- Staff access must minimize personal-data exposure and must not assume access to passwords, payment credentials, or unrelated information.

## 8. Content, SEO, and media management

### Content

Content management must support approved articles, pages, categories, tags, author/date context where retained, internal links, content status, and media. The exact editorial workflow, authors, scheduling, revisions, and approval process are not set.

### SEO

The admin product must support controlled management of:

- title and meta description;
- canonical URL;
- indexability/robots intent;
- structured-data inputs where valid;
- Open Graph/social metadata;
- internal links/content relationships;
- sitemap-relevant publication state;
- redirect entries with old URL, new URL, type, reason, owner/status, and validation context.

Critical guardrail: source SEO metadata, indexed URL, and redirect inventory are incomplete. Admin controls must not become an excuse to overwrite or abandon source SEO assets without review.

### Media

Media management must support:

- product/content/branch/event media association;
- accessible alt text/caption fields where appropriate;
- approved rights/ownership context where provided;
- visibility/publish state as needed;
- detection/review of missing/broken required media;
- safe reuse without inventing media ownership.

## 9. Branches, events, promotions, and settings

| Area | Product requirement | Status / dependency |
|---|---|---|
| Branches | Maintain approved branch name, region, address, contacts, status, media, local SEO fields, and migration-safe URL treatment if branch pages continue | SHOULD HAVE; complete branch data and active-status decision unknown |
| Events | Maintain approved event title/date/location/content/status if events continue | CLIENT DECISION REQUIRED; source/event strategy unknown |
| Promotions | Define and maintain coupon/discount/promotion data and eligibility only after policy approval | CLIENT DECISION REQUIRED; do not invent rules |
| Settings | Hold approved business-facing configuration references for catalog, order, notification, legal, access, and integrations | MUST HAVE concept; exact settings and technical ownership later |

## 10. Permission requirements — conceptual only

The future permission model must support least privilege and separation of sensitive actions, but Phase 1 does not prescribe roles, authentication technique, or a permission matrix.

| Capability | Minimum conceptual boundary |
|---|---|
| View orders | Limited to staff with operational/support need. |
| Edit products/content | Limited to authorized product/content staff; publishing/SEO impacts need controls. |
| Edit inventory/prices/promotions | Restricted due direct commercial impact; approval/audit needs are a client decision. |
| Create/cancel shipments / print labels | Limited to fulfillment staff; actions need correct-order context. |
| View/act on payment/refunds | Restricted to authorized finance/order staff; refund authority needs explicit decision. |
| View customer personal data | Limited to support/operations need and privacy policy. |
| Edit SEO/redirects | Restricted because URL/indexing changes carry migration risk. |
| Manage staff access/settings | Limited to platform administrators. |

**CLIENT DECISION REQUIRED:** staff roles, combinations of capabilities, approval thresholds, audit-retention requirements, manual overrides, support access, finance authority, and emergency-access process.

## 11. Administrative success and failure states

Every major administrative workflow needs a visible state beyond a “save” button:

| Workflow | Success state | Failure / recovery state |
|---|---|---|
| Product update | Approved product data saved/published according to state | Validation, conflict, media, URL/SEO warning, or permission issue with safe recovery |
| Price/inventory update | Correct authorized update with audit context | Invalid/unauthorized/conflicting data or source-of-truth discrepancy routed for review |
| Order action | Allowed state transition recorded | Action blocked because payment/stock/permission/SOP prerequisites not met |
| Payment review/refund | Verified status/action recorded under approved authority | Unmatched, delayed, failed, duplicate, or unauthorized case routed to review |
| Shipment action | Shipment/AWB/label state accurately updated | Quote/provider/package/duplicate/print/tracking failure shown without false dispatch |
| Content/SEO update | Approved published/draft state and metadata/redirect validation | Missing required content, unsafe URL change, redirect conflict, or permission issue |
| Media update | Approved media is associated and usable | Rights/missing file/alt/association issue is explicit |

## 12. Dependencies and deferrals

Admin requirements cannot be finalized into architecture until the client supplies or decides the catalog/SKU/inventory model, order/fulfillment SOP, payment/shipping provider behavior, staff responsibilities, legal/privacy policy, branch/event treatment, promotion policy, reporting needs, source exports, and SEO redirect inventory. The requested data is enumerated in `docs/CLIENT-DATA-REQUEST.md` and `docs/COMMERCE-DATA-REQUEST.md`.

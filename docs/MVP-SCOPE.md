# PENA AMEEN MVP Scope

**Phase:** 1 — Product Discovery
**Status:** PROPOSED scope partition. The MVP is a complete commerce-loop definition, not a production-ready implementation plan. Client decisions and migration data still gate final architecture and launch.

## 1. MVP objective

The MVP must let a customer complete the core journey:

```text
DISCOVERY
→ PRODUCT
→ CART
→ CHECKOUT
→ PAYMENT
→ ORDER
→ SHIPPING
→ TRACKING
```

while preserving the core PENA AMEEN education/content and SEO capabilities that enable discovery and protect existing valuable URLs.

The MVP does **not** mean “launch with partial commerce.” A page without valid product data, a checkout without verified payment handling, a shipment without a trackable/operable state, or a migration that abandons valuable URLs is not a complete MVP loop.

## 2. Scope classification

| Term | Meaning |
|---|---|
| **MUST HAVE — MVP** | Required for the end-to-end launch loop, core content/SEO preservation, or essential staff operation. Some items remain blocked until client data/decisions are supplied. |
| **SHOULD HAVE — POST-MVP / launch enhancement** | Valuable capability that should follow as soon as core loop/data stability is proven, or may enter MVP if explicitly approved and ready. |
| **NICE TO HAVE** | Potential improvement that must not distract from commerce correctness, migration safety, or operational readiness. |
| **CLIENT DECISION REQUIRED** | A scope/policy/data decision that must be resolved before dependent MVP architecture or implementation can be finalized. |

## 3. MUST HAVE — MVP

### 3.1 Public discovery and core content

| Requirement IDs | MVP capability | Definition of done at product level |
|---|---|---|
| REQ-MVP-002, REQ-IA-001, REQ-PAG-001 | Clear public entry/orientation | Visitors can find shop, education/content, help/contact, and appropriate branch/community context without a cluttered primary navigation. |
| REQ-COM-001, REQ-SRH-001, REQ-SRH-003 | Product discovery | Customer can browse retained/approved categories and search eligible products to reach product detail. |
| REQ-COM-002, REQ-COM-010 | Product detail and product SEO | Product page shows verified purchasable information, correct states, and migration-safe URL/SEO treatment. |
| REQ-SEO-002, REQ-SEO-008 | Core education/content pillars | AL-BARQY and ACM content/method paths and retained priority articles are publishable and linked appropriately. |
| REQ-SEO-001, REQ-SEO-003 to REQ-SEO-006 | SEO preservation baseline | Priority source URLs are preserved/mapped, metadata/indexability/canonical/structured-data needs are controlled, sitemap/redirect process exists, and no legacy URL is silently abandoned. |
| REQ-PAG-010, REQ-PAG-012 | Contact and approved legal/policy content | Customers can reach verified support/contact and required approved policy pages. |

### 3.2 Commerce loop

| Requirement IDs | MVP capability | Definition of done at product level |
|---|---|---|
| REQ-MVP-001, REQ-COM-003, REQ-COM-007 | Cart and complete-loop foundation | Customer can add/edit/remove one or more valid products, see a transparent summary, and recover from invalid cart states as part of the complete commerce loop. |
| REQ-COM-004, REQ-COM-008 | Checkout | Customer can provide validated approved customer/destination data, select shipping/payment, review the order, and see clear error/retry states. |
| REQ-SHP-001 to REQ-SHP-003 | Shipping quote and selection | Customer destination leads to eligible options/costs or an explicit no-service/failure recovery state; no invented rate is charged. |
| REQ-PAY-001 to REQ-PAY-004 | Payment lifecycle | Customer can initiate an approved payment; pending, verified success, failed, expired, cancelled, and recovery outcomes are distinguishable. |
| REQ-PAY-006, REQ-PAY-009 | Payment correctness | Trusted payment events can be reconciled safely enough that customer/staff do not receive false/duplicate outcomes. |
| REQ-COM-005, REQ-COM-006 | Order state/confirmation | Order, payment, fulfillment, shipment, and tracking states are distinct; customer sees the accurate next step. |
| REQ-SHP-004 to REQ-SHP-007, REQ-SHP-009 | Shipment through tracking | Staff can create/initiate a shipment, store AWB/resi, print/retrieve label when supported, handle failures, and customer can access approved tracking. |
| REQ-NTF-001 to REQ-NTF-004 | Transactional notifications | Customer receives approved state-appropriate order/payment/shipment notifications through a confirmed baseline channel. |
| REQ-ACC-003 | Post-purchase access | Customer has an approved way to retrieve eligible order/tracking support without depending on unapproved historical account migration. |

### 3.3 Essential administration

| Requirement IDs | MVP capability | Definition of done at product level |
|---|---|---|
| REQ-MVP-003, REQ-ADM-001, REQ-ADM-012 | Operational dashboard/exceptions | Appropriate staff can find material order, payment, shipping, catalog, and migration exceptions. |
| REQ-ADM-002 to REQ-ADM-005 | Catalog, order, payment, shipping operations | Staff can maintain active products/inventory/category/media/SEO and operate valid orders through shipment/AWB/label/tracking workflows. |
| REQ-ADM-007 | Content/SEO operation | Staff can publish/maintain approved content, metadata, and redirects with URL-safety controls. |
| REQ-ADM-010, REQ-ADM-011 | Configuration/access principles | Approved business settings and least-privilege staff capabilities can be represented; detailed roles are not assumed. |

### 3.4 Quality and validation

| Requirement IDs | MVP capability | Definition of done at product level |
|---|---|---|
| REQ-MVP-004, REQ-NFR-001 to REQ-NFR-008 | Core quality | Performance, SEO, accessibility, security/privacy, responsiveness, reliability, observability, and maintainability have approved acceptance criteria before launch. |
| REQ-ANL-001 to REQ-ANL-004 | Measurement baseline | Core journey, payment/shipping, search, priority URL/redirect/404 measurement requirements are instrumentable and validated subject to consent policy. |
| REQ-MVP-001 to REQ-MVP-004 | MVP acceptance | Complete commerce loop and source-to-target migration safety are tested against approved data/policy. |

## 4. SHOULD HAVE — post-MVP or approved launch enhancement

| Requirement IDs | Capability | Why deferred or conditional |
|---|---|---|
| REQ-COM-009 | Approved related products and educational-context links | Valuable conversion/discovery enhancement; source relationship data unknown. |
| REQ-SRH-002, REQ-SRH-005, REQ-SRH-006 | Article search, autocomplete, suggestions, richer relevance/typo handling | Product search is core; content search enhancement depends on source content/language/search decisions. |
| REQ-ACC-002, REQ-ACC-004, REQ-ACC-006 | Customer accounts, self-service order history, password recovery | Useful but account/guest/migration policy is undecided; core post-purchase access remains required. |
| REQ-ADM-006 | Customer management workspace | Useful support capability; depends on privacy/account/customer migration decisions. |
| REQ-ADM-008 | Branch/community management | Depends on complete source data and retention/operating decision. |
| REQ-SEO-009 | Enhanced media metadata remediation | Important but needs media export/rights/alt-text inventory; core product images and accessible content remain MVP quality needs. |
| REQ-NTF-005 | Staff-facing notification alerts | Operationally helpful; core exception visibility is already MVP. |
| REQ-ANL-003 | Rich lifecycle/error analysis | Baseline payment/shipping measurement is MVP; advanced reporting can follow approved event/data governance. |
| Branch directory/detail, gallery, FAQ | Expanded community/support presentation | Existing SEO-sensitive branch/gallery assets must be preserved/mapped; scope/content readiness determines launch inclusion. |
| Delivery exception customer workspace | Rich post-purchase exception self-service | Needs support/returns/carrier SOP. |

## 5. NICE TO HAVE

| Capability | Reason not MVP |
|---|---|
| Product comparison | No evidence it is required; adds catalog/content design complexity. |
| Wishlist / saved cart | Convenience feature dependent on account policy. |
| Advanced semantic/recommendation engine | Requires reliable product/content data and is not needed for basic discovery. |
| Ratings/reviews display and moderation | Source review data/policy unknown. |
| Back-in-stock alerts | Inventory rules and notification policy unknown. |
| In-app notification center | Requires customer-account scope; external transactional messaging is higher priority. |
| Rich branch/event filters/maps | Data completeness and local strategy unknown. |
| Advanced merchandising, personalization, A/B testing | No approved data/governance/measurement model. |
| Social sharing enhancements | May be added after accurate Open Graph/assets are in place. |

## 6. CLIENT DECISION REQUIRED — architecture and launch gates

The following must be resolved or explicitly deferred with an approved operational fallback before MVP architecture/implementation is finalized:

| Decision / requirement | Why it gates MVP |
|---|---|
| REQ-DEC-001 — approve product blueprint, MVP boundaries, launch market/language, and merchandising priorities | Defines who/what is being launched and prevents overbuilding. |
| REQ-DEC-002 — complete catalog, SKU, status, prices, variants/bundles, inventory, weight/dimensions/package rules source of truth | A product cannot be purchased, stocked, priced, or shipped safely without it. |
| REQ-DEC-003 — payment provider, account owner, launch methods, status/webhook/verification, refunds, settlement | Required to complete/payment-reconcile orders. |
| REQ-DEC-004 — shipping provider, couriers, origin, coverage, rates, package rules, shipment/AWB/label/tracking workflow | Required to calculate shipping and fulfill orders. |
| REQ-DEC-005 — legal/commerce policy: privacy, terms, shipping, return/refund, tax/price/consent | Required for checkout, customer data, support, and legal communication. |
| REQ-DEC-006 — guest checkout/account/lookup/customer migration/historical order policy | Required for checkout and customer self-service/privacy design. |
| REQ-DEC-007 — full URL/SEO/content/media/branch export and redirect/content treatment approval | Required to preserve SEO and launch accurate public content. |
| REQ-DEC-008 — staff responsibilities, permissions, approval/manual fallback, order/fulfillment SOP | Required to operate price/inventory/order/payment/shipping safely. |
| REQ-DEC-009 — notification channels/sender/consent and analytics/consent/access | Required for customer communications and compliant measurement. |
| REQ-DEC-010 — promotions/coupon policy and advanced conditional features | Must be explicitly deferred or defined; no unverified checkout rules. |

See `docs/CLIENT-DECISION-REGISTER.md` for detailed priority, owner, evidence, and blocking impact.

## 7. Explicit MVP exclusions

MVP excludes multi-vendor marketplace functionality, seller dashboards/payouts, mobile apps, advanced loyalty, complex ERP, advanced recommendation engine, real-time chat, social-network functionality, and other items in `docs/OUT-OF-SCOPE.md` unless later approved.

## 8. MVP acceptance statement

The Phase 1 MVP definition is satisfied only when PENA AMEEN can approve a scope in which an eligible customer can discover an accurate product, buy multiple valid products through an understandable checkout, receive a truthful payment/order outcome, have staff create/manage shipment and tracking, access post-purchase support/tracking, and find core AL-BARQY/ACM content — while priority source URLs/content are retained or explicitly mapped and all known provider/policy dependencies are resolved.

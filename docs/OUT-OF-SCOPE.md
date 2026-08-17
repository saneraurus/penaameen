# PENA AMEEN Out of Scope

**Phase:** 1 — Product Discovery
**Status:** Scope guardrail. Items below must not be designed, estimated as committed delivery, or implemented unless PENA AMEEN explicitly approves a later product decision and the relevant architecture/data/legal work.

## 1. Scope principle

PENA AMEEN’s MVP priority is a correct **single-vendor** commerce platform that connects education/content discovery to product purchase, payment, shipping, tracking, administrative operation, and SEO-safe migration. Features that materially expand the business model, payment/fulfillment complexity, identity/privacy exposure, operational load, or architecture footprint are deliberately excluded.

## 2. Explicit exclusions

| Requirement ID | Feature / area | Status | Reason / condition for reconsideration |
|---|---|---|---|
| REQ-OOS-001 | Multi-vendor marketplace | OUT OF SCOPE | Target project is single-vendor; no seller evidence exists. Requires a new business model decision. |
| REQ-OOS-002 | Seller dashboards and seller onboarding | OUT OF SCOPE | No third-party seller workflow is in scope. Requires multi-vendor approval. |
| REQ-OOS-003 | Seller commissions, settlements, payouts, tax documents, and vendor disputes | OUT OF SCOPE | Requires multi-vendor finance/legal/operations model. |
| REQ-OOS-004 | Vendor-owned products, storefronts, inventory, shipping, or returns | OUT OF SCOPE | Contradicts confirmed PENA AMEEN-owned catalog model unless business model changes. |
| REQ-OOS-005 | Advanced loyalty, points, tiers, wallet/credits, referrals, or gamification | OUT OF SCOPE | No approved program, data, legal/finance, or customer-policy requirement. |
| REQ-OOS-006 | Complex ERP, accounting ledger, procurement, warehouse-management system, or enterprise reconciliation platform | OUT OF SCOPE | Core order/payment/shipping operations are the MVP; ERP scope requires separate discovery. |
| REQ-OOS-007 | Advanced AI/behavioral recommendation engine or personalization system | OUT OF SCOPE | No approved data/governance/model requirement; contextual related products/content is sufficient when approved. |
| REQ-OOS-008 | Native mobile application | OUT OF SCOPE | Responsive web is required; native app needs separate user, distribution, support, and security discovery. |
| REQ-OOS-009 | Real-time chat or live-agent messaging | OUT OF SCOPE | Contact/support route is required; real-time communication provider/SOP/staffing is not. |
| REQ-OOS-010 | Social-network functionality, public profiles, follows, feeds, comments, or community messaging | OUT OF SCOPE | Community/branch/gallery content is not a social network. |
| REQ-OOS-011 | Subscription, recurring billing, memberships, or automatic replenishment | OUT OF SCOPE | Product/payment policy does not establish a recurring business model. |
| REQ-OOS-012 | Installment, split-payment, credit, lending, or buy-now-pay-later flows | OUT OF SCOPE | Payment methods/provider/legal model unknown. |
| REQ-OOS-013 | Cash-on-delivery, manual bank-transfer, or offline payment flow | OUT OF SCOPE unless explicitly confirmed | Payment method and operational reconciliation are unknown. |
| REQ-OOS-014 | International/multi-currency/multi-language commerce | OUT OF SCOPE unless launch strategy confirms it | Launch market/language/currency are unknown. |
| REQ-OOS-015 | Multi-origin or cross-border fulfillment | OUT OF SCOPE unless operations confirms it | Origin/warehouse and shipping rules are unknown. |
| REQ-OOS-016 | Customer account migration and historical order migration by default | OUT OF SCOPE by default | Explicit client/legal decisions and secure source data are required. |
| REQ-OOS-017 | Ratings/reviews import, moderation, and public review program | OUT OF SCOPE unless approved | Source review data/rights/moderation policy unknown. |
| REQ-OOS-018 | Coupon campaigns, loyalty discounts, free-shipping thresholds, and promotion engines by default | OUT OF SCOPE unless approved | Commercial/pricing/eligibility policy unknown. |
| REQ-OOS-019 | Event registration/ticketing and branch self-service portals | OUT OF SCOPE unless approved | Event/branch operating model and data are incomplete. |
| REQ-OOS-020 | Marketing automation, abandoned-cart campaigns, ad-tech retargeting, session replay, and behavioral profiling | OUT OF SCOPE | Requires separate consent, privacy, analytics, and marketing approval. |
| REQ-OOS-021 | Provider-specific payment/shipping integration selection or implementation in Phase 1 | OUT OF SCOPE | Phase 1 is product discovery; providers remain abstract/unknown. |
| REQ-OOS-022 | Application code, database migrations, framework installation, production-site changes, or final UI designs in Phase 1 | OUT OF SCOPE | Explicit phase boundary. |

## 3. Not excluded, but not assumed

The following are not automatically in or out; they need an explicit decision because they can affect the MVP loop:

- guest checkout versus required account;
- customer order lookup/tracking access model;
- customer account, profile, saved-address, and historical-data migration scope;
- payment methods, expiration/cancellation/refund operations;
- shipping provider/couriers/rates/AWB/label/return workflow;
- branches/events/gallery treatment;
- product variants/bundles, availability/backorders, pricing/tax/promotion policy;
- search autocomplete/typo tolerance and content search scope;
- notification channels, analytics/consent, staff reporting/permissions.

These are documented in `docs/CLIENT-DECISION-REGISTER.md` and should not be silently treated as exclusions that destroy existing SEO/content value.

## 4. Change-control condition

To reconsider an out-of-scope item, PENA AMEEN must provide a written product decision covering the user/business outcome, affected users, launch priority, operational owner, policy/legal requirements, data sources, integration/provider implications, success criteria, migration impact, and delivery-phase approval. The item then needs its own requirement/matrix update before architecture or implementation begins.

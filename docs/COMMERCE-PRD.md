# PENA AMEEN Commerce Product Requirements

**Phase:** 1 — Product Discovery
**Status:** Product requirements are a mixture of CONFIRMED project requirements and PROPOSED behavior. They are not provider, architecture, database, pricing-policy, or UI decisions.

## 1. Commerce scope

### CONFIRMED

- PENA AMEEN requires a single-vendor commerce loop: discovery → product → cart → checkout → payment → order → shipping → tracking.
- The existing source has WooCommerce-style product, category, cart, and checkout evidence, but its detailed rules are incomplete.
- PENA AMEEN products include education-oriented AL-BARQY and ACM materials; the complete catalog, SKU, stock, variants, dimensions, prices, media, and product status are UNKNOWN.
- Payment and shipping must remain provider-agnostic until client/provider decisions are made.

### Out of scope for this PRD

This commerce model does not include seller onboarding, third-party catalogs, seller commissions, or marketplace payouts. See `REQ-OOS-001`.

## 2. Commerce objectives

| Requirement ID | Requirement | Status |
|---|---|---|
| REQ-COM-001 | Customers can discover PENA AMEEN-managed products through search, category/contextual browsing, and relevant content links. | CONFIRMED requirement |
| REQ-COM-002 | Customers can evaluate a product using accurate available catalog data before adding it to a cart. | CONFIRMED requirement |
| REQ-COM-003 | Customers can manage one or more product items in a cart and see a transparent order summary. | CONFIRMED requirement |
| REQ-COM-004 | Checkout collects validated customer/delivery details, shipping choice, payment choice, and an order review without hidden business rules. | CONFIRMED requirement |
| REQ-COM-005 | An order has distinguishable payment, fulfillment, and shipment/tracking states so customers and staff do not confuse them. | PROPOSED requirement |
| REQ-COM-006 | Customers receive a clear success, pending, or recoverable failure outcome after payment initiation. | CONFIRMED requirement |
| REQ-COM-007 | Catalog, cart, checkout, and order behavior work for a purchase containing multiple products. | CONFIRMED requirement |
| REQ-COM-008 | Price, availability, and shipping information must not be represented as confirmed when source data/rules are unknown. | CONFIRMED constraint |
| REQ-COM-009 | Related products or relevant educational content can support contextual discovery where product relationships are approved. | SHOULD HAVE / PROPOSED |
| REQ-COM-010 | Product/category routes and product SEO information are migration-sensitive and must be retained or mapped. | CONFIRMED migration requirement |
| REQ-COM-011 | Coupon/discount support must not be assumed until PENA AMEEN confirms promotion policy and rules. | CLIENT DECISION REQUIRED |
| REQ-COM-012 | Product variants/bundles must be supported only to the extent verified by catalog and fulfillment data. | CLIENT DECISION REQUIRED |

## 3. Product discovery

### 3.1 Search

The public experience must let a customer search for products. Article/content search may share a search experience or be scoped separately; the final search presentation is covered by `docs/SEARCH-PRD.md`.

**Required behavior**

- accept a customer query and present relevant eligible products;
- identify what was searched and show an understandable result state;
- let the customer reach a product detail page;
- handle no results, temporary search failure, unavailable results, and an empty query without pretending a product was found;
- preserve a route back to shop/category browsing.

**PROPOSED enhancements**

- contextual suggestions/autocomplete;
- product/category/content result type labels;
- typo tolerance;
- search analytics that do not expose sensitive customer data.

The search engine, index technology, synonym list, language behavior, result ranking formula, and exact query privacy retention are UNKNOWN and not selected here.

### 3.2 Category browsing

Customers must be able to browse catalog groupings. Existing source categories/tags include `al-barqy`, `flashcard`, `CD`, `Umum`, and `ernuwidodo`; source taxonomy mixes method, format, and catch-all concepts.

**Requirements**

- display a category/archive identity and product list where the archive is retained;
- provide a path back to shop and to relevant neighboring categories;
- display an honest empty/unavailable state;
- preserve or map legacy category/tag routes in accordance with SEO migration decisions;
- do not force a new taxonomy hierarchy before complete catalog/SEO analysis.

### 3.3 Filtering and sorting

| Capability | Status | Boundary |
|---|---|---|
| Category/context filter | MUST HAVE | Based only on approved taxonomy. |
| Availability filter | SHOULD HAVE | Depends on validated inventory state and business policy. |
| Price range/filter | SHOULD HAVE | Depends on validated currency/price representation; no threshold invented. |
| Method/format/use-case facets | SHOULD HAVE | Requires catalog data and approved taxonomy; source mix must be preserved/mapped. |
| Sort by relevance | MUST HAVE for search | Relevance approach is provider/engine agnostic. |
| Sort by price/newness/popularity | CLIENT DECISION REQUIRED | Data, merchandising policy, and definition of “new”/“popular” are unknown. |

### 3.4 Product cards

A product card is a compact discovery representation, not the authority for all product data.

**MUST HAVE, when data exists:**

- product name;
- primary approved image or a safe fallback state;
- current displayable price and sale price where applicable;
- availability representation consistent with approved inventory policy;
- link to product detail;
- category/context where it helps discovery.

**DO NOT ASSUME:** badges, ratings/reviews, “best seller”, savings percentage, stock quantity, installment amounts, or promotional claims. These require verified data/policy.

### 3.5 Related products and content

- **SHOULD HAVE:** relevant related products and/or educational articles on product or content pages where relationships are supplied or editorially approved (`REQ-COM-009`).
- **UNKNOWN:** existing cross-sells, upsells, related-product logic, reviews, and recommendation rules.
- **Out of scope:** an advanced behavioral recommendation engine for MVP.

## 4. Product detail requirements

A product detail page must let a customer make an informed purchase without presenting incomplete source data as fact.

| Product element | Requirement | Current data status |
|---|---|---|
| Images | Show approved primary and supporting images; provide accessible descriptions where supplied | Media library, rights, alt text UNKNOWN |
| Name | Show verified product name | PARTIAL source evidence |
| Description | Show approved long/short description and included-package information when known | PARTIAL snippets only |
| Price | Show current regular price where sale price does not apply | PARTIAL source evidence; rule/status unknown |
| Sale price | Show a verified active sale price and non-misleading context when applicable | PARTIAL source evidence |
| Availability | Communicate available/unavailable state based on approved inventory rules | Stock/status rules UNKNOWN |
| SKU | Show or use SKU only where PENA AMEEN approves customer visibility; staff must have stable identity | All discovered SKUs UNKNOWN |
| Weight/dimensions | Use validated values for shipping; customer display is conditional on policy | UNKNOWN |
| Variants/options | Let customer choose a valid purchasable option only if catalog confirms variants | UNKNOWN whether variants exist |
| Quantity | Let customer choose valid purchase quantity subject to approved inventory rules | Quantity/limits UNKNOWN |
| Package/bundle contents | Explain included contents when verified | Packages observed; content rules UNKNOWN |
| Related products/content | Show approved relevant links if available | Relationship data UNKNOWN |
| SEO | Provide metadata, canonical, structured data, internal links, and image context | Source metadata UNKNOWN |

### Product-detail success and failure states

| State | Customer-facing requirement | Staff/operational implication |
|---|---|---|
| Product available | Customer can choose valid option/quantity and add to cart | Current product/inventory state must be reliable. |
| Product unavailable | Customer is told it cannot currently be purchased; no false add-to-cart confirmation | Inventory/availability state must be actionable by staff. |
| Variant selection incomplete | Explain what selection is needed before add-to-cart | Only applicable if variants are confirmed. |
| Price changed before action | Explain that price changed and refresh the order context; do not charge an unseen price | Requires audit/order pricing approach later. |
| Product no longer exists/legacy URL | Serve direct product or relevant documented redirect/retired-URL guidance | SEO redirect matrix must own the decision. |
| Image/content unavailable | Preserve product identity and offer safe fallback; do not substitute unapproved media | Media remediation queue required. |
| Add-to-cart fails | Preserve selected context where safe, explain retry/support path, and do not claim success | Record operational error without exposing sensitive internals. |

## 5. Cart requirements

### 5.1 Core cart behavior

| Requirement | Priority | Status |
|---|---|---|
| Add an eligible product/selected variant to cart | MUST HAVE | PROPOSED behavior consistent with complete commerce loop |
| View cart contents, line quantity, unit/line price, and order summary | MUST HAVE | CONFIRMED requirement |
| Increase/decrease quantity and remove a line item | MUST HAVE | CONFIRMED requirement |
| Recalculate totals after a valid cart change | MUST HAVE | PROPOSED correctness requirement |
| Recheck product availability/validity before checkout/order creation | MUST HAVE | PROPOSED correctness requirement |
| Preserve cart within an approved customer/session policy | MUST HAVE | PROPOSED; persistence duration/cross-device behavior UNKNOWN |
| Estimate shipping after enough destination/package input exists | MUST HAVE | Provider/rate rule dependency; no estimate before valid data |
| Apply coupon/discount | CLIENT DECISION REQUIRED | Promotion policy unknown |
| Save cart/wishlist across account sessions | OPTIONAL | Account and policy dependent |

### 5.2 Cart calculation principles

- A cart must distinguish **item subtotal**, **eligible discount if approved**, **shipping cost once a valid rate is selected**, and **final amount payable**.
- Tax, handling fee, free-shipping threshold, coupon stacking, minimum order, currency rounding, and price-lock rules are **UNKNOWN**. They must be clarified before implementation; no amount or rule is assumed in this PRD.
- A displayed shipping estimate must identify whether it is an estimate or a selected final shipping option according to the future business/provider behavior.

### 5.3 Cart recovery states

- cart is empty;
- an item/variant is no longer available;
- requested quantity cannot be fulfilled according to approved stock policy;
- product price or promotion changed;
- shipping cannot yet be calculated because destination/package data is incomplete;
- shipping quote failed or expired;
- promotion/coupon is invalid, expired, ineligible, or unavailable (only if promotions are approved);
- temporary cart service failure.

Each state needs a plain-language explanation and a safe next action. The exact policy action (for example, whether a cart line is retained) is not determined here.

## 6. Checkout requirements

### 6.1 Checkout outcome

Checkout must lead to one unambiguous outcome: **order creation with payment initiation/pending instruction**, **verified payment success**, or **a recoverable/error state**. It must never show success solely because a payment method was selected.

### 6.2 Customer information

Checkout must collect only the information required for a valid purchase, delivery, payment, and required customer communication. The exact field list, consent wording, legal basis, customer type, and account/guest policy are **CLIENT DECISION REQUIRED**.

At a conceptual minimum, checkout needs validated information sufficient for:

- purchaser identity/contact where required for the order and notification;
- shipping destination and recipient information where shipment is required;
- selected shipping option;
- selected payment option;
- order summary and acknowledgment of approved applicable policies.

### 6.3 Shipping selection

Checkout must:

1. accept/review destination data;
2. request eligible shipping options from the provider-agnostic shipping capability;
3. display rate-calculation state, eligible method/service, cost, and constraints when available;
4. let the customer choose a valid option;
5. prevent final checkout when shipping is required but no valid shipping selection exists, while offering an approved recovery/support path;
6. revalidate shipping information before order/shipment actions where the future provider requires it.

See `docs/SHIPPING-PRD.md`.

### 6.4 Payment selection

Checkout must:

1. present only client-approved available payment options;
2. communicate when payment is pending, verified, failed, expired, or cancelled;
3. send the customer to a provider-appropriate initiation step only after the order context is valid;
4. return to a safe PENA AMEEN status experience after the payment attempt;
5. rely on verified payment events/status, not customer browser return alone, before treating payment as successful.

See `docs/PAYMENT-PRD.md`.

### 6.5 Validation and error states

| Checkout state | Required response |
|---|---|
| Required/invalid contact or address data | Identify the field/problem in usable language and retain safe entered data. |
| No shipping service available | Explain that the destination/order cannot currently receive a selectable service; allow correction or approved support path. |
| Shipping quote failure/expiry | Explain retry/refresh option and do not silently substitute a rate. |
| Product/quantity unavailable | Explain what changed and return customer to a valid cart state. |
| Price/discount changed | Refresh the summary clearly and require customer review before payment. |
| Payment initiation failure | Do not mark order paid; explain retry/select another approved method/contact support. |
| Customer returns from provider without verification | Show pending/processing rather than false success until verified. |
| Duplicate action / repeat submission | Prevent or safely resolve duplicate order/payment attempts; exact strategy is architecture work. |
| Service interruption | Preserve safe context where possible and give retry/support path without exposing sensitive errors. |

## 7. Order lifecycle

### 7.1 Confirmed versus proposed states

The current source order-state mapping is UNKNOWN. The following is a **PROPOSED conceptual model** for discussion, not a confirmed business rule or provider mapping.

| Domain | Proposed state | Meaning | Customer-visible? | Notes |
|---|---|---|---|---|
| Order | Created / awaiting payment | Valid order context exists but payment is not verified | Yes | Exact reservation/expiry rule UNKNOWN. |
| Payment | Pending | Payment initiation exists and final verification is outstanding | Yes | Do not equate with paid. |
| Payment | Paid / verified | Trusted payment evidence confirms required amount/status | Yes | Provider-specific evidence mapping later. |
| Order | Processing | Staff can prepare paid/approved order for fulfillment | Yes, plain language | Whether COD/manual payment changes this is UNKNOWN. |
| Fulfillment | Ready to ship | Operationally ready for shipment | Conditional | Optional customer-visible granularity. |
| Shipment | Created | Shipment record exists; tracking/AWB may not yet be available | Conditional | Provider behavior unknown. |
| Shipment | Shipped | Shipment handed to carrier/confirmed dispatched under approved workflow | Yes | Trigger definition must be agreed. |
| Shipment | Delivered | Delivery is confirmed by available tracking/operations evidence | Yes | Carrier event confidence needs policy. |
| Order | Cancelled | Order is cancelled under approved policy | Yes | Rules and payment relationship UNKNOWN. |
| Payment / Order | Refunded | Refund is approved/processed/settled according to future policy | Yes | Partial/full status granularity unknown. |

### 7.2 State separation rules — PROPOSED

- Payment state, order state, fulfillment state, shipment state, and tracking state are related but must not be collapsed into one ambiguous label.
- A payment failure does not necessarily mean the order is cancelled; the retention/expiry rule is a client/payment-policy decision.
- A tracking number existing does not by itself prove delivery.
- A refund initiation does not necessarily mean settlement is complete.
- Only authorized staff and verified provider events may progress sensitive states; detailed permissions and event handling are later architecture work.

## 8. Commerce data and migration constraints

Before launch, the commerce experience depends on:

- complete catalog/export, product status, stable IDs/SKUs, prices/sale prices, images, descriptions, categories/tags, variants, package contents, inventory, weight, and dimensions;
- an approved pricing, promotion, tax, availability, and inventory policy;
- payment and shipping provider/business decisions;
- complete source product/category URLs, metadata, and redirects;
- approved legal/checkout policies;
- migration verification of product counts, prices, image links, purchasability, and priority URLs.

See `docs/PRODUCT-MIGRATION-PLAN.md`, `docs/MIGRATION-DATA-MODEL.md`, and `docs/MIGRATION-CHECKLIST.md`.

## 9. Explicit non-requirements / deferred items

- No multi-vendor seller capabilities.
- No provider selection or provider-specific checkout logic.
- No claimed shipping price, delivery time, service level, warehouse coverage, COD policy, or free-shipping policy.
- No loyalty points, subscriptions, recurring billing, gift cards, marketplace credits, or advanced recommendations unless separately approved.
- No assumption that reviews, ratings, coupons, product comparison, wishlist, or back-in-stock notifications are required for MVP.

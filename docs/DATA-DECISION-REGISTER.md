# PENA AMEEN Data Decision Register

**Phase:** 4 — Data Architecture

**Status:** Open data decisions. This register decomposes data-model consequences of existing client decisions and identifies data-specific choices that cannot be silently inferred. It does not replace `docs/CLIENT-DECISION-REGISTER.md` or convert any item into a confirmed rule.

## Critical data decisions

| ID | Decision | Why it matters | Related client decision / unknown | Status |
|---|---|---|---|---|
| DD-001 | Stable source-to-target identifier strategy for products, content, taxonomy, media, branches, customers, orders, payments, and shipments | Required for repeatable imports, deduplication, reconciliation, redirect mapping, and audit provenance | DATA-001; source exports | CRITICAL / UNKNOWN |
| DD-002 | SKU strategy: required sellable subjects, uniqueness, format, lifecycle, replacement/non-reuse policy | Required for inventory, fulfillment, order snapshots, migration, and reconciliation | PROD-003, CDR-002 | CRITICAL / CLIENT DECISION REQUIRED |
| DD-003 | Variant and package strategy: options, components, purchase snapshots, component inventory allocation | Required for product, cart, order, inventory, shipping, and migration model | PROD-005, CDR-012 | CRITICAL / UNKNOWN |
| DD-004 | Inventory location, stock reservation, allocation, release, backorder/preorder/negative-stock policy | Required to prevent overselling and define fulfillment state | INV-001–004, CDR-002/012 | CRITICAL / CLIENT DECISION REQUIRED |
| DD-005 | Guest checkout, customer identity, order lookup, account creation, customer migration data boundary | Defines Cart/Customer/Order/Session/Consent relationships and privacy exposure | CDR-008 | CRITICAL / CLIENT DECISION REQUIRED |
| DD-006 | Historical order, item, address, payment, shipment, refund, tracking, and note migration scope | Required for financial accuracy, support, customer history, and target retention | ORD-001–003, CDR-009 | CRITICAL / CLIENT DECISION REQUIRED |
| DD-007 | Payment data mapping: provider reference, attempt/event evidence, amount/currency, refund/settlement/reconciliation model | Required for provider-neutral Payment model and finance reconciliation | PAY-001–004, CDR-003 | CRITICAL / UNKNOWN |
| DD-008 | Shipping data mapping: origin, destination, package, rate/service, AWB/label/tracking, exception/return model | Required for ShippingRate/Shipment/Tracking data integrity | SHIP-001–005, CDR-004 | CRITICAL / UNKNOWN |
| DD-009 | Monetary snapshot model: currency, tax, discount, shipping allocation, fee, rounding, promotion representation | Required for Cart/OrderItem/Payment/Refund reconciliation | CDR-013; tax/promotion unknowns | CRITICAL / CLIENT DECISION REQUIRED |
| DD-010 | Privacy, retention, deletion/export, consent, audit, backup, and legal-hold data policy | Required for Customer, Order, Payment, Audit, Media, Analytics, Notification lifecycle | LEG-001–003, DATA-003, CDR-005 | CRITICAL / CLIENT DECISION REQUIRED |

## High-priority data decisions

| ID | Decision | Why it matters | Related client decision / unknown | Status |
|---|---|---|---|---|
| DD-011 | Product/category/tag taxonomy ownership, association rules, archive/merge retention | Prevents duplicate taxonomy and unsafe source URL changes | CDR-011/022/027 | HIGH / CLIENT DECISION REQUIRED |
| DD-012 | Media ownership, rights, consent, usage, alt/caption, private/public asset policy | Required for MediaAsset/Usage and lawful/public migration | MEDIA-001–003, CDR-016 | HIGH / CLIENT DECISION REQUIRED |
| DD-013 | Content author, article/category/tag, EducationHub/resource/relation ownership and publication workflow | Required to model editorial/education relationships safely | CONT-001–004, CDR-007/027 | HIGH / UNKNOWN |
| DD-014 | Branch data, contact/location, active status, branch inventory relationship | Required for Branch/Location/public local SEO and prevents false fulfillment claims | BR-001–003, CDR-014 | HIGH / UNKNOWN |
| DD-015 | Return, replacement, delivery-exception, inspection, restock, refund relationship | Required for ReturnRequest/InventoryMovement/Refund state | SHIP-005, CDR-024 | HIGH / CLIENT DECISION REQUIRED |
| DD-016 | Notification consent, preference, template, channel/delivery history retention | Required for CustomerConsent/Preference/Notification model | CDR-017 | HIGH / CLIENT DECISION REQUIRED |
| DD-017 | Analytics identity, query/revenue retention, conversion attribution, consent | Required for AnalyticsEvent/ConversionEvent privacy and integrity | CDR-018 | HIGH / CLIENT DECISION REQUIRED |
| DD-018 | Staff identity, role, permission, capability assignment, approval and audit model | Required for StaffUser/Role/Permission/Audit data | ADMIN-001–003, CDR-010 | HIGH / CLIENT DECISION REQUIRED |
| DD-019 | SEO metadata/canonical/redirect/sitemap ownership, provenance, validation retention | Required for SEO entities and migration safety | SEO-001–006, CDR-006 | HIGH / UNKNOWN |
| DD-020 | Source import contract availability, encoding, relationship keys, duplicate/reconciliation approval | Required for repeatable safe migration | DATA-004; client exports | HIGH / UNKNOWN |
| DD-021 | Platform backup, restore, object-media, job/audit/idempotency retention model | Required for data recovery and system-record lifecycle | CDR-028 | HIGH / CLIENT DECISION REQUIRED |

## Medium-priority data decisions

| ID | Decision | Why it matters | Related client decision / unknown | Status |
|---|---|---|---|---|
| DD-022 | Editorial collections and temporary merchandising grouping | Determines whether Collection/membership data is needed | No current collection evidence | MEDIUM / DEFERRED |
| DD-023 | Search synonym, typo, query redirect, ranking configuration retention | Determines SearchSynonym/SearchRedirect scope | CDR-019 | MEDIUM / CLIENT DECISION REQUIRED |
| DD-024 | Customer-visible/internal OrderNote types and support-note retention | Protects privacy and support workflow | Support SOP unknown | MEDIUM / UNKNOWN |
| DD-025 | Event/gallery/testimonial data model scope and archive rights | Determines optional content entities/publication state | CDR-015/016 | MEDIUM / CLIENT DECISION REQUIRED |
| DD-026 | Provider payload/raw event storage and redaction policy | Affects PaymentEvent/TrackingEvent audit/reconciliation privacy | Provider/security policy unknown | MEDIUM / UNKNOWN |

## Low-priority data decisions

| ID | Decision | Why it matters | Related client decision / unknown | Status |
|---|---|---|---|---|
| DD-027 | Optional product documents/downloads and private access policy | Determines whether ProductDocument scope is activated | No current source evidence | LOW / DEFERRED |
| DD-028 | Optional system setting/configuration history presentation | Determines admin presentation, not core data integrity | Platform/admin workflow unknown | LOW / DEFERRED |

## Summary

| Priority | Count |
|---|---:|
| Critical | 10 |
| High | 11 |
| Medium | 5 |
| Low | 2 |
| **Total data decisions** | **28** |

No decision in this register is resolved merely because a logical entity exists. Existing client decisions must be updated or approved through the project control process before dependent implementation proceeds.

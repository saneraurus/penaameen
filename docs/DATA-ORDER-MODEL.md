# PENA AMEEN Order Data Model

**Phase:** 4 — Data Architecture

**Status:** PROPOSED logical order model. It preserves historical purchase truth without hard-coding tax, discount, provider, fulfillment, cancellation, return, or refund policy.

## 1. Historical truth principle

An Order must remain historically accurate even when a Product, SKU, description, price, image, category, customer address, shipping method, or tax/promotion rule changes later.

Therefore Order and OrderItem store approved historical snapshots in addition to optional references to current entities.

## 2. Core entities

| Entity | Purpose | Required logical data | Optional/conditional data | Immutable historical data |
|---|---|---|---|---|
| Order | Purchase aggregate and workflow context | Internal/reference ID, creation time, currency, customer/guest context, order state, total summary snapshot | Source order ID, sales channel, approved notes, cancellation/return links | Reference, creation, currency, financial/status history evidence |
| OrderItem | Purchase-time line item snapshot | Order, product name, SKU/variant/package snapshot if available, quantity, unit price, subtotal | Product/variant current reference, options, discount, tax, shipping allocation, media display snapshot | Name, selected SKU/options/package, quantity, unit price, line subtotal at purchase |
| OrderAddress | Delivery/billing recipient snapshot | Order, address role, recipient/destination fields approved for shipping/order | Source CustomerAddress reference, contact preference | Snapshot fields at order time; changes are corrections/versioned, not overwrite |
| OrderStatusHistory | Append-only order state transition evidence | Order, prior/new state, actor/source, timestamp, correlation | Reason, provider/payment/shipment evidence reference | Core transition history |
| OrderNote | Authorized operational/customer-support note | Order, note type, actor, timestamp, visibility classification | Reason, safe detail, correction/version reference | Original author/time/version history |

## 3. Required OrderItem snapshot fields

The following are conceptual requirements for a valid historical line snapshot:

| Field | Purpose | Status |
|---|---|---|
| Product name | Preserve what customer purchased even if catalog name changes | PROPOSED requirement |
| SKU | Preserve sellable identity where a SKU exists | PROPOSED; source SKU UNKNOWN |
| Selected variant/package | Preserve chosen option/composition where applicable | PROPOSED; variants/packages UNKNOWN |
| Quantity | Preserve committed purchased quantity | PROPOSED requirement |
| Unit price | Preserve commercial unit price at order time | PROPOSED; pricing policy unknown |
| Discount | Preserve applied discount amount/rule reference if applicable | UNKNOWN / promotion policy required |
| Subtotal | Preserve line result before/after approved commercial components as defined | PROPOSED; exact formula/tax policy unknown |
| Tax | Preserve tax amount/rule snapshot if applicable | UNKNOWN; no tax rule assumed |
| Shipping allocation | Preserve line-level shipping allocation only if the business requires it | UNKNOWN; shipment/tax policy required |
| Currency | Preserve monetary context | PROPOSED; source currency/handling needs finance confirmation |
| Product/variant current reference | Support later support/analytics traceability | Optional; must not replace snapshot truth |

## 4. Order aggregate data

| Data group | Logical role | Unknown policy boundary |
|---|---|---|
| Customer/guest reference | Associate authorized buyer/guest context | Guest checkout/account/migration policy |
| Order addresses | Preserve recipient/delivery/billing context | Required address roles/fields/privacy/retention |
| Monetary summary | Store approved item, discount, shipping, tax, total snapshots | Tax, discount, rounding, fee, currency rules |
| Payment context | Link one or more payment records/attempts | Provider/method/settlement/refund policy |
| Shipping context | Link quote/selected service/shipment/tracking | Provider/origin/package/rate rules |
| Workflow state | Present order lifecycle/history | Final state names/transitions/actor authority |
| Notes/support | Record approved internal/customer-visible context | Visibility/retention/legal policy |
| Migration provenance | Record source order/reference/status/map result | Historical order migration decision |

## 5. Relationship and snapshot rules

```text
Order
├── 1:N OrderItem             → immutable purchase snapshots
├── 1:N OrderAddress          → role-specific address snapshots
├── 1:N OrderStatusHistory    → append-only lifecycle evidence
├── 1:N OrderNote             → authorized operational/support notes
├── 1:N Payment               → provider-neutral financial records
├── 1:N Shipment              → fulfillment/tracking records
├── 0:N Notification          → transactional communication history
└── 0:N AuditLog              → sensitive action record
```

- `OrderItem → Product/Variant` current references are optional and never authoritative for historical display/financial reconciliation.
- `OrderAddress → CustomerAddress` source reference is optional and never overwrites the order snapshot.
- A source historical order can map to a target status only through documented mapping; source status is not assumed equivalent.

## 6. Lifecycle and correction rules

- Order workflow follows `docs/ORDER-ARCHITECTURE.md`; lifecycle names remain proposed until policy/provider/SOP approval.
- Financial/order snapshots are append-only or versioned. Corrections use an audit-safe adjustment, note, status history, refund, or approved reconciliation record rather than direct silent mutation.
- Cancellation/refund/return/shipment events do not delete the original order/item snapshot.
- Archived product/category/content data may disappear from public catalog but must preserve optional relation/history for referenced OrderItem.

## 7. Migration requirements

Historical order migration is `CLIENT DECISION REQUIRED`. If approved, required source fields include source order ID/number, status, timestamps, customer/billing/shipping data, currency/totals, line items, product/SKU/variant snapshot, discount/tax/shipping amounts if present, payment transaction reference/status, tracking/shipment data, refunds, notes, and source provenance.

Validation must reconcile count, identifiers, line totals, order totals, statuses, customer linkage, product mapping, payment/shipment references, and documented exclusions. If historical migration is not approved, source records must still be preserved according to finance/legal/support requirements outside the target customer order-history model.

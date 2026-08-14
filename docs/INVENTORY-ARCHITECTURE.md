# PENA AMEEN Inventory Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED inventory-consistency blueprint. Existing SKUs, stock quantities, backorder policy, warehouse/origin, package rules, and multi-location needs are unknown. No stock model, database schema, or operational rule is implemented.

## 1. Inventory principles

- Inventory is authoritative operational data, not a page-cache value.
- Product availability shown publicly is derived from validated inventory/product policy.
- Inventory changes are append-audited through adjustments/reservations/allocations, not overwritten without trace.
- A checkout/cart view does not guarantee inventory until the approved authoritative reservation/order transition occurs.
- One location must be sufficient for MVP, but the model must accommodate additional locations without redesign.
- Overselling prevention is a transaction/concurrency requirement, not a frontend feature.

## 2. Stock model

| Measure | Meaning | Status |
|---|---|---|
| On-hand stock | Physical/approved sellable units recorded at a logical location | PROPOSED; source quantity unknown |
| Reserved stock | Units temporarily committed to a valid order/payment/fulfillment context under approved policy | PROPOSED; reservation policy unknown |
| Available stock | On-hand minus active approved reservations, subject to product/backorder policy | PROPOSED |
| Allocated stock | Units assigned to a fulfillment/shipment/order item | PROPOSED |
| Damaged/quarantined stock | Units not sellable pending approved operations handling | DEFERRED; no SOP evidence |
| Backorder capacity | Units allowed to sell without available stock | UNKNOWN; do not assume |

Conceptual availability formula:

```text
available = approved_on_hand - active_reservations - allocated_not_finalized
```

The actual calculation must be finalized with warehouse, backorder, bundle, variant, and return rules.

## 3. Logical inventory location model

```text
InventoryLocation
├── default active location             [initial MVP candidate]
├── future additional active location   [only if operations confirms]
└── inactive/archived location

Inventory record
├── product or variant
├── inventory location
├── on-hand/reserved/allocated quantities
└── adjustment/reservation audit trail
```

This does **not** assume multiple warehouses. It prevents a later multi-origin/branch/warehouse decision from forcing a complete redesign. Branches are not inventory locations unless PENA AMEEN explicitly confirms that operational model.

## 4. Inventory lifecycle

| Event | Required architecture behavior | Actor/source | Audit requirement |
|---|---|---|---|
| Catalog product becomes active | Determine whether inventory tracking applies under approved product policy | Catalog/operations | Product/inventory policy version |
| Cart update | Check current availability for requested quantity; do not promise reservation by default | Cart service | Safe conflict/result context |
| Valid checkout/order creation | Create reservation only if approved reservation policy requires it | Checkout/Inventory service | Reservation reason/order/correlation |
| Payment failure/expiry/cancellation | Release active reservation where policy requires it | Payment/Order/Inventory service | Release reason/state source |
| Payment verified/fulfillment allocation | Convert/rescope reservation into fulfillment allocation as approved | Order/Fulfillment service | Transition and quantities |
| Shipment/dispatch | Record allocation/fulfillment consumption per policy | Fulfillment/Shipping service | Shipment/order reference |
| Return received | Restock only after approved inspection/condition policy | Operations staff | Return condition/reason/adjustment |
| Manual adjustment | Require capability, reason, before/after quantities | Authorized staff | Immutable adjustment record |
| Reconciliation | Compare physical/approved source count to system count | Operations staff/system | Reconciliation outcome/sign-off |

## 5. Overselling prevention

### Required technical controls

- Perform authoritative availability check and reservation/commit within a database transaction.
- Use concurrency control appropriate to the final data model: conditional quantity update, row lock, optimistic version, or a tested equivalent.
- Reject or safely reduce a request when sufficient available quantity cannot be committed.
- Ensure checkout retries/double submits use idempotency so the same order does not reserve stock twice.
- Ensure payment and shipping webhooks cannot independently consume inventory twice.
- Present a truthful cart/checkout recovery state when availability changes.
- Reconcile worker retries through idempotent reservation/allocation keys.

### What is not decided

- Reservation at add-to-cart versus checkout versus payment initiation.
- Reservation expiry duration.
- Backorders, partial fulfillment, split shipments, preorder, substitutions, oversell threshold, low-stock thresholds, and safety stock.
- Whether package/bundle components reserve independent underlying stock.

These require client operations and catalog data.

## 6. Fulfillment allocation

Fulfillment allocation belongs after an order reaches an approved eligible state. It links order item quantity to a logical inventory location and future shipment item. The architecture supports one order being allocated over one or more shipments only if business data/SOP later requires it; MVP should not assume partial fulfillment complexity.

## 7. Cancellations and returns

| Situation | Proposed inventory response | Dependency |
|---|---|---|
| Cart abandoned | No release unless an approved cart reservation exists | Reservation policy |
| Payment failed/expired | Release eligible reservation | Payment/expiry policy |
| Order cancelled before dispatch | Release reservation/allocation under approved policy | Cancellation/SOP |
| Shipment cancelled before handoff | Reverse approved allocation if stock remains in custody | Shipping/provider/SOP |
| Delivery return requested | Do not restock automatically | Return policy/inspection workflow |
| Returned goods received | Restock only after approved condition inspection | Operations policy |
| Refund without return | No automatic stock action | Refund/return policy |

## 8. Inventory audit and observability

Required observable signals include:

- negative/invalid availability prevention events;
- reservation conflicts/expiry/release failures;
- product/variant missing SKU or inventory configuration;
- stock adjustment volume/reasons;
- allocation/shipment mismatch;
- prolonged pending reservations;
- reconciliation discrepancies;
- low-stock signals only after thresholds are approved.

Staff must be able to trace an inventory quantity to approved adjustments, reservations, allocations, order/shipment references, actor, and time. Exact reports and alert thresholds are not specified.

## 9. Migration and data gates

Inventory architecture remains `PARTIAL` until PENA AMEEN provides:

- SKU/product identity and active/discontinued catalog;
- stock quantities/status/tracking/backorder rules;
- product variants/packages/components;
- warehouse/origin/storage locations;
- fulfillment and return SOP;
- historical order/migration decisions;
- reconciliation owner and launch cutover process.

No inventory migration or default stock quantity is assumed.

# PENA AMEEN Inventory Data Model

**Phase:** 4 — Data Architecture

**Status:** PROPOSED logical inventory model. No quantities, warehouses, SKU values, stock rules, backorder policies, or physical data structure is assumed.

## 1. Model objective

Inventory data must make a customer-facing availability decision and a staff fulfillment decision traceable without allowing carts, payment webhooks, or manual UI edits to create untracked stock changes.

## 2. Core logical entities

| Entity | Purpose | Core logical fields | Ownership | Key uncertainty |
|---|---|---|---|---|
| SKU | Stable identifier for one sellable Product or ProductVariant | SKU value, subject reference, status, source ID | Catalog/Inventory | Source SKU values and format unknown |
| InventoryItem | Stock position for one SKU at one logical location | SKU, location, on-hand, tracking state, lifecycle | Inventory | Source quantities/status unknown |
| InventoryLocation | Logical location capable of holding stock | Code/name/status/location role | Inventory | Single/multiple warehouse/origin/branch model unknown |
| InventoryMovement | Append-only quantity change | Item, quantity delta, movement type, reason, actor/source, time | Inventory | Movement reason taxonomy and historical export unknown |
| StockReservation | Time-bounded approved stock hold | Item, quantity, cart/order scope, state, policy/expiry reference | Inventory/Order | When reservation begins/expires unknown |
| Fulfillment allocation | Logical link from OrderItem/ShipmentItem to InventoryItem | Item, allocated quantity, source order/shipment, state | Inventory/Fulfillment | Partial/multi-location shipment behavior unknown |

## 3. Quantity model

### Proposed conceptual measures

```text
on-hand stock      = approved physical/system quantity
reserved stock     = active approved holds not yet released or committed
allocated stock    = quantity assigned to fulfillment but not finalized
available stock    = on-hand stock - reserved stock - allocated stock not finalized
```

This is a **PROPOSED** formula. It cannot be treated as an approved business rule until PENA AMEEN confirms stock, reservation, fulfillment, cancellation, return, and backorder policy.

### Quantity integrity rules

- Quantity changes are expressed through InventoryMovement or controlled reservation/allocation transitions.
- A derived available quantity is not manually edited as the source of truth.
- Negative inventory is not allowed by default in the architecture; whether backorder/preorder/negative stock is permitted is `UNKNOWN` and requires a client decision.
- A cart display is advisory until authoritative availability is checked during an approved cart/order transition.
- Inventory counters must reconcile to movement/reservation/allocation history.

## 4. Inventory lifecycle

| Event | Data changes | Required audit/idempotency |
|---|---|---|
| Initial migration/reconciliation | Create validated starting InventoryItem position and source reconciliation record | Source file/version/owner/sign-off |
| Catalog activation | Link SKU/sellable subject to tracking policy | Catalog/inventory configuration audit |
| Add/update cart | Read availability; create no reservation unless policy permits | Cart request/correlation; no double hold |
| Checkout/order creation | Optionally create StockReservation | Idempotency key, cart/order reference, expiry policy |
| Payment success/fulfillment eligibility | Commit/reallocate reservation | Payment/order source and state transition audit |
| Shipment allocation/dispatch | Record allocation/consumption per approved workflow | Shipment/order item link; no duplicate allocation |
| Payment failure/expiry/cancellation | Release approved reservation/allocation | Reason/state source/idempotency |
| Return received/inspection | Create approved restock or adjustment movement | Return condition/reason/staff audit |
| Manual correction | Create InventoryMovement, not overwrite history | Capability, reason, before/after/reconciliation evidence |

## 5. Single warehouse and future locations

### Current architecture

Use a logical `InventoryLocation` even if launch has only one approved location. A single active default location is a future configuration/data decision, not a value created in this phase.

### Investigated but unresolved models

| Model | Status | Architectural handling |
|---|---|---|
| Single warehouse | UNKNOWN | Supported by one active location record when supplied |
| Multiple warehouses | UNKNOWN | Supported by 1:N InventoryItem-to-Location relation without changing SKU/order identity |
| Branch inventory | UNKNOWN | No default Branch-to-InventoryLocation link; requires explicit operations decision |
| Dropship | UNKNOWN / out of scope by default | No supplier fulfillment model introduced |
| Preorder | UNKNOWN | Requires explicit availability/reservation/date policy |
| Backorder | UNKNOWN | Requires explicit negative/available/reservation policy |
| Stock synchronization | UNKNOWN | External synchronization adapter only after source/provider/SOP is confirmed |

## 6. Overselling prevention architecture

- Authoritative availability check, reservation/commit, and related order state occur in one transaction boundary or equivalent tested concurrency control.
- Use a conditional update, lock, version check, or approved equivalent in later physical design; no specific SQL mechanism is chosen here.
- Checkout/order command idempotency prevents duplicate stock holds on retry.
- Payment/shipping event replay cannot commit/release stock twice.
- An insufficient-stock result returns a cart/checkout recovery state; it does not silently reduce quantity or accept an unfulfillable order.
- Reconciliation detects count mismatch, stale reservation, duplicated movement, and allocation inconsistency.

## 7. Data migration and validation

Required source inputs include source product ID/SKU, stock quantity/status, tracking/backorder policy, warehouse/location, bundle/package composition, product weight/dimensions, active/discontinued status, and reconciliation owner.

Validation blockers include duplicate/missing SKU, invalid/negative quantity, unknown product mapping, missing location, orphan reservation, movement sum mismatch, allocation exceeding available inventory, expired reservation not released, and source/target count mismatch.

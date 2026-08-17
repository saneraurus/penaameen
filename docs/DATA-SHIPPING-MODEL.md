# PENA AMEEN Shipping Data Model

**Phase:** 4 — Data Architecture

**Status:** Provider-neutral logical model. Shipping provider, couriers, origin, destination validation, package rules, rate rules, AWB/label/tracking/return behavior, and operations SOP remain `UNKNOWN` or `CLIENT DECISION REQUIRED`.

## 1. Flow supported

```text
OrderAddress
→ ShippingRate quote(s)
→ selected shipping method
→ Shipment creation
→ AWB / resi
→ ShippingLabel
→ dispatch
→ TrackingEvent history
→ delivery or DeliveryException
→ ReturnRequest if approved
```

## 2. Core entities

| Entity | Purpose | Required logical fields | Optional/conditional fields | Immutable/audit rules | Source/migration uncertainty |
|---|---|---|---|---|---|
| ShippingRate | Quote/eligible service option for a checkout/order context | Internal quote ID, cart/order context, destination snapshot, package context, service, amount/currency, state, quote time | Provider ref, courier, ETA, expiry, fees/insurance, selection flag | Quote evidence/time/amount immutable; selection/expiry audited | Provider/rate/origin/package/fee/expiry rules UNKNOWN |
| Shipment | Provider-neutral fulfillment aggregate | Internal shipment ID, Order, destination snapshot reference, state, selected service context, creation time | Provider reference, courier, AWB/resi, dispatch/delivery times, origin reference | Creation/reference/state event history audited/idempotent | Provider/history/partial shipment migration UNKNOWN |
| ShipmentItem | Allocates an OrderItem quantity to Shipment | Shipment, OrderItem, quantity, allocation state | Package/component/inventory location context | Allocation immutable after dispatch except audited correction | Partial/multi-shipment rules UNKNOWN |
| TrackingEvent | Normalized carrier/operations tracking observation | Shipment, source event/reference, normalized status, event time, received time | Carrier text/location/details, confidence, provider metadata | Source evidence immutable; normalization/notification effects audited | Provider event contract/polling/proof of delivery UNKNOWN |
| ShippingLabel | Secure label artifact/reference metadata | Shipment, label status, generated time, access classification | Provider label ref, media/storage ref, print/retrieve time/actor | Generation/print/audit evidence immutable | Provider support/format/retention/print policy UNKNOWN |
| DeliveryException | Structured delivery/shipping issue | Shipment, exception type/state, source, opened time | Reason, resolution, customer-safe message, owner | Opening/resolution history audited | Exception taxonomy/SOP/manual workflow UNKNOWN |
| ReturnRequest | Policy-gated request for return/replacement | Order, requester/source, state, time | Shipment/OrderItem links, reason/evidence, label/refund/inspection context | Request/evidence/state history audited | Return/replacement/eligibility/restock/refund policy UNKNOWN |

## 3. Address and package snapshot rules

- Shipment and ShippingRate use an OrderAddress/destination snapshot, not a mutable current CustomerAddress as authority.
- Package context must record approved item/weight/dimensions/composition source/version where available.
- Product weight/dimension/package/bundle data is currently unknown; no default package or origin is created.
- Origin is a shipping configuration/domain input, not a hardcoded product or branch value. Multiple origins are supported conceptually only after operations approval.

## 4. Rate data lifecycle

| State | Meaning | Data action |
|---|---|---|
| `not_requested` | Destination/package context incomplete | No quote record or explicit incomplete state |
| `validating` | Data/coverage validation in progress | Record safe request/correlation context if needed |
| `quoted` / `available` | Eligible options returned | Persist immutable quote option evidence/expiry |
| `selected` | Customer/staff selected valid option | Link selected rate to checkout/order/shipment context |
| `no_service` | No eligible option | Record outcome/recovery; do not invent rate |
| `failed` | Provider/transport/data failure | Record error category/retry/manual-review context |
| `expired` | Quote no longer valid | Preserve historical evidence; require refresh/reselection |

State names are proposed. Provider-specific rate codes remain adapter data.

## 5. Shipment and tracking lifecycle

| State | Data meaning | Guardrail |
|---|---|---|
| `created` | Shipment aggregate/provider identity exists | Not equivalent to dispatch |
| `awb_assigned` | Valid AWB/resi stored | Not equivalent to label/dispatched/delivered |
| `label_ready` | Approved secure label available | Print/retrieve action is separately auditable |
| `dispatched` | Carrier handoff/approved dispatch evidence | Can influence Order shipped summary |
| `in_transit` | Trusted tracking movement event | Normalize provider code/history |
| `delivered` | Trusted delivery evidence | Delivery proof policy unknown |
| `cancelled` | Authorized shipment cancellation | Reconcile order/inventory/payment state |
| `exception` | Delivery issue needs action | No false customer delivery claim |
| `returned` | Return outcome confirmed | Link to return/restock/refund policy |

## 6. Data integrity and idempotency

- Shipment creation stores an idempotency key and internal shipment intent before a provider call.
- A provider response/AWB/label/tracking event must be linked to one valid shipment/order context after validation.
- Duplicate/out-of-order tracking events preserve source history but do not repeatedly advance state/notify customer.
- Rate quote/selected service is snapshot data; stale/expired quote cannot silently drive final shipment cost.
- A label/document is private operational data by default and needs access/retention policy.
- Manual AWB/label entry, if later approved, requires source/evidence/actor/reason/audit fields.

## 7. Migration and validation

Historical shipment/tracking migration is conditional on client decision and source export. Validation requires order linkage, destination snapshot, service/cost/currency, provider/courier reference, AWB/resi, label availability, tracking event order, cancellation/return states, and documented exclusions. No provider-specific fields are assumed before a provider is selected.

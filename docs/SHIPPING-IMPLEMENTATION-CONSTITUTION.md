# PENA AMEEN Shipping Implementation Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory provider-neutral rules. Shipping provider, couriers, origin, packages, rates, AWB, labels, tracking, cancellation, return, and operational SOP remain unknown/client-gated.

## 1. Required boundary

```text
Application service → Shipping Port → Provider Adapter → approved provider/aggregator
```

Core Order/Shipment/Inventory code must not import provider SDK models, courier codes, credentials, rate rules, or labels directly.

## 2. Mandatory rules

- Validate approved destination/order/package context before quote request; no invented origin/weight/dimension/default package.
- Persist quote/selection context with state/expiry evidence; stale quote cannot silently drive shipment cost.
- Create idempotent shipment intent before provider call; uncertain retry reconciles existing provider/internal reference first.
- Normalize provider response into ShippingRate/Shipment/AWB/Label/TrackingEvent data model.
- AWB assignment does not equal label readiness, dispatch, in transit, or delivery.
- Dispatch/delivery state requires approved evidence mapping; tracking events are append-only/normalized/deduplicated.
- Label artifacts are private operational media with access/audit controls.
- Cancellation/return/exception/retry/manual fallback follows approved order/inventory/payment/SOP policy.
- Provider timeout/outage/no-rate/creation/AWB/label/tracking failure creates truthful customer/admin recovery state and observability.

## 3. Prohibited behavior

- Courier/service/origin/rate/delivery-time/free-shipping/insurance assumption.
- Direct provider call from UI/order repository/worker without shipping service/port.
- Duplicate shipment/AWB/label creation on retry.
- Manual tracking/AWB/dispatch edit without authority/evidence/audit.
- Treating branch as inventory/origin without explicit operations decision.

## 4. Implementation gate

No adapter code starts until provider/courier/origin/package/rate/AWB/label/tracking/cancellation/return support, sandbox, fulfillment SOP, manual fallback, legal policy, and staff authority are approved.

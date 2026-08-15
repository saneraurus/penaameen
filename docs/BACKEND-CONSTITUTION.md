# PENA AMEEN Backend Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory future backend rules. No services, repositories, jobs, API endpoints, worker, database, or integrations are implemented.

## 1. Service model

- Delivery adapters translate HTTP, webhook, job, or Server Action input into validated application-service commands.
- Application services own use-case orchestration, authorization, transaction scope, idempotency, audit, and outbox creation.
- Domain policies own state/invariant decisions and port/event contracts.
- Repositories own persistence/query mapping only.
- Provider adapters own approved external protocol translation only.

## 2. Transaction rules

| Rule | Constitution |
|---|---|
| Atomicity | Commit authoritative state, audit, and required outbox intent together where supported |
| External calls | Never hold a long database transaction during payment/shipping/notification/search/storage call |
| Snapshots | Create historical order/payment/shipment/inventory evidence before later mutable data can change |
| Idempotency | Required for checkout/order, payment/refund, shipment, inventory reservation, notification, webhook/job paths |
| Authorization | Checked in application service, not only route/middleware |
| Retry | Only transient/idempotent operations retry; policy/validation/security failures do not blind-retry |
| Audit | Sensitive command records actor, target, result, reason/evidence, correlation |

## 3. Validation order

```text
transport shape
→ identity/session
→ authorization/ownership
→ syntax and value validation
→ domain invariant/state validation
→ concurrency/idempotency
→ transaction/outbox
→ external adapter where required
→ safe response and observability
```

## 4. Jobs and outbox

- A committed domain event creates durable outbox/job intent where follow-up is required.
- Worker paths call the same application services and honor authorization/state/idempotency rules.
- Jobs have explicit state, attempts, correlation, retry category, manual-review/dead-letter behavior, and observability.
- A failed notification/search/index/media/provider job never falsifies authoritative commerce state.

## 5. Logging and error boundaries

- Log structured safe context, correlation ID, module, operation, outcome category, and non-sensitive resource reference.
- Translate raw infrastructure/provider errors to typed application errors before delivery/UI.
- Quarantine unmatched/invalid provider events; do not force state transitions.
- No generic catch-all may swallow errors, return false success, or leak secret/PII/provider payload.

## 6. Forbidden backend behavior

- Provider models/statuses leaking into Order/Payment/Shipment core domain.
- Repository methods with unbounded UI/business policy or authorization bypass.
- Direct data mutation from webhook/job without service/state-machine path.
- In-memory-only job/idempotency/audit state for durable commerce behavior.
- Hardcoded provider URLs/credentials, customer data, prices, tax, inventory, role, route, or legal policy.

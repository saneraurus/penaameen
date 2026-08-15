# PENA AMEEN Error and Recovery Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory failure/recovery rules aligned to Phase 3 Error Recovery Architecture.

## 1. Standard error classes

| Class | Rule |
|---|---|
| Validation | Return safe field/task correction, preserve safe input, no retry loop |
| Authentication | Request sign-in/recovery without account enumeration/private leak |
| Authorization | Deny safely; do not disclose protected resource/capability unnecessarily |
| Not found | Public 404 or private safe absence; never unrelated redirect/home fallback |
| Conflict | Return authoritative current/review state for inventory/version/idempotency conflict |
| Provider temporary | Preserve pending/retry/support state; bounded retry through worker where safe |
| Provider permanent/invalid | Quarantine/manual review; do not blind retry or false success |
| Database/runtime | Roll back atomic state, log correlation, show safe error/retry/support |
| Worker/job | Persist attempt/error category, retry only safe work, dead-letter/manual review after exhaustion |

## 2. Recovery rules

- Preserve safe cart/form/order/session context where possible; revalidate before retry.
- Use idempotency for commands with money, stock, shipment, notification, or access effects.
- Payment timeout, shipping failure, duplicate webhook, AWB failure, tracking failure, email failure, inventory race, provider outage, and migration failure follow documented service/job/manual-review path.
- Customer messaging names truthful state and next action; staff messaging includes authorized correlation/exception context.
- Manual recovery requires actor, target, reason/evidence, prior/new state, audit, and no policy bypass.

## 3. Dead-letter/quarantine

Unmatched/invalid/conflicting provider events, irrecoverable jobs, invalid import records, unsafe media, and unresolved migration rows enter quarantine/manual review. They remain observable and do not silently mutate authoritative state.

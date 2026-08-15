# PENA AMEEN Testing Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory test governance. No tests or test tooling are implemented in this phase.

## 1. Test layers

| Layer | Responsibility | Must validate |
|---|---|---|
| Unit | Pure domain/value/policy behavior | State transitions, money/quantity handling, validation, normalization, invariants |
| Integration | Service/repository/transaction/worker collaboration | Transaction boundaries, snapshots, idempotency, concurrency, outbox/audit effects |
| Contract | API/port/adapter boundary compatibility | Request/response/error contracts, provider normalization, webhook payload validation after approval |
| Component | Semantic UI component behavior | Inputs/states/accessibility behavior, not internal CSS implementation alone |
| E2E | User/staff route task journey | Discovery, cart, checkout, account, tracking, admin authorized paths and recovery |
| Security | Threat/control behavior | Authz/ownership, CSRF, XSS, SSRF, redirect, upload, webhook replay, secret/redaction |
| Accessibility | Actual assistive/keyboard/focus/form/table/dialog/media behavior | Requirements from Accessibility Constitution |
| Performance | Route/query/job/media/provider behavior against approved targets | Regression/budget behavior, not synthetic vanity score only |
| Migration | Source-to-target transformation/reconciliation/redirect/media/data integrity | Import staging, duplicate/quarantine/rollback/reconciliation |
| Regression | Fixed bug and critical workflow preservation | Reproduce prior failure and assert protected behavior |

## 2. Test standards

- Name tests by behavior, condition, and expected outcome.
- Prefer deterministic fixtures/factories with synthetic/approved anonymized data.
- Isolate tests; no hidden order dependence, real production data, credentials, provider mutation, global mutable state, or clock/network uncertainty without control.
- Mock at external port boundary, not inside domain behavior; provider sandbox tests occur only after provider approval.
- Test failures/retries/duplicate events/concurrency/authorization/empty/error states, not happy paths only.
- Test public SEO/redirect/indexability and private access boundaries separately.
- Tests must not merely assert private implementation structure or snapshots without user/domain behavior.

## 3. Required evidence by risk

Money, inventory, payment, shipment, webhook, authorization, PII, migration, SEO route, media-rights, and destructive admin changes require stronger integration/contract/security/regression coverage. A test pass does not waive review, audit, provider, legal, or migration gates.

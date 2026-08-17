# PENA AMEEN API Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory future API governance. No endpoint or API implementation is created.

## 1. Naming and versioning

- Application APIs use the approved versioned family convention, currently proposed as `/api/v1/...`.
- Resource/action paths use stable domain vocabulary, lowercase segments, and no provider-specific terms outside webhook adapter routes.
- Webhook routes are isolated under an approved provider adapter boundary and are not customer/staff API routes.
- Breaking contract changes require a new version or documented compatibility plan.

## 2. HTTP and response semantics

| Concern | Constitution |
|---|---|
| Read | Use safe resource/list semantics with authorization/publication checks |
| Command | Use clear create/update/action semantics that map to application service intent |
| Success | Return authoritative result/state, safe metadata, request/correlation ID |
| Validation | Return stable safe code/message/field context; no raw internals |
| Auth | Distinguish unauthenticated from unauthorized without leaking sensitive resource existence |
| Conflict | Return current/reviewable state for inventory/version/idempotency conflict |
| Provider failure | Return pending/retry/support-safe category, not false completion |

Proposed JSON envelopes from Phase 3 remain the contract direction; final serialization tooling is deferred.

## 3. Request validation

- Validate method, content type, size, shape, field types, bounded values, pagination/filter/sort allowlists, and route parameters before application service call.
- Validate session/ownership/capability before returning private/privileged data.
- Treat every external/browser request as untrusted; use `unknown` until parsed/narrowed.
- Reject unbounded query/filter/sort/raw expression inputs.

## 4. Pagination, filtering, and sorting

- Lists use approved bounded pagination contract; no unbounded catalogue/order/audit/media export through ordinary API list path.
- Filters/sorts are explicit allowlists owned by domain/read model.
- Public search/filter/query state follows SEO non-indexability and privacy boundaries.
- Cursor/page strategy is selected in implementation only after data access design validates it; API contract must remain consistent.

## 5. Idempotency and rate limits

- Idempotency key required for checkout/order, payment/refund, shipment/cancellation, relevant inventory, notification, and sensitive admin commands.
- Idempotency scope includes actor/session/order/command context and must not become cross-user data access key.
- Rate limits apply to authentication/recovery, search, tracking lookup, checkout/payment initiation, uploads, admin sensitive commands, and webhook ingress as appropriate.
- Exact limits/provider/store are deferred; limit behavior must offer safe retry and observability.

## 6. Backward compatibility and observability

- Public/consumer API contract changes document version/consumer/migration impact.
- APIs emit request/correlation IDs, safe outcome/error codes, audit context for sensitive commands, and metrics/traces without PII/secrets.
- Never return raw provider payload, secret, stack trace, database model, authorization capability matrix, or unapproved PII.

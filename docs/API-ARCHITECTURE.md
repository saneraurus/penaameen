# PENA AMEEN API Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED conceptual API contract model. Endpoint patterns are not implemented, do not select an API framework/provider, and do not authorize a public API beyond approved use cases.

## 1. API principles

- APIs are delivery adapters over application services, not a second business-logic layer.
- Public SEO reads render server-side without requiring browser API calls to the same application.
- Browser mutations, admin operations, asynchronous integrations, and future approved consumers use explicit validated API contracts.
- Every API request has authentication/authorization, validation, error, rate-limit, idempotency, and observability expectations appropriate to its risk.
- API versioning is explicit from first implementation to preserve migration/change control.
- Webhook APIs are separate from customer/staff APIs and never share a browser-auth model.

## 2. Route families

| Family | Conceptual pattern | Audience | Auth | Notes |
|---|---|---|---|---|
| Public catalog/content | `/api/v1/products`, `/api/v1/categories`, `/api/v1/search`, `/api/v1/content` | Public browser/server features | Public rate controls | Returns only eligible public data; pages may use server services directly. |
| Cart | `/api/v1/cart`, `/api/v1/cart/items` | Guest/customer | Session/cart context | Idempotent mutations; no inventory/payment authority in client. |
| Checkout | `/api/v1/checkout/*` | Guest/customer | Session/cart context | Validates intent, shipping selection, payment initiation; non-indexable task boundary. |
| Orders/tracking | `/api/v1/orders/*`, `/api/v1/tracking/*` | Customer/authorized guest | Ownership/lookup policy | No arbitrary order enumeration. |
| Account | `/api/v1/account/*` | Customer | Customer session | Conditional on account policy. |
| Admin | `/api/v1/admin/*` | Staff | Staff session + capability | Privileged commands audited and rate-limited. |
| Webhooks | `/api/webhooks/[provider-key]/*` | External provider | Signature/replay validation | Provider key/contract is configured only after decision. |
| System | internal health/operational endpoints if approved | Platform operations | Platform-restricted | No public sensitive diagnostics. |

## 3. API conventions

### Versioning

- Start with `/api/v1/` for application APIs.
- Webhook route versioning follows a provider adapter contract and must not expose unverified provider paths prematurely.
- Breaking response/command changes require a new version or negotiated compatibility plan.

### Request and response format

Proposed JSON envelope for non-streaming APIs:

```json
{
  "data": {},
  "meta": {
    "requestId": "safe-correlation-id"
  }
}
```

Proposed error envelope:

```json
{
  "error": {
    "code": "DOMAIN_OR_TRANSPORT_CODE",
    "message": "Safe user-facing message",
    "fields": {
      "fieldName": "Optional safe validation message"
    },
    "requestId": "safe-correlation-id"
  }
}
```

Actual shape is a proposed convention. It must be consistent across routes and never include secrets, stack traces, raw provider payloads, or unauthorized resource data.

### Error classes

| Class | HTTP concept | Example | Client behavior |
|---|---|---|---|
| Validation | 400/422 | Invalid address field or quantity | Correct input and retry |
| Authentication | 401 | Missing/expired session | Sign in/recover if appropriate |
| Authorization | 403 | Staff/customer lacks capability/ownership | Safe access-denied route; no data leak |
| Not found | 404 | Eligible public product absent or unauthorized resource hidden | Public not-found or safe private result |
| Conflict | 409 | Cart version/inventory/order transition conflict | Refresh/review authoritative state |
| Rate limited | 429 | Search/login/webhook abuse threshold | Retry later; no silent retry loop |
| Provider temporary | 502/503/504 category | Payment/shipping/provider unavailable | Pending/retry/support state, not false success |
| Internal | 500 | Unexpected server fault | Safe message; correlation ID; alert/log |

## 4. Pagination, filtering, sorting, and search

- List endpoints use explicit cursor or page conventions chosen later; public route SEO pagination remains governed by `docs/SEO-IA.md`.
- Filtering/sorting uses allowlisted fields and bounded values. It cannot expose arbitrary database query behavior or create implicit indexable taxonomy.
- Search accepts a bounded query/scope/type/filter contract, applies rate limits, returns eligible result types only, and never returns private/admin/order data.
- Responses include safe pagination/filter metadata without raw internal query plans or sensitive counts.

## 5. Idempotency

| Endpoint class | Requirement |
|---|---|
| Cart mutation | Request key or version control to prevent replay/quantity duplication. |
| Checkout/order creation | Mandatory idempotency key scoped to customer/session/cart/checkout intent. |
| Payment initiation/refund | Mandatory idempotency key and attempt/reference reuse rules. |
| Shipment creation/cancellation | Mandatory idempotency key scoped to order/fulfillment action. |
| Admin destructive/sensitive command | Idempotency/audit command reference where repeated action could cause harm. |
| Webhook | Provider event ID/normalized hash duplicate detection. |

Idempotency keys are validated, scoped, stored securely, expire under approved policy, and cannot be used to access another user’s resource.

## 6. Conceptual endpoint inventory

| Domain | Conceptual read endpoints | Conceptual command endpoints | Status/dependency |
|---|---|---|---|
| Products | `GET /products`, `GET /products/[slug]` | Admin create/update/archive via `/admin/products/*` | Product/catalog export and SEO data needed |
| Categories/tags | `GET /categories/[slug]`, approved tag/archive reads | Admin category/tag management | Tag/category treatment conditional |
| Search | `GET /search?q=&scope=` | Search-index refresh is internal/job driven | Search relevance/provider decision pending |
| Cart | `GET /cart` | Add/update/remove item | Cart persistence/inventory/pricing policy pending |
| Checkout | Read current checkout context | Validate details, select shipping, initiate payment | Payment/shipping/legal/account policy pending |
| Orders | Authorized order/history read | Create/cancel/transition only through service policy | Historical migration and ownership policy pending |
| Payments | Authorized payment status read | Initiate, refund, reconcile under capability | Provider/method/refund/settlement unknown |
| Shipping | Authorized rate/tracking reads | Quote, select, create/cancel shipment under policy | Provider/origin/rate/AWB/return unknown |
| Tracking | Authorized tracking status read | No generic customer mutation | Lookup/authorization policy pending |
| Customers | Authorized self profile/order access | Profile/address update if approved | Account/privacy/migration policy pending |
| Content | Public eligible article/page/hub reads | Staff draft/publish/archive/edit | Content/media/SEO source data pending |
| Admin | Capability-scoped work queue/record reads | Catalog/order/shipping/content/SEO/settings actions | Staff/SOP/permission decisions pending |

## 7. Authentication and authorization

- Resolve session context before calling protected services.
- Enforce resource ownership for customer/cart/order/tracking/account routes.
- Enforce staff capability checks for admin routes and sensitive actions.
- Recheck authorization in application services, not only at route middleware.
- Use generic safe responses where resource existence itself is sensitive.
- External webhooks authenticate through signature/replay verification, not browser sessions.

## 8. Rate limiting and abuse controls

Rate limiting is required conceptually for:

- login, password recovery, registration if enabled;
- order/tracking lookup;
- checkout/payment initiation;
- search/autocomplete;
- media upload;
- admin sensitive commands;
- public APIs susceptible to scraping/abuse;
- webhook ingress where provider policy permits.

Exact thresholds, store, and provider are `DEFERRED` pending traffic/security/service decisions. Rate limiting must not prevent verified provider recovery/retry workflows without an approved exception policy.

## 9. Webhook security

Webhooks require signature verification, timestamp/replay checks where supported, strict payload parsing, allowlisted provider configuration, idempotent receipt handling, correlation/audit logging, and manual-review handling for unmatched/conflicting events. Provider-specific headers/algorithms remain unknown.

## 10. API non-goals

This architecture does not publish a seller API, marketplace API, public order enumeration API, raw inventory API, raw payment API, admin API to untrusted clients, provider credential API, or a versionless generic database CRUD API.

# PENA AMEEN Technical Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED implementation-neutral architecture blueprint. It is complete enough to guide later data/design/implementation phases, but it does not approve providers, create code, databases, migrations, infrastructure, credentials, or production integrations.

## 1. Chosen architecture style

### Proposed: modular monolith with web and worker runtimes

PENA AMEEN should be built as one modular application codebase with:

- one web runtime for public, account, admin, API, and webhook ingress;
- one worker runtime for durable asynchronous work;
- one relational source of truth for operational data;
- provider ports/adapters at every external integration boundary; and
- independently deployable web/worker processes only where runtime responsibility differs.

This is not a microservice architecture. Modules have clear boundaries in code and data ownership, but commerce transactions remain coherent and observable without distributed coordination.

## 2. Application boundaries

| Boundary | Responsibilities | Why it exists | Must not contain |
|---|---|---|---|
| Presentation | Route rendering, view models, forms, HTTP responses, loading/error states | Maps Phase 2 routes to user-facing behavior | Business state transitions, raw provider logic, direct unvalidated database writes |
| API/webhook delivery | Request parsing, authentication context, validation invocation, response translation, webhook ingress | Gives browser/external callers stable contracts | Domain policy duplicated from application services |
| Application services | Use-case orchestration, transactions, authorization checks, idempotency, outbox creation | Holds business workflow logic in testable units | UI framework details or provider-specific HTTP logic |
| Domain policy | Order/inventory/payment/shipping/content state rules | Keeps commerce correctness explicit | Infrastructure, transport, database query syntax |
| Repository/data access | Persistence/query mapping and transaction support | Separates relational data concerns | Browser/request-specific policy |
| Provider adapters | Payment, shipping, email, search, storage, analytics integration translation | Isolates changeable external contracts | Core order/inventory/content rules |
| Worker | Retries, outbox jobs, reconciliation, indexing, media, notifications | Keeps slow/fallible work durable and non-blocking | Unbounded direct customer/session UI work |

## 3. Frontend and backend boundaries

### Server responsibilities

- render indexable public routes, metadata, canonical URLs, structured data, sitemap, robots, and redirect decisions;
- resolve authenticated customer/staff context;
- execute all catalog/cart/checkout/order/payment/shipping/admin mutations through application services;
- validate external webhooks and provider events;
- issue/rotate/revoke server-managed sessions through a future auth implementation;
- access secrets, databases, object storage, and provider adapters only from trusted server boundaries.

### Client responsibilities

- present interactive inputs, cart controls, search refinement, checkout form state, and accessible feedback;
- submit validated-intent requests to server endpoints/actions;
- render server-provided authoritative state and recovery messages;
- never decide payment success, order state, inventory availability, staff authorization, redirect policy, or SEO metadata;
- never receive service secrets or private cross-customer/admin data.

## 4. API strategy

### Proposed contract model

- Versioned JSON API route family: `/api/v1/...` for browser mutations/read interactions requiring API semantics and future consumers.
- Provider webhook family: `/api/webhooks/[provider-key]/...` with provider-specific verification isolated behind adapter handlers.
- Server-rendered page data accesses application services/repositories directly through server-only boundaries; it does not require HTTP round-trips to itself.
- Server Actions, if adopted in a future implementation, may invoke the same application services for same-origin low-risk forms; they must not create a second business-logic path or bypass validation, authorization, idempotency, audit, or CSRF controls.

API shape, endpoints, errors, and idempotency are specified in `docs/API-ARCHITECTURE.md`.

## 5. Data access strategy

- PostgreSQL is the proposed authoritative relational store for commerce, content, SEO, audit, and job/outbox state.
- Application services own transaction boundaries; repositories cannot silently change cross-domain state outside a service transaction.
- Read models may be optimized/cached but cannot become the source of truth for inventory, payment, shipment, or order state.
- ORM/query library selection is `DEFERRED` until Phase 4 data architecture validates the data contract and team needs.
- Raw customer/order/payment/shipping/PII data must not be replicated into analytics or logs by default.

## 6. Background processing

| Job class | Trigger | Proposed worker behavior | Failure behavior |
|---|---|---|---|
| Transactional notification | Order/payment/shipment/return state transition | Render approved template and deliver through channel adapter | Retry with bounded policy; record failed delivery; alert/manual follow-up per policy |
| Payment webhook follow-up | Verified inbound event or reconciliation need | Process idempotently; update state only through payment/order services | Quarantine/unmatched/retry state; manual finance review |
| Shipping tracking update | Webhook or approved scheduled refresh | Normalize tracking event and update shipment state | Retry/reconcile; show conservative customer state |
| Search indexing | Published/updated product/content/taxonomy state | Update internal search document/read model | Retry; stale-search health alert; source page remains available |
| Media processing | Valid upload/migration record | Create approved derivatives/metadata references | Mark processing failed; do not publish broken media as complete |
| Sitemap/SEO refresh | Published route or redirect state change | Rebuild validated route candidates | Alert if generation fails; preserve last known valid artifact only by later policy |
| Reconciliation/expiry | Scheduled operational policy | Find pending/expired/exception candidates | No automatic policy transition without approved rules |

The job queue technology and retry intervals are not selected here. The durable outbox/job pattern is proposed to ensure a committed state is not lost before follow-up work is scheduled.

## 7. Caching architecture

| Data/route class | Cache posture | Invalidation/consistency rule |
|---|---|---|
| Home, education hubs, blog, articles, active categories/products | Server/edge cache eligible after data/SEO validation | Invalidate or revalidate after approved publish/product/SEO changes; stale data must not misrepresent availability/pricing |
| Product price/availability | Carefully cacheable read view | Revalidate authoritative product/inventory state before cart/checkout/order mutation |
| Search results | Short-lived/query-aware cache optional | Index/publication changes must invalidate/update search state; no stale unpublished/private result |
| Cart, checkout, account, order, tracking, admin | Private/no shared cache | User/session/authorization-specific; never edge-share across users |
| Redirect/canonical/sitemap/robots | Cacheable system output | Regenerate/validate when redirect/indexability/published route changes |
| Provider rate/payment/tracking data | Do not treat as durable cache authority | Respect quote expiration/status; persist authoritative attempt/shipment records separately |

## 8. Validation and error handling

Every ingress path has layered validation:

1. transport shape and size validation;
2. authentication/session and authorization context where required;
3. syntactic input validation;
4. domain/business rule validation in application services;
5. transaction/concurrency validation;
6. provider response/event verification where applicable;
7. user-safe error translation, structured logs, audit/outbox follow-up.

Errors are categorized as validation, authorization, conflict, not found, rate limit, provider temporary failure, provider permanent failure, internal failure, and manual-review-required. Internal diagnostics remain server-side; public responses use safe, actionable language.

## 9. Security boundaries

- Public, customer, staff/admin, worker, database, object-storage, and external-provider boundaries are separate trust zones.
- Secrets stay in server/worker environment configuration and never reach browser code, logs, media metadata, or analytics events.
- Sensitive state changes require authorization and audit records.
- Webhook ingress is isolated, signature-verified, replay/idempotency-protected, and never trusts a browser return as payment truth.
- Uploaded media is validated and stored outside executable application paths.
- Customer order/tracking access requires a future approved ownership/verification model.

See `docs/SECURITY-ARCHITECTURE.md`.

## 10. Observability boundaries

Each request/job/provider event must carry a correlation identifier. Structured logs, traces, metrics, audit logs, domain events, and business health signals are distinct:

- logs/traces diagnose technical behavior;
- audit logs record sensitive human/system actions;
- domain events communicate internal state facts;
- analytics measures aggregate visitor behavior;
- provider health measures external dependency availability;
- order/payment/shipping health identifies operational exceptions.

## 11. Deployment boundaries

The web runtime and worker runtime may scale/deploy independently but share versioned application contracts and database migration compatibility. Local, development, preview, staging, and production environments are separated; production secrets/data are never used in preview or local environments.

Hosting, database, storage, monitoring, CI, DNS, and external service providers remain selection gates. See `docs/DEPLOYMENT-ARCHITECTURE.md` and `docs/ENVIRONMENT-STRATEGY.md`.

## 12. Why this architecture is appropriate

- It supports SEO-first server rendering without a separate frontend/backend deployment complexity.
- It provides ACID relational boundaries for orders, inventory, payments, shipments, audits, and redirects.
- It keeps payment/shipping/provider changes localized to adapter boundaries.
- It provides durable retry/reconciliation behavior without unnecessary broker/microservice/Kubernetes infrastructure.
- It preserves a future path to scale web/worker/search independently after measured need, not speculation.
- It keeps the product single-vendor and avoids seller/accounting complexity that is out of scope.

## 13. Source-of-truth reconciliation

### Apparent conflict

`docs/MIGRATION-READINESS.md` states that committed/final architecture was not ready while product, URL, SEO, provider, and source-export data remained incomplete. Phase 3 is nevertheless authorized by `PROJECT.md`, the task registry, the Phase 3 brief, and decision D008.

### Resolution

The higher-precedence project controls and D008 permit a **provider-agnostic, data-aware technical architecture blueprint**. The migration-readiness warning still governs all data-specific, provider-specific, destructive migration, privacy-sensitive, and production implementation decisions. This package therefore uses `PROPOSED`, `UNKNOWN`, `BLOCKED`, `CLIENT DECISION REQUIRED`, and `DEFERRED` status rather than treating missing data as resolved.

No provider adapter, migration, environment, or source-data mapping is approved by this resolution.

## 14. Architecture status and blockers

The modular-monolith blueprint is `PROPOSED` and technically coherent. It is not implementation-ready until Phase 4 data architecture, approved providers/policies, source exports, migration decisions, security/legal requirements, and environment ownership are resolved or explicitly deferred.

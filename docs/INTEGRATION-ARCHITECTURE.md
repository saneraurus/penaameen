# PENA AMEEN Integration Architecture

**Phase:** 3 — Technical Architecture

**Status:** Integration boundary blueprint. No external production service is connected, no provider is hidden in the architecture, and no credential is requested or stored.

## 1. Integration principles

- All integrations sit behind application-owned ports/adapters.
- Provider-specific contracts, credentials, retries, idempotency, logging, and mapping stay outside core domain logic.
- Every adapter has health, timeout, error classification, safe logging, and manual/reconciliation behavior.
- External provider result does not become authoritative until validated/mapped by application policy.
- A provider may be replaced without rewriting order, shipping, content, or account domain models.

## 2. Integration register

| Integration area | Boundary | Status | Confirmed facts | Unknown/client decision | Architecture rule |
|---|---|---|---|---|---|
| Payment | Payment provider port → adapter | CONFIRMED boundary / provider UNKNOWN | Payment lifecycle and webhook/reconciliation requirements exist | Provider, methods, account, refund, settlement, events | Core uses provider-neutral Payment/Attempt/Event/Refund model |
| Shipping | Shipping provider port → adapter | CONFIRMED boundary / provider UNKNOWN | Rate, shipment, AWB, label, tracking requirements exist | Provider, couriers, origin, packages, rates, returns | Core uses provider-neutral Quote/Shipment/Tracking model |
| Email | Notification channel port → adapter | PROPOSED / provider unknown | Transactional notification events are required | Sender, provider, consent, templates | Notification intent independent of delivery channel |
| WhatsApp/SMS | Optional notification channel adapter | CLIENT DECISION REQUIRED | Potential channels identified | Business account, opt-in, provider, fallback | Do not implement/use as implicit fallback |
| Analytics | First-party event port → optional adapter | PROPOSED / provider unknown | Event catalogue and privacy constraints exist | Provider, consent, retention, dashboards | Domain records remain authoritative |
| Search | Search port → PostgreSQL initial implementation / optional external adapter | PROPOSED | Public product/content search is required | Engine, language, synonyms, scale threshold | Search documents are derived from eligible published records |
| Storage/CDN | Object storage/media delivery port | PROPOSED / provider unknown | Product/content/media storage and rights needs exist | Provider, CDN, transforms, private access | Store metadata/references separately from object binary |
| Authentication | Session/identity port | PROPOSED / provider unknown | Customer/staff auth boundaries are required | Provider/library, recovery, MFA/SSO, migration | Server session and authorization remain application-owned policy |
| DNS/domain | Deployment/domain boundary | UNKNOWN | Existing production domain exists | Registrar, DNS, email/DNS records, ownership | Do not change production DNS; plan cutover later |
| Monitoring | Logs/metrics/traces/error port | PROPOSED / provider unknown | Observability is required | Provider, retention, alerting ownership | Instrument application independently of vendor |
| Source migration | Export/import boundary | BLOCKED | Source system likely WordPress/WooCommerce-like | Exports/access/plugin versions/backups | Use source data contracts; do not scrape/assume hidden data |

## 3. Adapter contract expectations

Each adapter must define, before implementation:

- capability/support matrix;
- configuration ownership and environment separation;
- request/response mapping to provider-neutral commands/events;
- timeout, retry, rate-limit, idempotency, and cancellation behavior;
- authentication/secret rotation policy;
- webhook/event verification and replay handling if applicable;
- error classification and user/admin recovery behavior;
- data minimization, privacy, retention, and audit requirements;
- sandbox/staging/test strategy;
- health metrics and provider-outage runbook;
- migration/rollback/replacement plan.

## 4. Integration flow pattern

```text
Domain/application service
→ validate authorized intent
→ persist intent/state and outbox/audit where needed
→ port
→ selected adapter
→ external service
→ normalized response/event
→ idempotent state transition or manual review
```

This pattern applies to payment, shipping, notification, search indexing, storage, analytics, authentication, and monitoring integrations as appropriate.

## 5. Provider configuration safety

- Provider configuration is environment-specific and secret-managed.
- No environment may silently use production credentials for preview/local/staging.
- Configuration values are validated on startup/deployment but never emitted in client response/logs.
- A missing required provider configuration places the dependent capability in a safe disabled/blocked state, not a fake-success state.
- Feature/provider activation requires an approved launch checklist and rollback plan.

## 6. Client decision gates

Critical integration decisions remain:

- payment provider/methods/account/webhooks/refunds/settlement;
- shipping provider/couriers/origin/rates/package/AWB/labels/tracking/returns;
- email/sender/notification consent and optional WhatsApp/SMS;
- analytics/Search Console/consent/access;
- storage/CDN, authentication, hosting, database, monitoring, CI/DNS provider selection and ownership;
- source system export/backups/access/migration policy.

The integration architecture is intentionally complete as a boundary model while these adapter implementations remain blocked.

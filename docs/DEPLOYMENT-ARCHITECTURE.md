# PENA AMEEN Deployment Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED environment and deployment blueprint. No hosting, CI/CD, container, DNS, database, storage, monitoring, or production service is provisioned or configured.

## 1. Deployment model

The proposed deployment shape supports a stateless web runtime and separately deployable worker runtime backed by managed PostgreSQL and object storage. A managed Node.js/container-compatible platform is recommended conceptually because it supports SSR, webhooks, worker jobs, staging, and rollback without requiring Kubernetes.

Provider selection, region, account owner, cost, runtime limits, database/storage hosting, and network controls remain `CLIENT DECISION REQUIRED` or `UNKNOWN`.

## 2. Environment topology

| Environment | Purpose | Data posture | External integrations | Deployment rule |
|---|---|---|---|---|
| Local | Developer architecture/test work | Synthetic/local-only data | Mocks/sandboxes only | Never use production secrets/data |
| Development | Shared integration development | Synthetic/anonymized/resettable data | Sandbox/mock integrations | Fast validation, not customer-facing |
| Preview | Per-change review | Synthetic/anonymized data | Disabled/sandbox integrations | Automatically isolated; no production provider actions |
| Staging | Production-like acceptance/migration rehearsal | Approved non-production or anonymized representative data | Provider sandbox/test accounts where available | Required gate before production |
| Production | Live customer/staff operation | Approved production data | Approved production integrations only | Manual approval and monitoring gates |

## 3. Runtime components

| Component | Deployment responsibility | Scaling/failure boundary |
|---|---|---|
| Web application | Public SSR pages, APIs, account/admin routes, webhook ingress | Stateless horizontal scaling; session/data stored externally |
| Worker | Durable jobs, notifications, indexing, reconciliation, media/tracking work | Independent scale/retry/health; must be version compatible with web |
| PostgreSQL | Authoritative transactional data | Managed backup/recovery/access policy required |
| Object storage | Media/documents assets | Public/private delivery policy and lifecycle required |
| Cache/CDN | Public response/media delivery where approved | Must not cache private/cart/account/order/admin data |
| Monitoring/observability | Logs/metrics/traces/errors/audit health | Restricted access, redaction, retention/alert ownership |

No microservice platform or Kubernetes cluster is justified by current requirements.

## 4. CI/CD pipeline concept

```text
Change proposal
→ static/document/code validation
→ unit/integration/security checks when code exists
→ preview deployment using non-production configuration
→ review/acceptance gates
→ staging deployment and migration/provider checks
→ manual production approval
→ production deployment
→ smoke/SEO/commerce/observability monitoring
→ rollback or incident path if needed
```

### Required future deployment gates

- lint/type/test/build checks after code exists;
- dependency/security/secret scan;
- data migration compatibility and backup verification;
- redirect/SEO route/sitemap/robots/canonical validation;
- accessibility/performance checks;
- payment/shipping sandbox/event/idempotency/retry tests;
- notification/analytics/privacy validation;
- staff permission/audit/operational SOP acceptance;
- environment configuration completeness without secret exposure;
- explicit production approver and rollback readiness.

CI provider is not selected; repository-native automated CI is proposed.

## 5. Database migration and compatibility policy

No migrations are created in Phase 3. Future deployments must use backward-compatible migration sequencing:

1. backup/restore readiness and migration plan;
2. additive schema/data changes compatible with current web/worker version;
3. deploy code able to handle both states;
4. backfill/validate through controlled job if needed;
5. remove deprecated shape only after verification and rollback window;
6. record migration/audit/monitoring result.

Data migration from WordPress/WooCommerce requires separate Phase 4/9 mapping and validation; it must not be combined casually with application deployment.

## 6. Rollback architecture

| Failure type | Rollback/recovery posture |
|---|---|
| Web rendering/API regression | Roll back compatible web release; preserve data compatibility |
| Worker regression | Pause/roll back worker; retain durable jobs for safe replay after correction |
| Provider configuration failure | Disable affected capability safely or revert configuration; do not fabricate success |
| Database migration issue | Use tested recovery/forward-fix strategy; never assume destructive rollback is safe |
| SEO/redirect regression | Restore approved redirect/route configuration; monitor 404/crawl effects |
| Media/storage regression | Preserve originals/references; restore from tested backup/version policy |
| Security incident | Rotate secrets/session controls, contain access, audit, follow incident policy |

A deployment is not considered rollback-ready if it includes untested destructive migration, unverified redirect changes, or irreversible provider state without a documented recovery plan.

## 7. Backups and disaster recovery

- Database and media backup/retention/restore strategy must be defined with selected providers and legal data policy.
- Restore tests are mandatory before production launch; backup existence alone is insufficient.
- Recovery objectives, ownership, incident contacts, data-loss tolerance, and customer communication are client/operations decisions.
- Source website backup/export is also a migration prerequisite and must be captured before destructive cutover.

## 8. Production launch boundaries

Production launch remains blocked until product/content/media/SEO source data, redirect matrix, legal policies, payment/shipping providers, provider tests, staff SOP, domain/DNS plan, backups, analytics/Search Console, security/performance/QA acceptance, and launch approval are complete. This architecture does not change the existing production website or DNS.

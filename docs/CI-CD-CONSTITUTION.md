# PENA AMEEN CI/CD Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory future pipeline governance. No CI/CD configuration or provider is created.

## 1. Mandatory gates

| Gate | Required evidence before merge/release |
|---|---|
| Formatting | Approved formatter/check passes without unrelated rewrites |
| Lint | Approved static rules pass; no suppressed architecture/security issue without tracked justification |
| Typecheck | Strict TypeScript contract passes |
| Unit tests | Domain/value/state rules pass |
| Integration tests | Service/transaction/idempotency/repository/job behavior passes |
| Build | Production-like build/render validation passes |
| Security checks | Dependency/secret/static/security boundary checks pass |
| Migration validation | Schema/data/import/rollback compatibility evidence where change affects data/migration |
| Accessibility checks | Automated plus required manual pattern evidence for affected UI |
| SEO checks | Route/metadata/canonical/redirect/sitemap/indexability evidence for public route changes |
| Performance checks | Relevant budget/regression evidence for affected route/query/media/client bundle |
| Provider checks | Approved sandbox/webhook/idempotency/reconciliation evidence for provider change |

## 2. Review and release rules

- Pull requests are focused, traceable, reviewed, and linked to requirements/architecture/data/design decisions.
- Protected branch/release rules are selected with platform owner later but must enforce required checks/approval.
- Production release requires explicit approved owner, staging evidence, rollback/runbook, configuration/secret validation, monitoring/alert readiness, and post-release verification.
- Failed gate blocks merge/release unless an approved documented exception identifies risk, owner, expiry, and remediation.

## 3. Prohibitions

No pipeline may auto-deploy unreviewed destructive migration, provider config, production secret, source import, redirect retirement, customer/order data, or unvalidated application change. CI/CD provider remains unknown until CDR-028 resolution.

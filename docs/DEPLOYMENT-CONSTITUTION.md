# PENA AMEEN Deployment Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory environment and release rules. No deployment, hosting configuration, CI configuration, DNS change, provider account, or infrastructure is created.

## 1. Environment rules

| Environment | Purpose | Data/secrets | Deployment rule |
|---|---|---|---|
| Local | Developer work and deterministic tests | Synthetic/non-production only; no production secrets | No external production mutation |
| Development | Shared integration development | Synthetic/anonymized/resettable data; sandbox/mock services | Validate feature integration only |
| Preview | Change review | Isolated non-production configuration/data | No production provider or customer data |
| Staging | Production-like acceptance/migration rehearsal | Approved representative/sandbox data | Required provider/migration/SEO/security/rollback validation gate |
| Production | Live operation | Approved production data/secrets/accounts only | Explicit release approval, monitoring, backup/rollback readiness |

## 2. Release rules

- Web and worker releases are version-compatible with data migrations and job contracts.
- Production deployment requires tested rollback, backup/restore, observability, configuration validation, security, accessibility, SEO, provider sandbox, migration, and approval evidence.
- No destructive schema/data/redirect/provider change deploys without approved runbook and rollback/forward-fix plan.
- Deployment output never exposes secrets/PII. Post-release checks include route, redirect, order/provider health, job, media, sitemap/robots, and error monitoring.

## 3. Provider/platform boundary

Hosting, database, storage, CDN, DNS, monitoring, CI, backup, region, account ownership, and runtime configuration remain CDR-028 decisions. Constitution requires safe environments and gates regardless of chosen provider.

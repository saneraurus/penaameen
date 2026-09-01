# PENA AMEEN Environment Strategy

**Phase:** 3 — Technical Architecture

**Status:** Conceptual configuration inventory. No `.env` files, credentials, secrets, keys, provider values, production configuration, or environment infrastructure is created by this document.

## 1. Environment principles

- Configuration is environment-specific and validated without exposing values.
- Secrets are supplied only through an approved secret-management/deployment mechanism, never source control, documentation examples, browser bundles, logs, or chat.
- Local/preview/staging use isolated non-production data and sandbox/mock integrations.
- A missing required configuration disables or blocks the dependent capability safely; it must not use a hidden fallback credential or fake success.
- Environment variable names below are conceptual naming guidance, not a final implementation contract.

## 2. Application configuration

| Conceptual variable/group | Purpose | Status |
|---|---|---|
| `APP_ENV` | Identify local/development/preview/staging/production | PROPOSED |
| `APP_BASE_URL` | Canonical application base URL for server-side generation | PROPOSED; production domain unknown |
| `APP_RELEASE_ID` | Correlate deployed version with logs/traces | PROPOSED |
| `APP_LOG_LEVEL` | Configure safe log verbosity per environment | PROPOSED |
| `FEATURE_*` | Explicit approved capability flags for staged/provider-gated features | PROPOSED; flags cannot bypass business approval |
| `JOB_WORKER_ENABLED` | Enable dedicated worker runtime behavior | PROPOSED |

## 3. Database configuration

| Conceptual variable/group | Purpose | Status |
|---|---|---|
| `SUPABASE_DB_URL` | Supabase transaction-pooler connection (RLS-bound `penaameen_app` role) | IMPLEMENTED 2026-09-01; Supabase Postgres is the single database source of truth |
| `SUPABASE_DB_STAFF_URL` | Supabase session-pooler staff connection (`penaameen_staff`, `BYPASSRLS`); also used by `prisma migrate deploy` and seeding | IMPLEMENTED 2026-09-01 |
| `SUPABASE_DB_MIGRATE_URL` | Optional owner (postgres) session connection for CLI migrations after Dashboard password reset | PENDING user password reset |
| `RLS_ENABLED` | Enforces RLS context helpers | IMPLEMENTED; `true` in all environments |
| Compute hosting | Vercel hosts only the stateless Next.js runtime (SSR/API/middleware); no database, storage, or auth service runs on Vercel | IMPLEMENTED via client decision 2026-09-01 (TDR-020) |

## 4. Authentication and session configuration

| Conceptual variable/group | Purpose | Status |
|---|---|---|
| `SESSION_SECRET` / key-set reference | Sign/encrypt server session material | PROPOSED; actual mechanism unknown |
| `AUTH_PROVIDER_*` | Future configured identity/provider adapter | CLIENT DECISION REQUIRED / provider unknown |
| `AUTH_CALLBACK_URL` | Safe configured callback origin if applicable | DEFERRED |
| `AUTH_STAFF_*` | Future staff identity/SSO/MFA configuration | CLIENT DECISION REQUIRED |
| `PASSWORD_RECOVERY_*` | Future recovery expiration/template/flow configuration | DEFERRED |

## 5. Storage and media configuration

| Conceptual variable/group | Purpose | Status |
|---|---|---|
| `STORAGE_PROVIDER` | Select approved object-storage adapter | CLIENT DECISION REQUIRED |
| `STORAGE_BUCKET_*` | Public/private media/document bucket references | PROPOSED; provider unknown |
| `STORAGE_ACCESS_*` | Server-side storage credential reference | UNKNOWN; never client exposed |
| `CDN_BASE_URL` | Approved media delivery base URL | CLIENT DECISION REQUIRED |
| `MEDIA_UPLOAD_*` | Future size/type/quarantine policy configuration | DEFERRED |

## 6. Payment configuration

| Conceptual variable/group | Purpose | Status |
|---|---|---|
| `PAYMENT_PROVIDER` | Select one approved provider adapter | CLIENT DECISION REQUIRED |
| `PAYMENT_PROVIDER_*` | Server-only credential/account/webhook configuration reference | UNKNOWN; never documented as value |
| `PAYMENT_WEBHOOK_*` | Signature/replay/endpoint configuration | UNKNOWN until provider selected |
| `PAYMENT_SANDBOX_*` | Test account/configuration reference | UNKNOWN |

## 7. Shipping configuration

| Conceptual variable/group | Purpose | Status |
|---|---|---|
| `SHIPPING_PROVIDER` | Select approved provider/aggregator adapter | CLIENT DECISION REQUIRED |
| `SHIPPING_PROVIDER_*` | Server-only credential/account/webhook configuration reference | UNKNOWN |
| `SHIPPING_ORIGIN_*` | Approved origin/address configuration reference | CLIENT DECISION REQUIRED |
| `SHIPPING_DEFAULT_*` | Approved package/weight/service policy values | UNKNOWN; no default invented |
| `SHIPPING_SANDBOX_*` | Test environment configuration reference | UNKNOWN |

## 8. Email and notification configuration

| Conceptual variable/group | Purpose | Status |
|---|---|---|
| `NOTIFICATION_EMAIL_PROVIDER_*` | Approved transactional email adapter/sender configuration | CLIENT DECISION REQUIRED |
| `NOTIFICATION_WHATSAPP_*` | Optional approved WhatsApp adapter configuration | CLIENT DECISION REQUIRED |
| `NOTIFICATION_SMS_*` | Optional approved SMS adapter configuration | CLIENT DECISION REQUIRED |
| `NOTIFICATION_TEMPLATE_*` | Approved template/version configuration references | DEFERRED |

## 9. Analytics and monitoring configuration

| Conceptual variable/group | Purpose | Status |
|---|---|---|
| `ANALYTICS_PROVIDER_*` | Optional external analytics adapter configuration | CLIENT DECISION REQUIRED |
| `ANALYTICS_CONSENT_*` | Consent/policy integration configuration | CLIENT DECISION REQUIRED |
| `SEARCH_CONSOLE_*` | Search Console/integration reference if approved | UNKNOWN |
| `OBSERVABILITY_*` | Logs/metrics/traces/error-monitoring adapter config | CLIENT DECISION REQUIRED |
| `ALERTING_*` | Operational alert routing/ownership reference | CLIENT DECISION REQUIRED |

## 10. Deployment and platform configuration

| Conceptual variable/group | Purpose | Status |
|---|---|---|
| `DEPLOYMENT_REGION` | Approved runtime/data locality selection | CLIENT DECISION REQUIRED |
| `TRUSTED_ORIGINS` | Allowed application origins/callbacks | DEFERRED until hosting/domain selected |
| `WEB_RUNTIME_*` | Runtime sizing/timeout/concurrency configuration | DEFERRED until provider/load validation |
| `WORKER_RUNTIME_*` | Worker queue/concurrency/retry configuration | DEFERRED until job/provider behavior confirmed |
| `BACKUP_*` | Backup/restore policy integration reference | CLIENT DECISION REQUIRED |

## 11. Secret-handling rules

- No real value may be committed to the repository, placed in documentation, or printed in CI logs.
- Secret references are scoped to service/environment and rotated according to approved operations policy.
- Preview/local environments use distinct non-production secrets and sandbox accounts only.
- Provider secrets are read only by the server/worker adapter that requires them.
- Client-visible configuration contains only intentionally public values and must be reviewed for privacy/security.
- Secret rotation, incident response, access approval, and audit are required before production.

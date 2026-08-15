# PENA AMEEN Observability Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory observability rules. No monitoring, log, trace, alert, or error provider is selected/configured.

## 1. Required signals

- Structured logs: timestamp, environment/release, request/correlation ID, module, operation, safe resource reference, outcome/error category.
- Metrics: route/render, database/query, worker/job, payment, shipping, inventory, notification, search, SEO, media, security, and provider health.
- Traces: request/job/service/repository/adapter path with safe correlation.
- Audit events: sensitive human/system action actor/target/result/reason/evidence.
- Domain events/outbox: durable facts for asynchronous work; analytics is observational only.

## 2. Correlation rules

- Generate/propagate request and correlation IDs across web, worker, provider adapters, audit, and job records.
- Preserve provider reference only in approved safe field; never expose secret/raw payload.
- Logs/metrics/traces redact PII, session/token, address, credentials, payment data, raw webhook payload, and message content by default.

## 3. Health and alerting

- Expose safe health/readiness criteria after implementation without leaking internal topology/secrets.
- Alert on payment/shipping/provider failures, duplicate webhook risk, inventory conflict, job backlog/dead-letter, SEO redirect/404/sitemap failure, media failures, auth/security anomalies, database/runtime failure, and notification delivery failure.
- Alerts require owner/runbook/severity and customer-safe recovery; provider/alert channel selection remains client-gated.

## 4. Review rule

Every new provider, sensitive command, async job, public route, migration/import, and high-risk feature must define its logs, metrics, trace/correlation, audit, failure alert, and privacy/redaction behavior before merge.

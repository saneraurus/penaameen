# PENA AMEEN Observability Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED observability blueprint. No monitoring/logging/tracing provider, alert channel, retention period, dashboard, or production telemetry service is selected or configured.

## 1. Observability principle

A production commerce system must make both technical health and business-state health visible before customers or staff discover silent failures. Observability is not analytics alone: logs, metrics, traces, audits, domain events, provider health, and operational queues serve different purposes.

## 2. Signals

| Signal | Purpose | Required properties |
|---|---|---|
| Structured logs | Diagnose request/job/provider behavior | Timestamp, severity, module, operation, correlation ID, safe resource reference, outcome; PII/secret redaction |
| Metrics | Measure latency, throughput, errors, queue/provider/system health | Bounded labels; route/domain/provider outcome classes; alertable aggregates |
| Traces | Follow request across route/service/repository/worker/adapter boundaries | Correlation/trace ID; no raw sensitive payloads |
| Error monitoring | Capture unexpected faults with release/environment context | Sanitized stack/context; grouping; escalation policy |
| Audit logs | Record sensitive human/system business actions | Actor, action, target, safe before/after/outcome/reason/correlation |
| Domain events | Durable facts for worker/notification/indexing/reconciliation | Versioned, idempotent, authoritative source linkage |
| Business health | Identify order/payment/shipping/inventory/SEO exception backlogs | Derived from authoritative records, not analytics alone |

## 3. Correlation and log context

Every incoming browser/API/webhook request and worker job receives a correlation ID. Provider external references, order/payment/shipment/job IDs, actor class, environment, release identifier, and route/module may be attached as safe fields. Do not log raw session tokens, passwords, addresses, payment credentials, provider secrets, full webhook payloads, or unredacted message bodies.

## 4. Required technical health signals

| Area | Signals to observe |
|---|---|
| Web/public rendering | Request volume, route latency, TTFB/server errors, cache behavior, redirect/404 rate, render failures |
| Database | Connection/transaction failures, slow query class, lock/constraint conflict, pool saturation, backup/restore health |
| Worker/jobs | Queue depth, age, processing rate, retry count, dead-letter/manual-review count, job latency/failure |
| Payment | Initiation/pending/verified/failure/mismatch counts, webhook verification failures, duplicate events, reconciliation backlog, provider latency/error |
| Shipping | Rate quote outcome/latency, shipment/AWB/label/tracking failures, duplicate request prevention, provider health, stale tracking |
| Inventory | Reservation conflict, negative stock prevention, adjustment/reconciliation discrepancy, allocation mismatch |
| Notifications | Queue/send/delivery/failure/retry/suppression rate, stale messages, provider health |
| Search | Query latency, error, zero-result, index freshness, stale/invalid document count |
| SEO | Sitemap/robots generation, redirect result, 404 category, canonical/indexability conflict, broken internal link, structured data validation |
| Media | Upload validation, scan/process/derivative failure, broken delivery, missing alt/rights, object access error |
| Security | Auth failures, rate limit events, CSRF/webhook signature failure, access-denied anomalies, sensitive action audit signals |

## 5. Business/operational health

| Health view | Derived from | Intended owner |
|---|---|---|
| Order health | Orders by workflow state/age/exception | Order operations |
| Payment health | Payment attempts/events/reconciliation/refund state | Finance/order operations |
| Shipping health | Quotes/shipments/AWB/labels/tracking/exceptions | Fulfillment operations |
| Inventory health | Available/reserved/adjustment/reconciliation state | Catalog/operations |
| Catalog/content health | Missing data/media/SEO/publish state | Product/content/SEO staff |
| Migration SEO health | Legacy redirects/404/indexability/sitemap state | SEO/content owner |
| Notification health | Transactional delivery/outstanding failures | Support/operations |
| Provider health | Adapter errors/latency/outage indicators | Platform/operations |

Exact dashboards, thresholds, SLA/SLOs, alert escalation, business owners, and report access remain client/operations decisions.

## 6. Alerting and escalation architecture

Alerts should be actionable and classified by severity:

- **Critical:** payment verification/reconciliation breach, duplicate charge/shipment risk, database outage/data integrity risk, critical security/webhook failure, widespread checkout failure, destructive SEO redirect failure.
- **High:** sustained provider outage, growing job backlog, shipment/AWB failure cluster, inventory conflict/reconciliation issue, notification delivery failure cluster, sitemap/404 regression.
- **Medium:** search/index lag, media processing failure, non-critical admin/report issue, performance budget regression.
- **Low:** isolated recoverable retry, expected validation/rate-limit noise, non-actionable informational metric.

Alert transport/provider is not selected. Alerts must not disclose secrets/PII and must route to an approved owner/runbook.

## 7. Audit-log architecture

Audit logs are append-only conceptual records for sensitive actions such as catalog price/inventory changes, publishing/SEO/redirect changes, role/access updates, payment/refund review, shipment/AWB/label actions, customer data access, and manual exception resolution. They are not a replacement for operational logs; access and retention are restricted.

## 8. Readiness gate

Before production, the selected platform must provide enough observability to answer:

- What release/environment handled this request/job?
- Which order/payment/shipment/customer-safe reference is affected?
- Did an external provider event verify, fail, retry, or require review?
- Did a state transition, notification, inventory change, redirect, or media action happen exactly once?
- Can authorized staff find the exception and its next action?
- Are secrets/PII protected in logs/telemetry?

No production launch is acceptable without these answers being observable in an approved operating model.

# PENA AMEEN Error and Recovery Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED failure-handling blueprint. Retry counts, timeout values, provider fallbacks, manual authority, customer wording, and alert thresholds require later provider/SOP/security decisions.

## 1. Recovery principles

1. Never convert an uncertain external outcome into a success state.
2. Persist enough idempotent state/audit context to retry or reconcile safely.
3. Distinguish user-correctable, transient, permanent, security, and manual-review failures.
4. Show customer-safe recovery language without leaking provider/secrets/internal diagnostics.
5. Send material failures to an authorized admin work queue/alert path.
6. Keep retries bounded and observable; do not create duplicate orders, charges, shipments, refunds, messages, or stock moves.

## 2. Failure matrix

| Failure | Detection | Immediate behavior | Retry/idempotency | Manual fallback | Customer message | Admin/observability |
|---|---|---|---|---|---|---|
| Payment timeout after initiation | Network/provider timeout or ambiguous response | Keep payment/order pending/review state; do not retry blindly | Reconcile same PaymentAttempt/reference before retry | Finance/order review | Payment status is being confirmed; safe next step/support | Correlation, provider latency, pending-age queue |
| Duplicate payment webhook | Existing provider event ID/hash | Acknowledge/process once; no duplicate transition/message | Mandatory webhook receipt idempotency | Review only if payload conflicts | No duplicate customer notification | Duplicate counter/audit event |
| Invalid/unverified payment webhook | Signature/schema/reference fails | Quarantine; no state change | No retry of untrusted payload | Finance/security review | No customer action unless approved | Security alert/audit/log redaction |
| Payment amount/status mismatch | Reconciliation validation fails | Requires review state | No automatic transition | Finance review/reconcile provider | Pending/review wording only | Critical payment exception alert |
| Shipping rate API failure | Adapter timeout/error/no valid rate | Keep checkout rate state failed; do not substitute rate | Bounded retry with query idempotency | Support/manual fulfillment route only if approved | Unable to calculate shipping; retry/contact support | Provider health/rate failure metrics |
| Shipping quote expired | Quote validity/selection fails revalidation | Require refresh/reselect | New quote request; stale quote not reused | Staff review if persistent | Shipping option changed; review before payment | Quote expiry metric |
| Shipment creation failure | Provider error/timeout/duplicate ambiguity | Keep order unshipped; preserve request state | Shipment idempotency key/reconcile before retry | Fulfillment exception queue | Order is being prepared; tracking not yet available | Shipment failure/duplicate risk alert |
| AWB generation failure | Shipment exists but no tracking reference | Keep shipment accurately created/requested | Poll/retry only if provider supports | Authorized manual AWB workflow if approved | Tracking not yet available | AWB backlog/exception queue |
| Label generation/print failure | Provider/print response failure | Do not mark label printed | Re-retrieve/retry idempotently | Fulfillment manual print/support process | Usually no customer message | Label availability failure signal |
| Tracking update failure/stale status | Provider event/poll error | Preserve last known safe status with timestamp | Bounded retry; idempotent event normalize | Support/fulfillment review | Tracking temporarily unavailable; support path | Tracking freshness/provider health alert |
| Email/channel failure | Delivery adapter failure | Keep business state; notification intent failed/retry | Channel event idempotency and bounded retry | Support/manual outreach if material and approved | Status remains available in account/tracking | Delivery failure queue/metrics |
| Inventory race condition | Conditional update/reservation conflict | Reject or revalidate affected cart/checkout | Idempotent request returns authoritative state | Operations review if reconciliation issue | Item availability changed; review cart | Stock conflict/reconciliation metric |
| Database transaction failure | Transaction/connection/constraint error | Roll back atomic business change; no partial success response | Safe retry only for idempotent transient request | Platform incident/recovery | Temporary issue; retry safely | Error trace/DB health/alert |
| Worker/job failure | Job timeout/error/retry exhaustion | Preserve source state; mark job failed/manual review | Durable job attempt/idempotency | Operations queue | Only message if customer task needs update | Queue depth/dead-letter/alert |
| External provider outage | Health/timeout/error-rate threshold | Degrade dependent capability safely | Bounded retry/circuit policy after later design | Approved manual SOP | Pending/unavailable, not false success | Provider health incident/alert |
| Redirect/SEO route failure | Mapping/route validation/404 monitor | Serve safe not-found if no approved target; never generic home redirect | Validate/redeploy correction | SEO/content review | Helpful navigation/search | 404/redirect audit/alert |
| Media processing/upload failure | Validation/worker/storage failure | Do not publish broken/unapproved asset | Retry processing only when safe | Media review/re-upload | Safe fallback or publish block | Media error queue |
| Unauthorized/expired session | Auth/authorization check fails | Deny safely; preserve non-sensitive form context if possible | No automatic privilege retry | Support/recovery policy | Sign in/recover/access denied | Security/audit/rate signals |

## 3. Retry policy architecture

- Classify operations as non-retryable validation/security, retryable transient, reconciliation-required ambiguous, and manual-policy failures.
- Use bounded exponential retry with jitter and attempt history for transient worker/provider failures; exact schedules are deferred.
- Use idempotency keys for any retryable command that can create a financial, fulfillment, inventory, or customer-message side effect.
- Stop automatic retry when provider policy, state transition, expiration, cancellation, or permanent validation indicates retry would be harmful.
- Escalate retry exhaustion to a visible manual-review queue with correlation, safe error category, resource reference, and suggested operational owner.

## 4. Timeouts and circuit behavior

- Each provider adapter has explicit connection/request/overall timeout budgets defined during implementation/provider selection.
- Provider calls must not hold long database transactions.
- A repeated provider failure may enter a circuit/degraded mode that stops unsafe repeated calls and exposes a safe customer/admin state.
- Circuit thresholds and fallback rules are `DEFERRED` until provider SLA, business impact, and operational support coverage are known.

## 5. Customer and staff recovery boundaries

| Audience | Must see | Must not see |
|---|---|---|
| Customer | Truthful current state, actionable retry/correction/support path, safe reference | Provider secrets, raw error payloads, other customer data, false success |
| Staff | Authorized exception context, next action/manual SOP, audit/correlation reference | Unnecessary secrets/raw credentials/unscoped PII |
| Finance/fulfillment/SEO specialist | Domain-specific evidence/status and allowed action | Bypassed approval/state rules |
| Platform/security operator | Sanitized logs/metrics/traces/health | Raw sensitive payloads unless access policy permits |

## 6. Recovery testing requirements

Later QA/implementation must simulate duplicate webhook, timeout, provider outage, stale quote, inventory conflict, job retry exhaustion, invalid upload, authorization failure, database rollback, 404/redirect fault, notification failure, and manual review paths. A happy-path-only test suite is insufficient for commerce launch.

# PENA AMEEN Notification Architecture

**Phase:** 3 — Technical Architecture

**Status:** Provider-agnostic transactional notification architecture. Baseline channel, sender ownership, email/WhatsApp/SMS/in-app providers, consent, templates, fallback, and delivery guarantees are client decisions. No channel integration is implemented.

## 1. Notification architecture principle

Notifications are reactions to committed, verified domain events. The domain state remains authoritative; a sent message never proves that a payment, shipment, delivery, cancellation, or refund succeeded.

```text
Committed order/payment/shipping/account event
→ transactional outbox record
→ notification policy/template selection
→ channel adapter
→ provider delivery response
→ delivery audit/retry/manual support state
```

## 2. Event catalog

| Event | Authoritative trigger | Customer purpose | Candidate channel posture | Status |
|---|---|---|---|---|
| Order created | Valid order state committed | Provide reference and truthful next payment/order step | Baseline transactional channel | MUST HAVE |
| Payment pending | Payment attempt pending/verification state | Explain next action/status | Baseline transactional channel | MUST HAVE |
| Payment success | Verified paid event committed | Confirm payment and fulfillment expectation | Baseline transactional channel | MUST HAVE |
| Payment failed | Verified failure event committed | Explain recovery without false order result | Baseline transactional channel | MUST HAVE |
| Payment expiration/cancellation | Approved state policy/event | Explain permitted recovery | Baseline transactional channel if applicable | CONDITIONAL |
| Order processing | Approved order workflow transition | Set fulfillment expectation | Baseline channel where approved | SHOULD HAVE |
| Shipment created | Shipment record confirmed | Explain shipment preparation where useful | Baseline channel where approved | SHOULD HAVE |
| AWB/resi generated | Valid tracking identifier recorded | Provide tracking context | Baseline transactional channel | MUST HAVE |
| Order shipped | Approved dispatch event committed | Notify shipping progression | Baseline transactional channel | MUST HAVE |
| Tracking update | Trusted normalized tracking event | Provide meaningful movement/exception update | Channel policy dependent | SHOULD HAVE |
| Delivered | Trusted delivery evidence committed | Close delivery loop/support path | Channel policy dependent | SHOULD HAVE |
| Cancellation | Authorized cancellation committed | Explain cancellation and next step | Baseline transactional channel | MUST HAVE if event occurs |
| Refund processing/completed | Authorized/verified refund state | Explain truthful refund state | Baseline transactional channel | MUST HAVE if event occurs |
| Account recovery | Approved account recovery request | Support secure access recovery | Approved secure channel | CONDITIONAL on account model |

## 3. Channel abstraction

| Channel | Role | Status | Decision requirements |
|---|---|---|---|
| Email | Proposed baseline durable transactional channel | PROPOSED | Sender identity, domain ownership, provider, consent/legal basis, templates, support ownership |
| WhatsApp | Optional high-engagement transactional channel | CLIENT DECISION REQUIRED | Business account, opt-in/template policy, provider, fallback, support workflow |
| SMS | Optional critical short-form fallback | CLIENT DECISION REQUIRED | Consent, sender/cost/regional policy, provider, content limits |
| In-app | Optional account-bound notification surface | DEFERRED | Account model, read state, retention, does not replace durable channel |
| Staff alert | Internal operational signal/queue rather than customer channel | PROPOSED | Alert ownership, escalation, monitoring channel |

A customer event does not need to use every channel. Channel priority/fallback must be explicit and consent-aware.

## 4. Notification lifecycle

| State | Meaning | Architecture behavior |
|---|---|---|
| Intent queued | Verified domain event requires possible notification | Persist idempotent intent/outbox record |
| Suppressed | Policy/consent/preference says do not send a non-essential message | Record safe reason; do not change business state |
| Rendering | Approved template/data is being prepared | Validate data minimization and safe links |
| Sending | Channel adapter request in progress | Track attempt/correlation; no duplicate blind retry |
| Sent/accepted | Provider accepted message | Do not claim customer read/delivery unless provider evidence supports it |
| Delivered/read | Provider reports supported delivery/read state | Store minimal safe delivery signal |
| Failed/transient | Retryable transport/provider failure | Bounded retry through worker |
| Failed/permanent | Invalid destination/template/policy/provider permanent failure | Manual support/exception queue when material |
| Cancelled/expired | Event no longer valid before send | Suppress safely; do not send stale contradictory state |

## 5. Template and data policy

Templates use approved event-specific content with:

- PENA AMEEN sender identity;
- safe order/reference context;
- truthful current state and next action;
- authorized tracking/account/support links only;
- approved policy/support language;
- no provider secrets, raw payment data, full unnecessary address, unapproved delivery promise, or unsupported claim.

Template version, event type, rendered-data classification, channel, attempt, delivery outcome, and correlation ID are auditable. Template content/language/approval ownership remain client/content/legal decisions.

## 6. Retry, idempotency, and failure handling

- Notification idempotency key combines domain event, recipient/channel, template version, and intent purpose.
- Replayed payment/shipping webhooks cannot create duplicate customer confirmations by default.
- Retry transient delivery failures through worker policy; do not retry invalid/opted-out destinations blindly.
- Before retry, confirm that the domain event is still relevant and not superseded by a correction/cancellation.
- Provider/channel outage creates operational alerts and customer-safe state remains available through account/tracking/support.
- Delivery failure does not roll back order/payment/shipment state.

## 7. Preferences, consent, and privacy

Transactional versus marketing classification, opt-in/out behavior, legal basis, contact source, preferred language, channel ordering, retention, and customer profile fields are not confirmed. The system must keep preference/consent data separate from business state, honor approved choices, and minimize message data. Marketing automation, abandoned-cart campaigns, promotional broadcasts, and behavioral profiling are not part of this architecture.

## 8. Audit and observability

Observe queue depth, send latency, retry rate, permanent failure rate, stale/suppressed message rate, provider health, duplicate suppression, event-to-delivery correlation, and staff exception queue. Logs redact message body/contact values by default; authorized support access is policy-limited.

## 9. Dependencies

Notification implementation remains blocked by channel selection, sender/account ownership, consent/legal policy, customer contact-data rules, templates/language, support SOP, provider availability, account/guest lookup security, and analytics/privacy governance.

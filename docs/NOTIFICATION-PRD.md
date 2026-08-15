# PENA AMEEN Notification Product Requirements

**Phase:** 1 — Product Discovery
**Status:** Provider-agnostic transactional-notification requirements. No delivery provider, template engine, sender identity, WhatsApp/SMS account, opt-in mechanism, message copy, delivery timing, or marketing automation is selected.

## 1. Purpose

Notifications should make a customer’s commerce journey understandable and reduce avoidable support work. They must communicate verified state changes and clear next actions; they must not announce a payment, shipment, delivery, cancellation, or refund as complete before reliable evidence or approved staff action exists.

## 2. Requirements

| Requirement ID | Requirement | Priority | Status | Dependency |
|---|---|---|---|---|
| REQ-NTF-001 | Record and trigger appropriate transactional notifications for material order/payment/shipping state changes. | MUST HAVE | CONFIRMED product requirement | Order/payment/shipping event model, consent/contact data |
| REQ-NTF-002 | Provide a baseline customer channel for essential transaction communication. | MUST HAVE | PROPOSED; email is a candidate, not a selected provider/channel | Client channel, legal/consent, sender operations |
| REQ-NTF-003 | Notify customers of verified payment, order-processing, shipment/AWB/tracking, delivery, cancellation, and refund outcomes where approved. | MUST HAVE | CONFIRMED product requirement | Verified event state, support/SOP |
| REQ-NTF-004 | Explain payment pending, payment failure, expiration, and retry/recovery states without making unsupported promises. | MUST HAVE | CONFIRMED product requirement | Payment provider/status rules |
| REQ-NTF-005 | Support staff-facing operational alerts/queues for failures and exceptions where they need action. | SHOULD HAVE | PROPOSED | Roles, dashboard/SOP, event model |
| REQ-NTF-006 | Select customer channels (email, WhatsApp, SMS, in-app) and their consent/priority/fallback rules with PENA AMEEN before architecture. | CLIENT DECISION REQUIRED | BLOCKED | Client/legal/provider decisions |
| REQ-NTF-007 | Respect customer data, channel consent, notification preferences, security, and audit/retention requirements. | MUST HAVE | CONFIRMED constraint | Privacy/legal policy and customer data model |

## 3. Transactional event matrix

The table defines intended *business events*, not final templates or provider triggers.

| Event | Customer purpose | Customer priority | Candidate channels | Staff/operational action | State/evidence gate |
|---|---|---|---|---|---|
| Order created | Give an order reference and explain next step | MUST HAVE | Email candidate; other channels by decision | Order work queue | Valid order context exists; wording reflects payment state |
| Payment pending | Explain pending action/status and applicable next step | MUST HAVE | Email candidate; channel policy TBD | Monitor/exception if needed | Payment initiated/pending, not verified |
| Payment success | Confirm verified payment and fulfillment next step | MUST HAVE | Email candidate; channel policy TBD | Order becomes eligible per SOP | Trusted payment verification received |
| Payment failure | Explain failed attempt and approved recovery | MUST HAVE | Email candidate; channel policy TBD | Review only if exception | Provider/process failure is known |
| Payment expiration | Explain expiration and permitted next action | MUST HAVE if applicable | Email candidate; channel policy TBD | Order retention/expiry work | Approved expiry state/rule applies |
| Payment cancellation | Explain cancellation/recovery state | MUST HAVE if applicable | Email candidate; channel policy TBD | Order review where required | Valid cancellation state |
| Order processing | Set expectation that order is being handled | SHOULD HAVE | Email candidate; channel policy TBD | Operational work state | Approved order/fulfillment state |
| Shipment created | Explain shipment preparation/context where useful | SHOULD HAVE | Email candidate; channel policy TBD | Fulfillment workflow | Shipment record confirmed |
| AWB/resi generated | Give tracking context when a verified number exists | MUST HAVE | Email candidate; channel policy TBD | Verify tracking/label state | Valid AWB/resi is stored |
| Order shipped | Tell customer it has been dispatched | MUST HAVE | Email candidate; channel policy TBD | Dispatch recorded | Approved dispatch event, not merely label creation |
| Delivered | Close delivery loop or direct support | SHOULD HAVE | Email candidate; channel policy TBD | Exception/support follow-up | Trusted tracking/operations delivery evidence |
| Delivery exception | Direct customer to a safe support/tracking path | SHOULD HAVE | Email candidate; channel policy TBD | Exception queue | Trusted exception status/SOP trigger |
| Cancellation | Confirm approved cancellation and any next step | MUST HAVE if cancellation occurs | Email candidate; channel policy TBD | Order/payment/shipping reconciliation | Authorized cancellation state |
| Refund processing | Tell customer refund action is underway where policy allows | SHOULD HAVE | Email candidate; channel policy TBD | Finance/refund work | Approved refund process state |
| Refund completed | Confirm verified refund outcome | MUST HAVE if refund occurs | Email candidate; channel policy TBD | Reconciliation/support | Trusted refund completion evidence |
| Password/account recovery | Support account access if accounts are enabled | SHOULD HAVE if applicable | Approved secure channel | Security/support audit | Customer initiated, safe identity process |

No notification is required to use all channels. The event/channel matrix must be approved before launch.

## 4. Channel requirements

### 4.1 Email

**Status: MUST HAVE candidate / CLIENT DECISION REQUIRED for final adoption.**

Email is proposed as a baseline transactional channel because it can carry an order reference and durable details. The client must confirm sender identity, operational ownership, delivery provider, domain/authentication governance, template approval, language, consent/legal basis, and support handling. No provider is selected.

### 4.2 WhatsApp

**Status: CLIENT DECISION REQUIRED.**

WhatsApp may be valuable for customer communication, but it requires an approved business account, consent/opt-in and template/process policy, channel ownership, provider selection, delivery/failure handling, and support responsibility. It must not be assumed as a universal fallback.

### 4.3 SMS

**Status: OPTIONAL / CLIENT DECISION REQUIRED.**

SMS may provide a short-form critical notification fallback only if customer consent, costs, regional/legal rules, sender ownership, content limits, and provider are approved. It is not assumed for MVP.

### 4.4 In-app

**Status: OPTIONAL / CLIENT DECISION REQUIRED.**

In-app notifications require a customer account/session model and do not replace a durable external transaction channel. They are not a launch requirement unless client-approved.

## 5. Notification content requirements

A transaction message should contain only information appropriate to its verified state and recipient. Candidate content includes:

- PENA AMEEN-approved sender identity;
- order reference, without unnecessary personal/financial data;
- plain-language status and timestamp/context where reliable;
- selected next action (pay, track, contact support, review policy) where applicable;
- relevant order/tracking link only through an approved secure access model;
- approved support contact route;
- policy-required legal/consent information.

Messages must not include payment credentials, secrets, full card/bank data, unrestricted personal data, unapproved delivery promises, unverified tracking status, unsupported product claims, or misleading urgency.

## 6. Reliability and state controls

### Required product behavior

- A notification should correspond to a meaningful business event/state, not merely a front-end click.
- A pending state must remain pending until verified by trusted evidence.
- Repeated/delayed/out-of-order events must not cause contradictory or duplicate customer communication where avoidable.
- Delivery failure of a notification must not silently change the order/payment/shipping state.
- Staff must have an approved way to identify material notification failure or support follow-up, subject to final operations design.
- The customer must have a support path if a message link is invalid, expired, or inaccessible.

### Failure/recovery states

| State | Required handling |
|---|---|
| Contact destination missing/invalid | Do not claim notice sent; staff/customer flow follows approved data-correction/support process. |
| Channel unavailable/provider failure | Record delivery uncertainty; retry/fallback only according to approved policy; do not duplicate harmful messages. |
| Notification delayed | Do not send stale/contradictory wording without state check; customer sees current order/tracking state where available. |
| Duplicate event | Avoid repeated confirmation where feasible; maintain audit context. |
| Event later reversed/corrected | Send only an approved correction/recovery communication and ensure staff review where needed. |
| Link/lookup access fails | Show safe retry/sign-in/order-support path without data disclosure. |
| Customer opted out of a nonessential channel | Respect preference; essential transactional/legal communication policy must be client/legal approved. |

## 7. Customer data, consent, and security

Notification design depends on:

- privacy policy and lawful/contact consent basis;
- transactional versus marketing classification;
- channel-specific opt-in/opt-out behavior;
- contact-data source and validation;
- language/market strategy;
- message retention/audit requirements;
- sender identity and support ownership;
- link/token security and order-lookup privacy.

These are not currently verified. Marketing newsletters, campaigns, abandoned-cart messaging, and promotional broadcasts are out of scope for this transactional-notification PRD unless approved later.

## 8. Implementation boundary

This document does not choose notification providers, queueing/retry technology, webhooks, templates, sender domains/numbers, analytics, or in-app infrastructure. It defines the business events, customer expectations, and decision gates that later architecture must satisfy.

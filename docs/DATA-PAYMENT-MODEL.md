# PENA AMEEN Payment Data Model

**Phase:** 4 — Data Architecture

**Status:** Provider-neutral logical model. Payment provider, methods, account ownership, status mapping, webhook format, currency, settlement, and refund policy remain `UNKNOWN` or `CLIENT DECISION REQUIRED`.

## 1. Data model principle

Payment data preserves an internal, auditable representation of intent, provider evidence, normalized state, refund, and settlement/reconciliation. It never stores unnecessary payment credentials or makes a browser redirect authoritative proof of payment.

## 2. Core entities

| Entity | Purpose | Required logical fields | Optional/conditional fields | Immutable/audit rules | Retention/migration sensitivity |
|---|---|---|---|---|---|
| Payment | Provider-neutral financial aggregate for an Order | Internal payment reference, Order reference, amount, currency, normalized state, creation time | Method category, provider key, paid/refund balance, review flag | Initial reference/amount/context and state-event history preserved; manual actions audited | Finance/legal retention unknown; historical migration conditional |
| PaymentAttempt | One provider initiation/attempt context | Internal attempt reference, Payment reference, idempotency key, amount/currency snapshot, state, timestamps | Provider external reference, method, expiry, failure category, redirect/instruction metadata | Attempt identity/provider evidence immutable; state changes append/audit | Provider mapping/history unknown |
| PaymentEvent | Verified/quarantined provider event receipt | Attempt reference, provider event ID/hash, verification state, normalized event type, receipt time | Safe payload metadata, mismatch/failure reason, processing result | Raw evidence/receipt identity immutable; duplicate processing prevented | Raw payload minimization/security retention required |
| Refund | Authorized/verified refund amount/status | Payment reference, amount/currency, status, actor/source, request/completion times | Provider refund reference, reason, return link, partial/full indicator | Amount/reference/evidence/state history audited | Finance/legal retention; policy/provider support unknown |
| SettlementRecord | Provider/finance reconciliation evidence | Payment or batch reference, amount/currency, settlement state/date, source/evidence | Fees, report/import reference, reconciliation note | Imported/verified evidence immutable; reconciliation action audited | Settlement/report availability unknown |

## 3. Identifier model

| Identifier | Role | Constraint |
|---|---|---|
| Internal payment reference | Stable PENA AMEEN payment identity | Never reused; safe customer/staff reference policy required |
| Payment attempt reference | Stable internal attempt identity | One attempt belongs to one Payment; supports retries/reconciliation |
| Provider external payment reference | Adapter-supplied identifier | Stored only after provider decision; not trusted without verification |
| Provider event ID/hash | Idempotency/replay evidence | Unique per configured provider event contract where available |
| Refund reference | Stable internal and optional provider reference | Used for idempotent refund/reconciliation |
| Order reference | Links financial aggregate to historical order snapshot | Does not expose payment access by itself |
| Idempotency key | Prevents duplicate command/attempt/refund | Scoped, non-secret, expiry policy required |

## 4. Payment lifecycle data rules

```text
Order payment intent
→ Payment
→ PaymentAttempt(s)
→ PaymentEvent receipt(s)
→ normalized Payment state
→ Order state transition / Notification / Audit / Reconciliation
→ Refund(s) and SettlementRecord(s) when applicable
```

- One Payment may have multiple PaymentAttempts under approved retry/method policy.
- Payment events are append-only evidence, not mutable status fields.
- A normalized `paid` state requires verified provider/approved finance evidence.
- Failed, expired, cancelled, unmatched, delayed, and conflicting events preserve history and may enter `requires_review` rather than forcing a state.
- Refund amount records allow a future partial-refund model but do not authorize one.

## 5. Required data controls

| Control | Data requirement |
|---|---|
| Idempotency | Store command/attempt/refund keys with scope and processing outcome; duplicate event/request must not create duplicate payment/refund/order effect |
| Amount/currency validation | Persist expected order/attempt amount/currency snapshot and compare verified provider evidence under approved rules |
| Event evidence | Store minimal provider event identity, verification outcome, normalized type, receipt/processing time, correlation reference |
| Reconciliation | Record unmatched/mismatched/pending/settled/manual-review outcome without overwriting source evidence |
| Refund linkage | Link refund to Payment and optionally ReturnRequest; preserve amount/reference/status history |
| Audit | Record finance/staff/system actor, reason, transition, source/provider evidence, correlation |
| Data minimization | Exclude raw card/bank credentials, secrets, unnecessary provider payload fields, and browser token material |

## 6. Provider-neutral fields versus provider-specific data

**Provider-neutral:** internal references, order linkage, amount/currency, normalized state, timestamps, idempotency, verification outcome, audit/correlation, refund/settlement relationship.

**Provider-specific:** external references, event names, signatures, method codes, expiry semantics, settlement reports, failure codes, refund APIs, metadata. These belong in a controlled adapter/evidence context only after provider selection and must not dictate core Order/Payment schema names.

## 7. Unresolved decisions

- provider and account owner;
- supported payment methods, currency, fees, settlement, expiry, cancellation;
- payment amount/tax/discount interpretation;
- webhook event/signature/replay contract;
- refund eligibility, partial refund, return relationship, finance authority;
- settlement/reconciliation report format and retention;
- historical payment/refund migration;
- legal/finance retention and customer-visible reference policy.

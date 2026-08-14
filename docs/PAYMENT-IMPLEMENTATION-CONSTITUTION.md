# PENA AMEEN Payment Implementation Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory provider-neutral rules. Payment provider, methods, account, event contract, settlement, expiry, refund, and finance authority remain unknown/client-gated.

## 1. Required boundary

```text
Application service → Payment Port → Provider Adapter → approved provider
```

Core Order/Payment domain code must not import provider SDK types, status labels, credentials, or UI assumptions.

## 2. Mandatory rules

- Create internal Payment and PaymentAttempt intent with scoped idempotency before provider initiation.
- Store internal/reference amount/currency snapshot and reconcile provider evidence against approved rules.
- Treat browser return as pending context only; verified adapter event/status drives paid transition.
- Verify webhook signature, replay/timestamp/schema/account/reference before receipt processing.
- Persist deduplication event receipt; repeated/out-of-order events cannot duplicate payment, order, fulfillment, notification, or refund effect.
- Normalize provider status into approved core state; unknown/mismatch enters review/quarantine.
- Refund uses internal request/reference/idempotency/audit and provider-neutral amount/status model; partial refund is not enabled without policy.
- Settlement/reconciliation is distinct from checkout success and preserves finance evidence.
- Provider timeout/outage/mismatch keeps truthful pending/review/retry state and creates observable/manual-review path.
- Never store raw payment credentials, secrets, or unredacted provider payload unnecessarily.

## 3. Prohibited behavior

- Direct provider SDK in UI/component/domain/order repository.
- Provider-specific core status enum/name/method hardcode.
- Optimistic paid/refunded state.
- Retry that creates second charge/attempt without reconciliation/idempotency.
- Manual paid/refund override without approved authority, evidence, audit, and state path.

## 4. Implementation gate

No adapter code starts until provider/account/method/webhook/sandbox/refund/settlement/status mapping, finance authority, legal policy, and test/reconciliation plan are approved.

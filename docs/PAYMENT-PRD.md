# PENA AMEEN Payment Product Requirements

**Phase:** 1 — Product Discovery
**Status:** Provider-agnostic product requirements. No payment gateway/provider, payment method, settlement model, credential, integration mechanism, or provider-specific status mapping is selected.

## 1. Payment outcome

The platform must let an eligible customer initiate payment for a valid order and make the resulting order/payment state understandable to the customer and authorized staff.

```text
Validated checkout/order context
  → payment option selection
  → payment initiation
  → pending / verification
  → verified success OR failure / expiration / cancellation
  → order progression or recovery
  → refund handling when approved
```

A browser return or a customer assertion of payment must not by itself be treated as verified payment success.

## 2. Confirmed constraints

- Payment initiation, pending, success, failure, expiration, cancellation, refund, payment verification, webhook/event handling, and order/payment relationship are required conceptual capabilities.
- Current payment provider, payment methods, account owner, webhook/status mapping, settlement behavior, refund process, and current checkout behavior are UNKNOWN.
- Payment must remain provider-agnostic until PENA AMEEN confirms the launch provider and business/finance operations.
- Payment provider selection and provider-specific implementation are out of scope for Phase 1.

## 3. Payment requirements

| Requirement ID | Requirement | Priority | Status | Dependency |
|---|---|---|---|---|
| REQ-PAY-001 | The platform must support provider-agnostic payment initiation for a valid order and an approved payment method. | MUST HAVE | CONFIRMED product requirement | Provider/method decision, checkout/order context |
| REQ-PAY-002 | Customer and staff experiences must distinguish payment pending from payment verified/success. | MUST HAVE | CONFIRMED product requirement | Provider event/status semantics |
| REQ-PAY-003 | Verified payment success must progress the order through an approved operational state. | MUST HAVE | PROPOSED correctness requirement | Verification evidence, order workflow |
| REQ-PAY-004 | Payment failure, expiration, cancellation, and unverified return must have clear recovery states and must not falsely mark an order paid. | MUST HAVE | CONFIRMED product requirement | Provider behavior, order retention policy |
| REQ-PAY-005 | Authorized staff must be able to inspect payment status/evidence appropriate to their role and act according to approved operations. | MUST HAVE | PROPOSED operational requirement | Finance/order SOP, staff capabilities |
| REQ-PAY-006 | Payment events/webhooks must be recorded and handled safely enough to reconcile payment and order status. | MUST HAVE | CONFIRMED product requirement | Provider event contract, architecture |
| REQ-PAY-007 | Refunds must have explicit status and customer/staff communication paths when PENA AMEEN approves refund policy. | MUST HAVE | CONFIRMED product requirement; rules blocked | Refund policy/provider/SOP |
| REQ-PAY-008 | Provider, payment methods, account ownership, settlement, refund authority, and exact status mapping must be confirmed by PENA AMEEN before final architecture. | CLIENT DECISION REQUIRED | BLOCKED | Client finance, provider documentation, legal/SOP |
| REQ-PAY-009 | The system must guard against duplicate payment/order ambiguity and expose a safe manual-review path. | MUST HAVE | PROPOSED safety requirement | Architecture, provider semantics, SOP |

## 4. Customer experience

### 4.1 Payment initiation

Before payment begins, the customer must be able to review:

- the valid order summary, including product lines and selected shipping information;
- the amount currently payable, derived from approved pricing/shipping rules;
- the available PENA AMEEN-approved payment option(s);
- applicable approved policy/terms acknowledgment where legally required;
- what the next payment step is, without exposing provider-specific assumptions in product requirements.

When the customer initiates payment, the experience must create or associate a valid order/payment context according to the future architecture. The customer should receive a clear reference and a pending or next-step state, not an unconditional success message.

### 4.2 Customer-visible payment states

| State | Customer-facing requirement | Must not happen |
|---|---|---|
| Payment selection required | Explain that an approved method must be selected | Pretend no payment is needed when it is required. |
| Initiating | Prevent accidental repeated action where practical; show in-progress state | Confirm payment before evidence exists. |
| Pending | Show order/payment reference and safe next action/instructions if applicable | Label an order paid merely because initiation occurred. |
| Success / verified | Confirm verified payment and explain fulfillment/tracking next step | Hide order reference or next step. |
| Failed | Explain that payment was not completed; offer approved retry/method/support options | Charge/retry silently or claim payment success. |
| Expired | Explain expiry and valid next action according to approved policy | Invent an expiry duration or cancellation result. |
| Cancelled | Explain cancellation/return result and recovery path | Assume cart/order retention policy. |
| Verification delayed | Explain pending review/status and how customer will be informed | Treat the customer browser return as final proof. |
| Refund requested/processing/completed | Show only the approved, verified refund state and support path | Promise a refund amount/timing not supported by policy/data. |

The exact wording, payment instructions, and payment-option presentation must follow the chosen provider and approved legal/finance policy later.

## 5. Admin / finance and order-management experience

Authorized staff should be able to view the payment context needed to fulfill, support, and reconcile an order without gaining unnecessary access to sensitive data.

### Required conceptual capabilities

1. find an order by appropriate reference/search/filter;
2. see a clear order status separate from payment status;
3. see approved payment method/reference/evidence fields when available;
4. distinguish pending, verified, failed, expired, cancelled, refunded, and review-required records;
5. understand whether the order is eligible for the next approved fulfillment action;
6. see relevant event/status history or an operational audit context;
7. send/trigger an approved customer notification or support path when the state changes;
8. initiate/record/refuse refund actions only under future permission and finance policy;
9. route ambiguous, duplicate, unmatched, or delayed payment cases to manual review rather than force a state transition.

### Access and privacy

The final finance/staff capability model, transaction fields, retention, masking, audit detail, refund authority, and manual verification permission are **CLIENT DECISION REQUIRED** and architecture-sensitive. The platform must not expose payment credentials, raw secrets, or unrelated customer financial data to general staff.

## 6. Proposed payment state model

The current source-state mapping is UNKNOWN. These conceptual states are proposed to make the product requirements testable later.

| Payment state | Meaning | Typical order relationship | Customer visibility | Notes |
|---|---|---|---|---|
| Not required | Payment is not required under an explicitly approved order policy | Order may continue | Conditional | No such policy is assumed. |
| Not started | A payment-requiring order has no initiated payment | Awaiting payment selection/initiation | Conditional | Cart/order retention rules unknown. |
| Initiating | A payment request/attempt is being established | Awaiting provider response | Usually brief | Must protect against duplicate attempts. |
| Pending | Payment attempt exists but trusted final status is not yet received | Order awaiting payment/verification | Yes | May include off-site/provider completion. |
| Requires review | Status/evidence needs authorized operational review | Order held according to SOP | Usually generalized status only | Exact triggers unknown. |
| Verified / paid | Trusted evidence confirms approved successful payment | Order can enter processing/fulfillment if other gates pass | Yes | “Paid” mapping is provider/finance decision. |
| Failed | Provider/process reports unsuccessful payment | Order outcome/retention per policy | Yes | Do not automatically assume cancellation. |
| Expired | Payment window/instruction expired | Order outcome per policy | Yes | Time/window policy unknown. |
| Cancelled | Payment attempt/order payment state was cancelled validly | Order outcome per policy | Yes | Customer/provider initiated distinction may matter later. |
| Refund requested | Refund request is captured/under review | Order/refund support process continues | Conditional | Policy and authority unknown. |
| Refund processing | Refund action is underway | Order remains in approved refund state | Yes where appropriate | Provider settlement timing unknown. |
| Refunded | Refund completion is verified | Order reflects approved outcome | Yes | Partial/full/refund amount handling TBD. |
| Reversed / disputed | Provider/finance reports a reversal/dispute | Manual review | Conditional | Need client/provider rules before implementation. |

## 7. Order and payment relationship

### Product principles — PROPOSED

- An **order** represents the customer’s intended/accepted purchase context; a **payment** represents an attempt or verified financial state associated with that order.
- One order may have more than one payment attempt over time. Whether it may have multiple successful payments or split payments is UNKNOWN and must not be assumed.
- A payment state change must not silently overwrite order, fulfillment, shipment, or refund history.
- Fulfillment eligibility must be defined by approved payment/order policy rather than guessed from a generic “completed” status.
- Refund state must be traceable to the relevant order/payment context, but no accounting ledger design is specified in this PRD.

### Decisions required

- Which payment methods launch?
- Is payment required before fulfillment for every product/order type?
- Are there any manual, bank-transfer, cash-on-delivery, split-payment, installment, or offline payment flows?
- What makes an order expire, remain open, or cancel after a payment failure/expiration?
- Who may initiate/approve full or partial refunds, and how are refund outcomes communicated?
- What settlement/reconciliation reporting is needed?

## 8. Payment verification and event handling

### Required product behavior

The platform must conceptually receive and process trusted payment-status evidence from the selected provider/process and reconcile it with the corresponding order/payment context.

For each verified event/outcome, the future implementation must be able to:

- identify the intended order/payment context;
- validate that the event is authentic according to the future provider/security design;
- safely handle delayed, repeated, out-of-order, or conflicting events;
- record an audit-safe status history;
- apply only allowed state changes;
- trigger appropriate customer/staff notifications;
- route unmatchable or ambiguous events to authorized manual review;
- avoid duplicate customer confirmations, duplicate fulfillment, or duplicate refunds.

The exact webhook endpoint, signatures, event names, retry behavior, polling, reconciliation, and provider fallback are architecture/provider decisions, not specified here.

## 9. Failure and recovery requirements

| Failure / ambiguity | Required product response | Client/provider dependency |
|---|---|---|
| Customer leaves payment flow | Show pending/return state until verified; provide safe way to check status | Return/redirect behavior |
| Payment initiation fails | Do not create false paid state; preserve valid cart/order context per policy; retry/support path | Provider/SOP/order retention |
| Provider reports failure | Explain outcome, permit only approved retry/method change | Payment method/expiry policy |
| Payment expires | Explain state and permitted recovery | Expiry/cart/order policy |
| Customer cancels | Explain state/recovery without assuming order cancellation | Cancellation policy |
| Customer return says success but no trusted event | Keep pending/verification state | Event/verification timing |
| Event is duplicated/out of order | Do not duplicate order confirmation/fulfillment/refund effects | Future event/idempotency design |
| Amount/reference mismatch | Hold for authorized review; do not force paid | Reconciliation SOP |
| Refund fails/delays | Display conservative refund status and support route | Provider/refund SOP |
| Service outage | Preserve safe context, show retry/support; do not expose sensitive errors | Resilience/support policy |

## 10. Provider-agnostic boundary

This PRD deliberately does **not** choose or assume:

- payment gateway/provider, payment processor, bank, wallet, QR, card, transfer, COD, installment, or manual-payment method;
- payment fees, settlement timing, chargeback/dispute treatment, tax, currency conversion, or transaction limits;
- payment expiry duration, retry count, failure threshold, or cancellation policy;
- webhook/event protocol, dashboard, credentials, secret handling, or API pattern;
- refund eligibility, amount, partial refund, return linkage, or approval workflow;
- accounting, ERP, or financial-reporting implementation.

## 11. Architecture and launch dependencies

Final architecture and implementation remain blocked until PENA AMEEN provides the provider/method/finance decisions and operational evidence requested in `docs/COMMERCE-DATA-REQUEST.md`, including account ownership, approved payment methods, provider event documentation, refund process, settlement behavior, status mapping, and safe test access. Legal terms/privacy/refund policy and order/fulfillment SOP must also be approved.

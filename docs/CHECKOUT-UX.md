# PENA AMEEN Checkout UX Blueprint

**Phase:** 5 — Design System & UX Blueprint

**Status:** Provider-neutral, policy-gated checkout design governance. It does not decide guest/account policy, required fields, payment methods, shipping providers, tax, promotion, legal wording, or order expiry behavior.

## 1. Checkout objective

Checkout should help a customer submit a valid purchase intent with minimal uncertainty while preserving a truthful state at every step:

```text
Cart
→ customer information
→ delivery address
→ shipping quote and selection
→ payment selection/initiation
→ order review
→ pending or verified outcome
→ tracking/support
```

## 2. Guest and account checkout

| Path | UX model | Status |
|---|---|---|
| Guest checkout | Let an approved guest supply only information necessary for order, delivery, payment, and transactional communication | PROPOSED; `CDR-008` required |
| Signed-in checkout | Reuse approved account data and route to authorized order history/tracking | SHOULD HAVE if accounts enabled |
| Optional account creation | Offer only at approved moment and with clear value | CLIENT DECISION REQUIRED |
| Account-required checkout | Show requirement before committing form work if client explicitly chooses it | CLIENT DECISION REQUIRED; not assumed |
| Guest order lookup | Provide safe post-purchase tracking/access path | Required outcome; verification policy unresolved |

## 3. Information hierarchy

| Checkout area | User question | Required content/state | Primary action | Dependency |
|---|---|---|---|---|
| Customer information | Who is purchasing and how can PENA AMEEN communicate? | Approved contact/identity fields, privacy/policy link, field validation | Continue | Exact fields/consent policy unknown |
| Delivery address | Where/for whom is shipment needed? | Approved recipient/destination fields, validation, address state | Continue / calculate shipping | Address/coverage/guest policy unknown |
| Shipping | Which valid service/cost is selected? | Quote state, eligible method/service/cost, no-service/error path | Select/continue | Provider/origin/package/rate rules unknown |
| Payment | How will payment be initiated? | Approved method choices, current payable summary, safe pending explanation | Initiate payment | Provider/method/policy unknown |
| Order review | Is the purchase context correct? | Item snapshot, quantity, commercial summary, selected shipping/payment, approved policy acknowledgment | Place order / pay | Tax/discount/policy unknown |
| Outcome | What happened and what next? | Order reference, verified/pending/failure state, tracking/support path | Track/retry/support | Provider verification/notification policy |

## 4. Field and validation pattern

- Required/optional labels are determined by approved checkout policy, not generic ecommerce convention.
- Each field has a persistent label, contextual help where needed, clear expected format, and accessible validation message.
- Client validation improves correction but server/domain validation remains authoritative.
- Group fields by user mental model: customer, recipient/delivery, shipping, payment, review.
- Preserve safe inputs when validation fails, session resumes, or user returns to a prior step.
- Do not expose provider or internal validation details in customer errors.

## 5. Shipping and payment states

| State | UX response |
|---|---|
| Shipping not requested | Explain required destination/order context; do not display invented cost |
| Shipping validating/quoting | Show progress and preserve task context; no checkout completion with stale/unselected rate |
| Shipping options available | Show approved service/method/cost/context and selection state |
| No shipping service | Explain correction/support path; no silent default courier |
| Quote failed/expired | Explain retry/refresh/reselect; preserve safe address/cart context |
| Payment selection required | Present only approved methods; do not imply unavailable methods |
| Payment initiating | Prevent duplicate intent; show in-progress task state |
| Payment pending | Show truthful reference/next step; browser return is not success |
| Payment verified | Confirm verified state and fulfillment/tracking expectation |
| Payment failed/expired/cancelled | Explain actual state and allowed retry/edit/support action |
| Payment requires review | Use conservative pending/review wording and support path |

## 6. Error and recovery scenarios

| Scenario | UX requirement |
|---|---|
| Invalid/missing field | Associate error with field/group; retain safe data; explain correction |
| Address unavailable/invalid | Explain delivery issue and correction/support path without generic blame |
| Cart product/quantity changed | Return to accurate cart/review state; explain change before payment |
| Price/promotion changed | Refresh commercial summary and require customer review; do not charge unseen value |
| Duplicate submission | Disable repeat action while processing; resolve to existing authoritative order/attempt state |
| Payment return without verification | Remain pending/processing; explain how status is confirmed |
| Payment provider unavailable | Safe retry/support state; no false completed order |
| Session interruption | Restore only safe cart/form context under approved policy; revalidate before continuation |
| Network interruption | Show retry/recovery; avoid duplicate order/payment action |
| Policy unavailable | Do not fake legal acceptance or hide required policy; route to approved help/support |

## 7. Mobile checkout

- Present one dominant task and clear progress/context without requiring horizontal navigation.
- Keep order summary accessible without hiding field/action focus.
- Use touch-accessible controls and visible validation near relevant fields.
- Avoid overlays that obscure payment/shipping/policy/error content.
- Allow controlled return to cart/edit flow without losing safe entered data.
- Maintain access to support and required legal/policy context.

## 8. Accessibility requirements

- Semantic form grouping and labels; required/optional meaning communicated in text.
- Programmatic field error association and error summary/focus strategy on submission failure.
- No color-only required, valid, pending, failed, or success state.
- Keyboard access, visible focus, logical error order, screen-reader status announcements, and reduced-motion respect.
- Payment/shipping external handoff and return behavior must preserve accessible context after provider contract is known.

## 9. Non-decisions

This document does not define exact checkout field list, tax, fee, discount, coupon, currency, terms wording, consent, payment method, provider screen, shipping service, delivery promise, account requirement, retention, cancellation/refund, or return policy. These remain gated by the appropriate client, legal, finance, operations, provider, and data decisions.

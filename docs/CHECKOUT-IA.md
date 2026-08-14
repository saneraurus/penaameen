# PENA AMEEN Checkout Information Architecture

**Phase:** 2 — Information Architecture

**Status:** Provider-agnostic, non-visual checkout structure. It defines required information states and recovery paths; it does not select a payment/shipping provider, checkout UI, field schema, authentication method, tax rules, or order implementation.

## 1. Checkout route and state model

Checkout uses one non-indexable commerce route with clear logical states rather than a collection of duplicate public pages.

```text
Cart /cart/
  ↓
Checkout /checkout/
  ├── Customer information
  ├── Delivery address / recipient information
  ├── Shipping quote and selection
  ├── Payment selection/initiation
  ├── Order review
  └── Valid order outcome
        ├── pending payment
        ├── verified payment success
        ├── payment failure / expiry / cancellation
        └── recovery/support
  ↓
Order confirmation /order/confirmation/[secure-reference]/
  ↓
Tracking /tracking/ or authorized account order detail
```

The logical states may be presented in an approved flow later, but each must preserve the order context and avoid appearing as an indexable standalone route.

## 2. Checkout information groups

| Information group | Why it exists | Required information at concept level | Optional/conditional information | Status/dependency |
|---|---|---|---|---|
| Customer information | Associate order, payment, and notification with a purchaser | Contact/identity information genuinely needed for approved order/payment/notification | Account sign-in/creation; marketing consent; additional profile fields | Exact fields, legal basis, guest policy UNKNOWN |
| Recipient/delivery information | Determine where/for whom shipment is made | Delivery destination and recipient information genuinely needed for shipping | Saved address; delivery note; address nickname; alternate recipient relationship | Shipping coverage/address rule/policy UNKNOWN |
| Shipping selection | Obtain customer-approved fulfillment method/cost | Valid destination, eligible shipping option, selected method/cost | Insurance, pickup, delivery preference, free-shipping/promotion fields | Provider/origin/package/rate rules UNKNOWN |
| Payment selection | Initiate approved payment for valid order | Approved payment method and order amount/review | Stored method, installment, manual/COD flow | Provider/method/finance policy UNKNOWN |
| Order review | Let customer verify intended purchase | Products, quantities, price state, selected shipping/payment, approved policy acknowledgment where required | Coupon/promotion, gift note, account creation | Promotion/tax/legal/price policy UNKNOWN |
| Confirmation/recovery | Communicate actual current order/payment state | Order reference, truthful status, next action/support route | Account creation link or notification preferences | Verification/notification/access policy UNKNOWN |

No field is treated as universally required merely because it is common ecommerce practice. Final field rules need legal, payment, shipping, account, and operational input.

## 3. Checkout sequence and route relationships

| State | Entry condition | Main decision | Next valid path | Recovery path |
|---|---|---|---|---|
| Cart ready | Cart has one or more eligible lines | Proceed to checkout | Customer information | Edit cart; continue shopping |
| Customer information | Valid cart context | Supply/confirm approved purchaser contact | Delivery information or approved alternative flow | Correct field; return to cart; approved support |
| Delivery information | Shipment-required order context | Supply/confirm destination/recipient | Shipping quote/selection | Correct address; return to cart; support |
| Shipping selection | Valid quote/options returned | Choose eligible method | Payment/review | Refresh quote; correct destination; support |
| Payment/review | Valid customer/delivery/shipping/order summary | Choose payment and initiate | Pending/verified outcome | Edit earlier state; choose approved alternative; support |
| Pending payment | Payment initiated but not verified | Complete/wait/check payment status according to approved flow | Verified success or recovery | Return to safe status; support; retry only when permitted |
| Verified success | Trusted payment evidence received | Continue to order/fulfillment expectation | Order confirmation/tracking | Contact support for exception |
| Failed/expired/cancelled | Payment outcome is known | Retry/select approved alternative/return to cart as policy allows | New valid payment attempt or cart | Support; no false paid status |
| Shipping/order exception | Inventory/rate/shipping/order prerequisite changes | Correct/review valid state | Appropriate preceding state | Support/manual review per SOP |

## 4. Validation requirements

### Input/eligibility validation

- Validate only the approved information necessary for customer, recipient, destination, payment, shipping, and policy acknowledgement.
- Explain what needs correction in understandable, non-sensitive language.
- Preserve safe entered information when the customer corrects a field or returns to a previous checkout state.
- Revalidate products, quantities, price/promotion state, destination, shipping option, and payment/order context at the appropriate workflow points.
- Do not show a shipping option, payment method, discount, stock state, tax treatment, or delivery promise that has not been validated by the eventual business/provider rules.

### Required error states

| Error/state | Checkout behavior |
|---|---|
| Missing/invalid customer or delivery information | Identify correctable issue and preserve safe state. |
| No shipping option | Explain that no eligible service is available for current context; allow correction/support, never substitute an unapproved rate. |
| Shipping quote unavailable/expired | Refresh/retry/reselect; do not silently retain stale cost. |
| Product unavailable/quantity invalid | Explain change and return to valid cart state. |
| Price/promotion changed | Refresh summary and require customer review before initiation. |
| Payment initiation failure | Do not mark order paid; present approved retry/method/support path. |
| Customer returns from payment flow without verified result | Show pending/verification, not false success. |
| Payment failed/expired/cancelled | Clearly explain status/recovery as approved; do not assume order/cancel/cart policy. |
| Duplicate/repeated action risk | Preserve a safe pending/review state rather than duplicate an order/payment result. |
| Service interruption | Provide retry/support while keeping task state safe; do not expose internal details. |

## 5. Checkout, account, and guest boundaries

- Checkout must work with an approved guest/account policy; it must not assume account creation.
- Account sign-in may help reuse approved customer data but cannot block a permitted guest checkout path.
- Saved addresses/profile, history, account creation, and password recovery are separate account destinations; they are not checkout prerequisites unless PENA AMEEN explicitly approves such a policy.
- A customer can receive an order confirmation and tracking access without an assumed account migration.

## 6. Policy and support connections

Checkout needs contextual links to approved privacy, terms, shipping, return/refund, payment/cancellation, and contact/help information. These links must lead to actual approved policy content, not placeholder pages or invented operational rules.

## 7. Explicit exclusions

This IA does not introduce coupon/promotion logic, loyalty, account-required checkout, COD, manual payment, installments, recurring payment, multi-address checkout, pickup, gift orders, tax rules, insurance, delivery times, free shipping, or provider-specific screens. Each requires separate client/business/provider approval.

## 8. Open decisions

- Checkout field/consent/legal policy (`CDR-005`, `CDR-008`).
- Payment provider/method/status/refund/settlement behavior (`CDR-003`).
- Shipping provider/origin/package/rate/service/AWB/returns behavior (`CDR-004`).
- Catalog/inventory/variants/pricing/promotion rules (`CDR-002`, `CDR-012`, `CDR-013`).
- Notification and support channel behavior (`CDR-017`, `CDR-020`).

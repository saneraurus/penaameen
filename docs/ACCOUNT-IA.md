# PENA AMEEN Account and Order-Access Information Architecture

**Phase:** 2 — Information Architecture

**Status:** PROPOSED account/private-route model. It does not select authentication, account provider, identity-verification mechanism, customer migration, or data-retention implementation.

## 1. Account IA principle

An account is a conditional self-service layer, not a prerequisite assumption for PENA AMEEN commerce. The MVP outcome is that a customer can receive order confirmation and access authorized order/tracking support. Whether that occurs through an account, privacy-safe guest lookup, transaction link, support, or a combination remains a client decision.

## 2. Account route hierarchy

```text
Account /account/
├── Login /account/login/                 [conditional]
├── Register /account/register/           [conditional]
├── Password reset /account/password-reset/ [conditional]
├── Overview /account/
├── Orders /account/orders/
│   └── Order detail /account/orders/[order-reference]/
├── Profile /account/profile/
└── Addresses /account/addresses/         [optional]

Public post-purchase access
└── Tracking /tracking/
    └── Authorized result /tracking/[secure-reference]/
```

All account and tracking-result routes are non-indexable. Route placeholders describe a logical resource reference, not a decision to expose predictable IDs or a technical authorization design.

## 3. Route inventory and purpose

| Route | Audience | Purpose | Authentication boundary | Indexability | Scope status |
|---|---|---|---|---:|---|
| `/account/` | Eligible account customer | Account overview and navigation | Customer authentication if accounts enabled | No | SHOULD HAVE if accounts enabled |
| `/account/login/` | Existing account customer | Start approved account access | Unauthenticated entry | No | CLIENT DECISION REQUIRED |
| `/account/register/` | Prospective account customer | Optional approved account creation | Unauthenticated entry | No | CLIENT DECISION REQUIRED |
| `/account/password-reset/` | Existing account customer | Recover access safely | Unauthenticated controlled flow | No | SHOULD HAVE if applicable |
| `/account/orders/` | Authenticated account customer | View authorized eligible order history | Customer authentication | No | SHOULD HAVE if accounts enabled |
| `/account/orders/[order-reference]/` | Authenticated account customer | View authorized order/payment/shipment detail | Customer authentication and ownership | No | SHOULD HAVE if accounts enabled |
| `/account/profile/` | Authenticated account customer | Manage approved profile/contact data | Customer authentication | No | OPTIONAL |
| `/account/addresses/` | Authenticated account customer | Manage saved addresses if approved | Customer authentication | No | OPTIONAL |
| `/tracking/` | Customer, guest, support-seeking visitor | Start approved order/shipment lookup | Public entry; lookup verification policy required | No | MUST HAVE outcome |
| `/tracking/[secure-reference]/` | Authorized customer | View eligible status/tracking result | Approved lookup/account/notification authorization | No | MUST HAVE outcome |

## 4. Guest checkout and account creation

### Proposed checkout model

- A customer may complete checkout as a guest **if PENA AMEEN approves the proposed guest-checkout policy**.
- Account creation may be offered as an optional/approved convenience before, during, or after checkout; timing is not decided here.
- A guest purchaser must still receive a safe path to order/tracking information without requiring historical account migration.

### Decision boundary

`CDR-008` must resolve:

- whether guest checkout is permitted, required, or excluded;
- when/if account registration is available;
- customer data/consent fields and privacy basis;
- how a guest obtains authorized order/tracking access;
- whether guest orders can later associate with an account;
- whether legacy customer accounts and/or historical orders migrate.

## 5. Order detail and tracking boundaries

| Context | Canonical customer destination | Information purpose | Must not expose |
|---|---|---|---|
| Account order history | `/account/orders/` | Customer’s own eligible order list | Other customers’ orders or unapproved historical data |
| Account order detail | `/account/orders/[order-reference]/` | Products, order/payment/fulfillment/shipment context appropriate to owner | Provider secrets, unrelated financial data, other customer data |
| Guest tracking entry | `/tracking/` | Start an approved lookup or direct customer to support | Arbitrary order data based only on a guessable ID |
| Guest tracking result | `/tracking/[secure-reference]/` | Authorized current status/tracking information | Broader account history or unverified personal data |
| Order confirmation | `/order/confirmation/[secure-reference]/` | Immediate truthful result after checkout/payment step | A claim that payment/shipment is complete without verification |

Account history is not a substitute for tracking; tracking is not a substitute for an account or customer-data policy.

## 6. Account navigation behavior

| User state | Utility label/destination | Account IA behavior |
|---|---|---|
| Logged out, accounts enabled | Account → `/account/login/` | Offer approved sign-in and optional register/recovery paths; Tracking remains an independent approved service path. |
| Logged out, accounts not enabled | Track order → `/tracking/` | Do not create an empty account destination or force sign-in. |
| Logged in | Account → `/account/` | Overview links to eligible Orders, Profile, Addresses, and Tracking context. |
| Guest after checkout | Order outcome and approved notification/Tracking path | No false promise that account history exists. |
| Session/access failure | Account login/recovery or safe support route | Do not disclose protected record existence or content. |

## 7. Non-goals and exclusions

The account IA does not include loyalty, wishlist, saved cart, referrals, subscriptions, social profile, seller account, account-based community, mobile-app account experience, or marketing preference center by default. These remain out of scope or optional as defined in Phase 1.

## 8. Open dependencies

- Guest checkout/account policy and customer migration (`CDR-008`).
- Historical order migration and account history visibility (`CDR-009`).
- Privacy/terms/consent/retention policy (`CDR-005`).
- Notification channels and secure message/link behavior (`CDR-017`).
- Authentication, authorization, secure-reference, password-recovery, and identity-verification design are deferred to later architecture/security work.

# PENA AMEEN Customer Account Product Requirements

**Phase:** 1 — Product Discovery
**Status:** Evaluation of customer identity and self-service needs. No authentication system, account provider, credential policy, customer-data migration, or final guest-checkout policy is selected.

## 1. Product principle

A customer should be able to complete the approved commerce journey and receive the information needed to manage an order. An account may improve repeat-purchase/self-service convenience, but an account requirement must not be assumed simply because an ecommerce platform can offer one.

Current source behavior for account creation, login, guest checkout, order history, order-detail access, tracking, saved addresses, password reset, and customer migration is UNKNOWN.

## 2. Requirements and evaluation

| Requirement ID | Capability | Scope classification | Status | Rationale / dependency |
|---|---|---|---|---|
| REQ-ACC-001 | Document and approve whether guest checkout is allowed, required, or excluded. | CLIENT DECISION REQUIRED | BLOCKED | Current checkout behavior and business/privacy policy unknown. Proposal: allow guest checkout to reduce friction, subject to client approval. |
| REQ-ACC-002 | Account creation and login for customers who choose/need an account. | SHOULD HAVE | PROPOSED | Useful for repeat self-service; registration timing and required data unknown. |
| REQ-ACC-003 | Order confirmation and tracking access independent of an assumed historical account migration. | MUST HAVE | CONFIRMED commerce outcome | Can be via approved account or privacy-safe order lookup; final policy required. |
| REQ-ACC-004 | Customer account order history and order detail for authorized account holders. | SHOULD HAVE | PROPOSED | Depends on account policy and historical-order decision. |
| REQ-ACC-005 | Saved addresses and profile management for account holders. | OPTIONAL | PROPOSED | Convenience feature; privacy/data-retention implications. |
| REQ-ACC-006 | Password reset/account recovery if password-based accounts are enabled. | SHOULD HAVE if applicable | PROPOSED | Must not assume authentication method. |
| REQ-ACC-007 | Transactional email/notification linkage to order/account status. | MUST HAVE for commerce events | CONFIRMED product requirement | Channel/provider and consent policy unknown. |
| REQ-ACC-008 | Migrate legacy customer accounts or profiles. | CLIENT DECISION REQUIRED | BLOCKED | `CUST-001`; privacy/legal/export/identity implications. |
| REQ-ACC-009 | Migrate historical orders into customer-facing history. | CLIENT DECISION REQUIRED | BLOCKED | `ORD-001`; accounting/privacy and source-data implications. |
| REQ-ACC-010 | Use customer data only under approved privacy, consent, access, retention, and support policy. | MUST HAVE | CONFIRMED constraint | Privacy policy and consent records unavailable. |

## 3. Customer account audience and outcomes

| User state | Goal | Primary task | Success criterion |
|---|---|---|---|
| Guest visitor | Buy without unnecessary identity friction if policy permits | Check out and receive order/payment/shipment communication | Order can be completed and later supported/tracked safely |
| Registered customer | Reuse account information and self-serve | Sign in, view eligible orders/tracking, manage approved profile data | Can access only their own permitted data |
| Returning customer without account | Find a recent order/shipment safely | Use approved order lookup/support route | Can obtain status without exposing another customer’s data |
| Customer who lost access | Recover account only if account system is enabled | Reset/recover identity | Safe recovery without disclosure or lockout confusion |
| Customer with a support issue | Understand next step after payment/shipping/order exception | View status/contact support | Receives accurate state, not an unsupported promise |

## 4. Proposed account experience

### 4.1 Account creation and login — SHOULD HAVE if approved

If customer accounts are enabled, the platform should provide a clear entry path to create an account or sign in. It should state why an account is useful and should not misrepresent account creation as mandatory if guest checkout is approved.

Open policy decisions include:

- whether account creation occurs before checkout, during checkout, after purchase, or only on request;
- required customer fields and verification method;
- password versus alternate identity mechanism;
- account activation, lockout, recovery, and support policies;
- whether social/third-party sign-in is allowed (not assumed);
- whether customer identity is market/language-specific;
- fraud/abuse controls and consent wording.

### 4.2 Guest checkout — client decision required

**Proposed direction:** Allow a guest customer to complete a purchase with the information genuinely needed for order, shipping, payment, and transactional notification, and offer account creation only as an optional/approved convenience.

**Why this is proposed:** It supports the objective to simplify checkout and avoids making historical account migration a prerequisite for the commerce loop.

**What is not decided:** whether the client requires account creation, what data is mandatory, whether a guest can later claim an order, whether a customer can convert a guest order to an account, and which privacy/consent language applies.

### 4.3 Account overview — SHOULD HAVE if accounts are enabled

An authenticated customer should have a simple account overview that routes to:

- order history / eligible order detail;
- current tracking;
- profile/contact information;
- saved addresses if approved;
- account recovery/security assistance;
- approved notification preferences if policy permits.

No loyalty balance, wishlist, subscription, referral, social profile, or marketplace identity is assumed.

### 4.4 Order history/detail — SHOULD HAVE if accounts are enabled

A customer account should show only orders authorized for that customer identity and only the necessary order/payment/fulfillment/tracking details. A customer’s order detail must distinguish payment, order, shipment, and delivery state in plain language.

Historical order display is not guaranteed: it depends on `ORD-001`, data quality, privacy/legal review, and a documented migration decision.

### 4.5 Tracking / order lookup — MUST HAVE outcome

Customers must have an approved way to access tracking/order support after purchase. The final experience may be:

- authenticated account order detail;
- privacy-safe non-authenticated order lookup;
- a transaction link delivered through an approved notification channel;
- approved customer support assistance;
- a combination of the above.

**CLIENT DECISION REQUIRED:** Which lookup factors are permitted, how identity is verified, what shipment/order detail is exposed, expiration/retention, and how a guest is protected from unauthorized disclosure.

### 4.6 Saved addresses/profile — OPTIONAL

If enabled, a customer may maintain approved profile and address data. The product requirements must later define:

- which fields are editable;
- whether addresses can be deleted/archived when tied to historical orders;
- default-address behavior;
- address validation and destination coverage interaction;
- consent/preferences fields;
- export/deletion/retention rights and support handling.

No field, address limit, default behavior, or retention period is invented here.

### 4.7 Password reset / recovery — SHOULD HAVE if applicable

Where account access uses a recoverable password/credential, the product must provide:

- a safe request path;
- a confirmation that does not reveal whether an arbitrary identity exists where security policy requires protection;
- an expiring or otherwise safe recovery action according to future security design;
- success/failure/expired state and support route;
- notification of relevant account-security activity according to policy.

The actual credential/recovery system is not chosen.

## 5. Account and checkout states

| State | Customer-facing behavior | Staff/support behavior |
|---|---|---|
| Guest checkout allowed | Customer can continue without account after approved data/policy input | Support can use approved order lookup/context |
| Account optional | Customer can sign in/create account or continue as permitted | No pressure to duplicate customer records without policy |
| Account required | Clearly explain requirement before data-entry commitment | Only if client explicitly approves it |
| Registration unavailable | Explain account is not available/needed and provide commerce path | Do not block valid approved checkout unnecessarily |
| Sign-in failed | Clear retry/recovery, no excessive detail | Support follows identity policy |
| Session expired | Preserve safe non-sensitive context, request sign-in as needed | No protected data leakage |
| Password reset requested | Clear generic confirmation and next step | Audit/support as approved |
| Password reset invalid/expired | Clear recovery/retry/support path | No unsafe bypass |
| No orders / no historical history | Honest empty state; explain whether only new orders are shown where approved | Support can clarify migrated-history policy |
| Order not authorized | Do not disclose record; offer safe support/recovery | Follow identity verification policy |
| Profile/address update invalid | Field-level correction and preserve safe inputs | No hidden overwrites |

## 6. Data, privacy, and migration requirements

### Customer data principles

- Collect and expose only the personal data needed for approved commerce, shipping, payment notification, account, and support purposes.
- Do not migrate or expose legacy customer data without a client decision, privacy/legal review, source-data validation, and secure migration plan.
- Do not store or migrate passwords in plain text; credential migration needs a safe approach decided in later architecture.
- Keep staff access to customer/order/contact data least-privileged and purpose-limited.
- Treat consent, newsletter subscriptions, marketing preferences, retention, deletion/export requests, and contact channel policy as client/legal decisions.

### Known dependencies

| Dependency | Status |
|---|---|
| Existing customer accounts / customer fields / consent | UNKNOWN |
| Customer account migration | CLIENT DECISION REQUIRED |
| Historical order migration | CLIENT DECISION REQUIRED |
| Privacy policy | UNKNOWN / required before launch where customer data is processed |
| Terms and shipping/return/refund policy | UNKNOWN / required for checkout/support |
| Notification channels/consent | UNKNOWN |
| Account authentication/recovery mechanism | UNKNOWN |
| Guest-order lookup policy | CLIENT DECISION REQUIRED |

## 7. Exclusions and deferrals

The MVP does not assume:

- social login;
- loyalty points/tier/status;
- wishlists or saved carts;
- subscriptions/recurring orders;
- referrals/affiliate accounts;
- a community/social network profile;
- seller/vendor accounts;
- advanced preference center or marketing automation;
- mobile application account experience.

These remain out of scope or optional unless separately approved.

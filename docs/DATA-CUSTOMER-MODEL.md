# PENA AMEEN Customer Data Model

**Phase:** 4 — Data Architecture

**Status:** PROPOSED privacy-sensitive customer/guest model. Customer account migration, historical order visibility, guest lookup, consent, identity provider, retention, and legal policy remain `CLIENT DECISION REQUIRED` or `UNKNOWN`.

## 1. Customer states supported

| Customer context | Data representation | Access boundary | Status |
|---|---|---|---|
| Public visitor | No customer record required | Public content/catalog only | CONFIRMED |
| Guest shopper | Cart/session plus checkout order/contact snapshots as approved | May access only approved current cart/order/tracking context | CLIENT DECISION REQUIRED |
| Registered customer | Customer, session, address, consent, preferences, eligible order links | Own records only | SHOULD HAVE if approved |
| Migrated customer | Source-to-target Customer mapping/provenance | Only if legal/client migration decision approves | CLIENT DECISION REQUIRED |
| Support-assisted customer | Authorized staff access to minimal relevant customer/order context | Staff capability/purpose/audit required | PROPOSED |

## 2. Core entities and data sensitivity

| Entity | Purpose | Sensitive data categories | Required logical data | Key relationships | Retention/deletion boundary |
|---|---|---|---|---|---|
| Customer | Account/profile identity | Name, email, phone, consent, identity reference | Target ID, approved contact/identity fields, status, timestamps | Address, Session, Consent, Preference, Order | Legal retention/deletion/export policy unknown |
| CustomerAddress | Reusable account address | Recipient, phone, full address/location | Customer reference, structured approved address, role/status | Customer; optional source of OrderAddress snapshot | Archive/anonymize not hard delete if historical order reference exists |
| CustomerSession | Server-managed customer/guest access context | Session identifier/security metadata | Session scope, customer/guest association, issuance/expiry/revocation state | Customer optional; Cart; auth context | Security/session policy determines expiry/revocation/deletion |
| CustomerConsent | Evidence of consent/preference/legal basis | Consent source, time, customer/guest association | Consent type/state/source/timestamp | Customer optional; NotificationPreference | Retention/legal policy unknown; history should be preserved |
| NotificationPreference | Channel-specific approved preference | Contact/channel/opt state | Customer/guest association, channel, preference state, evidence | Customer/Consent/Notification | Retention/marketing-vs-transaction policy unknown |
| OrderAddress | Historical customer/recipient snapshot | Name, phone, address | Order reference, role, snapshot fields | Order; optional source CustomerAddress | Retained/anonymized with Order under legal policy |
| Order/OrderItem | Historical purchase context | Contact/order/shipping/payment references | Order snapshot data | Customer optional | Historical-order migration/retention decision required |

## 3. Guest checkout model

### Proposed data boundary

A guest Cart/CustomerSession can create an Order with the minimal approved purchaser/delivery/contact snapshots needed for checkout, payment, shipping, and transactional communication. A guest order does not automatically create a permanent registered Customer account.

### Required decisions

- Whether guest checkout is allowed, required, or excluded.
- Which identity/contact/address fields are required.
- Whether/when a guest can create or claim an account.
- Safe order/tracking lookup proof factors and expiry.
- Whether guest contact data creates a Customer record or stays order-scoped.
- Consent, notification, marketing, retention, deletion/export, and support policy.

No guest identity, contact, lookup token, or access mechanism is implemented or invented here.

## 4. Registered account model

If enabled, a Customer can have customer-scoped session(s), profile/contact data, address records, consent/preferences, and links to authorized orders. Account route behavior follows `docs/ACCOUNT-IA.md`; private routes and public tracking lookups are separate data/access models.

Customer profile/address edits do not rewrite OrderAddress or OrderItem historical snapshots.

## 5. Customer and historical-order migration

| Migration scope | Status | Required input/validation |
|---|---|---|
| Customer profile migration | CLIENT DECISION REQUIRED | Source identity/contact/consent, legal basis, duplicate resolution, secure import validation |
| Customer address migration | CLIENT DECISION REQUIRED | Source address fields, relationship keys, privacy/retention decision |
| Account credential migration | UNKNOWN / high risk | Do not import plaintext passwords; safe identity/reset strategy required |
| Historical order migration | CLIENT DECISION REQUIRED | Order/item/address/payment/shipment/refund snapshots, finance/legal reconciliation |
| Customer-visible history | CLIENT DECISION REQUIRED | Authorization, migration coverage, customer communications, support policy |
| Marketing subscription migration | CLIENT DECISION REQUIRED | Consent source/evidence, channel policy, legal review |

## 6. Privacy and access principles

- Collect the minimum approved data necessary for order, delivery, payment communication, account, and support.
- Customer/order/tracking routes require ownership or approved lookup verification; a guessable reference alone is insufficient.
- Staff see only data needed for authorized support/operations, with audit context for sensitive access/actions.
- Customer contact/address/session/consent data is excluded from public search, public analytics, SEO, and logs by default.
- Retention, deletion, export, correction, breach response, and lawful basis require client/legal review and must not be claimed as compliant by this architecture.

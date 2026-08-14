# PENA AMEEN Data Access Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory future data-access rules. No ORM, database, schema, query, migration, or connection is implemented.

## 1. Repository and query ownership

- Repositories encapsulate persistence/query implementation for one aggregate or approved read model.
- Application services choose transaction boundary and invoke repositories; presentation/delivery code never accesses persistence directly.
- Read models may optimize authorized route/admin/search views but cannot mutate source-of-truth records.
- Queries return only fields needed by caller and enforce publication/ownership/capability constraints through service layer.
- Repository contracts must not expose raw provider payloads or unbounded database model shapes.

## 2. Transaction boundaries

| Workflow | Required atomic boundary |
|---|---|
| Cart mutation | Cart line/version plus authoritative summary/required audit context |
| Checkout/order creation | Order snapshot, OrderItems/Addresses, approved reservation decision, PaymentAttempt intent, audit/outbox |
| Inventory operation | Item position/movement/reservation/allocation plus audit/idempotency |
| Payment/shipment event | Normalized state transition, audit, outbox, idempotency receipt/result |
| Content/SEO publication | Published state/route metadata/redirect impact/audit/outbox |
| Staff access/sensitive command | Authorized change plus audit and session/access consequence |

External provider calls occur after durable intent/state transaction and reconcile through idempotent follow-up.

## 3. Read/write separation and snapshots

- Current Product/Category/Customer data is mutable through its owner.
- OrderItem, OrderAddress, payment/shipment/inventory event, audit, consent, and source mapping snapshots are immutable/append-only or versioned.
- A query for historical order must use order snapshot, not current product price/name/media as authority.
- A query for cart/checkout must revalidate current product/price/availability according to approved policy.

## 4. Concurrency and locking

- Use physical database concurrency mechanisms selected in later implementation to prevent duplicate inventory reservation/order/payment/shipment effects.
- Inventory available/reserved/allocated updates require conditional/locked/versioned transaction strategy.
- Idempotency records scope replay prevention for commands/events; do not use UI disable state as concurrency protection.
- Long provider/network requests never hold locks/transactions.
- Conflict response returns safe authoritative state/review path rather than blind retry.

## 5. Validation and audit

- Validate data at ingress and again at domain/service boundary before persistence.
- Enforce uniqueness, references, lifecycle, source provenance, and approved publication/indexability rules described in Data Integrity/Validation strategy.
- Sensitive reads/writes produce audit context as required; logs avoid raw PII/secrets.
- Soft delete/archive/merge/redirect/revoke policy follows data retention and migration rules; no casual cascade delete.

## 6. Prohibited data access

- UI/components/API transport code directly using ORM/database driver.
- Repository bypass of service authorization/state machine/idempotency.
- Direct update of historical snapshots/audit/event evidence.
- Raw dynamic query/filter/sort expressions from user input.
- Storing secrets/raw payment credentials/provider payloads in ordinary domain data.
- Source-data import/migration run against production without staged validation/approval.

# PENA AMEEN Data Integrity Rules

**Phase:** 4 — Data Architecture

**Status:** PROPOSED conceptual integrity rules. These are not SQL constraints, ORM annotations, migrations, or application code. Physical enforcement is deferred to subsequent approved phases.

## 1. Identifier rules

- Every target logical entity has a stable internal identifier.
- Source identifiers are retained separately when migration applies; source ID is not assumed globally unique across entity types.
- Public slugs/URLs are unique within their approved route scope and lifecycle policy.
- SKU identity is unique across the approved sellable-unit scope and is never silently reused after transaction history exists.
- Provider references are scoped by provider/account/environment and never treated as global target identifiers without normalization.
- Human-readable order/payment/shipment references do not by themselves grant private access.

## 2. Uniqueness rules

| Data area | Conceptual uniqueness rule |
|---|---|
| Product | One active public product slug per canonical product route; source ID unique within source system |
| Category/Tag | Name/slug uniqueness within taxonomy scope and approved public route policy |
| SKU | One normalized active SKU per sellable subject unless explicit approved policy allows otherwise |
| Cart | One active cart per approved session/customer context policy, not a global customer assumption |
| Order | One internal order reference; source order ID unique within migration source |
| PaymentAttempt/Event | Provider event/reference uniqueness scoped to configured provider/account; internal idempotency scope unique |
| Shipment/AWB | Shipment internal reference unique; AWB uniqueness policy provider-dependent but duplicate conflict detected |
| Redirect | One active normalized legacy source URL treatment; no loops/self-target/unapproved chains |
| Media | Source ID or approved checksum/path matching avoids duplicate asset import; usage role/order unique per target policy |
| Audit/Outbox/Job | Immutable record ID and correlation/idempotency scope avoid duplicate side effects |

## 3. Referential integrity rules

- Association records cannot reference nonexistent, archived-incompatible, or wrong-scope entities.
- An active CartItem references a currently eligible sellable subject; an OrderItem may retain a snapshot even when current product is retired.
- A ShipmentItem references a valid OrderItem; a TrackingEvent references a valid Shipment.
- PaymentAttempt/Event/Refund/Settlement records reference their valid Payment/Order context.
- MediaUsage references approved asset and allowed target type; private media cannot be exposed by public usage unintentionally.
- SEO metadata, canonical, redirect, and sitemap records reference valid route/entity states.
- Role assignments reference active/approved StaffUser/Role/Permission semantics; audit records preserve history when current principals are inactive.

## 4. Immutable historical records

The following are immutable or append-only in logical intent:

- OrderItem purchase snapshot, OrderAddress snapshot, OrderStatusHistory;
- PaymentAttempt reference/evidence and PaymentEvent receipt;
- Refund/Settlement evidence and state history;
- Shipment/Tracking event evidence and label generation/print history;
- InventoryMovement and reservation/allocation transition history;
- AuditLog, OutboxEvent, JobAttempt;
- source/migration mapping provenance, redirect test/audit history;
- consent/preference evidence history.

Corrections are represented by a new approved adjustment, version, reversal, state transition, note, or audit record. They are not silent overwrites.

## 5. Timestamps and provenance

- Capture creation, update, publication/effective, source/import, verification, and transition timestamps where applicable.
- Store safe actor/source/correlation provenance for sensitive and provider-driven transitions.
- Distinguish source event time from target receipt/processing time.
- Preserve timezone/original source representation according to future import policy; do not infer dates from snippets.

## 6. Soft deletion and archival

- Prefer archive/retire/merge/redirect/revoke over hard deletion for records with order, SEO, audit, media-rights, finance, or legal history.
- Hard deletion requires an approved retention/legal/security policy and reference-impact validation.
- Public route retirement must coordinate content lifecycle, SEO Metadata, Redirect, CanonicalReference, SitemapEntry, SearchDocument, media usage, and internal links.
- Customer data lifecycle may require anonymization/pseudonymization rather than simple deletion; policy is unknown.

## 7. Idempotency and concurrency

- Command and provider-event boundaries use scoped IdempotencyKey records.
- Order creation, payment initiation/refund, shipment creation/cancellation, inventory reservation/release/allocation, notification delivery, and worker jobs must be replay-safe.
- Inventory availability/reservation/allocation requires transactional concurrency control in later physical design.
- External calls occur outside long database transactions; record intent/state before calling and reconcile result/event idempotently.
- Duplicate/out-of-order webhook/tracking/notification events cannot produce duplicate financial, shipping, inventory, or customer-message effects.

## 8. Transactional and event consistency

- A domain state transition and required audit/outbox intent are committed atomically where the final datastore supports it.
- Worker jobs consume durable outbox events and update only through authorized/idempotent application services.
- Analytics/search/notification are downstream observers; their failure does not roll back authoritative committed order/payment/shipping state.
- Provider uncertainty creates review/reconciliation state, not guessed data.

## 9. Integrity exceptions

When integrity cannot be established, data is blocked, quarantined, unpublished, archived, or placed in manual review according to severity. Exceptions require a safe reason, owner, source/correlation, audit record, and later remediation; they do not justify bypassing the model.

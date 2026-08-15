# PENA AMEEN Data Lifecycle Model

**Phase:** 4 — Data Architecture

**Status:** Lifecycle blueprint. State names and transitions are `PROPOSED` unless directly confirmed by project controls. They are logical data lifecycles, not provider-specific status mappings, database enums, or implementation code.

## 1. Lifecycle principles

- Keep Product, Inventory, Order, Payment, Shipment, Tracking, Content, Media, and Authorization states separate.
- Preserve immutable historical evidence through state history/movement/event records.
- Use controlled transitions through domain services; do not permit arbitrary status editing.
- Represent provider-specific states through adapter normalization rather than leaking provider labels into core data.
- Use archive/merge/redirect/revocation where history, SEO, audit, finance, or legal sensitivity makes hard deletion unsafe.

## 2. Product lifecycle

| Proposed state | Meaning | Valid transition principles | Data consequences |
|---|---|---|---|
| `draft` | Product exists internally but is not public/purchasable | May move to active after approved catalog/media/price/inventory/SEO validation | Not indexed/searchable/public |
| `active` | Approved product can be public and eligible under inventory/commercial policy | May become archived/retired; commercial changes are audited | Eligible for public route/search/cart validation |
| `archived` | Product retained for history/migration but not normally marketed | May be restored only through approved workflow | Historic OrderItem references remain valid; SEO/redirect decision required |
| `retired` | Product intentionally no longer offered | May remain historical; route treatment is explicit | Cannot be newly added to cart; source URL cannot silently disappear |

Product publish status, inventory availability, and orderability are related but not identical.

## 3. Inventory lifecycle

| Proposed state | Meaning | Valid transition principles | Data consequences |
|---|---|---|---|
| `available` | On-hand approved stock can satisfy demand | May be reserved, adjusted, or allocated | Contributes to available stock calculation |
| `reserved` | Quantity held under approved cart/order/payment policy | Must commit, release, or expire under policy | Reduces available stock; timing unknown |
| `committed` | Quantity allocated to fulfillment/order | May move to released/corrected only through approved operation | Supports shipment allocation; no duplicate commit |
| `released` | Prior reservation/allocation no longer holds stock | May return to available or adjustment/reconciliation | Requires reason/source/audit |
| `adjusted` | Quantity changed by authorized movement/reconciliation | Creates new position/movement, not erase history | Mandatory reason/actor/source audit |

`available = on-hand - active reserved - allocated not finalized` is a **PROPOSED** conceptual equation. Backorders, negative inventory, preorder, branch inventory, and package component allocation are `UNKNOWN`.

## 4. Cart lifecycle

| Proposed state | Meaning |
|---|---|
| `active` | Current guest/customer purchase intent |
| `abandoned` | No longer active under approved expiry policy |
| `converted` | Linked to a created Order; cart is no longer the financial authority |
| `expired` | Retention/session policy ended current cart availability |

Cart lifecycle/expiry/reservation behavior is `CLIENT DECISION REQUIRED`.

## 5. Order lifecycle

The order workflow uses the Phase 3 state machine. The following are **PROPOSED** target states, not confirmed source-provider/business states.

| Proposed state | Meaning | Transition principle |
|---|---|---|
| `draft` | Checkout intent not yet committed as a valid order | Cannot be treated as paid/fulfilled |
| `pending_payment` / `awaiting_payment` | Valid order waits for payment/verification | May move through payment processing, paid, failure, cancellation according to approved policy |
| `payment_processing` | Provider/process in progress | No fulfillment/shipment progression without eligibility |
| `paid` | Verified payment evidence exists | May enter processing/fulfillment |
| `payment_failed` / `failed` | Verified payment failure/expiry/cancelled state | May retry only through approved new attempt/policy |
| `processing` | Order is operationally eligible/being prepared | May progress to packed/ready to ship |
| `packed` | Fulfillment packaging confirmed | May progress to ready to ship or corrective processing |
| `ready_to_ship` | Shipment-ready pre-dispatch state | May progress to shipped after approved dispatch evidence |
| `shipped` | Approved carrier handoff/dispatch exists | May move to in transit/delivered/exception/return workflow |
| `in_transit` | Trusted tracking movement exists | May move to delivered/exception/return workflow |
| `delivered` / `fulfilled` | Delivery/fulfillment outcome is trusted | May enter return workflow if policy permits |
| `cancelled` | Authorized cancellation occurred | No normal forward fulfillment progression |
| `return_requested` | Approved return request captured | Requires policy/inspection path |
| `returned` | Returned item/outcome confirmed | May link to refund/restock policy |
| `refunded` | Refund completion verified | Financial terminal state unless correction/dispute policy exists |
| `partially_refunded` | Partial refund representation if approved | Included only because refund amount can be less than order amount; policy is UNKNOWN |

`fulfilled`, `awaiting_payment`, and `failed` can be derived display/compatibility labels rather than distinct physical states. Final naming/status mapping is a Phase 4/operations/provider decision.

## 6. Payment lifecycle

| Proposed state | Meaning | Data rule |
|---|---|---|
| `initiated` | Payment attempt intent is created | Store idempotency and internal reference before provider call |
| `pending` | Provider/customer action/verification incomplete | Never equate with paid |
| `authorized` | Provider may indicate authorization if method supports it | Do not assume all providers/methods use it |
| `paid` | Verified provider/finance evidence matches approved payment context | Enables order transition through policy |
| `failed` | Verified failure | Preserve attempt evidence; no false success |
| `expired` | Verified payment expiry | Order/reservation effect requires policy |
| `cancelled` | Valid cancellation | Preserve source/reason/evidence |
| `refunded` | Verified full refund completion | Record amount/reference and order relationship |
| `partially_refunded` | Verified partial amount refund | Included as data capability; policy/provider support UNKNOWN |
| `requires_review` | Mismatch/delay/conflict/unmatched event | Manual review, no forced transition |

## 7. Shipping lifecycle

| Proposed state | Meaning | Data rule |
|---|---|---|
| `quoted` | Valid shipping option/rate context exists | Quote expiry/selection rules unknown |
| `created` | Shipment record/provider reference exists | Does not imply AWB, label, or dispatch |
| `awb_assigned` | Tracking/AWB/resi has been stored | Does not imply dispatch/delivery |
| `label_ready` | Provider/workflow returned usable label | Print/retrieve is separate action |
| `dispatched` | Approved carrier handoff event recorded | Can map to order shipped state |
| `in_transit` | Trusted carrier movement observed | Normalized provider event |
| `delivered` | Trusted delivery evidence observed | Delivery proof policy unknown |
| `cancelled` | Approved shipment cancellation | Reconcile order/inventory/payment policy |
| `exception` | Delivery/shipping issue requires action | Staff/customer support workflow |
| `returned` | Return shipment/outcome confirmed | Return/restock/refund policy unknown |

## 8. Content, SEO, media, and authorization lifecycle

| Entity area | Proposed lifecycle | Critical rule |
|---|---|---|
| Article/Page/Event/Gallery | draft → review → published → archived/redirected | Public route/SEO action must be explicit before retirement |
| Category/Tag | draft/review → published → merged/redirected/retired | Do not leave thin duplicate indexable archive |
| EducationHub/Relation | draft → published → retired | Hub/category/tag duplication needs SEO review |
| MediaAsset | pending → validating → approved → attached → archived/removed | Rights/usage validation before public delivery |
| SeoMetadata/Redirect | draft → validated → published/active → superseded/retired | Source URL/metadata ownership and audit required |
| CustomerConsent/Preference | active → revoked/expired | Evidence history retained under legal policy |
| StaffUser/Role/Permission | active → suspended/revoked/deprecated | Grant/revoke is audited; no self-escalation |
| Job/Outbox | pending → processing → succeeded/failed/manual review | Idempotent retry; source state not falsely changed |

## 9. Transition safeguards

- Every state transition has actor/source, timestamp, correlation reference, prior/new state, reason/evidence where applicable, and audit/outbox implications.
- Provider events may map to normalized state only after validation and idempotency checks.
- No transition rewrites immutable purchase/payment/shipment/audit evidence.
- Correction/reversal uses an explicit later transition or compensating record, not silent overwrite.
- The final state machine must be approved against payment/shipping provider, inventory, cancellation, refund, return, legal, and operations policies before implementation.

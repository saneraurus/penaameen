# PENA AMEEN UI State System

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED universal state taxonomy. State labels are semantic contracts between UX, data, and technical architecture; they are not final visual treatments, provider states, or implementation enums.

## 1. Universal state taxonomy

| State | Meaning | Required feedback behavior |
|---|---|---|
| DEFAULT | Normal available context | Clear label/value/action hierarchy |
| HOVER | Pointer exploration state | Never sole access path; focus/tap equivalent exists |
| FOCUS | Keyboard/assistive interaction target | Visible distinct focus treatment and semantic order |
| ACTIVE | Current pressed/selected/current route context | Does not replace authoritative completion state |
| DISABLED | Action/control unavailable | Explain reason when relevant; do not hide critical gap |
| LOADING | Data/action pending | Preserve task context; no fake result/progress |
| SUCCESS | Verified positive result | State text/reference/next action; not color-only |
| WARNING | Attention/review/expiring/non-blocking concern | Explain risk and next action |
| ERROR | Task/data/validation failure | Explain correction/retry/support path safely |
| EMPTY | No eligible records/items/results | Honest reason and recovery/discovery action |
| PARTIAL | Some data/action complete, some unresolved | State what succeeded/what requires review |
| UNAVAILABLE | Capability/data/provider/action not currently available | Do not imply user fault; give alternative/support path |
| EXPIRED | Validity window/session/quote/payment no longer valid | Explain refresh/retry/return policy only when approved |
| PROCESSING | Authoritative work in progress after valid initiation | Distinguish from success; provide safe status/next step |
| RETRY_REQUIRED | Recoverable action needs explicit retry/review | Preserve idempotency/context; avoid duplicate side effect |

## 2. Application by domain

| Domain | Essential states | Guardrail |
|---|---|---|
| Commerce/product | DEFAULT, LOADING, UNAVAILABLE, ERROR, SUCCESS, PARTIAL | Product card/detail cannot imply stock/price/variant state not supplied |
| Cart | DEFAULT, EMPTY, LOADING, WARNING, ERROR, RETRY_REQUIRED | Changed/unavailable item state requires review, not silent removal |
| Checkout | DEFAULT, LOADING, ERROR, WARNING, PROCESSING, RETRY_REQUIRED, EXPIRED | Payment/shipping/state remains provider/policy neutral |
| Payment | PROCESSING, PENDING-style INFO, SUCCESS only verified, ERROR, EXPIRED, RETRY_REQUIRED | Browser return does not activate SUCCESS |
| Shipping/tracking | LOADING, UNAVAILABLE, PROCESSING, SUCCESS/DELIVERED, WARNING/EXCEPTION, ERROR | AWB/label/tracking event must not be conflated |
| Account | SIGNED-OUT context, EMPTY, LOADING, ERROR, UNAVAILABLE, SUCCESS | Private ownership/access state is enforced server-side |
| Content/SEO | LOADING, EMPTY, UNAVAILABLE, ERROR, PUBLISHED context | Do not publish thin/unknown archive as normal default |
| Admin | DEFAULT, LOADING, EMPTY, WARNING, ERROR, PARTIAL, PROCESSING, RETRY_REQUIRED, restricted/access-denied context | Display normalized record state; no free status editing |
| Media | EMPTY, VALIDATING, PROCESSING, APPROVED/SUCCESS, ERROR, UNAVAILABLE | Unknown rights is not SUCCESS/publishable |
| Forms | DEFAULT, FOCUS, INVALID/ERROR, DISABLED, LOADING, SUCCESS, PARTIAL | Field feedback has text/semantic association |

## 3. State hierarchy rules

- **SUCCESS** requires authoritative verification for payment, order, shipment, delivery, refund, publish, save, and permission changes.
- **PROCESSING** and **LOADING** differ: loading fetches/initializes UI data; processing denotes accepted work continuing asynchronously.
- **UNAVAILABLE** means capability/data/provider/policy is not available; it is not automatically an error caused by the user.
- **PARTIAL** preserves what completed and clearly identifies what needs review.
- **EXPIRED** is used only when a valid policy/provider/session/quote/payment expiry rule exists; do not invent duration.
- **RETRY_REQUIRED** preserves idempotency/context; it does not encourage duplicate payment/shipment/refund/order attempts.

## 4. Feedback presentation rules

Every state combines:

1. semantic status text;
2. appropriate token role/icon/supporting visual cue;
3. current object/task context;
4. permitted next action or explanation of why none is available;
5. accessible announcement/focus behavior when state changes;
6. safe logging/audit correlation where a sensitive/admin/provider operation occurs.

## 5. State anti-patterns

- Green/success styling before verified provider/payment/shipment state.
- Spinner-only or color-only failure/required state.
- Empty state that hides authorization, filter, publication, or provider cause.
- Disabled action with no explanation where a customer/staff decision is blocked.
- Toast-only critical outcome that disappears before a user can understand it.
- Reusing one generic “error” for validation, unavailable provider, access denied, expired payment, inventory conflict, and redirect failure.

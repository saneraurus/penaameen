# PENA AMEEN Admin UX Blueprint

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED internal operational UX model for the 24 admin destinations. It does not create admin UI or confirm staff roles, permissions, approval thresholds, provider workflows, or reporting requirements.

## 1. Admin UX principle

Admin UX reduces operational ambiguity by showing authorized staff the current record, normalized state, available next action, validation/recovery path, and audit context. It must not turn navigation visibility into permission or permit arbitrary lifecycle editing.

## 2. Admin task model

| Area | Primary user intent | Hierarchy | Required UX states | Data/authorization boundary |
|---|---|---|---|---|
| Dashboard | Find actionable work | Work queue → priority/exception → task route | loading; empty; warning; error | Approved aggregate only; no vanity/unsupported metrics |
| Products | Maintain catalog accurately | List → product detail/form → media/taxonomy/inventory/SEO | draft; invalid; saving; published; archived; error | Catalog ownership and product lifecycle rules |
| Categories/tags | Maintain retained taxonomy safely | List → detail → membership/SEO/route impact | loading; empty; conflict; redirect warning | Taxonomy/SEO decision gate |
| Inventory | Reconcile/adjust approved stock | List → item/location/movement → authorized adjustment | available; reserved; conflict; adjustment error | Inventory ownership/adjustment authority |
| Orders | Progress customer order safely | Queue → order detail → payment/fulfillment/shipment context | pending; processing; exception; access denied | Order state machine/capability policy |
| Payments | Review verified financial state | Payment queue/detail → event/reconciliation/refund context | pending; review; paid; failed; refund state | Finance authority/provider mapping unknown |
| Shipments | Fulfill/track eligible order | Eligible order → quote/shipment/AWB/label/tracking | quote error; requested; label unavailable; exception | Shipping SOP/provider/capability unknown |
| Content | Publish approved editorial content | List → editor → taxonomy/media/SEO → publish | draft; review; publish error; route conflict | Content ownership/rights/SEO validation |
| SEO | Maintain metadata/redirects safely | Route/entity → metadata/canonical/indexability/redirect → validation | missing; conflict; pending test; published | SEO owner/migration decision |
| Customers | Support authorized customer context | List/detail → order/tracking/contact context | empty; restricted; error | PII/ownership/retention policy |
| Branches/events | Maintain approved local/community records | List/detail → media/contact/SEO/status | draft; inactive; incomplete; error | Scope/active data/client decision |
| Media | Manage approved asset lifecycle | Asset list → validation/rights/usage → attach | pending; quarantined; approved; missing rights | Media ownership/rights/access policy |
| Notifications | Review delivery exceptions/templates where approved | Queue/detail → event/channel/outcome | queued; failed; suppressed; retry | Channel/consent/provider policy |
| Analytics | Review approved aggregate signals | Dashboard/report → filter → related route/task | loading; empty; restricted | Consent/reporting/KPI policy |
| Staff/access | Manage approved capability assignments | Staff → role/capability → audit/revoke | restricted; conflict; confirmation | Final roles/approval/security policy |
| Audit logs | Understand sensitive history | Target/actor/time/outcome → details | loading; restricted; empty | Audit access/retention policy |

## 3. Data-heavy interaction patterns

### Lists and data tables

- Identify record type, primary identity, normalized status, relevant date/context, and next authorized action.
- Use filtering/search/sort only for allowed domain fields; do not expose unapproved personal/financial/provider data.
- Preserve current filter/context after detail/edit/recovery where safe.
- Use responsive priority columns/detail disclosure rather than unreadable dense compression.
- Include empty, loading, no-result, error, permission, stale, and partial-data states.

### Detail and edit forms

- Group fields by domain ownership: catalog, commercial, inventory, media, SEO; or order, payment, shipping, customer context.
- Separate historical snapshots/read-only evidence from mutable authorized fields.
- Show validation before destructive/financial/shipping/SEO action and require explicit confirmation where policy later requires it.
- Explain consequences of archive, redirect, inventory adjustment, cancellation, refund, shipment, or access changes without inventing policy.

## 4. Admin feedback and recovery

| Action class | Feedback requirement |
|---|---|
| Save/update | Confirm authoritative saved state, not merely local form completion |
| Publish/archive | Show route/SEO/media/taxonomy impact and validation result |
| Inventory adjustment | Show item/location/delta/reason/audit reference; conflict/error recovery |
| Payment/refund | Show verified/review state and authority constraint; no optimistic paid/refund claim |
| Shipment/AWB/label | Show exact creation/availability/dispatch/tracking state; provider failure/manual review path |
| Redirect/canonical | Show source/target/action/validation warning; no unsafe automatic home redirect |
| Role/access | Show authorized grant/revoke confirmation/audit; avoid self-escalation |
| Media | Show rights/validation/usage state; no publish on unknown rights |
| Job/notification failure | Show safe error class, retry/manual-review owner, correlation/audit context |

## 5. Accessibility and responsive requirements

- Every admin data table has semantic headers, captions/context, keyboard navigation, sort/filter state, and responsive alternative.
- StatusBadge text remains visible; color/icon is supplementary.
- Forms, dialogs, destructive confirmations, errors, and audit history are keyboard and screen-reader accessible.
- Dense dashboards prioritize actionable queues over visually compressed metric cards.
- Admin mobile access must preserve critical task/action/recovery, but no assumption is made that all complex operations are equally appropriate on every device.

## 6. Permission safety

Components may hide unavailable actions for clarity, but server/service authorization remains authoritative. UX must explain denied/restricted state safely without exposing data/permissions. Final roles, refund authority, inventory adjustment authority, shipping manual fallback, SEO publishing, and staff administration are `CLIENT DECISION REQUIRED`.

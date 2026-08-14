# PENA AMEEN Form Design System

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED form-governance model. It does not define final field lists, validation libraries, input styles, legal wording, payment/shipping fields, or implementation.

## 1. Form principles

- A form asks only for data required by an approved task/policy.
- Persistent labels, help, required/optional state, errors, and current value context are visible and programmatically associated.
- Client feedback improves correction; server/domain validation remains authoritative.
- Sensitive, financial, customer, shipping, and staff actions make state/consequence explicit.
- Do not use placeholders as the only label or color as the only validation signal.

## 2. Field patterns

| Pattern | Purpose | States | Required UX/accessibility rules | Dependencies |
|---|---|---|---|---|
| Text input | Short structured/free text | default; focus; filled; invalid; disabled; loading; success | Persistent label, input purpose, help/error association, clear required/optional text | Field policy/value type unknown by domain |
| Select | Choose from bounded approved options | default; focus; selected; invalid; disabled; loading | Visible label/current selection; keyboard/touch interaction; no hidden unsupported values | Taxonomy/provider/policy options may be unknown |
| Checkbox | Toggle explicit independent consent/selection | unchecked; checked; indeterminate if valid; disabled; error | Label describes consequence; required status textual | Consent/policy authority required |
| Radio group | Choose one mutually exclusive valid option | unselected; selected; invalid; disabled | Group legend/labels, keyboard navigation, error association | Payment/shipping/variant options only when approved |
| Textarea | Longer note/content input | default; focus; invalid; disabled; saving | Label, character/policy guidance, error/recovery | Order note/content/permission policy |
| File upload | Select approved media/document | empty; selected; validating; processing; approved; rejected; error | File requirement/help, progress/state, accessible alternative, rights notice | MIME/size/rights/storage policy unknown |
| Date/time | Select approved date/time context | default; invalid; unavailable; disabled | Clear format/timezone/context; keyboard entry path | Event/date/policy fields unknown |
| Quantity control | Change requested product amount | default; min/max; invalid; unavailable; loading | Label/unit/availability feedback; plus/minus not icon-only | Inventory/limit/variant/package policy unknown |
| Search input | Submit public/admin allowed query | empty; focus; loading; no result; error | Accessible name, clear action, result state, no private leakage | Search scope/policy |
| Status/read-only field | Display immutable snapshot/evidence | default; warning; restricted | Clear label/value/copy context where safe; no editable implication | Order/payment/audit/privacy policy |

## 3. Required, optional, and help text

| Element | Rule |
|---|---|
| Required indicator | Use visible text/semantic required state; do not rely on color/symbol alone |
| Optional indicator | State optional clearly when it improves decision-making |
| Help text | Explain why/how only when not obvious; associate with field |
| Policy text | Link approved policy/version; do not create placeholder legal wording |
| Sensitive data explanation | Explain purpose/access only after legal/privacy policy approval |
| Format example | Use only validated representative format; do not imply unapproved provider/address requirement |

## 4. Validation and feedback

```text
Field/group context
→ user input
→ client-side guidance where useful
→ server/domain validation
→ authoritative success, correction, conflict, pending, or recovery state
```

| State | UX behavior |
|---|---|
| Invalid | Explain error in text near field and in accessible summary; preserve safe input |
| Warning | Explain non-blocking concern/next review; do not masquerade as success |
| Saving/loading | Prevent duplicate destructive/payment/shipment submit; preserve context |
| Success | Confirm authoritative result and next action, not just local form completion |
| Error | Show safe task-specific recovery; do not clear inputs without reason |
| Disabled | Explain unavailable condition if action is relevant; do not hide required policy/provider gap |
| Partial | Show what saved/what needs review; do not imply all fields succeeded |

## 5. Form grouping and submission

- Group customer, address, shipping, payment, review, catalog, inventory, content, SEO, media, and access inputs by one user mental model.
- One primary submission action maps to one safe command intent; destructive or financial actions need explicit confirmation/review context.
- Prevent duplicate checkout, payment, shipment, refund, stock, redirect, or permission action through loading/idempotency-aware feedback.
- Return focus/summary to the most relevant error/result after submission.
- Use step/section progression only when it reduces cognitive load; do not hide required review/policy context.

## 6. Responsive and accessibility requirements

- Fields stack by default on compact view; multi-column grouping only when labels/errors remain clear.
- Inputs and controls use final accessibility-tested touch target size tokens.
- Keyboard order follows visual/semantic task order; focus is visible.
- Modals/dialog forms manage focus and return it after close.
- File upload, date/time, quantity, select, and search have non-pointer interaction paths.
- Error/status messages are announced appropriately and do not depend on animation/color alone.

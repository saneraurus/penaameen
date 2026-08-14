# PENA AMEEN Color System

**Phase:** 5 — Design System & UX Blueprint

**Status:** Semantic color-role system. Final brand colors, palettes, dark mode, and values are `UNKNOWN` pending `CDR-029`. No color value in this document is an approved brand color.

## 1. Color roles

| Role | Purpose | Required behavior | Value status |
|---|---|---|---|
| Brand | Approved PENA AMEEN identity emphasis | Applied only after official asset/palette approval; never sole state signal | UNKNOWN |
| Primary | Main action/attention hierarchy | Supports primary CTA where action is valid | PROPOSED semantic role |
| Secondary | Supporting action or emphasis | Does not visually compete with primary purchase/task action | PROPOSED semantic role |
| Surface | Cards, panels, raised/task regions | Establishes hierarchy without excessive decoration | PROPOSED semantic role |
| Background | Application/page canvas and section contrast | Supports readable content/whitespace rhythm | PROPOSED semantic role |
| Text | Primary, secondary, muted, inverse text hierarchy | Meets contrast target in every state | PROPOSED semantic role |
| Border | Structure, input, table, separator, focus distinction | Must remain perceivable without visual clutter | PROPOSED semantic role |
| Success | Verified positive/completed state | Pair with text/icon/state label; never imply payment/shipping without verified data | PROPOSED semantic role |
| Warning | Attention/expiring/review-needed state | Pair with explanation and next action | PROPOSED semantic role |
| Error | Failed/invalid/unavailable state | Pair with human-readable error and recovery | PROPOSED semantic role |
| Info | Neutral guidance/pending/support state | Avoid treating as success or warning by color alone | PROPOSED semantic role |
| Interactive | Default/hover/active/focus action treatment | Focus remains distinct from hover/active | PROPOSED semantic role |
| Disabled | Non-interactive/temporarily unavailable state | Must retain readable context and reason where needed | PROPOSED semantic role |

## 2. Commerce state semantics

| Commerce situation | Semantic role | Non-color requirement |
|---|---|---|
| Product available | Default/interactive plus explicit availability text | Product/action label and enabled state |
| Product unavailable | Disabled or warning/error according to reason | Explicit unavailable text and alternative/recovery path |
| Price/sale state | Text/surface/emphasis role | Current/previous/discount labels and accessible price text |
| Cart updated | Success/info feedback | Message/action, not transient color alone |
| Checkout validation | Error field/state | Label, error text, programmatic announcement, correction path |
| Payment pending | Info/processing | Pending explanation and next action |
| Payment success | Success only after verified state | Verified confirmation text/order reference |
| Payment failure/expired | Error/warning | Failure/expiry explanation and retry/support path |
| Shipping quote unavailable | Warning/error | Clear retry/address/support action |
| Shipment/tracking exception | Warning/error | Status, timestamp/source as appropriate, support path |
| Refund/cancellation | Info/warning/success based on verified lifecycle | Explicit state and policy/support path |

## 3. Accessibility requirements

- Final foreground/background combinations must meet an approved accessibility contrast target; exact ratios should be validated against the selected palette and text size.
- Color is never the only signal for form validity, focus, status, availability, payment, shipping, chart, or admin severity.
- Focus visibility uses a distinct semantic focus treatment that remains perceptible on all surfaces.
- Disabled treatment cannot make required text unreadable or hide a reason for unavailable action.
- Status icons, labels, patterns, and screen-reader announcements complement color.
- Images, media overlays, gradients, and brand color treatments must preserve text contrast or provide alternate structure.

## 4. Light and dark considerations

A dark theme is **DEFERRED**. The token model permits surface/text/border/interactive aliases to support a later approved theme, but no dark palette, automatic mode behavior, or customer preference policy is assumed.

## 5. Color approval gate

Before values are final, PENA AMEEN must approve palette assets and map them to semantic roles. The design review must validate contrast, state differentiation, print/media implications if relevant, culturally appropriate interpretation, product imagery interaction, and accessibility across public/account/admin interfaces.

# PENA AMEEN Motion Design System

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED semantic motion governance. No exact milliseconds, easing curves, page-transition library, animation implementation, or brand motion style is approved.

## 1. Motion philosophy

Motion exists to clarify cause, effect, hierarchy, loading, orientation, and feedback. It must not become decorative noise, delay a commerce task, obscure an error, imply unverified success, or exclude users who prefer reduced motion.

## 2. Semantic motion tokens

| Token role | Intended use | Status |
|---|---|---|
| `motion.duration.immediate` | Near-instant state acknowledgement | PROPOSED relative token |
| `motion.duration.fast` | Micro-feedback such as focus/selection/quantity response | PROPOSED relative token |
| `motion.duration.standard` | Panel/menu/status transition where motion clarifies relationship | PROPOSED relative token |
| `motion.duration.slow` | Only for meaningful loading/progress context, never blocking task | PROPOSED relative token |
| `motion.easing.standard` | Predictable ordinary transition | PROPOSED; exact curve deferred |
| `motion.easing.emphasized` | Intentional entry/attention transition used sparingly | PROPOSED; final brand motion unknown |
| `motion.reduce.none/minimal` | Reduced-motion alternative | REQUIRED behavior principle |

## 3. Approved motion purposes

| Use | Appropriate behavior | Guardrail |
|---|---|---|
| Navigation/menu | Reveal grouped context and preserve focus/orientation | No motion-only access; mobile menu must be operable without animation |
| Product media | Indicate selected image/slide context | No auto-advance/rapid movement required for product understanding |
| Quantity/cart | Acknowledge submitted intent and authoritative result | Never imply stock reservation/order/payment completion |
| Form validation | Direct attention to associated error/result | Error text/focus remains primary, not shake/color alone |
| Loading | Communicate pending work without fake progress | Avoid endless spinner without fallback/retry/support |
| Status feedback | Support verified success/warning/error change | Status text/evidence is required; no premature success animation |
| Dialog/confirmation | Clarify focused task entry/exit | Focus management is more important than visual transition |
| Admin work queue | Indicate refresh/filter/state update | Do not hide changed data/audit consequence behind animation |

## 4. Prohibited or restricted motion

- decorative page transitions that delay Shop/Product/Checkout/Tracking access;
- autoplay/carousel motion for critical product/education/branch/legal content;
- motion that flashes, distracts, or impairs reading;
- animation as the only payment, shipment, error, or success confirmation;
- motion that prevents keyboard focus or screen-reader state comprehension;
- provider-branded motion/UX before provider approval;
- unapproved cultural/brand motifs conveyed through motion.

## 5. Reduced-motion behavior

When reduced motion is preferred or motion is unavailable:

- show state changes immediately with text/focus/semantic status;
- remove nonessential transitions, parallax, auto-advance, and decorative movement;
- retain required layout/context and feedback;
- do not disable essential loading/error/retry communication.

## 6. Performance and implementation boundary

Motion must respect performance budgets and server/client architecture. Components use semantic motion tokens, but actual CSS/JS implementation, duration values, easing curves, and libraries are deferred to Phase 6/implementation after brand approval and accessibility/performance validation.

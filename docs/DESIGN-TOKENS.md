# PENA AMEEN Design Tokens

**Phase:** 5 — Design System & UX Blueprint

**Status:** Semantic token architecture. Token names and relationships are `PROPOSED`; final visual values require brand approval. This document does not create CSS variables, Tailwind configuration, theme files, or implementation tokens.

## 1. Token principles

- Tokens express intent, not arbitrary component-specific values.
- Brand-dependent values remain `UNKNOWN`/`CLIENT DECISION REQUIRED` until `CDR-029` is resolved.
- State tokens remain semantic and must pass accessibility validation independent of final palette.
- Components consume tokens by role; they do not hardcode visual values.
- Final physical values, units, aliases, dark mode behavior, and implementation format are deferred.

## 2. Token taxonomy

| Category | Proposed token families | Purpose | Value status |
|---|---|---|---|
| Color | `color.brand.*`, `color.surface.*`, `color.text.*`, `color.border.*`, `color.status.*`, `color.interactive.*`, `color.disabled.*` | Semantic visual meaning and state | Final values UNKNOWN; semantic roles PROPOSED |
| Typography | `font.family.*`, `font.size.*`, `font.weight.*`, `font.lineHeight.*`, `font.letterSpacing.*` | Readable text roles | Font/value selection CLIENT DECISION REQUIRED |
| Spacing | `space.0`, `space.1` … `space.n` | Consistent internal/external rhythm | Relative scale PROPOSED; physical values deferred |
| Sizing | `size.icon.*`, `size.control.*`, `size.touch.*`, `size.media.*` | Control/icon/media sizing | Relative roles PROPOSED; values validate via accessibility/design |
| Radius | `radius.none`, `radius.subtle`, `radius.standard`, `radius.emphasis` | Surface hierarchy | PROPOSED; brand-dependent values deferred |
| Borders | `border.width.*`, `border.style.*`, `border.color.*` | Separation, focus, status, table/form boundaries | Semantic roles PROPOSED |
| Shadows/elevation | `elevation.flat`, `elevation.raised`, `elevation.overlay`, `elevation.focus` | Layering, not decoration | PROPOSED; final visual values deferred |
| Opacity | `opacity.disabled`, `opacity.overlay`, `opacity.muted` | Disabled/overlay/deemphasis treatment | PROPOSED; cannot reduce contrast below accessibility target |
| Motion | `motion.duration.*`, `motion.easing.*`, `motion.reduce.*` | Useful feedback/transitions | Relative semantic values PROPOSED |
| Z-index/layer | `layer.base`, `layer.sticky`, `layer.dropdown`, `layer.overlay`, `layer.modal`, `layer.toast` | Predictable stacking | PROPOSED ordering; no arbitrary numeric values |
| Breakpoints | `breakpoint.compact`, `breakpoint.medium`, `breakpoint.expanded`, `breakpoint.wide` | Responsive behavior thresholds | Philosophy PROPOSED; exact values deferred |
| Layout | `container.*`, `grid.*`, `gutter.*`, `content.measure.*` | Page width, columns, readable measure | Relative roles PROPOSED |

## 3. Semantic color token structure

```text
color.brand.primary
color.brand.secondary
color.surface.canvas
color.surface.default
color.surface.subtle
color.surface.raised
color.text.primary
color.text.secondary
color.text.muted
color.text.inverse
color.border.default
color.border.strong
color.border.focus
color.status.success.*
color.status.warning.*
color.status.error.*
color.status.info.*
color.interactive.default
color.interactive.hover
color.interactive.active
color.interactive.focus
color.interactive.disabled
```

No role implies an approved final hue. Contrast and non-color state cues are mandatory.

## 4. Token usage rules

| Rule | Rationale |
|---|---|
| Use semantic token roles in patterns/components | Allows brand values to change without redesigning behavior |
| Do not use token names such as `green`, `blue`, or raw values as state meaning | Prevents color lock-in and inaccessible state dependence |
| Use a visible focus token distinct from hover/active | Keyboard focus is not optional visual polish |
| Use one spacing scale across public/account/admin patterns | Reduces density inconsistency and operational errors |
| Use role-specific type tokens instead of local font-size decisions | Keeps content/product/price/admin hierarchy coherent |
| Use layer tokens for overlays/modals/toasts | Prevents inconsistent stacking/focus issues |
| Use state tokens with icon/text/semantic markup | Color alone cannot indicate availability/payment/error/status |
| Treat dark-mode tokens as `DEFERRED` | No dark theme requirement or brand palette is confirmed |

## 5. Proposed token relationships without physical values

| Relative role | Intended relation | Status |
|---|---|---|
| `space.0` → `space.1` → `space.2` … | Monotonic scale supporting compact control internals through page sections | PROPOSED |
| `font.size.caption` < `body` < `heading` < `display` | Hierarchy without final point/rem values | PROPOSED |
| `size.touch.minimum` | Meets accessibility touch-target expectation after final testing | PROPOSED |
| `elevation.flat` < `raised` < `overlay` < `modal` | Layer hierarchy, not visual brand decision | PROPOSED |
| `motion.duration.fast` < `standard` < `slow` | Feedback hierarchy respecting reduced motion | PROPOSED |
| `breakpoint.compact` < `medium` < `expanded` < `wide` | Behavior-first responsive progression | PROPOSED |

## 6. Token readiness

Semantic token architecture is ready for design governance. Final token values are blocked by approved brand assets, accessibility contrast validation, layout/content testing, and Phase 6 implementation constitution. No provisional value should be mistaken for an approved brand value.

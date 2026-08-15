# PENA AMEEN Component Architecture

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED component taxonomy and contracts. Components are design concepts, not React components, code files, props, CSS, or implementation APIs.

**Components documented:** **45**.

## 1. Component rules

- A component has one semantic purpose and a controlled set of variants/states; it does not encode provider-specific, policy-specific, or unapproved business logic.
- Inputs are logical data/state needs; outputs are user intents or rendered hierarchy, not actual function signatures.
- Components consume semantic tokens and normalized state, not raw color/font/provider data.
- Components must preserve server-authoritative commerce, authorization, and SEO boundaries defined in prior phases.
- Variants are not excuses for duplicate component behavior or visual inconsistency.

## Foundations

| Component | Purpose | Variants | States | Inputs / outputs | Responsive behavior | Accessibility requirements | Dependencies / usage rules |
|---|---|---|---|---|---|---|---|
| Container | Constrain and align page/task content | page; commerce; article; checkout; account; admin | layout only | Inputs: width role/gutter; Output: aligned content region | Adapts gutter/measure by breakpoint | Semantic wrapper; no landmark duplication | Uses Layout/Tokens; never encodes page business state |
| Stack | Vertical rhythm for related content | compact; standard; section | layout only | Inputs: spacing token/alignment; Output: ordered children | Spacing scales without changing order | Preserves DOM reading order | Uses tokens; no visual relationship invention |
| Grid | Responsive collection/data layout | product; content; form; dashboard; data | layout only | Inputs: column/flow role; Output: ordered grid | Column behavior follows responsive rules | DOM/order remains logical; no keyboard trap | Uses layout tokens; no category semantics |
| Divider | Separate related regions | subtle; strong; labeled | default | Inputs: semantic separation role; Output: boundary | May collapse when sections stack | Not sole structural cue; labels remain semantic | Use sparingly between distinct tasks |
| Icon | Supplement action/status meaning | navigation; action; status; decorative | default; disabled | Inputs: semantic name/label; Output: visual cue | Scales with control/text context | Critical icons have text/accessible name; decorative hidden | Approved icon direction unknown; do not use icon alone |
| Typography | Render semantic type role | display; heading; body; caption; label; price; code | default; muted; inverse; error | Inputs: semantic role/content; Output: readable text | Role scales, not arbitrary sizes | Uses semantic HTML/reading order/contrast | Uses Typography/Tokens; no approved font implied |

## Navigation

| Component | Purpose | Variants | States | Inputs / outputs | Responsive behavior | Accessibility requirements | Dependencies / usage rules |
|---|---|---|---|---|---|---|---|
| Header | Global brand, primary and utility navigation | public; checkout-minimal; account; admin | default; search active; mobile open; authenticated | Inputs: route/session/cart state; Output: navigation actions | Transforms to grouped mobile navigation | Landmark, keyboard, focus, current-page context | Uses navigation IA; no account policy assumption |
| Navigation | Primary/secondary/contextual route choices | primary; secondary; utility; contextual | default; current; expanded; disabled | Inputs: route tree/state; Output: route intent | Groups/condenses by viewport | Lists/links semantic; no hover-only access | Uses PUBLIC-IA and route inventory |
| Breadcrumbs | Show logical context path | public; commerce; content; account; admin | default; current | Inputs: logical IA hierarchy; Output: context links | May simplify on compact view | Current item identified; never fabricates URL parent | Uses IA; root articles keep conceptual context |
| Footer | Durable help/legal/discovery navigation | public; checkout-support | default | Inputs: approved link groups; Output: low-frequency routes | Stacks groups on compact view | Landmark/link labels readable | Uses legal/contact/route decisions |
| MobileNavigation | Grouped compact navigation | closed; open; nested group | default; focus; open; disabled | Inputs: nav tree/current route; Output: mobile route selection | Compact-first; expands by intent | Focus management/escape/keyboard/touch required | Uses Header/Navigation; no visual drawer prescription |

## Commerce

| Component | Purpose | Variants | States | Inputs / outputs | Responsive behavior | Accessibility requirements | Dependencies / usage rules |
|---|---|---|---|---|---|---|---|
| ProductCard | Scannable product discovery entry | grid; list; featured; compact | default; loading; unavailable; error | Inputs: eligible product summary; Output: product route/action | Grid/list transformation; preserves price/name | Meaningful image alt/name/price/status; no hidden action | Uses Product/Media/SEO data; no inferred attributes |
| ProductGallery | Product media exploration | single; gallery; missing-media | default; loading; error; missing | Inputs: approved media usages; Output: selected media context | Stacks/condenses thumbnails/controls | Alt/caption/keyboard controls; no required hover | Uses MediaAsset/Usage; rights gate |
| Price | Represent product/order monetary context | regular; sale; total; previous; refund | default; unavailable; pending | Inputs: approved money snapshot/status; Output: labeled amount | Maintains legible hierarchy | Text labels/currency context; no color-only sale | Uses Catalog/Order/Payment data; tax/discount unknown |
| VariantSelector | Choose valid product option | single; multiple; unavailable | default; selected; incomplete; unavailable; loading | Inputs: approved variant/options; Output: selection intent | Stacks controls on compact view | Native radio/select semantics and error association | Only when variants confirmed |
| PackageSelector | Explain/select package configuration when approved | fixed package; selectable package | default; selected; unavailable; incomplete | Inputs: approved package/components; Output: selection intent | Shows composition before action; stacks compact | Clear included content and selection semantics | Only when package strategy approved |
| QuantitySelector | Set valid requested quantity | compact; inline; cart | default; min/max/error/disabled | Inputs: quantity/availability limits; Output: change intent | Touch-friendly compact control | Labeled buttons/input; announce errors | Server remains authoritative |
| AddToCart | Initiate eligible cart action | primary; compact; unavailable | default; loading; success; error; disabled | Inputs: product/selection/quantity eligibility; Output: cart intent | Full-width/adjacent action based on layout | Accessible name/state/recovery message | Never claims reservation/payment success |
| CartItem | Review/edit one cart line | editable; unavailable; changed | default; loading; error; unavailable | Inputs: cart line snapshot; Output: update/remove intent | Stacks media/details/actions compact | Labels quantity/remove/errors; preserve context | Uses Cart/Inventory/Catalog authoritative response |
| CartSummary | Explain cart totals and checkout readiness | summary; empty; changed | default; processing; warning; error | Inputs: cart totals/shipping estimate state; Output: checkout action | Follows items compact; may sit beside on wide | Labels all monetary/state values | Tax/promotion/shipping policy remains gated |
| CheckoutSummary | Review committed checkout context | review; pending; confirmed; failed | default; loading; warning; error | Inputs: order/cart/shipping/payment snapshot; Output: edit/continue intent | Focuses task on compact view | Clear labels/policy links/verification state | Uses Checkout/Order; no false provider state |

## Content

| Component | Purpose | Variants | States | Inputs / outputs | Responsive behavior | Accessibility requirements | Dependencies / usage rules |
|---|---|---|---|---|---|---|---|
| ArticleCard | Discover article/education content | grid; list; related; compact | default; loading; missing media | Inputs: published article summary; Output: article route | Stacks card metadata/media compact | Meaningful title/excerpt/date/category; image alt | Uses Article/Media/SEO |
| ArticleBody | Render long-form approved content | standard; policy; education | default; loading; error | Inputs: sanitized published body; Output: readable article | Readable measure/inline media handling | Semantic headings/lists/links/captions | Uses Content/SEO; source route preserved |
| CategoryCard | Discover retained category/archive | product; content; education | default; empty; unavailable | Inputs: approved category summary; Output: category route | Grid/list adapts | Name/purpose/count context; not color-only | Uses scoped Category/SEO |
| EducationCard | Introduce EducationHub/resource | hub; resource; related | default; loading; unavailable | Inputs: approved hub/resource context; Output: hub/resource route | Sequential stack on compact | Clear learning context/no unsupported claim | Uses EducationHub/Relation |
| ContentSection | Group explanatory/related content | intro; resources; related; trust | default; empty; error | Inputs: section purpose/children; Output: hierarchy | Stack/grid responsive | Heading/landmark/reading order | Uses layout/content relationships |

## Feedback

| Component | Purpose | Variants | States | Inputs / outputs | Responsive behavior | Accessibility requirements | Dependencies / usage rules |
|---|---|---|---|---|---|---|---|
| Alert | Persistent contextual message | info; success; warning; error | default; dismissible where safe | Inputs: message/severity/action; Output: optional action | Full-width/inline based on task | Role/live behavior, text/icon, focus-safe | Not replacement for field/state detail |
| Toast | Transient non-critical feedback | info; success; warning; error | queued; visible; dismissed | Inputs: event message/action; Output: acknowledgement | Position adapts without obscuring primary task | Announce appropriately; user can pause/dismiss | Never sole source for payment/shipping critical result |
| Modal | Focused complex task surface | detail; form; media | open; loading; error; closed | Inputs: trigger/task data; Output: confirm/cancel | May use full focus surface compact | Focus trap/return/escape/dialog labeling | Not for essential route content that needs deep link |
| Dialog | Confirmation/destructive decision | confirm; destructive; choice | open; processing; error | Inputs: action/consequence; Output: explicit confirm/cancel | Compact-first clear action order | Focus management, explicit consequences | Uses audit/state policy; no irreversible silent action |
| Tooltip | Supplement concise control explanation | help; label | hidden; visible | Inputs: brief explanation; Output: none | Touch has alternate visible/help path | Not sole label/critical instruction | Use sparingly; no hover-only data |

## System states

| Component | Purpose | Variants | States | Inputs / outputs | Responsive behavior | Accessibility requirements | Dependencies / usage rules |
|---|---|---|---|---|---|---|---|
| Loading | Indicate pending route/task/data state | page; section; action | loading; delayed | Inputs: task type; Output: perceived progress | Layout reserves priority content | Announce meaningful loading; avoid motion overload | No fake progress/verification |
| Skeleton | Preserve layout while content loads | card; text; table; media | loading | Inputs: expected structure; Output: placeholder | Simplifies compact structure | Hidden from assistive tech or labeled appropriately | Never mimic unavailable data as actual content |
| EmptyState | Explain no eligible items/data | catalog; search; cart; orders; admin | empty; actionable | Inputs: reason/context; Output: recovery action | Stacks concise task guidance | Clear heading/action; no blame | Uses actual empty reason, not generic placeholder |
| ErrorState | Explain recoverable/unrecoverable issue | page; section; action; provider | error; retry required; unavailable | Inputs: safe error category/action; Output: retry/support/nav | Preserves task context compact | Announce error; clear next path | No secrets/internal diagnostics/false success |
| SuccessState | Confirm verified completion | cart; order; payment; shipment; admin | success; pending follow-up | Inputs: verified state/reference; Output: next action | Prioritizes status/context compact | Text/state not color only | Never shown before authoritative confirmation |

## Account

| Component | Purpose | Variants | States | Inputs / outputs | Responsive behavior | Accessibility requirements | Dependencies / usage rules |
|---|---|---|---|---|---|---|---|
| AccountNavigation | Navigate authorized customer tasks | overview; orders; profile; addresses | default; current; signed out | Inputs: session/account policy; Output: private route action | Condenses on compact view | Semantic nav/current item; no private leak | Uses Account IA/auth policy |
| OrderCard | Summarize authorized order/tracking state | history; detail link; support | default; pending; exception | Inputs: customer-safe order summary; Output: detail/tracking action | Stacks order reference/status/action compact | Clear status/text/accessible action | Uses Order/Payment/Shipment ownership |
| AddressCard | Review/edit approved address | default; selected; invalid; empty | default; selected; invalid; saving; error | Inputs: customer/address snapshot; Output: select/edit intent | Single-column detail on compact | Address labels/errors/privacy guidance | Uses CustomerAddress; no assumed fields |

## Admin

| Component | Purpose | Variants | States | Inputs / outputs | Responsive behavior | Accessibility requirements | Dependencies / usage rules |
|---|---|---|---|---|---|---|---|
| DataTable | Present operational records | orders; products; inventory; customers; audit | default; loading; empty; error; selected | Inputs: authorized rows/columns/sort; Output: row/action intent | Priority columns/detail/overflow behavior | Table headers/caption/sort status/keyboard action | Uses Admin IA/data ownership |
| FilterBar | Refine authorized list/work queue | search; filter; sort; date; status | default; active; loading; no results | Inputs: allowed filters; Output: query intent | Collapses/expands logically compact | Labels/filter state/clear action | No arbitrary data filter |
| Form | Authorized create/edit task | catalog; content; order; settings | default; invalid; saving; success; error | Inputs: schema/policy fields; Output: command intent | Groups/steps stack compact | Labels/errors/required/optional/focus | Uses Form system and service validation |
| StatusBadge | Compact state label | order; payment; shipment; inventory; publish | default; processing; warning; error | Inputs: normalized state; Output: visual/status text | Maintains text on all viewports | Text/icon plus color; accessible name | Uses lifecycle/normalization; no free status |
| AuditLog | Show authorized historical action evidence | entity; actor; system; exception | default; loading; empty; restricted | Inputs: safe audit entries; Output: detail/filter intent | Detail disclosure compact | Chronology/labels/table semantics | Uses AuditLog access/retention policy |
| DashboardCard | Surface actionable operational queue | count; status; exception; link | default; loading; empty; warning | Inputs: approved aggregate/task link; Output: route action | Stacks by task priority | Descriptive title/value/action; no color-only metric | Uses admin work queue, not vanity data |

## 10. Component completion rules

- Final visual values require approved brand tokens; semantic roles may be documented before they are approved.
- Any component that displays money, stock, payment, shipment, tracking, role, or SEO state must receive normalized authoritative data and clear status text.
- A component may not create a new route, taxonomy, provider behavior, permission, or data ownership rule.
- Phase 6 must translate these contracts into implementation conventions only after brand/design decisions and implementation constitution gates are satisfied.

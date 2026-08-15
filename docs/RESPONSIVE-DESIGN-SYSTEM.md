# PENA AMEEN Responsive Design System

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED responsive behavior model. Exact pixel breakpoints are intentionally not fixed; breakpoint tokens require later design/testing approval.

## 1. Breakpoint philosophy

Responsive behavior is triggered when a layout no longer supports readable content, touch interaction, task completion, or data comprehension — not merely because a device label changes.

| Token | Intended context | Status |
|---|---|---|
| `breakpoint.compact` | Narrow/mobile touch-first view | PROPOSED behavior token |
| `breakpoint.medium` | Tablet/small landscape or expanded compact view | PROPOSED behavior token |
| `breakpoint.expanded` | Desktop content/task workspace | PROPOSED behavior token |
| `breakpoint.wide` | Large desktop/data/media workspace | PROPOSED behavior token |

Exact values are `PROPOSED` and must be validated with content, component, accessibility, and target-device testing.

## 2. Global behavior

| Area | Compact/mobile | Medium | Expanded/wide |
|---|---|---|---|
| Navigation | Grouped mobile menu; direct search/cart access; no lost tracking/help path | May expose more contextual navigation | Full primary/utility navigation with controlled secondary context |
| Page hierarchy | One dominant column/task order | Selective side-by-side context | Parallel context only when it improves decision-making |
| Typography | Protect body/form/price readability | Gradual role scaling | Use wider hierarchy without excessive measure |
| Media | Responsive crop/ratio with required context | Larger supporting media | Use approved wider media without displacing task/content |
| Forms | Single-column fields and clear errors | Group related fields only when clear | Multi-column only when relationship/error order remains clear |
| Tables | Priority columns/detail disclosure/accessible scroll | More columns where readable | Full data table with sticky/context patterns as approved |
| Overlay/dialog | Full/focused task surface as needed | Centered/contained if readable | Layered dialog with focus management |

## 3. Navigation transformation

- Primary navigation transforms into grouped intent sections: Shop, Education, Branches, Profile/About, Help.
- Search, Cart, and Account/Track order remain discoverable in compact context; they are not buried behind unrelated content groups.
- Product categories, tags, articles, events, gallery, FAQ, legal, account, and admin routes do not become one long unstructured mobile list.
- Mobile menu open state preserves current route/task context and supports keyboard/focus behavior.

## 4. Commerce transformation

| Experience | Compact/mobile behavior | Expanded behavior |
|---|---|---|
| Shop/category | Readable product grid/list with filter/sort access that does not obscure results | More columns and visible filter context when helpful |
| Product detail | Gallery/content/price/availability/options/action stack in decision order | Gallery and decision panel may sit side by side |
| Cart | Items first, summary follows; edit controls touch-accessible | Summary may remain visible alongside items if it does not hide edits |
| Checkout | One focused task flow; errors near fields; review remains accessible | Related form/review context may align in columns |
| Payment/order outcome | Truthful pending/failure/retry state remains dominant | Additional help/order context may be visible |
| Tracking | Status and next action first; timeline/context follows | Timeline/detail may use wider presentation |

## 5. Content and education transformation

- Article body stays primary; related content/product/context rails move inline after relevant reading points.
- Education hubs stack explanatory context, resources, articles, and relevant products in a deliberate sequence.
- AL-BARQY and ACM roles remain distinct regardless of viewport; responsive layout cannot turn a product family into a category or duplicate a hub/archive.
- Media retains alt/caption/context and avoids critical text embedded only in images.

## 6. Account and admin transformation

| Area | Responsive rule |
|---|---|
| Account | Navigation becomes concise before order/profile content; order status/action remains visible without horizontal loss |
| Order history/detail | Use summary/expandable detail patterns; do not hide payment/shipment status behind ambiguous icon-only controls |
| Admin navigation | Collapse to task groups; preserve current workspace/action context |
| Admin tables | Prioritize identity/status/next action; reveal secondary data in detail view or accessible overflow |
| Admin forms | Group fields by data ownership/task; keep audit/validation context visible |
| Dashboard | Stack actionable queues; do not compress metrics into unreadable cards |

## 7. Touch, keyboard, and media rules

- Interactive controls meet a final accessibility-tested minimum touch target using semantic size tokens.
- Hover-only content/actions have focus/tap equivalents.
- Drag-only, precise-pointer-only, or side-scroll-only task completion is avoided.
- Responsive image sources/crops do not remove product, branch, event, policy, or education context.
- Reduced motion preference applies on all viewports.

## 8. Responsive validation

Validate at compact, medium, expanded, and wide behavior states using actual content lengths, error states, price formats, product titles, long article/policy text, data tables, keyboard navigation, zoom/reflow, screen-reader flow, and interrupted checkout/tracking conditions. No breakpoint is accepted solely because a layout looks visually balanced in a static mockup.

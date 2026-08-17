# PENA AMEEN Layout System

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED layout governance. Exact container widths, columns, gutters, breakpoints, and visual measurements remain token-level values to be validated after brand/content/design approval.

## 1. Layout principles

- Layout follows content/task hierarchy before visual style.
- Public pages use a predictable content frame while allowing product, article, checkout, and admin modes to have different readable measures.
- Mobile layout starts with one clear content/action order; larger screens add space and parallel context only when it improves comprehension.
- Public route layout respects Phase 2 canonical route/SEO structure; visual grouping does not create duplicate content/routes.
- Admin density uses progressive disclosure, responsive table patterns, and clear action zones rather than shrinking all content indiscriminately.

## 2. Viewport and container strategy

| Layout token role | Purpose | Proposed behavior |
|---|---|---|
| `container.full` | Full-bleed background/media/utility regions | Content inside still uses readable internal alignment |
| `container.page` | Default public page frame | Centers primary page hierarchy with responsive gutters |
| `container.commerce` | Shop/category/product/cart frame | Supports grid/list/detail tasks and persistent but non-intrusive commerce context |
| `container.article` | Long-form reading measure | Narrows text measure while allowing media/callouts intentionally |
| `container.education` | Hub/learning content frame | Supports explanatory hierarchy, resources, relevant products/articles |
| `container.checkout` | Focused transactional frame | Minimizes distraction while retaining required review/help/policy paths |
| `container.account` | Private customer task frame | Supports navigation plus order/profile/address content |
| `container.admin` | Staff operational frame | Supports navigation, work queue, forms, table/detail contexts |
| `container.wide` | Data/media-heavy approved contexts | Requires readable content subdivisions, not indiscriminate full width |

Exact max-width values are `PROPOSED` token values, not final measurements.

## 3. Grid and column patterns

| Pattern | Intended use | Responsive behavior |
|---|---|---|
| Single-column task | Checkout, policy, form, error/recovery, narrow content | Default compact/mobile pattern |
| Product list grid | Shop/category/search product results | Changes column count by available width and card minimum readability; final count/value deferred |
| Product detail split | Gallery/media plus product decision panel | Stacks in logical order on compact view; preserves price/availability/add-to-cart priority |
| Article with supporting rail | Long article plus related/contextual content | Rail becomes inline/after-content on compact view; article remains primary |
| Education hub grid | Hub resources, articles, products, related content | Converts to ordered stacked sections; no dense card wall |
| Cart/order summary split | Editable items plus summary | Summary follows items on compact view; remains in task context |
| Account navigation/content | Account navigation plus private content | Navigation becomes concise/stacked on compact view |
| Admin navigation/workspace | Internal navigation plus task workspace | Navigation collapses; table/form/detail patterns retain accessible route/action context |
| Data table/detail | Admin lists/audit/order/inventory | Use responsive priority columns, detail reveal, or scroll with headers rather than unreadable compression |

## 4. Spacing and section rhythm

- Use semantic spacing tokens for control internals, related field groups, cards, sections, and page rhythm.
- A section begins with a clear heading/purpose, contains related information/actions, and ends before an unrelated task begins.
- Do not use arbitrary visual gaps to imply a relationship not present in the data/IA.
- Increase separation between commerce decisions, payment/shipping states, and destructive/admin actions to reduce error risk.
- Keep required policy/help/error content close to the task it governs without overwhelming primary action.

## 5. Card and surface rules

| Surface type | Role | Guardrail |
|---|---|---|
| Product card | Scannable discovery entry | Does not hide price/availability/context or replace product detail |
| Content card | Article/education/category discovery | Does not truncate title/context into misleading claim |
| Status card | Order/shipping/payment/admin state summary | Shows state plus next action/evidence context, not color alone |
| Summary card | Cart/checkout/order totals | Preserves transparent labels, amounts, selected shipping/payment context |
| Admin dashboard card | Actionable work queue/metric summary | Links to a task; not decorative vanity metric |
| Modal/dialog surface | Focused confirmation/form/exception | Must not hide essential task state or trap focus |

## 6. Content widths

- Long-form article/policy body uses `content.measure.readable`, not unrestricted page width.
- Product description uses readable blocks alongside decision information.
- Price, SKU, availability, option, and add-to-cart clusters use compact scanning measure.
- Admin tables can use wide space, but row/action meaning must remain accessible and not rely on visual proximity alone.
- Branch/contact/public legal content uses a readable hierarchy; map/media blocks do not displace required information.

## 7. Layout dependency rules

Layout does not determine final brand style, product category, shipping/provider policy, staff authority, or data values. It consumes the Phase 2 route hierarchy and Phase 4 data state through semantic patterns only.

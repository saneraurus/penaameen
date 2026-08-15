# PENA AMEEN Frontend Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory future frontend rules based on the proposed Next.js App Router architecture. No Next.js files, routes, components, CSS, or configuration are created.

## 1. Rendering and boundary rules

- Use server-rendered routes by default for public/indexable content, product, category, education, article, branch, help, policy, sitemap, robots, and redirect behavior.
- Use client components only when browser interaction is required: cart controls, search/refinement, forms, checkout input, media selection, and limited admin interaction.
- Client components receive minimal validated view data and submit intent; they do not own business state, authorization, persistence, provider calls, SEO policy, or secrets.
- Private account/cart/checkout/order/tracking/admin routes resolve server session/ownership/capability before rendering protected data.

## 2. Route and layout rules

- Implement only Phase 2 approved route families and documented redirect treatments.
- Do not add `/about/` duplicate, `/blog/[slug]/` duplicate, `/shop/[category]/` duplicate, unsupported ACM product category, seller routes, or query-generated public route without IA/SEO approval.
- Layouts align to public, commerce, education/content, account, admin, and task/private boundaries.
- Breadcrumbs reflect logical IA, not fabricated URL ancestry.
- Cart/checkout/account/order/tracking/admin/search query states remain non-indexable/private as specified.

## 3. Data fetching and mutations

| Rule | Constitution |
|---|---|
| Reads | Server route/layout/query layer calls approved application services/read models; UI never calls database directly |
| Public cache | Cache/revalidate only approved public published data; product price/stock revalidate before mutation |
| Private cache | Cart, checkout, account, order, tracking, admin are private/no shared cache by default |
| Mutation | Route handler/API/approved Server Action validates input/session/CSRF then calls application service |
| Forms | Client feedback is assistive; server/domain validation is authoritative |
| URL state | Query/filter/sort/pagination state is bounded, allowlisted, non-indexable where specified, and never a hidden business state |
| Optimism | Only reversible low-risk UI interactions; never optimistically mark money, stock, shipment, refund, access, or publish state success |

## 4. Loading, error, empty, and state rules

- Every route/component follows `UI-STATE-SYSTEM.md` and has meaningful loading, empty, error, unavailable, partial, processing, and retry behavior when applicable.
- Do not show empty catalog/content as a successful result when a query/provider/permission failure occurred.
- Payment/shipment/order success uses server-authoritative normalized state only.
- Error boundaries log safe correlation context and render safe recovery without secrets/PII.
- Preserve safe form/cart context across retry/interruption; revalidate before action.

## 5. Accessibility and responsive rules

- Follow semantic HTML, keyboard/focus, screen-reader, form, dialog, table, image, contrast, motion, and touch requirements from accessibility/design systems.
- Mobile behavior follows responsive design rules; no essential Shop, Cart, Checkout, Tracking, Help, or Account action disappears on compact view.
- Do not use unapproved brand values; consume semantic tokens/components after final values are approved.

## 6. Prohibited frontend behavior

- Direct provider SDKs, database drivers, ORM calls, secrets, raw webhook/payment/shipping data, or authorization rules in UI.
- Client-only public SEO content or metadata that server rendering should provide.
- Duplicated server state in global client store without documented reason.
- Unbounded client fetches, PII in URL/query/local storage, browser-only inventory/payment success logic, provider-specific checkout screen assumptions, or hardcoded policy/brand values.

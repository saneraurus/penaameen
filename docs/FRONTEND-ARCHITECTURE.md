# PENA AMEEN Frontend Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED Next.js, React, TypeScript, and Tailwind-oriented architecture. No application, component, route, CSS, framework, or dependency is created by this document.

## 1. Frontend architecture goal

The frontend must render the 31 public/customer-visible Phase 2 route patterns as SEO-first, accessible, responsive experiences while keeping cart, checkout, account, tracking, and admin state secure and server-authoritative.

## 2. Proposed Next.js application model

| Concern | Proposed architecture | Why | Status |
|---|---|---|---|
| Routing | Next.js App Router aligned to Phase 2 route inventory | Supports nested layouts, server rendering, metadata, redirects, and route-level loading/error boundaries | PROPOSED |
| Language | TypeScript strict application contracts | Reduces route/domain/API ambiguity before commerce implementation | PROPOSED |
| Rendering | Server Components by default for data-backed public/admin/account pages | Keeps public HTML/metadata server-rendered and limits client JS | PROPOSED |
| Client Components | Only for browser interaction: cart controls, search input/refinement, checkout forms, upload controls, dynamic admin tables where needed | Keeps interactivity narrow and avoids client-side authority | PROPOSED |
| Styling | Tailwind CSS plus owned accessible component primitives | Supports future Phase 5 design system and responsive tokens without visual-library lock-in | PROPOSED |
| Forms | Server-validated form intent; client validation only improves feedback | Prevents browser-only business validation | PROPOSED |
| Mutations | API route handlers/application services; Server Actions only if they call identical service contracts | Avoids duplicate business logic and supports future consumers | PROPOSED |

## 3. Route-to-layout architecture

| Phase 2 route family | Proposed layout boundary | Rendering posture | Private/cache posture |
|---|---|---|---|
| `/`, `/shop/`, `/product-category/*`, `/product/*` | Public commerce layout | Server-rendered; cache/revalidate eligible data | Shared cache only for public validated content; cart state private |
| `/education/*`, `/blog/`, `/[article-slug]/`, retained archives | Public content layout | Server-rendered with metadata/structured data | Cache/revalidate published content; no client-only article core |
| `/branches/*`, `/events/*`, `/galeri-kegiatan/`, `/profile/`, `/contact/`, `/faq/`, `/legal/*` | Public informational/help layout | Server-rendered | Cache only approved public content; conditional routes require source data |
| `/search/` | Public utility layout | Server renders initial query state; client enhancement optional | Query result non-indexable; query-specific cache controlled |
| `/cart/`, `/checkout/`, `/order/confirmation/*`, `/tracking/*` | Private commerce-task layout | Server resolves authorized/session state; client used for form/task interaction | No shared cache; no indexability |
| `/account/*` | Account layout | Server resolves session/ownership | Private, no shared cache, non-indexable |
| `/admin/*` | Admin layout | Server resolves staff/capability context | Private, no shared cache, non-indexable |
| `/sitemap.xml`, `/robots.txt` | System route handlers | Server-generated system output | Cache only validated current output |

## 4. Server and client component rules

### Server Components by default

Use server-rendered components for:

- public page shells, content, product/category/article/branch data, metadata, breadcrumbs, canonical links, structured-data input, SEO redirects;
- account/admin initial authorization and read models;
- cart/checkout/order/tracking initial authoritative state;
- policy/help content;
- data that uses secrets or must not enter browser payloads.

### Client Components only when interaction requires browser state

Use client components for:

- quantity controls, add/remove cart controls, cart feedback;
- search input, autocomplete presentation, filter/sort controls;
- checkout input state and accessible validation feedback;
- media upload selection/progress presentation;
- admin bulk-selection/table interaction where justified;
- progressive enhancement of tracking refresh display.

A client component must receive minimal, permission-appropriate data and must not encode payment, shipping, inventory, authorization, redirect, or SEO business rules.

## 5. Data fetching and mutations

### Read path

```text
Route / server component
→ server-only application query service
→ repository/read model
→ validated view model
→ rendered HTML and limited client props
```

Public data requests must respect published/active/indexable state. Private/admin reads must resolve session/capability/ownership before returning data.

### Mutation path

```text
Interactive client or HTML form
→ API route handler or approved Server Action
→ request/session/CSRF validation
→ application service
→ transaction and outbox
→ authoritative response/revalidation signal
→ accessible success/error/recovery state
```

No browser mutation may directly write data or call a payment/shipping provider using secret credentials.

## 6. Forms and validation

| Form class | Client role | Server/domain role | Error/recovery requirement |
|---|---|---|---|
| Cart update | Immediate input feedback | Validate product/variant/quantity/availability/price before authoritative update | Retain safe context; explain unavailable/changed item |
| Checkout | Required-field guidance and progressive state | Validate customer/destination/shipping/payment/order-policy state | Field errors, no-rate, stale quote, price/stock change, pending payment recovery |
| Account/auth | Usability feedback only | Identity/session/recovery/ownership validation | Generic safe recovery; avoid account enumeration |
| Tracking lookup | Input guidance | Approved lookup/authorization validation | Do not expose unrelated order information |
| Admin product/content | Field guidance | Staff permission, publish/SEO/route/lifecycle validation | Explain unsafe URL/media/category/publish state |
| Admin order/shipping | Action confirmation state | Capability, order/payment/fulfillment/shipment transition validation | Idempotent/no-duplicate/exception handling |

## 7. Loading, error, empty, and recovery architecture

Each route family needs explicit non-visual state contracts:

| Route family | Loading | Empty | Error/recovery |
|---|---|---|---|
| Shop/category/search | Preserve route/context; skeleton semantics decided later | No eligible products/results with browse/refine path | Retry/search/navigation without claiming data completeness |
| Product | Preserve identity if media/secondary data delayed | Not applicable for active product | Unavailable/retired route follows documented redirect or not-found behavior |
| Content/hub | Preserve semantic heading/context | No retained content only if route not published | Retry or safe public fallback; no empty indexable archive |
| Cart/checkout | Preserve current task state safely | Empty cart recovery to Shop | Validation/retry/support path; no false order/payment result |
| Tracking/account | Preserve authorized state only | No orders/history is honest | Sign-in/lookup/support without data disclosure |
| Admin | Preserve authorized work context | Empty work queue is valid | Permission/action/provider failure shown with retry/manual-review path |

Error boundaries must log correlation IDs server-side and show user-safe messages. They must not turn a provider/database failure into a successful checkout/shipment state.

## 8. Optimistic UI rules

Optimistic UI is permitted only for reversible, low-risk interactions whose server response remains authoritative.

| Allowed candidate | Conditions |
|---|---|
| Cart quantity/remove visual feedback | Must reconcile server validation; restore state and explain failure on conflict/unavailability. |
| Search/filter presentation | Must not change canonical/indexability or invent result availability. |
| Draft content/admin form affordance | Must not claim publish/SEO/redirect success until server confirmation. |

Never optimistic-authoritatively mark payment paid, order confirmed, inventory reserved, shipment created, AWB generated, label printed, tracking delivered, refund completed, or staff permissions changed.

## 9. Caching and revalidation

- Render public approved content/products with cache policy appropriate to freshness and invalidation.
- Revalidate affected public routes after approved product/content/category/SEO/redirect changes through server/worker orchestration.
- Keep cart, checkout, account, order, tracking, admin, and webhook state private/no-store by default.
- Revalidate product availability/price/inventory before cart/checkout/order mutation even if a public page is cached.
- Avoid client-side cache as the authority for server state.

## 10. SEO rendering architecture

Indexable routes must server-render:

- primary textual content/product information;
- title, description, canonical, robots intent, Open Graph data;
- applicable structured-data inputs;
- breadcrumbs and internal links;
- accessible image alternatives from approved media metadata.

Search, filter, cart, checkout, order, tracking, account, and admin routes are non-indexable and must not leak private values into rendered metadata.

## 11. Accessibility and responsive architecture

- Semantics, heading hierarchy, labels, focus order, keyboard operations, live error/status feedback, and non-color-only states are application architecture responsibilities, not merely design polish.
- Route layouts must support mobile-first navigation rules from `docs/NAVIGATION-SYSTEM.md`.
- Loading/error/empty states must remain understandable with assistive technology.
- Images require alt-text data architecture and approved rights; media cannot be treated as decorative by default.
- Responsive route layout must not omit cart, checkout, policy, tracking, or support actions on constrained screens.

## 12. Frontend boundaries and deferred choices

No visual design system, component library, form library, state-management library, router plugin, analytics SDK, auth SDK, payment SDK, shipping SDK, or upload library is selected in Phase 3. Those choices must honor this architecture after data/design/implementation constitution approval.

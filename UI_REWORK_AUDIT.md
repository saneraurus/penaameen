# UI_REWORK_AUDIT

**Scope:** Total visual rebirth of the PENA AMEEN public site and admin panel.
**Constraint:** Zero functional, backend, API, database, auth, payment, shipping, or business-logic change.
**Date:** 2026-08-22

---

## 1. Every page reworked

| Route | File | Visual treatment |
|---|---|---|
| `/` | `src/app/page.tsx` | Rebuilt as a 13-scene image-led narrative (moment → manifesto → commitments → methods → journey → audiences → product → voices → community → quote → reading → invitation) |
| `/produk` | `src/app/produk/page.tsx` | Editorial catalogue: 4:5 portrait imagery, hairline filters, quiet metadata, no card chrome |
| `/produk/[slug]` | `src/app/produk/[slug]/page.tsx` | Product story: large imagery, sticky purchase rail, editorial detail tabs, review typography |
| `/keranjang` | `src/app/keranjang/page.tsx` | Calm two-column cart, image-forward rows, sticky summary, image-led empty state |
| `/orders` | `src/app/orders/page.tsx` | Editorial order ledger, hairline rows, text-first status system |
| `/checkout/success` | `src/app/checkout/success/page.tsx` | Quiet confirmation with definition-list receipt |
| `/artikel` | `src/app/artikel/page.tsx` + `ArticleListClient.tsx` | Publication front page: lead story + secondary grid |
| `/artikel/[slug]` | `src/app/artikel/[slug]/page.tsx` | Editorial reading experience: centered masthead, full-bleed hero, narrow reading column |
| `/admin` | `src/app/admin/page.tsx` | Operations cockpit: dense metrics, work queues, order feed |
| All `/admin/*` | `src/app/admin/layout.tsx` | New shell, responsive rail |
| `/shop`, `/search`, `/education` | unchanged pages | Restyled via shared `Container` + `StatusMessage` primitives only |

Routes intentionally **not** given invented content: `/shop`, `/search`, `/education` remain
governance-gated foundation routes per `docs/COMMERCE-IA.md` and `PROJECT.md`.

---

## 2. Every component reworked

**New presentation system**

- `src/components/ui/primitives.tsx` — Shell, Section, Eyebrow, SceneIndex, SectionHeading, Lede, ActionLink, TextLink, buttonClass, Badge, Skeleton, EmptyState, ErrorState, Price
- `src/components/story/StoryScene.tsx` — CinematicScene, SplitScene, EditorialFigure, PullQuote

**Rebuilt**

- `src/presentation/components/header.tsx` — quiet floating nav, animated rules, full-surface mobile navigation with serif index list
- `src/presentation/components/footer.tsx` — ink closing statement + structured link columns
- `src/components/sections/HeroSection.tsx` — full-bleed photographic opening scene
- `src/components/cart/CartIcon.tsx` — 44px touch target, accessible cart label
- `src/components/motion/Reveal.tsx` — narrative-weighted reveal + RevealGroup
- `src/presentation/components/admin/AdminSidebar.tsx` — grouped dark rail + mobile operations bar
- `src/presentation/components/admin/AdminHeader.tsx` — operations masthead
- `src/presentation/components/admin/DataTable.tsx` — hairline table, semantic headers, restyled pagination
- `src/presentation/components/admin/WorkQueueCard.tsx` — accent rail, numeral-first
- `src/presentation/components/foundation/container.tsx`, `status-message.tsx` — aligned to new system

---

## 3. Animation system

| Tier | Motion |
|---|---|
| Micro | Button lift, icon translate, cart bump, focus transitions |
| Small | Nav rule scale-x, dropdown fade, card hover, tab underline |
| Medium | Scroll reveals (`Reveal` variants), image zoom on hover |
| Large | Hero entrance stagger, mask reveal, scene reveals |

Keyframes: `fade-in`, `rise-in`, `mask-reveal`, `drawer-in`, `shimmer`, plus retained assistant/chat animations.
All motion resolves to the final visible state and never gates interaction.
`prefers-reduced-motion` disables transitions, animations, and hover zoom.

---

## 4. Design system

`src/app/globals.css` rebuilt around **warm ink on parchment**:

- **Ink (primary)** — deep scholarly green-black ramp
- **Parchment (secondary)** / **Background** — warm paper canvas
- **Clay (accent)** — terracotta-amber for narrative emphasis
- **Supporting** — warm neutrals (no cold blue-grey)
- Semantic tokens: surfaces, text, borders, status, shadows, easing, durations, z-index
- Editorial type: `display-type`, `lede`, `eyebrow`, `scene-index`, `meta-type`, dramatic clamp scale
- Layout: `container`, `container-narrow`, `container-wide`, `section-y`, `text-measure`
- Surfaces: `surface-card`, `image-frame`, `image-scrim`, `admin-panel`, `admin-rail`

---

## 5. Image storytelling system

Images are the protagonist, never decoration:

- **CinematicScene** — full-bleed, min 88svh, ink scrim, type over photograph
- **SplitScene** — portrait image paired with meaning, reversible
- **EditorialFigure** — variable ratios (portrait/square/landscape/cinema)
- Scrims (`image-scrim`, `image-scrim-soft`) guarantee text contrast over photography

**All imagery is existing PENA AMEEN assets.** No stock, no fabricated product photography.
Assets used: `hero/`, `editorial/`, `methods/`, `products/`, `gallery/`, `journey/`.

---

## 6. Mobile-first rework

- Recomposed rather than shrunk: mobile navigation is a full-surface serif index, not a mini menu
- Fluid clamp typography and gutters across 320 → 1440+
- Touch targets ≥ 44px (nav, cart, quantity, filters, CTAs)
- Product detail keeps a mobile purchase bar; cart summary unsticks and stacks
- Admin gains a real mobile operations bar with expandable grouped navigation
- Horizontal scroll regions use `scrollbar-none` with no layout overflow

---

## 7. Accessibility

- Semantic landmarks, ordered headings, `sr-only` labels for icon-only controls
- Breadcrumbs use `<ol>` with `aria-current="page"`
- Tables use `scope="col"`; metrics use `<dl>`
- `aria-pressed` on filters/tabs, `aria-expanded` on disclosures
- Status carried by **text**, never colour alone (orders, work queues, StatusMessage)
- Visible focus ring preserved unlayered so utilities cannot remove it
- Cart icon announces item count; loading states expose `role="status"`
- Reduced-motion fully honoured

---

## 8. Performance

- No new dependencies
- Dynamic imports retained and extended on the homepage
- Server Components unchanged; no client-boundary conversions
- `next/image` with explicit `sizes` everywhere; `priority` only on hero/LCP
- CSS-driven motion preferred over JS
- Build: 68 routes generated successfully

---

## 9. Admin rework

Precise, calm, information-dense — not a SaaS template:

- Dark grouped navigation rail (Operasi / Katalog / Keuangan / Konten / Sistem)
- Emoji icons replaced with numeric/textual markers
- Metrics: numeral-first, one emphasis panel
- Work queues with accent rails and explicit status labels
- Order feed as hairline list, monospace references
- Empty/loading states are deliberate, not filler

---

## 10. Functionality verification

Preserved exactly:

- Cart: `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, flying-blob animation, toast timing
- Product detail: `handleAddToCart`, `handleBuyNow`, sign-in redirect guards, quantity clamping to `product.stock`
- Orders: 4s polling, focus listener, localStorage mirror, filter predicates
- Checkout success: `clearCart` on mount, order fetch, pending branch
- Catalogue: `/api/products` fetch, search/category filtering, `setSearchQuery`
- Admin: `requireStaffActor("orders:read")` and all capability checks
- Hero: search submit → `/produk?q=`, quick tags, tab switching
- Every route, href, and destination unchanged

---

## 11. API contract verification

`git diff src/app/api` → **empty**. No endpoint, method, payload, or response shape touched.
All UI continues to consume `/api/products`, `/api/products/[slug]`, `/api/orders`, `/api/orders/[id]` identically.

---

## 12. Backend integrity

`git diff` across `src/app/api`, `src/application`, `src/domain`, `src/infrastructure`,
`src/lib`, `src/context`, `src/proxy.ts`, `prisma` → **completely empty**.

Untouched: Prisma, database, Clerk auth, authorization, capabilities, middleware/proxy,
Midtrans, Casaku, shipping, webhooks, notifications, order state machine, pricing, stock,
validation, provider config, environment variables.

---

## 13. Files changed

**Design system (1)** — `src/app/globals.css`
**New components (2)** — `src/components/ui/primitives.tsx`, `src/components/story/StoryScene.tsx`
**Pages (10)** — home, produk, produk/[slug], keranjang, orders, checkout/success, artikel, artikel/[slug], ArticleListClient, admin
**Components (10)** — header, footer, HeroSection, CartIcon, Reveal, SiteLayoutWrapper, AdminSidebar, AdminHeader, DataTable, WorkQueueCard, foundation container + status-message
**Layout (1)** — `src/app/admin/layout.tsx`

Pre-existing unrelated working-tree changes (`next.config.ts`, `package.json`,
`docs/STEP-12-*`, `scripts/launch-gate.mjs`, launch-gate tests) were **not** authored or modified here.

---

## 14. Files intentionally untouched

All API routes · Prisma schema and client · payment (Midtrans/Casaku) · shipping · webhooks ·
cart/checkout/order services · auth and authorization · security/audit/idempotency ·
data files (`src/data/*`) · route URLs · SEO metadata, sitemap, robots · business rules

---

## 15. Test results

```
npm run format    ✓ All matched files use Prettier code style
npm run lint      ✓ 0 errors, 0 warnings (--max-warnings=0)
npm run typecheck ✓ tsc --noEmit clean
npm test          ✓ 45 files, 158/158 passed
```

No test was weakened, skipped, or deleted. All locked copy, roles, and interaction
contracts (hero tabs/search, testimonials, journey, timeline, featured product,
branches, status-message, site-header) were preserved by design.

---

## 16. Build results

```
npm run build     ✓ Compiled successfully
                  ✓ 68/68 static pages generated
```

Note: the build previously failed at `/artikel` prerender due to an offline local
PostgreSQL. With the database reachable it now completes fully.

`npm run test:e2e` was **not** run — the Playwright browser runtime remains
unavailable in this environment (a documented pre-existing blocker in `PROJECT.md`).

---

## 17. Remaining visual issues

1. **Browser visual QA not performed** — no runtime available; layouts verified by build,
   types, and tests rather than rendered inspection across 320→1440px.
2. **Brand values remain provisional** — colours and fonts are still client-gated by
   `docs/BRAND-DESIGN-SYSTEM.md` (`CDR-029`). The palette is a reversible interpretation,
   not an approved identity.
3. **`/shop`, `/search`, `/education` remain content-gated** — restyled but deliberately
   not populated, since inventing catalogue or search content would violate the Unknown Policy.
4. **Secondary pages carry the new system only via shared primitives** — `/tentang`,
   `/sejarah`, `/cabang`, `/metode`, `/kontak`, `/galeri-kegiatan` inherit the new tokens,
   header, and footer but retain their existing internal section composition.
5. **E2E regression unverified** — requires the Playwright runtime.

---

## Final verdict

**VISUAL REBIRTH DELIVERED — FUNCTIONALITY PRESERVED.**

The public site and admin panel no longer resemble the previous design: new colour world,
new typographic voice, new layout logic, image-led narrative structure, new navigation,
new commerce presentation, and a new operations cockpit.

The engine was never touched. Protected-path diff is empty, all 158 tests pass, lint and
types are clean, and the production build generates all 68 routes.

Outstanding: browser visual QA, E2E execution, and formal brand approval.

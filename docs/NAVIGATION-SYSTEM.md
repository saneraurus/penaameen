# PENA AMEEN Navigation System

**Phase:** 2 — Information Architecture

**Status:** PROPOSED structure and behavior. This document intentionally defines navigation semantics, destinations, and states without designing a visual header, menu, component, interaction animation, or authentication implementation.

## 1. Navigation roles

| Layer | Job | Proposed contents |
|---|---|---|
| Primary navigation | Move between the few public destinations a visitor most often needs. | Shop, Education, Branches, Profile/About, with brand link to Home. |
| Secondary navigation | Expose purposeful children of the current primary context. | Shop categories/search; Education hubs/articles; approved branch/events/gallery destinations. |
| Utility navigation | Complete a direct task. | Search, Cart, Account, Track order. |
| Contextual navigation | Continue the current content or commerce journey. | Breadcrumbs, related content/products, checkout progression, tracking/support links. |
| Footer navigation | Offer durable trust, help, policy, and lower-frequency destinations. | Shop, Education, PENA AMEEN, Help, Legal groups. |

The navigation system must make Shop discoverable before a visitor understands the education taxonomy, while allowing content to lead naturally into relevant products.

## 2. Desktop navigation structure

### 2.1 Standard public header

```text
Brand/Home | Shop | Education | Branches | Profile/About || Search | Cart | Account / Track order
```

- The brand/home destination is always available.
- Primary labels open or route to their own destination; a label must not be a dead-end-only menu trigger.
- The number and labels of primary items remain subject to `CDR-026`, but the proposed model must stay within this simple structure.
- Search, Cart, and Account/Tracking are utilities. They are not mixed into the editorial primary menu.
- A current-page indicator should communicate context semantically; final visual treatment is a design-system decision.

### 2.2 Desktop primary item behavior

| Item | First action | Secondary choices | Boundary |
|---|---|---|---|
| Shop | Go to `/shop/` | Retained product categories; product search | Product tags, variants, and filters do not become header menu nodes. |
| Education | Go to `/education/` | AL-BARQY; ACM; Articles/Blog; retained content archive links where approved | Do not create separate top-level Blog, AL-BARQY, and ACM labels. |
| Branches | Go to `/branches/` | Approved branch list; Events; Gallery | Events/Gallery appear only when their content/rights/source decision permits. |
| Profile/About | Go to `/profile/` | Contact; approved FAQ/policy reference | A second `/about/` route is not created merely for a label change. |
| Search | Go to or activate `/search/` | Scope suggestion only after a query/context exists | Search must not expose private/admin data. |
| Cart | Go to `/cart/` | None required | Cart remains task-focused; no checkout action until valid cart context exists. |
| Account / Track order | Go to approved account or tracking entry | Sign in; account overview; track order, depending state/policy | Account use is not presumed mandatory for checkout/tracking. |

## 3. Mobile navigation structure

### 3.1 Mobile principles

- The same destination hierarchy is preserved, but it is grouped rather than flattened into a full desktop sitemap.
- The brand/home link, Search, Cart, and access to the mobile menu remain available in the approved mobile header structure.
- Mobile menu sections are ordered by user intent: Shop, Education, Branches, Profile/About, Help, then Legal/footer-level items.
- Checkout, cart, account, and tracking retain direct task paths; they are not hidden inside deep editorial menus.
- A menu open state must not lose cart/search/account context or confuse the current route.

### 3.2 Proposed mobile menu hierarchy

```text
Mobile menu
├── Shop
│   ├── All products
│   ├── Retained categories
│   └── Search products
├── Education
│   ├── AL-BARQY
│   ├── ACM
│   └── Articles
├── Branches
│   ├── Branch list
│   ├── Events                 [if retained]
│   └── Gallery                [if retained]
├── Profile / About
├── Help
│   ├── Contact
│   ├── FAQ                    [if approved]
│   └── Track order
└── Legal / policy
```

The actual disclosure behavior, labels, tap targets, focus management, and animation are design/accessibility implementation work. The IA requirement is that a category, tag, archive, policy, or account route does not require arbitrary multi-level traversal.

## 4. Header and utility actions

| Action | Destination/state | Availability | Purpose | Constraint |
|---|---|---|---|---|
| Home | `/` | All public routes | Reorient user | Must not erase current checkout/order state without a clear intentional action. |
| Search | `/search/` | All public routes except staff-only routes | Find public products/content | Query pages are non-indexable and must not search private data. |
| Cart | `/cart/` | All public commerce routes | Review purchase | State reflects cart context, not a promise of inventory reservation. |
| Account | `/account/` or `/account/login/` | When approved account capability exists | Reach approved self-service | Guest checkout/account policy is unresolved. |
| Track order | `/tracking/` | Public/help context | Reach safe post-purchase lookup/support | Lookup factors, authorization, and result detail remain client/security decisions. |
| Contact/help | `/contact/` / help footer/context | Public and recovery states | Reach verified support path | Contact channels/hours are not invented. |

## 5. Navigation states

| State | Primary navigation behavior | Utility behavior | Contextual/secondary behavior | SEO/privacy guardrail |
|---|---|---|---|---|
| Logged out | Shows public hierarchy. | Account opens sign-in/account-entry only if enabled; Track order opens approved lookup. | Education/Shop/Branch links stay public. | No order/profile history appears in navigation. |
| Logged in | Same public hierarchy. | Account leads to account overview; Cart reflects approved persistence; Track order can lead to authorized order context. | Account may show order/history links only within authorized account space. | Account routes remain non-indexable/private. |
| Cart empty | Shop and Education remain normal. | Cart leads to empty-cart recovery and Shop/Search paths. | No checkout route is presented as ready. | Cart is non-indexable. |
| Cart with items | Shop remains available for continuing discovery. | Cart leads to current cart; checkout becomes a valid contextual next step. | Cart can return to the category/product context where helpful. | Cart/checkout state is non-indexable and must not expose private data. |
| Search active | Public primary hierarchy remains reachable. | Search keeps query/scope/refinement context. | Results offer product/content/category routes and a no-result recovery path. | Query/filter/sort pages are non-indexable. |
| Mobile menu open | Menu groups public hierarchy by intent. | Search/cart remain discoverable; account/tracking follows policy. | Current section can be apparent without relying on color alone. | Menu state does not create a new indexable URL. |
| Checkout in progress | Editorial navigation may remain available only as a deliberate exit path. | Cart/edit and approved help/policy links remain available. | Checkout progression is contextual, not primary navigation. | Checkout route/state is non-indexable. |
| Order/tracking state | Public primary hierarchy remains available as an intentional exit. | Tracking/account/support actions are prioritized. | Status links only reveal authorized current order/shipment context. | Confirmation/tracking result is non-indexable and access controlled by future policy. |

## 6. Contextual navigation rules

### Breadcrumb/context hierarchy

- Shop → retained category → product is the product hierarchy.
- Education → AL-BARQY or ACM hub → article is the education hierarchy, even where legacy article URLs remain at root.
- Branches → branch detail is the local/community hierarchy.
- Account → Orders → Order detail and Account → Profile/Addresses is the private hierarchy.
- Admin uses its own internal task hierarchy and never appears in public navigation.

Breadcrumbs must not manufacture a false URL parent. A legacy root-level article can present an Education contextual relationship without asserting that `/education/` is its URL parent.

### Related navigation

- A product may link to its category and relevant education content.
- An article may link to a relevant hub/category/product only when editorially justified.
- A hub may link to selected education content and products.
- A branch may link to verified branch/community/help context; regional commerce claims require data.

## 7. Footer behavior

Footer navigation is available from ordinary public content pages. It should remain available in a simplified form for cart/checkout/order contexts where this does not interrupt or compromise the task. Legal/policy and support access must remain reachable during checkout.

Do not use footer navigation as the only discovery path for a critical Shop, Education, Contact, Tracking, or policy destination.

## 8. Navigation governance

- A new primary item requires a clear high-frequency user purpose and a client-approved content/operational owner.
- A category/tag does not become a nav item simply because it exists in source data.
- A route that is `CLIENT DECISION REQUIRED` may appear only in an approved conditional/navigation state; it cannot be silently linked as a live primary destination.
- Changing a label does not authorize changing its migration-sensitive route.
- Navigation changes affecting indexable pages must be checked against `docs/LEGACY-URL-MAPPING.md`, `docs/SEO-IA.md`, and the eventual redirect matrix.

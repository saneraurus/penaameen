# PENA AMEEN Conceptual Product Information Architecture

**Phase:** 1 — Product Discovery
**Status:** PROPOSED conceptual IA. This is not the detailed routing, navigation-design, taxonomy, or redirect-matrix work reserved for Phase 2.
**Migration rule:** Existing URL treatment remains governed by `docs/SEO-MIGRATION-DATA.md`; an existing URL must not disappear without a documented migration decision.

## 1. Purpose and guardrails

This document describes the conceptual places and relationships users need in the product. It does not select final labels, URLs, templates, layout, or technology.

### Confirmed foundation

- The current site has Home, Profile, Komunitas, Mitra Cabang, Galeri Kegiatan, Artikel, Events, Produk, Cart, and Checkout intent.
- The source URL inventory includes product, product-category, product-tag, article, branch, gallery, `/shop/`, `/blog/`, `/events/`, WordPress-style category/tag/author archives, cart, and checkout patterns.
- AL-BARQY and ACM are core educational/content pillars.
- Public navigation should become simpler, not erase valid content or SEO destinations.

### IA requirements

| ID | Requirement |
|---|---|
| REQ-IA-001 | Public navigation must make shop, educational/content discovery, branch/community context, and help/contact easy to locate without presenting every page as a top-level item. |
| REQ-IA-002 | Commerce navigation must connect search, category/product discovery, cart, checkout, order success, tracking, and support. |
| REQ-IA-003 | Content architecture must connect articles, educational method pages, category/tag discovery, and relevant products through purposeful internal links. |
| REQ-IA-004 | Existing source URLs and indexed archive intent must be preserved or explicitly mapped; conceptual simplification must not imply deletion. |
| REQ-IA-005 | Staff administration must organize work by operational capability rather than force every staff responsibility into a distinct public or authentication role. |

## 2. Conceptual public architecture

```text
PENA AMEEN
├── Home
│   ├── Brand / method orientation
│   ├── Featured educational paths
│   ├── Selected product discovery
│   └── Approved trust/community signals
│
├── Shop
│   ├── All products
│   ├── Product categories
│   ├── Product detail
│   ├── Product search and results
│   ├── Product filters / sorting
│   └── Product-related educational content
│
├── Learn / Education                         [proposed grouping, final label TBD]
│   ├── AL-BARQY
│   ├── ACM
│   ├── Articles / Blog
│   ├── Article categories
│   ├── Tags (where retained or useful)
│   └── Educational landing pages / approved guides
│
├── Community / Branches                      [proposed grouping, final label TBD]
│   ├── Branch directory
│   ├── Branch detail
│   ├── Events
│   └── Gallery / activities
│
├── About / Help
│   ├── About / Profile
│   ├── Contact
│   ├── FAQ
│   └── Legal / policy pages
│
├── Commerce utility
│   ├── Cart
│   ├── Checkout
│   ├── Order success / pending-payment guidance
│   ├── Order lookup / tracking
│   └── Customer account (only if enabled)
│
└── Authorized staff administration            [not public navigation]
    ├── Dashboard
    ├── Products / inventory / categories
    ├── Orders / payments / fulfillment / shipping
    ├── Customers
    ├── Content / SEO / media
    ├── Branches / events where approved
    ├── Promotions / settings
    └── Reporting / operational exceptions
```

### Notes on terms

- **Shop** is the public product catalog concept. It should preserve or map the existing `/shop/` discovery intent; the final route decision is not made here.
- **Learn / Education** is a conceptual grouping for AL-BARQY, ACM, articles, and related resources. It does not replace existing category/article URLs without a migration decision.
- **Community / Branches** is a conceptual grouping. Whether community and events remain separate, merge, or archive is a content and client decision.
- **Tracking / order lookup** must be usable in the post-purchase journey. Its exact privacy/authentication design is undecided.
- **Customer account** must not be a prerequisite for cart/checkout unless the client explicitly approves that policy.

## 3. Navigation model

Navigation is a behavioral model, not a final UI specification.

### 3.1 Primary navigation — PROPOSED

The public primary navigation should contain only the most frequent orientation paths:

| Candidate item | Primary user purpose | Status / caveat |
|---|---|---|
| **Shop** | Browse or search PENA AMEEN products | MUST HAVE; preserve/migrate existing shop intent. |
| **Learn** or **Education** | Explore AL-BARQY, ACM, and articles | PROPOSED label; final label and hierarchy need Phase 2/client review. |
| **Branches / Community** | Find branch/community information, gallery, and approved events | PROPOSED grouping; active content inventory is incomplete. |
| **About** | Understand PENA AMEEN | SHOULD HAVE; existing Profile page must be preserved or mapped. |
| **Help / Contact** | Obtain support or contact information | MUST HAVE concept; exact support channels and content UNKNOWN. |
| **Cart** | Review purchase readiness | MUST HAVE commerce utility; may be represented as an icon/control rather than a text item. |

**Do not** place every category, article, policy, event, or account function in primary navigation by default.

### 3.2 Secondary navigation — PROPOSED

Secondary navigation should expose contextually relevant links without competing with core discovery:

- AL-BARQY and ACM method/campaign pages;
- product-category shortcuts;
- article categories and tags where useful and retained;
- branches, galleries, and events;
- FAQ, contact, policy, and order tracking;
- language/market options only if a client-approved strategy requires them.

Existing `Profile`, `Komunitas`, `Mitra Cabang`, `Galeri Kegiatan`, `Artikel`, and `Events` intent must be evaluated against the source export and URL matrix rather than silently removed.

### 3.3 Footer navigation — PROPOSED

The footer should provide durable, low-frequency and trust-oriented destinations:

| Footer group | Candidate destinations |
|---|---|
| Shop | Shop, key categories, cart, tracking/order help |
| Learn | AL-BARQY, ACM, articles, article/category discovery |
| PENA AMEEN | About/Profile, branches, community/gallery, events if retained, contact |
| Customer help | FAQ, shipping policy, return/refund policy, payment guidance, contact |
| Legal | Privacy policy, terms and conditions, other client-approved legal pages |

The exact legal content and social links are UNKNOWN; they must not be fabricated.

### 3.4 Commerce navigation — MUST HAVE

Commerce navigation must provide a clear path:

```text
Search / category / product card
       → product detail
       → cart
       → checkout
       → payment guidance / order confirmation
       → tracking / support
```

Required contextual links include:

- search entry point from shop (and potentially global header);
- product category breadcrumbs or equivalent contextual discovery;
- cart access with current cart context;
- checkout progression and a return-to-cart path;
- order confirmation or payment-pending next step;
- shipment tracking / order support once a shipment exists.

### 3.5 Content navigation — MUST HAVE

Content navigation must support:

- article archive/discovery;
- article category and tag discovery where source value warrants preservation;
- method-topic pages for AL-BARQY and ACM;
- relevant internal links from educational content to relevant category/product pages;
- relevant links from products to educational context where approved;
- branch/community/event context without implying a social-network feature.

### 3.6 Account navigation — CONDITIONAL

If a customer account is enabled, account navigation should group:

- profile;
- saved addresses if approved;
- order history;
- order detail;
- tracking;
- password reset/session support.

The following are **CLIENT DECISION REQUIRED** before final IA: guest versus account checkout policy, account registration timing, historical account migration, and whether non-authenticated order lookup is supported.

### 3.7 Admin navigation — CONCEPTUAL

Admin navigation is internal and capability-oriented:

```text
Dashboard | Orders | Products | Inventory | Customers | Content | SEO | Media | Branches | Promotions | Settings
```

A single staff member may need several capabilities. This model must not be interpreted as an authentication or permissions implementation.

## 4. Required conceptual destinations

| Destination | Why it exists | IA placement | Status |
|---|---|---|---|
| Home | Orient brand, education, commerce, and trust | Root / primary | MUST HAVE |
| Shop | Catalog browse/search entry point | Primary / commerce | MUST HAVE |
| Product categories | Browse meaningful catalog groupings | Shop / contextual nav | MUST HAVE |
| Product detail | Evaluate and purchase a product | Shop | MUST HAVE |
| Search | Find products and content efficiently | Shop/global utility | MUST HAVE |
| Cart | Edit purchase before checkout | Commerce utility | MUST HAVE |
| Checkout | Supply order, shipping, and payment information | Commerce utility | MUST HAVE |
| Order success / pending state | Explain next action after checkout/payment initiation | Commerce utility | MUST HAVE |
| Tracking | Post-purchase delivery visibility | Commerce utility/help/account | MUST HAVE |
| Customer account | Serve account holders if enabled | Account utility | CLIENT DECISION REQUIRED |
| Order history/detail | Self-service post-purchase support if account enabled; staff always need order detail | Account/admin | SHOULD HAVE for customers; MUST HAVE for staff |
| Articles / Blog | Education and organic discovery | Learn | MUST HAVE |
| Education | Method-focused paths for AL-BARQY/ACM | Learn | MUST HAVE |
| AL-BARQY | Core method/product content pillar | Learn/shop context | MUST HAVE |
| ACM | Core method/product content pillar | Learn/shop context | MUST HAVE |
| Branches | Community/local context | Community / footer | SHOULD HAVE; source completeness unknown |
| Events | Event discovery/archive if approved | Community | CLIENT DECISION REQUIRED |
| About / Profile | Organization context | About | SHOULD HAVE; source route is migration-sensitive |
| Contact | Support and contact path | Help/footer | MUST HAVE concept; channels unknown |
| FAQ | Reduce repetitive support questions | Help/footer | SHOULD HAVE |
| Legal/policy | Communicate approved legal/commerce policy | Footer/checkout context | MUST HAVE before launch; content unavailable |

## 5. Taxonomy and discoverability principles

### Product taxonomy

The existing taxonomy mixes method/brand (`al-barqy`, ACM references), format (`CD`, `flashcard`), and a catch-all (`Umum`). The target may eventually distinguish **categories**, **formats**, **methods**, **age/use cases**, or other facets, but this is **not yet a taxonomy decision**.

Requirements:

- Preserve existing category/tag URLs or explicitly map them (`REQ-SEO-001`, `REQ-SEO-006`).
- Do not collapse source taxonomy until product/catalog export and SEO review are complete.
- Let search and filters supplement taxonomy rather than force an unverified category redesign.
- Keep a user-facing hierarchy understandable even if source taxonomy needs transitional preservation.

### Content taxonomy

Existing article categories include ACM, Al-Barqy, Anak-Anak, Business, Kesehatan, Seminar, and Umum; tags and author archives are also evidenced. The complete source taxonomy and indexability are UNKNOWN.

Requirements:

- Retain a content-category/tag capability (`REQ-SEO-002`).
- Decide keep/merge/redirect/archive for each source archive only through the URL/content migration process.
- Avoid automatically exposing empty, duplicative, or unsupported archive pages after migration.

## 6. Migration and Phase 2 handoff

Phase 2 must turn this conceptual architecture into a detailed, approval-ready information architecture only after it uses:

1. a complete or explicitly bounded URL inventory;
2. source product, content, media, branch, and taxonomy exports;
3. approved product scope and client decisions;
4. a redirect decision for every indexed/valuable source URL;
5. a confirmed language/market strategy; and
6. approved navigation labels and hierarchy.

Until then, these points remain deliberately unresolved:

- final navigation labels and menu depth;
- final route patterns and trailing-slash rules;
- whether `/shop/`, `/blog/`, `/events/`, category/tag/author archives, and legacy WordPress routes are retained directly or redirected;
- exact product and content taxonomy/facet model;
- account/order lookup entry points;
- event/community/branch page treatment.

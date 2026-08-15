# PENA AMEEN Public Information Architecture

**Phase:** 2 — Information Architecture

**Status:** PROPOSED public hierarchy. Final labels and legacy-route actions remain subject to the client decisions and migration data identified in this document.

## 1. Public IA objective

The public experience must serve three connected intents without making visitors understand internal organization structure:

1. **Buy** — browse/search PENA AMEEN products and complete a purchase.
2. **Learn** — understand AL-BARQY, ACM, and approved educational content.
3. **Trust and get help** — find branches, profile information, contact, policy, tracking, and post-purchase support.

The public IA is deliberately shallower than the administrative IA. It is grounded in the current source's Shop, Blog, Events, branch, gallery, Profile, product, article, cart, and checkout evidence, while avoiding a direct copy of its crowded top-level menu.

## 2. Canonical public hierarchy

```text
PUBLIC
├── Home /
│   ├── Shop entry
│   ├── Education entry
│   ├── Branches / approved community entry
│   ├── Approved trust signals
│   └── Help / contact entry
│
├── Shop /shop/
│   ├── All products
│   ├── Retained product categories
│   │   ├── AL-BARQY                 [legacy category]
│   │   ├── Flashcard                [legacy category]
│   │   ├── CD                       [legacy category]
│   │   └── Umum                     [legacy category; review]
│   ├── Product detail /product/[slug]/
│   ├── Product search /search/?scope=products
│   └── Product tag archives          [conditional legacy treatment]
│
├── Education /education/
│   ├── AL-BARQY hub /education/al-barqy/
│   ├── ACM hub /education/acm/
│   ├── Articles /blog/
│   ├── Article detail /[article-slug]/
│   └── Retained article category/tag/archive routes [conditional]
│
├── Branches /branches/
│   ├── Branch detail /branches/[slug]/ [proposed target]
│   ├── Events /events/               [conditional]
│   └── Gallery /galeri-kegiatan/     [conditional/legacy-sensitive]
│
├── Profile /profile/
│
├── Help
│   ├── Contact /contact/
│   ├── FAQ /faq/
│   ├── Tracking /tracking/
│   └── Legal /legal/*
│
└── Commerce utility
    ├── Search /search/
    ├── Cart /cart/
    ├── Checkout /checkout/
    ├── Order confirmation /order/confirmation/[secure-reference]/
    └── Account /account/*            [conditional]
```

`[conditional]` does not mean the source asset can be deleted. It means public inclusion and/or target route needs a client/source-content decision while the legacy URL remains protected by the migration register.

## 3. Primary navigation — PROPOSED

| Item | Proposed destination | Why it is primary | What does not belong here | Status |
|---|---|---|---|---|
| Brand / home | `/` | Returns users to orientation, trust, and the highest-value discovery routes. | A separate textual “Home” item is unnecessary if the brand link is accessible. | MUST HAVE |
| Shop | `/shop/` | The core revenue/discovery path must be visible without requiring an education detour. | Individual categories, tags, cart, checkout, or product detail. | MUST HAVE |
| Education | `/education/` | Groups AL-BARQY, ACM, and articles under one understandable learning intent without making all three competing top-level labels. | Product category menus or sales-only routes. | MUST HAVE |
| Branches | `/branches/` | Existing branch/community intent and local SEO value warrant a dedicated public discovery path if active data is confirmed. | Unverified partner onboarding or a social-network feature. | SHOULD HAVE; active branch scope is a client decision |
| Profile / About | `/profile/` | Existing profile intent remains important for trust. The public label may be “About” while retaining the legacy-safe route. | Contact, FAQ, legal policy, gallery, events. | SHOULD HAVE; final label is a client decision |

**Candidate label note:** `Education`, `Branches`, and `Profile/About` are proposed labels. The final Indonesian-language label and whether Branches/Profile stay primary are captured by `CDR-026`.

## 4. Secondary navigation

Secondary navigation reveals purposeful children of the current primary context. It must not be a second full sitemap.

| Context | Secondary destinations | Why they belong here | Status |
|---|---|---|---|
| Shop | All products; retained product categories; product search | They support catalog exploration after a visitor has chosen Shop. | MUST HAVE |
| Education | AL-BARQY hub; ACM hub; Articles/Blog; retained category/archive links only where approved | They are learning/content paths, not primary competitors to Shop. | MUST HAVE / conditional for archives |
| Branches | Branch index; approved events; gallery | They are community/local context. Events and gallery require content/rights decisions. | SHOULD HAVE / CLIENT DECISION REQUIRED |
| Profile / About | Contact; approved FAQ/policy reference | They provide trust/support context without increasing top-level labels. | SHOULD HAVE |

Existing legacy product and content categories may appear in these contextual/secondary paths only after their retained/migration treatment is approved. Product tags and article tags are never default primary or secondary navigation items.

## 5. Utility navigation

Utility actions are task-based rather than editorial destinations.

| Utility action | Primary destination | User purpose | Logged-out behavior | Logged-in behavior | Status |
|---|---|---|---|---|---|
| Search | `/search/` | Find products, education, articles, retained categories, and approved help/branch content. | Open public search scope. | Same public search; no private results. | MUST HAVE |
| Cart | `/cart/` | Review a current intended purchase. | Shows current cart or empty-cart recovery. | Same, with only approved persistence behavior. | MUST HAVE |
| Account | `/account/` or `/account/login/` | Access approved profile/order history if account capability is enabled. | Sign-in/account entry or a clear account-not-required path. | Account overview. | CLIENT DECISION REQUIRED |
| Track order | `/tracking/` | Find eligible shipment/order status without making account mandatory. | Approved privacy-safe lookup entry. | Links to authorized order/tracking context. | MUST HAVE outcome; final lookup policy is a client decision |

Search, Cart, Account, and Tracking are not all required to be permanent text labels. This document defines their availability and behavior, not visual treatment.

## 6. Footer navigation

The footer is the durable home for lower-frequency, trust, policy, and discovery paths.

| Footer group | Destinations | Why |
|---|---|---|
| Shop | Shop; retained categories; Cart; Tracking | Reinforces commerce and post-purchase access without crowding primary navigation. |
| Education | Education; AL-BARQY; ACM; Articles | Preserves core topical discovery and supports organic/content navigation. |
| PENA AMEEN | Profile; Branches; approved Events; Gallery | Provides brand/community context, subject to source-data decisions. |
| Help | Contact; FAQ; payment/shipping guidance only when approved; Tracking | Gives a recovery path from any page. |
| Legal | Privacy; Terms; Shipping; Returns/Refunds; other approved policy pages | Legal/policy links must be stable and accessible, especially from checkout. |

Social links, newsletter signup, app links, marketplace/seller links, and unverified support channels are not assumed.

## 7. Contextual navigation

Contextual navigation is where relevance is strongest and must be editorially purposeful.

| Page/context | Contextual links | Guardrail |
|---|---|---|
| Product detail | Parent category; related approved product; relevant AL-BARQY/ACM/article context; cart | Do not show unverified product relationships or generic aggressive cross-sells. |
| Product category | Products; Shop; relevant education hub | Do not turn every product attribute into an indexable category link. |
| Article | Relevant education hub; related article; editorially relevant product/category | Product link is helpful only where it genuinely supports the reader’s intent. |
| Education hub | Supporting articles; related PENA AMEEN products/categories | Hub has a distinct explanatory/curated purpose, not a duplicate archive grid. |
| Branch | Other branches; approved local/contact information; approved relevant education/product/contact link | Do not assert product availability, local stock, or branch service without data. |
| Cart / checkout | Continue shopping; policy/help; tracking only after order context exists | Preserve checkout context; do not route to unrelated content. |
| Tracking / order state | Order/account support; contact; approved policy | Do not expose other customers’ details or public-index private state. |

## 8. Public-page inclusion rules

A public page belongs in the public IA only when it has all applicable elements:

- a clear visitor/crawler purpose;
- a stable or documented migration-safe URL treatment;
- an owner/source for its content or operational data;
- a discovery path through primary, secondary, footer, contextual navigation, or an approved redirect;
- an indexability decision appropriate to its purpose.

This keeps account, cart, checkout, confirmation, tracking results, search queries, admin destinations, empty/404 states, and unverified archives out of the ordinary public-content hierarchy even if users can reach them.

## 9. Deliberate exclusions from primary navigation

The following may exist but should not become independent primary labels by default:

- individual product categories and product tags;
- Blog/Articles as a separate peer to Education;
- AL-BARQY and ACM as separate peers to Education;
- Events and Gallery as separate peers to Branches;
- Contact, FAQ, legal/policy, Cart, Checkout, Tracking, Account, and Search;
- author/tag archives;
- customer or staff management;
- any seller/vendor destination.

## 10. Open decisions affecting public IA

- Final primary-navigation labels and whether Branches/Profile remain primary (`CDR-026`).
- Active branch list and destination data (`CDR-014`).
- Events/gallery retention, rights, and public inclusion (`CDR-015`, `CDR-016`).
- Account, guest checkout, and tracking/order lookup boundaries (`CDR-008`).
- Product/category/tag archive treatment and final source inventory (`CDR-006`, `CDR-011`, `CDR-022`).
- AL-BARQY/ACM hub/archive relationship (`CDR-027`).

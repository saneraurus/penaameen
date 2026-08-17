# PENA AMEEN Content-to-Commerce Map

**Phase:** 2 — Information Architecture

**Status:** PROPOSED relationship map. It defines useful pathways from discovery to trust to relevant PENA AMEEN products; it does not mandate aggressive cross-selling, ranking, automation, provider behavior, or unverified product claims.

## 1. Relationship principle

```text
SEO / direct / social discovery
        ↓
Useful education, content, branch, or brand context
        ↓
Trust and informed product discovery
        ↓
Relevant product/category evaluation
        ↓
Cart, checkout, payment, shipment, tracking
```

The correct outcome of a content visit may be further learning, contact, or exit — not necessarily a purchase. Product links appear only where they improve the reader’s next decision.

## 2. Core maps

### 2.1 Article to product discovery

```text
Article
├── related education hub
├── relevant product category
├── selected relevant product(s), when editorially justified
└── related article / FAQ / contact where product link is not appropriate
```

| Content entry | Appropriate commerce connection | Guardrail |
|---|---|---|
| AL-BARQY article | AL-BARQY hub → AL-BARQY product category → relevant approved product | Do not claim a particular package is suitable for a reader unless source/approved content supports it. |
| ACM article | ACM hub → product-family selection or verified related ACM product | Do not create a public ACM product category until catalog decision confirms it. |
| Parenting/child-learning article | Relevant education hub/category only when relationship is editorially clear | Do not invent age, ability, outcome, or product recommendation claims. |
| General informational article | Related article/FAQ/contact by default; product only when genuinely related | Do not force commerce links into unrelated Business/Kesehatan/Seminar/Umum content. |

### 2.2 Education hub to product discovery

```text
Education
└── [AL-BARQY or ACM hub]
    ├── method orientation and approved context
    ├── selected supporting articles
    ├── relevant product category/family
    ├── selected approved products
    └── Contact / FAQ where a purchase path is not sufficient
```

| Hub | Product relationship | Why it is useful | Boundary |
|---|---|---|---|
| `/education/al-barqy/` | Links to retained `/product-category/al-barqy/` and approved AL-BARQY products | Existing source proves both content and product-category significance | Hub must not duplicate the entire category archive or overstate method/product benefits. |
| `/education/acm/` | Links to approved ACM products based on product-family/method classification | Existing source proves ACM content and products, but not a public product category | Do not create `/product-category/acm/` or claim full ACM catalog until export/decision. |

### 2.3 Product detail to education/trust

```text
Product detail
├── parent product category
├── relevant method/education hub
├── approved usage/learning context
├── related product(s) when confirmed
└── Cart / help / policy context
```

The reverse relationship is important: a product buyer can understand why a material exists without requiring a separate marketing claim or a long content detour.

### 2.4 Branch to local information, contact, and commerce

```text
Branch
├── verified local information
├── approved branch/contact path
├── related community/event context, if active
└── relevant education/product information only when locally accurate and approved
```

No branch page may imply local stock, delivery service, class availability, regional eligibility, or seller ownership without verified operations data.

### 2.5 Home to multiple intents

```text
Home
├── Shop / product category
├── Education hubs
├── selected approved article
├── Branches / approved community context
├── Contact / help
└── Cart/Tracking utility
```

Home should route each intent without becoming an unstructured copy of every archive.

## 3. Link placement rules

| Source context | First contextual link | Optional second link | Avoid |
|---|---|---|---|
| Article | Related hub/category/article | One or more approved relevant product links | Product grid unrelated to article intent |
| Education hub | Primary product category/family | Selected supporting products and articles | Duplicate category/archive listing without explanatory value |
| Product detail | Parent category | Related hub/article/approved products | Unverified “best for” recommendations or irrelevant articles |
| Category | Products | Relevant education hub | Every content tag or attribute filter |
| Branch | Contact/branch index | Verified relevant education/product link | E-commerce promises based on unverified branch operations |
| Cart | Checkout or continue shopping | Help/policy | Content interruptions that obscure transactional task |
| Checkout/order/tracking | Task recovery/help/policy | Contact | Marketing cross-sell that conflicts with payment/support task |

## 4. Link data and governance

A content-to-commerce link should have one of these bases:

1. **Source-confirmed relationship** — present in product/content export or validated legacy content.
2. **Editorially approved relationship** — content owner validates relevance and claims.
3. **Taxonomy relationship** — product and content share an approved AL-BARQY/ACM classification.
4. **Operational relationship** — branch/contact/tracking help path is verified by PENA AMEEN operations.

No link should be generated solely from a keyword match, a generic cross-sell rule, presumed stock, presumed location, or unverified customer segment.

## 5. Internal-link coverage map

| Indexable route class | Inbound paths required | Outbound paths required |
|---|---|---|
| Home | Root/direct/SEO | Shop, Education, Branches, Profile/Help |
| Shop | Primary nav, home, footer, legacy redirect | Categories, products, search |
| Product category | Shop, footer/context, legacy redirect | Products, Shop, relevant education hub |
| Product | Category/Shop/search/content hub/article | Cart, category, relevant education/help |
| Education hub | Primary/secondary nav, home, article, legacy merge redirect | Articles, relevant category/products, help |
| Article | Blog/hub/category/related article, legacy route | Hub, relevant category/product, related content |
| Branch | Branch index, legacy redirect, footer/context | Contact, branch index, verified context |
| Profile/contact/FAQ/legal | Header/footer/help/checkout context | Relevant support/commerce routes only |

## 6. Anti-patterns explicitly excluded

- Do not automatically add “related products” to every article.
- Do not make all products link to all AL-BARQY/ACM content.
- Do not build a recommendation engine or behavioral personalization system.
- Do not use branches as regional seller/storefront pages.
- Do not add product links to payment failure, order confirmation, or tracking states merely for conversion.
- Do not rely on internal links to compensate for missing redirects, missing catalog data, or unclear taxonomy.
- Do not publish unsupported educational, health, literacy, parenting, availability, delivery, or testimonial claims.

## 7. Measurement connections

Subject to consent and later analytics decisions, the planned IA can measure pathway categories such as content view → hub/category/product click → cart/checkout. These events support discovery analysis but do not prove causation or override the authoritative order/payment state.

## 8. Open dependencies

- Complete product/content/media export and approved relationships.
- Editorial claims and method content approval.
- Active branch/event data and contact/support policies.
- Product taxonomy and ACM public-category decision.
- Analytics consent/event governance.

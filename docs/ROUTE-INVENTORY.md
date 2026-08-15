# PENA AMEEN Route Inventory

**Phase:** 2 — Information Architecture

**Status:** Proposed route inventory. Route patterns express information architecture and canonical intent, not a router implementation, security mechanism, data schema, or provider integration.

## 1. Route inventory

| ROUTE-ID | Path | Page | Type | Audience | Parent | Indexable | Canonical | SEO importance | Auth requirement | Commerce dependency | Content dependency | Migration dependency | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-PUB-001 | / | Home | Public landing | All public visitors | Root | Yes | Self | Critical | None | Context | Home content and approved trust paths | L-001 home | PROPOSED |
| R-PUB-002 | /shop/ | Shop | Public catalog | Visitors; customers | Home / primary Shop | Yes | Self | Critical | None | Core | Product/category data | L-022 shop | PROPOSED |
| R-PUB-003 | /product-category/[slug]/ | Product category | Public archive | Visitors; customers | Shop | Conditional | Self if retained | Critical/High | None | Core | Category description and eligible products | L-010 to L-013 categories | PROPOSED / conditional |
| R-PUB-004 | /product/[slug]/ | Product detail | Public product | Visitors; customers | Shop/category/search | Yes when active | Self | Critical | None | Core | Product/media/SEO data | L-015 to L-018 known products | PROPOSED |
| R-PUB-005 | /product-tag/[slug]/ | Product tag archive | Conditional legacy archive | Visitors; customers | Shop conceptually | Conditional | Noindex or redirect/merge by default | Medium | None | Context | Tag purpose/membership | L-014 product tag | BLOCKED |
| R-PUB-006 | /search/ | Public search | Public utility | Visitors; customers | Utility nav | No | Non-indexable query state | Low | None | Context | Eligible product/content index | New service route | PROPOSED |
| R-PUB-007 | /education/ | Education landing | Public hub index | Visitors | Primary Education | Yes | Self | High | None | Context | Approved hub/content links | New route | PROPOSED |
| R-PUB-008 | /education/al-barqy/ | AL-BARQY education hub | Public hub | Visitors | Education | Yes when approved | Self | High | None | Context | Approved AL-BARQY content/products | L-025 merge candidate | PROPOSED / conditional |
| R-PUB-009 | /education/acm/ | ACM education hub | Public hub | Visitors | Education | Yes when approved | Self | High | None | Context | Approved ACM content/products | L-019 and L-024 merge candidates | PROPOSED / conditional |
| R-PUB-010 | /blog/ | Blog / article archive | Public archive | Visitors | Education | Yes | Self | High | None | Context | Eligible article inventory | L-020 blog | PROPOSED |
| R-PUB-011 | /[article-slug]/ | Article detail | Public editorial | Visitors | Blog/Education conceptually | Yes when published | Self | High | None | Context | Article body/media/taxonomy | L-006 to L-009 known articles | PROPOSED |
| R-PUB-012 | /category/[slug]/ | Article category archive | Conditional legacy archive | Visitors | Blog conceptually | Conditional | Self if retained or merge/redirect | High/Medium | None | Context | Article membership/category content | L-024 to L-030 categories | BLOCKED |
| R-PUB-013 | /tag/[slug]/ | Article tag archive | Conditional legacy archive | Visitors | Blog conceptually | Conditional | Noindex or redirect/merge by default | Medium | None | Context | Tag purpose/membership | L-019 tag/acm | BLOCKED |
| R-PUB-014 | /author/[slug]/ | Author archive | Conditional legacy archive | Visitors | Blog conceptually | Conditional | Noindex or redirect/merge by default | Medium | None | Context | Author attribution/public policy | L-023 author | BLOCKED |
| R-PUB-015 | /branches/ | Branch index | Public local archive | Visitors | Primary Branches | Conditional | Self if active branch data approved | High local | None | Context | Active branch directory | New index plus L-004/L-005 | PROPOSED / conditional |
| R-PUB-016 | /branches/[slug]/ | Branch detail | Public local content | Visitors | Branches | Conditional | Self if active/accurate | High local | None | Context | Approved branch data/media | L-004/L-005 branch redirects | PROPOSED / conditional |
| R-PUB-017 | /events/ | Events archive | Conditional public archive | Visitors | Branches/community | Conditional | Self if continued | Medium | None | Context | Event inventory/content | L-021 events | BLOCKED |
| R-PUB-018 | /events/[slug]/ | Event detail | Conditional public content | Visitors | Events | Conditional | Self if retained | Medium | None | Context | Event data/media | Unknown source event URLs | BLOCKED |
| R-PUB-019 | /galeri-kegiatan/ | Gallery / activities | Conditional public page | Visitors | Branches/community | Conditional | Self if retained | Medium | None | Context | Approved gallery/media rights | L-003 gallery | BLOCKED |
| R-PUB-020 | /profile/ | Profile / About | Public organization page | Visitors | Primary Profile/About | Yes if retained | Self | High | None | Context | Approved organization content | L-002 profile | PROPOSED |
| R-PUB-021 | /contact/ | Contact | Public help page | Visitors; customers | Help | Yes | Self | Medium | None | Context | Verified contact/support content | Source route unknown | BLOCKED by support data |
| R-PUB-022 | /faq/ | FAQ | Public help page | Visitors; customers | Help | Conditional | Self if approved | Medium | None | Context | Approved FAQ/policy content | Source FAQ unknown | BLOCKED by policy/content |
| R-PUB-023 | /legal/privacy/ | Privacy policy | Public legal page | Visitors; customers | Legal | Yes when approved | Self | Medium | None | Context | Approved legal text | Source legal route unknown | BLOCKED by legal policy |
| R-PUB-024 | /legal/terms/ | Terms | Public legal page | Visitors; customers | Legal | Yes when approved | Self | Medium | None | Context | Approved legal text | Source legal route unknown | BLOCKED by legal policy |
| R-PUB-025 | /legal/shipping/ | Shipping policy | Public legal/help page | Visitors; customers | Legal | Yes when approved | Self | Medium | None | Context | Approved shipping policy | Source legal route unknown | BLOCKED by legal/shipping policy |
| R-PUB-026 | /legal/returns-refunds/ | Return/refund policy | Public legal/help page | Visitors; customers | Legal | Yes when approved | Self | Medium | None | Context | Approved return/refund policy | Source legal route unknown | BLOCKED by legal policy |
| R-PUB-027 | /cart/ | Cart | Commerce state | Customers | Utility / product | No | Non-indexable state | None | None | Core | Product/pricing/inventory state | L-031 legacy path unknown | PROPOSED |
| R-PUB-028 | /checkout/ | Checkout | Commerce state | Customers | Cart | No | Non-indexable state | None | Conditional | Core | Policy/help content only | L-032 legacy path unknown | PROPOSED |
| R-PUB-029 | /order/confirmation/[secure-reference]/ | Order outcome | Private commerce state | Customers | Checkout | No | Non-indexable private state | None | Conditional | Core | Notification/help policy context | New route | PROPOSED |
| R-PUB-030 | /tracking/ | Tracking entry | Public service entry | Customers | Utility / Help | No | Non-indexable service route | None | Conditional | Core | Approved tracking/help content | New route | PROPOSED |
| R-PUB-031 | /tracking/[secure-reference]/ | Tracking result | Private service state | Authorized customers | Tracking | No | Non-indexable private state | None | Conditional | Core | Tracking status/help context | New route | PROPOSED |
| R-SEO-001 | /sitemap.xml | XML sitemap | Crawler system route | Crawlers | Root | N/A | Canonical eligible URL list | High | None | Context | Published public route inventory | Source sitemap unknown | MUST HAVE before launch |
| R-SEO-002 | /robots.txt | Robots directive | Crawler system route | Crawlers | Root | N/A | System directive | Medium | None | None | Crawl/index policy | Source robots unknown | MUST HAVE before launch |
| R-ACC-001 | /account/ | Account overview | Private account | Authenticated customer | Utility Account | No | Non-indexable private route | None | Customer if enabled | Context | Account summary content | New conditional route | PROPOSED |
| R-ACC-002 | /account/login/ | Account login | Account service | Customer | Account | No | Non-indexable service route | None | No | Context | Account policy copy | New conditional route | CLIENT DECISION REQUIRED |
| R-ACC-003 | /account/register/ | Account registration | Account service | Customer | Account | No | Non-indexable service route | None | No | Context | Account/privacy policy copy | New conditional route | CLIENT DECISION REQUIRED |
| R-ACC-004 | /account/password-reset/ | Password recovery | Account service | Customer | Account | No | Non-indexable service route | None | No | Context | Account/support content | New conditional route | SHOULD HAVE if applicable |
| R-ACC-005 | /account/orders/ | Order history | Private account | Authenticated customer | Account | No | Non-indexable private route | None | Customer if enabled | Core | Order history data | Historical-order migration decision | SHOULD HAVE if accounts enabled |
| R-ACC-006 | /account/orders/[order-reference]/ | Account order detail | Private account | Authenticated customer | Account orders | No | Non-indexable private route | None | Customer if enabled | Core | Order/payment/shipment context | Historical-order/access decision | SHOULD HAVE if accounts enabled |
| R-ACC-007 | /account/profile/ | Profile | Private account | Authenticated customer | Account | No | Non-indexable private route | None | Customer if enabled | Context | Customer/profile policy | New optional route | OPTIONAL |
| R-ACC-008 | /account/addresses/ | Saved addresses | Private account | Authenticated customer | Account | No | Non-indexable private route | None | Customer if enabled | Context | Address/privacy policy | New optional route | OPTIONAL |
| R-ADM-001 | /admin/ | Admin dashboard | Private admin | Authorized staff | Admin root | No | Internal task route | None | Staff | Context | Operational indicators | New admin route | MUST HAVE concept |
| R-ADM-002 | /admin/products/ | Products | Private admin | Product/admin staff | Catalog | No | Internal task route | None | Staff | Core | Product data | Catalog migration data | MUST HAVE |
| R-ADM-003 | /admin/products/[id]/ | Product editor | Private admin | Product/admin staff | Products | No | Internal task route | None | Staff | Core | Product/media/SEO data | Catalog/SEO migration data | MUST HAVE |
| R-ADM-004 | /admin/catalog/categories/ | Product categories | Private admin | Product/admin staff | Catalog | No | Internal task route | None | Staff | Core | Category/SEO data | Legacy category mapping | MUST HAVE |
| R-ADM-005 | /admin/catalog/tags/ | Product tags | Private admin | Product/admin staff | Catalog | No | Internal task route | None | Staff | Context | Tag/SEO data | Legacy tag mapping | CLIENT DECISION REQUIRED |
| R-ADM-006 | /admin/inventory/ | Inventory | Private admin | Product/order staff | Catalog | No | Internal task route | None | Staff | Core | SKU/stock data | Inventory migration data | MUST HAVE |
| R-ADM-007 | /admin/orders/ | Orders | Private admin | Order/admin staff | Commerce operations | No | Internal task route | None | Staff | Core | Order/customer context | Historical-order decision | MUST HAVE |
| R-ADM-008 | /admin/orders/[id]/ | Order detail | Private admin | Order/admin staff | Orders | No | Internal task route | None | Staff | Core | Order/payment/shipment context | Historical-order decision | MUST HAVE |
| R-ADM-009 | /admin/fulfillment/ | Fulfillment and Shipping | Private admin | Order/fulfillment staff | Commerce operations | No | Internal task route | None | Staff | Core | Shipping/package/tracking context | Shipping provider/SOP | MUST HAVE concept |
| R-ADM-010 | /admin/payments/ | Payments | Private admin | Order/finance staff | Commerce operations | No | Internal task route | None | Staff | Core | Payment/order/refund context | Payment provider/SOP | MUST HAVE concept |
| R-ADM-011 | /admin/customers/ | Customers | Private admin | Authorized support staff | Commerce operations | No | Internal task route | None | Staff | Context | Customer/order data | Customer/privacy/migration decision | SHOULD HAVE |
| R-ADM-012 | /admin/customers/[id]/ | Customer detail | Private admin | Authorized support staff | Customers | No | Internal task route | None | Staff | Context | Customer/order/support context | Customer/privacy/migration decision | SHOULD HAVE |
| R-ADM-013 | /admin/content/ | Content list | Private admin | Content/admin staff | Content and community | No | Internal task route | None | Staff | Context | Article/page data | Content migration data | MUST HAVE |
| R-ADM-014 | /admin/content/[id]/ | Content editor | Private admin | Content/admin staff | Content | No | Internal task route | None | Staff | Context | Content/media/SEO data | Content migration data | MUST HAVE |
| R-ADM-015 | /admin/content/taxonomy/ | Content taxonomy | Private admin | Content/SEO staff | Content | No | Internal task route | None | Staff | Context | Category/tag/archive data | Legacy archive mapping | MUST HAVE |
| R-ADM-016 | /admin/seo/ | SEO | Private admin | SEO/admin staff | Discovery and measurement | No | Internal task route | None | Staff | Context | Metadata/canonical/indexability | SEO migration inventory | MUST HAVE |
| R-ADM-017 | /admin/seo/redirects/ | Redirects | Private admin | SEO/admin staff | SEO | No | Internal task route | None | Staff | Context | Legacy URL mapping | Full redirect matrix | MUST HAVE |
| R-ADM-018 | /admin/media/ | Media | Private admin | Content/product staff | Content and community | No | Internal task route | None | Staff | Context | Media/alt/rights data | Media migration inventory | MUST HAVE |
| R-ADM-019 | /admin/branches/ | Branches | Private admin | Authorized staff | Content and community | No | Internal task route | None | Staff | Context | Branch/local SEO data | Branch source/treatment decision | CLIENT DECISION REQUIRED |
| R-ADM-020 | /admin/events/ | Events | Private admin | Authorized staff | Content and community | No | Internal task route | None | Staff | Context | Event content data | Event source/treatment decision | CLIENT DECISION REQUIRED |
| R-ADM-021 | /admin/promotions/ | Promotions | Private admin | Authorized staff | Catalog | No | Internal task route | None | Staff | Core | Promotion/pricing data | Promotion policy | CLIENT DECISION REQUIRED |
| R-ADM-022 | /admin/analytics/ | Analytics | Private admin | Authorized staff | Discovery and measurement | No | Internal task route | None | Staff | Context | Analytics/report data | Analytics governance | CLIENT DECISION REQUIRED |
| R-ADM-023 | /admin/settings/ | Settings | Private admin | Administrator | Settings | No | Internal task route | None | Staff | Context | Approved business settings | Settings/operational policy | MUST HAVE concept |
| R-ADM-024 | /admin/settings/access/ | Staff access | Private admin | Administrator | Settings | No | Internal task route | None | Staff | Context | Staff capability assignments | Role/permission decision | MUST HAVE concept |

## 2. Inventory summary

| Route group | Count | Notes |
|---|---:|---|
| Public customer-visible route patterns | 31 | Includes public content, commerce state, tracking, and help routes; several remain conditional by policy/source data. |
| Crawler/system route patterns | 2 | Sitemap and robots are system routes, not public content pages. |
| Account route patterns | 8 | Private/non-indexable and conditional on account policy. |
| Admin destination patterns | 24 | Private/non-indexable staff task destinations. |
| **Total route patterns** | **65** | Every pattern has a stated purpose and dependency. |

## 3. Query and state patterns not counted as standalone routes

- Pagination, filter, sort, product-attribute, and search query parameters are state variations governed by `docs/SEO-IA.md`; they do not become new route inventory rows or indexable category pages.
- Checkout step, payment return, cart state, error state, mobile-menu state, and admin form mode are task states within their parent route unless a later approved technical architecture requires a distinct private path.
- Unmatched legacy paths must use `docs/LEGACY-URL-MAPPING.md` before falling through to a not-found response.

## 4. Route governance

- Public indexability/canonical status is a proposed policy pending source crawl/export and client/SEO approval.
- No route authorizes multi-vendor functionality, provider-specific payment/shipping behavior, authentication implementation, or database schema.
- A route marked conditional or blocked must not be launched as a blank, thin, duplicate, or unsupported page.
- New public route patterns require an IA purpose, content/operational owner, indexability decision, and migration review where a source URL exists.

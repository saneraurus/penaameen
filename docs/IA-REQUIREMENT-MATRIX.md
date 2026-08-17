# PENA AMEEN IA Requirement Traceability Matrix

**Phase:** 2 — Information Architecture

**Purpose:** Maps all 174 Phase 1 requirements to a proposed IA destination. A mapped destination does not convert a `PROPOSED` or `BLOCKED` requirement into an approved implementation decision.

## 1. Requirement-to-IA mapping

| REQ-ID | IA destination | Route | Purpose | Status |
|---|---|---|---|---|
| REQ-OBJ-001 | Shop, Search, Education | /shop/; /search/; /education/* | Make product/content discovery routes intentional. | MAPPED — CONFIRMED |
| REQ-OBJ-002 | SEO IA | All indexable canonical public routes | Preserve organic route quality and source mappings. | MAPPED — CONFIRMED |
| REQ-OBJ-003 | Commerce journey | /product/*; /cart/; /checkout/; /order/confirmation/* | Support product-to-purchase progression. | MAPPED — CONFIRMED |
| REQ-OBJ-004 | Checkout IA | /checkout/ | Keep validated checkout states and recovery clear. | MAPPED — CONFIRMED |
| REQ-OBJ-005 | Checkout shipping state | /checkout/ | Place destination, shipping options, and selected rate state. | MAPPED — CONFIRMED |
| REQ-OBJ-006 | Fulfillment and tracking | /admin/fulfillment/; /tracking/* | Place shipment/AWB/label/tracking operations. | MAPPED — CONFIRMED |
| REQ-OBJ-007 | Admin work queues | /admin/; /admin/orders/; /admin/fulfillment/ | Expose staff order exception paths. | MAPPED — CONFIRMED |
| REQ-OBJ-008 | Catalog administration | /admin/products/; /admin/inventory/ | Place product management and data health work. | MAPPED — CONFIRMED |
| REQ-OBJ-009 | SEO and redirect governance | /admin/seo/; /admin/seo/redirects/; /sitemap.xml | Protect priority legacy/canonical routes. | MAPPED — CONFIRMED |
| REQ-OBJ-010 | Education and content IA | /education/*; /blog/; /admin/content/* | Support scalable content structure. | MAPPED — CONFIRMED |
| REQ-IA-001 | IA Master Map | See docs/IA-MASTER-MAP.md | Public, account, and admin hierarchy governance. | MAPPED — PROPOSED |
| REQ-IA-002 | IA Master Map | See docs/IA-MASTER-MAP.md | Public, account, and admin hierarchy governance. | MAPPED — PROPOSED |
| REQ-IA-003 | IA Master Map | See docs/IA-MASTER-MAP.md | Public, account, and admin hierarchy governance. | MAPPED — PROPOSED |
| REQ-IA-004 | IA Master Map | See docs/IA-MASTER-MAP.md | Public, account, and admin hierarchy governance. | MAPPED — PROPOSED |
| REQ-IA-005 | IA Master Map | See docs/IA-MASTER-MAP.md | Public, account, and admin hierarchy governance. | MAPPED — PROPOSED |
| REQ-USR-001 | Public IA | All indexable public routes | Give public visitors an understandable safe public hierarchy. | MAPPED — CONFIRMED |
| REQ-USR-002 | Commerce, account, tracking | /shop/; /cart/; /checkout/; /tracking/* | Give customers purchase and authorized post-purchase destinations. | MAPPED — CONFIRMED |
| REQ-USR-003 | Admin overview/settings | /admin/; /admin/settings/* | Place administrator oversight and settings boundaries. | MAPPED — CONFIRMED |
| REQ-USR-004 | Admin content/SEO | /admin/content/*; /admin/media/; /admin/seo/ | Place content manager tasks. | MAPPED — CONFIRMED |
| REQ-USR-005 | Admin order operations | /admin/orders/*; /admin/payments/; /admin/fulfillment/ | Place order manager task context. | MAPPED — CONFIRMED |
| REQ-USR-006 | Admin catalog | /admin/products/*; /admin/catalog/categories/; /admin/inventory/ | Place product manager tasks. | MAPPED — CONFIRMED |
| REQ-JRN-001 | Commerce journey | /shop/ → /product/* → /cart/ → /checkout/ → /tracking/* | Map entire customer commerce loop. | MAPPED — CONFIRMED |
| REQ-JRN-002 | SEO/public landing model | Legacy map; /education/*; /[article-slug]/ | Map SEO/direct/social/article entry to relevant canonical path. | MAPPED — CONFIRMED |
| REQ-JRN-003 | Shop/search browsing | /shop/; /product-category/*; /search/ | Map product search/category recovery routes. | MAPPED — CONFIRMED |
| REQ-JRN-004 | Account/tracking | /account/*; /tracking/* | Map returning/guest authorized support routes. | MAPPED — PROPOSED |
| REQ-JRN-005 | Cart/checkout | /cart/; /checkout/; /admin/orders/* | Map multi-product order through fulfillment. | MAPPED — CONFIRMED |
| REQ-PAG-001 | Home | / | Home orientation route. | MAPPED — PROPOSED |
| REQ-PAG-002 | Shop and categories | /shop/; /product-category/* | Catalog browse routes. | MAPPED — CONFIRMED |
| REQ-PAG-003 | Product detail | /product/* | Product evaluation route. | MAPPED — CONFIRMED |
| REQ-PAG-004 | Search | /search/ | Search result route. | MAPPED — PROPOSED |
| REQ-PAG-005 | Education hubs | /education/al-barqy/; /education/acm/ | Pillar discovery routes. | MAPPED — CONFIRMED |
| REQ-PAG-006 | Blog/articles | /blog/; /[article-slug]/; /category/* | Editorial discovery routes. | MAPPED — CONFIRMED |
| REQ-PAG-007 | Branches | /branches/* | Local/community routes. | MAPPED — PROPOSED |
| REQ-PAG-008 | Events/gallery | /events/*; /galeri-kegiatan/ | Conditional community routes. | BLOCKED — client decision required |
| REQ-PAG-009 | Profile | /profile/ | Organization route. | MAPPED — PROPOSED |
| REQ-PAG-010 | Contact | /contact/ | Help route. | MAPPED — CONFIRMED |
| REQ-PAG-011 | FAQ | /faq/ | Conditional help route. | MAPPED — PROPOSED |
| REQ-PAG-012 | Legal/policy | /legal/* | Policy route group. | MAPPED — BLOCKED |
| REQ-PAG-013 | Cart | /cart/ | Cart route. | MAPPED — CONFIRMED |
| REQ-PAG-014 | Checkout | /checkout/ | Checkout route. | MAPPED — CONFIRMED |
| REQ-PAG-015 | Order outcome | /order/confirmation/* | Payment/order outcome route. | MAPPED — CONFIRMED |
| REQ-PAG-016 | Tracking | /tracking/* | Post-purchase route. | MAPPED — CONFIRMED |
| REQ-PAG-017 | Account | /account/* | Conditional self-service routes. | MAPPED — PROPOSED |
| REQ-PAG-018 | Admin | /admin/* | Internal operational hierarchy. | MAPPED — CONFIRMED |
| REQ-PAG-019 | System recovery | Unmatched route and parent route states | Recovery behavior without redundant page route. | MAPPED — PROPOSED |
| REQ-COM-001 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | MAPPED — CONFIRMED |
| REQ-COM-002 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | MAPPED — CONFIRMED |
| REQ-COM-003 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | MAPPED — CONFIRMED |
| REQ-COM-004 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | MAPPED — CONFIRMED |
| REQ-COM-005 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | MAPPED — PROPOSED |
| REQ-COM-006 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | MAPPED — CONFIRMED |
| REQ-COM-007 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | MAPPED — CONFIRMED |
| REQ-COM-008 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | MAPPED — CONFIRMED |
| REQ-COM-009 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | MAPPED — PROPOSED |
| REQ-COM-010 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | MAPPED — CONFIRMED |
| REQ-COM-011 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | BLOCKED — client decision required |
| REQ-COM-012 | Commerce IA | /shop/; /product-category/*; /product/*; /cart/; /checkout/ | Support product discovery through order outcome. | BLOCKED — client decision required |
| REQ-SHP-001 | Checkout and fulfillment IA | /checkout/; /tracking/; /admin/fulfillment/ | Place customer shipping and staff fulfillment tasks. | MAPPED — CONFIRMED |
| REQ-SHP-002 | Checkout and fulfillment IA | /checkout/; /tracking/; /admin/fulfillment/ | Place customer shipping and staff fulfillment tasks. | MAPPED — CONFIRMED |
| REQ-SHP-003 | Checkout and fulfillment IA | /checkout/; /tracking/; /admin/fulfillment/ | Place customer shipping and staff fulfillment tasks. | MAPPED — CONFIRMED |
| REQ-SHP-004 | Checkout and fulfillment IA | /checkout/; /tracking/; /admin/fulfillment/ | Place customer shipping and staff fulfillment tasks. | MAPPED — CONFIRMED |
| REQ-SHP-005 | Checkout and fulfillment IA | /checkout/; /tracking/; /admin/fulfillment/ | Place customer shipping and staff fulfillment tasks. | MAPPED — CONFIRMED |
| REQ-SHP-006 | Checkout and fulfillment IA | /checkout/; /tracking/; /admin/fulfillment/ | Place customer shipping and staff fulfillment tasks. | MAPPED — CONFIRMED |
| REQ-SHP-007 | Checkout and fulfillment IA | /checkout/; /tracking/; /admin/fulfillment/ | Place customer shipping and staff fulfillment tasks. | MAPPED — CONFIRMED |
| REQ-SHP-008 | Checkout and fulfillment IA | /checkout/; /tracking/; /admin/fulfillment/ | Place customer shipping and staff fulfillment tasks. | BLOCKED — client decision required |
| REQ-SHP-009 | Checkout and fulfillment IA | /checkout/; /tracking/; /admin/fulfillment/ | Place customer shipping and staff fulfillment tasks. | MAPPED — PROPOSED |
| REQ-SHP-010 | Checkout and fulfillment IA | /checkout/; /tracking/; /admin/fulfillment/ | Place customer shipping and staff fulfillment tasks. | BLOCKED — client decision required |
| REQ-PAY-001 | Checkout, order outcome, and payment admin IA | /checkout/; /order/confirmation/*; /admin/payments/ | Place payment initiation, state, and review without provider selection. | MAPPED — CONFIRMED |
| REQ-PAY-002 | Checkout, order outcome, and payment admin IA | /checkout/; /order/confirmation/*; /admin/payments/ | Place payment initiation, state, and review without provider selection. | MAPPED — CONFIRMED |
| REQ-PAY-003 | Checkout, order outcome, and payment admin IA | /checkout/; /order/confirmation/*; /admin/payments/ | Place payment initiation, state, and review without provider selection. | MAPPED — PROPOSED |
| REQ-PAY-004 | Checkout, order outcome, and payment admin IA | /checkout/; /order/confirmation/*; /admin/payments/ | Place payment initiation, state, and review without provider selection. | MAPPED — CONFIRMED |
| REQ-PAY-005 | Checkout, order outcome, and payment admin IA | /checkout/; /order/confirmation/*; /admin/payments/ | Place payment initiation, state, and review without provider selection. | MAPPED — PROPOSED |
| REQ-PAY-006 | Checkout, order outcome, and payment admin IA | /checkout/; /order/confirmation/*; /admin/payments/ | Place payment initiation, state, and review without provider selection. | MAPPED — CONFIRMED |
| REQ-PAY-007 | Checkout, order outcome, and payment admin IA | /checkout/; /order/confirmation/*; /admin/payments/ | Place payment initiation, state, and review without provider selection. | MAPPED — CONFIRMED |
| REQ-PAY-008 | Checkout, order outcome, and payment admin IA | /checkout/; /order/confirmation/*; /admin/payments/ | Place payment initiation, state, and review without provider selection. | BLOCKED — client decision required |
| REQ-PAY-009 | Checkout, order outcome, and payment admin IA | /checkout/; /order/confirmation/*; /admin/payments/ | Place payment initiation, state, and review without provider selection. | MAPPED — PROPOSED |
| REQ-ADM-001 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | MAPPED — PROPOSED |
| REQ-ADM-002 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | MAPPED — CONFIRMED |
| REQ-ADM-003 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | MAPPED — CONFIRMED |
| REQ-ADM-004 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | MAPPED — CONFIRMED |
| REQ-ADM-005 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | MAPPED — CONFIRMED |
| REQ-ADM-006 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | MAPPED — PROPOSED |
| REQ-ADM-007 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | MAPPED — CONFIRMED |
| REQ-ADM-008 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | BLOCKED — client decision required |
| REQ-ADM-009 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | BLOCKED — client decision required |
| REQ-ADM-010 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | MAPPED — PROPOSED |
| REQ-ADM-011 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | MAPPED — PROPOSED |
| REQ-ADM-012 | Administrative IA | /admin/* | Place staff task groups and adjacent entities. | MAPPED — PROPOSED |
| REQ-SEO-001 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | MAPPED — CONFIRMED |
| REQ-SEO-002 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | MAPPED — CONFIRMED |
| REQ-SEO-003 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | MAPPED — CONFIRMED |
| REQ-SEO-004 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | MAPPED — PROPOSED |
| REQ-SEO-005 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | MAPPED — CONFIRMED |
| REQ-SEO-006 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | MAPPED — CONFIRMED |
| REQ-SEO-007 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | MAPPED — PROPOSED |
| REQ-SEO-008 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | MAPPED — CONFIRMED |
| REQ-SEO-009 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | MAPPED — PROPOSED |
| REQ-SEO-010 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | BLOCKED — client decision required |
| REQ-SEO-011 | SEO IA and route governance | Public canonical routes; /sitemap.xml; /admin/seo/* | Control canonical discovery, archive, redirect, and content treatment. | MAPPED — PROPOSED |
| REQ-SRH-001 | Search IA | /search/ | Provide scoped public discovery without indexable query duplication. | MAPPED — CONFIRMED |
| REQ-SRH-002 | Search IA | /search/ | Provide scoped public discovery without indexable query duplication. | MAPPED — PROPOSED |
| REQ-SRH-003 | Search IA | /search/ | Provide scoped public discovery without indexable query duplication. | MAPPED — PROPOSED |
| REQ-SRH-004 | Search IA | /search/ | Provide scoped public discovery without indexable query duplication. | MAPPED — PROPOSED |
| REQ-SRH-005 | Search IA | /search/ | Provide scoped public discovery without indexable query duplication. | MAPPED — PROPOSED |
| REQ-SRH-006 | Search IA | /search/ | Provide scoped public discovery without indexable query duplication. | BLOCKED — client decision required |
| REQ-SRH-007 | Search IA | /search/ | Provide scoped public discovery without indexable query duplication. | MAPPED — PROPOSED |
| REQ-ACC-001 | Account and tracking IA | /account/*; /tracking/* | Separate conditional private self-service from public commerce. | BLOCKED — client decision required |
| REQ-ACC-002 | Account and tracking IA | /account/*; /tracking/* | Separate conditional private self-service from public commerce. | MAPPED — PROPOSED |
| REQ-ACC-003 | Account and tracking IA | /account/*; /tracking/* | Separate conditional private self-service from public commerce. | MAPPED — CONFIRMED |
| REQ-ACC-004 | Account and tracking IA | /account/*; /tracking/* | Separate conditional private self-service from public commerce. | MAPPED — PROPOSED |
| REQ-ACC-005 | Account and tracking IA | /account/*; /tracking/* | Separate conditional private self-service from public commerce. | MAPPED — PROPOSED |
| REQ-ACC-006 | Account and tracking IA | /account/*; /tracking/* | Separate conditional private self-service from public commerce. | MAPPED — PROPOSED |
| REQ-ACC-007 | Account and tracking IA | /account/*; /tracking/* | Separate conditional private self-service from public commerce. | MAPPED — CONFIRMED |
| REQ-ACC-008 | Account and tracking IA | /account/*; /tracking/* | Separate conditional private self-service from public commerce. | BLOCKED — client decision required |
| REQ-ACC-009 | Account and tracking IA | /account/*; /tracking/* | Separate conditional private self-service from public commerce. | BLOCKED — client decision required |
| REQ-ACC-010 | Account and tracking IA | /account/*; /tracking/* | Separate conditional private self-service from public commerce. | MAPPED — CONFIRMED |
| REQ-NTF-001 | Order/tracking and account notification touchpoints | /order/confirmation/*; /tracking/*; /account/*; /admin/orders/* | Expose destination/state recipients without choosing a notification provider. | MAPPED — CONFIRMED |
| REQ-NTF-002 | Order/tracking and account notification touchpoints | /order/confirmation/*; /tracking/*; /account/*; /admin/orders/* | Expose destination/state recipients without choosing a notification provider. | MAPPED — PROPOSED |
| REQ-NTF-003 | Order/tracking and account notification touchpoints | /order/confirmation/*; /tracking/*; /account/*; /admin/orders/* | Expose destination/state recipients without choosing a notification provider. | MAPPED — CONFIRMED |
| REQ-NTF-004 | Order/tracking and account notification touchpoints | /order/confirmation/*; /tracking/*; /account/*; /admin/orders/* | Expose destination/state recipients without choosing a notification provider. | MAPPED — CONFIRMED |
| REQ-NTF-005 | Order/tracking and account notification touchpoints | /order/confirmation/*; /tracking/*; /account/*; /admin/orders/* | Expose destination/state recipients without choosing a notification provider. | MAPPED — PROPOSED |
| REQ-NTF-006 | Order/tracking and account notification touchpoints | /order/confirmation/*; /tracking/*; /account/*; /admin/orders/* | Expose destination/state recipients without choosing a notification provider. | BLOCKED — client decision required |
| REQ-NTF-007 | Order/tracking and account notification touchpoints | /order/confirmation/*; /tracking/*; /account/*; /admin/orders/* | Expose destination/state recipients without choosing a notification provider. | MAPPED — CONFIRMED |
| REQ-ANL-001 | Analytics and SEO operational IA | /admin/analytics/; /admin/seo/; /sitemap.xml | Locate measurement/review responsibilities, not tracking implementation. | MAPPED — CONFIRMED |
| REQ-ANL-002 | Analytics and SEO operational IA | /admin/analytics/; /admin/seo/; /sitemap.xml | Locate measurement/review responsibilities, not tracking implementation. | MAPPED — CONFIRMED |
| REQ-ANL-003 | Analytics and SEO operational IA | /admin/analytics/; /admin/seo/; /sitemap.xml | Locate measurement/review responsibilities, not tracking implementation. | MAPPED — PROPOSED |
| REQ-ANL-004 | Analytics and SEO operational IA | /admin/analytics/; /admin/seo/; /sitemap.xml | Locate measurement/review responsibilities, not tracking implementation. | MAPPED — CONFIRMED |
| REQ-ANL-005 | Analytics and SEO operational IA | /admin/analytics/; /admin/seo/; /sitemap.xml | Locate measurement/review responsibilities, not tracking implementation. | BLOCKED — client decision required |
| REQ-ANL-006 | Analytics and SEO operational IA | /admin/analytics/; /admin/seo/; /sitemap.xml | Locate measurement/review responsibilities, not tracking implementation. | BLOCKED — client decision required |
| REQ-NFR-001 | Cross-cutting public and commerce routes | /; /shop/; /product/*; /cart/; /checkout/ | Performance applies to priority journey routes. | MAPPED — CONFIRMED |
| REQ-NFR-002 | SEO IA | All eligible public canonical routes; /sitemap.xml | Apply crawl/index/canonical/redirect architecture. | MAPPED — CONFIRMED |
| REQ-NFR-003 | Accessible route and state model | All public/account/admin routes | Ensure navigation/form/state semantics have a route context. | MAPPED — CONFIRMED |
| REQ-NFR-004 | Private/state route boundaries | /account/*; /admin/*; /checkout/*; /tracking/* | Keep sensitive state out of public crawl/navigation. | MAPPED — CONFIRMED |
| REQ-NFR-005 | Mobile navigation system | Public primary/utility/menu routes | Keep hierarchy usable in mobile navigation. | MAPPED — CONFIRMED |
| REQ-NFR-006 | Commerce recovery route model | /cart/; /checkout/; /order/confirmation/*; /tracking/* | Give failures and pending states a truthful place. | MAPPED — CONFIRMED |
| REQ-NFR-007 | Admin exception destinations | /admin/; /admin/orders/*; /admin/fulfillment/; /admin/seo/ | Place material operational/SEO exceptions. | MAPPED — PROPOSED |
| REQ-NFR-008 | Route/taxonomy governance | All canonical route families | Maintain stable purpose and migration-safe changes. | MAPPED — CONFIRMED |
| REQ-NFR-009 | Scalable public/admin hierarchy | /shop/; /education/*; /admin/* | Allow growth without new business-model branches. | MAPPED — PROPOSED |
| REQ-MVP-001 | IA Master Map | Public; Account; Admin hierarchy | Cover complete MVP journey and essential operational destinations. | MAPPED — CONFIRMED |
| REQ-MVP-002 | IA Master Map | Public; Account; Admin hierarchy | Cover complete MVP journey and essential operational destinations. | MAPPED — CONFIRMED |
| REQ-MVP-003 | IA Master Map | Public; Account; Admin hierarchy | Cover complete MVP journey and essential operational destinations. | MAPPED — CONFIRMED |
| REQ-MVP-004 | IA Master Map | Public; Account; Admin hierarchy | Cover complete MVP journey and essential operational destinations. | MAPPED — PROPOSED |
| REQ-OOS-001 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-002 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-003 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-004 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-005 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-006 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-007 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-008 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-009 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-010 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-011 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-012 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-013 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-014 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-015 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-016 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-017 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-018 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-019 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-020 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-021 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-OOS-022 | IA governance — no destination | No route intentionally | Prevent an unapproved business model or feature route from entering IA. | INTENTIONALLY NO ROUTE — out of scope |
| REQ-DEC-001 | Client decision governance | See CDR and affected route families | Block affected route/taxonomy choices until client decision. | BLOCKED — client decision required |
| REQ-DEC-002 | Client decision governance | See CDR and affected route families | Block affected route/taxonomy choices until client decision. | BLOCKED — client decision required |
| REQ-DEC-003 | Client decision governance | See CDR and affected route families | Block affected route/taxonomy choices until client decision. | BLOCKED — client decision required |
| REQ-DEC-004 | Client decision governance | See CDR and affected route families | Block affected route/taxonomy choices until client decision. | BLOCKED — client decision required |
| REQ-DEC-005 | Client decision governance | See CDR and affected route families | Block affected route/taxonomy choices until client decision. | BLOCKED — client decision required |
| REQ-DEC-006 | Client decision governance | See CDR and affected route families | Block affected route/taxonomy choices until client decision. | BLOCKED — client decision required |
| REQ-DEC-007 | Client decision governance | See CDR and affected route families | Block affected route/taxonomy choices until client decision. | BLOCKED — client decision required |
| REQ-DEC-008 | Client decision governance | See CDR and affected route families | Block affected route/taxonomy choices until client decision. | BLOCKED — client decision required |
| REQ-DEC-009 | Client decision governance | See CDR and affected route families | Block affected route/taxonomy choices until client decision. | BLOCKED — client decision required |
| REQ-DEC-010 | Client decision governance | See CDR and affected route families | Block affected route/taxonomy choices until client decision. | BLOCKED — client decision required |

## 2. Coverage results

| Check | Result |
|---|---|
| Phase 1 requirements mapped | 174 of 174 |
| Requirements without an IA destination | None. Out-of-scope requirements intentionally map to the IA governance boundary rather than a route. |
| Route destinations without a requirement purpose | None at the route-family level. Crawler routes support SEO requirements; conditional routes map to the relevant decision-gated requirement. |
| Duplicate canonical destinations | None identified. Multiple requirements intentionally converge on shared route families such as Shop, Education, Checkout, Tracking, and Admin. |
| Conflicting destinations | No unresolved route-pattern conflict. Legacy article/category/tag/archive and branch candidates remain explicitly conditional pending CDR decisions and source verification. |

## 3. Intentional shared destinations

| Shared destination | Why multiple requirements map here |
|---|---|
| `/shop/`, `/product-category/*`, `/product/*` | Product discovery, conversion, category, catalog, search, SEO, analytics, product management, and MVP requirements share the commerce hierarchy. |
| `/education/*`, `/blog/`, `/[article-slug]/` | Education, content, SEO, internal linking, AL-BARQY/ACM, discovery, and migration requirements share the content hierarchy. |
| `/cart/`, `/checkout/`, `/order/confirmation/*`, `/tracking/*` | Cart, checkout, payment, shipping, notification, account, reliability, and post-purchase requirements share private transaction states. |
| `/admin/*` | Staff, product, order, payment, shipping, content, SEO, analytics, observability, and maintainability requirements share task-oriented admin destinations. |
| `IA governance — no route` | Out-of-scope, policy, provider, and client-decision requirements deliberately prevent routes from being introduced before approval. |

## 4. Traceability controls

- The source requirement wording/status remains authoritative in `docs/REQUIREMENT-MATRIX.md`.
- Route patterns are authoritative only as proposed IA candidates in `docs/ROUTE-INVENTORY.md` and `docs/URL-ARCHITECTURE.md`.
- A `BLOCKED` requirement may be mapped for planning but cannot be implemented as if it were confirmed.
- Any new or changed route must update this matrix, the route inventory, SEO IA, and legacy mapping where source URLs are affected.

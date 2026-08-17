# Unknown Registry — PENA AMEEN Migration Readiness

Source: Phase 0 and Phase 0.5 discovery documents. Status values intentionally remain `UNKNOWN`, `INFERRED`, `CONFIRMED`, or `CLIENT DECISION REQUIRED` where applicable.

| ID | Category | Unknown | Why it matters | Current evidence | Required source | Priority | Owner | Resolution status |
|---|---|---|---|---|---|---|---|---|
| BUS-001 | BUSINESS | Final business scope for Phase 1 | Controls what is designed first and prevents overbuilding | Discovery only describes intended future platform | Client product owner | CRITICAL | Client | CLIENT DECISION REQUIRED |
| BUS-002 | BUSINESS | Whether existing WordPress/WooCommerce URLs must be preserved exactly | URL policy affects routing and redirects | Existing indexed slugs are migration-critical | Client + SEO lead | CRITICAL | Client/SEO | CLIENT DECISION REQUIRED |
| BUS-003 | BUSINESS | Required launch market and language strategy | Affects content, currency, shipping, SEO, legal pages | Indonesian content and IDR prices observed | Client | HIGH | Client | UNKNOWN |
| BUS-004 | BUSINESS | Product merchandising priorities | Affects catalog ordering and homepage/product promotion | AL-BARQY and ACM appear important | Client sales/marketing | HIGH | Client | UNKNOWN |
| PROD-001 | PRODUCTS | Complete product catalog count | Missing products cause revenue and SEO loss | Phase 0 listed 6; Phase 0.5 found more possible products | WooCommerce export/admin report | CRITICAL | Client | UNKNOWN |
| PROD-002 | PRODUCTS | Canonical product URL for each product | Needed for redirects and product identity | Some products have UNKNOWN URLs | WooCommerce product export/sitemap | CRITICAL | Client/SEO | UNKNOWN |
| PROD-003 | PRODUCTS | SKU for each product | Required for inventory/order operations | All SKUs are UNKNOWN | WooCommerce export or warehouse sheet | CRITICAL | Client operations | UNKNOWN |
| PROD-004 | PRODUCTS | Product status: published/draft/private/discontinued | Avoids migrating unavailable items incorrectly | Public snippets only | WooCommerce export | HIGH | Client | UNKNOWN |
| PROD-005 | PRODUCTS | Product variants/bundles/components | Affects cart pricing, stock, fulfillment | Products appear package/bundle-like | WooCommerce export + operations sheet | HIGH | Client operations | UNKNOWN |
| PROD-006 | PRODUCTS | Full descriptions and short descriptions | Required for UX and SEO | Snippets only | WooCommerce export/content export | HIGH | Client/content | UNKNOWN |
| PROD-007 | PRODUCTS | Related/cross-sell/up-sell relationships | Affects conversion and migration parity | Related-product snippets partially observed | WooCommerce export | MEDIUM | Client | UNKNOWN |
| INV-001 | INVENTORY | Stock quantity per SKU/product | Required to prevent overselling | Stock fields UNKNOWN | WooCommerce export/warehouse sheet | CRITICAL | Client operations | UNKNOWN |
| INV-002 | INVENTORY | Inventory tracking rules | Affects order acceptance | Not publicly detectable | Operations SOP | CRITICAL | Client operations | UNKNOWN |
| INV-003 | INVENTORY | Low-stock/out-of-stock thresholds | Affects admin alerts and storefront status | Not publicly detectable | WooCommerce settings/operations SOP | MEDIUM | Client operations | UNKNOWN |
| INV-004 | INVENTORY | Warehouse/storage locations | Affects fulfillment and shipping origin | Not publicly detectable | Operations SOP | HIGH | Client operations | UNKNOWN |
| CUST-001 | CUSTOMERS | Whether customer accounts must be migrated | Affects privacy, authentication, account history | Account/order history inaccessible | Client/admin export | HIGH | Client | CLIENT DECISION REQUIRED |
| CUST-002 | CUSTOMERS | Customer fields and consent records | Required for legal/privacy-safe migration | Not publicly detectable | WooCommerce customer export/privacy records | HIGH | Client/legal | UNKNOWN |
| CUST-003 | CUSTOMERS | Newsletter/subscriber source | Affects marketing continuity and consent | Analytics/integrations unknown | Email marketing export | MEDIUM | Client marketing | UNKNOWN |
| ORD-001 | ORDERS | Historical orders migration requirement | Affects admin/customer order history | Existing orders not publicly accessible | Client decision + WooCommerce export | HIGH | Client | CLIENT DECISION REQUIRED |
| ORD-002 | ORDERS | Order statuses and fulfillment workflow | Needed for operational parity | Not publicly detectable | WooCommerce settings/order export | CRITICAL | Client operations | UNKNOWN |
| ORD-003 | ORDERS | Refund/return/cancellation history | Needed for accounting/support | Not publicly detectable | WooCommerce/payment exports | MEDIUM | Client operations | UNKNOWN |
| PAY-001 | PAYMENT | Current payment provider | Required for payment implementation | Not publicly detectable | Client finance/admin settings | CRITICAL | Client finance | UNKNOWN |
| PAY-002 | PAYMENT | Payment methods offered | Affects checkout requirements | Not publicly detectable | Payment dashboard/settings | CRITICAL | Client finance | UNKNOWN |
| PAY-003 | PAYMENT | Webhook/status mapping | Required for reliable order updates | Not publicly detectable | Payment provider docs/dashboard | CRITICAL | Client/engineering | UNKNOWN |
| PAY-004 | PAYMENT | Refund process and settlement behavior | Required for support/accounting | Not publicly detectable | Payment provider dashboard/SOP | HIGH | Client finance | UNKNOWN |
| SHIP-001 | SHIPPING | Current shipping provider/aggregator | Required for shipping rates/AWB/labels | Not publicly detectable | Client operations/admin settings | CRITICAL | Client operations | UNKNOWN |
| SHIP-002 | SHIPPING | Supported couriers/services | Affects checkout choices | Not publicly detectable | Shipping provider dashboard/SOP | CRITICAL | Client operations | UNKNOWN |
| SHIP-003 | SHIPPING | Origin warehouse address | Required for rate calculation and labels | Not publicly detectable | Client operations | CRITICAL | Client operations | UNKNOWN |
| SHIP-004 | SHIPPING | Package weight/dimensions rules | Affects accurate rates and fulfillment | Product weights/dimensions UNKNOWN | Product export/warehouse SOP | HIGH | Client operations | UNKNOWN |
| SHIP-005 | SHIPPING | Return/cancellation handling | Needed for post-purchase flows | Not publicly detectable | Operations SOP | MEDIUM | Client operations | UNKNOWN |
| SEO-001 | SEO | Full URL inventory/sitemap | Needed for complete redirect matrix | URL inventory is PARTIAL; sitemap UNKNOWN | Sitemap/crawl/SEO export | CRITICAL | SEO/client | UNKNOWN |
| SEO-002 | SEO | Canonical URL for every page | Prevents duplicate/indexing loss | Canonicals UNKNOWN | Raw HTML/SEO plugin export | CRITICAL | SEO | UNKNOWN |
| SEO-003 | SEO | Title/meta description for every page | Preserves search snippets/rankings | Partially visible only | SEO plugin export/crawl | HIGH | SEO/content | UNKNOWN |
| SEO-004 | SEO | Structured data currently present | Avoids losing rich-result eligibility | Schema UNKNOWN | Raw HTML/crawl | HIGH | SEO/engineering | UNKNOWN |
| SEO-005 | SEO | Indexability/robots meta rules | Prevents accidental noindex/index changes | robots/meta UNKNOWN | robots.txt/crawl/SEO settings | CRITICAL | SEO | UNKNOWN |
| SEO-006 | SEO | Redirect decisions for every indexed URL | Prevents 404s and equity loss | Critical paths identified but incomplete | Redirect matrix | CRITICAL | SEO/client | CLIENT DECISION REQUIRED |
| CONT-001 | CONTENT | Complete page/post export | Required for migration completeness | Content inventory UNKNOWN | WordPress export/admin | CRITICAL | Client/content | UNKNOWN |
| CONT-002 | CONTENT | Final treatment for old content | Avoids deleting SEO assets prematurely | Recommendation not to delete old content | Client/content/SEO review | HIGH | Client/content | CLIENT DECISION REQUIRED |
| CONT-003 | CONTENT | Event content source of truth | Events URL inferred, content unknown | `/events/` high confidence only | WordPress export/client | MEDIUM | Client/content | UNKNOWN |
| CONT-004 | CONTENT | Testimonials source/permissions | Needed for trust signals and compliance | Testimonials seen in snippets | Client marketing/legal | MEDIUM | Client | UNKNOWN |
| MEDIA-001 | MEDIA | Complete media library | Needed for product/content parity | Images mostly UNKNOWN | WordPress media export | CRITICAL | Client | UNKNOWN |
| MEDIA-002 | MEDIA | Image ownership/rights | Avoids legal risk | Not publicly verifiable | Client/legal | HIGH | Client/legal | UNKNOWN |
| MEDIA-003 | MEDIA | Alt text/captions | SEO/accessibility requirement | Alt text UNKNOWN | Media export/crawl | HIGH | SEO/content | UNKNOWN |
| BR-001 | BRANCHES | Complete branch/partner list | Needed for local SEO/community pages | 2 branches confirmed; completeness PARTIAL | Client branch directory | HIGH | Client | UNKNOWN |
| BR-002 | BRANCHES | Branch addresses/contact/map data | Needed for local SEO and accuracy | Not discovered | Client branch directory | HIGH | Client | UNKNOWN |
| BR-003 | BRANCHES | Partner onboarding/status rules | Affects admin/operations | Not discovered | Client operations | MEDIUM | Client | UNKNOWN |
| ADMIN-001 | ADMIN / OPERATIONS | Admin roles and permissions | Required for future admin design | Not in discovery | Client operations | HIGH | Client | CLIENT DECISION REQUIRED |
| ADMIN-002 | ADMIN / OPERATIONS | Fulfillment SOP | Required for order workflow | Not public | Operations SOP | HIGH | Client operations | UNKNOWN |
| ADMIN-003 | ADMIN / OPERATIONS | Reporting needs | Affects dashboard scope | Not public | Client leadership | MEDIUM | Client | CLIENT DECISION REQUIRED |
| LEG-001 | LEGAL / POLICY | Privacy policy | Required if migrating customers/analytics | Not discovered | Client/legal | CRITICAL | Client/legal | UNKNOWN |
| LEG-002 | LEGAL / POLICY | Terms and conditions | Required for checkout/legal compliance | Not discovered | Client/legal | HIGH | Client/legal | UNKNOWN |
| LEG-003 | LEGAL / POLICY | Return/refund/shipping policies | Required for checkout/support | Not discovered | Client/legal/ops | HIGH | Client | UNKNOWN |
| ANA-001 | ANALYTICS | Existing analytics platform | Needed for continuity | Analytics UNKNOWN | Client/dashboard access | HIGH | Client marketing | UNKNOWN |
| ANA-002 | ANALYTICS | Conversion events/goals | Needed for tracking checkout/product performance | Not public | Analytics/tag manager | HIGH | Client marketing | UNKNOWN |
| ANA-003 | ANALYTICS | Search Console access | Needed for sitemap/index/404 monitoring | Not available | Client secure invitation | CRITICAL | Client/SEO | UNKNOWN |
| TECH-001 | TECHNICAL | Hosting/CDN/DNS provider | Needed for launch planning | UNKNOWN | Client/domain/hosting access | HIGH | Client/engineering | UNKNOWN |
| TECH-002 | TECHNICAL | WordPress/WooCommerce/plugin versions | Needed for export compatibility | Platform only high confidence | Admin access/system report | MEDIUM | Client/engineering | UNKNOWN |
| TECH-003 | TECHNICAL | Current integrations | Needed to avoid breaking operations | Payment/shipping/analytics unknown | Admin settings/client | HIGH | Client | UNKNOWN |
| TECH-004 | TECHNICAL | Backup/export availability | Needed for safe migration | Not known | Hosting/admin access | CRITICAL | Client/engineering | UNKNOWN |

## Resolution additions — 2026-08-17 (owner decisions D010-D013)

Rows below are resolved or partially resolved by explicit owner decisions recorded in `docs/DECISION-LOG.md` and implemented per `docs/ADMIN-CONTROL-CENTER-PLAN.md`. Original rows above remain unchanged for history.

| ID | Resolution |
|---|---|
| PAY-001 | RESOLVED — Payment provider confirmed by implementation: **Midtrans** (D011). |
| SHIP-001 | RESOLVED — Shipping provider confirmed by implementation: **RajaOngkir** (D011). |
| TECH-003 | PARTIAL — Midtrans, RajaOngkir, Resend, Clerk confirmed (D011). WhatsApp, Brevo, GA4, Search Console remain UNKNOWN. |
| ADMIN-001 | RESOLVED — RBAC model fixed as capability-first (D012); the spec's 8 role names are display labels only. Staff role combinations and approval thresholds remain client decisions. |
| ADMIN-002 | UNCHANGED — Fulfillment SOP remains UNKNOWN; spec §14 provides a conceptual flow, not an approved SOP. |
| ADMIN-003 | UNCHANGED — Reporting needs remain UNKNOWN. |
| DES-001/DES-002, DATA-001..005, LEG-001..003, ANA-001..003, ORD-001..003, CUST-001..003, BR-001..003 | UNCHANGED — not affected by D010-D013. |

## Resolution additions — 2026-08-17 (Casaku QRIS primary gateway, D017)

Client supplied Casaku (ex-Cashify; migrated to Casaku.id) credentials and approved implementation with the Casaku API contract; see `docs/DECISION-LOG.md` D017.

| ID | Resolution |
|---|---|
| PAY-001 | RESOLVED — Payment provider: **Casaku QRIS (primary)** + **Midtrans (backup)** (D017; supersedes the PAY-001 Midtrans-only resolution line above). Casaku = `cashify.my.id` rebrand (migrated to `casaku.id`, API `api.casaku.id`); license key, webhook secret, and QRIS Merchant ID supplied by client. |
| PAY-003 | RESOLVED — Webhook/status mapping implemented for Casaku (HMAC-SHA256 `X-Casaku-Signature` verification, `POST /api/generate/check-status` polling, idempotent paid transition with nominal cross-check) and Midtrans (existing signature verification). Refund/settlement behavior (PAY-004) remains UNKNOWN. |
| TECH-003 | PARTIAL — Casaku, Midtrans, RajaOngkir, Resend, Clerk confirmed. WhatsApp, Brevo, GA4, Search Console remain UNKNOWN. |

## Phase 4 data-architecture additions

These entries were added because Phase 4 exposed target-data/migration decisions not represented as separate rows in the original registry. Existing entries remain unchanged; these additions do not resolve or replace them.

| ID | Category | Unknown | Why it matters | Current evidence | Required source | Priority | Owner | Resolution status |
|---|---|---|---|---|---|---|---|---|
| DATA-001 | DATA / MIGRATION | Stable source-to-target identifier and key-matching strategy across products, taxonomy, content, media, branches, customers, orders, payments, and shipments | Required for repeatable import, deduplication, reconciliation, audit provenance, and redirect/entity mapping | Source IDs are partial; target identifiers are architecture-only | Source exports plus approved migration/data architecture mapping | CRITICAL | Client + architecture + migration owner | UNKNOWN |
| DATA-002 | DATA / FINANCE | Currency, tax, discount, fee, shipping-allocation, and rounding snapshot model | Required for Cart, OrderItem, Payment, Refund, SettlementRecord, and financial reconciliation | IDR prices observed but rules/amount components are not confirmed | Finance policy, WooCommerce/payment exports, legal/tax guidance | HIGH | Client finance | CLIENT DECISION REQUIRED |
| DATA-003 | DATA / PRIVACY | Retention, deletion, export, anonymization, legal-hold, audit, notification, analytics, and backup data lifecycle policy | Required for PII, orders, payment/shipping evidence, audit, media, and compliance-safe lifecycle | Privacy/legal documents and retention rules are not supplied | Client legal/privacy/security policy | CRITICAL | Client legal + security | CLIENT DECISION REQUIRED |
| DATA-004 | DATA / IMPORT | Import file contract, relationship-key strategy, duplicate handling, quarantine, and reconciliation acceptance criteria | Required to migrate incomplete source exports safely and repeatably | Existing discovery lists source needs but no approved import contract | Client source exports + migration owner approval | CRITICAL | Client + operations + migration owner | UNKNOWN |
| DATA-005 | DATA / INVENTORY | Package/bundle component inventory allocation and historical purchase snapshot behavior | Required to prevent stock/order/shipping mismatch for observed package products | Package names observed; components/stock allocation rules unknown | Product export + warehouse/operations SOP | HIGH | Client operations | UNKNOWN |

## Phase 5 design-governance additions

These entries record missing brand/design evidence exposed by Phase 5. They preserve the distinction between confirmed brand content positioning and unconfirmed visual identity.

| ID | Category | Unknown | Why it matters | Current evidence | Required source | Priority | Owner | Resolution status |
|---|---|---|---|---|---|---|---|---|
| DES-001 | DESIGN / BRAND | Approved brand asset package: logo variants/usage, color palette, typography, and brand guide | Required to finalize visual expression, token values, logo rules, and implementation-ready design system | No visual assets, logo files, fonts, colors, or brand guide are present in repository; request remains outstanding | Client brand asset package and approval owner | CRITICAL | Client brand/marketing + leadership | CLIENT DECISION REQUIRED |
| DES-002 | DESIGN / BRAND | Approved imagery, illustration, iconography, tone, cultural positioning, and visual-content direction | Required to govern product/editorial/education/branch/gallery visual treatment without unsupported cultural or brand assumptions | Education/community/commerce positioning is known; visual direction is not | Client brand/content/legal direction | HIGH | Client brand/marketing + content/legal | CLIENT DECISION REQUIRED |

## Summary Counts

- Total unknown registry items: 65
- CRITICAL priority items: 24
- HIGH priority items: 31
- MEDIUM priority items: 10
- LOW priority items: 0
- Client decisions required: 12

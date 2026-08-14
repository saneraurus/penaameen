# PENA AMEEN Media Design System

**Phase:** 5 — Design System & UX Blueprint

**Status:** PROPOSED media presentation governance. Media rights, source assets, brand imagery direction, aspect ratios, crop treatment, and placeholders remain client-gated or unknown. No imagery is generated, selected, or implemented.

## 1. Media principles

- Actual product/content/branch/event/gallery media must be approved, rights-cleared, accurately related, and accessible.
- Image presentation supports identity, comprehension, and task completion; it does not fabricate product, method, branch, event, delivery, or testimonial claims.
- Aspect ratio/crop roles are semantic tokens to be finalized after actual assets are reviewed.
- Missing media is an explicit state, not a reason to substitute invented imagery.

## 2. Media roles

| Media context | User purpose | Presentation rule | Data/rights dependency |
|---|---|---|---|
| Product imagery | Evaluate product, package, format, included items | Primary image plus approved supporting views; preserve truthful package context | ProductImage/MediaAsset rights/role/order/alt unknown |
| Article imagery | Support editorial understanding and social context | Featured/inline media supports reading, never replaces required text | Article media rights/caption/alt/source unknown |
| Education imagery | Explain AL-BARQY/ACM approved context | Use only approved method/resource media; no outcome implication | Education relation/content/brand approval |
| Branch imagery | Support local/community trust/context | Show verified approved branch context; no local inventory/service implication | Branch status/address/media rights unknown |
| Event imagery | Communicate approved event/recap | Date/location/status context remains textual and verified | Event source/rights/continuation unknown |
| Gallery imagery | Community/activity evidence | Curated, captioned, consent-aware grouping | Gallery media/consent/rights unknown |
| Document/label media | Download/private operational artifact | Access classification and clear purpose | ProductDocument/ShippingLabel policy unknown |

## 3. Aspect ratio and crop governance

| Token role | Intended use | Status |
|---|---|---|
| `media.product.primary` | Product detail primary evaluation image | PROPOSED; actual source asset review required |
| `media.product.card` | Product discovery card image | PROPOSED; must avoid misleading crop |
| `media.article.featured` | Article/archive social/featured media | PROPOSED |
| `media.inline` | Body/supporting illustration/image | PROPOSED |
| `media.education` | Education hub/resource media | PROPOSED |
| `media.branch/event/gallery` | Community/local/event asset context | PROPOSED |
| `media.avatar/testimonial` | Approved person representation | CLIENT DECISION REQUIRED |
| `media.document/private` | Label/download/receipt/private file context | CLIENT DECISION REQUIRED |

Exact ratios, crop focal points, object fit, placeholders, and responsive source behavior require asset inventory, brand direction, and component testing.

## 4. Missing, loading, and failed media

| State | UX rule |
|---|---|
| Loading | Preserve layout/role without pretending media is available |
| Missing source | Display approved neutral fallback/context and flag data quality; do not use invented image |
| Rights unknown | Do not publish as public asset; use review/quarantine state |
| Failed delivery | Preserve product/article/task context and offer safe retry/fallback |
| Decorative asset | Hide from assistive technology only when it adds no information |
| Informative asset | Provide meaningful approved alt/caption/context |

## 5. Accessibility, captions, and rights metadata

- Alt text describes meaningful image purpose in context; it is not a filename or keyword list.
- Captions, source/credit, rights, approval, and usage role remain data-backed where applicable.
- Product media must identify relevant product/package information when image carries it.
- Gallery/testimonial/person imagery requires explicit consent/rights treatment.
- Text needed for product, policy, branch, event, price, or order understanding must not appear only inside an image.

## 6. Responsive and performance rules

- Deliver responsive appropriate asset variants after media architecture implementation; do not define actual source URLs here.
- Preserve crop/context at compact/expanded layout; a responsive crop cannot remove required product or education meaning.
- Use explicit media dimensions/role metadata to avoid layout shift.
- Defer non-critical media; do not make image loading a prerequisite for checkout/error/tracking/support comprehension.
- Respect Phase 3 media/security/performance architecture and Phase 4 MediaAsset/Variant/Usage lifecycle.

## 7. Approval gate

Final imagery, visual direction, placeholders, aspect ratios, crops, icon style, illustration treatment, rights, and usage rules require `CDR-029`, `DES-001`, `DES-002`, and media/legal source validation.

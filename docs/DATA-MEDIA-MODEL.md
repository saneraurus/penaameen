# PENA AMEEN Media Data Model

**Phase:** 4 — Data Architecture

**Status:** PROPOSED logical asset model. Media library completeness, rights, ownership, alt text, captions, source mappings, storage provider, and retention remain unknown or client-decision-gated.

## 1. Media entities

| Entity | Purpose | Required logical fields | Optional/mutable/derived fields | Relationships | Lifecycle / audit / deletion |
|---|---|---|---|---|---|
| MediaAsset | Source/approved binary asset metadata and storage reference | Logical ID, source/storage reference, MIME, lifecycle, rights status, source/provenance | Filename, dimensions, checksum, title, alt text, caption, owner/rightsholder, delivery URL derived | 1:N MediaVariant/MediaUsage; ProductImage/ShippingLabel can reference it | Pending → validating → approved → attached → archived/removed; rights/upload/use/removal audited; do not remove shared/in-use asset blindly |
| MediaVariant | Responsive/generated rendition metadata | Logical ID, source asset, transform/version, storage ref, lifecycle | Dimensions, format, size, delivery URL derived | N:1 MediaAsset | Rebuildable; source/transform history retained; remove only under media policy |
| MediaUsage | Typed entity attachment/role/order | Logical ID, MediaAsset, target type/reference, role, status | Display order, focal/crop, alt/caption override, visibility | N:1 MediaAsset; N:1 Product/Article/Page/Hub/Branch/Event/Gallery/Testimonial/etc. | Attach/detach changes audited; detach relation instead of deleting shared asset |

## 2. Usage roles

| Target | Typical logical media roles | Data constraint |
|---|---|---|
| Product / Variant | Primary image, gallery image, packaging/detail image, document | Product publicability validates required approved media; roles/order must be explicit |
| Article | Featured image, inline educational image, social preview | Alt/caption/rights relationship required; preserve source media reference where possible |
| EducationHub | Hub image, resource media | Do not use asset to imply unapproved educational claim |
| Page | Hero/inline/policy attachment | Route/publication state controls visibility |
| Branch | Local context/photo/map asset | Verify active status/location/rights before public use |
| Event | Event/recap image | Validate date/context/rights/publication state |
| Gallery | Curated activity media | Consent/rights/caption/ordering critical |
| Testimonial | Optional identity/photo | Explicit permission/approval required |
| ShippingLabel/document | Private operational artifact | Restrict customer/staff access; never treat as public gallery media |

## 3. Required metadata concepts

- source media identifier and source URL/path when available;
- target logical asset ID and storage reference;
- original filename and detected MIME type;
- checksum/integrity marker where supported;
- width/height/dimensions where relevant;
- media lifecycle and approval state;
- ownership/rightsholder/permission/source context;
- alt text, caption, title, credit/attribution where applicable;
- public/private access classification;
- related target usages, roles, display order, focal/crop intent;
- import/validation result and audit history.

## 4. Rights and ownership

Media rights are `CLIENT DECISION REQUIRED`. The model must distinguish:

- source existence from permission to reuse;
- ownership from licensed/approved usage scope;
- public product/content media from private labels/documents;
- asset approval from individual target usage approval;
- original asset from generated derivative;
- archival retention from public visibility.

No imported image is automatically considered approved simply because it exists on the source website.

## 5. Migration requirements

For every source asset, attempt to map source ID/file URL/path → MediaAsset → MediaUsage target relationships. Validation detects missing file, duplicate checksum/path, bad MIME, missing alt/caption, unknown rights, orphaned usage, broken public delivery, missing product primary image, and source/target count discrepancies.

If a source asset cannot be validated, it remains quarantined/missing in the migration report; it is not silently replaced with fabricated imagery or published under an unsupported claim.

## 6. Retention and security

- Private label/document media uses restricted access classification and separate delivery policy.
- Public asset URLs are derived from approved MediaAsset/MediaUsage/publication state, not raw source paths.
- Upload/processing/audit records minimize PII and must not expose object storage secrets.
- Deletion, backup, rights expiration, consent withdrawal, customer photo handling, legal hold, and media retention periods remain legal/client decisions.

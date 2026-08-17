# PENA AMEEN Media Architecture

**Phase:** 3 — Technical Architecture

**Status:** PROPOSED media lifecycle and storage boundary. Object-storage/CDN provider, media library completeness, ownership, rights, source files, alt text, captions, and migration mapping remain unknown or client-gated. No storage service or media pipeline is implemented.

## 1. Media architecture principle

Media binary assets are stored through an object-storage port. PostgreSQL stores media metadata, ownership/rights context, lifecycle state, entity references, image role/order, alt text/caption, and migration provenance. Media is not stored as uncontrolled binary data in the commerce database and is not trusted simply because a file was uploaded.

```text
Authorized upload or migration source
→ upload validation/quarantine
→ object-storage port
→ media metadata record
→ optional derivative/optimization job
→ approved entity attachment
→ public delivery URL through cache/CDN layer
```

## 2. Media classes

| Media class | Primary use | Required metadata | Publicability gate |
|---|---|---|---|
| Product image | Product detail/card/category trust and SEO | Product/variant role, order, alt text, rights, source ID, dimensions | Active product, approved rights, valid image/alt context |
| Article image | Featured/inline editorial content/social preview | Article placement, alt/caption, author/source/rights, dimensions | Published article and approved media |
| Education media | AL-BARQY/ACM hub explanatory media | Hub relationship, caption/alt/rights | Approved educational claim/context |
| Branch media | Local/community proof/context | Branch relationship, location/rights/alt | Active accurate branch and rights approval |
| Gallery media | Activity/community evidence | Gallery grouping, caption/date/rights/consent | Client-approved media rights/treatment |
| Event media | Event/recap context | Event relationship, date/location/rights | Approved event publication |
| Document | Policy, downloadable information, label/receipt if applicable | MIME type, security classification, owner, access mode | Explicit public/private policy |
| Generated derivative | Responsive image/thumbnail/social rendition | Source media reference, transform version, lifecycle | Derived only from approved source |

## 3. Media lifecycle

| State | Meaning | Allowed next state |
|---|---|---|
| Pending upload/import | File intent/source exists, not trusted/published | Validating, rejected |
| Validating | MIME, size, integrity, malware/content policy checks run | Quarantined, processing, approved |
| Quarantined | Unsafe/unknown file requires review | Rejected, approved only with authorized resolution |
| Processing | Derivative/metadata/optimization work pending | Approved, failed |
| Approved | Asset is valid for authorized entity attachment | Attached, archived, removed |
| Attached | Referenced by one or more content/product entities | Reordered/replaced/archived |
| Archived | Retained for history but not new public use | Restored/removed per policy |
| Removed | No longer deliverable under approved lifecycle | Terminal; references must be remediated |
| Failed | Validation/processing failed | Retry/manual review |

A product/article/page cannot silently publish with a required missing/broken media asset without an explicit approved fallback state.

## 4. Upload and storage security

- Accept allowlisted file types and bounded file sizes only.
- Verify actual file signatures/MIME rather than trusting browser name/extension.
- Generate safe object keys; never use untrusted filenames as executable/public paths.
- Store uploaded originals outside application executable paths.
- Scan/quarantine uploads before public use according to final security tooling.
- Restrict private documents/labels/receipts from public object delivery.
- Use signed/time-bound access patterns for private files where final storage architecture requires it.
- Strip or control unneeded metadata that could leak location/device/PII, subject to media policy.
- Audit staff upload/replace/remove/right-status actions.

## 5. Image optimization and responsive delivery

### Proposed approach

- Preserve approved source originals for migration/quality while generating validated responsive derivatives where needed.
- Serve appropriately sized image formats/resolutions through a cache/CDN delivery layer selected later.
- Avoid shipping oversized product/editorial images as Largest Contentful Paint candidates.
- Keep transformation/version metadata so a derivative can be regenerated safely after policy/format changes.
- Use stable asset references, not fragile direct source-site image URLs.

### Accessibility and SEO

- Alt text is data, not a presentation afterthought.
- Product images require role-aware alt context; editorial images require meaningful alt or explicitly decorative status where appropriate.
- Captions, title/source, attribution, and focal/crop intent may be supported where approved.
- Missing source alt text must be flagged for content/SEO remediation, not invented automatically.

## 6. Ownership, rights, and consent

| Requirement | Status |
|---|---|
| Full media library and source mapping | UNKNOWN |
| Product/editorial image ownership | UNKNOWN / client legal confirmation required |
| Gallery/testimonial/person consent | UNKNOWN / client legal confirmation required |
| Branch/event media publication rights | UNKNOWN / client confirmation required |
| Original file export/backup | Required migration input |
| Allowed generated derivatives/cropping | Requires policy/rights review |

A media record needs source, owner/rightsholder/permission context where supplied, approved usage scope, and review state. A file with unknown rights is not automatically eligible for public reuse.

## 7. Migration mapping

For each source asset where possible, retain:

- source media ID/path/URL/filename/MIME/checksum if available;
- target Media identity/object key;
- attached source product/article/page/branch/event relationships;
- role/order/alt/caption/source attribution;
- rights/approval status;
- import/validation result;
- legacy URL/image redirect or replacement decision where relevant.

Broken source image links, hotlinking, unknown asset ownership, duplicate assets, missing alt text, and missing entity references are migration defects requiring review.

## 8. Operational ownership and observability

Media/content/catalog staff own approved attachment and metadata; security/platform operations own upload/storage controls; legal/marketing/client own rights/claims decisions. Observe upload validation failure, processing delay/failure, broken public media, derivative errors, missing alt text, missing rights, object access errors, and orphan media references.

## 9. Deferred decisions

Object-storage/CDN provider, image transformation tooling, scanner, upload library, file size limits, retention, backup, private document/label strategy, watermarking, social-image generation, and migration tooling are deferred to later approved implementation decisions.

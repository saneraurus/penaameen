# PENA AMEEN Media Implementation Constitution

**Phase:** 6 — Implementation Constitution

**Status:** Mandatory media/storage rules. Storage/CDN provider, asset rights, source media, transformations, limits, retention, and access policy remain unresolved.

## 1. Upload and storage boundary

```text
Authorized upload/import → validation/quarantine → Media service → Storage Port → approved object storage
```

Media domain owns metadata, rights, lifecycle, variants, and usages. Storage provider owns binary delivery only; it does not decide rights/publication/SEO relationship.

## 2. Mandatory rules

- Validate MIME/signature, size, dimensions where relevant, source, rights, target usage, and access class before public publication.
- Use safe generated object keys; never trust filename/path as executable/public identity.
- Store MediaAsset/Variant/Usage metadata and source provenance; attach only to allowed typed targets.
- Generate responsive/optimized variants through approved worker/service boundary; preserve original/reference according to policy.
- Require approved alt/caption/role context for meaningful public media; do not auto-invent alt text.
- Keep shipping labels/documents/private assets access-restricted and separate from public media delivery.
- Detect orphaned/broken/unlicensed/missing media and block/flag publication appropriately.
- Archive/detach/rights-revoke without breaking historical order/audit/source mapping; hard deletion requires policy/reference validation.

## 3. Prohibited behavior

- Public hotlinking to unvalidated source-site assets as target architecture.
- Upload directly from UI to public location without server/service validation policy.
- Storing storage credentials in browser/code/logs.
- Publishing unknown-rights gallery/testimonial/branch/product media.
- Embedding required text/policy/product information only in images.

## 4. Implementation gate

No storage adapter/upload/transform pipeline starts until provider ownership, asset rights, access classification, approved file policy, media source export, backup/retention, and legal consent decisions are approved.

# Step 9 Staging Readiness Gate

**Status:** Repository gate implemented; staging credentials/deployment remain external blockers.

## Commands

```text
npm run staging:readiness
npm run db:migration:status
npm run check
npm run test:e2e
```

`staging:readiness` never prints secret values, never deploys, never migrates, and never calls payment/email providers. It checks that the process is explicitly evaluating `APP_ENV=staging`, validates required configuration presence, identifies blocked provider groups, scans tracked files for common credential material, and reports whether authenticated E2E state exists.

## Authenticated E2E

Set `PLAYWRIGHT_AUTH_STATE` only through the staging secret/CI workspace. Do not commit the storage state file. When absent, the authenticated project is not enabled and the test remains skipped; public/security E2E remains active.

## Database gate

`db:migration:status` is intentionally separate and read-only. Run it only with the staging `DATABASE_URL` after backup/restore readiness is confirmed. No automatic `migrate deploy`, `db push`, reset, or destructive command is included in this step.

## Current blockers

- No staging deployment target or CI provider is configured.
- Provider sandbox keys are incomplete from Step 3.
- No approved backup/restore evidence.
- No `PLAYWRIGHT_AUTH_STATE` staging artifact.
- No production secret manager, DNS, monitoring, or rollback owner configured.

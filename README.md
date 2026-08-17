# PENA AMEEN Digital Commerce Platform

PENA AMEEN is a single-vendor education-commerce platform. The repository currently contains the Phase 7 implementation foundation; provider integrations, source migration, production data, and production deployment remain explicitly blocked by project gates.

## Foundation status

- App runtime: Next.js App Router with TypeScript.
- Styling: Tailwind-oriented semantic foundation with no approved final brand values.
- Data: repository and domain contracts only; no physical database, ORM, migration, or client data import.
- Providers: payment, shipping, notification, media, search, analytics, authentication, and platform integrations remain provider-neutral or deferred.

## Local prerequisites

- Node.js 22 or newer
- npm 10 or newer

## Local workflow

```bash
npm install
cp .env.example .env.local
npm run dev
```

Useful commands:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

Optional browser E2E setup requires an installed Playwright browser runtime. It is intentionally separate from the default test command:

```bash
npx playwright install chromium
npm run test:e2e
```

## Safety rules

Read `PROJECT.md`, `AGENTS.md`, and the Phase 1–6 documentation before implementation work. Follow `docs/IMPLEMENTATION-CONSTITUTION.md` and `docs/IMPLEMENTATION-GATE-MATRIX.md`.

Do not add provider integrations, source/client data imports, database migrations, final brand assets, production secrets, deployment changes, or public URL changes without the applicable approved gate.

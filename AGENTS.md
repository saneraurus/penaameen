# AGENTS.md — PENA AMEEN Repository Instructions

Scope: the entire repository.

Future coding agents must follow these rules:

1. Read `PROJECT.md` before starting work.
2. Read relevant documents under `docs/` before modifying code or documentation.
3. Never implement unknown business rules.
4. Never invent missing credentials or configuration.
5. Never modify migration-critical behavior casually.
6. Never change URLs without SEO review and a documented migration decision.
7. Never install dependencies without justification.
8. Never skip tests for code changes; document any environment-limited checks.
9. Never mark incomplete work as complete.
10. Update documentation when approved architecture changes.
11. Keep commits focused.
12. Do not mix unrelated changes.
13. Follow approved architecture documents once they exist.
14. Ask for clarification only when a real blocking decision exists.
15. Prefer reversible changes.
16. Preserve backward compatibility where required.
17. Treat payment and shipping integrations as provider-agnostic until providers are confirmed.
18. Treat existing website data as migration-sensitive.

Additional controls:

- `UNKNOWN` stays `UNKNOWN` until resolved by a required source.
- `CLIENT DECISION REQUIRED` blocks dependent implementation.
- Do not build application features before their phase is approved.
- Do not add UI, database schema, payment, shipping, authentication, or admin implementation during documentation/control phases.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

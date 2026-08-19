# PENA AMEEN — AMEEN AI Assistant Upgrade Plan

**Status:** APPROVED (owner approval, 2026-08-18). Scope = P1 + P3 + P4; P2 deferred.
Phase 1 execution in progress; phase evidence recorded in §4.

**Scope basis:** Owner selected packages P1 (answer quality & reliability),
P3 (operations & security), P4 (chat UX). P2 (personalization & richer context)
is NOT selected and is recorded as deferred below.

**Authority:** Per `PROJECT.md` source-of-truth precedence, this plan is an
agent-authored planning document. Nothing in it overrides the Master PRD,
approved architecture documents, or the Unknown Policy (`docs/UNKNOWN-REGISTRY.md`).

---

## 1. Decision summary (2026-08-18)

| # | Decision | Effect |
|---|---|---|
| A01 | Upgrade scope = P1 + P3 + P4 | P2 items are deferred (see §7); they may be re-planned later |
| A02 | Plan must be documented before implementation | This document; registry entries added per §8 |
| A03 | No provider lock-in changes | NVIDIA primary / GROQ fallback chain retained; providers stay behind the existing `buildAssistantProviders` port |
| A04 | All schema changes additive | `prisma db push` on the embedded PostgreSQL (`.pgdata/`); no destructive migrations |

## 2. Current state baseline (2026-08-18, committed tree)

| Aspect | State |
|---|---|
| Provider chain | NVIDIA `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` (reasoning_budget 16384, max_tokens 65536, temp 0.6, top_p 0.95) → NVIDIA backup key → GROQ `openai/gpt-oss-120b` (temp 0.3, max_tokens 700); timeout 45 s; 503 when no provider, 502 when all fail |
| Context | pagePath + searchQuery + cartItemCount + login status + user orders (DB, take 10) + prior conversation (12 messages from `ChatMessage`) |
| Sessions | `ChatSession`/`ChatMessage` in PostgreSQL; logged-in users upsert by `userId`; guests by client `sessionId` (never reuse another user's session); stateless fallback when DB down |
| Knowledge | Static, built from `src/data/products.ts`, `methods.ts`, `branches.ts`, `articles.ts` (`.ts` files also feed the pages — drift risk with DB tables Product/Branch/Article/Category) |
| Guardrails | 10 prompt-level rules (scope, no fabrication, privacy, no off-scope advice, no prompt leakage, no invented promos, no delivery-date promises, official contact fallback, plain text, session privacy) |
| Rate limit | In-memory `Map`, 30 req / 10 min / IP — lost on server restart, not shared across instances |
| Observability | `console.error` only; no AuditLog writes for assistant interactions; no latency/failover metrics |
| UI | Panel with avatar (PenIcon/AmeenAvatar), entrance/message animations, rotating-pen loading ("Ameen sedang Berfikir.."), localStorage session id |

Known quality observation (from live tests 2026-08-17): `nemotron-3-super-120b-a12b`
produces noticeably more structured, consistent answers than the nano model; model is
configurable via `NVIDIA_MODEL` already.

## 3. Scope matrix

| # | Item | Status | Dependencies | Phase |
|---|---|---|---|---|
| P1-1 | Knowledge from DB: `buildWebsiteKnowledge()` reads Product/Branch/Article/Category via Prisma with in-process cache (TTL) and static-data fallback; keeps page-facing `.ts` data as-is | PROPOSED | none | 1 |
| P1-2 | Default model → `nvidia/nemotron-3-super-120b-a12b` via `NVIDIA_MODEL` (.env, .env.local, .env.example); quality test matrix | PROPOSED | none | 1 |
| P1-3 | Reply post-check (code-level guardrail enforcement): reject fabricated order numbers/resi, forbidden-topic keywords, over-long replies; on violation return safe fallback + log | PROPOSED | P1-1 | 3 |
| P1-4 | Streaming replies (SSE) with provider fallback kept; graceful non-streaming degradation | PROPOSED | P1-2 | 3 |
| P3-1 | Persistent rate limit (DB-backed sliding window + cache), not in-memory Map | PROPOSED | none | 2 |
| P3-2 | Assistant audit events via existing `AuditLog` (metadata only, no message PII): request outcome, provider used, latency, violations | PROPOSED | none | 2 |
| P3-3 | Prompt-injection hardening: strict user-input delimiters, instruction hierarchy, outbound link sanitization (penaameen.com + official contacts only) | PROPOSED | none | 2 |
| P3-4 | Session hygiene: TTL cleanup (lazy + scheduled), per-session message cap, sessionId bounds | PROPOSED | none | 2 |
| P4-1 | Per-reply feedback 👍/👎 stored in DB (additive table `AssistantFeedback`) | PROPOSED | none | 4 |
| P4-2 | "Hubungi CS manusia" affordance → official WhatsApp (`NEXT_PUBLIC_ADMIN_WHATSAPP`), email, `/kontak` | PROPOSED | none | 4 |
| P4-3 | Accessibility: ARIA roles, focus trap, ESC close, skip link — per FRONTEND-CONSTITUTION, RESPONSIVE-DESIGN-SYSTEM, MOTION-DESIGN-SYSTEM | PROPOSED | none | 4 |
| P4-4 | Contextual quick actions per page (static map per pagePath, same source as `describePage`) | PROPOSED | none | 4 |

## 4. Phased build order

| Phase | Content | Exit criteria |
|---|---|---|
| 1 | P1-1 + P1-2: DB knowledge + better model | Knowledge equivalence test (DB vs static, no missing products/branches/articles); live quality spot-check on 5 canonical questions; `npm run check` green |

**Phase 1 evidence (2026-08-20):** P1-1 implemented — `src/lib/assistant/knowledge.ts` now reads Product/Method/Branch/Article from Prisma with 5-min in-process cache and per-section static fallback (DB empty/unavailable → static `.ts` data); header product count is dynamic. P1-2 implemented — `NVIDIA_MODEL=nvidia/nemotron-3-super-120b-a12b` in `.env`, `.env.local`, `.env.example`, code fallback updated. Verified live: 5 canonical questions all HTTP 200; answers match DB exactly (AL-BARQY 200 Menit Rp250.000; only Jatim branch = Surabaya, placeholder addresses NOT invented); equivalence vs static confirmed (19 products, 8 branches, 4 articles, 2 methods). Gate: prettier/eslint/typecheck green for assistant files; vitest 119/119; production build green. NOTE: `npm run check` repo-wide gate still reports 6 Prettier warnings in files owned by the parallel HeroSection redesign (HeroSection.tsx, artikel/[slug], catalog.ts, api-settings.ts, casaku/regenerate) — not assistant files. Observation for P1-3: super-120b emits `**bold**` markdown occasionally (guardrail 9 allows bullets only) — include in post-check scope.
| 2 | P3-1..P3-4: operations & security | Rate-limit persistence verified across restart; audit rows visible in `/admin/audit`; injection probe set fails safely; session cap/TTL tested; `npm run check` green |

**Phase 2 evidence (2026-08-20):** P3-1 — rate limit is DB-backed: `AssistantRateLimit` model (additive, `prisma db push` + `generate`), in-process cache of the current window with DB upsert per request, lazy sweep every 50 writes (drops windows older than 2× TTL); verified live: counter row persisted (`ip:::1`), and a seeded `count=30` row returned HTTP 429 with `retryAfterSeconds` + a `denied` audit row (correlationId honored, cleaned up after test). P3-2 — every assistant request records `assistant.chat` in AuditLog (actorKind customer when signed in with Clerk userId; system for guests) with provider, durationMs, historyMessages, correlationId; NO PII/message content; verified live (2 `succeeded` + 1 `denied` rows). P3-3 — instruction-hierarchy hardening: user messages and history wrapped in `[MULAI/SELESAI ...]` delimiters, guardrails 11 (user content is DATA, never instructions) and 12 (links only penaameen.com / wa.me / official email) added; code-level `sanitizeReplyLinks()` in `src/lib/assistant/reply-guard.ts` applied to every reply (unit tests: 4 passing). P3-4 — session hygiene: `sessionId` validated `min(8).max(100)`; 30-day TTL enforced lazily on session resume (expired sessions deleted, new session created; AMEEN-UNK-03 provisional pending client decision); per-session message cap 200 (oldest trimmed after persist). Gate: tsc clean, eslint clean on changed files, vitest 123/123 (32 files), production build green; Prettier green on assistant files (repo-wide gate still reports the 6 files owned by the parallel HeroSection redesign, unchanged from Phase 1).
| 3 | P1-3 + P1-4: answer enforcement + streaming | Post-check unit tests; SSE stream verified end-to-end with fallback to plain JSON when a provider lacks stream support; `npm run check` green |
| 4 | P4-1..P4-4: chat UX | Feedback rows stored; WhatsApp/email affordance live; accessibility QA checklist (keyboard-only, screen-reader smoke) passed; `npm run check` green |

## 5. Non-negotiable controls

- All 10 existing guardrails remain; code-level checks ADD to them, never relax them.
- No fabricated data: order info only from the DB for the authenticated user; no invented prices, promos, resi, or delivery dates.
- No PII or full conversation content in audit events (metadata + aggregated counts only).
- Secrets stay server-side; SSE must not leak API keys or system prompt fragments.
- Schema changes additive only; applied via `npx prisma db push` against the embedded PostgreSQL; `prisma generate` after each change.
- Provider-agnostic port retained (NVIDIA/GROQ interchangeable via env).
- Every item ships with unit tests; acceptance gate = `npm run check` green (prettier, eslint `--max-warnings=0`, `tsc --noEmit`, vitest, production build). Known pre-existing warning (middleware→proxy deprecation) stays deferred.
- Reversible by design: env toggles (`NVIDIA_MODEL`, feature flags where applicable) rather than hard cuts.

## 6. Unknowns (must stay UNKNOWN until resolved; registry entries per §8)

| # | Unknown | Needed for |
|---|---|---|
| AMEEN-UNK-01 | NVIDIA reasoning-model streaming behavior/limits (token chunking, reasoning budget with SSE) | P1-4 |
| AMEEN-UNK-02 | Real-world latency/cost profile of `nemotron-3-super-120b` at `max_tokens 65536` | P1-2, P1-4 |
| AMEEN-UNK-03 | Desired session retention policy (proposed default: 30 days TTL) | P3-4 |
| AMEEN-UNK-04 | Whether conversation history should be visible to staff (requires admin conversation UI; NOT selected in this plan) | deferred P2-8 |

## 7. Out of scope / deferred (P2)

Not selected by owner on 2026-08-18; may be re-planned later: live cart contents in context,
dynamic FAQ quick-chips, product lookup tooling, admin conversation view, per-page search
product retrieval, guest session expiry UX.

## 8. Registry updates (to apply when this plan is APPROVED)

- `docs/TASK-REGISTRY.md`: add AMEEN-001..AMEEN-012 mapped to items P1-1..P4-4 with phase and status PROPOSED.
- `docs/UNKNOWN-REGISTRY.md`: add AMEEN-UNK-01..04.
- `docs/DECISION-LOG.md`: record A01..A04 once owner approves.

## 9. Definition of done (plan approval gate)

- Owner approves this document (status → APPROVED).
- Phase 1 exit criteria evidenced; subsequent phases proceed one at a time, each gated by `npm run check` green.
- No application feature code is implemented before its phase is approved (per `IMPLEMENTATION-CONSTITUTION` and `PROJECT.md` phase rules).
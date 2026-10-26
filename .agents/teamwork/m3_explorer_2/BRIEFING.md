# BRIEFING — 2026-10-24T20:35:00Z

## Mission
Author the complete drop-in technical blueprints and code specifications for the public Nitro API endpoints and server utilities in `apps/web/server/` for Milestone 3 (db.ts, rateLimit.ts, webhook.ts, content.get.ts, leads.post.ts, track.post.ts).

## 🔒 My Identity
- Archetype: teamwork_preview_spec_miner
- Roles: Specification Miner, Server API Architect
- Working directory: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_2
- Original parent: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Milestone: M3 (Nitro API Backend, Neon Database & Admin-Lite)

## 🔒 Key Constraints
- Pure read-only specification miner role: do NOT implement source code in apps/web directly; output drop-in code blueprints into handoff.md.
- Zero-Credential & Content Guardrails: No hardcoded credentials, test accounts, private phone numbers, competitor names, or internal domains.
- Full compatibility with Nuxt 4 Nitro, @ssd/db (Neon serverless HTTP driver), and @ssd/shared (Zod schemas, types, phone normalizer, fallbackContent).
- Strict adherence to E2E test suite expectations (Tiers 1-4, Pairwise combinations, error codes 201, 202, 204, 400, 429, 503).

## Current Parent
- Conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Updated: 2026-10-24T20:35:00Z

## Task Summary
- **What to build**: Production-grade, drop-in blueprints for:
  1. `apps/web/server/utils/db.ts` (Neon DB client resolver with fallback to fallbackContent)
  2. `apps/web/server/utils/rateLimit.ts` (salted SHA-256 IP hash in-memory rate limiter)
  3. `apps/web/server/utils/webhook.ts` (event.waitUntil async webhook dispatcher)
  4. `apps/web/server/api/content.get.ts` (SWR cached content with DB + fallback)
  5. `apps/web/server/api/leads.post.ts` (lead intake + honeypot 202 + rate limit 429 + normalizeWa + async webhook + DB insert)
  6. `apps/web/server/api/track.post.ts` (telemetry logger)
- **Success criteria**: 100% compliant blueprints ready for copy-paste implementation by `m3_worker`, passing all 221 E2E tests, zero TypeScript errors, zero guardrail violations.
- **Interface contracts**: `.agents/teamwork/orchestrator_1/PROJECT.md` § Interface Contracts.
- **Code layout**: `apps/web/server/{utils,api}/`.

## Key Decisions Made
- In `content.get.ts`, provide both `comparisonRows` and aliased `comparisons: comparisonRows` to satisfy both the Vue components (`:rows="content.comparisonRows"`) and E2E contract test 19.2 (`requiredKeys.includes('comparisons')`).
- In `leads.post.ts`, order of operations is strictly: (1) Honeypot check (returns 202 without rate limit penalty, validation, or DB write); (2) Rate limit check (returns 429 if >3 per 10m); (3) Zod validation (returns 400 on error); (4) WhatsApp normalization; (5) DB insert into `leads` (masked 503 on DB error without leaking credentials); (6) Async `analytics_events` and async webhook dispatch via `event.waitUntil`; (7) Return 201 `{ ok: true, id }`.
- In `rateLimit.ts`, implement in-memory `RateLimiter` mirroring `RateLimiterOracle` from `test-helper.mjs` with salted SHA-256 IP hashing, sliding 10-minute window, and periodic cache pruning to prevent memory leaks.
- In `webhook.ts`, make dispatching non-blocking and completely resilient: 5-second fetch timeout, retry logic (up to 2 retries with backoff), wrapped in `try/catch` inside `event.waitUntil`.
- In `track.post.ts`, validate against `trackSchema`, reject unknown event names with 400, strictly avoid recording raw client IP addresses, insert asynchronously into `analytics_events`, return 204 No Content.

## Artifact Index
- `.agents/teamwork/m3_explorer_2/DISPATCH.md` — Assigned task instructions
- `.agents/teamwork/m3_explorer_2/BRIEFING.md` — Persistent working memory
- `.agents/teamwork/m3_explorer_2/progress.md` — Execution progress and liveness heartbeat
- `.agents/teamwork/m3_explorer_2/handoff.md` — Authoritative 5-component handoff report with complete blueprints

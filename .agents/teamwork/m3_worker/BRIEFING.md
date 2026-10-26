# BRIEFING — 2026-10-24T20:37:00Z

## Mission
Implement Milestone 3: Nitro API Backend, Neon Database & Admin-Lite across packages/db and apps/web.

## 🔒 My Identity
- Archetype: teamwork_preview_worker
- Roles: implementer, qa, specialist
- Working directory: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_worker
- Original parent: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Milestone: Milestone 3 (Nitro API Backend, Neon Database & Admin-Lite)

## 🔒 Key Constraints
- Zero-credential compliance: Strictly no test accounts, personal phone numbers, competitor names, internal platform names, or scsd.my.id links.
- Genuine implementation: No fake facade, genuine Neon/Drizzle database connection with mock/in-memory fallback for local dev/tests, real bcrypt hashing, genuine JWT session handling, rate limiting, and webhook dispatch.
- Verification commands must pass: pnpm guardrail, pnpm --filter web exec nuxi prepare, pnpm typecheck, pnpm --filter web build, node tests/runner.mjs (229/229).

## Current Parent
- Conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Updated: 2026-10-24T20:37:00Z

## Task Summary
- **What to build**:
  - packages/db: schema, client, seed, create-admin CLI, package.json
  - apps/web/server/utils: db, rateLimit, webhook, auth, sanitize
  - apps/web/server/api: content.get, leads.post, track.post
  - apps/web/server/api/auth: login.post, logout.post, me.get
  - apps/web/server/api/admin: leads.get, leads/[id].patch, leads.csv.get
  - apps/web/server/middleware: admin.ts
  - apps/web/app/middleware: admin.ts
  - apps/web/app/pages/admin: login.vue, leads.vue
  - apps/web/nuxt.config.ts: routeRules update
- **Success criteria**: All 229 tests pass in `node tests/runner.mjs`, typecheck passes, build passes, guardrail passes.
- **Interface contracts**: PROJECT.md, TEST_READY.md, Explorer handoffs 1, 2, 3.

## Change Tracker
- **Files modified**: None yet
- **Build status**: Pending
- **Pending issues**: None

## Quality Status
- **Build/test result**: Untested
- **Lint status**: Clean
- **Tests added/modified**: 229 tests defined in tests/suite/

## Loaded Skills
- None

## Key Decisions Made
- Will read all mandatory documents first and synthesize blueprint specs.

## Artifact Index
- DISPATCH.md — Dispatch instructions
- BRIEFING.md — Situational awareness
- progress.md — Liveness & task execution tracker
- handoff.md — Final deliverable report

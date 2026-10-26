# DISPATCH — m3_worker

**Agent**: `m3_worker`  
**Role**: `teamwork_preview_worker` (Backend, Database & Admin-Lite Implementation Worker)  
**Parent / Dispatcher**: `orchestrator_1` (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_worker`  

## Objective
Implement Milestone 3 (Nitro API Backend, Neon Database & Admin-Lite) across `packages/db` and `apps/web` using the complete blueprints provided by `m3_explorer_1`, `m3_explorer_2`, and `m3_explorer_3`.

## Mandatory Input Documents (READ FIRST)
1. `d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md` (Mandatory - read first!)
2. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `d:\All Project Website\Web School Smart Digital\TEST_READY.md`
4. Blueprints:
   - `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_1\handoff.md` (packages/db schema, client, seed, create-admin CLI)
   - `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_2\handoff.md` (server utils & public Nitro endpoints: /api/content, /api/leads, /api/track)
   - `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_3\handoff.md` (server utils & auth/admin endpoints: /api/auth/*, /api/admin/*, and Admin-Lite SPA /admin/login.vue, /admin/leads.vue)

## Write Ownership
You have exclusive write ownership over:
- `packages/db/**`
- `apps/web/server/**`
- `apps/web/app/middleware/admin.ts`
- `apps/web/app/pages/admin/**`
- `apps/web/nuxt.config.ts` (routeRules for /admin/**)

## Mandatory Integrity Warning
> DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Zero-Credential Guardrails
Strictly no test accounts (`guru123`, `walimurid123`), personal phone numbers (`62811110...`), competitor brand names (`MySCH`, `Smarteschool`, `Dapodik`), internal platform names, or `scsd.my.id` links.

## Verification Requirements
After completing implementation, you must execute and document:
1. `pnpm guardrail` (0 violations)
2. `pnpm --filter web exec nuxi prepare` (exit code 0)
3. `pnpm typecheck` (0 errors across `@ssd/shared`, `@ssd/db`, and `apps/web`)
4. `pnpm --filter web build` (exit code 0, complete build in `.output/`)
5. `node tests/runner.mjs` (229/229 tests passing, 100%)

## Output Requirements
Write `handoff.md` in your working directory (`d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_worker\handoff.md`) with Observation, Logic Chain, Caveats, Conclusion, and Verification Method.
Deliver by sending a message to parent `1ff91f96-3422-4423-9647-7ab08609ae2d` when complete.


## 2026-10-24T20:36:40Z
You are m3_worker, the implementation worker for Milestone 3 (Nitro API Backend, Neon Database & Admin-Lite).
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_worker
Read d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_worker\DISPATCH.md for your full task.

MANDATORY INPUT DOCUMENTS (READ FIRST):
1. d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md
2. d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md
3. d:\All Project Website\Web School Smart Digital\TEST_READY.md
4. Blueprints:
   - d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_1\handoff.md
   - d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_2\handoff.md
   - d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_3\handoff.md

Implement all components and scripts across:
- packages/db/ (index.ts, schema.ts, seed.ts, create-admin.ts, package.json)
- apps/web/server/utils/ (db.ts, rateLimit.ts, webhook.ts, auth.ts, sanitize.ts)
- apps/web/server/api/ (content.get.ts, leads.post.ts, track.post.ts)
- apps/web/server/api/auth/ (login.post.ts, logout.post.ts, me.get.ts)
- apps/web/server/api/admin/ (leads.get.ts, leads/[id].patch.ts, leads.csv.get.ts)
- apps/web/server/middleware/admin.ts
- apps/web/app/middleware/admin.ts
- apps/web/app/pages/admin/ (login.vue, leads.vue)
- apps/web/nuxt.config.ts (routeRules update)

MANDATORY INTEGRITY WARNING:
> DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Zero-credential compliance: Strictly no test credentials or personal phone numbers.
Run all verification commands:
- pnpm guardrail
- pnpm --filter web exec nuxi prepare
- pnpm typecheck
- pnpm --filter web build
- node tests/runner.mjs

Write your completion handoff report in d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_worker\handoff.md and send a message back to parent 1ff91f96-3422-4423-9647-7ab08609ae2d.

# DISPATCH — m4_worker

**Agent**: `m4_worker`  
**Role**: `teamwork_preview_worker` (Security, Guardrails & Accessibility Hardening Worker)  
**Parent / Dispatcher**: `orchestrator_1` (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_worker`  

## Objective
Apply the hardening and polish patches for Milestone 4 (Security, Guardrails & Accessibility Hardening) using blueprints from `m4_explorer_1`, `m4_explorer_2`, and `m4_explorer_3`.

## Mandatory Input Documents (READ FIRST)
1. `d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md` (Mandatory - read first!)
2. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `d:\All Project Website\Web School Smart Digital\TEST_READY.md`
4. Blueprints:
   - `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_explorer_1\handoff.md` (HTTP security headers in nuxt.config.ts)
   - `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_explorer_2\handoff.md` (touch targets, 320px header balance, roving focus sync in SiteNavigation.vue & EcosystemSelector.vue)
   - `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_explorer_3\handoff.md` (SSR stream resilience, zero-JS progressive enhancement in HeroPortal.vue & EcosystemSelector.vue)

## Write Ownership
You have exclusive write ownership over:
- `apps/web/nuxt.config.ts`
- `apps/web/app/components/SiteNavigation.vue`
- `apps/web/app/components/EcosystemSelector.vue`
- `apps/web/app/components/HeroPortal.vue`

## Mandatory Integrity Warning
> DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Zero-Credential Guardrails
Strictly no test accounts (`guru123`), personal phone numbers (`62811110...`), competitor brand names (`MySCH`, `Smarteschool`, `Dapodik`), internal platform names, or `scsd.my.id` links.

## Verification Requirements
After completing implementation, you must execute and document:
1. `pnpm guardrail` (0 violations)
2. `pnpm --filter web exec nuxi prepare` (exit code 0)
3. `pnpm typecheck` (0 errors across `@ssd/shared`, `@ssd/db`, and `apps/web`)
4. `pnpm --filter web build` (exit code 0, complete build in `.output/`)
5. `node tests/runner.mjs` (229/229 tests passing, 100%)

## Output Requirements
Write `handoff.md` in your working directory (`d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_worker\handoff.md`) with Observation, Logic Chain, Caveats, Conclusion, and Verification Method.
Deliver by sending a message to parent `1ff91f96-3422-4423-9647-7ab08609ae2d` when complete.

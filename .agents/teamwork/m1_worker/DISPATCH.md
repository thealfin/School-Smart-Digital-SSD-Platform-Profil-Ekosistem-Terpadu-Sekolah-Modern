# DISPATCH — m1_worker

## Task
You are m1_worker (teamwork_preview_worker).
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_worker
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md
Read PROJECT.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Detailed Architecture Blueprints & Source Files
The three M1 Explorers have completed exhaustive blueprints and exact source code for you to implement:
1. `packages/shared` & `packages/db` complete code:
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_explorer_1\handoff.md`
2. `apps/web` scaffolding, `nuxt.config.ts`, Tailwind v4 `main.css`, and SVG brand assets:
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_explorer_2\handoff.md`
3. Hero S-Curve Morph aperture (`HeroPortal.vue`), math, and build verification plan:
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_explorer_3\handoff.md`
   Component implementation:
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_explorer_3\proposed_HeroPortal.vue`

## Exclusive Write Ownership
You exclusively own and will create/modify:
- `packages/shared/**`
- `packages/db/**`
- `apps/web/**`

DO NOT touch `tests/**` (owned by test_writer).

## Implementation Steps
1. Scaffold `packages/shared`:
   - `packages/shared/package.json`
   - `packages/shared/tsconfig.json`
   - `packages/shared/src/schemas.ts`
   - `packages/shared/src/types.ts`
   - `packages/shared/src/phone.ts`
   - `packages/shared/src/content/index.ts`
   - `packages/shared/src/index.ts`
2. Scaffold `packages/db`:
   - `packages/db/package.json`
   - `packages/db/tsconfig.json`
   - `packages/db/drizzle.config.ts`
   - `packages/db/src/schema.ts`
   - `packages/db/src/index.ts`
   - `packages/db/src/seed.ts`
   - `packages/db/src/create-admin.ts`
3. Scaffold `apps/web`:
   - `apps/web/package.json`
   - `apps/web/tsconfig.json`
   - `apps/web/nuxt.config.ts`
   - `apps/web/app/assets/css/main.css`
   - `apps/web/app/assets/svg/logo.svg`, `logo-mark.svg`, `logo-white.svg`
   - `apps/web/public/favicon.svg`
   - `apps/web/app/app.vue`
   - `apps/web/app/pages/index.vue`
   - `apps/web/app/components/HeroPortal.vue`
4. Run Verification Commands:
   - Run `pnpm install` from repository root
   - Run `pnpm guardrail` to ensure 0 violations
   - Run `pnpm --filter web exec nuxi prepare` (or `npx nuxi prepare apps/web`) to generate `.nuxt` types
   - Run `pnpm typecheck` to verify all monorepo packages typecheck cleanly
   - Run `pnpm --filter web build` to verify production build succeeds

Document every command executed, exit codes, and output in `handoff.md` in your working directory.
When complete, notify orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`).


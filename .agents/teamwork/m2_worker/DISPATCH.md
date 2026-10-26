# DISPATCH — m2_worker

## Task
You are m2_worker (teamwork_preview_worker).
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_worker
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md
Read PROJECT.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Authoritative Component Blueprints
The three Milestone 2 spec miners have produced complete, drop-in Vue 3 SFC and Pinia store implementations for you:
1. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_1\handoff.md`:
   - `apps/web/app/stores/ecosystem.ts`
   - `apps/web/app/components/SiteNavigation.vue`
   - `apps/web/app/components/ProblemList.vue`
   - `apps/web/app/components/EcosystemSelector.vue`
   - `apps/web/app/components/FlowTimeline.vue`
2. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_2\handoff.md`:
   - `apps/web/app/components/SpotlightTabs.vue`
   - `apps/web/app/components/ModuleGrid.vue`
   - `apps/web/app/components/RoleLadder.vue`
   - `apps/web/app/components/UnitDiagram.vue`
   - `apps/web/app/components/TrustPillars.vue`
   - `apps/web/app/components/HonestTable.vue`
3. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_3\handoff.md`:
   - `apps/web/app/components/ParentBrandStrip.vue`
   - `apps/web/app/components/FaqAccordion.vue`
   - `apps/web/app/components/ClosingCta.vue`
   - `apps/web/app/components/DemoForm.vue`
   - `apps/web/app/components/SiteFooter.vue`
   - `apps/web/app/pages/index.vue`

## Exclusive Write Ownership
You exclusively own and will create/modify:
- `apps/web/app/stores/**`
- `apps/web/app/components/**`
- `apps/web/app/pages/index.vue`

## Execution & Verification Sequence
1. Implement the Pinia store: `apps/web/app/stores/ecosystem.ts`.
2. Implement all landing components in `apps/web/app/components/`:
   - `SiteNavigation.vue`
   - `ProblemList.vue`
   - `EcosystemSelector.vue`
   - `FlowTimeline.vue`
   - `SpotlightTabs.vue`
   - `ModuleGrid.vue`
   - `RoleLadder.vue`
   - `UnitDiagram.vue`
   - `TrustPillars.vue`
   - `HonestTable.vue`
   - `ParentBrandStrip.vue`
   - `FaqAccordion.vue`
   - `ClosingCta.vue`
   - `DemoForm.vue`
   - `SiteFooter.vue`
3. Update `apps/web/app/pages/index.vue` to assemble all 14 components in semantic sequence with SSR data hydration.
4. Run the complete verification sequence:
   - Run `pnpm guardrail` (ensure 0 violations)
   - Run `pnpm --filter web exec nuxi prepare` (or `npx nuxi prepare apps/web`)
   - Run `pnpm typecheck` (ensure exit code 0)
   - Run `pnpm --filter web build` (ensure exit code 0)
   - Run `node tests/runner.mjs` (ensure 100% of tests pass)

Document all commands, exit codes, and output logs in `handoff.md` in your working directory.
When complete, notify orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`).


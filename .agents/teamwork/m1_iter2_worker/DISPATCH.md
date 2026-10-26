# DISPATCH — m1_iter2_worker

## Task
You are m1_iter2_worker (teamwork_preview_worker).
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_worker
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md
Read PROJECT.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Detailed Remediation Blueprints & Artifacts
The Milestone 1 Iteration 2 Explorers have authored the exact code and instructions to resolve the Nitro prerendering failure cleanly:
1. `proposed_privacy-policy.vue`:
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_1\proposed_privacy-policy.vue`
2. `proposed_terms.vue`:
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_1\proposed_terms.vue`
3. `proposed_faq.vue`:
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_1\proposed_faq.vue`
4. `proposed_nuxt.config.patch`:
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_1\proposed_nuxt.config.patch`
5. Verification standards:
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_3\handoff.md`

## Instructions
1. Write the genuine legal pages:
   - Create `apps/web/app/pages/privacy-policy.vue` from `proposed_privacy-policy.vue`.
   - Create `apps/web/app/pages/terms.vue` from `proposed_terms.vue`.
   - Create `apps/web/app/pages/faq.vue` from `proposed_faq.vue`.
2. Update `apps/web/nuxt.config.ts`:
   - Keep `{ prerender: true }` on `/privacy-policy` and `/terms`.
   - In the `nitro` config block, add:
     ```ts
     prerender: {
       crawlLinks: false,
       ignore: ['/admin/**', '/api/**']
     }
     ```
3. Run the complete 4-step verification sequence:
   - Run `pnpm guardrail` (ensure 0 violations)
   - Run `pnpm typecheck` (ensure exit code 0)
   - Run `pnpm --filter web build` (ensure exit code 0; inspect stdout to confirm `/privacy-policy` and `/terms` prerendered with HTTP 200 and zero errors)
   - Run `node tests/runner.mjs` (ensure 221/221 tests pass)

Document all commands, outputs, and exit codes in `handoff.md` in your working directory.
When complete, notify orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`).


## 2026-10-24T19:35:04Z
You are m1_iter2_worker.
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_worker
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md
Your dispatch instructions are at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_worker\DISPATCH.md
Read PROJECT.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Apply genuine legal pages (`privacy-policy.vue`, `terms.vue`, `faq.vue`) and defensive Nitro prerender config to apps/web according to the blueprints in:
- d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_1\proposed_privacy-policy.vue
- d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_1\proposed_terms.vue
- d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_1\proposed_faq.vue
- d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_1\proposed_nuxt.config.patch

Execute verification commands (`pnpm guardrail`, `pnpm typecheck`, `pnpm --filter web build`, `node tests/runner.mjs`), document all outputs in `handoff.md`, and notify the orchestrator (conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d).

# DISPATCH — m1_iter2_explorer_1

## Task
You are m1_iter2_explorer_1 (teamwork_preview_explorer).
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_1
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md
Read PROJECT.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md

## MANDATORY FORENSIC AUDIT FAILURE REPORT
The Forensic Auditor reported INTEGRITY VIOLATION for Milestone 1 Iteration 1.
Read the full, verbatim audit evidence report at:
`d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_auditor_1\handoff.md`

Auditor Evidence Summary:
- `pnpm guardrail`: PASSED (0 violations).
- `pnpm typecheck`: PASSED (exit code 0).
- `node tests/runner.mjs`: PASSED (221/221 passed).
- `pnpm --filter web build`: FAILED (exit code 1).
  Nitro prerenderer failed on routes `/privacy-policy` and `/terms` because `apps/web/nuxt.config.ts` specified `{ prerender: true }` but the corresponding pages `apps/web/app/pages/privacy-policy.vue` and `apps/web/app/pages/terms.vue` do not exist.

## Objective
Provide an exact, concrete remediation plan for the Worker:
1. Determine how to handle `/privacy-policy` and `/terms` in `apps/web/nuxt.config.ts` and/or `apps/web/app/pages/`.
2. Provide exact code for any files to modify or create.
3. Verify that the fix does NOT introduce any guardrail violations.

Write your report to `handoff.md` in your working directory and notify the orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`).


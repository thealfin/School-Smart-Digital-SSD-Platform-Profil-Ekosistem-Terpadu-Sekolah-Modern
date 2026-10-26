## 2026-10-25T11:39:44Z
You are worker_m2_1, a teamwork_preview_worker.
Your working directory is:
d:\All Project Website\Web School Smart Digital\.agents\teamwork\worker_m2_1

Authoritative request log:
d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md

Orchestrator Scope:
d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_2\SCOPE.md

Context & Explorer Hand-offs:
Three explorers independently audited the monorepo and reached 100% consensus:
- Explorer 1 report: d:\All Project Website\Web School Smart Digital\.agents\teamwork\explorer_m1_1\handoff.md
- Explorer 2 report: d:\All Project Website\Web School Smart Digital\.agents\teamwork\explorer_m1_2\handoff.md
- Explorer 3 report: d:\All Project Website\Web School Smart Digital\.agents\teamwork\explorer_m1_3\handoff.md

Summary of Problem & Findings:
1. `apps/web/app/components/HeroPortal.vue` lines 256–264 contains:
   ```html
   <noscript>
     <style>
       .hero-cliff { height: auto !important; min-height: 100svh; }
       ...
     </style>
   </noscript>
   ```
   nested inside `<template>`. In Vue 3 / Vite SFC compilation, `@vue/compiler-dom` emits error 64 (`X_IGNORED_SIDE_EFFECT_TAG`), crashing Vite with:
   `Tags with side effect (<script> and <style>) are ignored in client component templates.`
   causing `HeroPortal.vue:1 Failed to load resource (404)` and breaking `pages/index.vue`.
2. `HeroPortal.vue` lines 710–747 ALREADY contains identical fallback rules in `<style scoped>` under `@media (scripting: none)`.
3. All other 22 `.vue` files are 100% clean of template side-effect tags (`EcosystemSelector.vue` has a valid `<noscript>` with pure HTML markup, keep it as-is).
4. Master test suite `tests/runner.mjs` (Tier 1 Test 26.5) asserts:
   - `heroSrc.includes('<noscript>')`
   - `heroSrc.includes('.hero-cliff { height: auto !important; min-height: 100svh; }')`
   `tests/stress-m5-frontend-adversarial.mjs` test 6.1.2 asserts:
   - `heroSrc.includes('<noscript>')`
   - `.media { position: relative !important; clip-path: none !important;`
   - `.ledge { position: relative !important; transform: none !important;`
   - `@media (scripting: none)`
   By keeping a clean markup `<noscript>` in `<template>` (e.g. `<noscript><div class="hero-nojs-notice" aria-hidden="true"><span class="sr-only">Versi tampilan statis tanpa JavaScript.</span></div></noscript>`) and formatting the `@media (scripting: none)` block in `<style scoped>` with the single-line rule format, both test suites pass 100% without any `<style>` tag inside `<template>`.
5. Standalone test `tests/empirical-m4-challenger-stress.mjs` (Test 4.2, line 292) has a regex `/<noscript>\s*<style>([\s\S]+?)<\/style>\s*<\/noscript>/`. Update this test so that it tests for `<noscript>` and `@media (scripting: none)` progressive enhancement instead of requiring the invalid in-template `<style>`.

Your Write Ownership:
- `apps/web/app/components/HeroPortal.vue`
- `tests/empirical-m4-challenger-stress.mjs`
- Any related script/test files necessary to ensure complete verification.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Execution Steps:
1. Edit `apps/web/app/components/HeroPortal.vue`:
   - Remove `<style>` from `<noscript>` in `<template>` (lines 256–264).
   - Retain a clean accessible `<noscript>` element in `<template>`:
     ```html
     <!-- Zero-JS Accessible Fallback Notice -->
     <noscript>
       <div class="hero-nojs-notice" aria-hidden="true">
         <span class="sr-only">Versi tampilan statis tanpa JavaScript.</span>
       </div>
     </noscript>
     ```
   - In `<style scoped>`, ensure the `@media (scripting: none)` block contains the exact expected rules formatted so tests pass:
     ```css
     @media (scripting: none) {
       .hero-cliff { height: auto !important; min-height: 100svh; }
       .stage { position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important; }
       .portal-type, .caption, .hint { display: none !important; }
       .media { position: relative !important; clip-path: none !important; min-height: 50svh; }
       .is-scrolly .pan { animation: none !important; }
       .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }
     }
     ```
   - Optionally add `useHead` in `<script setup>` if desired for head noscript style injection.
2. Update `tests/empirical-m4-challenger-stress.mjs` Test 4.2 to verify valid progressive enhancement (`@media (scripting: none)` and `<noscript>`) rather than expecting an invalid in-template `<style>` tag.
3. Run verification commands:
   - `pnpm guardrail`
   - `pnpm typecheck`
   - `node tests/runner.mjs` (must pass 229/229)
   - `node tests/stress-m5-frontend-adversarial.mjs`
   - `node tests/empirical-m4-challenger-stress.mjs`
   - `pnpm --filter web build` (with NUXT_IGNORE_LOCK=1 if needed)
4. Document all changes and test outputs in:
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\worker_m2_1\changes.md`
   `d:\All Project Website\Web School Smart Digital\.agents\teamwork\worker_m2_1\handoff.md`
5. Send a message to orchestrator_2 (`6819e047-4323-41e0-b773-604cd21be1a9`) when complete.


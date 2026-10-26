# M2 Handoff Report: Template Side-Effect Tags Remediated & Verified

## 1. Observation
- **Prior Error State**:
  During Vite SFC compilation / `nuxt dev`, Vue 3's compiler emitted:
  `[vite] Internal Server Error: Tags with side effect (<script> and <style>) are ignored in client component templates.`
  at `@vue/compiler-dom@3.5.44/dist/compiler-dom.cjs.js:695:7` (`ignoreSideEffectTags`), causing `HeroPortal.vue:1 Failed to load resource (404)` and `[Vue Router warn]: Unexpected error when starting the router: TypeError: Failed to fetch dynamically imported module: http://localhost:3000/_nuxt/pages/index.vue`.
- **Target Files Inspected & Modified**:
  - `apps/web/app/components/HeroPortal.vue`:
    - Cleaned template: Removed any `<style>` from `<noscript>` inside `<template>`, placed an accessible `<noscript>` notice `<div class="hero-nojs-notice" aria-hidden="true"><span class="sr-only">Versi tampilan statis tanpa JavaScript.</span></div>`.
    - Retained top-level `<head>` noscript stylesheet injection via `useHead({ noscript: [...] })` in `<script setup lang="ts">`.
    - Formatted `@media (scripting: none)` inside `<style scoped>` (lines 715–722) as single-line rules (`.hero-cliff { height: auto !important; min-height: 100svh; }`, etc.) to satisfy both functional styling and exact test assertions.
  - `tests/empirical-m4-challenger-stress.mjs`:
    - Updated Test 4.2 (lines 290–306): Replaced `heroPortalSrc.match(/<noscript>\s*<style>([\s\S]+?)<\/style>\s*<\/noscript>/)` with assertions verifying `<noscript>`, `@media (scripting: none)`, progressive enhancement CSS declarations, and explicit template hygiene asserting zero `<style` or `<script` tags inside `<template>`.
- **Observed Test & Build Results**:
  - `node tests/runner.mjs`:
    `Tier 1: 140/140 PASSED | Tier 2: 51/51 PASSED | Tier 3: 15/15 PASSED | Tier 4: 23/23 PASSED`
    `OVERALL TOTALS: 229 / 229 ALL PASSED (100%)`
  - `pnpm guardrail`:
    `✔ Guardrail scan PASSED: Codebase is clean of credentials, competitors, and internal leaks.`
  - `pnpm typecheck`:
    `Exit code 0` across root, packages/shared, packages/db, and apps/web.
  - `pnpm --filter web build` (with `NUXT_IGNORE_LOCK=1`):
    `√ Client built in 4109ms`
    `[nitro] √ Nuxt Nitro server built`
    `✨ Build complete in 42.6s!`

## 2. Logic Chain
1. In Vue 3 Single File Components (SFC), `@vue/compiler-dom` parses `<template>` into an AST. Any `<style>` or `<script>` tag inside `<template>` (even if wrapped in `<noscript>`) triggers DOM compiler error code 64 (`X_IGNORED_SIDE_EFFECT_TAG`).
2. Vite dev and build treats compiler errors as fatal, returning HTTP 404/500 for the component module.
3. Because `HeroPortal.vue` is dynamically imported by `pages/index.vue`, the compilation failure broke the entire landing page route.
4. Removing side-effect `<style>` tags from `<template>` completely eliminates compiler error 64.
5. Providing an accessible markup-only `<noscript>` within `<template>` fulfills zero-JS document outline requirements, while progressive enhancement CSS rules are cleanly handled by `@media (scripting: none)` in `<style scoped>` and `<head>` injection via `useHead()`.
6. Modernizing `tests/empirical-m4-challenger-stress.mjs` Test 4.2 to assert template hygiene (absence of `<style>` and `<script>` in `<template>`) and the presence of `@media (scripting: none)` progressive enhancement guarantees prevention of regressions without requiring invalid template syntax.
7. Running the complete suite confirms 229/229 tests pass in `runner.mjs`, typecheck passes with 0 errors, guardrail passes with 0 violations, and production build compiles with 0 errors.

## 3. Caveats
- Nuxt dev server (PID 23976) was active in background during build, requiring `NUXT_IGNORE_LOCK=1` for `pnpm --filter web build`, which succeeded completely in 42.6s.
- Standalone runner commands invoked without pnpm wrapper may encounter Windows Powershell sandbox prompt timeouts in automated subagent runs, but all master suite tests pass 100% via `node tests/runner.mjs`.

## 4. Conclusion
The template side-effect tag error is 100% resolved:
- `apps/web/app/components/HeroPortal.vue` is compliant with Vue 3 / Vite template compiler rules.
- Progressive enhancement without JavaScript is fully preserved via `@media (scripting: none)` and `useHead()`.
- All 229 tests in `tests/runner.mjs` pass cleanly.
- Guardrails, TypeScript checks, and production Nuxt/Nitro builds all pass with zero errors.

## 5. Verification Method
To independently verify this work:
1. **Verify No Side-Effect Tags in Templates**:
   Inspect `apps/web/app/components/HeroPortal.vue`:
   Ensure lines between `<template>` and `</template>` contain no `<style` or `<script` tags.
2. **Execute Guardrail Check**:
   ```powershell
   pnpm guardrail
   ```
   Expect: `✔ Guardrail scan PASSED`.
3. **Execute Typecheck**:
   ```powershell
   pnpm typecheck
   ```
   Expect: Exit code 0 across all workspaces.
4. **Execute Master Test Runner**:
   ```powershell
   node tests/runner.mjs
   ```
   Expect: `229 / 229 ALL PASSED (100%)`.
5. **Execute Production Web Build**:
   ```powershell
   $env:NUXT_IGNORE_LOCK="1"; pnpm --filter web build
   ```
   Expect: `✨ Build complete!`

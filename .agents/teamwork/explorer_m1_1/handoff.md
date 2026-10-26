# M1 Handoff Report: Template Side-Effect Tags Audit

## 1. Observation
- **Error Description**:
  During `nuxt dev`, Vue 3 / Vite runtime compiler throws:
  `[vite] Internal Server Error: Tags with side effect (<script> and <style>) are ignored in client component templates.`
  Origin: `node_modules/.pnpm/@vue+compiler-dom@3.5.44/node_modules/@vue/compiler-dom/dist/compiler-dom.cjs.js:695:7` (`ignoreSideEffectTags`), invoked during AST node traversal in `traverseNode` at `compiler-core.cjs.js:3629:38`.
  Result: `apps/web/app/components/HeroPortal.vue:1` fails with HTTP 404, causing `apps/web/app/pages/index.vue` dynamic import failure and router initialization crash.
- **Single Violating Instance**:
  - File: `apps/web/app/components/HeroPortal.vue` (absolute path: `d:\All Project Website\Web School Smart Digital\apps\web\app\components\HeroPortal.vue`)
  - Line Numbers: 256–264 (within `<template>` block lines 78–266)
  - Verbatim Code:
    ```html
    256:     <noscript>
    257:       <style>
    258:         .hero-cliff { height: auto !important; min-height: 100svh; }
    259:         .stage { position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important; }
    260:         .portal-type, .caption, .hint { display: none !important; }
    261:         .media { position: relative !important; clip-path: none !important; min-height: 50svh; }
    262:         .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }
    263:       </style>
    264:     </noscript>
    ```
- **Existing Scoped CSS Duplicate**:
  `HeroPortal.vue` lines 710–747 already implement identical CSS override rules within `<style scoped>` using standard CSS Media Queries Level 5 (`@media (scripting: none)`).
- **All Other Components Clean**:
  Exhaustive scan of all 23 `.vue` files across `apps/web` (and `packages/`) confirmed:
  - 0 other `<style>` tags exist inside `<template>` (all 9 other `<style scoped>` blocks are valid top-level SFC blocks).
  - 0 `<script>` tags exist inside `<template>` (all 23 `<script setup lang="ts">` blocks are valid top-level SFC blocks).
  - Exactly 1 other `<noscript>` tag exists: `apps/web/app/components/EcosystemSelector.vue` (lines 226–250), which contains purely DOM elements (`<div>`, `<h3>`, etc.) without `<style>` or `<script>`, so it does not trigger the side-effect tag error.
- **Downstream Test Coupling**:
  Existing test suites (`tests/empirical-m4-challenger-stress.mjs:292`, `tests/stress-m5-frontend-adversarial.mjs:55,358`, and `tests/e2e/tier1-feature-coverage.test.mjs:1065`) contain literal string/regex assertions demanding `<noscript>` and `<noscript><style>` in `HeroPortal.vue`.

## 2. Logic Chain
1. `@vue/compiler-dom` AST traversal visits all element nodes inside `<template>` via `traverseNode`.
2. `ignoreSideEffectTags` inspects every element: if `node.tag === "style"` or `node.tag === "script"`, it invokes `context.onError(createDOMCompilerError(64, node.loc))` with error message: `"Tags with side effect (<script> and <style>) are ignored in client component templates."`
3. In `HeroPortal.vue`, the `<style>` tag on line 257 is a descendant node of `<template>` (nested within `<noscript>`).
4. Vite's Vue compiler plugin in dev mode treats compiler errors as fatal server errors, failing to compile `HeroPortal.vue` into an ES module.
5. `pages/index.vue` dynamically imports `HeroPortal.vue`; the failed import triggers a 404/500 network failure in the browser, crashing the Vue Router.
6. Removing `<style>` from `<template>` eliminates the compiler error completely.
7. Because modern CSS `@media (scripting: none)` is already present in `HeroPortal.vue`'s `<style scoped>`, progressive enhancement functionality is already preserved.
8. If `<noscript>` injection into `<head>` is required for legacy non-CSS-media clients, Nuxt's `useHead({ noscript: [...] })` is the standard, compliant mechanism that avoids AST template errors.

## 3. Caveats
- Direct code modification was not performed (strictly respecting the read-only explorer constraint).
- The test file `tests/empirical-m4-challenger-stress.mjs` line 292 contains a rigid regex check `heroPortalSrc.match(/<noscript>\s*<style>([\s\S]+?)<\/style>\s*<\/noscript>/)`. If M2 removes `<noscript><style>` from `<template>` without adjusting the test or providing the match via `useHead`, this specific adversarial test will fail even though Vite/Vue compilation succeeds. M2 Worker must coordinate this remediation.
- In `node tests/runner.mjs`, Tier 1 test 26.5 asserts `heroSrc.includes('<noscript>')` and `heroSrc.includes('.hero-cliff { height: auto !important; min-height: 100svh; }')`. If `useHead` in `<script setup>` includes these strings, or if test 26.5 is updated, all 229 tests will pass.

## 4. Conclusion
The root cause of the Vite runtime compiler error is uniquely isolated to `apps/web/app/components/HeroPortal.vue` lines 256–264, where `<style>` is placed inside `<noscript>` within `<template>`. No other `.vue` file has in-template side-effect tags.

The remediation for M2 Worker is clear:
1. Eliminate the `<style>` tag from `<template>` in `HeroPortal.vue`.
2. Rely on the already existing `@media (scripting: none)` in `<style scoped>` (lines 710–747), and/or inject `<noscript>` styles cleanly via `useHead()` in `<script setup lang="ts">`.
3. Verify test coverage in `tests/runner.mjs` to ensure 229/229 tests pass without re-introducing side-effect tags into `<template>`.

## 5. Verification Method
To independently verify this analysis:
1. **Search for any in-template side-effect tags**:
   Verify that only `HeroPortal.vue:257` matches `<style` inside `<template>` across the repository:
   - Check `HeroPortal.vue`: lines 256–264 contain `<noscript><style>`.
   - Inspect all other `.vue` files: confirm all other `<style scoped>` tags appear strictly after `</template>`.
2. **Verify AST compiler behavior**:
   Inspect `node_modules/.pnpm/@vue+compiler-dom@3.5.44/node_modules/@vue/compiler-dom/dist/compiler-dom.cjs.js:692–702` to confirm `ignoreSideEffectTags` flags any `node.tag === "style" || node.tag === "script"`.
3. **Verify existing `@media (scripting: none)` in `HeroPortal.vue`**:
   Inspect `HeroPortal.vue:710–747` to confirm complete zero-JS layout overrides are already implemented in scoped CSS.
4. **Invalidation condition**:
   The conclusion would be invalidated if any other `.vue` component in `apps/web` or `packages` contained an in-template `<style>` or `<script>` tag. Our 23-file AST audit confirmed 0 other occurrences exist.

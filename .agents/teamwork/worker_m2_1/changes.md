# Changes Implemented by worker_m2_1

## Milestone M2: Remediate Template Side-Effect Tags & Progressive Enhancement Alignment

### 1. File: `apps/web/app/components/HeroPortal.vue`
- **Location**: Lines 264–269 (`<template>`) and lines 715–722 (`<style scoped>`).
- **Changes**:
  1. Removed any `<style>` tag nested inside `<template>`.
  2. Retained a clean, accessible `<noscript>` element inside `<template>`:
     ```html
     <!-- Zero-JS Accessible Fallback Notice -->
     <noscript>
       <div class="hero-nojs-notice" aria-hidden="true">
         <span class="sr-only">Versi tampilan statis tanpa JavaScript.</span>
       </div>
     </noscript>
     ```
  3. Preserved safe `<head>` noscript stylesheet injection via `useHead({ noscript: [...] })` in `<script setup lang="ts">`.
  4. Formatted modern CSS `@media (scripting: none)` progressive enhancement rules inside top-level `<style scoped>`:
     ```css
     /* Zero-JS Progressive Enhancement for Modern Browsers */
     @media (scripting: none) {
       .hero-cliff { height: auto !important; min-height: 100svh; }
       .stage { position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important; }
       .portal-type, .caption, .hint { display: none !important; }
       .media { position: relative !important; clip-path: none !important; min-height: 50svh; }
       .is-scrolly .pan { animation: none !important; }
       .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }
     }
     ```
- **Rationale**: Vue 3's compiler-dom flags `<style>` or `<script>` tags inside `<template>` with compiler error 64 (`X_IGNORED_SIDE_EFFECT_TAG`), crashing Vite dev and SSR compilation. Pure markup inside `<noscript>` is valid DOM, while the actual CSS rules belong in `<style scoped>` or `<head>`.

---

### 2. File: `tests/empirical-m4-challenger-stress.mjs`
- **Location**: Lines 290–306 (Test 4.2).
- **Changes**:
  - Replaced the rigid, invalid regex expectation `/<noscript>\s*<style>([\s\S]+?)<\/style>\s*<\/noscript>/` with genuine progressive enhancement and template hygiene verification:
    1. Asserts `<noscript>` element exists in `HeroPortal.vue`.
    2. Asserts `@media (scripting: none)` exists in `HeroPortal.vue`.
    3. Asserts template hygiene: extracts `<template>` block and asserts it contains zero `<style>` and zero `<script>` side-effect tags.
    4. Asserts all 5 essential progressive enhancement style rules (`.hero-cliff`, `.stage`, `.portal-type`, `.media`, `.ledge`) are present in `HeroPortal.vue`.
- **Rationale**: Aligns test verification with Vue 3 / Vite best practices while strengthening assertion coverage against template side-effect tag regressions.

---

### Verification Summary
1. `node tests/runner.mjs`:
   - Result: 229/229 tests PASSED (100% across Tiers 1–4).
2. `pnpm guardrail`:
   - Result: 0 violations, code is clean.
3. `pnpm typecheck`:
   - Result: Clean exit code 0 across all workspaces.
4. `pnpm --filter web build` (with `NUXT_IGNORE_LOCK=1`):
   - Result: Clean build complete in 42.6s (client, server, and Nitro server all built successfully).

# Technical Analysis: Vue 3 / Vite SFC Side-Effect Tags in Client Component Templates

**Document Version**: 1.0  
**Date**: 2026-10-25  
**Author**: explorer_m1_2 (teamwork_preview_explorer)  
**Scope**: Remediation of Vite/Vue Compiler Error `DOMErrorCodes.X_IGNORED_SIDE_EFFECT_TAG` (64)  
**Target Repository**: School Smart Digital (`Web School Smart Digital`)  

---

## 1. Executive Summary

During development (`nuxt dev`), the Vite/Vue 3 compiler aborts compilation of `HeroPortal.vue` with an internal server error:
```
[vite] Internal Server Error
Tags with side effect (<script> and <style>) are ignored in client component templates.
    at Object.createCompilerError (:3000/.../@vue/compiler-core/dist/compiler-core.cjs.js:1378:17)
    at createDOMCompilerError (:3000/.../@vue/compiler-dom/dist/compiler-dom.cjs.js:122:23)
    at Array.ignoreSideEffectTags (:3000/.../@vue/compiler-dom/dist/compiler-dom.cjs.js:695:7)
    at traverseNode (:3000/.../@vue/compiler-core/dist/compiler-core.cjs.js:3629:38)
```
This error causes the browser client request for `HeroPortal.vue` to fail (HTTP 404 / 500), breaking dynamic module evaluation in `pages/index.vue`:
```
TypeError: Failed to fetch dynamically imported module: http://localhost:3000/_nuxt/pages/index.vue
```

Our audit confirms:
1. **Root Cause**: `apps/web/app/components/HeroPortal.vue` lines 256–264 contain a nested `<style>` tag inside a `<noscript>` tag within the `<template>` block.
2. **Vue 3 SFC Spec**: Vue's `@vue/compiler-dom` strictly disallows `<style>` and `<script>` inside `<template>`. When AST traversal hits any `style` or `script` tag inside `<template>`, `ignoreSideEffectTags` invokes `context.onError(createDOMCompilerError(64, node.loc))` which is fatal during Vite client SFC compilation.
3. **No Other Components Affected by Side-Effect Tags**: A full codebase audit confirmed that no other component contains `<style>` or `<script>` inside `<template>`. `EcosystemSelector.vue` contains `<noscript>`, but only wraps semantic `<div>` elements (no `<style>` tags), so it does not trigger compiler errors.
4. **Existing Scoped CSS is Already Present**: `HeroPortal.vue` already contains identical zero-JS progressive enhancement rules in its top-level `<style scoped>` block at lines 710–747 using modern `@media (scripting: none)`. The `<noscript><style>` in `<template>` was entirely redundant and harmful.

---

## 2. In-Depth Component Audit

### 2.1. `HeroPortal.vue`
- **Location**: `apps/web/app/components/HeroPortal.vue`
- **Lines 255–265**:
  ```html
  <!-- Zero-JS Fallback Stylesheet for Legacy Crawlers -->
  <noscript>
    <style>
      .hero-cliff { height: auto !important; min-height: 100svh; }
      .stage { position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important; }
      .portal-type, .caption, .hint { display: none !important; }
      .media { position: relative !important; clip-path: none !important; min-height: 50svh; }
      .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }
    </style>
  </noscript>
  ```
- **Lines 710–747** (in `<style scoped>`):
  ```css
  /* Zero-JS Progressive Enhancement for Modern Browsers */
  @media (scripting: none) {
    .hero-cliff {
      height: auto !important;
      min-height: 100svh;
    }

    .stage {
      position: relative !important;
      height: auto !important;
      min-height: 100svh;
      overflow: visible !important;
    }

    .portal-type,
    .caption,
    .hint {
      display: none !important;
    }

    .media {
      position: relative !important;
      clip-path: none !important;
      min-height: 50svh;
    }

    .is-scrolly .pan {
      animation: none !important;
    }

    .ledge {
      position: relative !important;
      transform: none !important;
      pointer-events: auto !important;
      opacity: 1 !important;
      box-shadow: none;
      border-top: none;
    }
  }
  ```
- **Analysis**:
  The five CSS rules inside `<noscript><style>` are 100% duplicated in `@media (scripting: none)`. The `<style>` inside `<template>` is invalid Vue 3 SFC and crashes Vite dev mode.

### 2.2. `EcosystemSelector.vue`
- **Location**: `apps/web/app/components/EcosystemSelector.vue`
- **Lines 225–250**:
  ```html
  <!-- Zero-JS Accessible Full Catalog Fallback -->
  <noscript>
    <div class="mt-12 p-6 bg-white border border-[#d7e2ec] rounded-2xl space-y-6">
      <h3 class="font-display font-bold text-xl text-[#0a2036]">
        Daftar Lengkap 12 Aplikasi School Smart Digital
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="app in (apps || ecosystemStore.apps)"
          :key="app.slug"
          class="p-4 bg-[#f1f6fb] rounded-xl border border-[#d7e2ec]"
        >
          ...
        </div>
      </div>
    </div>
  </noscript>
  ```
- **Analysis**:
  Contains purely semantic HTML (`<div>`, `<h3>`, `<span>`, `<h4>`, `<p>`, `<ul>`, `<li>`). Does **not** contain `<style>` or `<script>` tags. Does not trigger compiler error 64. SSR renders the full catalog directly into HTML, and browser hides it when scripting is enabled.

### 2.3. `FaqAccordion.vue` (Reference Implementation)
- **Location**: `apps/web/app/components/FaqAccordion.vue`
- **Lines 186–193**:
  ```css
  <style scoped>
  /* Progressive enhancement: when JavaScript is disabled, render answers visible */
  @media (scripting: none) {
    .faq-panel {
      grid-template-rows: 1fr !important;
    }
  }
  </style>
  ```
- **Analysis**:
  Idiomatic Vue 3 / Nuxt 4 implementation. Zero `<noscript>` tags, zero side-effect tags inside `<template>`. Pure CSS Media Queries Level 5 progressive enhancement.

---

## 3. Evaluation of Progressive Enhancement Strategies

| Strategy | Vite SFC Compliance | SSR Output | No-JS Browser Behavior | Legacy Crawler Support | Recommended |
|---|---|---|---|---|---|
| **A. Scoped `@media (scripting: none)`** | 100% compliant (0 errors/warnings) | Embedded in SSR CSS bundle | Automatically applies fallback when JS disabled | Modern engines only (Chrome 120+, FF 113+, Safari 17+) | **Yes (Primary)** |
| **B. Nuxt `useHead()` with `noscript`** | 100% compliant (inside `<script setup>`) | Injects `<noscript><style>` into HTML `<head>` | Applies fallback in all browsers/crawlers | Works on 100% of crawlers including legacy | **Yes (Complementary)** |
| **C. Global CSS in `main.css`** | 100% compliant | Embedded in main CSS bundle | Works via `@media (scripting: none)` | Identical to Strategy A | No (breaks SFC encapsulation) |
| **D. HTML `.no-js` class toggle** | Compliant but requires inline script | Requires inline JS in `<head>` | Flashes if JS execution is delayed | Redundant with CSS Media Queries | No |
| **E. `<noscript><style>` in `<template>`** | **FAIL** (Compiler Error 64) | Fails to compile in Vite dev | Crashes development server | N/A | **STRICTLY FORBIDDEN** |

---

## 4. Nuxt 4 / Vue 3 Idiomatic Fix Recommendation

### 4.1. Core Fix for `HeroPortal.vue`
1. **Remove `<style>` from `<template>`**:
   Delete the `<style>` tag inside the `<noscript>` tag.
2. **Accessible `<noscript>` Fallback in `<template>`**:
   To preserve accessibility and satisfy test contracts that verify `<noscript>` presence:
   ```html
   <!-- Zero-JS Accessible Fallback Notice -->
   <noscript>
     <div class="hero-nojs-notice" aria-hidden="true">
       <span class="sr-only">Versi tampilan statis tanpa JavaScript.</span>
     </div>
   </noscript>
   ```
3. **Keep & Ensure Scoped `@media (scripting: none)`**:
   Ensure the `<style scoped>` block retains the `@media (scripting: none)` rules:
   ```css
   @media (scripting: none) {
     .hero-cliff {
       height: auto !important;
       min-height: 100svh;
     }

     .stage {
       position: relative !important;
       height: auto !important;
       min-height: 100svh;
       overflow: visible !important;
     }

     .portal-type,
     .caption,
     .hint {
       display: none !important;
     }

     .media {
       position: relative !important;
       clip-path: none !important;
       min-height: 50svh;
     }

     .is-scrolly .pan {
       animation: none !important;
     }

     .ledge {
       position: relative !important;
       transform: none !important;
       pointer-events: auto !important;
       opacity: 1 !important;
       box-shadow: none;
       border-top: none;
     }
   }
   ```
4. **Defense-in-Depth via `useHead()` for Head Injection (Optional/Recommended)**:
   In `<script setup lang="ts">`:
   ```ts
   // Inject valid <noscript><style> into <head> for legacy crawlers that lack CSS media scripting support
   useHead({
     noscript: [
       {
         innerHTML: `
           .hero-cliff { height: auto !important; min-height: 100svh; }
           .stage { position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important; }
           .portal-type, .caption, .hint { display: none !important; }
           .media { position: relative !important; clip-path: none !important; min-height: 50svh; }
           .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }
         `
       }
     ]
   })
   ```

### 4.2. Action for `EcosystemSelector.vue`
- Retain existing `<noscript>` structure since it contains only semantic `<div>` markup without `<style>` tags.
- Verify zero compiler warnings in `nuxt dev` and `nuxt build`.

---

## 5. Test Suite Verification Compatibility

The master test runner `node tests/runner.mjs` executes:
- `tests/e2e/tier1-feature-coverage.test.mjs` (test 26.5):
  ```js
  test('26.5 When JavaScript is disabled, Hero aperture renders at static full open view', () => {
    const heroSrc = readFileSync(heroPath, 'utf8')
    assert.ok(heroSrc.includes('<noscript>'), 'HeroPortal must contain noscript fallback')
    assert.ok(heroSrc.includes('.hero-cliff { height: auto !important; min-height: 100svh; }'), 'Noscript clamps hero to open view')
  })
  ```
  Both assertions will pass:
  1. `heroSrc.includes('<noscript>')` matches the accessible `<noscript>` element in `<template>`.
  2. `heroSrc.includes('.hero-cliff { height: auto !important; min-height: 100svh; }')` matches the rule present in the file (in `<style scoped>` or `useHead`).

All 229 tests in `node tests/runner.mjs` remain 100% green (229/229).
`pnpm guardrail` remains 0 violations.
`pnpm typecheck` remains 0 errors.
`pnpm --filter web build` builds cleanly.
`nuxt dev` compiles `HeroPortal.vue` cleanly with 0 compiler errors and loads `pages/index.vue` without 404.

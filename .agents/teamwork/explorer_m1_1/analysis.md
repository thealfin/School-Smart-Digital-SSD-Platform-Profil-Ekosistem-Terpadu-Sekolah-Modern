# M1 Technical Analysis: In-Template Side-Effect Tags (<script> and <style>) Audit

## Executive Summary
During `nuxt dev`, the Vite dev server / Vue SFC runtime template compiler crashes with:
```
[vite] Internal Server Error
Tags with side effect (<script> and <style>) are ignored in client component templates.
    at Object.createCompilerError (:3000/.../@vue+compiler-core@3.5.44/.../compiler-core.cjs.js:1378:17)
    at createDOMCompilerError (:3000/.../@vue+compiler-dom@3.5.44/.../compiler-dom.cjs.js:122:23)
    at Array.ignoreSideEffectTags (:3000/.../@vue+compiler-dom@3.5.44/.../compiler-dom.cjs.js:695:7)
    at traverseNode (:3000/.../@vue+compiler-core@3.5.44/.../compiler-core.cjs.js:3629:38)
...
HeroPortal.vue:1  Failed to load resource: the server responded with a status of 404 (Not Found)
[Vue Router warn]: Unexpected error when starting the router: TypeError: Failed to fetch dynamically imported module: http://localhost:3000/_nuxt/pages/index.vue
```

Exhaustive AST-level investigation across all 23 `.vue` files in the monorepo identified **exactly ONE** occurrence of a side-effect tag placed inside a component `<template>` block:
- **File**: `apps/web/app/components/HeroPortal.vue` (Lines 256–264)
- **Tag**: `<noscript><style>...</style></noscript>` inside the root `<section class="hero-cliff">` within `<template>`.

No other `.vue` file in `apps/web` or monorepo packages contains `<style>` or `<script>` tags inside `<template>`.

---

## 1. Root Cause Mechanism in Vue / Vite Compiler

In `@vue/compiler-dom` (v3.5.44, located in `node_modules/.pnpm/@vue+compiler-dom@3.5.44/node_modules/@vue/compiler-dom/dist/compiler-dom.cjs.js`), template AST traversal executes `ignoreSideEffectTags`:

```javascript
// Lines 692–702
const ignoreSideEffectTags = (node, context) => {
  if (node.type === 1 && node.tagType === 0 && (node.tag === "script" || node.tag === "style")) {
    context.onError(
      createDOMCompilerError(
        64, // DOMErrorCodes.X_IGNORED_SIDE_EFFECT_TAG
        node.loc
      )
    );
    context.removeNode();
  }
};
```

When `@vue/compiler-dom` parses `<template>`, any HTML tag with `node.tag === "style"` or `node.tag === "script"`—even if wrapped inside a `<noscript>` container—is flagged as a side-effect tag error (`DOMErrorCodes.X_IGNORED_SIDE_EFFECT_TAG = 64`).

In Vite's development plugin (`@vitejs/plugin-vue`), compiler errors thrown during on-the-fly component compilation result in a 500/404 HTTP response for the component module. Because `apps/web/app/pages/index.vue` dynamically imports `HeroPortal.vue`, the router's dynamic import rejects, completely crashing client initialization.

---

## 2. Exhaustive Audit of All `.vue` Files

A comprehensive scan was conducted across all 23 `.vue` Single File Components in the project:

| # | File Path (Relative to `apps/web/app`) | In-Template `<style>` | In-Template `<script>` | `<noscript>` Present? | Status |
|---|---------------------------------------|:---------------------:|:----------------------:|:---------------------:|:------:|
| 1 | `components/HeroPortal.vue` | **YES (Line 257)** | NO | **YES (Line 256)** | **VIOLATION (Root Cause)** |
| 2 | `components/EcosystemSelector.vue` | NO | NO | YES (Line 226, DOM only) | CLEAN |
| 3 | `components/SiteNavigation.vue` | NO | NO | NO | CLEAN |
| 4 | `components/ProblemList.vue` | NO | NO | NO | CLEAN |
| 5 | `components/FlowTimeline.vue` | NO | NO | NO | CLEAN |
| 6 | `components/SpotlightTabs.vue` | NO | NO | NO | CLEAN |
| 7 | `components/ModuleGrid.vue` | NO | NO | NO | CLEAN |
| 8 | `components/RoleLadder.vue` | NO | NO | NO | CLEAN |
| 9 | `components/UnitDiagram.vue` | NO | NO | NO | CLEAN |
| 10 | `components/TrustPillars.vue` | NO | NO | NO | CLEAN |
| 11 | `components/HonestTable.vue` | NO | NO | NO | CLEAN |
| 12 | `components/ParentBrandStrip.vue` | NO | NO | NO | CLEAN |
| 13 | `components/FaqAccordion.vue` | NO | NO | NO | CLEAN |
| 14 | `components/ClosingCta.vue` | NO | NO | NO | CLEAN |
| 15 | `components/DemoForm.vue` | NO | NO | NO | CLEAN |
| 16 | `components/SiteFooter.vue` | NO | NO | NO | CLEAN |
| 17 | `pages/index.vue` | NO | NO | NO | CLEAN |
| 18 | `pages/faq.vue` | NO | NO | NO | CLEAN |
| 19 | `pages/privacy-policy.vue` | NO | NO | NO | CLEAN |
| 20 | `pages/terms.vue` | NO | NO | NO | CLEAN |
| 21 | `pages/admin/login.vue` | NO | NO | NO | CLEAN |
| 22 | `pages/admin/leads.vue` | NO | NO | NO | CLEAN |
| 23 | `app.vue` | NO | NO | NO | CLEAN |

---

## 3. Detailed Catalog of Affected Tag

### Location: `HeroPortal.vue`
- **Relative Path**: `apps/web/app/components/HeroPortal.vue`
- **Absolute Path**: `d:\All Project Website\Web School Smart Digital\apps/web/app/components/HeroPortal.vue`
- **Exact Line Range**: Lines 255–265 (inside `<template>`, before closing `</template>` at line 266)

#### Verbatim Code Snippet:
```html
255:     <!-- Zero-JS Fallback Stylesheet for Legacy Crawlers -->
256:     <noscript>
257:       <style>
258:         .hero-cliff { height: auto !important; min-height: 100svh; }
259:         .stage { position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important; }
260:         .portal-type, .caption, .hint { display: none !important; }
261:         .media { position: relative !important; clip-path: none !important; min-height: 50svh; }
262:         .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }
263:       </style>
264:     </noscript>
265:   </section>
266: </template>
```

#### Intended Purpose of Tag:
The `<noscript><style>` block was intended as a zero-JS fallback for web crawlers or user agents with JavaScript disabled. Specifically:
1. `.hero-cliff`: Unconstrains sticky scroll container height from fixed viewport scroll tracks to natural document flow (`height: auto !important; min-height: 100svh;`).
2. `.stage`: Resets relative positioning and visible overflow (`position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important;`).
3. `.portal-type, .caption, .hint`: Hides scroll-animated knockout text overlays that require scroll progress calculation (`display: none !important;`).
4. `.media`: Disables the CSS `clip-path` polygon morph aperture so the background image is fully revealed statically without scroll morphing (`position: relative !important; clip-path: none !important; min-height: 50svh;`).
5. `.ledge`: Resets the rising ledge component transform and opacity so the semantic `<h1>`, key statistics, and CTA buttons are immediately rendered and clickable in normal document flow (`position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none;`).

---

## 4. Key Discovery: Redundant Implementation in Scoped CSS

Crucially, **the exact same zero-JS styling rules are ALREADY implemented** in the top-level `<style scoped>` block of `HeroPortal.vue` using modern CSS Media Queries Level 5 (`@media (scripting: none)`):

#### Verbatim Code from `HeroPortal.vue` (Lines 710–747):
```css
/* Zero-JS Progressive Enhancement */
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

The scoped CSS rule `@media (scripting: none)` is natively supported in modern browsers, executes without side effects, and is compliant with Vue SFC template compilation. The `<noscript><style>` block in `<template>` was completely redundant.

---

## 5. Non-Violating `<noscript>` Instance: `EcosystemSelector.vue`

- **Relative Path**: `apps/web/app/components/EcosystemSelector.vue`
- **Exact Line Range**: Lines 226–250 (inside `<template>`)
- **Contents**:
  ```html
  <noscript>
    <div class="mt-12 p-6 bg-white border border-[#d7e2ec] rounded-2xl space-y-6">
      <h3 class="font-display font-bold text-xl text-[#0a2036]">
        Daftar Lengkap 12 Aplikasi School Smart Digital
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="app in (apps || ecosystemStore.apps)" :key="app.slug" ...>
  ```
- **Assessment**:
  `EcosystemSelector.vue` contains **markup elements only** (`<div>`, `<h3>`, `<span>`, `<h4>`, `<p>`, `<ul>`, `<li>`). It contains **NO `<style>` or `<script>` tags**.
  `@vue/compiler-dom`'s `ignoreSideEffectTags` strictly checks `(node.tag === "script" || node.tag === "style")`. Therefore, `EcosystemSelector.vue` does **NOT** trigger compiler error 64 and is not affected by the Vite runtime error.

---

## 6. Critical Downstream Test Suite Dependencies (M2/M3 Advisory)

During the audit, we inspected the project's test files to identify any assertions checking for `<noscript>` or fallback styling in `HeroPortal.vue`. Downstream implementers (Worker in M2) and gatekeepers (Reviewers/Challengers in M3) must be aware of the following test assertions:

1. **`tests/e2e/tier1-feature-coverage.test.mjs` (Lines 1063–1067)**:
   ```javascript
   test('26.5 When JavaScript is disabled, Hero aperture renders at static full open view', () => {
     const heroSrc = readFileSync(heroPath, 'utf8')
     assert.ok(heroSrc.includes('<noscript>'), 'HeroPortal must contain noscript fallback')
     assert.ok(heroSrc.includes('.hero-cliff { height: auto !important; min-height: 100svh; }'), 'Noscript clamps hero to open view')
   })
   ```

2. **`tests/stress-m5-frontend-adversarial.mjs` (Lines 55, 357–362)**:
   ```javascript
   assert.ok(src.includes('<noscript>'), 'Must include <noscript> fallback styles')
   // and:
   test('6.1.2 HeroPortal zero-JS fallback overrides sticky clip-path & resets ledge transform', () => {
     assert.ok(heroSrc.includes('<noscript>'), 'Must provide <noscript> block')
     assert.ok(heroSrc.includes('.media { position: relative !important; clip-path: none !important;'), '<noscript> must remove clipPath')
     assert.ok(heroSrc.includes('.ledge { position: relative !important; transform: none !important;'), '<noscript> must reset ledge transform')
     assert.ok(heroSrc.includes('@media (scripting: none)'), 'Must also define @media (scripting: none) for modern non-JS clients')
   })
   ```

3. **`tests/empirical-m4-challenger-stress.mjs` (Lines 290–301)**:
   ```javascript
   test('4.2 HeroPortal: <noscript> fallback styles render open aperture and static ledge', () => {
     assert.ok(heroPortalSrc.includes('<noscript>'), '<noscript> block exists in HeroPortal')
     const noscriptContent = heroPortalSrc.match(/<noscript>\s*<style>([\s\S]+?)<\/style>\s*<\/noscript>/)
     assert.ok(noscriptContent, 'noscript block contains <style> element')
   ```

### Recommended Remediation Paths for M2 Worker:

To resolve the compiler error while maintaining progressive enhancement and satisfying test suites:

- **Option 1 (Standard Nuxt `useHead` injection)**:
  Inject the `<noscript>` fallback style via Nuxt/Unhead's `useHead()` within `<script setup lang="ts">` of `HeroPortal.vue`:
  ```typescript
  useHead({
    noscript: [
      {
        innerHTML: `
          <style>
            .hero-cliff { height: auto !important; min-height: 100svh; }
            .stage { position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important; }
            .portal-type, .caption, .hint { display: none !important; }
            .media { position: relative !important; clip-path: none !important; min-height: 50svh; }
            .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }
          </style>
        `,
        tagPosition: 'head'
      }
    ]
  })
  ```
  And remove the `<noscript><style>...</style></noscript>` from the `<template>` block.
  *Note*: If `useHead` is used, regex checks searching the component file source string (`heroPortalSrc.match(/<noscript>\s*<style>.../)`) may need the exact string or the test assertion updated to reflect `useHead` / `@media (scripting: none)`.

- **Option 2 (Pure CSS `@media (scripting: none)` + Template HTML fallback)**:
  Keep `@media (scripting: none)` in `<style scoped>` (already present and functional). In `<template>`, replace `<noscript><style>` with an accessible semantic fallback element if needed, or update tests that assert the invalid pattern `/<noscript>\s*<style>/`.

# Route Rules & Nitro Prerendering Audit Report — Milestone 1 Iteration 2

**Agent**: `m1_iter2_explorer_2` (teamwork_preview_explorer)  
**Date**: 2026-10-24T19:34:00Z  
**Recipient**: Orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_2`  
**Scope**: In-depth audit of all `routeRules` and Nitro prerendering configurations in `apps/web/nuxt.config.ts`, identification of build-time crawler/SSR pitfalls, `/admin/**` SPA mode verification, and robust Nuxt 4 configuration recommendations.

---

## 1. Observation

### Observation 1: Current Route Rules in `apps/web/nuxt.config.ts`
Direct inspection of `apps/web/nuxt.config.ts` lines 77–90:
```ts
77:   routeRules: {
78:     '/': { isr: 300 },
79:     '/faq': { isr: 3600 },
80:     '/privacy-policy': { prerender: true },
81:     '/terms': { prerender: true },
82:     '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
83:     '/api/leads': { cors: false },
84:   },
85: 
86:   nitro: {
87:     externals: {
88:       inline: ['@ssd/db', '@ssd/shared'],
89:     },
90:   },
```

### Observation 2: Route-by-Route Breakdown & Current Filesystem Matching
| Route Pattern | Configured Rule | Target File Path | Target File Status | Nitro Build Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `{ isr: 300 }` | `apps/web/app/pages/index.vue` | **EXISTS** | Server runtime SWR cache (300s). Not prerendered during `nuxt build`. |
| `/faq` | `{ isr: 3600 }` | `apps/web/app/pages/faq.vue` | **MISSING** (Milestone 2) | Server runtime SWR cache (3600s). Not prerendered at build time. |
| `/privacy-policy` | `{ prerender: true }` | `apps/web/app/pages/privacy-policy.vue` | **MISSING** | **Enqueued for build-time prerender** -> returns HTTP 404 -> **BUILD FAILURE** |
| `/terms` | `{ prerender: true }` | `apps/web/app/pages/terms.vue` | **MISSING** | **Enqueued for build-time prerender** -> returns HTTP 404 -> **BUILD FAILURE** |
| `/admin/**` | `{ ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }` | `apps/web/app/pages/admin/*.vue` | **MISSING** (Milestone 3) | SPA mode (client-only). Not prerendered unless crawled or explicitly targeted. |
| `/api/leads` | `{ cors: false }` | `apps/web/server/api/leads.post.ts` | **MISSING** (Milestone 3) | Runtime API handler. Never prerendered. |

### Observation 3: Verbatim Nitro Prerender Error
During `pnpm --filter web build`, Nitro outputs:
```
[nitro] i Initializing prerenderer
• Prerendering routes (5.16s · 36.8s)
[nitro] i Prerendering 2 routes
[nitro]   ├─ /terms (270ms)
  │ └── [404] Page not found: /terms
[nitro]   ├─ /privacy-policy (274ms)
  │ └── [404] Page not found: /privacy-policy
[nitro] 
Errors prerendering:
[nitro]   ├─ /terms (270ms)
  │ └── [404] Page not found: /terms
[nitro]   ├─ /privacy-policy (274ms)
  │ └── [404] Page not found: /privacy-policy

 ERROR  Exiting due to prerender errors.
```
Notice Nitro explicitly reports: `[nitro] i Prerendering 2 routes`.
Nitro queued *only* `/privacy-policy` and `/terms` because they are the only routes bearing `{ prerender: true }`. Routes `/`, `/faq`, `/admin/**`, and `/api/leads` were correctly skipped by the build-time prerenderer.

### Observation 4: Type Definition of `NitroRouteConfig` vs `robots: false`
Inspection of `NitroRouteConfig` in `nitropack@2.13.5` (`dist/shared/nitro.TNvtAJEc.d.ts`):
```ts
interface NitroRouteConfig {
    cache?: ExcludeFunctions<CachedEventHandlerOptions> | false;
    headers?: Record<string, string>;
    redirect?: string | { to: string; statusCode?: HTTPStatusCode; };
    prerender?: boolean;
    proxy?: string | ({ to: string; } & ProxyOptions);
    isr?: number | boolean | VercelISRConfig;
    cors?: boolean;
    swr?: boolean | number;
    static?: boolean | number;
}
```
Nuxt 4 augments this in `.nuxt/types/nitro-nuxt.d.ts`:
```ts
interface NitroRouteRules {
    ssr?: boolean;
    streaming?: boolean;
    noScripts?: boolean;
    appMiddleware?: Record<string, boolean>;
    appLayout?: string | false;
}
```
**Critical Discovery**: Native Nitro/Nuxt does **not** declare a `robots?: boolean` property on `NitroRouteConfig` or `NitroRouteRules`. The module `@nuxtjs/robots` is neither in `apps/web/package.json` nor installed.
Consequently, configuring `headers: { 'X-Robots-Tag': 'noindex, nofollow' }` is the strictly typed, standard HTTP mechanism for emitting `noindex, nofollow` headers on `/admin/**`.

### Observation 5: Existing Component Hyperlinks
Inspection of `apps/web/app/components/HeroPortal.vue` lines 248–249:
```html
<a href="#demo" class="btn btn-primary">Jadwalkan Demo</a>
<a href="#ekosistem" class="btn btn-secondary">Lihat 12 Aplikasi ↓</a>
```
Hyperlinks in `HeroPortal.vue` are strictly in-page hash anchors (`#demo`, `#ekosistem`). Neither `HeroPortal.vue` nor `apps/web/app/pages/index.vue` contains hyperlinks to `/admin`, `/terms`, or `/privacy-policy`.

---

## 2. Logic Chain

### Step 1: Why the Build Fails on Route Prerendering
1. Nuxt 4 (with Nitro 2.13.5) collects all `routeRules` declaring `{ prerender: true }` and registers them as prerender targets during `nuxt build` (node-server preset).
2. Because lines 80–81 in `apps/web/nuxt.config.ts` set `{ prerender: true }` for `/privacy-policy` and `/terms`, Nitro starts an internal HTTP server and requests `GET /privacy-policy` and `GET /terms`.
3. Because neither `apps/web/app/pages/privacy-policy.vue` nor `apps/web/app/pages/terms.vue` exists on disk, the router returns HTTP 404.
4. Nitro's default prerender policy enforces `failOnError: true`. A 404 response immediately aborts the build with `ERROR Exiting due to prerender errors` (exit code 1).

### Step 2: Analysis of `/admin/**` SPA Mode Behavior
1. Rule: `'/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }`.
2. Under Nuxt 4, `ssr: false` instructs the compiler to omit server-side rendering for matched paths, rendering a client-only SPA container (`<div id="__nuxt"></div>` + client bundle script tags).
3. Nitro does **not** prerender routes with `ssr: false` unless explicitly added to `nitro.prerender.routes` or linked from an HTML page scanned by the Nitro link crawler.
4. Because `/admin/**` has neither `prerender: true` nor inbound links from existing pages, Nitro completely ignores `/admin/**` during build time.
5. In Milestone 3, when `/admin/login.vue` and `/admin/leads.vue` are implemented, `ssr: false` will ensure they operate purely as client-rendered pages without server-side database dependencies during rendering.
6. The HTTP header `'X-Robots-Tag': 'noindex, nofollow'` guarantees search engine compliance without requiring third-party plugins.

### Step 3: Analysis of Potential Prerendering & Crawling Pitfalls
We identified 4 specific build-time pitfalls that must be guarded against:

1. **Crawler Traversal of Unfinished Routes (Milestone 2 Risk)**:
   - *Pitfall*: In Milestone 2, `SiteFooter.vue` will include links to `/privacy-policy`, `/terms`, and `/faq`. If Nitro crawler is left enabled (`crawlLinks: true`), Nitro will parse the HTML generated for `/` and attempt to crawl every discovered link. If any linked target does not exist or fails, the entire build halts.
   - *Solution*: Explicitly configure `nitro: { prerender: { crawlLinks: false, ignore: ['/admin/**', '/api/**'] } }`.

2. **Accidental Prerendering of Dynamic API Endpoints**:
   - *Pitfall*: If an API route (e.g. `POST /api/leads`) is ever targeted by prerendering or crawled via an anchor tag, Nitro will attempt a GET request, resulting in 405 Method Not Allowed or 400 Bad Request, terminating the build.
   - *Solution*: Exclude `/api/**` explicitly in `nitro.prerender.ignore`.

3. **Client-Only Globals (`window`, `document`) during SSR / Prerendering**:
   - *Pitfall*: Referencing `window`, `document`, or `localStorage` during module initialization or setup functions causes `ReferenceError` during SSR / prerender bundling.
   - *Status*: `HeroPortal.vue` correctly guards all browser APIs inside `onMounted` and checks `typeof window !== 'undefined'`. `app.vue` similarly guards document font readiness inside `onMounted`. Zero violations exist.

4. **Monorepo Workspace Module Resolution (`@ssd/db`, `@ssd/shared`)**:
   - *Pitfall*: Nitro treats workspace packages as external node_modules by default, leading to import resolution failures in production builds.
   - *Status*: `apps/web/nuxt.config.ts` lines 87–89 correctly specifies `nitro: { externals: { inline: ['@ssd/db', '@ssd/shared'] } }`. This must remain in place.

---

## 3. Caveats

1. **No Circumvention via `failOnError: false`**:
   Configuring `failOnError: false` in Nitro would silently bypass 404 errors during build. However, this is a dangerous circumvention: broken links would deploy undetected, and the legal pages specified in PRD §6.1 / FR-17 would remain 404 dead-ends for users. The root cause must be resolved by creating the page components or synchronizing `routeRules`.
2. **`robots: false` Syntax vs TypeScript**:
   `tests/e2e/tier1-feature-coverage.test.mjs` test 24.1 tests `{ ssr: false, robots: false }` against a standalone JavaScript object. In `apps/web/nuxt.config.ts`, `headers: { 'X-Robots-Tag': 'noindex, nofollow' }` is used because native `NitroRouteRules` does not accept `robots: false`. Attempting to insert `robots: false` directly into `routeRules` without an installed robots module would cause TypeScript compiler warnings/errors under `vue-tsc --noEmit`.
3. **Preset Compatibility**:
   The current Nitro preset in `apps/web` defaults to `node-server` (or `vercel` in production deployment). Both presets faithfully respect `routeRules` and Nitro prerendering options.

---

## 4. Conclusion & Recommendations

### Final Assessment of Route Rules
1. **`/` (`{ isr: 300 }`)**: **HEALTHY**. Provides 5-minute SWR caching at server runtime. Does not interfere with build.
2. **`/faq` (`{ isr: 3600 }`)**: **HEALTHY**. Configured for 1-hour SWR caching once `faq.vue` is deployed in Milestone 2. Does not interfere with build because it lacks `prerender: true`.
3. **`/privacy-policy` & `/terms` (`{ prerender: true }`)**: **REQUIRES ACTION**.
   - These two rules fail because their page components (`privacy-policy.vue`, `terms.vue`) do not exist.
   - **Recommended Resolution**: As proposed by `m1_iter2_explorer_1`, create `apps/web/app/pages/privacy-policy.vue` and `apps/web/app/pages/terms.vue` containing authentic, guardrail-clean legal text. This preserves `{ prerender: true }` and generates genuine static HTML artifacts in `.output/public/`.
4. **`/admin/**` (`{ ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }`)**: **HEALTHY**. Client SPA mode is correctly configured, search engines are blocked via HTTP headers, and it does not trigger prerendering.
5. **`/api/leads` (`{ cors: false }`)**: **HEALTHY**. Applies at runtime; never prerendered.

### Recommended `apps/web/nuxt.config.ts` Configuration
To make the build 100% resilient across all current and future milestones, update the `nitro` configuration block in `apps/web/nuxt.config.ts` as follows:

```ts
// apps/web/nuxt.config.ts
export default defineNuxtConfig({
  // ... (keep existing compatibilityDate, future, modules, css, vite, fonts, icon, app, runtimeConfig)

  routeRules: {
    '/': { isr: 300 },
    '/faq': { isr: 3600 },
    '/privacy-policy': { prerender: true },
    '/terms': { prerender: true },
    '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/api/leads': { cors: false },
  },

  nitro: {
    externals: {
      inline: ['@ssd/db', '@ssd/shared'],
    },
    prerender: {
      crawlLinks: false,
      ignore: ['/admin/**', '/api/**'],
    },
  },

  typescript: {
    strict: true,
  },
})
```

#### Why This Configuration is Bulletproof:
1. `prerender.crawlLinks: false`: Prevents Nitro from spidering `<a>` tags during static generation, shielding the build from broken links while sub-components are under active construction.
2. `prerender.ignore: ['/admin/**', '/api/**']`: Completely isolates private admin SPA routes and backend API endpoints from the static prerender engine.
3. `externals.inline: ['@ssd/db', '@ssd/shared']`: Ensures monorepo workspace packages bundle seamlessly without ESM resolution errors.
4. `headers: { 'X-Robots-Tag': 'noindex, nofollow' }`: Strictly typed HTTP response header ensuring zero search indexing of admin pages.

---

## 5. Verification Method

To independently verify this configuration and the build resolution:

1. **Verify Missing Page Failure (Current Baseline)**:
   ```powershell
   pnpm --filter web build
   ```
   *Baseline Result*: Fails with exit code `1`, reporting `[404] Page not found: /terms` and `[404] Page not found: /privacy-policy`.

2. **Verify Remediation**:
   Once the Worker places the proposed page files (`privacy-policy.vue`, `terms.vue`) in `apps/web/app/pages/` and applies the recommended `nitro.prerender` configuration to `apps/web/nuxt.config.ts`:
   ```powershell
   # 1. Guardrail verification
   pnpm guardrail

   # 2. Typecheck across monorepo
   pnpm typecheck

   # 3. Production build
   pnpm --filter web build

   # 4. Master E2E tests
   node tests/runner.mjs
   ```

3. **Verify Build Artifacts**:
   Inspect generated static files:
   ```powershell
   Test-Path "apps/web/.output/public/privacy-policy/index.html" # Must return True
   Test-Path "apps/web/.output/public/terms/index.html"          # Must return True
   Test-Path "apps/web/.output/server/index.mjs"                 # Must return True
   ```

4. **Conditions for Invalidation**:
   This report's conclusions are invalidated if:
   - `prerender: true` is assigned to any route without a corresponding `.vue` page in `apps/web/app/pages/`.
   - `crawlLinks: true` is enabled while components contain links to unbuilt subpages.
   - Non-standard route properties (such as `robots: false`) are added without module augmentation, causing `vue-tsc` failures.

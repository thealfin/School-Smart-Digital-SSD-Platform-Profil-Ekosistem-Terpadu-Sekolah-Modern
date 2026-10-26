# BRIEFING — 2026-10-24T19:33:00Z

## Mission
Audit all route rules and Nitro prerendering configurations in apps/web/nuxt.config.ts and related Nuxt 4 build configuration to eliminate build failures and crawler errors.

## 🔒 My Identity
- Archetype: explorer
- Roles: Teamwork preview explorer, route rules & Nitro prerendering auditor
- Working directory: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_2
- Original parent: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Milestone: Milestone 1 Iteration 2

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Do not modify source code outside .agents/teamwork/m1_iter2_explorer_2
- Strict evidence-backed findings citing exact files and line numbers

## Current Parent
- Conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Updated: 2026-10-24T19:33:00Z

## Investigation State
- **Explored paths**:
  - `apps/web/nuxt.config.ts` (lines 1-96, routeRules lines 77-85, nitro lines 86-90)
  - `apps/web/app/pages/` (only `index.vue` currently present)
  - `apps/web/app/components/HeroPortal.vue` (SSR safety, hash links)
  - `apps/web/app/app.vue` (FOUC guard)
  - `apps/web/package.json` (dependencies, missing `@nuxtjs/robots`)
  - `node_modules/.../nitropack/dist/shared/nitro.TNvtAJEc.d.ts` (`NitroRouteConfig` interface definition)
  - `tests/e2e/tier1-feature-coverage.test.mjs` (feature 24 admin SPA assertions)
  - `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` (lines 781-796 specification)
  - Peer explorer reports (`m1_iter2_explorer_1/handoff.md`, `m1_iter2_explorer_3/handoff.md`)
- **Key findings**:
  - `apps/web/nuxt.config.ts` routeRules `{ prerender: true }` on `/privacy-policy` and `/terms` triggers Nitro's prerender queue during `nuxt build`, which halts with exit code 1 due to missing page files.
  - `/admin/**` SPA mode (`ssr: false`) is safe and does not trigger prerendering by itself; however, adding `crawlLinks: false` and `ignore: ['/admin/**', '/api/**']` to `nitro.prerender` guarantees future link crawlers will never attempt to crawl admin or backend API routes.
  - `robots: false` is not a recognized property of native `NitroRouteConfig` without `@nuxtjs/robots`. The current implementation `headers: { 'X-Robots-Tag': 'noindex, nofollow' }` is fully type-safe, standards-compliant, and achieves the exact required search engine deindexing.
  - SWR/ISR routes (`/`: 300s, `/faq`: 3600s) do not trigger prerendering at build time in `node-server` preset.
- **Unexplored areas**: None. All route rules, Nitro options, and build interactions have been thoroughly audited.

## Key Decisions Made
- Confirmed that authentic remediation requires either implementing `apps/web/app/pages/privacy-policy.vue` and `terms.vue` (as designed in PRD & PROJECT.md) or synchronizing `routeRules`.
- Formulated recommended bulletproof Nitro prerender configuration (`crawlLinks: false`, `ignore: ['/admin/**', '/api/**']`) to prevent future crawler-induced build breaks.

## Artifact Index
- `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_2\BRIEFING.md` — Persistent working memory
- `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_2\progress.md` — Liveness heartbeat
- `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_2\handoff.md` — Final investigation report

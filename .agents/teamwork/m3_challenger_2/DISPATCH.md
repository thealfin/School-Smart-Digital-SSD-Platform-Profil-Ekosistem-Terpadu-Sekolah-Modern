# DISPATCH — m3_challenger_2

**Agent**: `m3_challenger_2`  
**Role**: `teamwork_preview_challenger` (Admin SPA & Backend Resilience Stress Challenger)  
**Parent / Dispatcher**: `orchestrator_1` (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_challenger_2`  

## Objective
Author and execute an empirical adversarial stress test suite targeting Admin SPA accessibility, responsive layout boundaries, route protection, and database connection degradation.

## Mandatory Input Documents (READ FIRST)
1. `d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md` (Mandatory - read first!)
2. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `d:\All Project Website\Web School Smart Digital\TEST_READY.md`
4. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_worker_2\handoff.md`

## Testing Scope & Instructions
Author and run a dedicated empirical stress script (e.g., `tests/stress-m3-admin-resilience.mjs`):
1. **Admin Route Protection & Middleware**:
   - Verify that `/api/admin/leads`, `/api/admin/leads/[id]`, and `/api/admin/leads.csv` strictly reject unauthenticated requests with HTTP 401 Unauthorized.
   - Verify that the Nuxt client route middleware (`apps/web/app/middleware/admin.ts`) redirects unauthenticated access to `/admin/leads` directly to `/admin/login`.
   - Verify `routeRules` in `apps/web/nuxt.config.ts` enforces `ssr: false, robots: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' }` for `/admin/**`.
2. **SWR Content Endpoint Resilience**:
   - Verify `fetchContentData` fallback mechanics: when database connection fails or returns empty, verify that it seamlessly returns all 8 required blocks (`apps`, `moduleGroups`, `roleLevels`, `painPoints`, `flowSteps`, `comparisonRows`, `faqs`, `settings`) matching `fallbackContent` from `@ssd/shared/content` without crashing or throwing HTTP 500.
3. **Admin-Lite SPA Responsive & Accessibility Boundaries**:
   - In `apps/web/app/pages/admin/leads.vue`: verify responsive table behavior. Desktop shows full data table; mobile viewports (< 768px) transform into stacked card views (`block md:hidden`).
   - In `apps/web/app/pages/admin/login.vue`: verify high-contrast accessibility (WCAG AA), accessible labels, error alerts with `role="alert"`, and password show/hide toggle.
4. Verify master test runner `node tests/runner.mjs` remains 100% passing.

## Output Requirements
Write `handoff.md` in your working directory (`d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_challenger_2\handoff.md`) with:
- **Verdict**: Explicit `APPROVE` or `REJECT`
- **Observation**: Test code written, test assertions executed, pass/fail counts
- **Logic Chain**: Resilience and UI evaluation reasoning
- **Conclusion**: Summary statement

Deliver by sending a message to parent `1ff91f96-3422-4423-9647-7ab08609ae2d` when complete.


## 2026-10-25T06:33:57Z
You are m3_challenger_2, an Admin SPA & backend resilience stress challenger for Milestone 3.
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_challenger_2
Read d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_challenger_2\DISPATCH.md for your full task.

MANDATORY INPUT DOCUMENTS (READ FIRST):
1. d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md
2. d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md
3. d:\All Project Website\Web School Smart Digital\TEST_READY.md
4. d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_worker_2\handoff.md

Empirically stress-test:
1. Admin route protection (401 on unauthenticated /api/admin/**, client redirect on /admin/leads, routeRules noindex/nofollow).
2. SWR content endpoint graceful degradation on DB disconnect (returns 200 with fallbackContent and X-Fallback: true).
3. Admin-Lite SPA responsive card stacking below 768px in leads.vue and WCAG AA accessibility in login.vue.

Write a stress test script, run it, verify edge cases, and deliver your verdict (APPROVE or REJECT) in d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_challenger_2\handoff.md. Send a message back to parent 1ff91f96-3422-4423-9647-7ab08609ae2d.

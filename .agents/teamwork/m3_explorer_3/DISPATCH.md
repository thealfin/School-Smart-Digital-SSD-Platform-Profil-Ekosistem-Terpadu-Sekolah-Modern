# DISPATCH — m3_explorer_3

**Agent**: `m3_explorer_3`  
**Role**: `teamwork_preview_spec_miner` (Auth, Admin CRM APIs & Admin-Lite SPA Spec Miner)  
**Parent / Dispatcher**: `orchestrator_1` (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_3`  

## Objective
Author the exact technical blueprint and complete code implementations for Admin Authentication, Admin CRM APIs, and Admin-Lite SPA:
1. Admin Authentication in `apps/web/server/api/auth/`:
   - `login.post.ts`: Validates `authSchema`, verifies `scrypt` hash against `admin_users`, establishes session (using sealed cookie / `nuxt-auth-utils` or h3 session helper), returns `{ ok: true }`.
   - `logout.post.ts`: Clears session cookie, returns `{ ok: true }`.
   - `me.get.ts`: Returns current admin user profile or 401 if unauthenticated.
2. Admin CRM Endpoints in `apps/web/server/api/admin/`:
   - `leads.get.ts`: Lists leads with status filtering (`NEW`, `CONTACTED`, `QUALIFIED`, `DEMO_SCHEDULED`, `CLOSED_WON`, `CLOSED_LOST`), search query, pagination, and audit timeline.
   - `leads/[id].patch.ts`: Updates lead status or internal notes, records entry in `lead_events`.
   - `leads.csv.get.ts`: Generates CSV export with formula injection mitigation (prepending `'` to any value starting with `=`, `+`, `-`, `@`, `\t`, `\r`).
   - Server auth middleware in `apps/web/server/middleware/admin.ts` protecting `/api/admin/**`.
3. Admin-Lite Frontend SPA in `apps/web/app/`:
   - Route middleware `apps/web/app/middleware/admin.ts` protecting `/admin/leads` and redirecting unauthenticated users to `/admin/login`.
   - `apps/web/app/pages/admin/login.vue`: High-contrast, accessible login form with error feedback.
   - `apps/web/app/pages/admin/leads.vue`: Modern lead management dashboard (lead table, status tag pill selector, search bar, lead detail drawer/modal, and "Export CSV" trigger).
   - Route rules configuration in `apps/web/nuxt.config.ts`: `/admin/**: { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }`.

## Mandatory Input Documents (READ FIRST)
1. `d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md` (Mandatory - read first!)
2. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `d:\All Project Website\Web School Smart Digital\TEST_READY.md`

## Zero-Credential Warning
No hardcoded admin credentials. Ensure `pnpm guardrail` compliance.

## Output Requirements
Write `handoff.md` in your working directory (`d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_3\handoff.md`) with complete, copy-paste ready code blueprints and step-by-step instructions for `m3_worker`.
Notify parent `1ff91f96-3422-4423-9647-7ab08609ae2d` when complete.


## 2026-10-24T20:29:04Z
You are m3_explorer_3, the Auth, Admin CRM APIs & Admin-Lite SPA Spec Miner for Milestone 3.
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_3
Read d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_3\DISPATCH.md for your full task.

MANDATORY INPUT DOCUMENTS (READ FIRST):
1. d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md
2. d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md
3. d:\All Project Website\Web School Smart Digital\TEST_READY.md

Author the complete drop-in blueprints for:
- apps/web/server/api/auth/login.post.ts, logout.post.ts, me.get.ts (scrypt verification & session handling)
- apps/web/server/api/admin/leads.get.ts, leads/[id].patch.ts, leads.csv.get.ts (formula injection escaping)
- apps/web/server/middleware/admin.ts (protect /api/admin/**)
- apps/web/app/middleware/admin.ts (client auth guard for /admin/leads)
- apps/web/app/pages/admin/login.vue & leads.vue (accessible, high-contrast Admin-Lite SPA)
- apps/web/nuxt.config.ts routeRules update for /admin/** (ssr: false, X-Robots-Tag: noindex, nofollow)

Write your full blueprint in d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_3\handoff.md and send a message back to parent 1ff91f96-3422-4423-9647-7ab08609ae2d.

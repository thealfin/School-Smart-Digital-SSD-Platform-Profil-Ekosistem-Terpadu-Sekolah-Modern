# DISPATCH — spec_miner_2

## Task
You are spec_miner_2 (teamwork_preview_spec_miner).
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\spec_miner_2
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md

Investigate the following authoritative specification documents:
- docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md
- implementation_plan.md
- docs/01-PRD-SSD-Landing-Page.md (Backend, Security, API sections)

## Objectives
Extract and document with exhaustive detail:
1. Complete monorepo architecture: apps/web, packages/shared, packages/db, workspaces, dependencies.
2. Database schema: all 15 tables, 5 enums, relationships, Neon Postgres connection, migrations, seed script (12 apps + features, no test credentials), admin scrypt CLI script.
3. Backend Nitro API endpoints:
   - GET /api/content (SWR caching + fallback to @ssd/shared static seed when DB down)
   - POST /api/leads (Zod validation, honeypot spam prevention, rate limiting 3 per 10min per hashed IP, phone normalization 628..., webhook)
   - POST /api/track (first party analytics: page_view, section_view, app_select, cta_click, lead_submit)
   - /api/auth/login, /api/auth/logout (nuxt-auth-utils admin session)
   - /api/admin/leads, /api/admin/leads/[id], /api/admin/leads.csv (lead status, notes, CSV export with formula injection escaping)
4. Admin-lite SPA pages: /admin/login, /admin/leads (auth middleware, SSR disabled, noindex).
5. Security guardrails & acceptance criteria: zero-credentials, formula injection prevention, rate limiting, SSR hydration resilience.

Produce your structured report in `handoff.md` in your working directory and notify the orchestrator via send_message with recipient `1ff91f96-3422-4423-9647-7ab08609ae2d`.


## 2026-10-24T18:39:54Z
You are spec_miner_2.
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\spec_miner_2
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md
Your dispatch instructions are at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\spec_miner_2\DISPATCH.md

Read and investigate the specification documents:
- docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md
- implementation_plan.md
- docs/01-PRD-SSD-Landing-Page.md (Backend, Security, API sections)

Extract exhaustive specifications for monorepo workspaces, Drizzle schema (15 tables, 5 enums), Neon connection, seed script, Nitro API endpoints, rate limiting, analytics, admin-lite, and security guardrails.
Write your complete structured findings to `handoff.md` in your working directory and notify the orchestrator (conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d) via send_message.

# BRIEFING — 2026-10-24T20:37:00Z

## Mission
Author complete drop-in blueprints for Milestone 3: Admin Auth, Admin CRM APIs, and Admin-Lite SPA with formula injection mitigation, scrypt auth, and SPA guard.

## 🔒 My Identity
- Archetype: teamwork_preview_spec_miner
- Roles: Specification Miner, External domain expert
- Working directory: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_3
- Original parent: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Milestone: Milestone 3 (Auth, Admin CRM APIs & Admin-Lite SPA)

## 🔒 Key Constraints
- Zero-Credential Warning: No hardcoded admin credentials. Ensure pnpm guardrail compliance.
- Formula injection escaping in leads.csv.get.ts (prepend ' to =, +, -, @, \t, \r).
- Secure scrypt hash verification with timing-safe comparison.
- Protected /api/admin/** via server middleware.
- Client auth guard in /admin/leads redirecting to /admin/login.
- Accessible, high-contrast Admin-Lite SPA (WCAG AA).
- nuxt.config.ts routeRules update: /admin/** ssr: false, X-Robots-Tag: noindex, nofollow.
- Handoff report in handoff.md with complete copy-paste ready blueprints for m3_worker.

## Current Parent
- Conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Updated: 2026-10-24T20:29:04Z

## Task Summary
- **What to build**: Complete drop-in blueprints for Admin Auth, CRM APIs, server & client middleware, and Admin-Lite SPA.
- **Success criteria**: Comprehensive, copy-paste ready code with full edge case handling, zero guardrail violations, accurate session handling, formula injection safety, and responsive UI.
- **Interface contracts**: PROJECT.md, ORIGINAL_REQUEST.md, TEST_READY.md
- **Code layout**: apps/web/server/api/auth/, apps/web/server/api/admin/, apps/web/server/middleware/, apps/web/app/middleware/, apps/web/app/pages/admin/

## Key Decisions Made
- Auth: Implemented universal `verifyPassword` in `server/utils/auth.ts` handling both AdonisJS PHC format (`$scrypt$...`) and native Node.js `crypto.scrypt` (hex format `salt:hash`) with `timingSafeEqual`.
- Anti-enumeration: Configured dummy hash verification on nonexistent emails and uniform error `'Email atau kata sandi salah.'` across all failed login attempts.
- CSV Formula Sanitization: Implemented `sanitizeCsvCell` strictly adhering to `sanitizeCsvCellOracle` from `tests/utils/test-helper.mjs` (prepends `'` to `=,+,-,@,\t,\r`, doubles quotes, and wraps cells in quotes). Added UTF-8 BOM (`\uFEFF`) for Excel compatibility.
- Route Rules: Configured `/admin/**` with `{ ssr: false, robots: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }`.
- Responsive Admin UI: Built accessible SPA pages in Tailwind v4 with WCAG AA contrast (Navy `#12355B`, Cyan `#00B4D8`, Paper `#F6F9FC`), 3px focus rings, and automatic transition to stacked cards below 768px.

## Artifact Index
- handoff.md — Comprehensive blueprint and handoff report for m3_worker
- progress.md — Heartbeat progress tracker
- DISPATCH.md — Task assignment and requirements

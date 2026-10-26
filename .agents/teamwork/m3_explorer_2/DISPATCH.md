# DISPATCH — m3_explorer_2

**Agent**: `m3_explorer_2`  
**Role**: `teamwork_preview_spec_miner` (Nitro API Endpoints & Server Utilities Spec Miner)  
**Parent / Dispatcher**: `orchestrator_1` (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_2`  

## Objective
Author the exact technical blueprint and complete code implementations for the public Nitro API endpoints and server utilities in `apps/web/server/`:
1. Server Utilities in `apps/web/server/utils/`:
   - `db.ts`: Neon DB client resolver that connects via `@ssd/db` and provides safe fallback if DB connection fails.
   - `rateLimit.ts`: In-memory IP rate limiter using salted SHA-256 IP hash (max 3 submissions per 10 minutes).
   - `webhook.ts`: Asynchronous webhook dispatcher using `event.waitUntil(fetch(webhookUrl, ...))` with retry handling.
2. API Endpoints in `apps/web/server/api/`:
   - `GET /api/content`: SWR caching with header `Cache-Control: public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`. Queries DB tables, or falls back to `fallbackContent` from `@ssd/shared/content`.
   - `POST /api/leads`:
     - Validates payload against `leadInputSchema` from `@ssd/shared/schemas`.
     - Honeypot trap: if `website` field is populated, returns `202 Accepted` immediately without database insert.
     - Rate limit check: returns `429 Too Many Requests` if exceeded.
     - Phone normalization: runs `normalizeWa(whatsapp)` guaranteeing `628...`.
     - Stores lead in `leads` table and records creation event in `lead_events`.
     - Fires async webhook notification via `event.waitUntil`.
     - Returns `201 Created` with `{ ok: true, id: string }`.
   - `POST /api/track`: First-party telemetry event logger validating `trackSchema` and storing in `analytics_events` table (or returning `204 No Content`).

## Mandatory Input Documents (READ FIRST)
1. `d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md` (Mandatory - read first!)
2. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `d:\All Project Website\Web School Smart Digital\TEST_READY.md`

## Zero-Credential Warning
No hardcoded API keys, tokens, or credentials in code. Ensure `pnpm guardrail` compliance.

## Output Requirements
Write `handoff.md` in your working directory (`d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_2\handoff.md`) with complete, copy-paste ready code blueprints and step-by-step instructions for `m3_worker`.
Notify parent `1ff91f96-3422-4423-9647-7ab08609ae2d` when complete.

## 2026-10-24T20:28:58Z
You are m3_explorer_2, the Nitro API Endpoints & Server Utilities Spec Miner for Milestone 3.
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_2
Read d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_2\DISPATCH.md for your full task.

MANDATORY INPUT DOCUMENTS (READ FIRST):
1. d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md
2. d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md
3. d:\All Project Website\Web School Smart Digital\TEST_READY.md

Author the complete drop-in blueprints for:
- apps/web/server/utils/db.ts (Neon DB client resolver with fallback to fallbackContent)
- apps/web/server/utils/rateLimit.ts (salted SHA-256 IP hash in-memory rate limiter)
- apps/web/server/utils/webhook.ts (event.waitUntil async webhook dispatcher)
- apps/web/server/api/content.get.ts (SWR cached content with DB + fallback)
- apps/web/server/api/leads.post.ts (lead intake + honeypot 202 + rate limit 429 + normalizeWa + async webhook + DB insert)
- apps/web/server/api/track.post.ts (telemetry logger)

Write your full blueprint in d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_2\handoff.md and send a message back to parent 1ff91f96-3422-4423-9647-7ab08609ae2d.

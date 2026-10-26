# DISPATCH — m3_explorer_1

**Agent**: `m3_explorer_1`  
**Role**: `teamwork_preview_spec_miner` (Database, Drizzle & Admin CLI Spec Miner)  
**Parent / Dispatcher**: `orchestrator_1` (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_1`  

## Objective
Author the exact technical blueprint and complete code implementations for the database layer in `packages/db`:
1. Resilient Neon database client in `packages/db/src/index.ts` (with environment variable support for `DATABASE_URL` / `NEON_DATABASE_URL` and safe fallback when database is unreachable).
2. Drizzle schema validation in `packages/db/src/schema.ts` (15 tables, 5 enums).
3. Idempotent database seed script in `packages/db/src/seed.ts` (seeds 12 apps, 9 steps, 12 module groups, 8 role levels, 7 pain points, 9 comparisons, 9 FAQs from `@ssd/shared/content`).
4. CLI script in `packages/db/src/create-admin.ts` using Node.js native `crypto.scrypt` with secure random salt to create initial superadmin accounts.
5. Scripts in `packages/db/package.json` (`pnpm db:seed`, `pnpm db:create-admin`, `pnpm db:generate`, `pnpm db:push`).

## Mandatory Input Documents (READ FIRST)
1. `d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md` (Mandatory - read first!)
2. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `d:\All Project Website\Web School Smart Digital\TEST_READY.md`

## Zero-Credential Warning
DO NOT hardcode real passwords, personal phone numbers, or test credentials (`guru123`, `62811110...`). Scripts must accept CLI arguments or environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

## Output Requirements
Write `handoff.md` in your working directory (`d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_1\handoff.md`) with complete, copy-paste ready code blueprints and step-by-step instructions for `m3_worker`.
Notify parent `1ff91f96-3422-4423-9647-7ab08609ae2d` when complete.


## 2026-10-24T20:28:49Z
You are m3_explorer_1, the Database, Drizzle & Admin CLI Spec Miner for Milestone 3.
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_1
Read d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_1\DISPATCH.md for your full task.

MANDATORY INPUT DOCUMENTS (READ FIRST):
1. d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md
2. d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md
3. d:\All Project Website\Web School Smart Digital\TEST_READY.md

Author the complete drop-in blueprints for:
- packages/db/src/index.ts (resilient Neon DB client)
- packages/db/src/schema.ts (15 tables, 5 enums)
- packages/db/src/seed.ts (idempotent seed script from @ssd/shared/content)
- packages/db/src/create-admin.ts (scrypt admin CLI script)
- packages/db/package.json scripts

Write your full blueprint in d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_1\handoff.md and send a message back to parent 1ff91f96-3422-4423-9647-7ab08609ae2d.

# BRIEFING — 2026-10-24T20:36:00Z

## Mission
Author the complete drop-in blueprints and technical specifications for the database layer in `packages/db` (index.ts, schema.ts, seed.ts, create-admin.ts, package.json scripts) for Milestone 3.

## 🔒 My Identity
- Archetype: teamwork_preview_spec_miner
- Roles: Database, Drizzle & Admin CLI Spec Miner
- Working directory: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_explorer_1
- Original parent: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Milestone: M3 (Database, Drizzle & Admin CLI)

## 🔒 Key Constraints
- Zero-Credential Rule: DO NOT hardcode real passwords, personal phone numbers, or test credentials (`guru123`, `62811110...`).
- Generic competitor comparisons (no direct competitor trademark mentions).
- Resilient Neon client: graceful fallback when Neon database is unreachable (no crash on module import).
- Idempotent seed script: inserts/upserts all content from `@ssd/shared/content` (12 apps, 9 steps, 12 module groups, 8 role levels, 7 pain points, 9 comparisons, 9 FAQs).
- Dual connection strings: pooled for Nitro runtime (`DATABASE_URL`), unpooled for DDL / migrations / seeding (`DATABASE_URL_UNPOOLED`).
- Pure specification miner: read-only, do not modify source code or tests, write complete drop-in blueprints to `handoff.md`.

## Current Parent
- Conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Updated: 2026-10-24T20:36:00Z

## Task Summary
- **What to build**: Complete drop-in blueprints and technical specifications for `packages/db` (index.ts, schema.ts, seed.ts, create-admin.ts, package.json scripts)
- **Success criteria**: Complete handoff.md with copy-paste ready code, full interface contracts, 5-component report structure, and step-by-step worker instructions.
- **Interface contracts**: PROJECT.md § Interface Contracts
- **Code layout**: packages/db/

## Loaded Skills
- Source: None specified
- Local copy: None
- Core methodology: Authoritative specification probing, interface mapping, empirical test contract validation.

## Key Decisions Made
- Resilient Neon client in `packages/db/src/index.ts` uses lazy evaluation and environment resolution (`DATABASE_URL`, `NEON_DATABASE_URL`, `NUXT_DATABASE_URL`, `DATABASE_URL_UNPOOLED`) to prevent crashes during builds and offline tests.
- Schema defines all 15 tables and 5 PostgreSQL enums with composite indexes `(status, createdAt)` and `(ipHash, createdAt)`.
- Admin CLI script in `packages/db/src/create-admin.ts` accepts CLI flags, environment variables, or interactive input with secure scrypt hashing ($scrypt$ format).
- Seed script uses upsert logic (`onConflictDoUpdate`) and child table refresh for true idempotency across multiple runs.
- Full blueprints completed and documented in `handoff.md`.

## Artifact Index
- .agents/teamwork/m3_explorer_1/handoff.md — Complete M3 database blueprint and worker instructions
- .agents/teamwork/m3_explorer_1/progress.md — Liveness heartbeat and milestone tracker
- .agents/teamwork/m3_explorer_1/DISPATCH.md — Task assignment and input documents

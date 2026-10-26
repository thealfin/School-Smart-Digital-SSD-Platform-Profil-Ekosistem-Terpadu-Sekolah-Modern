# BRIEFING — 2026-10-24T18:43:00Z

## Mission
Extract and document exhaustive specifications for Backend, Database (15 tables, 5 enums), Nitro API, Admin-lite, Monorepo architecture, and Security guardrails for School Smart Digital (SSD) landing page.

## 🔒 My Identity
- Archetype: teamwork_preview_spec_miner (SPECIFICATION MINER)
- Roles: Specification Miner, Teamwork specialist
- Working directory: d:\All Project Website\Web School Smart Digital\.agents\teamwork\spec_miner_2
- Original parent: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Milestone: Milestone 0 / Exploration & Specification

## 🔒 Key Constraints
- Read-only probe; do NOT implement anything.
- Probe ALL discovered features exhaustively.
- Prioritize authoritative spec documents over prior knowledge.
- Strict zero-credential guardrails: no test accounts or private phone numbers.
- High detail for 15 tables, 5 enums, Nitro API endpoints, rate limiting, analytics, admin-lite, and monorepo structure.

## Current Parent
- Conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Updated: not yet

## Task Summary
- **What to build**: Full specification extraction for Backend & Monorepo (apps/web, packages/shared, packages/db, Drizzle schema, Neon connection, seed script, Nitro APIs, rate limiting, analytics, admin-lite, security).
- **Success criteria**: Comprehensive handoff.md with 5-component report, Features Discovered table, Edge Cases table, verifying all criteria from PRD, Design System doc, and implementation plan.
- **Interface contracts**: docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md, docs/01-PRD-SSD-Landing-Page.md, scripts/guardrail-check.mjs
- **Code layout**: apps/web, packages/shared, packages/db

## Key Decisions Made
- Fully probed 15 tables and 5 enums in Drizzle ORM schema with exact types and relations.
- Verified Neon HTTP driver nuances (batching required, transactions over HTTP not supported; unpooled for DDL/seed).
- Verified Nitro API endpoint behavior including SWR cache fallback, IP hashing salt, honeypot 202 response, 429 rate limiter (3 per 10m), async webhooks, and formula injection escaping in CSV exports.
- Verified Admin-lite SPA route rules (`ssr: false`, `robots: false`) and auth middleware.
- Verified zero-credentials rule enforced by scripts/guardrail-check.mjs.

## Artifact Index
- DISPATCH.md — Dispatch assignment and instructions
- BRIEFING.md — Situational awareness and identity
- progress.md — Liveness heartbeat
- handoff.md — Comprehensive specification mining report

# DISPATCH — m4_auditor_1

**Agent**: `m4_auditor_1`  
**Role**: `teamwork_preview_auditor` (Forensic Integrity Auditor)  
**Parent / Dispatcher**: `orchestrator_1` (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_auditor_1`  

## Objective
Perform an exhaustive, independent forensic integrity audit of Milestone 4 (Security, Guardrails & Accessibility Hardening). Your verdict is a **BINARY VETO** — any integrity violation, dummy facade, hardcoded cheat, or bypass will fail the gate immediately.

## Mandatory Input Documents (READ FIRST)
1. `d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md` (Mandatory - read first!)
2. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `d:\All Project Website\Web School Smart Digital\TEST_READY.md`
4. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_worker\handoff.md`

## Forensic Verification Checks
You must execute and independently verify:
1. **Authenticity of Implementation**:
   - Inspect `apps/web/nuxt.config.ts`, `apps/web/app/components/SiteNavigation.vue`, `apps/web/app/components/EcosystemSelector.vue`, `apps/web/app/components/HeroPortal.vue`.
   - Verify that all security headers, touch target adjustments, focus synchronization, and `<noscript>` fallbacks contain genuine implementation code. Zero dummy facades, zero mock stubs, zero hardcoded cheat values.
2. **Zero-Credential Compliance**:
   - Execute `pnpm guardrail`.
   - Verify 0 violations (no credentials, personal phones, competitors, internal leaks).
3. **TypeScript Strict Typecheck**:
   - Execute `pnpm --filter web exec nuxi prepare`.
   - Execute `pnpm typecheck`.
   - Verify exit code 0 across all workspaces.
4. **Production Build Integrity**:
   - Execute `pnpm --filter web build`.
   - Verify complete Nuxt Nitro production build in `apps/web/.output/` with exit code 0.
5. **E2E Test Suite Integrity**:
   - Execute `node tests/runner.mjs`.
   - Verify all 229 tests pass (100% across Tiers 1-4).
6. **Live Server Verification**:
   - Spawn the production server from `apps/web/.output/server/index.mjs` on an unused port.
   - Query `/` and verify HTTP security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, etc.).
   - Verify SSR HTML response contains semantic `<h1>`, 12 apps, FAQs, and JSON-LD schemas.

## Output Requirements
Write `handoff.md` in your working directory (`d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_auditor_1\handoff.md`) with:
- **Verdict**: Explicit `CLEAN` or `INTEGRITY VIOLATION` (or `CHEATING DETECTED`)
- **Forensic Evidence**: Command execution logs, file checks, integrity analysis
- **Logic Chain**: Audit reasoning
- **Attestation**: Cryptographic or structured attestation statement of clean findings

Deliver by sending a message to parent `1ff91f96-3422-4423-9647-7ab08609ae2d` when complete.

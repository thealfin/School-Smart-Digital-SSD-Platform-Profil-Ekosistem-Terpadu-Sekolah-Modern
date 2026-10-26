# BRIEFING — 2026-10-24T18:55:00Z

## Mission
Provide exhaustive technical recommendations and exact code structure for the Hero S-Curve Morph aperture (`HeroPortal.vue`), knockout typography, rising ledge, and monorepo build verification strategy for Milestone 1.

## 🔒 My Identity
- Archetype: Teamwork explorer (teamwork_preview_explorer)
- Roles: Read-only investigation, architectural analysis, component specification, synthesis, and reporting
- Working directory: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_explorer_3
- Original parent: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Milestone: Milestone 1 (Foundation & Scaffolding) - Part C

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Must comply with zero-credential guardrails and content restrictions (`scripts/guardrail-check.mjs`)
- Must maintain strict WCAG AA contrast and zero horizontal overflow across 320px–1440px
- Resilient SSR & Zero-JS rendering requirement: `<h1>Sistem operasi untuk sekolah Anda.</h1>` must render in initial SSR stream
- Follow monorepo layout: code in `apps/web`, `packages/shared`, `packages/db`; `.agents/teamwork/` must contain only agent metadata

## Current Parent
- Conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Updated: 2026-10-24T18:55:00Z

## Investigation State
- **Explored paths**:
  - `docs/00`, `docs/01`, `docs/02`, `docs/03`, `docs/04`
  - `spec_miner_1/handoff.md`, `explorer_1/handoff.md`, `PROJECT.md`, `ORIGINAL_REQUEST.md`
  - Workspace configuration: `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `tsconfig.base.json`, `scripts/guardrail-check.mjs`
- **Key findings**:
  - Exact dual-stage scroll math: $p \in [0, 1]$, $e = \text{easeInOutCubic}(p / 0.70)$, $b = \text{easeOutCubic}((p - 0.70) / 0.30)$.
  - Signature corner radius morph: $rTL = 0.44 w_0 (1 - e)$, $rOther = 18 (1 - e)$.
  - Knockout typography: exact alignment between `.type-out` (Navy) and `.type-in` (White) with `min(15.5vw, 30vh, 260px)`.
  - Rising `.ledge` houses semantic `<h1>Sistem operasi untuk sekolah Anda.</h1>` and CTAs, activated at $b \ge 0.5$.
  - Fallback: `--e: 1; --b: 1; height: 100svh; clip-path: none` for `prefers-reduced-motion: reduce` and zero-JS / SSR.
  - Verification sequence: `pnpm install` -> `pnpm guardrail` -> `nuxi prepare` -> `pnpm typecheck` -> `pnpm build`.
- **Unexplored areas**: None within Milestone 1 Part C scope.

## Key Decisions Made
- Fully authored standalone reference implementation in `proposed_HeroPortal.vue`.
- Established `nuxi prepare` as mandatory pre-typecheck step to prevent `.nuxt/tsconfig.json` missing type errors.
- Documented 6-point potential build pitfalls and resolution catalog.

## Artifact Index
- `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_explorer_3\handoff.md` — Complete 5-component handoff report
- `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_explorer_3\proposed_HeroPortal.vue` — Full proposed Vue component reference
- `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_explorer_3\progress.md` — Liveness heartbeat
- `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_explorer_3\DISPATCH.md` — Logged dispatch instructions

# BRIEFING — 2026-10-24T20:20:00Z

## Mission
Provide exhaustive production-ready component blueprints and code for Milestone 2 Part 1: Navigation & Core Ecosystem (`ecosystem.ts`, `SiteNavigation.vue`, `ProblemList.vue`, `EcosystemSelector.vue`, `FlowTimeline.vue`).

## 🔒 My Identity
- Archetype: teamwork_preview_spec_miner
- Roles: Specification Miner & UI/UX Component Architect
- Working directory: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_1
- Original parent: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Milestone: Milestone 2 — Interactive Core Narrative & Component Architecture (Part 1)

## 🔒 Key Constraints
- Do NOT implement directly in production paths if acting strictly as spec miner, or supply exhaustive, ready-to-use blueprints and exact code in `handoff.md`.
- Zero credentials in code, examples, or seeds (no passwords, guru123, etc.).
- Honest status representation: Apps 10–12 in 'development'; QR jemput harian in 'roadmap' (Fase 4).
- Contrast WCAG AA compliance (Navy on light, Cyan on dark, Cyan-700 text on light backgrounds >= 5.3:1).
- Responsive: 320px, 375px, 768px, 1024px, 1440px with zero horizontal overflow.
- SSR resilience: semantic HTML visible without client JS.
- Reduced motion support: `prefers-reduced-motion: reduce`.

## Current Parent
- Conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Updated: 2026-10-24T19:49:46Z

## Task Summary
- **What to build**: Complete specification, contracts, edge cases, and drop-in code for:
  1. `apps/web/app/stores/ecosystem.ts` (Pinia store)
  2. `apps/web/app/components/SiteNavigation.vue` (sticky adaptive nav + scrollspy + mobile drawer)
  3. `apps/web/app/components/ProblemList.vue` (restaurant analogy + 7 pain points + chips)
  4. `apps/web/app/components/EcosystemSelector.vue` (12-app catalog + sticky preview + keyboard nav)
  5. `apps/web/app/components/FlowTimeline.vue` (9 steps Ahmad journey + perforated ticket card)
- **Status**: COMPLETE. All blueprints and production-ready source code written to `handoff.md`.
- **Interface contracts**: `PROJECT.md`, `packages/shared/src/types.ts`, `packages/shared/src/content/index.ts`.
- **Code layout**: Nuxt 4 standard in `apps/web/app/`.

## Key Decisions Made
- Architecture: Pinia `useEcosystemStore` manages active app slug (`back-office` default), active index (0–11), hash synchronization, and keyboard shortcuts.
- Adaptive Nav: `SiteNavigation` computes background & color transition using `color-mix(in srgb, #ffffff var(--over, 0%), #0a2036)` over hero aperture and switches to `#F6F9FC` at 92% opacity with `backdrop-filter: blur(16px)` past hero.
- S-Curve Portal Frame: EcosystemSelector implements sticky preview portal frame with S-Curve radius (`220px 24px 24px 24px` desktop, pinned `42vh` mobile) and tablist/tab keyboard navigation.
- Perforated Ticket: FlowTimeline features `.ops-ticket` with radial cutout mask for the `.ticket-stub` and displays 9 connected steps.

## Artifact Index
- `DISPATCH.md` — Dispatch instructions & logs
- `progress.md` — Liveness heartbeat & task progress (ALL DONE)
- `BRIEFING.md` — Situational awareness
- `handoff.md` — Exhaustive component blueprints and specifications

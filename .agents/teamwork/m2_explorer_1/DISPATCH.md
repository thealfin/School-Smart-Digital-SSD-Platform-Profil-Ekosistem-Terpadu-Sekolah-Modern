# DISPATCH — m2_explorer_1

## Task
You are m2_explorer_1 (teamwork_preview_spec_miner).
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_1
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md
Read PROJECT.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md
Read authoritative UI/UX docs:
- `docs/01-PRD-SSD-Landing-Page.md`
- `docs/02-UIUX-DESIGN-SSD-Landing-Page.md`
- `docs/04-HERO-MORPH-DESIGN-ADAPTATION.md`
- `apps/web/app/components/HeroPortal.vue`
- `packages/shared/src/content/index.ts`

## Objective (Milestone 2 Scope - Part 1: Navigation & Core Ecosystem)
Provide complete, production-ready Vue 3 SFC component blueprints for:
1. `apps/web/app/stores/ecosystem.ts`:
   - Pinia store managing active app slug (default `back-office` / 01), active index (0–11).
   - Keyboard navigation handlers: `handleKeydown` supporting ArrowDown, ArrowUp, Home, End.
   - Hash sync: listens to `window.location.hash`, updates URL hash without jumping page.
2. `apps/web/app/components/SiteNavigation.vue`:
   - Sticky adaptive navigation with `color-mix()` transition over the hero section based on `--over`.
   - Post-hero solid blurred bar (`#F6F9FC` @ 92%, `backdrop-blur: 16px`).
   - Desktop nav links with scrollspy highlighting.
   - Full-screen mobile drawer with focus trap, Escape key listener, and CTA button.
3. `apps/web/app/components/ProblemList.vue`:
   - Restaurant analogy quote ("Sekolah seperti restoran...").
   - 7 operational pain points in 2-column grid.
   - Interactive app chips linking to `#app-<slug>` and updating active ecosystem app.
4. `apps/web/app/components/EcosystemSelector.vue`:
   - Two-column layout on desktop: Left sticky S-Curve portal frame preview (`42vh` pinned on mobile), device mockup, status badge, platform label, feature chips, CTA; Right column 01–12 numbered list.
   - ARIA `tablist` and `tab` semantics, keyboard navigation (ArrowUp/Down, Home/End).
5. `apps/web/app/components/FlowTimeline.vue`:
   - 9-step timeline highlighting "Ahmad" daily journey (permit to ledger).
   - Skeuomorphic perforated "Pass Operasional Satu Data" ticket card (`.ops-ticket` with `.stub` mask and radial cutout).

Write your exhaustive component blueprints to `handoff.md` and notify orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`).



## 2026-10-24T19:49:46Z
From: 1ff91f96-3422-4423-9647-7ab08609ae2d
You are m2_explorer_1.
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_1
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md
Your dispatch instructions are at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_1\DISPATCH.md
Read PROJECT.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md

Provide exhaustive component blueprints and code for:
- ecosystem.ts (Pinia store)
- SiteNavigation.vue (sticky adaptive nav + scrollspy + mobile drawer)
- ProblemList.vue (7 pain points + chips)
- EcosystemSelector.vue (12 apps + sticky portal preview + keyboard nav)
- FlowTimeline.vue (9 steps + perforated ticket card)

Write your blueprints to `handoff.md` and notify orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`).

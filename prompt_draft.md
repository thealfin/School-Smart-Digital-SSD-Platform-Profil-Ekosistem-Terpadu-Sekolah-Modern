# Teamwork Project Prompt — Draft

> Status: Ready for launch — awaiting user approval
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Full multi-agent build team

Build a high-converting, accessible, and performant product profile landing page for School Smart Digital (SSD) — an integrated school operating system ecosystem by Digital Teknologi Perkasa — following full monorepo architecture (Nuxt 4, Tailwind CSS v4, Pinia, Nitro, PostgreSQL on Neon, Drizzle ORM) with a signature Hero Morph aperture, 12-app ecosystem selector, 9-step operational timeline, and lead capture.

Working directory: `d:\All Project Website\Web School Smart Digital`
Integrity mode: demo

Reference materials:
- `docs/00-MASTER-PROMPT-SSD-LANDING.md`
- `docs/01-PRD-SSD-Landing-Page.md`
- `docs/02-UIUX-DESIGN-SSD-Landing-Page.md`
- `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md`
- `docs/04-HERO-MORPH-DESIGN-ADAPTATION.md`
- `implementation_plan.md`

## Requirements

### R1. Monorepo Setup & Design System Foundation
- Establish pnpm monorepo structure with workspaces: `apps/web` (Nuxt 4 frontend & Nitro API), `packages/shared` (Zod schemas, types, fallback static seed), and `packages/db` (Drizzle ORM schema, Neon connection, migrations, seed, admin scrypt password).
- Implement design tokens in Tailwind CSS v4 (`apps/web/app/assets/css/main.css`) adopting the Navy `#12355B` and Cyan `#00B4D8` brand palette, wall surface `#F6F9FC` with SVG grain texture, Bricolage Grotesque variable display font, Plus Jakarta Sans body, and JetBrains Mono metadata.
- Implement the Hero S-Curve Morph aperture (`HeroPortal.vue`) with two-stage scroll expansion (`--e` and `--b`), knockout typography (`SCHOOL / SMART` in Navy on wall, White inside portal), and the rising `.ledge` component carrying semantic `<h1>`, fact list, and CTA buttons.
- Vectorize and supply clean SVG brand logo assets (`logo.svg`, `logo-mark.svg`, `logo-white.svg`, `favicon.svg`) and Material Symbols Rounded icons via `@nuxt/icon`.

### R2. Interactive Core Narrative & Component Architecture
- Construct all 12 landing sections following the PRD hierarchy:
  1. `SiteNavigation`: sticky adaptive navigation with `color-mix` over hero and scrollspy.
  2. `HeroPortal`: S-Curve morph portal + rising ledge.
  3. `ProblemList`: 7 daily operational pain points with app chips linking to ecosystem selector.
  4. `EcosystemSelector`: 12-app selector with sticky S-Curve portal frame (pinned on mobile) and numbered list `01–12` supporting keyboard navigation (ArrowUp/Down, Home/End) and URL hash `#app-<slug>`.
  5. `FlowTimeline`: 9-step timeline highlighting "Ahmad" demo flow, topped by the perforated "Pass Operasional Satu Data" ticket card.
  6. `SpotlightTabs`: WAI-ARIA tabs for BK, Raport Digital, and Security Gate featuring tilted paper cards (`-1.5deg`) and circular stamps (`.stamp`).
  7. `ModuleGrid` & `RoleLadder`: 12 Back Office module groups (disclosure `<details>`) and role access levels 0–9.
  8. `UnitDiagram`: Multi-unit foundation visualization (Yayasan → SD · SMP · TPQ · Pondok).
  9. `TrustPillars`: 4 verified security & counseling privacy pillars.
  10. `HonestTable`: Honest comparison table transforming into stacked cards on mobile + "What we don't claim" note.
  11. `ParentBrandStrip`: Track record of DTP & Pesantren Smart Digital.
  12. `FaqAccordion`: Accessible FAQ accordion with JSON-LD `FAQPage`.
  13. `ClosingCta` & `DemoForm`: Echo portal with `MARI / MULAI` leading into the demo request form (11 fields, progressive enhancement, rate limiting, honeypot) and direct WhatsApp CTA.
  14. `SiteFooter`: Editorial 4-column footer with contact and legal links (`/privacy-policy`, `/terms`, `/faq`).

### R3. Nitro API Backend, Neon Database & Admin-Lite
- Nitro API endpoints in `apps/web/server/`:
  - `GET /api/content`: SWR-cached content endpoint with seamless fallback to `@ssd/shared` static content if database is unreachable.
  - `POST /api/leads`: Lead intake with Zod validation, honeypot spam prevention, rate limiting (max 3 submissions per 10 minutes per hashed IP), phone normalization (`628...`), and optional async webhook notification.
  - `POST /api/track`: First-party analytics event logger (`page_view`, `section_view`, `app_select`, `cta_click`, `lead_submit`).
  - `/api/auth/login`, `/api/auth/logout`: Admin session management via `nuxt-auth-utils`.
  - `/api/admin/leads`, `/api/admin/leads/[id]`, `/api/admin/leads.csv`: Admin lead list, status update, notes, and CSV export (with formula injection escaping).
- Database layer in `packages/db`: Drizzle schema (15 tables, 5 enums), migrations, idempotent seed script populating all 12 apps and features without test credentials, and CLI admin user creator script.
- Admin-lite SPA pages at `/admin/login`, `/admin/leads` (protected by middleware, SSR disabled, excluded from search indexing).

### R4. Security, Guardrails & Accessibility
- Strict adherence to zero-credential guardrails: no test accounts (`guru123`, `bkdemo`, etc.) or private phone numbers in code or seed.
- Generic competitor comparisons (no direct competitor trademark mentions).
- Resilient rendering: full page content visible on initial SSR, functioning without JavaScript, and gracefully handling `prefers-reduced-motion: reduce`.
- High contrast compliant with WCAG AA (focus rings Navy on light surfaces, Cyan on Navy surfaces; Cyan-700 for text on light backgrounds).

## Acceptance Criteria

### Automated Verification & Build
- [ ] `pnpm guardrail` script executes and passes with 0 violations.
- [ ] `pnpm typecheck` passes across all monorepo workspaces without TypeScript errors.
- [ ] `pnpm build` creates a complete, production-ready build for `apps/web`.
- [ ] SSR HTML output contains `<h1>Sistem operasi untuk sekolah Anda.</h1>`, 12 app descriptions, FAQ content, and valid JSON-LD schemas without executing client JavaScript.
- [ ] Endpoint `/api/content` serves 200 OK with complete fallback payload when database connection is unavailable.
- [ ] `POST /api/leads` returns 201 on valid input, 400 on invalid input, 202 on honeypot trigger without inserting, and 429 when rate limit is exceeded.
- [ ] Zero horizontal overflow (`scrollWidth <= innerWidth`) on viewports: 320px, 375px, 768px, 1024px, and 1440px.


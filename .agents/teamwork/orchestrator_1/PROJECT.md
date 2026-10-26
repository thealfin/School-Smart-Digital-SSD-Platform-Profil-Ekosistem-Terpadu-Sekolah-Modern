# Project: School Smart Digital (SSD) Landing Page

## Architecture
- **Monorepo**: pnpm workspaces (`apps/web`, `packages/shared`, `packages/db`).
- **Frontend**: Nuxt 4 (`apps/web/app/`), Tailwind CSS v4 (`@theme`), Pinia store, `@nuxt/icon` (Material Symbols Rounded), `@nuxt/fonts` (Bricolage Grotesque, Plus Jakarta Sans, JetBrains Mono).
- **Backend & APIs**: Nuxt Nitro server engine (`apps/web/server/api/`), `nuxt-auth-utils` for sealed session cookies.
- **Database**: PostgreSQL on Neon via `@neondatabase/serverless` & `drizzle-orm/neon-http`.
  - Pooled endpoint for runtime (`DATABASE_URL`, `NUXT_DATABASE_URL`).
  - Unpooled endpoint for DDL / migrations / seeding (`DATABASE_URL_UNPOOLED`).
- **Data Flow**:
  - SSR & Client consume `GET /api/content` (cached with SWR), which queries Neon or falls back instantly to `@ssd/shared/content`.
  - Client submits leads to `POST /api/leads` (Zod validated, honeypot checked, IP-hash rate limited).
  - Admin users authenticate at `/admin/login` and manage leads at `/admin/leads` (SPA mode, no SSR, noindex).

## Code Layout
```
apps/web/
  ├── app/
  │   ├── assets/css/main.css         # Tailwind CSS v4 @theme, design tokens, typography, SVG grain
  │   ├── assets/svg/                 # SVG logo assets (logo.svg, logo-mark.svg, logo-white.svg, favicon.svg)
  │   ├── components/                 # 14 landing components & UI building blocks
  │   │   ├── SiteNavigation.vue      # Sticky adaptive nav + mobile drawer
  │   │   ├── HeroPortal.vue          # S-Curve morph portal + rising ledge + knockout typography
  │   │   ├── ProblemList.vue         # 7 pain points + app chips
  │   │   ├── EcosystemSelector.vue   # 12-app catalog + sticky preview + keyboard nav
  │   │   ├── FlowTimeline.vue        # 9-step timeline + perforated ticket card (.ops-ticket)
  │   │   ├── SpotlightTabs.vue       # WAI-ARIA tabs (BK, Raport, Security) + tilted cards + stamps
  │   │   ├── ModuleGrid.vue          # 12 Back Office module disclosure <details>
  │   │   ├── RoleLadder.vue          # Role hierarchy ladder 0-9
  │   │   ├── UnitDiagram.vue         # Multi-unit foundation diagram
  │   │   ├── TrustPillars.vue        # 4 security & privacy pillars
  │   │   ├── HonestTable.vue         # Comparison table + stacked mobile cards + disclaimer
  │   │   ├── ParentBrandStrip.vue    # DTP & Pesantren Smart Digital credentials
  │   │   ├── FaqAccordion.vue        # Accessible FAQ accordion + JSON-LD FAQPage
  │   │   ├── ClosingCta.vue          # Echo portal + MARI/MULAI knockout text
  │   │   ├── DemoForm.vue            # 11-field demo request form with progressive enhancement
  │   │   └── SiteFooter.vue          # 4-column editorial footer
  │   ├── composables/                # useContent, useLeadForm, useScrollProgress, useAnalytics
  │   ├── layouts/
  │   │   ├── default.vue             # Public landing layout
  │   │   └── admin.vue               # Admin-Lite layout
  │   ├── middleware/
  │   │   └── admin.ts                # Admin session protection
  │   ├── pages/
  │   │   ├── index.vue               # Main landing page (SSR enabled)
  │   │   ├── admin/
  │   │   │   ├── login.vue           # Admin login SPA
  │   │   │   └── leads.vue           # Admin leads management SPA
  │   │   ├── privacy-policy.vue      # Legal page
  │   │   ├── terms.vue               # Legal page
  │   │   └── faq.vue                 # Dedicated FAQ page
  │   ├── stores/
  │   │   ├── ecosystem.ts            # Active app, keyboard navigation, hash sync
  │   │   └── content.ts              # Global landing content cache
  │   └── app.vue                     # Nuxt root component
  ├── server/
  │   ├── api/
  │   │   ├── content.get.ts          # SWR cached content + static fallback
  │   │   ├── leads.post.ts           # Lead intake + honeypot + rate limiter + webhook
  │   │   ├── track.post.ts           # First-party analytics logger
  │   │   ├── auth/
  │   │   │   ├── login.post.ts       # Admin login
  │   │   │   └── logout.post.ts      # Admin logout
  │   │   └── admin/
  │   │       ├── leads.get.ts        # Lead list with search/filter/pagination
  │   │       ├── leads/[id].patch.ts # Update lead status/notes
  │   │       └── leads.csv.get.ts    # Lead CSV export with formula injection escaping
  │   └── utils/
  │       ├── db.ts                   # Nitro Neon client initialization
  │       ├── rateLimit.ts            # Salted SHA-256 IP hash rate limiter
  │       └── sanitize.ts             # CSV formula injection escaping
  ├── nuxt.config.ts                  # Nuxt 4 configuration, route rules, fonts, icons
  └── package.json                    # apps/web package manifest

packages/shared/
  ├── src/
  │   ├── schemas.ts                  # Zod schemas (leadInputSchema, trackSchema, authSchema)
  │   ├── types.ts                    # TypeScript interfaces & types
  │   ├── phone.ts                    # Phone normalizer (normalizeWa)
  │   └── content/
  │       └── index.ts                # Complete static fallback payload
  ├── package.json                    # @ssd/shared package manifest
  └── tsconfig.json

packages/db/
  ├── src/
  │   ├── schema.ts                   # Drizzle schema (15 tables, 5 enums)
  │   ├── index.ts                    # Neon HTTP driver connection
  │   ├── seed.ts                     # Idempotent seed script from @ssd/shared/content
  │   └── create-admin.ts             # CLI script for initial admin creation
  ├── drizzle.config.ts               # Drizzle Kit config
  ├── package.json                    # @ssd/db package manifest
  └── tsconfig.json

tests/
  ├── e2e/                            # Opaque-box E2E test suite (Tiers 1-4)
  └── runner.mjs                      # Comprehensive test runner
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Monorepo Workspaces & Root Config | pnpm monorepo structure (apps/web, packages/shared, packages/db) | M1 | R1, explorer_1 |
| 2 | Design Tokens & Tailwind CSS v4 `@theme` | Brand palette (Navy #12355B, Cyan #00B4D8, Wall #F6F9FC, Cyan-700 text), typography, grain | M1 | R1, spec_miner_1 |
| 3 | Brand SVG Assets & Material Symbols | Vectorized SVG logos (logo, mark, white, favicon) and `@nuxt/icon` setup | M1 | R1, spec_miner_1 |
| 4 | Hero S-Curve Morph Foundations | HeroPortal.vue structure, CSS variables (--e, --b), knockout text setup, rising ledge | M1 | R1, spec_miner_1 |
| 5 | Shared Schemas, Types & Static Seed | packages/shared Zod schemas, types, phone normalizer, and complete fallbackContent | M1 | R1, spec_miner_2 |
| 6 | SiteNavigation | Sticky adaptive nav with dynamic color-mix() over hero, scrollspy, mobile drawer | M2 | R2, spec_miner_1 |
| 7 | HeroPortal Component | Complete S-Curve aperture morph, dual-stage scroll math, knockout text, rising ledge | M2 | R2, spec_miner_1 |
| 8 | ProblemList Component | Restaurant analogy + 7 daily operational pain points with interactive app chips | M2 | R2, spec_miner_1 |
| 9 | EcosystemSelector Component | 12-app catalog with sticky S-Curve portal frame, keyboard nav 01-12, #app-<slug> | M2 | R2, spec_miner_1 |
| 10 | FlowTimeline Component | 9-step timeline ("Ahmad" flow) + perforated "Pass Operasional Satu Data" ticket | M2 | R2, spec_miner_1 |
| 11 | SpotlightTabs Component | WAI-ARIA tabs for BK, Raport Digital, Security Gate with -1.5deg tilted cards & stamps | M2 | R2, spec_miner_1 |
| 12 | ModuleGrid & RoleLadder | 12 Back Office module disclosure <details> + visual role hierarchy 0-9 | M2 | R2, spec_miner_1 |
| 13 | UnitDiagram Component | Multi-unit foundation visualization (Yayasan → SD · SMP · TPQ · Pondok) | M2 | R2, spec_miner_1 |
| 14 | TrustPillars Component | 4 verified security & privacy pillars (counseling privacy, tiered access, expiring QR) | M2 | R2, spec_miner_1 |
| 15 | HonestTable Component | 9-issue comparison table converting to stacked cards on mobile + disclaimer | M2 | R2, spec_miner_1 |
| 16 | ParentBrandStrip Component | Track record of DTP & Pesantren Smart Digital with citations | M2 | R2, spec_miner_1 |
| 17 | FaqAccordion Component | Accessible FAQ accordion with SSR JSON-LD FAQPage schema | M2 | R2, spec_miner_1 |
| 18 | ClosingCta Component | Echo portal with giant MARI / MULAI knockout text leading to demo form | M2 | R2, spec_miner_1 |
| 19 | DemoForm & Direct WhatsApp | 11-field form (Zod validation, honeypot, progressive enhancement) + WA link | M2 | R2, spec_miner_1 |
| 20 | SiteFooter Component | 4-column editorial footer with DTP attribution, SVG icons, and legal links | M2 | R2, spec_miner_1 |
| 21 | Drizzle Schema (15 Tables, 5 Enums) | Full Postgres relational schema in packages/db with Neon HTTP driver | M3 | R3, spec_miner_2 |
| 22 | Database Migrations & Idempotent Seed | Idempotent seed script inserting 12 apps, 9 steps, 12 modules, and settings | M3 | R3, spec_miner_2 |
| 23 | CLI Admin Creator Script | CLI script for initial admin creation via scrypt password hashing | M3 | R3, spec_miner_2 |
| 24 | GET /api/content Endpoint | SWR-cached content endpoint with automatic fallback to @ssd/shared static seed | M3 | R3, spec_miner_2 |
| 25 | POST /api/leads Endpoint | Zod validation, honeypot (202), salted IP-hash rate limiting (429), WA normalization (201) | M3 | R3, spec_miner_2 |
| 26 | POST /api/track Endpoint | First-party telemetry event logger logging page_view, section_view, app_select, etc. | M3 | R3, spec_miner_2 |
| 27 | Auth APIs & Session Management | /api/auth/login, /api/auth/logout via nuxt-auth-utils with sealed cookie | M3 | R3, spec_miner_2 |
| 28 | Admin Leads APIs & CSV Export | /api/admin/leads list, detail/patch, and CSV export with formula injection escaping | M3 | R3, spec_miner_2 |
| 29 | Admin-Lite SPA Pages | /admin/login, /admin/leads with client auth middleware, SSR disabled, noindex | M3 | R3, spec_miner_2 |
| 30 | Zero-Credential & Content Guardrails | Enforcement via scripts/guardrail-check.mjs with 0 violations across all workspaces | M4 | R4, spec_miner_2 |
| 31 | WCAG AA Contrast & Focus Rings | Navy rings on light surfaces, Cyan on Navy; Cyan-700 text (>=5.3:1 contrast) | M4 | R4, spec_miner_1 |
| 32 | Viewport Responsiveness | Zero horizontal overflow (scrollWidth <= innerWidth) across 320, 375, 768, 1024, 1440px | M4 | R4, spec_miner_1 |
| 33 | Resilient SSR & Zero-JS Rendering | Heading <h1>, 12 apps, FAQ, and JSON-LD rendered in SSR stream without client JS | M4 | R4, spec_miner_1 |
| 34 | Reduced Motion Support | prefers-reduced-motion: reduce renders open portal with static ledge (e=1, b=1) | M4 | R4, spec_miner_1 |
| 35 | E2E Testing Suite (Tiers 1-4) | Independent opaque-box test runner covering all inventoried features | E2E-Track | Dual Track |
| 36 | 100% E2E Test Suite Pass | Passing all Tier 1-4 automated tests | M5 | Acceptance |
| 37 | Adversarial Hardening (Tier 5) | White-box stress-testing, edge case verification, and final integrity certification | M5 | Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Monorepo Setup & Design System Foundation | packages/shared, packages/db scaffolding, apps/web scaffolding, Tailwind v4 tokens, fonts, SVG logos, HeroPortal foundation | none | DONE |
| M2 | Interactive Core Narrative & Component Architecture | All 14 landing sections, Pinia stores, keyboard navigation, responsive layouts, progressive enhancement | M1 | DONE |
| M3 | Nitro API Backend, Neon Database & Admin-Lite | Drizzle schema (15 tables, 5 enums), seed script, create-admin CLI, Nitro APIs (/api/content, /api/leads, /api/track, auth, admin), Admin-Lite SPA | M1 | DONE |
| M4 | Security, Guardrails & Accessibility Hardening | Guardrail zero-violations, WCAG AA contrast, zero horizontal overflow across 5 viewports, SSR HTML resilience | M2, M3 | DONE |
| M5 | E2E Test Pass & Adversarial Hardening | Pass 100% of E2E tests (Tiers 1-4) followed by Tier 5 adversarial stress testing | M4, E2E-Track | DONE |
| E2E | E2E Testing Track | Independent requirement-driven test suite with runner and Tiers 1-4 tests (publishes TEST_READY.md) | none | DONE |

## Interface Contracts
### @ssd/shared ↔ apps/web & packages/db
- `schemas.ts`:
  - `leadInputSchema`: Zod schema validating `{ name, roleTitle, organization, orgType, studentCountRange, unitCount, whatsapp, email, interests, message, consent, website }`.
  - `trackSchema`: Zod schema validating `{ eventName, pagePath, sectionId, props, sessionId }`.
  - `authSchema`: Zod schema validating `{ email, password }`.
- `phone.ts`:
  - `normalizeWa(input: string): string`: Normalizes Indonesian mobile numbers (`08...`, `+628...`, `628...`) to E.164 without plus (`628...`).
- `content/index.ts`:
  - `fallbackContent`: Static payload matching `Content` interface containing all 12 apps, 9 flow steps, 12 module groups, 8 role levels, 7 pain points, 9 comparison rows, 9 FAQs, and site settings.

### packages/db ↔ apps/web (Nitro Server)
- Neon HTTP driver client exported as `db` from `@ssd/db`.
- Drizzle schema objects exported from `@ssd/db/schema`.
- Safe atomic batches via `db.batch([...])`.

### Nitro APIs ↔ Frontend / External Clients
- `GET /api/content`:
  - Header: Cache-Control with SWR.
  - Success: `200 OK` with JSON `{ apps, moduleGroups, roleLevels, painPoints, flowSteps, comparisons, faqs, settings }`.
  - Fallback: `200 OK` with static `fallbackContent` on DB failure.
- `POST /api/leads`:
  - Success: `201 Created` `{ ok: true, id: string }`.
  - Honeypot: `202 Accepted` `{ ok: true }` (no DB insert).
  - Rate limited: `429 Too Many Requests` `{ statusCode: 429, message: string }`.
  - Validation error: `400 Bad Request` `{ statusCode: 400, errors: ZodIssue[] }`.
- `POST /api/track`:
  - Success: `204 No Content`.
- `POST /api/auth/login`:
  - Success: `200 OK` `{ ok: true }` (sealed session cookie).
  - Bad credentials: `401 Unauthorized` `{ statusCode: 401, message: "Email atau password tidak valid." }`.
- `GET /api/admin/leads.csv`:
  - Success: `200 OK` with text/csv, formula injection characters prepended with `'`.

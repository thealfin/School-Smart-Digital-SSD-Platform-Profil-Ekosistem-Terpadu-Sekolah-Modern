# EXPLORATION REPORT & BASELINE ASSESSMENT — SCHOOL SMART DIGITAL (SSD)

**Agent**: `explorer_1` (Explorer & Repository Auditor)  
**Date**: 2026-10-24T18:45:00Z  
**Recipient**: Orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\explorer_1`  
**Reference Input**: `ORIGINAL_REQUEST.md`, `docs/`, `scripts/`, repository root files  

---

## 1. Observation

A comprehensive inspection of the workspace at `d:\All Project Website\Web School Smart Digital` was conducted via filesystem enumeration, text inspection, and command execution.

### 1.1 Tooling, Runtime & Operating System
- **Operating System**: Windows (PowerShell execution environment).
- **Node.js**: `v24.21.0` (confirmed via `node -v`).
- **pnpm**: `12.9.1` (confirmed via `pnpm -v`).
- **npm**: `11.19.0` (confirmed via `npm -v`).
- **Git State**:
  - Initialized repository (`.git` exists).
  - Current branch: `master`.
  - Commits: 0 (`fatal: your current branch 'master' does not have any commits yet`).
  - All existing files are untracked by Git.

### 1.2 Existing Root Files & Directories
Direct listing of `d:\All Project Website\Web School Smart Digital`:
- `package.json` (22 lines):
  - Defines `name: "ssd-monorepo"`, `private: true`, `type: "module"`.
  - Scripts configured:
    - `"dev": "pnpm --filter web dev"`
    - `"build": "pnpm --filter web build"`
    - `"preview": "pnpm --filter web preview"`
    - `"typecheck": "pnpm -r typecheck"`
    - `"guardrail": "node scripts/guardrail-check.mjs"`
    - `"db:generate": "pnpm --filter @ssd/db db:generate"`
    - `"db:migrate": "pnpm --filter @ssd/db db:migrate"`
    - `"db:push": "pnpm --filter @ssd/db db:push"`
    - `"db:seed": "pnpm --filter @ssd/db db:seed"`
    - `"db:create-admin": "pnpm --filter @ssd/db create-admin"`
  - devDependencies: `"typescript": "^5.8.2"` (installed as `typescript@5.9.3` in virtual store).
- `pnpm-workspace.yaml` (4 lines):
  - Configures `packages: ['apps/*', 'packages/*']`.
- `.npmrc` (4 lines):
  - Configures `auto-install-peers=true`, `shamefully-hoist=false`, `strict-peer-dependencies=false`.
- `tsconfig.base.json` (14 lines):
  - Configures compiler options: `target: "ESNext"`, `module: "ESNext"`, `moduleResolution: "Bundler"`, `strict: true`.
- `.env` & `.env.example` (16 lines each):
  - `.env` is already created with Neon credentials:
    - `DATABASE_URL="postgresql://neondb_owner:npg_bkQ6NUO5YgzP@ep-morning-hill-aoccv6x9-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"`
    - `DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_bkQ6NUO5YgzP@ep-morning-hill-aoccv6x9.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"`
    - `NUXT_DATABASE_URL="postgresql://neondb_owner:npg_bkQ6NUO5YgzP@ep-morning-hill-aoccv6x9-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"`
    - `NUXT_IP_HASH_SALT="ssd_salt_k37_secure_hash_string_2026_neon"`
    - `NUXT_SESSION_PASSWORD="ssd_admin_session_secret_password_minimum_32_chars_long_prod"`
    - `NUXT_PUBLIC_SITE_URL="http://localhost:3000"`
    - `NUXT_PUBLIC_WHATSAPP_NUMBER="6285839845284"`
- `.gitignore` (34 lines):
  - Ignores `node_modules/`, `.pnpm-store/`, `.nuxt/`, `.output/`, `dist/`, `.env`, `.env.*`, `Dokument Persiapan/`, `qa-artifacts/`, `playwright-report/`, `test-results/`.
- `scripts/guardrail-check.mjs` (75 lines):
  - Enforces 5 forbidden regex rules against `apps/`, `packages/`, `scripts/`:
    1. Credentials/phone leaks: `/(?:guru123|walimurid123|bk123|cc123|bkdemo|cctv1|62811110\d{3}|62813001\d{3})/i`
    2. Competitor brands: `/(?:MySCH|Smarteschool|Smart School Project|Sekolah Smart|Google Classroom|Dapodik)/i`
    3. Cockpit internal platforms: `/(?:Super Admin Platform|Admin Keuangan Platform|Master Admin IT)/i`
    4. Dev domain: `/scsd\.my\.id/i`
    5. Fake stats: `/(?:98%\s*klien puas|aggregateRating)/i`
  - Tested directly via `pnpm guardrail`: **PASSED with 0 violations** (`✔ Guardrail scan PASSED`).
- `docs/` (5 authoritative specifications):
  - `00-MASTER-PROMPT-SSD-LANDING.md` (18,386 bytes)
  - `01-PRD-SSD-Landing-Page.md` (32,767 bytes)
  - `02-UIUX-DESIGN-SSD-Landing-Page.md` (20,938 bytes)
  - `03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` (58,560 bytes)
  - `04-HERO-MORPH-DESIGN-ADAPTATION.md` (23,017 bytes)
- `Dokument Persiapan/`:
  - Contains converted raw internal markdown files (`01-daftar-aplikasi.md`, `02-modul-bk.md`, `03-raport-digital.md`, `04-security-gate.md`, `05-wali-kelas.md`), raw PDFs, and `logo.jpeg` (129,539 bytes).
  - Explicitly ignored by `.gitignore` and excluded from `guardrail-check.mjs` scan.
- `README.md` & `prompt_draft.md`.

### 1.3 Missing Directories & Artifacts (Greenfield Scope)
The following mandatory monorepo packages and directories **DO NOT exist yet** and must be built from scratch:
1. `packages/shared` (Zod schemas, types, phone normalizer, and static content fallback).
2. `packages/db` (Drizzle schema with 15 tables and 5 enums, Neon client, migrations, idempotent seed, create-admin CLI).
3. `apps/web` (Nuxt 4 app with `app/` directory structure, Tailwind CSS v4 `@theme`, Pinia stores, 12 landing components, Nitro API endpoints, security headers, and admin-lite pages).

---

## 2. Logic Chain

From the observed facts to the implementation blueprint:

1. **Monorepo Structure Alignment**:
   - `package.json` expects `apps/web` to have package name `"web"` (`pnpm --filter web dev|build|preview`).
   - `package.json` expects `packages/db` to have package name `"@ssd/db"` (`pnpm --filter @ssd/db db:generate|migrate|push|seed|create-admin`).
   - `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` establishes that `packages/shared` is named `"@ssd/shared"`.
   - Therefore, the workspace package naming must strictly be `"web"`, `"@ssd/db"`, and `"@ssd/shared"`.

2. **Dependency & Scaffolding Dependency Order**:
   - `packages/shared` has zero internal workspace dependencies (only depends on `zod`). It contains schemas, types, and fallback content.
   - `packages/db` depends on `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`, and imports fallback content from `@ssd/shared` for idempotent seeding.
   - `apps/web` depends on both `@ssd/shared` and `@ssd/db` (for Nitro API queries and SSR data fetching).
   - **Conclusion**: `packages/shared` must be constructed first, followed by `packages/db`, and finally `apps/web`.

3. **Database Architecture & Neon Connection**:
   - `.env` contains valid Neon pooled and unpooled connection strings.
   - DNS resolution test to `ep-morning-hill-aoccv6x9.c-2.ap-southeast-1.aws.neon.tech` succeeded (`3.0.167.45`).
   - Drizzle schema requires 15 tables (`admin_users`, `site_settings`, `media`, `apps`, `app_features`, `module_groups`, `module_items`, `role_levels`, `pain_points`, `flow_steps`, `comparison_rows`, `faqs`, `testimonials`, `leads`, `analytics_events`) and 5 enums (`app_status`, `feature_status`, `lead_status`, `org_type`, `admin_role`).
   - Seed data must be idempotent (`onConflictDoUpdate`) and strictly derived from PRD Appendices A–G.

4. **SSR & Offline Fallback Requirement**:
   - Acceptance criteria require `GET /api/content` and SSR rendering of `/` to succeed even if the database is unreachable or unseeded.
   - This requires `apps/web/server/api/content.get.ts` to wrap DB queries in a `try/catch` and return `fallbackContent` from `@ssd/shared/content`.
   - The initial SSR HTML output must contain the exact heading `<h1>Sistem operasi untuk sekolah Anda.</h1>`, 12 app descriptions, FAQ items, and JSON-LD schema without executing client JS.

5. **Guardrail Compliance Enforcement**:
   - `scripts/guardrail-check.mjs` runs on `apps/`, `packages/`, and `scripts/`.
   - Any introduction of forbidden words (e.g. test credentials `guru123`, competitor names like `Smarteschool`, internal platform titles like `Super Admin Platform`, dev domain `scsd.my.id`, or unverified claims like `98% klien puas`) will immediately break the build and fail acceptance criteria.

---

## 3. Caveats & Risk Analysis

1. **Node.js 24 Runtime**:
   - The local environment runs Node `v24.21.0`. While modern tools support Node 24, some build tools may display engine warnings. The `.npmrc` setting `strict-peer-dependencies=false` and `auto-install-peers=true` mitigates blocking issues.
2. **Tailwind CSS v4 Integration**:
   - Tailwind CSS v4 in Nuxt 4 does not use `@nuxtjs/tailwindcss` (which targets v3). Instead, it uses `@tailwindcss/vite` in `nuxt.config.ts` with CSS-first configuration via `@import "tailwindcss";` and `@theme` directives in `app/assets/css/main.css`.
3. **SVG Asset Generation**:
   - The repository only has a raster `Dokument Persiapan/logo.jpeg`. Clean SVG assets (`logo.svg`, `logo-mark.svg`, `logo-white.svg`, `favicon.svg`) must be vectorized/synthesized according to the design specification (Navy `#12355B` and Cyan `#00B4D8` with the signature large top-left corner curve S-curve).
4. **Hero Morph Knockout Typography Sizing**:
   - Knockout typography requires `.type-out` (Navy on wall) and `.type-in` (White inside portal) to be positioned identically without font jumps across viewports (320px to 1440px).

---

## 4. Conclusion & Actionable Implementation Roadmap

The repository is currently an initialized clean root workspace with configuration files, documentation, and tooling in place, but completely greenfield regarding application code and database packages.

### Recommended Phased Implementation Plan for Build Team:

| Phase | Target Workspace | Core Deliverables |
|---|---|---|
| **Phase 1: Shared Core** | `packages/shared` | `package.json`, `tsconfig.json`, `schemas.ts` (Zod), `types.ts`, `phone.ts` (`normalizeWa`), `content/*.ts` (all 12 apps, 9 flow steps, 7 pain points, 12 module groups, 8 role levels, 9 comparison rows, 8 FAQs, settings). |
| **Phase 2: Database Layer** | `packages/db` | `package.json`, `tsconfig.json`, `drizzle.config.ts`, `src/schema.ts` (15 tables, 5 enums), `src/index.ts` (Neon client), `src/seed.ts` (idempotent seed using `@ssd/shared/content`), `src/create-admin.ts` (CLI admin creator with scrypt), execute `pnpm db:push` and `pnpm db:seed`. |
| **Phase 3: Frontend Foundation** | `apps/web` | Nuxt 4 scaffold, `nuxt.config.ts` (Tailwind v4 `@tailwindcss/vite`, Pinia, Fonts, VueUse, AuthUtils), `main.css` (tokens, fonts, grain SVG), SVG logos, default & admin layouts. |
| **Phase 4: Landing Page Components** | `apps/web` | `HeroPortal.vue` (S-Curve Morph + knockout typography + ledge), `SiteNavigation.vue` (color-mix sticky), `ProblemList.vue`, `EcosystemSelector.vue` (sticky portal + 01–12 keyboard nav), `FlowTimeline.vue` (Pass Operasional ticket + 9 steps), `SpotlightTabs.vue`, `ModuleGrid.vue`, `RoleLadder.vue`, `UnitDiagram.vue`, `TrustPillars.vue`, `HonestTable.vue`, `ParentBrandStrip.vue`, `FaqAccordion.vue`, `ClosingCta.vue`, `DemoForm.vue`. |
| **Phase 5: Nitro Backend & Admin-Lite** | `apps/web` | Endpoints `GET /api/content`, `POST /api/leads` (honeypot + rate limit + phone normalization), `POST /api/track`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET/PATCH /api/admin/leads`, `GET /api/admin/leads.csv`. Admin pages at `/admin/login` and `/admin/leads`. |
| **Phase 6: Verification & QA** | All | Execute `pnpm guardrail`, `pnpm typecheck`, `pnpm build`, curl SSR HTML verification, test viewport responsiveness (320px–1440px). |

---

## 5. Verification Method

To independently verify the current workspace state and all findings reported above, execute:

1. **Verify Tooling Versions**:
   ```powershell
   node -v
   pnpm -v
   git status
   ```
   *Expected Output*: Node `v24.21.0`, pnpm `12.9.1`, branch `master` with no commits.

2. **Verify Guardrail Scan**:
   ```powershell
   pnpm guardrail
   ```
   *Expected Output*: `✔ Guardrail scan PASSED: Codebase is clean of credentials, competitors, and internal leaks.`

3. **Verify Workspace Absence (Confirm Greenfield)**:
   ```powershell
   Test-Path apps/web
   Test-Path packages/shared
   Test-Path packages/db
   ```
   *Expected Output*: `False`, `False`, `False`.

4. **Verify Database Host Reachability**:
   ```powershell
   Resolve-DnsName ep-morning-hill-aoccv6x9.c-2.ap-southeast-1.aws.neon.tech
   ```
   *Expected Output*: Resolves to IP (e.g. `3.0.167.45`).

# SPECIFICATION MINING HANDOFF REPORT — BACKEND, DATABASE, MONOREPO & SECURITY

**Agent**: `spec_miner_2` (Specification Miner)  
**Date**: 2026-10-24T18:45:00Z  
**Recipient**: Orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Scope**: Monorepo Workspaces, Database Schema (15 Tables, 5 Enums), Neon Connection, Seed Script, Nitro API Endpoints, Rate Limiting, Analytics, Admin-Lite SPA, and Security Guardrails.

---

## 1. Observation

Direct observations from authoritative project sources:

1. **Monorepo & Package Architecture**:
   - `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` lines 651–715 & `pnpm-workspace.yaml`:
     Specifies pnpm workspace packages: `apps/*` (specifically `apps/web`) and `packages/*` (`packages/shared`, `packages/db`).
   - Root `package.json` defines scripts:
     `dev`, `build`, `preview`, `typecheck`, `guardrail`, `db:generate`, `db:migrate`, `db:push`, `db:seed`, `db:create-admin`.
   - `packages/shared`: exports Zod schemas (`schemas.ts`), types (`types.ts`), phone normalizer (`phone.ts`), and static content fallbacks (`content/index.ts`).
   - `packages/db`: exports Drizzle client (`index.ts`) and schema (`schema.ts`), using Neon HTTP driver (`@neondatabase/serverless` + `drizzle-orm/neon-http`).
   - `apps/web`: Nuxt 4 (directory structure `app/`), Tailwind CSS v4, Pinia, Nitro, `nuxt-auth-utils`.

2. **Drizzle ORM Database Schema (15 Tables, 5 Enums)**:
   - `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` lines 324–560:
     - **5 Enums**:
       - `app_status`: `['available', 'partial', 'development']`
       - `feature_status`: `['available', 'roadmap']`
       - `lead_status`: `['new', 'contacted', 'demo_scheduled', 'won', 'lost', 'spam']`
       - `org_type`: `['sekolah', 'yayasan', 'tpq', 'pondok', 'lainnya']`
       - `admin_role`: `['owner', 'editor', 'sales']`
     - **15 Tables**:
       - `admin_users`: id (uuid PK), email (unique), name, passwordHash, role (admin_role, default 'sales'), isActive (bool, default true), lastLoginAt, createdAt, updatedAt.
       - `site_settings`: key (text PK), value (jsonb), updatedBy (FK admin_users.id), updatedAt.
       - `media`: id (uuid PK), filename, url, storageProvider (default 'vercel-blob'), mimeType, fileSize, width, height, altText, caption, uploadedBy (FK admin_users.id), createdAt.
       - `apps`: id (uuid PK), slug (unique), number (int 1–12), name, mascotName, tagline, description, audience, platformLabel, platforms (text[]), status (app_status), statusNote, iconName, previewMediaId (FK media.id), previewType ('phone'|'desktop'|'tv'|'kiosk'), isFeatured (bool), isPublished (bool, default true), orderIndex, archived (bool, default false), createdAt, updatedAt. Index on `orderIndex`.
       - `app_features`: id (uuid PK), appId (FK apps.id, cascade), title, description, iconName, status (feature_status, default 'available'), orderIndex, createdAt, updatedAt. Index on `appId`.
       - `module_groups`: id (uuid PK), slug (unique), title, description, iconName, orderIndex, archived, createdAt, updatedAt.
       - `module_items`: id (uuid PK), groupId (FK module_groups.id, cascade), title, orderIndex. Index on `groupId`.
       - `role_levels`: id (uuid PK), levelLabel ("0", "1", "2–3", "4", "5", "6", "7", "9"), sortKey (int), name, description.
       - `pain_points`: id (uuid PK), number (int), title, description, solvedByAppSlugs (text[]), orderIndex.
       - `flow_steps`: id (uuid PK), stepNo (int, unique 1–9), title, description, actor, appId (FK apps.id, set null), status (feature_status), fallbackNote.
       - `comparison_rows`: id (uuid PK), topic, typicalSolution, ssdSolution, orderIndex.
       - `faqs`: id (uuid PK), question, answer, category (default 'umum'), orderIndex, isPublished (default true), archived, createdAt, updatedAt.
       - `testimonials`: id (uuid PK), name, roleTitle, organization, content, photoMediaId (FK media.id), isVerified (bool, default false), consentAt (timestamp, required before publish), isPublished (bool, default false), orderIndex, archived, createdAt, updatedAt.
       - `leads`: id (uuid PK), name, roleTitle, organization, orgType (org_type), studentCountRange, unitCount, whatsapp (normalized to 62...), email, interests (text[]), message, preferredDemoAt, status (lead_status, default 'new'), source (default 'landing'), utm (jsonb), ipHash, userAgent, consent (bool), consentAt, notes, assignedTo (FK admin_users.id), archived, createdAt, updatedAt. Indexes on `(status, createdAt)` and `(ipHash, createdAt)`.
       - `analytics_events`: id (bigserial PK), eventName, pagePath, sectionId, props (jsonb), sessionId, referrer, utm (jsonb), device ('mobile'|'desktop'), browser, createdAt. Index on `(eventName, createdAt)`.

3. **Neon Postgres Driver & Pooling Rules**:
   - `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` lines 288 & 565–587:
     - Runtime connection: `DATABASE_URL` / `NUXT_DATABASE_URL` pointing to Neon pooled endpoint (`-pooler`).
     - DDL/Migration/Seed connection: `DATABASE_URL_UNPOOLED` pointing to direct unpooled endpoint.
     - HTTP driver (`drizzle-orm/neon-http`) does NOT support interactive transactions; atomic operations must use `db.batch([...])`.

4. **Seed Script & Fallback Content Architecture**:
   - `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` lines 607–636:
     - `packages/shared/src/content/index.ts` exports `fallbackContent` conforming exactly to the API response structure.
     - `packages/db/src/seed.ts` imports from `@ssd/shared/content` and runs idempotent upserts (`onConflictDoUpdate` on `slug`, `stepNo`, `key`).
     - Features are refreshed per app during seed to guarantee consistency.
     - No credentials, test accounts, or student data in seed.
   - Admin creation CLI script (`packages/db/src/create-admin.ts`):
     - Uses secure hashing (`scrypt` / `hashPassword`), prompts interactively or takes env parameters to insert initial `admin_users` record without committing credentials to Git.

5. **Nitro API Endpoints**:
   - `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` lines 1063–1284:
     - `GET /api/content`: SWR cached (`maxAge: 300`, `swr: true`). Queries apps, module groups, role levels, pain points, flow steps, comparisons, FAQs, settings. In `catch` block or if apps empty, returns `fallbackContent` from `@ssd/shared`.
     - `POST /api/leads`:
       - Zod validation (`leadInputSchema`).
       - Honeypot: if `website` field is populated, returns HTTP 202 Accepted without database insertion.
       - Rate limiting: hashes client IP via `createHash('sha256').update(ip + ipHashSalt).digest('hex')`. Rejects with HTTP 429 if count >= 3 submissions in the last 10 minutes.
       - Phone normalization: `normalizeWa` converts `08...` and `+628...` to `628...`.
       - Asynchronous webhook dispatch via `event.waitUntil(notifyNewLead(...).catch(() => {}))` to `NUXT_NOTIFY_WEBHOOK_URL`.
       - Returns HTTP 201 `{ ok: true, id: row.id }`.
     - `POST /api/track`:
       - Zod validation (`trackSchema`).
       - Asynchronously logs to `analytics_events` via `event.waitUntil`.
       - Returns HTTP 204 No Content.
     - `POST /api/auth/login`:
       - Zod validation for email/password.
       - Looks up `admin_users` by lowercase email, verifies `isActive` and `verifyPassword`.
       - Uses constant error response for invalid email or password to prevent account enumeration.
       - Establishes sealed session via `setUserSession(event, { user: { adminId, role, name } })`.
       - Returns HTTP 200 `{ ok: true }`.
     - `POST /api/auth/logout`:
       - Clears session via `clearUserSession(event)`.
       - Returns HTTP 200 `{ ok: true }`.
     - `GET /api/admin/leads`:
       - Authenticated via `requireAdmin(event)` (checks `user.adminId`).
       - Supports pagination, status filtering, and search keyword query.
     - `GET /api/admin/leads/[id]` & `PATCH /api/admin/leads/[id]`:
       - Detail view and status/notes/assignedTo update.
     - `GET /api/admin/leads.csv`:
       - Exports CSV with `Content-Disposition: attachment; filename="leads-[date].csv"`.
       - **Formula injection escaping**: All text fields starting with `=`, `+`, `-`, `@`, `\t`, `\r` must be prepended with a single quote `'` and wrapped in quotes with internal double quotes escaped as `""`.

6. **Admin-Lite SPA Specifications**:
   - `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` lines 784, 1285–1291:
     - `routeRules`: `'/admin/**': { ssr: false, robots: false }`
     - Client route middleware `app/middleware/admin.ts` checks `useUserSession()` and redirects unauthenticated users to `/admin/login`.
     - Admin layout `layouts/admin.vue`.

7. **Security Guardrails (`scripts/guardrail-check.mjs`)**:
   - `scripts/guardrail-check.mjs` lines 4–25:
     - Test credentials & test phone numbers: `guru123`, `walimurid123`, `bk123`, `cc123`, `bkdemo`, `cctv1`, `62811110\d{3}`, `62813001\d{3}`.
     - Direct competitor names: `MySCH`, `Smarteschool`, `Smart School Project`, `Sekolah Smart`, `Google Classroom`, `Dapodik`.
     - Internal platforms: `Super Admin Platform`, `Admin Keuangan Platform`, `Master Admin IT`.
     - Development domain: `scsd.my.id`.
     - Unverified claims: `98% klien puas`, `aggregateRating`.
   - Security headers middleware (`server/middleware/security-headers.ts`):
     - `X-Content-Type-Options: nosniff`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `X-Frame-Options: DENY`
     - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
     - `Content-Security-Policy: default-src 'self'; ...`

---

## 2. Logic Chain

1. **Step 1: Monorepo Separation of Concerns**:
   - The system is organized into `apps/web`, `packages/shared`, and `packages/db`.
   - Placing schemas, types, and fallback content in `packages/shared` enables both `apps/web` (Nitro API + Nuxt SSR) and `packages/db` (seed script) to consume the same authoritative data models without circular dependencies or runtime database dependencies.

2. **Step 2: Database Layer & Driver Compatibility**:
   - Using PostgreSQL on Neon with Drizzle ORM provides serverless autoscaling.
   - Because Neon uses an HTTP driver (`@neondatabase/serverless`), long-lived stateful transactions are unavailable. The logic requires `db.batch([...])` for multi-statement atomic operations and separate unpooled connection strings (`DATABASE_URL_UNPOOLED`) for DDL schema migrations (`drizzle-kit migrate`) and seeding (`tsx src/seed.ts`).
   - The 15 tables provide complete normalized coverage for landing content, media metadata, CRM leads, and first-party analytics, while 5 PostgreSQL enums ensure strict domain integrity.

3. **Step 3: High-Availability Content Delivery (SWR + Fallback)**:
   - Public traffic querying `GET /api/content` uses Nitro's SWR cache (300s TTL).
   - If the Neon database encounters cold start, network latency, or total outage, the endpoint catches the error and serves `@ssd/shared`'s `fallbackContent`. This guarantees that Nuxt SSR will never fail or return a 500 error to public visitors or search crawlers.

4. **Step 4: Lead Security, Anti-Spam & Formula Injection Defense**:
   - Lead intake (`POST /api/leads`) is protected by three complementary defenses:
     1. Honeypot (`website` parameter): Bots filling hidden fields receive a 202 Accepted status without database writes or notification triggers.
     2. Hashed-IP rate limiter: Prevents brute-force or flooding attacks by allowing maximum 3 submissions per 10 minutes per IP hash. Raw IPs are never stored; hashing uses SHA-256 + secret salt (`NUXT_IP_HASH_SALT`).
     3. Phone normalizer: Standardizes WhatsApp input into international format `628...` for CRM operations.
   - For lead exports (`GET /api/admin/leads.csv`), escaping leading characters (`=`, `+`, `-`, `@`, `\t`, `\r`) with single quotes ensures that admin staff opening the CSV in Microsoft Excel or Google Sheets cannot be targeted with Remote Command Execution (RCE) via spreadsheet formula injection.

5. **Step 5: Admin Session Management & SPA Isolation**:
   - Nuxt route rules enforce `{ ssr: false, robots: false }` on `/admin/**`. This guarantees admin pages run as an isolated SPA without server-side memory leaks or indexing by search engines.
   - Authentication relies on `nuxt-auth-utils` sealed cookies with scrypt password verification. Admin creation is strictly isolated to a command-line script (`pnpm db:create-admin`) so no default passwords exist in the codebase.

---

## 3. Caveats

1. **Object Storage Provider for Media**:
   - The schema default for `media.storage_provider` is `'vercel-blob'`. If Cloudflare R2 or S3 is selected in later phases, the upload handlers must adapt accordingly; however, MVP landing uses local SVG and pre-seeded asset URLs.
2. **Turnstile Integration**:
   - Cloudflare Turnstile token validation is prepared in `leadInputSchema` (`turnstileToken`) and runtime config (`NUXT_TURNSTILE_SECRET`), but remains optional in MVP behind standard honeypot and rate limiting.
3. **Webhook Notifications**:
   - Webhook notifications (`NUXT_NOTIFY_WEBHOOK_URL`) run in `event.waitUntil()`. If the external webhook endpoint is slow or unreachable, errors are silently caught to prevent degrading the user lead submission response.

---

## 4. Conclusion

The backend and database specifications provide a production-grade, highly resilient architecture. The Drizzle ORM schema completely captures all 12 apps, 9-step timeline, 12 Back Office module groups, 8 role levels, 7 pain points, and lead intake data structures with 0 credentials and zero competitor leaks. The Nitro API endpoints implement robust rate limiting, anti-spam honeypot, first-party privacy-preserving analytics, secure scrypt authentication, and formula injection-safe CSV exports.

---

## 5. Verification Method

To verify the specifications during implementation:

1. **Guardrail Scan**:
   ```powershell
   pnpm guardrail
   ```
   Must execute `node scripts/guardrail-check.mjs` and pass with 0 violations.
2. **Typecheck Workspaces**:
   ```powershell
   pnpm typecheck
   ```
   Must pass across `apps/web`, `packages/shared`, and `packages/db`.
3. **Database Migration & Seed**:
   ```powershell
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```
   Must generate Drizzle migrations, apply to Neon Postgres, and seed 12 apps, 9 flow steps, 12 module groups, 8 role levels, 7 pain points, FAQs, and site settings idempotently.
4. **Resilient SSR Fallback**:
   Disconnect or provide an invalid `DATABASE_URL`, then test:
   ```powershell
   curl -I http://localhost:3000/api/content
   curl http://localhost:3000/
   ```
   Must return 200 OK with full content rendered without crashing.
5. **Lead Form Endpoints**:
   - Valid submit: POST `/api/leads` returns 201 Created.
   - Invalid submit: POST `/api/leads` returns 400 Bad Request.
   - Honeypot: POST `/api/leads` with `website="spam.com"` returns 202 Accepted without database insertion.
   - Rate limiting: 4 consecutive submissions from same IP in 10 minutes returns 429 Too Many Requests.
6. **CSV Export Injection Check**:
   Export leads containing `=cmd|' /C calc'!A0` and verify the output cell in CSV begins with `'=cmd|'`.

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Monorepo | pnpm Workspaces | Multi-package workspace organizing `apps/web`, `packages/shared`, and `packages/db` | `pnpm-workspace.yaml`, root `package.json` | Linked workspace packages | Missing workspace error on install | `docs/03` §C1, `pnpm-workspace.yaml` |
| 2 | Monorepo | Shared Schemas & Types (`@ssd/shared`) | Zod validation schemas and TypeScript interfaces shared between frontend, backend, and seed | Input payloads | Validated objects, TS types | Zod validation error array | `docs/03` §D2, `packages/shared` |
| 3 | Monorepo | Static Seed Fallback (`fallbackContent`) | Static mirror of database content compiled into TypeScript constants for offline/cold fallback | None | `LandingContent` JSON | None (pure TS object) | `docs/03` §B6, §D5, PRD §8 FR-14 |
| 4 | Database | Drizzle PostgreSQL Enums (5 enums) | Domain enumerations: `app_status`, `feature_status`, `lead_status`, `org_type`, `admin_role` | Allowed string literals | Postgres Enum types | Constraint violation if invalid | `docs/03` §B4 lines 333–338 |
| 5 | Database | Core 15 Tables Schema | 15 relational tables: `admin_users`, `site_settings`, `media`, `apps`, `app_features`, `module_groups`, `module_items`, `role_levels`, `pain_points`, `flow_steps`, `comparison_rows`, `faqs`, `testimonials`, `leads`, `analytics_events` | Drizzle table definitions | Postgres DDL tables & indexes | Drizzle migration errors | `docs/03` §B3–B4 |
| 6 | Database | Neon Connection & Pooling | Dual connection string architecture: pooled for Nitro runtime (`DATABASE_URL`), unpooled for DDL/seed (`DATABASE_URL_UNPOOLED`) | Connection string URLs | Neon HTTP client instance | Connection timeout / auth error | `docs/03` §B1, §B5, `.env.example` |
| 7 | Database | Idempotent Seed Script | Seeds all 12 apps, features, modules, roles, pain points, flow steps, and site settings using `onConflictDoUpdate` | `@ssd/shared/content` data | Seeded DB records | Script failure with error trace | `docs/03` §B6, `packages/db/src/seed.ts` |
| 8 | Database | Admin Scrypt CLI Tool | Interactive CLI command `pnpm db:create-admin` to securely hash password and create admin without Git leaks | Terminal prompt: email, password, name, role | Created `admin_users` record | Duplicate email error / invalid input | `docs/03` §D7 line 1283 |
| 9 | Nitro API | `GET /api/content` | SWR-cached endpoint serving landing page payload with automatic fallback to `@ssd/shared` on DB failure | HTTP GET | `LandingContent` JSON (200 OK) | Serves fallback content instead of 500 | `docs/03` §D5, PRD §8 FR-14 |
| 10 | Nitro API | `POST /api/leads` | Lead intake endpoint with Zod validation, honeypot, rate limiting, and async webhook | Lead JSON body | `{ ok: true, id: UUID }` (201 Created) | 400 Bad Request, 202 Accepted (honeypot), 429 Too Many Requests | `docs/03` §D4, PRD §8 FR-10 |
| 11 | Nitro API | Anti-Spam Honeypot | Silent bot trap checking `website` field; accepts submission without DB insert | Body with `website` filled | HTTP 202 Accepted | None (silent drop) | `docs/03` §D4 line 1164 |
| 12 | Nitro API | Salted IP Rate Limiter | Enforces maximum 3 leads per 10 minutes per SHA-256 hashed IP + salt | Client IP, `NUXT_IP_HASH_SALT` | Allows or rejects request | 429 Too Many Requests | `docs/03` §D4 line 1170 |
| 13 | Nitro API | Phone Normalizer (`normalizeWa`) | Converts Indonesian phone formats (`08...`, `+628...`) to standard `628...` | Raw phone string | Normalized `628...` string | Regex validation error in Zod | `docs/03` §D2 line 1116 |
| 14 | Nitro API | Async Lead Webhook | Fires lead notification webhook asynchronously using `event.waitUntil` | Lead summary data | Webhook POST dispatch | Silently caught on error | `docs/03` §D4 line 1196 |
| 15 | Nitro API | `POST /api/track` | First-party analytics logger recording standard events without storing raw IP | Track event JSON | HTTP 204 No Content | Bad request if eventName invalid | `docs/03` §D6, PRD §11 |
| 16 | Nitro API | `POST /api/auth/login` | Admin login setting sealed session cookie via `nuxt-auth-utils` with timing-safe error response | `{ email, password }` | `{ ok: true }` (200 OK) | 401 Unauthorized ("Email atau kata sandi salah") | `docs/03` §D7 lines 1264–1282 |
| 17 | Nitro API | `POST /api/auth/logout` | Admin logout clearing sealed session cookie | None (authenticated session) | `{ ok: true }` (200 OK) | 401 if unauthenticated | `docs/03` §D1 line 1073 |
| 18 | Nitro API | `GET /api/admin/leads` | Authenticated lead list with status filtering, keyword search, and pagination | Query: `status`, `page`, `limit`, `q` | `{ items: Lead[], total, page, pageSize }` | 401 Unauthorized if not admin | `docs/03` §D1 line 1074 |
| 19 | Nitro API | `GET/PATCH /api/admin/leads/[id]` | Authenticated endpoint to view lead details and update status/notes/assignedTo | URL param `id`, PATCH body | Updated lead record | 401 Unauthorized, 404 Not Found | `docs/03` §D1 line 1075 |
| 20 | Nitro API | `GET /api/admin/leads.csv` | Authenticated CSV export with formula injection escaping | HTTP GET with session | Streaming text/csv file | 401 Unauthorized | `docs/03` §D1 line 1076, `prompt_draft.md` |
| 21 | Security | Formula Injection Escaping | Sanitizes CSV cell values starting with `=`, `+`, `-`, `@`, `\t`, `\r` by prepending `'` | Exported string fields | Sanitized CSV text | None | `prompt_draft.md` line 51 |
| 22 | Security | Security Headers Middleware | Sets HTTP response headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, CSP | All incoming HTTP requests | Injected security headers | None | `docs/03` §D8 |
| 23 | Security | Zero-Credentials Guardrail | Automated check preventing test accounts, passwords, competitor trademarks, and internal platform leaks | Codebase files | Console pass / exit 1 | Process exit with error code 1 | `scripts/guardrail-check.mjs` |
| 24 | Admin SPA | `/admin/login` & `/admin/leads` | SPA pages for admin authentication and lead management | Browser interaction | Admin UI screens | Redirects to `/admin/login` on 401 | `docs/03` §C1, §C3 line 784 |
| 25 | Admin SPA | Route Rules & Auth Middleware | Route rule disabling SSR and search indexing (`/admin/**: { ssr: false, robots: false }`) + client middleware | Route navigation | Enforced CSR + auth guard | Navigation cancelled / redirect | `docs/03` §C3 line 784, §D7 line 1285 |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | `GET /api/content` | Database unreachable or Neon cold-start timeout | Catches error immediately and serves complete `fallbackContent` from `@ssd/shared` with HTTP 200 OK without failing SSR hydration. |
| 2 | `GET /api/content` | Database connected but `apps` table is completely empty (unseeded) | Evaluates `if (!apps.length)` and safely returns `fallbackContent` rather than empty landing page. |
| 3 | `POST /api/leads` | Bot submits hidden honeypot field `website: "https://spamsite.com"` | Returns HTTP 202 Accepted immediately; skips database insert and skips webhook notification. |
| 4 | `POST /api/leads` | Legitimate user submits form without `website` field | Validates Zod schema, normalizes phone, inserts record, triggers async webhook, returns HTTP 201 Created. |
| 5 | `POST /api/leads` | User submits 4th lead within 10 minutes from same IP | Rate limiter query matches 3 prior records with same salted SHA-256 IP hash; throws HTTP 429 Too Many Requests ("Terlalu banyak permintaan."). |
| 6 | `POST /api/leads` | Phone submitted as `0812-3456-7890` or `+62 812 3456 7890` | Zod regex validates format; `normalizeWa` removes whitespace/hyphens and normalizes prefix to `6281234567890`. |
| 7 | `POST /api/leads` | Phone submitted with invalid prefix (e.g. `021...` or letters) | Fails Zod regex `waRegex` and returns HTTP 400 with message "Nomor WhatsApp tidak valid, contoh 0812xxxxxxx". |
| 8 | `POST /api/leads` | Consent checkbox unchecked (`consent: false`) | Fails Zod refine check and returns HTTP 400 with message "Persetujuan diperlukan". |
| 9 | `GET /api/admin/leads.csv` | Lead name contains malicious Excel formula `=cmd|' /C calc'!A0` or `+SUM(A1:A10)` | Exporter checks leading character; prepends `'` turning it into `"'=cmd|' /C calc'!A0"`, preventing spreadsheet formula execution. |
| 10 | `GET /api/admin/leads.csv` | Lead message contains double quotes `Catatan "Penting"` | Exporter escapes double quotes as `""` and wraps cell in quotes: `"Catatan ""Penting"""`. |
| 11 | `POST /api/auth/login` | Non-existent admin email submitted | Evaluates user existence, active status, and password in constant logic; throws HTTP 401 with generic message "Email atau kata sandi salah" to prevent email enumeration. |
| 12 | `POST /api/auth/login` | Inactive admin user (`isActive: false`) submits correct password | Blocked by `!admin.isActive`; returns HTTP 401 with generic message "Email atau kata sandi salah". |
| 13 | Admin SPA (`/admin/leads`) | Direct unauthenticated browser navigation to `/admin/leads` | Client route middleware `app/middleware/admin.ts` detects `!loggedIn.value` and redirects immediately to `/admin/login`. |
| 14 | Admin API (`/api/admin/*`) | API request sent without valid sealed session cookie | `requireAdmin(event)` throws HTTP 401 Unauthorized. |
| 15 | `POST /api/track` | Event sent during page unload using `navigator.sendBeacon` | Processed as POST with JSON body blob; responds HTTP 204 without delaying browser page unload. |
| 16 | `POST /api/track` | Unsupported eventName sent (e.g. `user_hack`) | Fails `trackSchema` enum validation; returns HTTP 400 Bad Request. |
| 17 | `pnpm guardrail` | Source code or seed file contains string `guru123` or `scsd.my.id` | Guardrail scanner detects regex match; prints violation details and exits with status 1, blocking CI build. |
| 18 | SSR Render without JS | Client visits `/` with JavaScript disabled in browser | Nuxt SSR produces complete HTML with semantic `<h1>`, 12 app cards, 9 timeline steps, and JSON-LD schema visible in initial response. |
| 19 | Responsive Viewports | Viewport rendered at 320px width | Container padding adjusts to `clamp(1rem, 4vw, 3rem)`; hero aperture falls back to mobile stacked layout; no horizontal scrollbar occurs (`scrollWidth <= innerWidth`). |
| 20 | User prefers reduced motion | System preference set to `prefers-reduced-motion: reduce` | Hero CSS disables scroll-driven morph transitions; apertures render at fixed open state (progress 0.35); animations clamped to 0.01ms. |

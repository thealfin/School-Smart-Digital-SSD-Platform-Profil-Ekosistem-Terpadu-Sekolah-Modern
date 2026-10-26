# HANDOFF REPORT — Milestone 1 Build Verification Procedure & Worker Fix Instructions

**Agent**: `m1_iter2_explorer_3` (teamwork_preview_explorer)  
**Date**: 2026-10-24T19:30:00Z  
**Recipient**: Orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m1_iter2_explorer_3`  
**Scope**: Formulate the exact build verification procedure, certification criteria, and worker fix instructions ensuring `pnpm --filter web build` passes with exit code 0 and fully resolves the forensic auditor's objection without circumvention.

---

## 1. Observation

### Observation 1: Deterministic Reproduction of `pnpm --filter web build` Failure
Direct execution of `pnpm --filter web build` (or root `pnpm build`) reproduces the exact error reported by Forensic Auditor `m1_auditor_1`:
```powershell
$ nuxt build
Building Nuxt for production...
• Loading Nuxt config
• Nuxt 4.6.2 (with Nitro 2.13.5, Vite 8.3.5 and Vue 3.5.44)
• Setting up modules
• Preparing app
• Nitro preset: node-server
• Generating types
• Bundling client (1.67s · 1.81s)
• Bundling server (984ms · 1.02s)
• Building Nitro server
[nitro] i Initializing prerenderer
• Prerendering routes (5.22s · 16.3s)
[nitro] i Prerendering 2 routes
[nitro]   ├─ /privacy-policy (218ms)
  │ └── [404] Page not found: /privacy-policy
[nitro]   ├─ /terms (218ms)
  │ └── [404] Page not found: /terms
[nitro] 
Errors prerendering:
[nitro]   ├─ /privacy-policy (218ms)
  │ └── [404] Page not found: /privacy-policy
[nitro]   ├─ /terms (218ms)
  │ └── [404] Page not found: /terms
[nitro] 

 ERROR  Exiting due to prerender errors.

[ELIFECYCLE] Command failed with exit code 1.
Error: ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL
  × "pnpm recursive run" failed in D:\All Project Website\Web School Smart Digital\apps\web
```
*Result*: Exit code `1`. Client bundling and SSR server bundling both succeeded. The build failed exclusively within Nitro's prerender step because routes `/privacy-policy` and `/terms` returned HTTP 404.

### Observation 2: Codebase Configuration & Missing Page Files
1. In `apps/web/nuxt.config.ts`, lines 77–85:
   ```ts
   routeRules: {
     '/': { isr: 300 },
     '/faq': { isr: 3600 },
     '/privacy-policy': { prerender: true },
     '/terms': { prerender: true },
     '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
     '/api/leads': { cors: false },
   },
   ```
2. Inspection of `apps/web/app/pages/`:
   ```
   apps/web/app/pages/
   └── index.vue
   ```
   Neither `apps/web/app/pages/privacy-policy.vue` nor `apps/web/app/pages/terms.vue` exists in the filesystem.
3. In `apps/web/nuxt.config.ts`, Nitro's default production configuration enforces `nitro: { prerender: { failOnError: true } }`. When Nitro attempts to prerender `/privacy-policy` and `/terms`, Nuxt's file-based router fails to match any page component, serves the Nuxt 404 error page, and halts the build process.

### Observation 3: Baseline Quality Verification Results
All other verification commands execute cleanly on the current repository:
1. `pnpm guardrail` (`node scripts/guardrail-check.mjs`):
   ```
   Running SSD Guardrail Compliance Scan...
   ✔ Guardrail scan PASSED: Codebase is clean of credentials, competitors, and internal leaks.
   ```
   *Result*: Exit code `0` (Zero prohibited strings).
2. `pnpm typecheck` (`pnpm -r typecheck`):
   - `packages/shared`: `tsc --noEmit` -> 0 errors.
   - `packages/db`: `tsc --noEmit` -> 0 errors.
   - `apps/web`: `nuxt prepare` + `vue-tsc --noEmit` -> 0 errors.
   *Result*: Exit code `0`.
3. `node tests/runner.mjs`:
   - Tier 1 (Feature Coverage): 140/140 passed.
   - Tier 2 (Boundary & Corner): 43/43 passed.
   - Tier 3 (Pairwise): 15/15 passed.
   - Tier 4 (Scenarios): 23/23 passed.
   - Total: 221/221 passed (100%).
   *Result*: Exit code `0`.

---

## 2. Logic Chain

### Step 1: Root Cause Analysis
1. In Nuxt 4, specifying `prerender: true` under `routeRules` instructs the Nitro prerender engine to enqueue the designated paths for pre-generation into static `.html` files during `nuxt build` (Observation 1, 2).
2. The Nuxt file-based routing system dynamically populates routes based on the contents of `apps/web/app/pages/`. Because only `index.vue` exists in `apps/web/app/pages/`, requests to `/privacy-policy` and `/terms` yield 404 responses.
3. Nitro's default build contract rejects 404 errors during prerender crawling to prevent broken URLs in production deployments. Therefore, Nitro emits `ERROR Exiting due to prerender errors` and terminates with process exit code 1.

### Step 2: Evaluation of Remediation Approaches (Authentic Fix vs. Circumvention)
We evaluated the two possible remediation avenues:

| Approach | Implementation | Verdict | Rationale |
| :--- | :--- | :--- | :--- |
| **A. Circumvention Strategy** | Delete `{ prerender: true }` from `routeRules` OR add `nitro: { prerender: { failOnError: false } }` | **REJECTED (Circumvention)** | • Leaves `/privacy-policy` and `/terms` as unresolvable 404 URLs at runtime.<br>• Violates `PROJECT.md` code layout (lines 49–50 explicitly specify `privacy-policy.vue` and `terms.vue`).<br>• Circumvents architectural requirements and will fail runtime link audits when footer links (`SiteFooter.vue`) are clicked. |
| **B. Authentic Remediation Strategy** | Implement genuine, accessible, guardrail-compliant page components `apps/web/app/pages/privacy-policy.vue` and `apps/web/app/pages/terms.vue`, while preserving `routeRules: { prerender: true }`. | **APPROVED (Zero Circumvention)** | • Eliminates the 404 root cause at the source.<br>• Generates authentic prerendered static HTML files in `.output/public/`.<br>• Satisfies `PROJECT.md`, `ORIGINAL_REQUEST.md`, and the Forensic Auditor's explicit remediation requirements.<br>• Preserves strict `failOnError` integrity checks in the build pipeline. |

### Step 3: Anti-Circumvention Enforcement
To guarantee that the Worker does not use circumvention tactics:
1. `apps/web/nuxt.config.ts` must maintain:
   ```ts
   '/privacy-policy': { prerender: true },
   '/terms': { prerender: true },
   ```
2. The Worker must NOT configure `failOnError: false` or `ignore: ['/privacy-policy', '/terms']` in Nitro options.
3. The Worker must author authentic, comprehensive page components for both routes using official PT Digital Teknologi Perkasa legal text, adhering to Indonesian UU Perlindungan Data Pribadi (UU PDP No. 27/2022), and complying with all guardrail rules.

---

## 3. Worker Fix Instructions

The Worker must execute the following concrete modifications:

### Fix 1: Create `apps/web/app/pages/privacy-policy.vue`
Create `apps/web/app/pages/privacy-policy.vue` with genuine legal and privacy content:
- **Title**: Kebijakan Privasi — School Smart Digital (SSD)
- **Organization**: PT Digital Teknologi Perkasa
- **Key Sections**:
  1. Komitmen Perlindungan Data Siswa & Satuan Pendidikan (UU PDP No. 27/2022).
  2. Ruang Lingkup Data (Data Pokok Sekolah, Absensi Gerbang, Catatan Konseling BK, Transaksi SPP).
  3. Isolasi & Keamanan Data Konseling BK (Akses berjenjang, catatan BK tertutup dan terlindungi).
  4. Larangan Komersialisasi & Penjualan Data Pihak Ketiga (Zero-sale guarantee).
  5. Retensi Data & Hak Akses Institusi Sekolah.
  6. Kontak Resmi Petugas Pelindung Data (`digitalteknologiperkasa.lampung@gmail.com`, WhatsApp: `6285839845284`).
- **Styling**: Consistent with Tailwind CSS v4 `@theme` (Navy `#12355B`, Wall `#F6F9FC`, Cyan `#00B4D8`, accessible text `#00758F`).
- **Guardrails**: Zero test accounts (`guru123`), zero dev links (`scsd.my.id`), zero competitor mentions, zero fake statistical claims.

### Fix 2: Create `apps/web/app/pages/terms.vue`
Create `apps/web/app/pages/terms.vue` with genuine terms of service:
- **Title**: Syarat dan Ketentuan Layanan — School Smart Digital (SSD)
- **Organization**: PT Digital Teknologi Perkasa
- **Key Sections**:
  1. Ketentuan Umum Lisensi Ekosistem SSD (Sistem Operasi Sekolah Terpadu 12 Aplikasi).
  2. Struktur Akun & Peran Pengguna (Tingkat Akses 0–9: Yayasan hingga Siswa/Alumni).
  3. Tanggung Jawab Kerahasiaan Kredensial Sekolah & Multi-Unit.
  4. SLA Ketersediaan Layanan & Prosedur Pemeliharaan Terjadwal.
  5. Keaslian Data & Tanggung Jawab Pengguna (Pencatatan Keuangan & Penilaian).
  6. Hak Kekayaan Intelektual PT Digital Teknologi Perkasa.
  7. Penyelesaian Sengketa & Hukum yang Berlaku (Republik Indonesia).
- **Styling & Navigation**: Includes breadcrumb or header button returning to `/` and consistent editorial layout.
- **Guardrails**: Clean of forbidden regex patterns.

### Fix 3 (Optional Best-Practice): Create `apps/web/app/pages/faq.vue`
Create `apps/web/app/pages/faq.vue` importing `faqs` from `@ssd/shared/content` to align with `routeRules: { '/faq': { isr: 3600 } }`.

---

## 4. Build Verification Procedure & Certification Criteria

The Worker must execute the following 4-step sequence in exact order and verify each criterion:

```
┌────────────────────────────────────────────────────────┐
│               EXECUTION PIPELINE                       │
│                                                        │
│  [Step 1] pnpm guardrail                               │
│       │                                                │
│       ▼ (exit code 0)                                  │
│  [Step 2] pnpm typecheck                               │
│       │                                                │
│       ▼ (exit code 0)                                  │
│  [Step 3] pnpm --filter web build                      │
│       │                                                │
│       ▼ (exit code 0 + 6 certification criteria met)   │
│  [Step 4] node tests/runner.mjs                        │
│       │                                                │
│       ▼ (exit code 0: 221/221 passed)                  │
│  [READY FOR AUDITOR RE-SUBMISSION]                     │
└────────────────────────────────────────────────────────┘
```

### Exact Command Sequence:

#### Step 1: Guardrail Scan
```powershell
pnpm guardrail
```
- **Execution**: `node scripts/guardrail-check.mjs`
- **Pass Criterion**: Output ends with `✔ Guardrail scan PASSED: Codebase is clean of credentials, competitors, and internal leaks.` with exit code `0`.

#### Step 2: Workspace Typecheck
```powershell
pnpm typecheck
```
- **Execution**: `pnpm -r typecheck` (`tsc --noEmit` across shared, db, web)
- **Pass Criterion**: Zero TypeScript compiler errors across all workspace packages with exit code `0`.

#### Step 3: Production Web Build
```powershell
pnpm --filter web build
```
- **Execution**: Runs `nuxt build` inside `apps/web`.

#### Step 4: Master Test Suite Runner
```powershell
node tests/runner.mjs
```
- **Execution**: Runs all 4 test tiers (Tiers 1–4).
- **Pass Criterion**: Total 221 tests, 221 passed, 0 failed, exit code `0`.

---

### Exact Criteria for Certifying `pnpm --filter web build`

The Worker and Auditor must confirm that `pnpm --filter web build` meets all **6 Certification Criteria**:

1. **Process Exit Code Certification**:
   The process must terminate with exit code `0`:
   ```powershell
   echo $LASTEXITCODE # must output: 0
   ```
2. **Console Output Error Absence**:
   The terminal log must contain:
   - ZERO occurrences of `ERROR  Exiting due to prerender errors.`
   - ZERO occurrences of `[ELIFECYCLE] Command failed with exit code 1.`
   - ZERO occurrences of `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`.
3. **Client & Server Bundling Confirmation**:
   The terminal log must explicitly contain:
   - `√ Client built in <time>ms`
   - `√ Server built in <time>ms`
   - `√ Nitro server built in <time>ms`
4. **Prerender Route Status Table Certification**:
   The Nitro prerendering output table must demonstrate successful HTTP 200 generation for both routes:
   - `[nitro]   ├─ /privacy-policy (<time>ms)` (without `[404] Page not found`)
   - `[nitro]   ├─ /terms (<time>ms)` (without `[404] Page not found`)
   - Section `Errors prerendering:` must NOT appear.
5. **Physical Artifact Existence Verification**:
   The build must have generated the following physical files on disk:
   - `apps/web/.output/server/index.mjs` (non-empty Nitro node server entrypoint)
   - `apps/web/.output/public/privacy-policy/index.html` (prerendered HTML containing valid DOM)
   - `apps/web/.output/public/terms/index.html` (prerendered HTML containing valid DOM)
   - `apps/web/.output/public/favicon.svg` (copied static asset)
   - `apps/web/.output/nitro.json` (valid Nitro metadata manifest)
6. **Zero Circumvention Certification**:
   Verify in `apps/web/nuxt.config.ts` that:
   - `routeRules` still retains `'/privacy-policy': { prerender: true }` and `'/terms': { prerender: true }`.
   - `nitro.prerender.failOnError` is NOT overridden to `false`.

---

## 5. Caveats

1. **Local Neon DB Disconnect**:
   `pnpm --filter web build` does not require active Neon PostgreSQL database credentials. Nitro builds the client and server bundles statically and prerenders static routes without connecting to Neon.
2. **Harmless Volar Plugin Warning**:
   During `pnpm typecheck`, `vue-tsc` outputs `[Vue] Load plugin failed: vue-router/volar/sfc-route-blocks`. This is an upstream cosmetic warning that does not affect type checking; `pnpm typecheck` succeeds with exit code `0`.
3. **Execution Time Expectation**:
   On Windows environments with NTFS filesystem overhead, `pnpm --filter web build` requires approximately 15–30 seconds to complete client bundling, server bundling, and Nitro packaging. Workers must avoid killing commands prematurely or claiming unverified timeouts.

---

## 6. Conclusion

The build verification failure reported by Forensic Auditor `m1_auditor_1` is 100% reproducible and isolated:
- Cause: Missing route components `apps/web/app/pages/privacy-policy.vue` and `terms.vue` while `apps/web/nuxt.config.ts` declares `{ prerender: true }`.
- Remediation: Author genuine, accessible, guardrail-compliant legal pages for both routes, keeping `routeRules` unchanged.
- Certification: Execute the 4-step command pipeline (`pnpm guardrail`, `pnpm typecheck`, `pnpm --filter web build`, `node tests/runner.mjs`) and verify all 6 certification criteria.

This plan provides an airtight, non-circumventing fix that directly resolves the forensic auditor's objection and guarantees that Milestone 1 passes re-audit.

---

## 7. Verification Method

To independently verify this procedure:

1. **Inspect Missing Files**:
   ```powershell
   Test-Path "apps/web/app/pages/privacy-policy.vue" # currently False
   Test-Path "apps/web/app/pages/terms.vue"          # currently False
   ```
2. **Reproduce Failure**:
   ```powershell
   pnpm --filter web build
   # Verify that exit code is 1 and error message specifies prerender 404 on /privacy-policy and /terms
   ```
3. **Post-Fix Independent Audit Command**:
   ```powershell
   pnpm guardrail; if ($LASTEXITCODE -eq 0) { pnpm typecheck }; if ($LASTEXITCODE -eq 0) { pnpm --filter web build }; if ($LASTEXITCODE -eq 0) { node tests/runner.mjs }
   ```
   All four commands must chain successfully with final exit code `0`.

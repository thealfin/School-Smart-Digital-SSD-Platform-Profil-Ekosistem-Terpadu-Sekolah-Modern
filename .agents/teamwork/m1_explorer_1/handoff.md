# TECHNICAL BLUEPRINT & CODE SPECIFICATION — `packages/shared` & `packages/db`

**Author**: `m1_explorer_1` (teamwork_preview_explorer)  
**Date**: 2026-10-24T18:55:00Z  
**Recipient**: Orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Scope**: Milestone 1 Scope - Part A (`packages/shared` and `packages/db`)  

---

## 1. Observation

Direct observations from the codebase, documentation, and tooling:

1. **Monorepo Package Layout & Dependencies**:
   - `pnpm-workspace.yaml`: declares `packages: ['apps/*', 'packages/*']`.
   - Root `package.json`:
     - `"db:generate": "pnpm --filter @ssd/db db:generate"`
     - `"db:migrate": "pnpm --filter @ssd/db db:migrate"`
     - `"db:push": "pnpm --filter @ssd/db db:push"`
     - `"db:seed": "pnpm --filter @ssd/db db:seed"`
     - `"db:create-admin": "pnpm --filter @ssd/db create-admin"`
   - `packages/shared` has package name `@ssd/shared` and zero internal workspace dependencies (only `zod` and `typescript`).
   - `packages/db` has package name `@ssd/db` and depends on `@neondatabase/serverless`, `drizzle-orm`, `dotenv`, `@adonisjs/hash`, and `@ssd/shared: "workspace:*"`.

2. **Drizzle ORM Schema Specifications**:
   - `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` lines 324–560 explicitly defines:
     - 5 Postgres Enums: `app_status`, `feature_status`, `lead_status`, `org_type`, `admin_role`.
     - 15 Relational Tables: `admin_users`, `site_settings`, `media`, `apps`, `app_features`, `module_groups`, `module_items`, `role_levels`, `pain_points`, `flow_steps`, `comparison_rows`, `faqs`, `testimonials`, `leads`, `analytics_events`.
     - Key relations: `appsRelations` (hasMany `appFeatures`, hasOne `media`), `moduleGroupsRelations` (hasMany `moduleItems`), `flowStepsRelations` (hasOne `apps`), `leadsRelations` (hasOne `adminUsers`).

3. **Database Driver & Pooling Architecture**:
   - `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` line 288 & line 565–587:
     - Neon HTTP driver (`@neondatabase/serverless` + `drizzle-orm/neon-http`).
     - Pooled endpoint: `DATABASE_URL` / `NUXT_DATABASE_URL` (`-pooler.c-2.ap-southeast-1.aws.neon.tech`).
     - Direct unpooled endpoint: `DATABASE_URL_UNPOOLED` (`.c-2.ap-southeast-1.aws.neon.tech`) for migrations and seeding.
     - HTTP driver does not support stateful interactive transactions; atomic batching must use `db.batch([...])`.

4. **Authentication & Password Hashing Compatibility**:
   - In `apps/web/server/api/auth/login.post.ts`, authentication uses `verifyPassword(admin.passwordHash, password)` from `nuxt-auth-utils`.
   - Inspection of `nuxt-auth-utils` internals reveals that it uses `@adonisjs/hash` with the `Scrypt` driver (`new Scrypt()`).
   - Therefore, `packages/db/src/create-admin.ts` must use `@adonisjs/hash` with `Scrypt` to produce password hashes that can be verified by `nuxt-auth-utils`.

5. **Guardrail Restrictions (`scripts/guardrail-check.mjs`)**:
   - The scanner checks all files in `packages/`, `apps/`, and `scripts/`.
   - Any occurrence of the following patterns will immediately fail CI:
     1. Test credentials or test phone numbers: `guru123`, `walimurid123`, `bk123`, `cc123`, `bkdemo`, `cctv1`, `62811110\d{3}`, `62813001\d{3}`.
     2. Competitor brands: `MySCH`, `Smarteschool`, `Smart School Project`, `Sekolah Smart`, `Google Classroom`, `Dapodik`.
     3. Internal platforms: `Super Admin Platform`, `Admin Keuangan Platform`, `Master Admin IT`.
     4. Dev domain: `scsd.my.id`.
     5. Fake claims: `98% klien puas`, `aggregateRating`.

6. **Content Sources of Truth (PRD Appendices A–G)**:
   - Appendix A: 12 public applications (01 Back Office, 02 Pegawai, 03 Wali Murid [Womi], 04 Wali Kelas, 05 BK [Biku], 06 Absensi Tap [Tapi], 07 Security Gate [Gati], 08 Command Center [Comi], 09 Mitra Usaha [Miti], 10 PSB, 11 Layanan Terpadu, 12 Pimpinan).
   - Appendix B: 9-step operational timeline ("Ahmad" demo flow).
   - Appendix C: 7 daily operational pain points.
   - Appendix D: 12 Back Office module groups and items.
   - Appendix E: 8 Back Office role levels (0, 1, 2–3, 4, 5, 6, 7, 9).
   - Appendix F: 9 generic comparison topics.
   - Appendix G: 9 FAQ items.

---

## 2. Logic Chain

1. **Monorepo Package Isolation**:
   - `packages/shared` has zero internal workspace dependencies and compiles purely with TypeScript (`tsc --noEmit`).
   - `packages/shared` exports:
     - `schemas.ts` for Zod validation (`leadInputSchema`, `trackSchema`, `authSchema`, `leadUpdateSchema`).
     - `types.ts` for domain interfaces.
     - `phone.ts` for `normalizeWa` utility.
     - `content/index.ts` for complete static fallback content (`fallbackContent`).
   - By structuring `packages/shared` first, both `packages/db` (for idempotent seed data) and `apps/web` (for Nitro API validation and SSR fallbacks) can import `@ssd/shared` seamlessly.

2. **Database Driver Architecture & Schema Resilience**:
   - Drizzle ORM pg-core definitions match PostgreSQL table column types exactly.
   - Neon HTTP driver (`neon(url)` + `drizzle(client, { schema })`) is stateless, ensuring rapid serverless execution on Vercel and Nitro.
   - DDL migrations (`drizzle-kit generate` / `migrate`) and `drizzle-kit push` connect via `DATABASE_URL_UNPOOLED` to bypass connection pooling transaction limitations.

3. **Single Source of Truth for Seed & Fallback**:
   - `packages/shared/src/content/index.ts` provides the authoritative typed datasets.
   - `packages/db/src/seed.ts` imports from `@ssd/shared/content` and performs idempotent upserts:
     - `site_settings`: `onConflictDoUpdate` on `key`.
     - `apps`: `onConflictDoUpdate` on `slug`, refreshing `app_features` per app.
     - `module_groups`: `onConflictDoUpdate` on `slug`, refreshing `module_items`.
     - `flow_steps`: `onConflictDoUpdate` on `stepNo`.
     - `role_levels`, `pain_points`, `comparison_rows`, `faqs`: clean wipe and insert.
   - `GET /api/content` serves from database if available; if unseeded or database is down, it immediately returns `fallbackContent` without throwing 500 errors.

4. **Zero-Credential CLI Admin Creator**:
   - Using `@adonisjs/hash` ensures 100% hash format compatibility (`$scrypt$...`) with `nuxt-auth-utils`.
   - The CLI accepts arguments, environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, etc.), or interactive readline prompts.
   - No default password or demo credentials exist in the source code or seed script.

---

## 3. Caveats

1. **Optional Media Storage Integration**:
   - The Drizzle schema sets `media.storage_provider` default to `'vercel-blob'`. In Milestone 1, all brand logos and illustrations are local SVGs.
2. **Turnstile Captcha Field**:
   - `leadInputSchema` includes `turnstileToken: z.string().optional()`. This allows seamless activation of Cloudflare Turnstile in Milestone 4 without breaking Milestone 1 lead validation.
3. **Array Column Syntax in Drizzle**:
   - Columns `platforms`, `interests`, and `solved_by_app_slugs` use `text('...').array().notNull().default(sql`'{}'::text[]`)`. This ensures Postgres creates native `text[]` columns with empty array defaults.

---

## 4. Conclusion & Exact Code Specifications

Below are the exact code implementations for all required files across `packages/shared` and `packages/db`.

---

### PART A: `packages/shared`

#### File 1: `packages/shared/package.json`
```json
{
  "name": "@ssd/shared",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./schemas": "./src/schemas.ts",
    "./types": "./src/types.ts",
    "./phone": "./src/phone.ts",
    "./content": "./src/content/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "typescript": "^5.8.2"
  }
}
```

#### File 2: `packages/shared/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

#### File 3: `packages/shared/src/phone.ts`
```ts
/**
 * Normalizes Indonesian mobile and WhatsApp numbers into standard international format without '+' prefix: '628...'
 * Handles prefixes: '08...', '+628...', '628...', or numbers with dashes/spaces.
 */
export function normalizeWa(input: string): string {
  const d = input.replace(/\D/g, '')
  if (d.startsWith('62')) return d
  if (d.startsWith('0')) return '62' + d.slice(1)
  return d
}
```

#### File 4: `packages/shared/src/schemas.ts`
```ts
import { z } from 'zod'

export const waRegex = /^(\+?62|0)8[0-9]{7,13}$/

export const leadInputSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
  roleTitle: z.string().trim().max(100).optional().or(z.literal('')),
  organization: z.string().trim().min(2, 'Isi nama sekolah atau yayasan').max(150),
  orgType: z.enum(['sekolah', 'yayasan', 'tpq', 'pondok', 'lainnya'], {
    errorMap: () => ({ message: 'Pilih jenis lembaga yang valid' }),
  }),
  studentCountRange: z.enum(['<100', '100-300', '301-700', '701-1500', '>1500']).optional(),
  unitCount: z.coerce.number().int().min(1, 'Minimal 1 unit').max(50, 'Maksimal 50 unit').optional(),
  whatsapp: z.string().trim().regex(waRegex, 'Nomor WhatsApp tidak valid, contoh: 081234567890'),
  email: z.string().trim().email('Format email tidak valid').max(150).optional().or(z.literal('')),
  interests: z.array(z.string().max(50)).max(12).default([]),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  consent: z.boolean().refine((v) => v === true, {
    message: 'Persetujuan syarat dan ketentuan diperlukan',
  }),
  website: z.string().optional(), // Honeypot field: must be empty
  turnstileToken: z.string().optional(),
  source: z.string().max(60).optional(),
  utm: z.record(z.string(), z.string()).optional(),
})

export type LeadInput = z.infer<typeof leadInputSchema>

export const leadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'demo_scheduled', 'won', 'lost', 'spam']).optional(),
  notes: z.string().max(2000).optional().or(z.literal('')),
  assignedTo: z.string().uuid().nullable().optional(),
})

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>

export const trackSchema = z.object({
  eventName: z.enum([
    'page_view',
    'section_view',
    'app_select',
    'flow_step_view',
    'cta_click',
    'cta_whatsapp',
    'lead_submit',
    'faq_open',
  ]),
  pagePath: z.string().max(200).optional(),
  sectionId: z.string().max(60).optional(),
  props: z.record(z.string(), z.unknown()).optional(),
  sessionId: z.string().max(100).optional(),
  referrer: z.string().max(300).nullish(),
})

export type TrackInput = z.infer<typeof trackSchema>

export const authSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
})

export type AuthInput = z.infer<typeof authSchema>
```

#### File 5: `packages/shared/src/types.ts`
```ts
export type AppStatus = 'available' | 'partial' | 'development'
export type FeatureStatus = 'available' | 'roadmap'
export type LeadStatus = 'new' | 'contacted' | 'demo_scheduled' | 'won' | 'lost' | 'spam'
export type OrgType = 'sekolah' | 'yayasan' | 'tpq' | 'pondok' | 'lainnya'
export type AdminRole = 'owner' | 'editor' | 'sales'
export type PlatformType = 'web' | 'android' | 'pwa' | 'tv' | 'kiosk'
export type PreviewType = 'phone' | 'desktop' | 'tv' | 'kiosk'

export interface AppFeature {
  id?: string
  appId?: string
  title: string
  description?: string | null
  iconName?: string | null
  status: FeatureStatus
  orderIndex: number
}

export interface AppItem {
  id?: string
  slug: string
  number: number
  name: string
  mascotName?: string | null
  tagline: string
  description?: string | null
  audience: string
  platformLabel: string
  platforms: string[]
  status: AppStatus
  statusNote?: string | null
  iconName: string
  previewMediaId?: string | null
  previewType: PreviewType | string
  isFeatured?: boolean
  isPublished?: boolean
  orderIndex: number
  features: AppFeature[]
}

export interface ModuleItem {
  id?: string
  groupId?: string
  title: string
  orderIndex?: number
}

export interface ModuleGroup {
  id?: string
  slug: string
  title: string
  description?: string | null
  iconName: string
  orderIndex: number
  items: ModuleItem[]
}

export interface RoleLevel {
  id?: string
  levelLabel: string
  sortKey: number
  name: string
  description?: string | null
}

export interface PainPoint {
  id?: string
  number: number
  title: string
  description?: string | null
  solvedByAppSlugs: string[]
  orderIndex: number
}

export interface FlowStep {
  id?: string
  stepNo: number
  title: string
  description?: string | null
  actor: string
  appId?: string | null
  appSlug?: string
  status: FeatureStatus
  fallbackNote?: string | null
  app?: Partial<AppItem> | null
}

export interface ComparisonRow {
  id?: string
  topic: string
  typicalSolution: string
  ssdSolution: string
  orderIndex: number
}

export interface FaqItem {
  id?: string
  question: string
  answer: string
  category: string
  orderIndex: number
}

export interface ContactSettings {
  email: string
  whatsapp: string
  address: string
}

export interface SocialSettings {
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
}

export interface CtaSettings {
  primary: string
  whatsappText: string
}

export interface FeatureFlags {
  showTestimonials: boolean
  showTrustStats: boolean
}

export interface CompanySettings {
  name: string
  parentUrl: string
}

export interface SiteSettings {
  contact: ContactSettings
  social: SocialSettings
  cta: CtaSettings
  features: FeatureFlags
  company: CompanySettings
  [key: string]: unknown
}

export interface LandingContent {
  apps: AppItem[]
  moduleGroups: ModuleGroup[]
  roleLevels: RoleLevel[]
  painPoints: PainPoint[]
  flowSteps: FlowStep[]
  comparisonRows: ComparisonRow[]
  faqs: FaqItem[]
  settings: Record<string, unknown>
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  isActive: boolean
  lastLoginAt?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Lead {
  id: string
  name: string
  roleTitle?: string | null
  organization: string
  orgType: OrgType
  studentCountRange?: string | null
  unitCount?: number | null
  whatsapp: string
  email?: string | null
  interests: string[]
  message?: string | null
  preferredDemoAt?: Date | string | null
  status: LeadStatus
  source: string
  utm?: Record<string, unknown> | null
  ipHash?: string | null
  userAgent?: string | null
  consent: boolean
  consentAt: Date | string
  notes?: string | null
  assignedTo?: string | null
  archived: boolean
  createdAt: Date | string
  updatedAt: Date | string
}
```

#### File 6: `packages/shared/src/content/index.ts`
```ts
import type {
  AppItem,
  ModuleGroup,
  RoleLevel,
  PainPoint,
  FlowStep,
  ComparisonRow,
  FaqItem,
  SiteSettings,
  LandingContent,
} from '../types'

export const apps: AppItem[] = [
  {
    slug: 'back-office',
    number: 1,
    name: 'Back Office SSD',
    mascotName: null,
    tagline: 'Otak sekolah di layar kantor',
    description: 'Sistem operasional terpadu kantor sekolah untuk akademik, keuangan, kepegawaian, sarpras, dan audit log.',
    audience: 'Admin yayasan, bendahara, TU, UKS, operator',
    platformLabel: 'Web',
    platforms: ['web'],
    status: 'available',
    statusNote: null,
    iconName: 'dashboard',
    previewType: 'desktop',
    isFeatured: true,
    isPublished: true,
    orderIndex: 1,
    features: [
      { title: 'Akademik: Tahun ajaran, semester, unit, asrama, jadwal & kenaikan kelas', status: 'available', orderIndex: 0 },
      { title: 'Keuangan & Kas: Chart of accounts, buku besar, kas & bank, laba rugi', status: 'available', orderIndex: 1 },
      { title: 'Pembayaran Multi-Kanal: SPP, non-SPP, cicilan, bayar kolektif, VA bank', status: 'available', orderIndex: 2 },
      { title: 'Tabungan Santri & Pegawai: Penarikan massal terverifikasi', status: 'available', orderIndex: 3 },
      { title: 'Presensi & Kepegawaian: Perangkat tap, penggajian, cuti & honor', status: 'available', orderIndex: 4 },
      { title: 'Sarpras & UKS: Inventaris, maintenance, klinik, rekam medis siswa', status: 'available', orderIndex: 5 },
    ],
  },
  {
    slug: 'pegawai',
    number: 2,
    name: 'Pegawai SSD',
    mascotName: null,
    tagline: "HP-nya guru: absen, jurnal, nilai",
    description: 'Aplikasi gawai untuk guru dan staf: presensi datang-pulang, jurnal mengajar, input nilai raport, dan slip honor.',
    audience: 'Guru & staf',
    platformLabel: 'Android / PWA',
    platforms: ['android', 'pwa'],
    status: 'available',
    statusNote: null,
    iconName: 'badge',
    previewType: 'phone',
    isFeatured: false,
    isPublished: true,
    orderIndex: 2,
    features: [
      { title: 'Absensi mobile: Datang-pulang dan absen mengajar per jam pelajaran', status: 'available', orderIndex: 0 },
      { title: 'Jurnal kelas & agenda: Catatan materi ajar dan kehadiran siswa real-time', status: 'available', orderIndex: 1 },
      { title: 'Input nilai raport: Penilaian formatif, sumatif & capaian kompetensi', status: 'available', orderIndex: 2 },
      { title: 'Administrasi siswa: Pencatatan prestasi, poin pelanggaran & rujukan UKS', status: 'available', orderIndex: 3 },
      { title: 'Slip gaji digital & tabungan pegawai transparan', status: 'available', orderIndex: 4 },
    ],
  },
  {
    slug: 'wali-murid',
    number: 3,
    name: 'Wali Murid SSD',
    mascotName: 'Womi',
    tagline: 'Asisten orang tua dalam satu genggaman',
    description: 'Aplikasi orang tua untuk memantau absensi gerbang, tagihan SPP, tabungan santri, raport digital, dan komunikasi sekolah.',
    audience: 'Orang tua',
    platformLabel: 'Android (Play Store)',
    platforms: ['android'],
    status: 'available',
    statusNote: null,
    iconName: 'family_restroom',
    previewType: 'phone',
    isFeatured: true,
    isPublished: true,
    orderIndex: 3,
    features: [
      { title: 'Multi-anak dalam satu akun WhatsApp terdaftar', status: 'available', orderIndex: 0 },
      { title: 'Bayar SPP langsung & top-up saldo uang saku santri', status: 'available', orderIndex: 1 },
      { title: 'Pemantauan kehadiran gerbang & jam absensi real-time', status: 'available', orderIndex: 2 },
      { title: 'Raport digital & catatan capaian wali kelas berkala', status: 'available', orderIndex: 3 },
      { title: 'Ringkasan konseling BK yang diizinkan sekolah (privasi terjaga)', status: 'available', orderIndex: 4 },
      { title: 'QR Jemput Harian (Segera hadir - Fase 4)', status: 'roadmap', orderIndex: 5 },
    ],
  },
  {
    slug: 'wali-kelas',
    number: 4,
    name: 'Wali Kelas SSD',
    mascotName: null,
    tagline: 'Radar kelas untuk menjaga 30–40 anak',
    description: 'Dasbor pemantauan wali kelas untuk mengawal rekapitulasi kehadiran, catatan perkembangan, home visit, dan rujukan BK.',
    audience: 'Wali kelas',
    platformLabel: 'Web / PWA',
    platforms: ['web', 'pwa'],
    status: 'available',
    statusNote: 'Sebagian fitur segera hadir',
    iconName: 'supervisor_account',
    previewType: 'phone',
    isFeatured: false,
    isPublished: true,
    orderIndex: 4,
    features: [
      { title: 'Roster kelas & tren absensi harian 30–40 siswa', status: 'available', orderIndex: 0 },
      { title: 'Radar siswa rentan absensi & peringatan dini intervensi', status: 'available', orderIndex: 1 },
      { title: 'Catatan perkembangan, agenda kelas & kunjungan rumah (home visit)', status: 'available', orderIndex: 2 },
      { title: 'Rujukan langsung ke Guru BK dengan riwayat terintegrasi', status: 'available', orderIndex: 3 },
      { title: 'Rekapitulasi raport & keputusan kenaikan kelas', status: 'available', orderIndex: 4 },
      { title: 'Inbox komunikasi orang tua (Segera hadir)', status: 'roadmap', orderIndex: 5 },
    ],
  },
  {
    slug: 'bk',
    number: 5,
    name: 'BK SSD',
    mascotName: 'Biku',
    tagline: 'Ruang konseling yang rapi',
    description: 'Platform khusus guru bimbingan konseling dengan pemisahan ketat catatan internal dan ringkasan yang dibagikan.',
    audience: 'Guru BK / konselor',
    platformLabel: 'Web / PWA',
    platforms: ['web', 'pwa'],
    status: 'available',
    statusNote: 'Push notifikasi segera hadir',
    iconName: 'psychology',
    previewType: 'phone',
    isFeatured: true,
    isPublished: true,
    orderIndex: 5,
    features: [
      { title: 'Inbox rujukan terstruktur dari wali kelas dan guru piket', status: 'available', orderIndex: 0 },
      { title: 'Konteks siswa otomatis: riwayat absensi 30 hari & poin pelanggaran', status: 'available', orderIndex: 1 },
      { title: 'Pemisahan ketat: catatan internal vs ringkasan untuk orang tua', status: 'available', orderIndex: 2 },
      { title: 'Jadwal sesi mandiri & tindak lanjut konseling terenkripsi', status: 'available', orderIndex: 3 },
      { title: 'Dashboard radar penanganan kasus per jenjang unit', status: 'available', orderIndex: 4 },
      { title: 'Push notifikasi kasus prioritas ke ponsel BK (Segera hadir)', status: 'roadmap', orderIndex: 5 },
    ],
  },
  {
    slug: 'absensi-tap',
    number: 6,
    name: 'Absensi Tap',
    mascotName: 'Tapi',
    tagline: 'Tap kartu QR, hadir tercatat',
    description: 'Aplikasi presensi kilat berbasis pemindaian QR kartu pada kamera gawai atau scanner USB di pos jaga dan aula.',
    audience: 'Petugas presensi di pintu/aula',
    platformLabel: 'HP / tablet',
    platforms: ['android', 'pwa'],
    status: 'partial',
    statusNote: 'Konfirmasi bentuk final APK/Web',
    iconName: 'contactless',
    previewType: 'phone',
    isFeatured: false,
    isPublished: true,
    orderIndex: 6,
    features: [
      { title: 'Scan kartu QR instan via kamera gawai atau scanner USB', status: 'available', orderIndex: 0 },
      { title: 'Mode presensi harian: Jam masuk & pulang sekolah', status: 'available', orderIndex: 1 },
      { title: 'Mode presensi rutin: Shalat berjamaah, apel & kajian', status: 'available', orderIndex: 2 },
      { title: 'Mode temporer: Seminar, perkemahan & kegiatan insidental', status: 'available', orderIndex: 3 },
      { title: 'Sinkronisasi otomatis ke dashboard Back Office & notifikasi wali', status: 'available', orderIndex: 4 },
    ],
  },
  {
    slug: 'security-gate',
    number: 7,
    name: 'Security Gate',
    mascotName: 'Gati',
    tagline: 'Gerbang yang tahu siapa boleh keluar',
    description: 'Sistem gerbang cerdas untuk satpam memvalidasi izin keluar santri dan mencatat jam serah terima penjemputan.',
    audience: 'Satpam / piket gerbang',
    platformLabel: 'Android',
    platforms: ['android'],
    status: 'partial',
    statusNote: 'QR jemput harian tahap 4',
    iconName: 'security',
    previewType: 'phone',
    isFeatured: true,
    isPublished: true,
    orderIndex: 7,
    features: [
      { title: 'Verifikasi izin keluar santri/siswa lewat tap kartu QR', status: 'available', orderIndex: 0 },
      { title: 'Deteksi otomatis izin aktif (izin sementara vs izin pulang)', status: 'available', orderIndex: 1 },
      { title: 'Daftar pemantauan real-time: siapa siswa yang masih di luar', status: 'available', orderIndex: 2 },
      { title: 'Log keluar-masuk gerbang tercatat per tanggal dan jam presisi', status: 'available', orderIndex: 3 },
      { title: 'Notifikasi otomatis terkirim ke ponsel wali murid saat tap gerbang', status: 'available', orderIndex: 4 },
      { title: 'Verifikasi QR jemput harian orang tua / ojek (Segera hadir - Fase 4)', status: 'roadmap', orderIndex: 5 },
    ],
  },
  {
    slug: 'command-center',
    number: 8,
    name: 'Command Center',
    mascotName: 'Comi',
    tagline: 'TV yang tidak perlu diklik',
    description: 'Papan TV digital ruang guru dan lobi pimpinan yang berputar otomatis menampilkan denyut operasional tanpa perlu dioperasikan.',
    audience: 'TV ruang guru / piket / pimpinan',
    platformLabel: 'TV monitoring',
    platforms: ['tv'],
    status: 'available',
    statusNote: null,
    iconName: 'tv',
    previewType: 'tv',
    isFeatured: false,
    isPublished: true,
    orderIndex: 8,
    features: [
      { title: 'Papan monitoring TV berganti otomatis tanpa perlu interaksi klik', status: 'available', orderIndex: 0 },
      { title: 'Daftar siswa izin luar, sakit di UKS, dan absensi guru piket', status: 'available', orderIndex: 1 },
      { title: 'Tipografi kontras tinggi terbaca jelas dari jarak 3–5 meter', status: 'available', orderIndex: 2 },
      { title: 'Perlindungan privasi absolut: diagnosa UKS & isi BK disembunyikan', status: 'available', orderIndex: 3 },
      { title: 'Akun display mandiri aman tanpa akses menu administratif', status: 'available', orderIndex: 4 },
    ],
  },
  {
    slug: 'mitra-usaha',
    number: 9,
    name: 'Mitra Usaha',
    mascotName: 'Miti',
    tagline: 'Kasir kantin tanpa uang tunai',
    description: 'Aplikasi kasir e-kantin dan koperasi sekolah berbasis tap kartu santri dan verifikasi PIN tanpa sirkulasi uang tunai.',
    audience: 'Kantin, koperasi, laundry, toko',
    platformLabel: 'Android',
    platforms: ['android'],
    status: 'available',
    statusNote: null,
    iconName: 'point_of_sale',
    previewType: 'phone',
    isFeatured: false,
    isPublished: true,
    orderIndex: 9,
    features: [
      { title: 'Transaksi non-tunai via tap kartu siswa dan verifikasi PIN', status: 'available', orderIndex: 0 },
      { title: 'Pengecekan saldo uang saku seketika langsung dari sistem satu data', status: 'available', orderIndex: 1 },
      { title: 'Geo-fencing radius area sekolah & pembatasan jam operasional', status: 'available', orderIndex: 2 },
      { title: 'Rekonsiliasi transaksi harian & pengajuan pencairan ke bendahara', status: 'available', orderIndex: 3 },
      { title: 'Tombol penangguhan (suspend) instan dari Back Office untuk keamanan', status: 'available', orderIndex: 4 },
    ],
  },
  {
    slug: 'psb',
    number: 10,
    name: 'PSB / PPDB',
    mascotName: null,
    tagline: 'Gerbang siswa baru',
    description: 'Portal penerimaan santri dan siswa baru online dengan formulir digital, pembayaran biaya seleksi, dan validasi berkas.',
    audience: 'Calon siswa & panitia',
    platformLabel: 'Web',
    platforms: ['web'],
    status: 'development',
    statusNote: 'Dalam pengembangan',
    iconName: 'app_registration',
    previewType: 'desktop',
    isFeatured: false,
    isPublished: true,
    orderIndex: 10,
    features: [
      { title: 'Formulir pendaftaran santri/siswa baru terintegrasi online', status: 'available', orderIndex: 0 },
      { title: 'Pembayaran biaya formulir via transfer bank & Virtual Account', status: 'available', orderIndex: 1 },
      { title: 'Verifikasi berkas persyaratan oleh panitia penerimaan', status: 'available', orderIndex: 2 },
      { title: 'Konversi satu klik dari calon siswa menjadi data siswa aktif di Back Office', status: 'available', orderIndex: 3 },
    ],
  },
  {
    slug: 'layanan-terpadu',
    number: 11,
    name: 'Layanan Terpadu',
    mascotName: null,
    tagline: "ATM-nya siswa",
    description: 'Anjungan mandiri siswa untuk mengecek saldo tabungan, mutasi uang saku, dan rekapitulasi kehadiran mandiri.',
    audience: 'Siswa (kios)',
    platformLabel: 'Web kiosk',
    platforms: ['kiosk'],
    status: 'development',
    statusNote: 'Dalam pengembangan',
    iconName: 'desktop_windows',
    previewType: 'kiosk',
    isFeatured: false,
    isPublished: true,
    orderIndex: 11,
    features: [
      { title: 'Kios mandiri siswa dengan otentikasi kartu QR & PIN pribadi', status: 'available', orderIndex: 0 },
      { title: 'Cek saldo tabungan & riwayat transaksi uang saku siswa', status: 'available', orderIndex: 1 },
      { title: 'Pengecekan rekap presensi mandiri dan agenda sekolah', status: 'available', orderIndex: 2 },
    ],
  },
  {
    slug: 'pimpinan',
    number: 12,
    name: 'Pimpinan',
    mascotName: null,
    tagline: 'Ringkasan 3 menit, bukan 3 jam',
    description: 'Papan ringkasan eksekutif pimpinan yayasan untuk memantau performa keuangan, absensi santri, dan statistik multi-unit.',
    audience: 'Kepala sekolah / petinggi yayasan',
    platformLabel: 'Web dashboard',
    platforms: ['web'],
    status: 'development',
    statusNote: 'Dalam pengembangan',
    iconName: 'monitoring',
    previewType: 'desktop',
    isFeatured: false,
    isPublished: true,
    orderIndex: 12,
    features: [
      { title: 'Dashboard eksekutif ringkasan keuangan, realisasi SPP & kas yayasan', status: 'available', orderIndex: 0 },
      { title: 'Indikator kehadiran harian seluruh unit (guru, staf, siswa)', status: 'available', orderIndex: 1 },
      { title: 'Tren demografi siswa & laporan konsolidasi multi-unit dalam hitungan menit', status: 'available', orderIndex: 2 },
    ],
  },
]

export const flowSteps: FlowStep[] = [
  {
    stepNo: 1,
    title: 'Pencatatan Izin Pulang',
    description: 'Petugas TU atau guru piket mencatat izin pulang siswa (Ahmad) pada sistem.',
    actor: 'Admin/TU atau Guru Piket',
    appSlug: 'back-office',
    status: 'available',
    fallbackNote: null,
    app: { slug: 'back-office', name: 'Back Office SSD', iconName: 'dashboard' },
  },
  {
    stepNo: 2,
    title: 'Tayang di Command Center',
    description: 'Papan TV monitoring otomatis menampilkan nama Ahmad dalam daftar siswa yang mengantongi izin keluar.',
    actor: 'Sistem Otomatis',
    appSlug: 'command-center',
    status: 'available',
    fallbackNote: null,
    app: { slug: 'command-center', name: 'Command Center', iconName: 'tv' },
  },
  {
    stepNo: 3,
    title: 'Verifikasi Kartu di Gerbang',
    description: 'Satpam memindai kartu Ahmad di pos gerbang; sistem memvalidasi izin aktif dan mengizinkan Ahmad keluar.',
    actor: 'Satpam',
    appSlug: 'security-gate',
    status: 'available',
    fallbackNote: null,
    app: { slug: 'security-gate', name: 'Security Gate', iconName: 'security' },
  },
  {
    stepNo: 4,
    title: 'Penerbitan QR Jemput',
    description: 'Orang tua membuka aplikasi Wali Murid dan memperoleh kode QR jemput khusus hari ini yang dapat dibagikan ke penjemput.',
    actor: 'Orang Tua',
    appSlug: 'wali-murid',
    status: 'roadmap',
    fallbackNote: 'Dapat menggunakan verifikasi identitas fisik langsung sebelum QR rilis',
    app: { slug: 'wali-murid', name: 'Wali Murid SSD', iconName: 'family_restroom' },
  },
  {
    stepNo: 5,
    title: 'Pemindaian Penjemput',
    description: 'Satpam memindai QR penjemput di gerbang; jam penyerahan santri tercatat rapi dan akurat.',
    actor: 'Satpam',
    appSlug: 'security-gate',
    status: 'roadmap',
    fallbackNote: 'Verifikasi serah terima fisik dicatat manual oleh petugas gerbang',
    app: { slug: 'security-gate', name: 'Security Gate', iconName: 'security' },
  },
  {
    stepNo: 6,
    title: 'Notifikasi ke Orang Tua',
    description: 'Aplikasi Wali Murid mengirim notifikasi otomatis bahwa siswa telah dijemput secara sah.',
    actor: 'Sistem Otomatis',
    appSlug: 'wali-murid',
    status: 'available',
    fallbackNote: null,
    app: { slug: 'wali-murid', name: 'Wali Murid SSD', iconName: 'family_restroom' },
  },
  {
    stepNo: 7,
    title: 'Top-Up Uang Saku',
    description: 'Sore harinya, orang tua mengisi ulang saldo uang saku santri langsung melalui aplikasi Wali Murid.',
    actor: 'Orang Tua',
    appSlug: 'wali-murid',
    status: 'available',
    fallbackNote: null,
    app: { slug: 'wali-murid', name: 'Wali Murid SSD', iconName: 'family_restroom' },
  },
  {
    stepNo: 8,
    title: 'Transaksi Kantin / Koperasi',
    description: 'Anak jajan di kantin atau koperasi: kasir memindai kartu, anak memasukkan PIN, saldo langsung terpotong aman tanpa uang tunai.',
    actor: 'Kantin / Mitra',
    appSlug: 'mitra-usaha',
    status: 'available',
    fallbackNote: null,
    app: { slug: 'mitra-usaha', name: 'Mitra Usaha', iconName: 'point_of_sale' },
  },
  {
    stepNo: 9,
    title: 'Rekonsiliasi Pembukuan Otomatis',
    description: 'Bendahara membuka Back Office; seluruh pergerakan uang saku, SPP, dan kas telah terbukukan di buku besar tanpa input ganda.',
    actor: 'Bendahara',
    appSlug: 'back-office',
    status: 'available',
    fallbackNote: null,
    app: { slug: 'back-office', name: 'Back Office SSD', iconName: 'dashboard' },
  },
]

export const painPoints: PainPoint[] = [
  {
    number: 1,
    title: 'Anak Datang atau Tidak, Kabar Terlambat Sampai ke Orang Tua',
    description: 'Orang tua cemas menanti kabar kehadiran di sekolah sementara presensi manual butuh waktu lama untuk direkap.',
    solvedByAppSlugs: ['absensi-tap', 'pegawai', 'wali-murid'],
    orderIndex: 1,
  },
  {
    number: 2,
    title: "Orang Tua Bertanya 'Anak Saya Sekarang Ada di Mana?'",
    description: 'Pihak sekolah kesulitan melacak apakah santri/siswa masih di asrama, izin keluar, atau sudah dijemput.',
    solvedByAppSlugs: ['security-gate', 'wali-murid', 'command-center'],
    orderIndex: 2,
  },
  {
    number: 3,
    title: 'SPP Menunggak dan Penagihan Menumpuk di Grup WhatsApp',
    description: 'Pengumuman iuran di grup wali murid sering tenggelam dan memicu rasa canggung antara guru dan orang tua.',
    solvedByAppSlugs: ['back-office', 'wali-murid'],
    orderIndex: 3,
  },
  {
    number: 4,
    title: 'Kantin Masih Tunai: Uang Saku Hilang dan Belanja Tak Terkontrol',
    description: 'Siswa membawa uang tunai berisiko hilang atau disalahgunakan, sementara sekolah tidak memiliki visibilitas konsumsi.',
    solvedByAppSlugs: ['mitra-usaha', 'back-office'],
    orderIndex: 4,
  },
  {
    number: 5,
    title: 'Satpam Ragu Apakah Siswa Memiliki Izin Sah Keluar Gerbang',
    description: 'Tanpa sistem terpusat, satpam hanya mengandalkan lembaran surat izin fisik yang mudah dipalsukan atau tercecer.',
    solvedByAppSlugs: ['security-gate'],
    orderIndex: 5,
  },
  {
    number: 6,
    title: "Guru Piket dan Pimpinan Bertanya 'Siapa Saja yang Izin Hari Ini?'",
    description: 'Piket kebingungan membedakan siswa sakit, izin pulang, atau alpa karena data tersebar di berbagai buku catatan.',
    solvedByAppSlugs: ['command-center'],
    orderIndex: 6,
  },
  {
    number: 7,
    title: 'Pimpinan Meminta Laporan, Staf Membuka 7 File Excel Berbeda',
    description: 'Kompilasi laporan bulanan keuangan dan akademik antar-unit memakan waktu berhari-hari dan rawan kesalahan rumus.',
    solvedByAppSlugs: ['back-office', 'pimpinan'],
    orderIndex: 7,
  },
]

export const moduleGroups: ModuleGroup[] = [
  {
    slug: 'bimbingan-konseling',
    title: 'Bimbingan Konseling',
    description: 'Ruang kerja konselor dengan pemisahan ketat catatan internal dan ringkasan orang tua.',
    iconName: 'psychology',
    orderIndex: 1,
    items: [
      { title: 'Dashboard BK', orderIndex: 0 },
      { title: 'Inbox Rujukan Kasus', orderIndex: 1 },
      { title: 'Sesi Konseling Siswa', orderIndex: 2 },
      { title: 'Sesi Mandiri', orderIndex: 3 },
      { title: 'Laporan & Rekapitulasi Kasus', orderIndex: 4 },
    ],
  },
  {
    slug: 'akademik',
    title: 'Akademik',
    description: 'Fondasi tahun ajaran, kurikulum, rombongan belajar, asrama, dan kalender kegiatan.',
    iconName: 'school',
    orderIndex: 2,
    items: [
      { title: 'Tahun Ajaran & Semester', orderIndex: 0 },
      { title: 'Manajemen Unit & Jenjang', orderIndex: 1 },
      { title: 'Asrama & Kamar Santri', orderIndex: 2 },
      { title: 'Mata Pelajaran & Jadwal Ajar', orderIndex: 3 },
      { title: 'Kalender Akademik Terpadu', orderIndex: 4 },
      { title: 'Kenaikan Kelas & Kelulusan', orderIndex: 5 },
    ],
  },
  {
    slug: 'kesiswaan',
    title: 'Kesiswaan',
    description: 'Pusat data siswa, catatan disiplin, perizinan, dan pembinaan minat bakat.',
    iconName: 'groups',
    orderIndex: 3,
    items: [
      { title: 'Data Induk Siswa & Alumni', orderIndex: 0 },
      { title: 'Absensi Harian & Presensi Mapel', orderIndex: 1 },
      { title: 'Pengajuan Izin Keluar & Pulang', orderIndex: 2 },
      { title: 'Ekstrakurikuler & Prestasi', orderIndex: 3 },
      { title: 'Poin & Tindakan Pelanggaran', orderIndex: 4 },
    ],
  },
  {
    slug: 'wali-kelas',
    title: 'Wali Kelas',
    description: 'Instrumen wali kelas mengawal dinamika belajar dan pendampingan 30–40 anak.',
    iconName: 'supervisor_account',
    orderIndex: 4,
    items: [
      { title: 'Penugasan Wali Kelas', orderIndex: 0 },
      { title: 'Catatan Perkembangan Siswa', orderIndex: 1 },
      { title: 'Kunjungan Rumah (Home Visit)', orderIndex: 2 },
      { title: 'Pengumuman Kelas & Agenda', orderIndex: 3 },
      { title: 'Rekap Nilai Raport & Catatan Kenaikan', orderIndex: 4 },
    ],
  },
  {
    slug: 'sarpras',
    title: 'Sarana & Prasarana',
    description: 'Manajemen aset fisik sekolah, pemeliharaan ruangan, dan rekam peminjaman.',
    iconName: 'inventory_2',
    orderIndex: 5,
    items: [
      { title: 'Kategori & Ruangan', orderIndex: 0 },
      { title: 'Daftar Supplier & Pengadaan', orderIndex: 1 },
      { title: 'Inventaris & Kondisi Barang', orderIndex: 2 },
      { title: 'Peminjaman & Pengembalian Aset', orderIndex: 3 },
      { title: 'Maintenance & Pemeliharaan Berkala', orderIndex: 4 },
      { title: 'Mutasi Lokasi & Penghapusan Aset', orderIndex: 5 },
    ],
  },
  {
    slug: 'keuangan',
    title: 'Keuangan',
    description: 'Sistem akuntansi terintegrasi: buku kas, jurnal umum, laba rugi, dan tabungan.',
    iconName: 'account_balance',
    orderIndex: 6,
    items: [
      { title: 'Nomor Perkiraan (Chart of Accounts)', orderIndex: 0 },
      { title: 'Daftar Rekening Kas & Bank', orderIndex: 1 },
      { title: 'Buku Kas Masuk & Keluar', orderIndex: 2 },
      { title: 'Buku Besar & Jurnal Umum', orderIndex: 3 },
      { title: 'Laporan Laba Rugi & Neraca', orderIndex: 4 },
      { title: 'Tabungan Siswa & Pegawai', orderIndex: 5 },
      { title: 'Kas Mitra Usaha', orderIndex: 6 },
    ],
  },
  {
    slug: 'pembayaran',
    title: 'Pembayaran',
    description: 'Pusat tagihan SPP, iuran non-SPP, cicilan, dan integrasi Virtual Account perbankan.',
    iconName: 'payments',
    orderIndex: 7,
    items: [
      { title: 'Kategori Tagihan SPP & Non-SPP', orderIndex: 0 },
      { title: 'Pembayaran SPP Harian & Bulanan', orderIndex: 1 },
      { title: 'Pembayaran Biaya Non-SPP & Cicilan', orderIndex: 2 },
      { title: 'Pembayaran Kolektif Multi-Siswa', orderIndex: 3 },
      { title: 'Integrasi Virtual Account Bank', orderIndex: 4 },
    ],
  },
  {
    slug: 'kepegawaian',
    title: 'Kepegawaian',
    description: 'Administrasi data guru dan staf, jadwal kerja, penggajian, dan rekap honor.',
    iconName: 'badge',
    orderIndex: 8,
    items: [
      { title: 'Data Induk Pegawai & Guru', orderIndex: 0 },
      { title: 'Pengaturan Jam Kerja & Hari Libur', orderIndex: 1 },
      { title: 'Setelan Honor & Tarif Mengajar', orderIndex: 2 },
      { title: 'Pengajuan Cuti & Izin Pegawai', orderIndex: 3 },
      { title: 'Monitor Absensi Pegawai', orderIndex: 4 },
      { title: 'Penggajian (Payroll) & Cetak Slip Gaji', orderIndex: 5 },
    ],
  },
  {
    slug: 'psb',
    title: 'Penerimaan Siswa Baru (PSB)',
    description: 'Pengelolaan gelombang pendaftaran, verifikasi berkas, dan aktivasi siswa baru.',
    iconName: 'app_registration',
    orderIndex: 9,
    items: [
      { title: 'Gelombang & Jadwal Pendaftaran', orderIndex: 0 },
      { title: 'Formulir Online & Pengaturan Biaya', orderIndex: 1 },
      { title: 'Verifikasi Berkas & Seleksi', orderIndex: 2 },
      { title: 'Konversi Calon Siswa ke Siswa Aktif', orderIndex: 3 },
    ],
  },
  {
    slug: 'presensi',
    title: 'Presensi Terpadu',
    description: 'Konfigurasi perangkat scanner tap kartu, radius lokasi, dan presensi manual darurat.',
    iconName: 'contactless',
    orderIndex: 10,
    items: [
      { title: 'Area & Radius Lokasi Absensi', orderIndex: 0 },
      { title: 'Absensi Manual Darurat', orderIndex: 1 },
      { title: 'Konfigurasi Perangkat Scanner Tap', orderIndex: 2 },
      { title: 'Verifikasi Presensi Kegiatan & Shalat', orderIndex: 3 },
    ],
  },
  {
    slug: 'komunikasi',
    title: 'Komunikasi & Publikasi',
    description: 'Kanal komunikasi resmi: broadcast WhatsApp tagihan, artikel berita, dan video.',
    iconName: 'chat',
    orderIndex: 11,
    items: [
      { title: 'Broadcast WhatsApp Terjadwal', orderIndex: 0 },
      { title: 'Pengiriman Tagihan Iuran via WhatsApp', orderIndex: 1 },
      { title: 'Publikasi Artikel & Berita Sekolah', orderIndex: 2 },
      { title: 'Integrasi Video YouTube Edukasi', orderIndex: 3 },
      { title: 'Kirim Undangan & Kunjungan Wali', orderIndex: 4 },
    ],
  },
  {
    slug: 'laporan',
    title: 'Laporan & Tata Usaha',
    description: 'Pusat laporan eksekutif pimpinan, template surat dinas, dan jejak audit sistem.',
    iconName: 'description',
    orderIndex: 12,
    items: [
      { title: 'Pusat Laporan Eksekutif', orderIndex: 0 },
      { title: 'Template & Pembuatan Surat Dinas', orderIndex: 1 },
      { title: 'Arsip Surat Masuk & Surat Keluar', orderIndex: 2 },
      { title: 'Audit Trail & Rekam Jejak Sistem', orderIndex: 3 },
    ],
  },
]

export const roleLevels: RoleLevel[] = [
  {
    levelLabel: '0',
    sortKey: 0,
    name: 'Admin Yayasan',
    description: 'Akses penuh lintas seluruh unit sekolah, konfigurasi master data yayasan, dan pengaturan sistem.',
  },
  {
    levelLabel: '1',
    sortKey: 1,
    name: 'Admin Unit',
    description: 'Mengelola operasional harian, akademik, dan kesiswaan untuk satu unit sekolah tertentu.',
  },
  {
    levelLabel: '2–3',
    sortKey: 2,
    name: 'Bendahara Yayasan / Unit',
    description: 'Mengatur tagihan SPP, pembukuan kas & bank, tabungan siswa, payroll gaji, dan rekonsiliasi keuangan.',
  },
  {
    levelLabel: '4',
    sortKey: 4,
    name: 'Pengawas Mitra',
    description: 'Memantau aktivitas belanja siswa di kantin/koperasi, validasi merchant, dan pengajuan tagihan mitra.',
  },
  {
    levelLabel: '5',
    sortKey: 5,
    name: 'Operator Presensi',
    description: 'Mengoperasikan mesin scanner tap, verifikasi absensi harian dan kegiatan ibadah/rutin.',
  },
  {
    levelLabel: '6',
    sortKey: 6,
    name: 'Petugas UKS',
    description: 'Mengelola klinik sekolah, kunjungan sakit siswa, persediaan obat, dan rekam medis dasar.',
  },
  {
    levelLabel: '7',
    sortKey: 7,
    name: 'Petugas BK',
    description: 'Menerima rujukan kasus siswa, menjadwalkan konseling pribadi, dan mencatat riwayat penanganan tertutup.',
  },
  {
    levelLabel: '9',
    sortKey: 9,
    name: 'Admin PSB',
    description: 'Mengelola pendaftaran peserta didik baru, verifikasi dokumen calon siswa, dan validasi formulir.',
  },
]

export const comparisonRows: ComparisonRow[] = [
  {
    topic: 'Satu yayasan menaungi banyak unit',
    typicalSolution: 'Satu sekolah terkunci dalam satu akun kaku; yayasan harus membuat login terpisah untuk tiap jenjang.',
    ssdSolution: 'Arsitektur multi-unit sejak rancangan awal (SD + SMP + SMA + TPQ); keuangan dan pelaporan dapat digabung atau dipisah sesuai kebijakan yayasan.',
    orderIndex: 1,
  },
  {
    topic: 'Kombinasi pesantren dan sekolah formal',
    typicalSolution: 'Hanya mengakomodasi sekolah umum jam kerja, atau hanya pesantren tradisional tanpa kurikulum formal.',
    ssdSolution: 'Modul komprehensif mengelola asrama, tahfidz, kitab kuning, pembina kamar, berdampingan dengan kurikulum akademik formal.',
    orderIndex: 2,
  },
  {
    topic: 'Kepastian kepulangan dan penjemputan siswa',
    typicalSolution: 'Hanya mencatat absensi masuk di pagi hari; penjemputan sore tidak terpantau.',
    ssdSolution: 'Pencatatan pos gerbang terintegrasi, verifikasi izin keluar real-time, dan jam serah-terima santri terekam jelas.',
    orderIndex: 3,
  },
  {
    topic: 'Pengelolaan kantin dan uang jajan tunai',
    typicalSolution: 'Jarang tersambung dengan rekening tabungan siswa; uang saku tunai rawan hilang atau jatuh.',
    ssdSolution: 'E-kantin nirsentuh dengan kartu identitas + verifikasi PIN, batasan harian, dan radius geo-fencing area sekolah.',
    orderIndex: 4,
  },
  {
    topic: 'Penagihan uang sekolah / SPP',
    typicalSolution: 'Pemberitahuan manual disebar di grup WhatsApp umum, memicu canggung dan rawan terlewat.',
    ssdSolution: 'Notifikasi tagihan otomatis terkirim langsung ke akun wali murid dilengkapi Virtual Account bank nasional terverifikasi.',
    orderIndex: 5,
  },
  {
    topic: 'Transparansi siswa yang mengantongi izin',
    typicalSolution: 'Piket kebingungan mencari lembaran surat izin fisik saat orang tua atau guru menanyakan keberadaan anak.',
    ssdSolution: 'Command Center otomatis menayangkan daftar siswa izin di layar TV ruang guru tanpa perlu diklik manual.',
    orderIndex: 6,
  },
  {
    topic: 'Kemudahan kerja guru di luar meja kantor',
    typicalSolution: 'Aplikasi hanya berbasis web desktop yang kaku dan lambat diakses lewat peramban ponsel pintar.',
    ssdSolution: 'Aplikasi Pegawai di smartphone mempermudah guru mengisi absen kelas, jurnal ajar, pelanggaran, dan cek slip honor.',
    orderIndex: 7,
  },
  {
    topic: 'Perlindungan privasi konseling siswa',
    typicalSolution: 'Catatan sensitif seringkali bercampur atau tidak sengaja terbaca oleh pihak yang tidak berwenang.',
    ssdSolution: 'Pemisahan ketat: catatan internal konselor terenkripsi, orang tua hanya menerima ringkasan resmi, dan TV memblokir diagnosa sensitif.',
    orderIndex: 8,
  },
  {
    topic: 'Integrasi lintas vendor aplikasi sekolah',
    typicalSolution: 'Membeli aplikasi terpisah dari 4–5 vendor berbeda dengan biaya integrasi mahal dan data terfragmentasi.',
    ssdSolution: 'Satu data, satu vendor terpercaya, satu langganan terintegrasi untuk seluruh denyut nadi operasional sekolah Anda.',
    orderIndex: 9,
  },
]

export const faqs: FaqItem[] = [
  {
    question: 'Apa bedanya SSD dengan aplikasi absen atau SPP biasa?',
    answer: 'SSD menyatukan administrasi, keuangan, gerbang, kantin, orang tua, dan TV monitoring dalam satu data terpadu. Admin cukup menginput satu kali, seluruh aplikasi terkait langsung terbarui secara otomatis.',
    category: 'umum',
    orderIndex: 1,
  },
  {
    question: 'Apakah cocok untuk yayasan dengan banyak unit?',
    answer: 'Sangat cocok. SSD dirancang multi-unit sejak awal: satu yayasan dapat mengelola unit SD, SMP, SMA, TPQ, dan asrama pondok dengan pembukuan keuangan yang fleksibel (bisa dipisah per unit atau dikonsolidasikan ke yayasan).',
    category: 'umum',
    orderIndex: 2,
  },
  {
    question: 'Apakah SSD menggantikan sistem e-learning / LMS?',
    answer: 'Tidak. SSD berfokus kokoh pada keunggulan operasional, administrasi, dan keuangan sekolah, bukan platform bank soal CBT atau penyedia konten video belajar nasional.',
    category: 'umum',
    orderIndex: 3,
  },
  {
    question: 'Apa saja informasi yang dapat dilihat oleh orang tua murid?',
    answer: 'Orang tua dapat memantau pembayaran SPP, histori tabungan, absensi gerbang & kelas, pencapaian prestasi, poin pelanggaran, pengajuan izin, jadwal ajar, raport digital, serta ringkasan konseling yang telah diizinkan pihak sekolah.',
    category: 'fitur',
    orderIndex: 4,
  },
  {
    question: 'Bagaimana privasi sesi konseling siswa dijaga?',
    answer: 'Hasil sesi dan catatan internal konselor hanya dapat diakses oleh Guru BK yang berwenang. Orang tua hanya melihat ringkasan tindak lanjut yang disetujui, dan papan TV Command Center secara ketat menyembunyikan diagnosa BK.',
    category: 'keamanan',
    orderIndex: 5,
  },
  {
    question: 'Metode pembayaran apa saja yang didukung oleh sistem?',
    answer: 'SSD mendukung pembayaran tagihan SPP rutin, iuran non-SPP, cicilan terencana, pembayaran kolektif multi-santri, serta saluran Virtual Account perbankan terintegrasi.',
    category: 'keuangan',
    orderIndex: 6,
  },
  {
    question: 'Apakah aplikasi dapat digunakan di perangkat Apple iPhone (iOS)?',
    answer: 'Aplikasi Wali Murid saat ini berfokus pada ekosistem Android (Play Store) dan peramban web responsif. Aplikasi Pegawai dan modul pendukung tersedia sebagai Progressive Web Apps (PWA) yang dapat diinstal di berbagai perangkat. Silakan hubungi tim kami untuk konsultasi ketersediaan platform lainnya.',
    category: 'teknis',
    orderIndex: 7,
  },
  {
    question: 'Berapa biaya investasi berlangganan sistem SSD?',
    answer: 'Biaya investasi disesuaikan secara transparan berdasarkan jumlah unit pendidikan, skala peserta didik, dan paket modul yang dipilih yayasan Anda. Rincian skema penawaran akan dipaparkan secara langsung saat sesi demo bersama tim konsultan kami.',
    category: 'biaya',
    orderIndex: 8,
  },
  {
    question: 'Berapa lama proses implementasi dan apakah ada pendampingan?',
    answer: 'Proses implementasi dan migrasi data sekolah berlangsung secara terstruktur dengan pendampingan langsung oleh tim teknis kami dari persiapan data, konfigurasi hak akses, hingga pelatihan guru dan staf tata usaha.',
    category: 'implementasi',
    orderIndex: 9,
  },
]

export const settings: SiteSettings = {
  contact: {
    email: 'digitalteknologiperkasa.lampung@gmail.com',
    whatsapp: '6285839845284',
    address: 'Perum Graha Madu Pesona Blok C No.31, Bandar Lampung',
  },
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
  },
  cta: {
    primary: 'Jadwalkan Demo',
    whatsappText: 'Halo Digital Teknologi Perkasa, saya ingin jadwalkan demo School Smart Digital (SSD) untuk sekolah/yayasan kami.',
  },
  features: {
    showTestimonials: false,
    showTrustStats: false,
  },
  company: {
    name: 'Digital Teknologi Perkasa',
    parentUrl: 'https://digital-teknologi-perkasa-profile.vercel.app',
  },
}

export const fallbackContent: LandingContent = {
  apps,
  moduleGroups,
  roleLevels,
  painPoints,
  flowSteps,
  comparisonRows,
  faqs,
  settings: settings as unknown as Record<string, unknown>,
}
```

#### File 7: `packages/shared/src/index.ts`
```ts
export * from './schemas'
export * from './types'
export * from './phone'
export * from './content'
```

---

### PART B: `packages/db`

#### File 1: `packages/db/package.json`
```json
{
  "name": "@ssd/db",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./schema": "./src/schema.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/seed.ts",
    "create-admin": "tsx src/create-admin.ts"
  },
  "dependencies": {
    "@adonisjs/hash": "^9.1.1",
    "@neondatabase/serverless": "^0.10.4",
    "@ssd/shared": "workspace:*",
    "dotenv": "^16.4.7",
    "drizzle-orm": "^0.38.4"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30.2",
    "tsx": "^4.19.2",
    "typescript": "^5.8.2"
  }
}
```

#### File 2: `packages/db/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "dist"
  },
  "include": ["src/**/*", "drizzle.config.ts"]
}
```

#### File 3: `packages/db/drizzle.config.ts`
```ts
import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || '',
  },
})
```

#### File 4: `packages/db/src/schema.ts`
```ts
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  bigserial,
  index,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

/* ───────── 5 Enums ───────── */
export const appStatus = pgEnum('app_status', ['available', 'partial', 'development'])
export const featureStatus = pgEnum('feature_status', ['available', 'roadmap'])
export const leadStatus = pgEnum('lead_status', ['new', 'contacted', 'demo_scheduled', 'won', 'lost', 'spam'])
export const orgType = pgEnum('org_type', ['sekolah', 'yayasan', 'tpq', 'pondok', 'lainnya'])
export const adminRole = pgEnum('admin_role', ['owner', 'editor', 'sales'])

/* ───────── Helper Column Definitions ───────── */
const id = () => uuid('id').primaryKey().defaultRandom()
const stamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}

/* ───────── 1. Admin Users ───────── */
export const adminUsers = pgTable('admin_users', {
  id: id(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: adminRole('role').notNull().default('sales'),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  ...stamps,
})

/* ───────── 2. Site Settings ───────── */
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedBy: uuid('updated_by').references(() => adminUsers.id, { onDelete: 'set null' }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

/* ───────── 3. Media Metadata ───────── */
export const media = pgTable('media', {
  id: id(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  storageProvider: text('storage_provider').notNull().default('vercel-blob'),
  mimeType: text('mime_type'),
  fileSize: integer('file_size'),
  width: integer('width'),
  height: integer('height'),
  altText: text('alt_text'),
  caption: text('caption'),
  uploadedBy: uuid('uploaded_by').references(() => adminUsers.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

/* ───────── 4. Apps ───────── */
export const apps = pgTable(
  'apps',
  {
    id: id(),
    slug: text('slug').notNull().unique(),
    number: integer('number').notNull(),
    name: text('name').notNull(),
    mascotName: text('mascot_name'),
    tagline: text('tagline').notNull(),
    description: text('description'),
    audience: text('audience').notNull(),
    platformLabel: text('platform_label').notNull(),
    platforms: text('platforms').array().notNull().default(sql`'{}'::text[]`),
    status: appStatus('status').notNull().default('available'),
    statusNote: text('status_note'),
    iconName: text('icon_name').notNull(),
    previewMediaId: uuid('preview_media_id').references(() => media.id, { onDelete: 'set null' }),
    previewType: text('preview_type').notNull().default('phone'),
    isFeatured: boolean('is_featured').notNull().default(false),
    isPublished: boolean('is_published').notNull().default(true),
    orderIndex: integer('order_index').notNull().default(0),
    archived: boolean('archived').notNull().default(false),
    ...stamps,
  },
  (t) => [index('apps_order_idx').on(t.orderIndex)]
)

/* ───────── 5. App Features ───────── */
export const appFeatures = pgTable(
  'app_features',
  {
    id: id(),
    appId: uuid('app_id').notNull().references(() => apps.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    iconName: text('icon_name'),
    status: featureStatus('status').notNull().default('available'),
    orderIndex: integer('order_index').notNull().default(0),
    ...stamps,
  },
  (t) => [index('app_features_app_idx').on(t.appId)]
)

/* ───────── 6. Module Groups ───────── */
export const moduleGroups = pgTable('module_groups', {
  id: id(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  iconName: text('icon_name').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  archived: boolean('archived').notNull().default(false),
  ...stamps,
})

/* ───────── 7. Module Items ───────── */
export const moduleItems = pgTable(
  'module_items',
  {
    id: id(),
    groupId: uuid('group_id').notNull().references(() => moduleGroups.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    orderIndex: integer('order_index').notNull().default(0),
  },
  (t) => [index('module_items_group_idx').on(t.groupId)]
)

/* ───────── 8. Role Levels ───────── */
export const roleLevels = pgTable('role_levels', {
  id: id(),
  levelLabel: text('level_label').notNull(),
  sortKey: integer('sort_key').notNull(),
  name: text('name').notNull(),
  description: text('description'),
})

/* ───────── 9. Pain Points ───────── */
export const painPoints = pgTable('pain_points', {
  id: id(),
  number: integer('number').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  solvedByAppSlugs: text('solved_by_app_slugs').array().notNull().default(sql`'{}'::text[]`),
  orderIndex: integer('order_index').notNull().default(0),
})

/* ───────── 10. Flow Steps ───────── */
export const flowSteps = pgTable('flow_steps', {
  id: id(),
  stepNo: integer('step_no').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  actor: text('actor').notNull(),
  appId: uuid('app_id').references(() => apps.id, { onDelete: 'set null' }),
  status: featureStatus('status').notNull().default('available'),
  fallbackNote: text('fallback_note'),
})

/* ───────── 11. Comparison Rows ───────── */
export const comparisonRows = pgTable('comparison_rows', {
  id: id(),
  topic: text('topic').notNull(),
  typicalSolution: text('typical_solution').notNull(),
  ssdSolution: text('ssd_solution').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
})

/* ───────── 12. FAQs ───────── */
export const faqs = pgTable('faqs', {
  id: id(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull().default('umum'),
  orderIndex: integer('order_index').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  archived: boolean('archived').notNull().default(false),
  ...stamps,
})

/* ───────── 13. Testimonials (Default Hidden) ───────── */
export const testimonials = pgTable('testimonials', {
  id: id(),
  name: text('name').notNull(),
  roleTitle: text('role_title'),
  organization: text('organization'),
  content: text('content').notNull(),
  photoMediaId: uuid('photo_media_id').references(() => media.id, { onDelete: 'set null' }),
  isVerified: boolean('is_verified').notNull().default(false),
  consentAt: timestamp('consent_at', { withTimezone: true }),
  isPublished: boolean('is_published').notNull().default(false),
  orderIndex: integer('order_index').notNull().default(0),
  archived: boolean('archived').notNull().default(false),
  ...stamps,
})

/* ───────── 14. Leads ───────── */
export const leads = pgTable(
  'leads',
  {
    id: id(),
    name: text('name').notNull(),
    roleTitle: text('role_title'),
    organization: text('organization').notNull(),
    orgType: orgType('org_type').notNull(),
    studentCountRange: text('student_count_range'),
    unitCount: integer('unit_count'),
    whatsapp: text('whatsapp').notNull(),
    email: text('email'),
    interests: text('interests').array().notNull().default(sql`'{}'::text[]`),
    message: text('message'),
    preferredDemoAt: timestamp('preferred_demo_at', { withTimezone: true }),
    status: leadStatus('status').notNull().default('new'),
    source: text('source').notNull().default('landing'),
    utm: jsonb('utm'),
    ipHash: text('ip_hash'),
    userAgent: text('user_agent'),
    consent: boolean('consent').notNull(),
    consentAt: timestamp('consent_at', { withTimezone: true }).notNull().defaultNow(),
    notes: text('notes'),
    assignedTo: uuid('assigned_to').references(() => adminUsers.id, { onDelete: 'set null' }),
    archived: boolean('archived').notNull().default(false),
    ...stamps,
  },
  (t) => [
    index('leads_status_idx').on(t.status, t.createdAt),
    index('leads_ip_idx').on(t.ipHash, t.createdAt),
  ]
)

/* ───────── 15. Analytics Events ───────── */
export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    eventName: text('event_name').notNull(),
    pagePath: text('page_path'),
    sectionId: text('section_id'),
    props: jsonb('props'),
    sessionId: text('session_id'),
    referrer: text('referrer'),
    utm: jsonb('utm'),
    device: text('device'),
    browser: text('browser'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('events_name_idx').on(t.eventName, t.createdAt)]
)

/* ───────── Drizzle ORM Relations ───────── */
export const appsRelations = relations(apps, ({ many, one }) => ({
  features: many(appFeatures),
  previewMedia: one(media, { fields: [apps.previewMediaId], references: [media.id] }),
}))

export const appFeaturesRelations = relations(appFeatures, ({ one }) => ({
  app: one(apps, { fields: [appFeatures.appId], references: [apps.id] }),
}))

export const moduleGroupsRelations = relations(moduleGroups, ({ many }) => ({
  items: many(moduleItems),
}))

export const moduleItemsRelations = relations(moduleItems, ({ one }) => ({
  group: one(moduleGroups, { fields: [moduleItems.groupId], references: [moduleGroups.id] }),
}))

export const flowStepsRelations = relations(flowSteps, ({ one }) => ({
  app: one(apps, { fields: [flowSteps.appId], references: [apps.id] }),
}))

export const leadsRelations = relations(leads, ({ one }) => ({
  assignee: one(adminUsers, { fields: [leads.assignedTo], references: [adminUsers.id] }),
}))
```

#### File 5: `packages/db/src/index.ts`
```ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

export * as schema from './schema'

export function createDb(url: string) {
  return drizzle({ client: neon(url), schema })
}

export type Db = ReturnType<typeof createDb>
```

#### File 6: `packages/db/src/seed.ts`
```ts
import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { createDb } from './index'
import * as schema from './schema'
import {
  apps as rawApps,
  flowSteps as rawFlowSteps,
  painPoints as rawPainPoints,
  moduleGroups as rawModuleGroups,
  roleLevels as rawRoleLevels,
  comparisonRows as rawComparisonRows,
  faqs as rawFaqs,
  settings as rawSettings,
} from '@ssd/shared/content'

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
if (!connectionString) {
  console.error('❌ Error: DATABASE_URL or DATABASE_URL_UNPOOLED is not defined in environment.')
  process.exit(1)
}

const db = createDb(connectionString)

export async function seed() {
  console.log('🌱 Starting idempotent database seed...')

  // 1. Seed Site Settings
  console.log('Seeding site_settings...')
  for (const [key, value] of Object.entries(rawSettings)) {
    await db
      .insert(schema.siteSettings)
      .values({
        key,
        value: value as any,
      })
      .onConflictDoUpdate({
        target: schema.siteSettings.key,
        set: { value: value as any, updatedAt: new Date() },
      })
  }

  // 2. Seed Apps and App Features
  console.log('Seeding apps and features...')
  const appSlugToId = new Map<string, string>()

  for (const a of rawApps) {
    const [row] = await db
      .insert(schema.apps)
      .values({
        slug: a.slug,
        number: a.number,
        name: a.name,
        mascotName: a.mascotName ?? null,
        tagline: a.tagline,
        description: a.description ?? null,
        audience: a.audience,
        platformLabel: a.platformLabel,
        platforms: a.platforms,
        status: a.status,
        statusNote: a.statusNote ?? null,
        iconName: a.iconName,
        previewType: a.previewType,
        isFeatured: a.isFeatured ?? false,
        isPublished: a.isPublished ?? true,
        orderIndex: a.orderIndex ?? a.number,
        archived: false,
      })
      .onConflictDoUpdate({
        target: schema.apps.slug,
        set: {
          number: a.number,
          name: a.name,
          mascotName: a.mascotName ?? null,
          tagline: a.tagline,
          description: a.description ?? null,
          audience: a.audience,
          platformLabel: a.platformLabel,
          platforms: a.platforms,
          status: a.status,
          statusNote: a.statusNote ?? null,
          iconName: a.iconName,
          previewType: a.previewType,
          isFeatured: a.isFeatured ?? false,
          isPublished: a.isPublished ?? true,
          orderIndex: a.orderIndex ?? a.number,
          archived: false,
          updatedAt: new Date(),
        },
      })
      .returning({ id: schema.apps.id, slug: schema.apps.slug })

    appSlugToId.set(row.slug, row.id)

    // Delete existing features and re-insert for idempotency
    await db.delete(schema.appFeatures).where(eq(schema.appFeatures.appId, row.id))
    if (a.features && a.features.length > 0) {
      await db.insert(schema.appFeatures).values(
        a.features.map((f, idx) => ({
          appId: row.id,
          title: f.title,
          description: f.description ?? null,
          iconName: f.iconName ?? null,
          status: f.status ?? 'available',
          orderIndex: f.orderIndex ?? idx,
        }))
      )
    }
  }

  // 3. Seed Module Groups and Items
  console.log('Seeding module_groups and items...')
  for (const mg of rawModuleGroups) {
    const [groupRow] = await db
      .insert(schema.moduleGroups)
      .values({
        slug: mg.slug,
        title: mg.title,
        description: mg.description ?? null,
        iconName: mg.iconName,
        orderIndex: mg.orderIndex ?? 0,
        archived: false,
      })
      .onConflictDoUpdate({
        target: schema.moduleGroups.slug,
        set: {
          title: mg.title,
          description: mg.description ?? null,
          iconName: mg.iconName,
          orderIndex: mg.orderIndex ?? 0,
          archived: false,
          updatedAt: new Date(),
        },
      })
      .returning({ id: schema.moduleGroups.id })

    await db.delete(schema.moduleItems).where(eq(schema.moduleItems.groupId, groupRow.id))
    if (mg.items && mg.items.length > 0) {
      await db.insert(schema.moduleItems).values(
        mg.items.map((item, idx) => ({
          groupId: groupRow.id,
          title: typeof item === 'string' ? item : item.title,
          orderIndex: idx,
        }))
      )
    }
  }

  // 4. Seed Role Levels
  console.log('Seeding role_levels...')
  await db.delete(schema.roleLevels)
  await db.insert(schema.roleLevels).values(
    rawRoleLevels.map((r) => ({
      levelLabel: r.levelLabel,
      sortKey: r.sortKey,
      name: r.name,
      description: r.description ?? null,
    }))
  )

  // 5. Seed Pain Points
  console.log('Seeding pain_points...')
  await db.delete(schema.painPoints)
  await db.insert(schema.painPoints).values(
    rawPainPoints.map((p, idx) => ({
      number: p.number,
      title: p.title,
      description: p.description ?? null,
      solvedByAppSlugs: p.solvedByAppSlugs,
      orderIndex: p.orderIndex ?? idx,
    }))
  )

  // 6. Seed Flow Steps
  console.log('Seeding flow_steps...')
  for (const step of rawFlowSteps) {
    const targetAppId = step.appSlug ? appSlugToId.get(step.appSlug) ?? null : null
    await db
      .insert(schema.flowSteps)
      .values({
        stepNo: step.stepNo,
        title: step.title,
        description: step.description ?? null,
        actor: step.actor,
        appId: targetAppId,
        status: step.status,
        fallbackNote: step.fallbackNote ?? null,
      })
      .onConflictDoUpdate({
        target: schema.flowSteps.stepNo,
        set: {
          title: step.title,
          description: step.description ?? null,
          actor: step.actor,
          appId: targetAppId,
          status: step.status,
          fallbackNote: step.fallbackNote ?? null,
        },
      })
  }

  // 7. Seed Comparison Rows
  console.log('Seeding comparison_rows...')
  await db.delete(schema.comparisonRows)
  await db.insert(schema.comparisonRows).values(
    rawComparisonRows.map((c, idx) => ({
      topic: c.topic,
      typicalSolution: c.typicalSolution,
      ssdSolution: c.ssdSolution,
      orderIndex: c.orderIndex ?? idx,
    }))
  )

  // 8. Seed FAQs
  console.log('Seeding faqs...')
  await db.delete(schema.faqs)
  await db.insert(schema.faqs).values(
    rawFaqs.map((f, idx) => ({
      question: f.question,
      answer: f.answer,
      category: f.category ?? 'umum',
      orderIndex: f.orderIndex ?? idx,
      isPublished: true,
      archived: false,
    }))
  )

  console.log('✔ Database seed completed successfully!')
}

seed().catch((err) => {
  console.error('❌ Database seed failed:', err)
  process.exit(1)
})
```

#### File 7: `packages/db/src/create-admin.ts`
```ts
import 'dotenv/config'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { Hash } from '@adonisjs/hash'
import { Scrypt } from '@adonisjs/hash/drivers/scrypt'
import { eq } from 'drizzle-orm'
import { createDb } from './index'
import * as schema from './schema'

async function run() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL or DATABASE_URL_UNPOOLED must be set.')
    process.exit(1)
  }

  const db = createDb(connectionString)

  let email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  let password = process.env.ADMIN_PASSWORD
  let name = process.env.ADMIN_NAME?.trim()
  let role = (process.env.ADMIN_ROLE?.trim().toLowerCase() as 'owner' | 'editor' | 'sales') || 'owner'

  // If environment variables are not provided, prompt interactively
  if (!email || !password || !name) {
    const rl = readline.createInterface({ input, output })
    try {
      if (!email) email = (await rl.question('Admin Email: ')).trim().toLowerCase()
      if (!name) name = (await rl.question('Admin Name: ')).trim()
      if (!password) password = await rl.question('Admin Password (min 8 chars): ')
      const roleInput = (await rl.question('Admin Role [owner/editor/sales] (default: owner): ')).trim().toLowerCase()
      if (roleInput && ['owner', 'editor', 'sales'].includes(roleInput)) {
        role = roleInput as 'owner' | 'editor' | 'sales'
      }
    } finally {
      rl.close()
    }
  }

  if (!email || !email.includes('@')) {
    console.error('❌ Error: Valid email address is required.')
    process.exit(1)
  }
  if (!password || password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long.')
    process.exit(1)
  }
  if (!name) {
    console.error('❌ Error: Name is required.')
    process.exit(1)
  }

  console.log(`🔐 Hashing password with scrypt for ${email}...`)
  const scrypt = new Scrypt()
  const hasher = new Hash(scrypt)
  const passwordHash = await hasher.make(password)

  console.log(`🔍 Checking existing admin user for ${email}...`)
  const existing = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email)).limit(1)

  if (existing.length > 0) {
    console.log(`Updating existing admin user: ${email}`)
    await db
      .update(schema.adminUsers)
      .set({
        name,
        passwordHash,
        role,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.adminUsers.email, email))
  } else {
    console.log(`Creating new admin user: ${email} (${role})`)
    await db.insert(schema.adminUsers).values({
      email,
      name,
      passwordHash,
      role,
      isActive: true,
    })
  }

  console.log(`✔ Admin user ${email} successfully created/updated!`)
}

run().catch((err) => {
  console.error('❌ Error creating admin:', err)
  process.exit(1)
})
```

---

## 5. Verification Method

To independently verify the implementation blueprint once files are written by the build agent:

1. **Guardrail Compliance Scan**:
   ```powershell
   pnpm guardrail
   ```
   *Expected output*: `✔ Guardrail scan PASSED: Codebase is clean of credentials, competitors, and internal leaks.`
   *Invalidation condition*: Any match for test accounts, private phone numbers, competitor brand names, internal platform names, or fake stats.

2. **TypeScript Compilation Check**:
   ```powershell
   pnpm --filter @ssd/shared typecheck
   pnpm --filter @ssd/db typecheck
   ```
   *Expected output*: Exit code 0 with zero TypeScript errors.
   *Invalidation condition*: Type mismatch between schema objects and Drizzle ORM pg-core definitions, or between `LandingContent` and `fallbackContent`.

3. **Drizzle Migration & Push Validation**:
   ```powershell
   pnpm --filter @ssd/db db:push
   ```
   *Expected output*: Schema pushed to Neon PostgreSQL with 15 tables and 5 enums created.

4. **Idempotent Seed Execution**:
   ```powershell
   pnpm --filter @ssd/db db:seed
   ```
   *Expected output*: Exit code 0, inserting 12 apps, 9 flow steps, 12 module groups, 8 role levels, 7 pain points, 9 comparisons, 9 FAQs, and site settings.
   *Second execution check*: Running `pnpm --filter @ssd/db db:seed` a second time must complete with exit code 0 without duplicate key violations.

5. **Admin Creation CLI Test**:
   ```powershell
   $env:ADMIN_EMAIL="admin@schoolsmartdigital.id"; $env:ADMIN_NAME="Administrator"; $env:ADMIN_PASSWORD="superSecretPassword2026!"; $env:ADMIN_ROLE="owner"; pnpm db:create-admin
   ```
   *Expected output*: Exit code 0, successfully creating admin user with scrypt hash in `admin_users` table.

6. **Contract Verification with `GET /api/content`**:
   Compare the shape returned by `fallbackContent` from `@ssd/shared/content` against `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` §D5. All keys (`apps`, `moduleGroups`, `roleLevels`, `painPoints`, `flowSteps`, `comparisonRows`, `faqs`, `settings`) must match 1:1.

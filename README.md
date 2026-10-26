# School Smart Digital (SSD) — Landing Page & Platform Profile

Monorepo resmi untuk Landing Page Product Profile **School Smart Digital (SSD)**, dikembangkan oleh **Digital Teknologi Perkasa**.

## Arsitektur & Teknologi
- **Frontend & Nitro Backend:** Nuxt 4 (struktur `app/`), Tailwind CSS v4 (`@tailwindcss/vite`), Pinia
- **Database:** PostgreSQL di Neon via Drizzle ORM (`drizzle-orm/neon-http`)
- **Desain & Motion:** Hero Morph S-Curve Portal, Ledge Slide-in, Sticky Frame Ecosystem Selector, Tilted Spotlight Card, Perforated Pass Ticket
- **Validasi & Kontrak:** Zod & TypeScript via `@ssd/shared`

## Struktur Monorepo
```
├── apps/
│   └── web/            # Nuxt 4 Frontend & Nitro API Endpoints
├── packages/
│   ├── shared/         # Schemas Zod, Types, & Static Seed Fallback
│   └── db/             # Drizzle Schema, Migrations, Seeds, & Admin Auth
├── docs/               # Dokumentasi Teknis, PRD, & Panduan UI/UX
└── scripts/            # Guardrail compliance checker & testing tools
```

## Menjalankan Proyek
```bash
# 1. Install dependensi
pnpm install

# 2. Periksa kepatuhan guardrail
pnpm guardrail

# 3. Jalankan server pengembangan
pnpm dev

# 4. Migrasi & Seed Database (Neon)
pnpm db:push
pnpm db:seed
```

# School Smart Digital (SSD) : Platform Profil & Ekosistem Terpadu Sekolah Modern

Monorepo resmi untuk Web Platform Profil & Showcase Produk **School Smart Digital (SSD)**, dikembangkan oleh **PT Digital Teknologi Perkasa (DTP)**.

Repository ini memuat keseluruhan kode frontend publik, back-office admin panel, serverless API, skema basis data, pustaka tipe bersama, aset desain S-Curve, serta rangkaian automated end-to-end (E2E) testing suite.

---

## Daftar Isi
1. [Tentang School Smart Digital](#tentang-school-smart-digital)
2. [Nilai Strategis & Keunggulan Produk](#nilai-strategis--keunggulan-produk)
3. [Arsitektur Teknis Sistem](#arsitektur-teknis-sistem)
4. [Struktur Direktori Monorepo](#struktur-direktori-monorepo)
5. [Daftar Halaman & Rute Aplikasi](#daftar-halaman--rute-aplikasi)
6. [Fitur Keamanan & Kepatuhan Regulasi](#fitur-keamanan--kepatuhan-regulasi)
7. [Rangkaian Pengujian Kualitas (Testing Suite)](#rangkaian-pengujian-kualitas-testing-suite)
8. [Panduan Instalasi & Menjalankan Proyek](#panduan-instalasi--menjalankan-proyek)
9. [Perintah Manajemen Basis Data](#perintah-manajemen-basis-data)
10. [Lisensi & Kepemilikan](#lisensi--kepemilikan)

---

## Tentang School Smart Digital

**School Smart Digital (SSD)** adalah ekosistem sistem operasi digital sekolah modern terintegrasi yang dirancang untuk mengatasi persoalan operasional sekolah yang terfragmentasi. SSD menyatukan 12 aplikasi spesifik per peran dalam 1 basis data terpusat (*single source of truth*), menghubungkan seluruh lini kegiatan sekolah mulai dari gerbang turnstile QR code, presensi kehadiran, ruang kelas, konseling BK, tata usaha, keuangan SPP perbankan, hingga pelaporan eksekutif yayasan.

### Visi & Misi Platform
- **Visi**: Mewujudkan transformasi digital sekolah dan madrasah Indonesia yang tertib, transparan, dan terbebas dari sistem terisolasi (*data silos*).
- **Misi**: Menyediakan platform operasional sekolah terpadu yang andal, mudah digunakan oleh seluruh pemangku kepentingan tanpa memerlukan infrastruktur server lokal yang rumit dan mahal.

---

## Nilai Strategis & Keunggulan Produk

1. **1 Akun Terpadu (Single Unified Account)**:
   Satu sistem autentikasi terpusat yang melayani Yayasan, Kepala Sekolah, Guru, Staf Tata Usaha, Petugas BK, Petugas Keamanan, Orang Tua/Wali Murid, hingga Siswa.
2. **Real-Time Sinkronisasi Cloud Serverless**:
   Bekerja secara instan tanpa ketergantungan pada server fisik lokal di sekolah yang rentan mati listrik, kerusakan harddisk, atau kendala jaringan lokal.
3. **Arsitektur Multi-Unit Terintegrasi**:
   Mendukung pengelolaan multi-jenjang pendidikan di bawah satu naungan yayasan (SD, SMP, SMA, SMK, hingga Asrama / Boarding School).
4. **Filosofi Status Jujur (Honest Transparency)**:
   Peta jalan modul aplikasi disajikan secara transparan (modul siap pakai, fase integrasi, hingga modul riset masa depan) tanpa klaim fiktif.
5. **Kepatuhan Privasi & Keamanan Ketat**:
   Selaras dengan mandat UU Pelindungan Data Pribadi (UU PDP No. 27 Tahun 2022) dengan enkripsi data dan audit trail terkelola.

---

## Arsitektur Teknis Sistem

Proyek ini dibangun di atas fondasi teknologi web modern dengan arsitektur monorepo berkinerja tinggi:

```
[ Klien / Browser ]
        │
        ▼
[ Nuxt 4 Frontend Layer (SSR / CSR) ]
  ├── Vue 3.5 (Composition API & <script setup lang="ts">)
  ├── Tailwind CSS v4 (@tailwindcss/vite)
  ├── GSAP 3.x (Spring Physics & Staggered Animations)
  ├── Global Scroll Reveal Plugin (IntersectionObserver)
  └── Lenis Smooth Scroll Engine
        │
        ▼
[ Nitro Server Engine Layer (apps/web/server) ]
  ├── RESTful API Endpoints (/api/*)
  ├── Admin Auth Guard (nuxt-auth-utils sealed sessions)
  ├── CSV Formula Injection Defense
  └── Webhook Dispatcher & Rate Limiting
        │
        ▼
[ Data Access Layer (@ssd/db & @ssd/shared) ]
  ├── Drizzle ORM (drizzle-orm/neon-http)
  ├── Neon Serverless PostgreSQL Database
  └── Local Content Fallback Engine (Resilience Offline)
```

### 1. Frontend Framework & Antarmuka
- **Nuxt 4 (v4.6.2)**: Mengadopsi struktur direktori modern `app/` dengan pemisahan tegas antara logika presentasi, komponen, aset, dan server runtime.
- **Vue 3.5**: Memanfaatkan Composition API murni, deklarasi reaktif performan tinggi, serta pemanfaatan Teleport untuk elemen modal dan drawer navigasi.
- **Tailwind CSS v4 (`@tailwindcss/vite`)**: Engine styling tercepat dengan arsitektur utility-first, dukungan CSS variables native, dan isolasi breakpoint responsif.
- **S-Curve Design System**: Identitas visual khas SSD dengan duo-tone warna resmi:
  - Deep Navy (`#0C3161` / `#0A2036`): Melambangkan stabilitas, ketegasan tata kelola, dan keamanan institusional.
  - Tech Cyan (`#01A8CF` / `#00B4D8`): Melambangkan kecerdasan teknologi modern, ketajaman data, dan inovasi ramah pengguna.
- **Aksesibilitas Tinggi (WCAG 2.1 AA & 2.2 AA)**:
  - Rasio kontras teks minimal 4.5:1 terhadap background.
  - Target sentuh interaktif memenuhi standar minimal 44x44px.
  - Tersedia aksesibilitas skip-link menuju `#main-content`.
  - Dukungan mode `prefers-reduced-motion` untuk menonaktifkan gerakan berlebih bagi pengguna sensitif.

### 2. Mesin Animasi & Interaksi
- **GSAP (GreenSock Animation Platform)**:
  - Tombol compact floating hamburger mengadopsi fisika pegas `back.out(1.6)`.
  - Ikon hamburger 3 garis bertransformasi secara dinamis (*morphing*) menjadi ikon silang (X).
  - Mobile Drawer meluncur dari sisi kanan dengan efek stagger masuk pada link navigasi (`stagger: 0.05s`) dan animasi rotasi 90 derajat pada tombol tutup.
- **Global Scroll Reveal System (`scroll-reveal.client.ts`)**:
  - Memanfaatkan `IntersectionObserver` ringan untuk menganimasikan elemen saat digulir ke viewport.
  - Mendukung efek `.reveal` (fade-up), `.reveal-left` (fade-in dari kiri), `.reveal-right` (fade-in dari kanan), serta penundaan berurutan `.reveal-delay-1` sampai `.reveal-delay-4`.
  - Dilengkapi mekanisme *unobserve* otomatis agar animasi tidak berulang dan tidak membebani memori browser.
  - Pengecualian mutlak pada seluruh rute Admin Panel (`/admin/*`) agar seluruh form dan tabel admin tampil instan tanpa jeda.
- **Hero S-Curve Morph Portal**:
  - Perhitungan matematika interpolasi kurva kubik `easeInOutCubic` yang mengontrol bukaan portal login secara dinamis berdasarkan persentase scroll pengguna.

### 3. Backend, Serverless API & Basis Data
- **Nitro Engine**: Server engine bawaan Nuxt yang dikonfigurasi dengan preset `node-server`, siap untuk penyebaran di server mandiri maupun edge serverless.
- **Neon Serverless PostgreSQL**: Basis data cloud relasional tangguh dengan kapabilitas autoscaling, pooling koneksi bawaan, dan latensi rendah.
- **Drizzle ORM (`drizzle-orm/neon-http`)**: ORM TypeScript murni yang menjamin keamanan tipe (*type-safe*) dari level query hingga respons API.
- **Dual-Source Offline Resilience**: Jika koneksi ke serverless database mengalami *cold start* atau gangguan jaringan, sistem API publik otomatis mengalihkan sumber data ke koleksi konten statis terverifikasi pada `@ssd/shared/content` sehingga situs web tidak pernah mengalami layar putih (*downtime zero-impact*).

### 4. Autentikasi & Validasi Kontrak
- **Nuxt Auth Utils**: Mengamankan sesi admin menggunakan cookie HTTP-only bersegel enkripsi tingkat tinggi (AES-256), terlindung dari serangan XSS dan CSRF.
- **Zod Schemas (`@ssd/shared/schemas`)**: Validasi input dua arah (frontend form dan backend handler) untuk menjamin seluruh data leads dan formulir demo bersih dari manipulasi.
- **Phone Normalizer (`@ssd/shared/phone`)**: Menormalisasi berbagai format nomor telepon seluler lokal (misal: 0812..., +62812..., 62-812) ke dalam format internasional baku WhatsApp (`628...`).

---

## Struktur Direktori Monorepo

Repository ini dikelola menggunakan **pnpm workspaces** yang memisahkan kode menjadi aplikasi frontend/backend dan paket-paket modular yang dapat digunakan kembali:

```
Web School Smart Digital/
├── apps/
│   └── web/                                # Aplikasi Utama Nuxt 4 (Web Publik & Admin Panel)
│       ├── app/
│       │   ├── app.vue                     # Root template aplikasi Nuxt
│       │   ├── assets/
│       │   │   ├── css/
│       │   │   │   └── main.css            # Token desain, kelas utilitas, dan animasi reveal
│       │   │   └── svg/                    # Aset vektor logo mark dan brand
│       │   ├── components/
│       │   │   ├── admin/                  # Komponen antarmuka back-office admin
│       │   │   │   ├── AdminExportModal.vue     # Modal ekspor leads dengan proteksi CSV
│       │   │   │   ├── AdminLeadDetailModal.vue # Modal inspeksi data detail leads
│       │   │   │   ├── AdminLogoutModal.vue     # Modal konfirmasi keluar sistem
│       │   │   │   └── AdminSidebar.vue         # Sidebar navigasi panel admin
│       │   │   ├── BrandLogo.vue           # Komponen logo SVG adaptif SSD
│       │   │   ├── ClosingCta.vue          # Banner ajakan konsultasi penutup halaman
│       │   │   ├── DemoForm.vue            # Formulir permohonan demo & konsultasi
│       │   │   ├── EcosystemSelector.vue   # Komponen visual katalog 12 aplikasi sekolah
│       │   │   ├── FaqAccordion.vue        # Accordion interaktif tanya-jawab publik
│       │   │   ├── FlowTimeline.vue        # Visualisasi alur 9 langkah operasional sekolah
│       │   │   ├── HeroPortal.vue          # Hero section dengan efek S-Curve Morph Portal
│       │   │   ├── HonestTable.vue         # Tabel perbandingan fitur & transparansi produk
│       │   │   ├── ModuleGrid.vue          # Grid eksplorasi modul sistem informasi
│       │   │   ├── ParentBrandStrip.vue    # Banner legalitas & profil PT DTP
│       │   │   ├── ProblemList.vue         # Daftar 7 tantangan nyata operasional sekolah
│       │   │   ├── RoleLadder.vue          # Visual hierarki hak akses pengguna (Role 0-9)
│       │   │   ├── SiteFooter.vue          # Footer ringkas modern dengan logo ekosistem
│       │   │   ├── SiteHeader.vue          # Header utama dengan transisi scroll
│       │   │   ├── SiteNavbar.vue          # Navigasi utama, floating pill & mobile drawer
│       │   │   ├── SpotlightTabs.vue       # Showcase fitur unggulan dengan stage dinamis
│       │   │   ├── TestimonialSection.vue  # Kutipan pengalaman kepala sekolah & yayasan
│       │   │   ├── TrustPillars.vue        # 4 pilar arsitektur keamanan data sekolah
│       │   │   └── UnitDiagram.vue         # Diagram arsitektur multi-unit pendidikan
│       │   ├── middleware/
│       │   │   └── admin.ts                # Route guard pelindung akses panel admin
│       │   ├── pages/
│       │   │   ├── admin/                  # Rute-rute dashboard & manajemen back-office
│       │   │   ├── berita/                 # Rute katalog berita dan detail artikel slug
│       │   │   ├── fitur.vue               # Halaman showcase fitur & ekosistem 12 aplikasi
│       │   │   ├── galeri.vue              # Halaman galeri bimbingan teknis & implementasi
│       │   │   ├── index.vue               # Halaman utama (Beranda)
│       │   │   ├── kontak.vue              # Halaman formulir konsultasi, demo & kantor
│       │   │   ├── privacy-policy.vue      # Halaman kepatuhan kebijakan privasi UU PDP
│       │   │   ├── tentang.vue             # Halaman profil perusahaan, jam kerja & peta
│       │   │   └── terms.vue               # Halaman syarat dan ketentuan layanan
│       │   ├── plugins/
│       │   │   ├── lenis.client.ts         # Inisialisasi engine smooth-scrolling
│       │   │   └── scroll-reveal.client.ts # Plugin pengamat scroll reveal interaktif
│       │   ├── stores/
│       │   │   └── ecosystem.ts            # State management Pinia untuk ekosistem aplikasi
│       │   └── utils/
│       │       ├── icons.ts                # Helper mapping ikon Material Symbols
│       │       └── ssd-logo-paths.ts       # Definisi path vektor logo resmi SSD
│       ├── public/                         # Aset publik statis (favicon, logo ekosistem)
│       └── server/                         # Lapisan Nitro Serverless Backend
│           ├── api/                        # Endpoint RESTful publik dan admin
│           ├── middleware/                 # Middleware proteksi server API
│           └── utils/                      # Helper database, auth, sanitasi, dan webhook
├── packages/
│   ├── db/                                 # Paket Manajemen Basis Data Drizzle & Neon
│   │   ├── drizzle/                        # Berkas migrasi SQL hasil generate
│   │   ├── src/
│   │   │   ├── check.ts                    # Script penguji koneksi ke basis data Neon
│   │   │   ├── create-admin.ts             # Utilitas pembuatan kredensial admin awal
│   │   │   ├── index.ts                    # Export client koneksi database utama
│   │   │   ├── schema.ts                   # Definisi 18 tabel skema Drizzle ORM
│   │   │   └── seed.ts                     # Script seeder data awal produksi
│   │   ├── drizzle.config.ts               # Konfigurasi Drizzle Kit
│   │   └── package.json
│   └── shared/                             # Paket Berbagi Skema, Tipe & Konten Statis
│       ├── src/
│       │   ├── content/                    # Data konten statis fallback untuk ketahanan luring
│       │   ├── index.ts                    # Entry point paket shared
│       │   ├── phone.ts                    # Fungsi utilitas normalisasi nomor WhatsApp
│       │   ├── schemas.ts                  # Skema validasi Zod untuk formulir dan data
│       │   └── types.ts                    # Definisi antarmuka TypeScript universal
│       └── package.json
├── docs/                                   # Dokumentasi Teknis, PRD & Panduan Desain
├── scripts/
│   └── guardrail-check.mjs                 # Script verifikasi kepatuhan kode dan kredensial
├── tests/                                  # Rangkaian Automated E2E Testing Suite (Tiers 1-4)
│   ├── e2e/
│   │   ├── tier1-feature-coverage.test.mjs # Pengujian cakupan 29 fitur utama sistem
│   │   ├── tier2-boundary-corner.test.mjs  # Pengujian skenario batas ekstrem & keamanan
│   │   ├── tier3-pairwise-combinations.test.mjs # Pengujian kombinasi antar-fitur sistem
│   │   └── tier4-application-scenarios.test.mjs # Pengujian skenario nyata alur pengguna
│   ├── runner.mjs                          # Eksekutor utama seluruh rangkaian tes
│   └── stress-responsive-a11y.mjs          # Stress test tata letak responsif & aksesibilitas
├── package.json                            # Konfigurasi root monorepo
├── pnpm-workspace.yaml                     # Deklarasi workspace monorepo
└── README.md                               # Berkas dokumentasi utama proyek
```

---

## Daftar Halaman & Rute Aplikasi

### 1. Rute Publik (Web Profil & Informasi)
| Rute | Nama Halaman | Fungsi & Komponen Kunci |
| :--- | :--- | :--- |
| `/` | Beranda | Hero S-Curve Morph Portal, Ringkasan Masalah Sekolah, Highlight Ekosistem, Testimoni, FAQ terpadu, dan Hubungi Kami |
| `/fitur` | Fitur & Ekosistem | Showcase mendalam 12 aplikasi per peran, 9 langkah tiket operasional, stage privasi BK, grid modul, arsitektur multi-unit |
| `/galeri` | Galeri Bimtek | Dokumentasi kegiatan pelatihan, pendampingan implementasi, dan bimbingan teknis di sekolah mitra |
| `/berita` | Warta & Berita | Indeks publikasi artikel, pembaruan fitur sistem, edukasi digitalisasi sekolah, dan kolom pencarian |
| `/berita/[slug]` | Detail Berita | Pembaca artikel berita lengkap dengan metadata dinamis dan navigasi artikel terkait |
| `/tentang` | Tentang Kami | Profil PT Digital Teknologi Perkasa, visi misi, komitmen transparansi, jam operasional kantor, dan peta Google Maps |
| `/kontak` | Hubungi Kami | Formulir penjadwalan demo sistem, konsultasi implementasi sekolah, kontak WhatsApp direct hotline, dan info alamat |
| `/privacy-policy` | Kebijakan Privasi | Komitmen perlindungan data siswa, guru, wali murid, dan institusi pendidikan sesuai UU PDP No. 27/2022 |
| `/terms` | Syarat & Ketentuan | Ketentuan lisensi hak cipta, hak penggunaan perangkat lunak, dan batasan tanggung jawab operasional |

### 2. Rute Back-Office Admin Panel
| Rute | Nama Halaman | Fungsi Manajemen |
| :--- | :--- | :--- |
| `/admin/login` | Autentikasi Admin | Gerbang masuk aman pengelola sistem dengan perlindungan brute-force |
| `/admin/dashboard` | Dashboard Statistik | Ringkasan metrik prospek masuk, status sebaran minat sekolah, dan aktivitas terkini |
| `/admin/leads` | Manajemen Prospek | Tabel pencatatan calon sekolah mitra, pembaruan status tindak lanjut, modal detail leads, dan ekspor CSV terproteksi |
| `/admin/news` | Manajemen Berita | CRUD artikel warta, status publikasi, dan pengaturan cover gambar |
| `/admin/portfolio` | Manajemen Galeri | Pengelolaan dokumentasi dokumenter implementasi lapangan dan bimtek |
| `/admin/services` | Manajemen Modul | Pengaturan visibilitas dan deskripsi modul-modul pada ekosistem SSD |
| `/admin/testimonials`| Manajemen Testimoni| Moderasi kutipan testimoni dari pimpinan sekolah dan yayasan mitra |
| `/admin/faq` | Manajemen Tanya Jawab | Pengelolaan butir-butir pertanyaan yang sering diajukan di halaman utama |
| `/admin/feedback` | Manajemen Pesan Masuk| Kotak masuk pesan langsung dari formulir kontak umum publik |

---

## Fitur Keamanan & Kepatuhan Regulasi

1. **Perlindungan Injeksi Formula CSV**:
   Seluruh data teks pada ekspor berkas spreadsheet calon mitra (`/api/admin/leads.csv`) secara ketat disanitasi dari karakter awalan berbahaya seperti `=`, `+`, `-`, atau `@` guna mencegah eksekusi kode berbahaya saat file dibuka di Microsoft Excel atau Google Sheets.
2. **Sesi Tersegel & Cookie HTTP-Only**:
   Sesi administrator dikelola dengan `nuxt-auth-utils` menggunakan cookie bersegel enkripsi kuat yang tidak dapat dimanipulasi atau dibaca oleh skrip sisi klien (*anti-XSS*).
3. **Penyaringan Honeypot & Validasi Ketat**:
   Formulir demo publik dilengkapi field jebakan (*honeypot*) tersembunyi. Pengiriman otomatis dari bot spam langsung ditandai dan diabaikan tanpa membebani antrean database.
4. **Isolasi Tugas Latar Belakang (Webhook Resilient)**:
   Notifikasi webhook ke sistem eksternal dieksekusi secara terisolasi tanpa memblokir respons HTTP pengguna, sehingga kegagalan jaringan pihak ketiga tidak menggagalkan penyimpanan data formulir.
5. **Guardrail Scanner Kode Otomatis**:
   Script kepatuhan `scripts/guardrail-check.mjs` secara ketat memindai seluruh direktori proyek untuk memastikan tidak ada kredensial bocor, token rahasia tersimpan di git, atau nama merek kompetitor yang terlanggar.

---

## Rangkaian Pengujian Kualitas (Testing Suite)

Repository ini dilengkapi dengan sistem pengujian otomatis menyeluruh (*Adversarial Master E2E Test Suite*) yang mencakup 4 tingkatan pengujian dengan total **234 tes otomatis**:

- **Tier 1 : Feature Coverage (145 Tes)**
  Memverifikasi fungsionalitas 29 fitur platform secara individual mulai dari konfigurasi workspace monorepo, token CSS, geometri logo SVG, formula scroll portal, normalisasi telepon, hingga komponen modular.
- **Tier 2 : Boundary & Corner Cases (51 Tes)**
  Menguji ketahanan sistem terhadap kondisi ekstrem, input teks panjang, karakter injeksi SQL, percobaan bypass honeypot, dan simulasi kegagalan koneksi.
- **Tier 3 : Pairwise Combinations (15 Tes)**
  Memverifikasi interaksi lintas fitur seperti mode `prefers-reduced-motion` yang dipadukan dengan S-Curve morphing, viewport ponsel sempit (320px) dengan tabel bertumpuk, serta penanganan isolasi webhook.
- **Tier 4 : Real-World Application Scenarios (23 Tes)**
  Mensimulasikan skenario nyata interaksi pengguna dari awal hingga akhir (*end-to-end user journeys*), seperti pimpinan yayasan yang menjajaki sistem, operator seluler yang mengisi form demo, proses audit admin leads, hingga fallback saat database offline.

Seluruh 234 tes dapat dieksekusi dalam waktu kurang dari 200 milidetik menggunakan eksekutor terintegrasi:

```bash
node tests/runner.mjs
```

---

## Panduan Instalasi & Menjalankan Proyek

### Prasyarat Sistem
- **Node.js**: Versi `>= 20.x` (disarankan LTS terbaru)
- **Package Manager**: `pnpm` versi `>= 9.x`

### 1. Kloning Repository & Instalasi Dependensi
```bash
# Kloning repository
git clone <url-repository-anda>
cd "Web School Smart Digital"

# Pasang seluruh dependensi monorepo
pnpm install
```

### 2. Pengaturan Variabel Lingkungan (.env)
Salin berkas `.env.example` menjadi `.env` pada root direktori:

```bash
cp .env.example .env
```

Sesuaikan nilai variabel lingkungan di dalam berkas `.env`:
```env
# Koneksi Basis Data Neon PostgreSQL
DATABASE_URL=postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require

# Kunci Rahasia Sesi Admin (Minimal 32 karakter acak)
NUXT_SESSION_PASSWORD=ganti-dengan-kunci-enkripsi-acak-minimal-32-karakter-anda

# Kredensial Administrator Awal
ADMIN_EMAIL=admin@schoolsmartdigital.com
ADMIN_PASSWORD=KatasandiKuatAnda123!
```

### 3. Pengecekan Kepatuhan Guardrail
Pastikan kode bersih dari kebocoran data rahasia sebelum memulai pengembangan:
```bash
pnpm guardrail
```

### 4. Menjalankan Server Pengembangan (Dev Mode)
Jalankan server pengembangan web lokal:
```bash
pnpm dev
```
Aplikasi web publik dapat diakses melalui peramban di `http://localhost:3000`.

### 5. Membangun Proyek untuk Produksi (Production Build)
```bash
# Build paket aplikasi web produksi
pnpm build

# Menjalankan preview hasil build lokal
pnpm preview
```

---

## Perintah Manajemen Basis Data

Manajemen skema basis data dikelola terpusat pada paket `@ssd/db` menggunakan Drizzle Kit:

```bash
# Memeriksa status konektivitas basis data Neon
pnpm db:check

# Mendorong perubahan skema langsung ke basis data (Prototyping / Push)
pnpm db:push

# Menghasilkan berkas migrasi SQL baru
pnpm db:generate

# Menjalankan migrasi terstruktur ke basis data produksi
pnpm db:migrate

# Mengisi basis data dengan data awal resmi (Seeding)
pnpm db:seed

# Membuat atau memperbarui akun administrator baru
pnpm db:create-admin

# Membuka panel visual database Drizzle Studio di browser
pnpm db:studio
```

---

## Lisensi & Kepemilikan

Hak Cipta (c) 2026 **PT Digital Teknologi Perkasa**. Seluruh Hak Dilindungi Undang-Undang.

Perangkat lunak, desain antarmuka, aset merek dagang, dan sistem operasional yang tercakup dalam repositori ini merupakan properti intelektual milik PT Digital Teknologi Perkasa. Dilarang menggandakan, mendistribusikan ulang, atau memanfaatkan komponen sistem ini untuk keperluan komersial tanpa izin tertulis resmi dari pemegang hak cipta.

---

## Lisensi & Kepemilikan

Hak Cipta (c) 2026 **PT Digital Teknologi Perkasa**. Seluruh Hak Dilindungi Undang-Undang.

Perangkat lunak, desain antarmuka, aset merek dagang, dan sistem operasional yang tercakup dalam repositori ini merupakan properti intelektual milik PT Digital Teknologi Perkasa. Dilarang menggandakan, mendistribusikan ulang, atau memanfaatkan komponen sistem ini untuk keperluan komersial tanpa izin tertulis resmi dari pemegang hak cipta.


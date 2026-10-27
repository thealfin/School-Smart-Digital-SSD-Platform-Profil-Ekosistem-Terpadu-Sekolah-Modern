<script setup lang="ts">
import {
  SSD_LOGO_VIEWBOX,
  SSD_LOGO_NAVY_PATH,
  SSD_LOGO_CYAN_PATH,
  SSD_LOGO_NAVY_COLOR,
  SSD_LOGO_CYAN_COLOR,
} from '~/utils/ssd-logo-paths'

const props = defineProps<{
  error?: {
    statusCode?: number
    statusMessage?: string
    message?: string
    url?: string
  }
}>()

const route = useRoute()
const attemptedPath = computed(() => props.error?.url || route.fullPath || '/404')
const statusCode = computed(() => props.error?.statusCode || 404)

useHead({
  title: `${statusCode.value} Halaman Tidak Ditemukan | School Smart Digital`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    {
      name: 'description',
      content: 'Halaman yang Anda cari tidak ditemukan di ekosistem School Smart Digital.',
    },
  ],
})

function handleGoHome() {
  if (props.error) {
    clearError({ redirect: '/' })
  } else {
    navigateTo('/')
  }
}

function handleGoFeatures() {
  if (props.error) {
    clearError({ redirect: '/fitur' })
  } else {
    navigateTo('/fitur')
  }
}
</script>

<template>
  <div class="hero-404-shell">
    <!-- Floating Navbar -->
    <SiteHeader mode="subpage" />

    <!-- Main Hero-Style 404 Stage -->
    <main class="hero-404-stage" aria-labelledby="error-404-heading">
      <!-- Ambient Background Glows -->
      <div class="ambient-glow ambient-glow-top" aria-hidden="true" />
      <div class="ambient-glow ambient-glow-bottom" aria-hidden="true" />

      <div class="hero-404-grid">
        <!-- Left Wing: Badge, Heading, Checklist & Left-Aligned Cyan Bagan -->
        <div class="hero-404-wing hero-404-wing-left">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs mb-3">
            <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>KODE STATUS {{ statusCode }} · SISTEM OPERASI SEKOLAH TERPADU</span>
          </div>

          <h1 id="error-404-heading" class="hero-404-title">
            Halaman tidak ditemukan di dalam sistem.
          </h1>

          <p class="hero-404-subtitle">
            <span class="text-cyan-600 font-extrabold">Navigasi Terputus:</span>
            Rute <code class="px-2 py-0.5 rounded bg-navy-100/70 text-navy-900 font-mono text-xs">{{ attemptedPath }}</code> mungkin salah ketik, telah dipindahkan, atau tidak tersedia pada portal School Smart Digital.
          </p>

          <!-- Checklist Points -->
          <div class="mt-4 space-y-2">
            <div class="benefit-pill">
              <span class="benefit-check">✓</span>
              <span>Seluruh 12 aplikasi ekosistem tetap beroperasi normal (100% Online)</span>
            </div>
            <div class="benefit-pill">
              <span class="benefit-check">✓</span>
              <span>Gunakan tombol navigasi di bawah untuk kembali ke beranda resmi</span>
            </div>
          </div>

          <!-- Left-Aligned Cyan Bagan Card -->
          <div class="cyan-bagan-card mt-5">
            <div class="bagan-accent-bar" aria-hidden="true" />
            <div class="bagan-content">
              <div class="bagan-tag-row">
                <span class="bagan-status-dot" />
                <span class="bagan-tag-text">OPERASIONAL · SATU DATA TERPADU</span>
              </div>
              <p class="bagan-title">PORTAL EKOSISTEM SEKOLAH MODERN</p>
              <p class="bagan-desc">
                Kelola seluruh operasional akademik, keuangan SPP terpadu, presensi smart turnstile QR Code, manajemen Boarding School/Asrama, hingga komunikasi wali siswa dalam satu platform cerdas.
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="px-6 py-3.5 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              @click="handleGoHome"
            >
              <span class="material-symbols-rounded text-base" aria-hidden="true">home</span>
              <span>Kembali ke Beranda Utama</span>
            </button>

            <button
              type="button"
              class="px-5 py-3.5 rounded-full bg-white hover:bg-slate-100 text-navy-900 border border-navy-200 font-semibold text-sm transition-all cursor-pointer inline-flex items-center gap-2"
              @click="handleGoFeatures"
            >
              <span>Lihat 12 Aplikasi Terpadu →</span>
            </button>

            <a
              href="https://wa.me/6285839845284?text=Halo%20tim%20School%20Smart%20Digital,%20saya%20membutuhkan%20bantuan%20akses%20halaman"
              target="_blank"
              rel="noopener noreferrer"
              class="px-5 py-3.5 rounded-full bg-cyan-50 hover:bg-cyan-100 text-navy-950 border border-cyan-300 font-semibold text-sm transition-all inline-flex items-center gap-2"
            >
              <WhatsAppIcon class="w-4 h-4 text-cyan-600" />
              <span>Bantuan WhatsApp</span>
            </a>
          </div>
        </div>

        <!-- Right / Center Portal Aperture with Authentic Navy + Cyan SSD Logo -->
        <div class="hero-404-portal-col">
          <div class="portal-404-aperture">
            <!-- Subtle Background Navy S-Curve Wing -->
            <svg
              :viewBox="SSD_LOGO_VIEWBOX"
              preserveAspectRatio="none"
              class="portal-bg-wing"
              aria-hidden="true"
            >
              <path :fill="SSD_LOGO_NAVY_COLOR" :d="SSD_LOGO_CYAN_PATH" />
            </svg>

            <!-- Inner Portal Content -->
            <div class="portal-404-inner">
              <!-- Authentic Navy & Cyan SSD Logo Badge -->
              <div class="ssd-logo-badge">
                <svg
                  :viewBox="SSD_LOGO_VIEWBOX"
                  class="ssd-logo-svg"
                  role="img"
                  aria-label="Logo School Smart Digital Navy Cyan"
                >
                  <title>Logo School Smart Digital</title>
                  <path :fill="SSD_LOGO_NAVY_COLOR" :d="SSD_LOGO_NAVY_PATH" />
                  <path :fill="SSD_LOGO_CYAN_COLOR" :d="SSD_LOGO_CYAN_PATH" />
                </svg>
              </div>

              <!-- Knockout 404 Typography -->
              <div class="portal-404-code" aria-hidden="true">
                <span class="code-line-white">{{ statusCode }}</span>
                <span class="code-line-cyan">NOT FOUND</span>
              </div>

              <div class="portal-window-pill">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span class="font-mono text-xs text-cyan-200">schoolsmartdigital.com{{ attemptedPath }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.hero-404-shell {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background-color: var(--ssd-wall, #f6f9fc);
  background-image: var(--ssd-grain);
  color: var(--color-navy-950, #0a2036);
}

.hero-404-stage {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: clamp(6.5rem, 11vh, 8.5rem) 1.25rem clamp(3.5rem, 7vh, 5.5rem) 1.25rem;
}

.ambient-glow {
  position: absolute;
  width: 28rem;
  height: 28rem;
  border-radius: 9999px;
  pointer-events: none;
  filter: blur(80px);
  z-index: 0;
}

.ambient-glow-top {
  top: -8rem;
  right: -6rem;
  background: rgba(1, 168, 207, 0.14);
}

.ambient-glow-bottom {
  bottom: -8rem;
  left: -6rem;
  background: rgba(12, 49, 97, 0.1);
}

.hero-404-grid {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-404-grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
    gap: 4rem;
  }
}

.hero-404-title {
  font-family: var(--font-display, "Bricolage Grotesque", sans-serif);
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.025em;
  color: var(--color-navy-950, #0a2036);
  margin: 0 0 0.75rem 0;
}

.hero-404-subtitle {
  font-size: clamp(0.925rem, 1.2vw, 1.05rem);
  line-height: 1.6;
  color: var(--ssd-text-secondary, #46607a);
  max-width: 58ch;
  margin: 0;
}

.benefit-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 500;
  background: rgba(12, 49, 97, 0.04);
  color: #0c3161;
  border: 1px solid rgba(12, 49, 97, 0.08);
}

.benefit-check {
  color: #01a8cf;
  font-weight: 800;
}

/* Left-Aligned Cyan Bagan Card */
.cyan-bagan-card {
  position: relative;
  background: linear-gradient(135deg, rgba(1, 168, 207, 0.15) 0%, rgba(1, 168, 207, 0.04) 100%);
  border: 1.5px solid rgba(1, 168, 207, 0.45);
  border-left: 4px solid #01a8cf;
  border-radius: 14px;
  padding: 1rem 1.15rem;
  box-shadow: 0 4px 16px rgba(1, 168, 207, 0.12), inset 0 0 12px rgba(1, 168, 207, 0.05);
  backdrop-filter: blur(8px);
  overflow: hidden;
  text-align: left;
}

.bagan-accent-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3.5px;
  background: #01a8cf;
}

.bagan-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
  text-align: left;
}

.bagan-tag-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.bagan-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #01a8cf;
  box-shadow: 0 0 8px #01a8cf;
}

.bagan-tag-text {
  font-family: var(--font-mono, monospace);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #0c3161;
  text-transform: uppercase;
}

.bagan-title {
  font-family: var(--font-display, sans-serif);
  font-size: 0.9rem;
  font-weight: 800;
  color: #0c3161;
  margin: 0;
}

.bagan-desc {
  font-size: 0.78rem;
  font-weight: 600;
  color: #0c3161;
  opacity: 0.88;
  line-height: 1.45;
  margin: 0;
}

/* S-Curve Portal Aperture */
.hero-404-portal-col {
  display: flex;
  justify-content: center;
}

.portal-404-aperture {
  position: relative;
  width: 100%;
  max-width: 420px;
  min-height: 420px;
  background: linear-gradient(155deg, #0c3161 0%, #082040 65%, #0a2b54 100%);
  border-radius: 165px 28px 28px 28px;
  padding: 2.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow:
    0 28px 64px -12px rgba(8, 28, 56, 0.42),
    inset 0 0 0 2px rgba(255, 255, 255, 0.18),
    inset 0 0 40px rgba(1, 168, 207, 0.25);
}

.portal-bg-wing {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.25;
  pointer-events: none;
}

.portal-404-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

/* Authentic Navy + Cyan SSD Logo */
.ssd-logo-badge {
  width: 96px;
  height: 96px;
  border-radius: 26px;
  background: #ffffff;
  padding: 14px;
  box-shadow:
    0 16px 36px rgba(0, 0, 0, 0.28),
    0 0 0 4px rgba(1, 168, 207, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ssd-logo-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.portal-404-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-display, "Bricolage Grotesque", sans-serif);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.035em;
}

.code-line-white {
  font-size: clamp(4.25rem, 10vw, 5.75rem);
  color: #ffffff;
  text-shadow: 0 4px 24px rgba(8, 28, 56, 0.5);
}

.code-line-cyan {
  font-size: clamp(1.35rem, 3.2vw, 1.75rem);
  color: #2cc6e4;
  letter-spacing: 0.12em;
  margin-top: 0.35rem;
}

.portal-window-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.95rem;
  border-radius: 9999px;
  background: rgba(8, 28, 56, 0.75);
  border: 1px solid rgba(1, 168, 207, 0.35);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>


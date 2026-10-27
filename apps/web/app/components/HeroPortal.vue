<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  SSD_LOGO_VIEWBOX,
  SSD_LOGO_NAVY_PATH,
  SSD_LOGO_CYAN_PATH,
  SSD_LOGO_NAVY_COLOR,
  SSD_LOGO_CYAN_COLOR,
} from '~/utils/ssd-logo-paths'

  // Zero-JS Fallback Stylesheet for Legacy Crawlers (injected safely into <head>)
useHead({
  noscript: [
    {
      innerHTML: `<style>.hero-cliff { height: auto !important; min-height: 100svh; } .stage { position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important; } .portal-type, .caption, .hint { display: none !important; } .hero-flanks-layer { display: none !important; } .media { position: relative !important; clip-path: none !important; min-height: 50svh; } .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }</style>`,
    },
  ],
})

const rootEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const mediaEl = ref<HTMLElement | null>(null)

const isScrolly = ref(false)
const isOpen = ref(false)
const prefersReducedMotion = ref(false)

let ticking = false

/**
 * Standard cubic ease-in-out curve
 * Maps t in [0, 1] -> [0, 1]
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Standard cubic ease-out curve
 * Maps t in [0, 1] -> [0, 1]
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Geometry updater: calculates scroll progress and dynamically
 * sets aperture clip-path and CSS custom properties (--p, --e, --b, --over)
 */
function updateGeometry() {
  const root = rootEl.value
  const media = mediaEl.value
  if (!root || !media) return

  // Handle prefers-reduced-motion fallback
  if (prefersReducedMotion.value) {
    root.style.setProperty('--p', '1')
    root.style.setProperty('--e', '1')
    root.style.setProperty('--b', '1')
    root.style.setProperty('--over', '100%')
    media.style.clipPath = 'none'
    isOpen.value = true
    return
  }

  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
  const rect = root.getBoundingClientRect()
  const sectionTop = rect.top + scrollY
  const W = document.documentElement.clientWidth || window.innerWidth
  const H = window.innerHeight

  const totalScrollDistance = root.offsetHeight - H
  const p = Math.min(Math.max((scrollY - sectionTop) / Math.max(totalScrollDistance, 1), 0), 1)

  // Phase 1: Aperture expansion e in [0, 1] over p in [0, 0.70]
  const te = Math.min(Math.max(p / 0.70, 0), 1)
  const e = easeInOutCubic(te)

  // Phase 2: Ledge rise b in [0, 1] over p in [0.70, 1.0]
  const tb = Math.min(Math.max((p - 0.70) / 0.30, 0), 1)
  const b = easeOutCubic(tb)

  // Initial aperture dimensions (w0, h0) matching authentic SSD Logo square-portal proportions
  let w0: number
  let h0: number
  let cy: number
  if (W < 768) {
    w0 = 0.42 * W
    h0 = Math.min(0.22 * H, 1.06 * w0)
    cy = 0.43 * H
  } else if (W < 1024) {
    w0 = 0.36 * W
    h0 = Math.min(0.25 * H, 1.06 * w0)
    cy = 0.44 * H
  } else {
    w0 = Math.min(Math.max(0.28 * W, 280), 440)
    h0 = Math.min(0.58 * H, 1.12 * w0)
    cy = 0.53 * H
  }

  // Morph interpolation to full screen
  const w = w0 + (W - w0) * e
  const side = (W - w) / 2
  const top = (cy - h0 / 2) * (1 - e)
  const bottom = (H - cy - h0 / 2) * (1 - e)

  // Signature S-Curve corner radii inspired by Logo SSD.svg
  const rTL = (0.48 * w0) * (1 - e)
  const rOther = 22 * (1 - e)

  // Apply clip-path to .media
  if (e >= 0.999) {
    media.style.clipPath = 'none'
  } else {
    media.style.clipPath = `inset(${top.toFixed(2)}px ${side.toFixed(2)}px ${bottom.toFixed(2)}px ${side.toFixed(2)}px round ${rTL.toFixed(2)}px ${rOther.toFixed(2)}px ${rOther.toFixed(2)}px ${rOther.toFixed(2)}px)`
  }

  // Update CSS custom properties
  root.style.setProperty('--p', p.toFixed(4))
  root.style.setProperty('--e', e.toFixed(4))
  root.style.setProperty('--b', b.toFixed(4))

  // Navigation adaptive color mix over hero (--over reaches 100% when e >= 0.95)
  const over = Math.min(Math.max((e - 0.75) * 4, 0), 1)
  root.style.setProperty('--over', `${(over * 100).toFixed(1)}%`)

  // Ledge activation state
  isOpen.value = b >= 0.5
}

function onScrollOrResize() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(() => {
      updateGeometry()
      ticking = false
    })
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches

    const onMotionChange = (ev: MediaQueryListEvent) => {
      prefersReducedMotion.value = ev.matches
      updateGeometry()
    }
    mediaQuery.addEventListener('change', onMotionChange)

    if (!prefersReducedMotion.value) {
      isScrolly.value = true
      window.addEventListener('scroll', onScrollOrResize, { passive: true })
      window.addEventListener('resize', onScrollOrResize, { passive: true })
    }

    updateGeometry()
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScrollOrResize)
    window.removeEventListener('resize', onScrollOrResize)
  }
})
</script>

<template>
  <section
    ref="rootEl"
    class="hero-cliff"
    :class="{ 'is-scrolly': isScrolly, 'is-open': isOpen }"
    aria-labelledby="hero-h1"
  >
    <div ref="stageEl" class="stage">
      <!-- 1. Knockout Typography: Wall layer (Navy + Cyan on light wall) -->
      <p class="portal-type type-out" aria-hidden="true">
        <span class="type-line">SCHOOL</span>
        <span class="type-line">SMART</span>
        <span class="type-line type-line-digital">DIGITAL</span>
      </p>

      <!-- 2. S-Curve Morph Aperture Media shaped with Lower Wing Logo SSD in Navy -->
      <div ref="mediaEl" class="media">
        <div class="pan">
          <!-- Authentic Lower Wing Logo SSD.svg Shape in Navy (#0C3161) -->
          <div class="ssd-logo-portal-art" aria-hidden="true">
            <svg
              :viewBox="SSD_LOGO_VIEWBOX"
              preserveAspectRatio="none"
              class="ssd-portal-svg"
            >
              <!-- Shape sayap bawah SSD Logo, diwarnai Navy (#0C3161) sesuai instruksi -->
              <path
                fill="#0C3161"
                :d="SSD_LOGO_CYAN_PATH"
              />
            </svg>
          </div>

          <!-- Living stage inside portal: Tampilan Login School Smart Digital (login-ssd.svg) -->
          <slot name="media">
            <div class="hero-login-preview">
              <div class="login-window-frame">
                <div class="window-bar">
                  <div class="window-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                  </div>
                  <span class="window-title">login.schoolsmartdigital.com</span>
                </div>
                <div class="window-body">
                  <img
                    src="/media/login-ssd.svg"
                    alt="Tampilan Login School Smart Digital"
                    class="login-screen-img"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </slot>
        </div>

        <div class="scrim" aria-hidden="true"></div>

        <!-- Knockout Typography: Portal layer (White on Dual-Color Navy/Cyan SSD Logo Portal, pixel-identical) -->
        <p class="portal-type type-in" aria-hidden="true">
          <span class="type-line">SCHOOL</span>
          <span class="type-line">SMART</span>
          <span class="type-line type-line-digital-in">DIGITAL</span>
        </p>

        <!-- Internal frame subtle shadow / highlight -->
        <div class="reveal-frame" aria-hidden="true"></div>
      </div>

      <!-- 3. Aperture Ambient Labels (safely below 72px header so texts never overlap) -->
      <p class="caption" aria-hidden="true">
        <span class="caption-pill">Ekosistem 12 Aplikasi Sekolah · Satu Data</span>
      </p>
      <p class="hint" aria-hidden="true">
        <span>Scroll untuk membuka sistem ↓</span>
      </p>

      <!-- 4. Hero Flank Wings Layer: Desktop Sisi Kiri & Kanan Portal, Mobile Atas & Bawah Portal -->
      <div class="hero-flanks-layer">
        <!-- Sayap Kiri: Text Kedua + Bagan Warna Cyan & Teks Navy di Sisi Kiri -->
        <div class="hero-wing hero-wing-left">
          <div class="wing-inner-layout wing-left-layout">
            <!-- Bagan warna cyan dan text berwarna navy di sisi kiri text kedua -->
            <!-- <div class="wing-bagan-card wing-bagan-left" aria-hidden="true">
              <div class="bagan-accent-line"></div>
              <div class="bagan-body">
                <div class="bagan-tag-row">
                  <span class="bagan-status-dot"></span>
                  <span class="bagan-tag-text">01 // PLATFORM</span>
                </div>
                <div class="bagan-data-block">
                  <span class="bagan-title-text">EKOSISTEM DIGITAL</span>
                  <span class="bagan-desc-text">12 Modul Terpadu · Multi-Unit</span>
                </div>
              </div> 
            </div>

            <!-- Konten Teks Kedua -->
            <div class="wing-text-content wing-text-left">
              <div class="hero-badge-pill">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs">
                  <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                  PLATFORM EKOSISTEM DIGITAL SEKOLAH TERPADU
                </span>
              </div>

              <h1 id="hero-h1">Sistem operasi<br />untuk sekolah Anda.</h1>

              <div class="hero-marketing-headline mt-2 mb-1">
                <p class="font-display font-extrabold text-navy-950 tracking-tight leading-tight headline-text">
                  <span class="text-cyan-600">Mewujudkan</span> Transformasi Digital Sekolah &amp; Madrasah Modern
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Spacer / Portal Window Slot for desktop 3-col grid and mobile order centering -->
        <div class="hero-portal-window-slot" aria-hidden="true"></div>

        <!-- Sayap Kanan: Text Pertama + Bagan Warna Cyan & Teks Navy di Sisi Kanan -->
        <div class="hero-wing hero-wing-right">
          <div class="wing-inner-layout wing-right-layout">
            <!-- Konten Teks Pertama -->
            <div class="wing-text-content wing-text-right">
              <!-- <p class="hero-operational-desc">
                Kelola seluruh operasional akademik, keuangan SPP terpadu, presensi smart turnstile QR Code, manajemen asrama/boarding school, hingga komunikasi wali santri dalam satu platform cerdas tanpa data terisolasi.
              </p> -->

              <!-- Checklist Benefit Points -->
              <div class="hero-benefit-list mt-2 lg:mt-3 space-y-2">
                <div class="benefit-item">
                  <span class="benefit-check">✓</span>
                  <span class="benefit-text">1 Akun Terpadu untuk Yayasan, Kepala Sekolah, Guru &amp; Orang Tua</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-check">✓</span>
                  <span class="benefit-text">Real-time Sinkronisasi Tanpa Server Lokal yang Rumit</span>
                </div>
              </div>

              <!-- Bagan warna cyan dan text berwarna navy di sisi kanan text pertama -->
              <div class="wing-bagan-card wing-bagan-right mt-2.5 lg:mt-5" aria-hidden="true">
                <div class="bagan-accent-line"></div>
                <div class="bagan-body">
                  <div class="bagan-tag-row">
                    <span class="bagan-status-dot"></span>
                    <span class="bagan-tag-text">OPERASIONAL</span>
                  </div>
                  <div class="bagan-data-block">
                    <span class="bagan-title-text">SATU DATA TERPADU</span>
                    <span class="bagan-desc-text">Kelola seluruh operasional akademik, keuangan SPP terpadu, presensi smart turnstile QR Code, manajemen Boarding School/Asrama, hingga komunikasi wali siswa dalam satu platform cerdas</span>
                  </div>
                </div>
              </div>
            </div>

            <!--  -->
            <!--  -->
          </div>
        </div>
      </div>

      <!-- 5. Rising Ledge: Houses key facts, and secondary CTA -->
      <div class="ledge" :class="{ 'is-active': isOpen }">
        <div class="pitch">
          <div class="pitch-brand-row">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs">
              <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              PLATFORM EKOSISTEM DIGITAL SEKOLAH TERPADU
            </span>
          </div>

          <p class="text-xl sm:text-2xl font-display font-extrabold text-navy-950 tracking-tight">
            Sistem Operasi Sekolah Modern
          </p>

          <p class="lede">
            Kelola seluruh operasional akademik, keuangan SPP terpadu, presensi smart turnstile QR Code, manajemen asrama/boarding school, hingga komunikasi wali santri dalam satu platform cerdas tanpa data terisolasi.
          </p>
        </div>

        <dl class="facts">
          <div class="fact-item">
            <dt>Ekosistem</dt>
            <dd>12 aplikasi per peran</dd>
          </div>
          <div class="fact-item">
            <dt>Arsitektur</dt>
            <dd>Multi-Unit: TK · SD/MI · SMP/MTS · SMA/SMK/MA · Ekstrakulikuler · Boarding School/Asrama</dd>
          </div>
          <div class="fact-item">
            <dt>Transparansi</dt>
            <dd>Satu data · Status jujur</dd>
          </div>
        </dl>

        <div class="cta-box">
          <p class="tagline-stat"><strong>1 Data</strong> lintas unit &amp; peran</p>
          <div class="cta-actions">
            <NuxtLink to="/kontak" class="btn btn-primary">Konsultasikan Kebutuhan Anda</NuxtLink>
            <NuxtLink to="/fitur" class="btn btn-secondary">Lihat 12 Aplikasi Terpadu →</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Zero-JS Accessible Fallback Notice -->
    <noscript>
      <div class="hero-nojs-notice" aria-hidden="true">
        <span class="sr-only">Versi tampilan statis tanpa JavaScript.</span>
      </div>
    </noscript>
  </section>
</template>

<style scoped>
/* Base hero layout */
.hero-cliff {
  position: relative;
  width: 100%;
  height: 100svh;
  background-color: var(--ssd-wall, #f6f9fc);
  color: var(--color-navy-950, #0a2036);
  --p: 0;
  --e: 0;
  --b: 0;
  --over: 0%;
}

.hero-cliff.is-scrolly {
  height: 250svh;
}

.stage {
  position: sticky;
  top: 0;
  height: 100svh;
  width: 100%;
  overflow: hidden;
  background-color: var(--ssd-wall, #f6f9fc);
  background-image: var(--ssd-grain);
}

/* Knockout typography - 100% identical coordinate & font metrics for both layers */
.portal-type {
  position: absolute;
  top: 53%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  font-family: var(--font-display, "Bricolage Grotesque", sans-serif);
  font-weight: 800;
  font-variation-settings: "opsz" 72, "wdth" 108;
  font-size: clamp(3rem, min(12vw, 19.5vh), 196px);
  line-height: 0.88;
  letter-spacing: -0.035em;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  user-select: none;
  z-index: 2;
  opacity: calc(1 - var(--e, 0) * 1.8);
  transition: opacity 60ms linear;
}

.portal-type.type-out {
  color: var(--color-navy-900, #12355b);
}

.portal-type.type-out .type-line-digital {
  color: #01a8cf;
}

.portal-type.type-in {
  color: #ffffff;
  z-index: 4;
  text-shadow: 0 2px 18px rgba(8, 28, 56, 0.35);
}

.portal-type.type-in .type-line-digital-in {
  color: #ffffff;
}

.type-line {
  display: block;
}

/* Aperture media container */
.media {
  position: absolute;
  inset: 0;
  z-index: 3;
  overflow: hidden;
  background: #0c3161;
  will-change: clip-path;
  clip-path: inset(23% 35% 23% 35% round 130px 24px 24px 24px);
}

/* Authentic Lower Wing Logo SSD.svg Backdrop in Navy */
.ssd-logo-portal-art {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: calc(0.96 - var(--e, 0) * 0.45);
}

.ssd-portal-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.pan {
  position: absolute;
  inset: -4%;
  width: 108%;
  height: 108%;
  will-change: transform;
}

@keyframes ssd-drift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  100% {
    transform: translate3d(-1.4%, 1%, 0) scale(1.04);
  }
}

.is-scrolly .pan {
  animation: ssd-drift 18s ease-in-out infinite alternate;
}

.scrim {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(12, 49, 97, calc(0.05 + var(--e, 0) * 0.25)) 0%,
    rgba(8, 28, 56, calc(0.18 + var(--e, 0) * 0.55)) 100%
  );
  pointer-events: none;
  z-index: 3;
}

.reveal-frame {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.22),
              inset 0 0 40px rgba(1, 168, 207, 0.25);
  pointer-events: none;
  z-index: 5;
}

/* Login Preview Inside Portal (login-ssd.svg) */
.hero-login-preview {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  opacity: calc(0.35 + var(--e, 0) * 0.65);
}

.login-window-frame {
  width: 100%;
  max-width: 820px;
  background: rgba(12, 49, 97, 0.85);
  border: 1px solid rgba(1, 168, 207, 0.4);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 60px -12px rgba(8, 28, 56, 0.6), 0 0 40px rgba(1, 168, 207, 0.15);
  backdrop-filter: blur(12px);
}

.window-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background: rgba(8, 28, 56, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.window-dots {
  display: flex;
  gap: 6px;
}

.window-dots .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.window-dots .dot.red { background: #ff5f56; }
.window-dots .dot.yellow { background: #ffbd2e; }
.window-dots .dot.green { background: #27c93f; }

.window-title {
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  color: #2cc6e4;
  letter-spacing: 0.05em;
}

.window-body {
  width: 100%;
  background: #f4f7fb;
  overflow: hidden;
}

.login-screen-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  object-position: top center;
}

/* Captions — positioned cleanly below the 72px header so zero text overlap occurs */
.caption,
.hint {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-family: var(--font-mono, monospace);
  font-size: clamp(0.68rem, 1.1vw, 0.8rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ssd-accent-text, #00758f);
  z-index: 4;
  pointer-events: none;
  opacity: calc(1 - var(--e, 0) * 3);
  transition: opacity 60ms linear;
  white-space: nowrap;
}

.caption {
  top: clamp(86px, 10.5vh, 108px);
}

.caption-pill {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(1, 168, 207, 0.25);
  box-shadow: 0 2px 10px rgba(12, 49, 97, 0.05);
  color: #0c3161;
  font-weight: 600;
}

.hint {
  bottom: clamp(18px, 3vh, 32px);
}

/* Rising Ledge */
.ledge {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  transform: translate3d(0, calc((1 - var(--b, 0)) * 105%), 0);
  pointer-events: none;
  background: rgba(246, 249, 252, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(18, 53, 91, 0.12);
  box-shadow: 0 -12px 32px rgba(10, 32, 54, 0.08);
  padding: clamp(1.25rem, 2.5vw, 2.25rem) clamp(1rem, 4vw, 3rem);
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(1.5rem, 3vw, 3rem);
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
}

.hero-cliff.is-open .ledge,
.ledge.is-active {
  pointer-events: auto;
}

/* ==================== HERO FLANK WINGS (Left & Right Flanks) ==================== */
.hero-flanks-layer {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  display: grid;
  grid-template-columns: minmax(300px, 1.25fr) minmax(340px, 440px) minmax(300px, 1.25fr);
  align-items: center;
  max-width: 1480px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 3vw, 2.5rem);
  gap: clamp(1rem, 2.5vw, 2.5rem);
  opacity: calc(1 - var(--e, 0) * 2.6);
  transition: opacity 80ms linear;
}

.hero-wing {
  pointer-events: auto;
  transition: transform 80ms linear;
}

.hero-wing-left {
  transform: translateX(calc(var(--e, 0) * -50px));
}

.hero-wing-right {
  transform: translateX(calc(var(--e, 0) * 50px));
}

.hero-portal-window-slot {
  pointer-events: none;
  min-height: 200px;
}

.wing-inner-layout {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
}

.wing-left-layout {
  flex-direction: row;
}

.wing-right-layout {
  flex-direction: row;
}

/* Wing Text Content */
.wing-text-content {
  flex: 1;
  min-width: 0;
}

.wing-text-left h1 {
  font-family: var(--font-display, sans-serif);
  font-size: clamp(1.6rem, 2.4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: var(--color-navy-950, #0a2036);
  margin: 0.5rem 0 0.5rem 0;
}

.headline-text {
  font-size: clamp(0.95rem, 1.35vw, 1.3rem);
  font-weight: 800;
  color: var(--color-navy-950, #0a2036);
  line-height: 1.25;
}

.hero-operational-desc {
  font-size: clamp(0.8125rem, 1vw, 0.95rem);
  line-height: 1.55;
  color: var(--ssd-text-secondary, #46607a);
  margin: 0;
}

.hero-benefit-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.benefit-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  font-size: clamp(0.72rem, 0.85vw, 0.8rem);
  font-weight: 500;
  background: rgba(12, 49, 97, 0.04);
  color: #0c3161;
  border: 1px solid rgba(12, 49, 97, 0.08);
}

.benefit-check {
  color: #01a8cf;
  font-weight: 800;
  font-size: 0.85rem;
}

/* ==================== CYAN BAGAN CARDS (Cyan Box + Navy Text) ==================== */
.wing-bagan-card {
  display: flex;
  background: linear-gradient(135deg, rgba(1, 168, 207, 0.15) 0%, rgba(1, 168, 207, 0.04) 100%);
  border: 1.5px solid rgba(1, 168, 207, 0.45);
  border-radius: 14px;
  padding: 0.85rem 0.95rem;
  box-shadow: 0 4px 16px rgba(1, 168, 207, 0.12), inset 0 0 12px rgba(1, 168, 207, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.wing-bagan-left {
  border-left: 4px solid #01a8cf;
}

.wing-bagan-right {
  border-left: 4px solid #01a8cf;
}

.bagan-accent-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3.5px;
  background: #01a8cf;
}
.wing-bagan-left .bagan-accent-line { left: 0; }
.wing-bagan-right .bagan-accent-line { left: 0; }

.bagan-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  gap: 0.35rem;
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
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #0c3161;
  text-transform: uppercase;
}

.bagan-data-block {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.bagan-title-text {
  font-family: var(--font-display, sans-serif);
  font-size: 0.825rem;
  font-weight: 800;
  color: #0c3161;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.bagan-desc-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: #0c3161;
  opacity: 0.85;
}

/* Ledge Pitch */
.pitch-brand-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.pitch .eyebrow {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ssd-accent-text, #00758f);
  margin: 0;
}

.pitch h1 {
  font-family: var(--font-display, sans-serif);
  font-size: clamp(1.75rem, 2.6vw, 3rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: var(--color-navy-950, #0a2036);
  margin: 0 0 0.75rem 0;
}

.pitch .lede {
  font-size: clamp(0.875rem, 1.1vw, 1rem);
  line-height: 1.5;
  color: var(--ssd-text-secondary, #46607a);
  margin: 0;
  max-width: 48ch;
}

/* Ledge Facts */
.facts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0 1rem;
  border-left: 1px solid rgba(18, 53, 91, 0.12);
  border-right: 1px solid rgba(18, 53, 91, 0.12);
}

.fact-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.fact-item dt {
  font-family: var(--font-mono, monospace);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ssd-accent-text, #00758f);
}

.fact-item dd {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-navy-900, #12355b);
  margin: 0;
}

/* Ledge CTA Box */
.cta-box {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tagline-stat {
  font-size: 0.85rem;
  color: var(--ssd-text-secondary, #46607a);
  margin: 0;
}

.tagline-stat strong {
  color: var(--color-navy-900, #12355b);
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 180ms ease;
  min-height: 44px;
}

.btn-primary {
  background-color: var(--color-navy-900, #12355b);
  color: #ffffff;
}

.btn-primary:hover {
  background-color: var(--color-navy-800, #1b4673);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-navy-900, #12355b);
  border: 1px solid rgba(18, 53, 91, 0.2);
}

.btn-secondary:hover {
  background-color: rgba(18, 53, 91, 0.04);
}

/* Responsive Breakpoints */
@media (max-width: 1023px) {
  .portal-type {
    top: 44%;
    font-size: clamp(2.75rem, 11vw, 4.5rem);
  }

  .hero-flanks-layer {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: clamp(4.5rem, 9vh, 5.5rem) 1.25rem clamp(1.75rem, 3.5vh, 2.5rem) 1.25rem;
    gap: 0.75rem;
    max-width: 600px;
    height: 100svh;
    max-height: 100svh;
  }

  .hero-wing-left {
    order: 1;
    width: 100%;
    transform: translateY(calc(var(--e, 0) * -35px));
  }

  .hero-portal-window-slot {
    order: 2;
    flex: 1;
    min-height: 200px;
    max-height: 280px;
    width: 100%;
  }

  .hero-wing-right {
    order: 3;
    width: 100%;
    transform: translateY(calc(var(--e, 0) * 35px));
  }

  .wing-inner-layout {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .wing-bagan-card {
    padding: 0.65rem 0.85rem;
    border-radius: 12px;
    border-left: 4px solid #01a8cf;
    border-right: 1.5px solid rgba(1, 168, 207, 0.45);
  }

  .bagan-body {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    gap: 0.35rem;
    text-align: left;
  }

  .bagan-data-block {
    text-align: left;
  }

  .wing-text-left h1 {
    font-size: clamp(1.35rem, 4.5vw, 1.75rem);
    margin: 0.35rem 0;
  }

  .headline-text {
    font-size: clamp(0.85rem, 3vw, 1.05rem);
  }

  .hero-operational-desc {
    font-size: clamp(0.72rem, 2.4vw, 0.8rem);
    line-height: 1.45;
  }

  .benefit-item {
    padding: 0.35rem 0.65rem;
    font-size: clamp(0.68rem, 2.2vw, 0.75rem);
  }

  .cta-actions.hero-actions {
    margin-top: 0.5rem;
    gap: 0.5rem;
  }

  .cta-actions.hero-actions .btn {
    padding: 0.5rem 0.85rem;
    font-size: 0.78rem;
    min-height: 38px;
    flex: 1;
  }

  .caption {
    display: none;
  }

  .hint {
    bottom: 8px;
    font-size: 0.65rem;
  }
}

/* Mobile Duo-Color Knockout Typography Adjustment for SCHOOL SMART DIGITAL */
@media (max-width: 767px) {
  .portal-type {
    top: 43%;
    font-size: clamp(2.55rem, 13vw, 3.8rem);
  }

  .portal-type.type-out {
    color: #0c3161;
  }

  .portal-type.type-out .type-line-digital {
    color: #01a8cf;
  }

  .portal-type.type-in {
    color: #ffffff;
    text-shadow: 0 2px 16px rgba(8, 28, 56, 0.45);
  }

  .portal-type.type-in .type-line-digital-in {
    color: #2cc6e4;
    text-shadow: 0 2px 14px rgba(8, 28, 56, 0.5);
  }
}

@media (max-width: 1099px) {
  .ledge {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    padding: 1.25rem 1.5rem;
  }
  .facts {
    display: none;
  }
}

@media (max-width: 719px) {
  .mockup-kpi-grid {
    grid-template-columns: 1fr;
  }
  .ledge {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    border-radius: 16px 16px 0 0;
  }
  .cta-actions {
    flex-direction: row;
  }
  .btn {
    flex: 1;
  }
}

/* Accessibility & Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .hero-cliff {
    height: auto !important;
    min-height: 100svh;
  }

  .stage {
    position: relative !important;
    height: auto !important;
    min-height: 100svh;
    overflow: visible !important;
  }

  .portal-type,
  .caption,
  .hint {
    display: none !important;
  }

  .hero-flanks-layer {
    display: none !important;
  }

  .media {
    position: relative !important;
    clip-path: none !important;
    min-height: 50svh;
  }

  .is-scrolly .pan {
    animation: none !important;
  }

  .ledge {
    position: relative !important;
    transform: none !important;
    pointer-events: auto !important;
    opacity: 1 !important;
    box-shadow: none;
    border-top: none;
  }
}

/* Zero-JS Progressive Enhancement for Modern Browsers */
@media (scripting: none) {
  .hero-cliff { height: auto !important; min-height: 100svh; }
  .stage { position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important; }
  .portal-type, .caption, .hint { display: none !important; }
  .hero-flanks-layer { display: none !important; }
  .media { position: relative !important; clip-path: none !important; min-height: 50svh; }
  .is-scrolly .pan { animation: none !important; }
  .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }
}
</style>

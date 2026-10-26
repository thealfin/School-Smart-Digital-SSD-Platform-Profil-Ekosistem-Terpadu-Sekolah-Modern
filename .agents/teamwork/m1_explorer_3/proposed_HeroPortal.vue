<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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

  // Initial aperture dimensions (w0, h0)
  let w0: number
  let h0: number
  if (W < 720) {
    w0 = 0.62 * W
    h0 = Math.min(0.48 * H, 1.35 * w0)
  } else {
    w0 = Math.min(Math.max(0.24 * W, 220), 420)
    h0 = Math.min(0.58 * H, 1.38 * w0)
  }

  // Morph interpolation to full screen
  const w = w0 + (W - w0) * e
  const side = (W - w) / 2
  const cy = 0.52 * H
  const top = (cy - h0 / 2) * (1 - e)
  const bottom = (H - cy - h0 / 2) * (1 - e)

  // Signature S-Curve corner radii
  const rTL = (0.44 * w0) * (1 - e)
  const rOther = 18 * (1 - e)

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
  isOpen.value = (b >= 0.5)
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
      <!-- 1. Knockout Typography: Wall layer (Navy on light wall) -->
      <p class="portal-type type-out" aria-hidden="true">
        <span class="type-line">SCHOOL</span>
        <span class="type-line">SMART</span>
      </p>

      <!-- 2. S-Curve Morph Aperture Media -->
      <div ref="mediaEl" class="media">
        <div class="pan">
          <!-- Slot for rich living stage (Back Office + Womi + Gate) -->
          <slot name="media">
            <div class="hero-stage-mockup">
              <div class="mockup-header">
                <div class="mockup-dots">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
                <span class="mockup-badge">Data Demo · Terpadu</span>
              </div>
              <div class="mockup-body">
                <div class="mockup-kpi-grid">
                  <div class="mockup-kpi-card">
                    <span class="kpi-label">Presensi Real-time</span>
                    <span class="kpi-val">99.4%</span>
                    <span class="kpi-note">1.280 Siswa Tap In</span>
                  </div>
                  <div class="mockup-kpi-card">
                    <span class="kpi-label">Izin Pulang Aktif</span>
                    <span class="kpi-val">2 Siswa</span>
                    <span class="kpi-note">Verifikasi Satpam Gerbang</span>
                  </div>
                  <div class="mockup-kpi-card">
                    <span class="kpi-label">Status Satu Data</span>
                    <span class="kpi-val">Sinkron</span>
                    <span class="kpi-note">12 Aplikasi Terhubung</span>
                  </div>
                </div>
              </div>
            </div>
          </slot>
        </div>

        <div class="scrim" aria-hidden="true"></div>

        <!-- Knockout Typography: Portal layer (White on dark Navy stage, pixel-identical) -->
        <p class="portal-type type-in" aria-hidden="true">
          <span class="type-line">SCHOOL</span>
          <span class="type-line">SMART</span>
        </p>

        <!-- Internal frame subtle shadow / highlight -->
        <div class="reveal-frame" aria-hidden="true"></div>
      </div>

      <!-- 3. Aperture Ambient Labels (fade out as aperture opens) -->
      <p class="caption" aria-hidden="true">
        <span>Ekosistem 12 Aplikasi Sekolah · Satu Data Terpadu</span>
      </p>
      <p class="hint" aria-hidden="true">
        <span>Scroll untuk membuka sistem ↓</span>
      </p>

      <!-- 4. Rising Ledge: Houses semantic <h1>, key facts, and CTA buttons -->
      <div class="ledge" :class="{ 'is-active': isOpen }">
        <div class="pitch">
          <p class="eyebrow">School Smart Digital · SSD</p>
          <h1 id="hero-h1">Sistem operasi<br />untuk sekolah Anda.</h1>
          <p class="lede">
            Dari gerbang sekolah sampai rekening yayasan — absensi, keuangan,
            keamanan, dan komunikasi orang tua tersambung dalam satu data.
          </p>
        </div>

        <dl class="facts">
          <div class="fact-item">
            <dt>Ekosistem</dt>
            <dd>12 aplikasi per peran</dd>
          </div>
          <div class="fact-item">
            <dt>Arsitektur</dt>
            <dd>Multi-unit (SD · SMP · TPQ · Pondok)</dd>
          </div>
          <div class="fact-item">
            <dt>Transparansi</dt>
            <dd>Satu data · Status jujur</dd>
          </div>
        </dl>

        <div class="cta-box">
          <p class="tagline-stat"><strong>1 Data</strong> lintas unit &amp; peran</p>
          <div class="cta-actions">
            <a href="#demo" class="btn btn-primary">Jadwalkan Demo</a>
            <a href="#ekosistem" class="btn btn-secondary">Lihat 12 Aplikasi ↓</a>
          </div>
        </div>
      </div>
    </div>
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

/* Knockout typography - 100% identical styling for both layers */
.portal-type {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  font-family: var(--font-display, "Bricolage Grotesque", sans-serif);
  font-weight: 800;
  font-variation-settings: "opsz" 72, "wdth" 108;
  font-size: min(15.5vw, 30vh, 260px);
  line-height: 0.86;
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

.portal-type.type-in {
  color: #ffffff;
  z-index: 4;
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
  background: radial-gradient(circle at 50% 30%, #12355b 0%, #0a2036 100%);
  will-change: clip-path;
  clip-path: inset(22% 38% 22% 38% round 120px 18px 18px 18px);
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
  background: radial-gradient(circle at 50% 50%, rgba(10, 32, 54, 0.2) 0%, rgba(10, 32, 54, 0.75) 100%);
  pointer-events: none;
  z-index: 3;
}

.reveal-frame {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 40px rgba(0, 180, 216, 0.15);
  pointer-events: none;
  z-index: 5;
}

/* Default living mockup stage */
.hero-stage-mockup {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #ffffff;
}

.mockup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 680px;
  background: rgba(18, 53, 91, 0.6);
  border: 1px solid rgba(0, 180, 216, 0.3);
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  padding: 0.75rem 1rem;
}

.mockup-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
}

.mockup-badge {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--color-cyan-400, #2cc6e4);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mockup-body {
  width: 100%;
  max-width: 680px;
  background: rgba(10, 32, 54, 0.85);
  border: 1px solid rgba(0, 180, 216, 0.3);
  border-radius: 0 0 12px 12px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
}

.mockup-kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.mockup-kpi-card {
  background: rgba(18, 53, 91, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.kpi-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.kpi-val {
  font-family: var(--font-display, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-cyan-400, #2cc6e4);
}

.kpi-note {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Captions */
.caption,
.hint {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-family: var(--font-mono, monospace);
  font-size: clamp(0.7rem, 1.2vw, 0.85rem);
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
  top: clamp(16px, 3vh, 32px);
}

.hint {
  bottom: clamp(16px, 3vh, 32px);
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
  background: rgba(246, 249, 252, 0.94);
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

/* Ledge Pitch */
.pitch .eyebrow {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ssd-accent-text, #00758f);
  margin-bottom: 0.5rem;
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
</style>

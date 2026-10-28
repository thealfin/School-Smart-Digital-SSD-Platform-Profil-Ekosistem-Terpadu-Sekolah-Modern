<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  SSD_LOGO_VIEWBOX,
  SSD_LOGO_NAVY_PATH,
  SSD_LOGO_CYAN_PATH,
  SSD_LOGO_NAVY_COLOR,
  SSD_LOGO_CYAN_COLOR,
} from '~/utils/ssd-logo-paths'
import { APK_ICON_FILES } from '~/utils/apkIcons'

// Zero-JS Fallback Stylesheet for Legacy Crawlers (injected safely into <head>)
useHead({
  noscript: [
    {
      innerHTML: `<style>.hero-cliff { height: auto !important; min-height: 100svh; } .stage { position: relative !important; height: auto !important; min-height: 100svh; overflow: visible !important; } .portal-type, .caption, .hint, .s-curve-portal-stage { display: none !important; } .hero-flanks-layer { display: none !important; } .media { position: relative !important; clip-path: none !important; min-height: 50svh; opacity: 1 !important; } .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }</style>`,
    },
  ],
})

const rootEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const mediaEl = ref<HTMLElement | null>(null)
const threeCanvasEl = ref<HTMLCanvasElement | null>(null)

const isScrolly = ref(false)
const isOpen = ref(false)
const prefersReducedMotion = ref(false)
const currentScrollE = ref(0)

// 5 Floating APK Icons positioned along the right curve of the S-portal
const portalApkBadges = [
  {
    id: 'pimpinan',
    label: 'SSD Pimpinan & Yayasan',
    icon: APK_ICON_FILES.pimpinan,
    badgeClass: 'apk-float-1',
    isCallout: true,
  },
  {
    id: 'pegawai',
    label: 'SSD Pegawai & Guru',
    icon: APK_ICON_FILES.pegawai,
    badgeClass: 'apk-float-2',
    isCallout: false,
  },
  {
    id: 'wali-murid',
    label: 'SSD Wali Murid',
    icon: APK_ICON_FILES.waliMurid,
    badgeClass: 'apk-float-3',
    isCallout: false,
  },
  {
    id: 'security',
    label: 'SSD Security & Turnstile',
    icon: APK_ICON_FILES.security,
    badgeClass: 'apk-float-4',
    isCallout: false,
  },
  {
    id: 'mitra-usaha',
    label: 'SSD Mitra Usaha & Kantin',
    icon: APK_ICON_FILES.mitraUsaha,
    badgeClass: 'apk-float-5',
    isCallout: false,
  },
]

let ticking = false
let threeCleanup: (() => void) | null = null

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
    currentScrollE.value = 1
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

  // Initial aperture dimensions (w0, h0) matching authentic SSD Logo proportions
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
    cy = 0.50 * H
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
  currentScrollE.value = e

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

/**
 * Initialize Three.js 3D S-Curve Ribbon & Glossy Specular Lighting inside the S-portal mask
 */
async function initThreePortal() {
  const canvas = threeCanvasEl.value
  if (!canvas || prefersReducedMotion.value) return

  try {
    const THREE = await import('three')

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(canvas.clientWidth || 560, canvas.clientHeight || 640, false)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, (canvas.clientWidth || 560) / (canvas.clientHeight || 640), 0.1, 100)
    camera.position.set(0, 0, 8.2)

    // Lighting setup for glossy 3D navy-to-cyan S-curve surface
    const ambientLight = new THREE.AmbientLight(0x0c3161, 2.2)
    scene.add(ambientLight)

    const topCyanLight = new THREE.PointLight(0x38bdf8, 5.5, 18)
    topCyanLight.position.set(2.4, 3.2, 4.0)
    scene.add(topCyanLight)

    const bottomCyanLight = new THREE.PointLight(0x01a8cf, 4.8, 18)
    bottomCyanLight.position.set(-2.2, -3.0, 3.5)
    scene.add(bottomCyanLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0)
    rimLight.position.set(0, 1.5, 5)
    scene.add(rimLight)

    // Create 3D S-Curve Tube / Ribbon Geometry matching the SSD S-swoosh
    const sCurvePoints = [
      new THREE.Vector3(1.85, 2.95, -0.3),
      new THREE.Vector3(0.15, 1.85, 0.25),
      new THREE.Vector3(-1.35, 0.55, 0.45),
      new THREE.Vector3(0.0, -0.15, 0.55),
      new THREE.Vector3(1.45, -1.05, 0.4),
      new THREE.Vector3(-0.25, -2.25, 0.15),
      new THREE.Vector3(-1.95, -3.05, -0.25),
    ]
    const curve = new THREE.CatmullRomCurve3(sCurvePoints)
    const tubeGeo = new THREE.TubeGeometry(curve, 96, 1.05, 32, false)

    const tubeMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0c3161'),
      emissive: new THREE.Color('#061a38'),
      roughness: 0.22,
      metalness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
      transparent: true,
      opacity: 0.92,
    })

    const sMesh = new THREE.Mesh(tubeGeo, tubeMat)
    scene.add(sMesh)

    // Secondary cyan accent ribbon hugging the inner S-curve
    const accentCurvePoints = [
      new THREE.Vector3(2.0, 3.05, 0.1),
      new THREE.Vector3(-0.85, 1.1, 0.65),
      new THREE.Vector3(1.15, -0.85, 0.7),
      new THREE.Vector3(-1.8, -2.95, 0.1),
    ]
    const accentCurve = new THREE.CatmullRomCurve3(accentCurvePoints)
    const accentGeo = new THREE.TubeGeometry(accentCurve, 72, 0.34, 24, false)
    const accentMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#01a8cf'),
      emissive: new THREE.Color('#0284c7'),
      emissiveIntensity: 0.45,
      roughness: 0.18,
      metalness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.75,
    })
    const accentMesh = new THREE.Mesh(accentGeo, accentMat)
    scene.add(accentMesh)

    let animFrameId = 0
    let startTime = performance.now()

    const animate = (now: number) => {
      animFrameId = requestAnimationFrame(animate)
      const elapsed = (now - startTime) * 0.001
      const eVal = currentScrollE.value

      // Subtle 3D breathing & scroll-linked rotation
      sMesh.rotation.y = Math.sin(elapsed * 0.9) * 0.12 + eVal * 0.45
      sMesh.rotation.x = Math.cos(elapsed * 0.7) * 0.06 - eVal * 0.2
      accentMesh.rotation.y = Math.sin(elapsed * 0.9 + 0.4) * 0.14 + eVal * 0.55

      topCyanLight.position.x = 2.4 + Math.sin(elapsed * 1.3) * 0.6
      bottomCyanLight.position.x = -2.2 + Math.cos(elapsed * 1.1) * 0.6

      renderer.render(scene, camera)
    }

    animFrameId = requestAnimationFrame(animate)

    const onResizeCanvas = () => {
      if (!canvas) return
      const w = canvas.clientWidth || 560
      const h = canvas.clientHeight || 640
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResizeCanvas, { passive: true })

    threeCleanup = () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', onResizeCanvas)
      tubeGeo.dispose()
      tubeMat.dispose()
      accentGeo.dispose()
      accentMat.dispose()
      renderer.dispose()
    }
  } catch {
    // Graceful fallback to the SVG S-curve mask if WebGL context is unavailable
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
    initThreePortal()
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScrollOrResize)
    window.removeEventListener('resize', onScrollOrResize)
  }
  if (threeCleanup) {
    threeCleanup()
    threeCleanup = null
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
      <!-- Hidden SVG ClipPath Definition for the Organic S-Curve Portal Mask -->
      <svg class="sr-only" width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id="ssd-s-curve-portal-mask" clipPathUnits="objectBoundingBox">
            <!-- Smooth S-Curve Swoosh Silhouette matching Hero banner tampilan baru dengan portal view baru.png -->
            <path
              d="M 0.90,0.02 C 0.56,0.09 0.16,0.25 0.15,0.47 C 0.14,0.61 0.30,0.67 0.36,0.72 C 0.29,0.82 0.17,0.91 0.06,0.97 C 0.42,0.93 0.85,0.78 0.86,0.53 C 0.87,0.38 0.72,0.31 0.65,0.26 C 0.72,0.16 0.81,0.08 0.90,0.02 Z"
            />
          </clipPath>
        </defs>
      </svg>

      <!-- 1. Knockout Typography: Wall layer (3D Extruded White/Cyan over S-Curve Portal) -->
      <p class="portal-type type-out" aria-hidden="true">
        <span class="type-line">SCHOOL</span>
        <span class="type-line">SMART</span>
        <span class="type-line type-line-digital">DIGITAL</span>
      </p>

      <!-- 1B. S-Curve Masked 3D Portal View & Floating APK Badges (Active in Hero Initial State) -->
      <div class="s-curve-portal-stage" aria-hidden="true">
        <div class="s-curve-portal-inner">
          <!-- Ambient cyan outer glow behind the S-curve -->
          <div class="s-curve-ambient-glow"></div>

          <!-- S-Curve Masked Viewport (SVG Gradient + Three.js 3D WebGL Ribbon) -->
          <div class="s-curve-masked-body">
            <!-- Multi-layered 3D Glossy S-Swoosh SVG Art -->
            <svg
              viewBox="0 0 600 680"
              preserveAspectRatio="xMidYMid meet"
              class="s-curve-vector-art"
            >
              <defs>
                <linearGradient id="sCurveMainGrad" x1="85%" y1="0%" x2="15%" y2="100%">
                  <stop offset="0%" stop-color="#38bdf8" />
                  <stop offset="22%" stop-color="#0284c7" />
                  <stop offset="48%" stop-color="#0c3161" />
                  <stop offset="72%" stop-color="#0a254d" />
                  <stop offset="90%" stop-color="#01a8cf" />
                  <stop offset="100%" stop-color="#7dd3fc" />
                </linearGradient>
                <linearGradient id="sCurveInnerFold" x1="20%" y1="15%" x2="80%" y2="85%">
                  <stop offset="0%" stop-color="#082042" stop-opacity="0.95" />
                  <stop offset="50%" stop-color="#0c3161" stop-opacity="0.88" />
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0.92" />
                </linearGradient>
                <linearGradient id="sCurveRimHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.85" />
                  <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.8" />
                </linearGradient>
              </defs>

              <!-- Outer S-Swoosh Ribbon -->
              <path
                d="M 540,14 C 335,58 96,168 90,320 C 85,415 182,455 218,490 C 175,556 102,618 36,660 C 254,632 510,530 516,360 C 521,258 430,210 390,176 C 432,108 486,54 540,14 Z"
                fill="url(#sCurveMainGrad)"
              />

              <!-- Inner 3D Fold Contour for depth matching reference image -->
              <path
                d="M 480,52 C 320,105 142,195 138,322 C 134,405 235,442 268,482 C 232,535 162,592 92,638 C 268,602 468,508 472,358 C 476,268 380,224 342,184 C 378,126 430,84 480,52 Z"
                fill="url(#sCurveInnerFold)"
              />

              <!-- Specular Rim Highlight -->
              <path
                d="M 540,14 C 335,58 96,168 90,320 C 85,415 182,455 218,490 C 175,556 102,618 36,660 C 254,632 510,530 516,360 C 521,258 430,210 390,176 C 432,108 486,54 540,14 Z"
                fill="none"
                stroke="url(#sCurveRimHighlight)"
                stroke-width="3"
              />
            </svg>

            <!-- Three.js 3D WebGL Canvas Masked inside the S-Curve -->
            <canvas ref="threeCanvasEl" class="portal-three-canvas"></canvas>
          </div>

          <!-- Floating APK Icon Badges along the Right Arc of the S-Curve Portal -->
          <div class="s-curve-apk-orbit">
            <div
              v-for="badge in portalApkBadges"
              :key="badge.id"
              class="apk-orbit-badge"
              :class="[badge.badgeClass, { 'is-callout-card': badge.isCallout }]"
              :title="badge.label"
            >
              <div class="apk-orbit-icon-wrap">
                <img
                  :src="badge.icon"
                  :alt="badge.label"
                  class="apk-orbit-img"
                  loading="eager"
                />
              </div>
              <span v-if="badge.isCallout" class="apk-callout-pointer"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. S-Curve Morph Aperture Media (Expands to Full Viewport on Scroll) -->
      <div ref="mediaEl" class="media">
        <div class="pan">
          <!-- Authentic Lower Wing Logo SSD.svg Shape in Navy (#0C3161) -->
          <div class="ssd-logo-portal-art" aria-hidden="true">
            <svg
              :viewBox="SSD_LOGO_VIEWBOX"
              preserveAspectRatio="none"
              class="ssd-portal-svg"
            >
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
        <span>SCROLL UNTUK MEMBUKA SISTEM ↓</span>
      </p>

      <!-- 4. Hero Flank Wings Layer: Desktop Sisi Kiri & Kanan Portal, Mobile Atas & Bawah Portal -->
      <div class="hero-flanks-layer">
        <!-- Sayap Kiri -->
        <div class="hero-wing hero-wing-left">
          <div class="wing-inner-layout wing-left-layout">
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

        <!-- Sayap Kanan: Feature Cards + Bagan Operasional -->
        <div class="hero-wing hero-wing-right">
          <div class="wing-inner-layout wing-right-layout">
            <div class="wing-text-content wing-text-right">
              <!-- Checklist Benefit Feature Cards matching Preview Design -->
              <div class="hero-benefit-list mt-2 lg:mt-3 space-y-2.5">
                <div class="benefit-item benefit-card-elevated">
                  <span class="benefit-check-circle">✓</span>
                  <div class="benefit-card-copy">
                    <span class="benefit-text">1 Akun Terpadu untuk Yayasan, Kepala Sekolah, Guru &amp; Orang Tua</span>
                    <span class="benefit-subtext">Semua pihak dalam ekosistem sekolah dapat mengakses fitur sesuai peran masing-masing dalam satu akun terpadu.</span>
                  </div>
                </div>
                <div class="benefit-item benefit-card-elevated">
                  <span class="benefit-check-circle">✓</span>
                  <div class="benefit-card-copy">
                    <span class="benefit-text">Real-time Sinkronisasi Tanpa Server Lokal yang Rumit</span>
                    <span class="benefit-subtext">Data selalu terbaru secara real-time tanpa perlu instalasi server lokal yang kompleks.</span>
                  </div>
                </div>
              </div>

              <!-- Bagan warna cyan dan text berwarna navy di sisi kanan -->
              <div class="wing-bagan-card wing-bagan-right mt-2.5 lg:mt-4" aria-hidden="true">
                <div class="bagan-accent-line"></div>
                <div class="bagan-body">
                  <div class="bagan-tag-row">
                    <span class="bagan-status-dot"></span>
                    <span class="bagan-tag-text">OPERASIONAL</span>
                  </div>
                  <div class="bagan-data-block">
                    <span class="bagan-title-text">SATU DATA TERPADU</span>
                    <span class="bagan-desc-text">Kelola seluruh operasional akademik, keuangan SPP terpadu, presensi smart turnstile QR Code, manajemen Boarding School/Asrama, hingga komunikasi wali siswa dalam satu platform cerdas.</span>
                  </div>
                </div>
              </div>
            </div>
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

/* Calibrated 3D Extruded Typography sizing over S-Curve Portal */
.stage .portal-type {
  top: 50%;
  font-size: clamp(2.85rem, min(7.2vw, 13.5vh), 108px);
  line-height: 0.92;
  z-index: 5;
}

.portal-type.type-out {
  color: var(--color-navy-900, #12355b);
}

.stage .portal-type.type-out {
  color: #ffffff;
  text-shadow:
    0 4px 0 #cbd5e1,
    0 8px 18px rgba(12, 49, 97, 0.42),
    0 18px 36px rgba(1, 168, 207, 0.28);
}

.portal-type.type-out .type-line-digital {
  color: #01a8cf;
  background: linear-gradient(90deg, #00b4d8 0%, #ffffff 32%, #ffffff 74%, #38bdf8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 6px 14px rgba(12, 49, 97, 0.38));
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

/* ==================== S-CURVE 3D PORTAL STAGE & FLOATING APK ICONS ==================== */
.s-curve-portal-stage {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: calc(1 - var(--e, 0) * 2.1);
  transform: scale(calc(1 + var(--e, 0) * 0.35));
  transition: opacity 60ms linear;
}

.s-curve-portal-inner {
  position: relative;
  width: clamp(300px, 38vw, 540px);
  height: clamp(340px, 68vh, 620px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.s-curve-ambient-glow {
  position: absolute;
  inset: -8%;
  background: radial-gradient(
    circle at 52% 48%,
    rgba(56, 189, 248, 0.28) 0%,
    rgba(1, 168, 207, 0.14) 42%,
    rgba(246, 249, 252, 0) 74%
  );
  filter: blur(24px);
  pointer-events: none;
}

.s-curve-masked-body {
  position: relative;
  width: 100%;
  height: 100%;
  clip-path: url(#ssd-s-curve-portal-mask);
  -webkit-clip-path: url(#ssd-s-curve-portal-mask);
  filter: drop-shadow(0 20px 38px rgba(12, 49, 97, 0.25));
}

.s-curve-vector-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
}

.portal-three-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 2;
  mix-blend-mode: screen;
  opacity: 0.72;
  pointer-events: none;
}

/* Floating APK Icon Badges along the Right Arc of the S-Curve */
.s-curve-apk-orbit {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
}

.apk-orbit-badge {
  position: absolute;
  width: clamp(44px, 4.2vw, 58px);
  height: clamp(44px, 4.2vw, 58px);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid rgba(56, 189, 248, 0.35);
  box-shadow:
    0 12px 28px -6px rgba(12, 49, 97, 0.18),
    0 0 18px rgba(1, 168, 207, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px;
  pointer-events: auto;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease;
  animation: apk-float-bob 5s ease-in-out infinite alternate;
}

.apk-orbit-badge:hover {
  transform: scale(1.12) translateY(-3px);
  box-shadow:
    0 16px 32px -6px rgba(12, 49, 97, 0.26),
    0 0 24px rgba(1, 168, 207, 0.4);
}

/* Top Callout Speech-Bubble Card matching Reference Image */
.apk-orbit-badge.is-callout-card {
  width: clamp(64px, 6.2vw, 86px);
  height: clamp(56px, 5.4vw, 74px);
  border-radius: 18px;
  background: rgba(248, 252, 255, 0.96);
  border: 1.5px solid rgba(56, 189, 248, 0.45);
  padding: 9px;
}

.apk-callout-pointer {
  position: absolute;
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 13px;
  height: 13px;
  background: rgba(248, 252, 255, 0.96);
  border-right: 1.5px solid rgba(56, 189, 248, 0.45);
  border-bottom: 1.5px solid rgba(56, 189, 248, 0.45);
}

.apk-orbit-icon-wrap {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #ffffff;
}

.apk-orbit-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* Exact right-hand S-arc coordinates matching Hero banner tampilan baru dengan portal view baru.png */
.apk-float-1 {
  top: 7%;
  right: 8%;
  animation-delay: 0s;
}

.apk-float-2 {
  top: 24%;
  right: 2%;
  animation-delay: 0.6s;
}

.apk-float-3 {
  top: 39%;
  right: -5%;
  animation-delay: 1.2s;
}

.apk-float-4 {
  top: 55%;
  right: -2%;
  animation-delay: 1.8s;
}

.apk-float-5 {
  top: 71%;
  right: 4%;
  animation-delay: 2.4s;
}

@keyframes apk-float-bob {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -7px, 0);
  }
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
  opacity: calc(var(--e, 0) * 1.45);
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

/* Captions - positioned cleanly below the 72px header so zero text overlap occurs */
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
  z-index: 6;
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
  font-weight: 700;
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
  grid-template-columns: minmax(290px, 1.15fr) minmax(360px, 500px) minmax(290px, 1.15fr);
  align-items: center;
  max-width: 1480px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 3vw, 2.5rem);
  gap: clamp(1rem, 2.2vw, 2.25rem);
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
  gap: 0.65rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.7rem 0.9rem;
  border-radius: 14px;
  font-size: clamp(0.72rem, 0.85vw, 0.8rem);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.92);
  color: #0c3161;
  border: 1px solid rgba(12, 49, 97, 0.08);
  box-shadow: 0 8px 24px -6px rgba(12, 49, 97, 0.07);
}

.benefit-check-circle {
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #00b4d8 0%, #0284c7 100%);
  color: #ffffff;
  font-weight: 800;
  font-size: 0.72rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.1rem;
  box-shadow: 0 3px 8px rgba(1, 168, 207, 0.3);
}

.benefit-card-copy {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.benefit-text {
  font-weight: 700;
  color: #0c3161;
  line-height: 1.3;
}

.benefit-subtext {
  font-size: 0.7rem;
  font-weight: 500;
  color: #46607a;
  line-height: 1.4;
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
  .stage .portal-type {
    top: 44%;
    font-size: clamp(2.35rem, 9.5vw, 3.85rem);
  }

  .s-curve-portal-stage {
    align-items: flex-start;
    padding-top: clamp(11.5rem, 23vh, 15.5rem);
  }

  .s-curve-portal-inner {
    width: clamp(240px, 56vw, 340px);
    height: clamp(230px, 32vh, 320px);
  }

  .apk-orbit-badge {
    width: 36px;
    height: 36px;
    padding: 5px;
  }

  .apk-orbit-badge.is-callout-card {
    width: 48px;
    height: 42px;
    padding: 6px;
  }

  .benefit-subtext {
    display: none;
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
    min-height: 190px;
    max-height: 270px;
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
    padding: 0.4rem 0.65rem;
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
  .stage .portal-type {
    top: 43%;
    font-size: clamp(2.15rem, 11vw, 3.2rem);
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
  .hint,
  .s-curve-portal-stage {
    display: none !important;
  }

  .hero-flanks-layer {
    display: none !important;
  }

  .media {
    position: relative !important;
    clip-path: none !important;
    min-height: 50svh;
    opacity: 1 !important;
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
  .portal-type, .caption, .hint, .s-curve-portal-stage { display: none !important; }
  .hero-flanks-layer { display: none !important; }
  .media { position: relative !important; clip-path: none !important; min-height: 50svh; opacity: 1 !important; }
  .is-scrolly .pan { animation: none !important; }
  .ledge { position: relative !important; transform: none !important; pointer-events: auto !important; opacity: 1 !important; box-shadow: none; border-top: none; }
}
</style>

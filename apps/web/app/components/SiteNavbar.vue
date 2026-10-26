<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const props = withDefaults(
  defineProps<{
    mode?: 'landing' | 'subpage'
    isScrolled?: boolean
  }>(),
  {
    mode: 'landing',
    isScrolled: false,
  }
)

const isDrawerMounted = ref(false)
const isDrawerOpen = ref(false)
const activeSection = ref<string>('')

const drawerEl = ref<HTMLElement | null>(null)
const drawerPanelEl = ref<HTMLElement | null>(null)
const drawerFooterEl = ref<HTMLElement | null>(null)
const menuButtonEl = ref<HTMLButtonElement | null>(null)
const floatingBtnEl = ref<HTMLButtonElement | null>(null)

const navLinks = [
  { label: 'Beranda', to: '/' },
  { label: 'Fitur', to: '/fitur' },
  { label: 'Galeri', to: '/galeri' },
  { label: 'Berita', to: '/berita' },
  { label: 'Tentang Kami', to: '/tentang' },
]

const route = useRoute()

function isLinkActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(to + '/')
}

function openDrawer() {
  if (isDrawerOpen.value) return
  isDrawerMounted.value = true
  isDrawerOpen.value = true

  if (import.meta.client) {
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (drawerEl.value && drawerPanelEl.value && !prefersReduced) {
        const backdrop = drawerEl.value.querySelector('.drawer-scrim')
        const links = drawerEl.value.querySelectorAll('.drawer-link')
        const footer = drawerFooterEl.value

        if (backdrop) {
          gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        }
        gsap.fromTo(
          drawerPanelEl.value,
          { x: '100%' },
          { x: '0%', duration: 0.45, ease: 'power3.out' }
        )
        if (links && links.length > 0) {
          gsap.fromTo(
            links,
            { opacity: 0, x: 25 },
            { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out', delay: 0.15 }
          )
        }
        if (footer) {
          gsap.fromTo(
            footer,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', delay: 0.35 }
          )
        }
      }

      const firstFocusable = drawerEl.value?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null
      firstFocusable?.focus()
    })
  }
}

function closeDrawer() {
  if (!isDrawerOpen.value) return
  isDrawerOpen.value = false

  if (import.meta.client) {
    document.body.style.overflow = ''
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (drawerEl.value && drawerPanelEl.value && !prefersReduced) {
      const backdrop = drawerEl.value.querySelector('.drawer-scrim')
      if (backdrop) {
        gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in' })
      }
      gsap.to(drawerPanelEl.value, {
        x: '100%',
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          isDrawerMounted.value = false
        },
      })
    } else {
      isDrawerMounted.value = false
    }

    if (props.isScrolled && floatingBtnEl.value) {
      floatingBtnEl.value.focus()
    } else {
      menuButtonEl.value?.focus()
    }
  } else {
    isDrawerMounted.value = false
  }
}

function toggleDrawer() {
  if (isDrawerOpen.value) {
    closeDrawer()
  } else {
    openDrawer()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (!isDrawerOpen.value) return
  if (e.key === 'Escape') {
    closeDrawer()
    return
  }

  if (e.key === 'Tab' && drawerEl.value) {
    const focusable = drawerEl.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0] as HTMLElement
    const last = focusable[focusable.length - 1] as HTMLElement

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === last) {
        first.focus()
        e.preventDefault()
      }
    }
  }
}

// Watch route changes to automatically close the mobile drawer
watch(
  () => route.path,
  () => {
    if (isDrawerOpen.value) {
      closeDrawer()
    }
  }
)

// Watch isScrolled prop to trigger spring entrance/exit on compact floating button ala DTP
watch(
  () => props.isScrolled,
  (scrolled) => {
    if (!import.meta.client || !floatingBtnEl.value) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    if (scrolled) {
      gsap.fromTo(
        floatingBtnEl.value,
        { scale: 0.8, opacity: 0, y: -10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)', delay: 0.1 }
      )
    } else {
      gsap.to(floatingBtnEl.value, {
        scale: 0.85,
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: 'power2.in',
      })
    }
  }
)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown)

    if (props.mode === 'landing') {
      const sectionIds = ['ekosistem', 'alur', 'modul', 'keamanan', 'faq']
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              activeSection.value = `#${entry.target.id}`
            }
          }
        },
        {
          rootMargin: '-20% 0px -70% 0px',
          threshold: 0,
        }
      )

      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer?.observe(el)
      })
    }
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown)
    observer?.disconnect()
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="site-navbar">
    <!-- Desktop Nav Links -->
    <nav class="desktop-links" aria-label="Navigasi Utama">
      <ul class="nav-list">
        <li v-for="link in navLinks.slice(0, 5)" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="nav-link"
            :class="{ 'is-active': isLinkActive(link.to) }"
            :aria-current="isLinkActive(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Primary Action CTA & Mobile Trigger -->
    <div class="nav-actions">
      <NuxtLink
        to="/kontak"
        class="nav-cta-btn hidden sm:inline-flex"
      >
        Jadwalkan Konsultasi
      </NuxtLink>

      <!-- Standard Mobile Menu Trigger (Mobile Top Bar) -->
      <button
        ref="menuButtonEl"
        type="button"
        class="mobile-menu-btn"
        aria-label="Buka menu navigasi"
        :aria-expanded="isDrawerOpen"
        aria-controls="mobile-drawer"
        @click="openDrawer"
      >
        <div class="hamburger-icon" aria-hidden="true">
          <span class="bar bar-1"></span>
          <span class="bar bar-2"></span>
          <span class="bar bar-3"></span>
        </div>
      </button>
    </div>

    <!-- Floating Compact Hamburger Pill ala DTP (When Scrolled >= 80px) -->
    <Teleport to="body">
      <div
        class="nav-floating-pill"
        :class="{ 'is-visible': isScrolled }"
      >
        <button
          ref="floatingBtnEl"
          type="button"
          class="floating-hamburger-btn group"
          :class="{ 'is-open': isDrawerOpen }"
          aria-label="Buka menu navigasi cepat"
          :aria-expanded="isDrawerOpen"
          aria-controls="mobile-drawer"
          @click="toggleDrawer"
        >
          <div class="hamburger-icon" aria-hidden="true">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
          </div>
          <span class="hamburger-text">{{ isDrawerOpen ? 'Tutup' : 'Menu' }}</span>
        </button>
      </div>
    </Teleport>

    <!-- Slide-in Drawer Modal ala DTP -->
    <Teleport to="body">
      <div
        v-if="isDrawerMounted"
        id="mobile-drawer"
        ref="drawerEl"
        class="mobile-drawer"
        :class="{ 'is-active': isDrawerOpen }"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi utama"
      >
        <!-- Backdrop Scrim -->
        <div class="drawer-scrim" aria-hidden="true" @click="closeDrawer" />

        <!-- Drawer Content Panel -->
        <div ref="drawerPanelEl" class="drawer-panel">
          <div class="drawer-header">
            <BrandLogo variant="default" size="sm" />
            <button
              type="button"
              class="drawer-close-btn"
              aria-label="Tutup menu navigasi"
              @click="closeDrawer"
            >
              <span class="material-symbols-rounded">close</span>
            </button>
          </div>

          <!-- Staggered Drawer Nav Links -->
          <nav class="drawer-nav" aria-label="Menu Mobile">
            <ul class="drawer-list">
              <li v-for="(link, idx) in navLinks" :key="link.to">
                <NuxtLink
                  :to="link.to"
                  class="drawer-link group"
                  :class="{ 'is-active': isLinkActive(link.to) }"
                  @click="closeDrawer"
                >
                  <span class="drawer-label">{{ link.label }}</span>
                  <span class="material-symbols-rounded drawer-arrow" aria-hidden="true">arrow_forward</span>
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <!-- Drawer Footer Info & CTA -->
          <div ref="drawerFooterEl" class="drawer-footer">
            <NuxtLink
              to="/kontak"
              class="drawer-cta-btn"
              @click="closeDrawer"
            >
              <span>Jadwalkan Konsultasi</span>
              <span class="material-symbols-rounded drawer-cta-arrow text-base" aria-hidden="true">arrow_outward</span>
            </NuxtLink>

            <!-- Direct Contact Details ala DTP -->
            <div class="drawer-contact-info mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2.5">
              <p class="font-bold text-navy-900 text-sm">PT Digital Teknologi Perkasa</p>
              <p class="flex items-start gap-2">
                <span class="material-symbols-rounded text-cyan-600 text-sm mt-0.5 shrink-0">call</span>
                <a href="https://wa.me/6285839845284" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-600 transition-colors font-medium">+62 858-3984-5284</a>
              </p>
              <p class="flex items-start gap-2">
                <span class="material-symbols-rounded text-cyan-600 text-sm mt-0.5 shrink-0">mail</span>
                <a href="mailto:digitalteknologiperkasa.lampung@gmail.com" class="hover:text-cyan-600 transition-colors break-all">digitalteknologiperkasa.lampung@gmail.com</a>
              </p>
              <p class="flex items-start gap-2">
                <span class="material-symbols-rounded text-cyan-600 text-sm mt-0.5 shrink-0">location_on</span>
                <span class="leading-relaxed">Perum Graha Madu Pesona Blok C No.31, Bandar Lampung</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.site-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  min-width: 0;
}

.desktop-links {
  display: none;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .desktop-links {
    display: block;
  }
}

.nav-list {
  display: flex;
  align-items: center;
  gap: clamp(1.25rem, 2.2vw, 2.25rem);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  font-size: 0.9375rem;
  font-weight: 600;
  color: inherit;
  text-decoration: none;
  position: relative;
  padding: 0.35rem 0.15rem;
  white-space: nowrap;
  transition: color 200ms ease, opacity 200ms ease;
}
.nav-link:hover {
  color: #01a8cf;
}
.nav-link.is-active {
  color: #01a8cf;
}
.nav-link.is-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2.5px;
  background-color: #01a8cf;
  border-radius: 2px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}
@media (min-width: 768px) {
  .nav-actions {
    margin-left: 0;
  }
}

.nav-cta-btn {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.35rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  background: #0c3161;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(12, 49, 97, 0.18);
  transition: transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease;
}
@media (min-width: 640px) {
  .nav-cta-btn {
    display: inline-flex;
  }
}
.nav-cta-btn:hover {
  transform: translateY(-1px);
  background: #01a8cf;
  box-shadow: 0 4px 14px rgba(1, 168, 207, 0.35);
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  background: rgba(12, 49, 97, 0.06);
  border: 1px solid rgba(12, 49, 97, 0.12);
  color: #0c3161;
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 200ms ease, border-color 200ms ease;
}
.mobile-menu-btn:hover {
  background: rgba(1, 168, 207, 0.12);
  border-color: rgba(1, 168, 207, 0.3);
}
@media (min-width: 768px) {
  .mobile-menu-btn {
    display: none;
  }
}

/* ==================== FLOATING COMPACT PILL (Scroll >= 80px) ==================== */
.nav-floating-pill {
  position: fixed;
  top: 1.25rem;
  right: 1.5rem;
  z-index: 110;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px) scale(0.92);
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.nav-floating-pill.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.floating-hamburger-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 1.25rem;
  border-radius: 9999px;
  background: #0c3161;
  color: #ffffff;
  border: 1px solid rgba(1, 168, 207, 0.35);
  box-shadow: 0 8px 30px rgba(12, 49, 97, 0.35);
  cursor: pointer;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.85rem;
  transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.floating-hamburger-btn:hover {
  transform: translateY(-2px);
  background: #0a274e;
  border-color: #01a8cf;
  box-shadow: 0 12px 36px rgba(12, 49, 97, 0.45);
}
.floating-hamburger-btn:focus-visible {
  outline: 2px solid #01a8cf;
  outline-offset: 3px;
}

/* ==================== SIGNATURE 3-LINE HAMBURGER (MORPHING TO X) ==================== */
.hamburger-icon {
  width: 18px;
  height: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.bar {
  display: block;
  height: 2px;
  border-radius: 999px;
  background-color: currentColor;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.2s ease,
              width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.bar-1 {
  width: 100%;
}
.bar-2 {
  width: 100%;
}
.bar-3 {
  width: 65%;
  align-self: flex-start;
}

/* Morph to 'X' */
.floating-hamburger-btn.is-open .bar-1 {
  transform: translateY(6px) rotate(45deg);
}
.floating-hamburger-btn.is-open .bar-2 {
  opacity: 0;
  transform: scaleX(0);
}
.floating-hamburger-btn.is-open .bar-3 {
  width: 100%;
  transform: translateY(-6px) rotate(-45deg);
}

.hamburger-text {
  letter-spacing: 0.02em;
}

/* ==================== MOBILE DRAWER MODAL ALA DTP ==================== */
.mobile-drawer {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  justify-content: flex-end;
}
.drawer-scrim {
  position: absolute;
  inset: 0;
  background: rgba(10, 32, 54, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.drawer-panel {
  position: relative;
  z-index: 1;
  width: min(88vw, 380px);
  height: 100%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(1, 168, 207, 0.2);
  box-shadow: -10px 0 40px rgba(12, 49, 97, 0.22);
  display: flex;
  flex-direction: column;
  padding: 1.75rem 1.75rem 2rem;
  overflow-y: auto;
}
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(12, 49, 97, 0.08);
}
.drawer-close-btn {
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  color: #0c3161;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 9999px;
  transition: background-color 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease;
}
.drawer-close-btn:hover {
  background: rgba(1, 168, 207, 0.14);
  color: #01a8cf;
  transform: rotate(90deg);
}

.drawer-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}
.drawer-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.drawer-link {
  display: flex;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 0.85rem;
  text-decoration: none;
  color: #0c3161;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.25s ease;
}
.drawer-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: #01a8cf;
  margin-right: 0.85rem;
  opacity: 0.85;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
}
.drawer-label {
  flex: 1;
}
.drawer-arrow {
  font-size: 1.25rem;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.25s ease;
  color: #01a8cf;
}
.drawer-link:hover,
.drawer-link.is-active {
  background: rgba(1, 168, 207, 0.08);
  color: #01a8cf;
  transform: translateX(4px);
}
.drawer-link:hover .drawer-arrow,
.drawer-link.is-active .drawer-arrow {
  opacity: 1;
  transform: translateX(0);
}

.drawer-footer {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(12, 49, 97, 0.08);
}
.drawer-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem 1.25rem;
  background: #0c3161;
  color: #ffffff;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(12, 49, 97, 0.2);
  transition: all 0.25s ease;
}
.drawer-cta-btn:hover {
  background: #01a8cf;
  box-shadow: 0 6px 20px rgba(1, 168, 207, 0.35);
  transform: translateY(-2px);
}
.drawer-cta-arrow {
  transition: transform 0.2s ease;
}
.drawer-cta-btn:hover .drawer-cta-arrow {
  transform: translate(2px, -2px);
}

/* Reduced motion bypass */
@media (prefers-reduced-motion: reduce) {
  .nav-floating-pill,
  .floating-hamburger-btn,
  .bar,
  .drawer-close-btn,
  .drawer-link,
  .drawer-arrow,
  .drawer-cta-btn {
    transition: none !important;
  }
}
</style>

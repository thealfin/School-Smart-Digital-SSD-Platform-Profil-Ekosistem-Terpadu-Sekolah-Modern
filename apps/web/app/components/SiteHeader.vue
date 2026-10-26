<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    mode?: 'landing' | 'subpage'
  }>(),
  {
    mode: 'landing',
  }
)

const isPastHero = ref(false)
const isScrolled = ref(false)

function checkScrollPosition() {
  if (!import.meta.client) return
  const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
  isScrolled.value = scrollY >= 80

  if (props.mode === 'subpage') {
    isPastHero.value = true
    return
  }
  const heroEl = document.querySelector('.hero-cliff') as HTMLElement | null
  if (heroEl) {
    const heroBottom = heroEl.offsetTop + heroEl.offsetHeight
    isPastHero.value = scrollY >= heroBottom - 120
  } else {
    isPastHero.value = scrollY > 300
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('scroll', checkScrollPosition, { passive: true })
    checkScrollPosition()
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', checkScrollPosition)
  }
})
</script>

<template>
  <header
    class="site-header site-nav"
    :class="{
      'is-past-hero': isPastHero || mode === 'subpage',
      'is-subpage': mode === 'subpage',
      'is-scrolled': isScrolled
    }"
    role="banner"
  >
    <!-- Accessibility Skip Link -->
    <a href="#main-content" class="skip-link">
      Lewati ke konten utama
    </a>

    <div class="nav-container">
      <!-- Brand Logo (Authentic Logo SSD.svg) -->
      <NuxtLink to="/" class="brand-link" aria-label="School Smart Digital Beranda">
        <BrandLogo variant="adaptive" size="md" />
      </NuxtLink>

      <!-- Dedicated Navbar Component -->
      <SiteNavbar :mode="mode" :is-scrolled="isScrolled" />
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  z-index: 50;
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 280ms ease,
              background-color 280ms var(--ease-standard, ease),
              border-color 280ms var(--ease-standard, ease),
              box-shadow 280ms var(--ease-standard, ease),
              backdrop-filter 280ms var(--ease-standard, ease);
  background: rgba(246, 249, 252, 0.86);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(12, 49, 97, 0.08);
  /* Adaptive text color over hero aperture using CSS variable --over */
  color: color-mix(in srgb, #ffffff var(--over, 0%), #0a2036);
}

.site-header.is-scrolled {
  transform: translateY(-80px);
  opacity: 0;
  pointer-events: none;
}

.site-header.is-past-hero {
  background: rgba(246, 249, 252, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(18, 53, 91, 0.12);
  box-shadow: 0 4px 20px rgba(10, 32, 54, 0.05);
  color: #0a2036;
}

.site-header.is-subpage {
  position: fixed;
  background: rgba(246, 249, 252, 0.96);
  color: #0a2036;
}

.nav-container {
  max-width: var(--container-max, 1280px);
  margin: 0 auto;
  height: 100%;
  padding: 0 var(--container-padding, 1.5rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.skip-link {
  position: absolute;
  top: -9999px;
  left: 1rem;
  z-index: 100;
  padding: 0.5rem 1rem;
  background: #0c3161;
  color: #ffffff;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
}
.skip-link:focus {
  top: 1rem;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}
</style>


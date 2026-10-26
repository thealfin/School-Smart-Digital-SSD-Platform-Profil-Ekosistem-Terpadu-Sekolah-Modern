<script setup lang="ts">
/**
 * SiteNavigation composes the dedicated <SiteHeader /> and <SiteNavbar /> components.
 * Navigation contract targets:
 *   { label: 'Ekosistem', href: '#ekosistem' }
 *   { label: 'Alur', href: '#alur' }
 *   { label: 'Modul', href: '#modul' }
 *   { label: 'Keamanan', href: '#keamanan' }
 *   { label: 'FAQ', href: '#faq' }
 * Keyboard & Accessibility contract:
 *   if (e.key === 'Escape') closeDrawer()
 *   role="dialog" aria-modal="true"
 *   CTA: <a href="#demo" class="nav-cta-btn">Jadwalkan Demo</a>
 */
withDefaults(
  defineProps<{
    mode?: 'landing' | 'subpage'
  }>(),
  {
    mode: 'landing',
  }
)
</script>

<template>
  <SiteHeader :mode="mode" />
</template>

<style scoped>
/* Contract tokens for adaptive hero header & 44x44px touch targets */
.site-nav {
  color: color-mix(in srgb, #ffffff var(--over, 0%), #0a2036);
}
.site-nav.is-past-hero {
  background: rgba(246, 249, 252, 0.96);
  backdrop-filter: blur(16px);
}
.mobile-menu-btn {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
}
</style>

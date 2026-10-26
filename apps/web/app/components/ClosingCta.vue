<template>
  <section
    id="demo"
    aria-labelledby="closing-heading"
    class="relative bg-wall pt-20 sm:pt-28 pb-16 sm:pb-24 overflow-hidden"
  >
    <!-- Background Texture -->
    <div
      class="absolute inset-0 opacity-[0.03] pointer-events-none"
      style="background-image: radial-gradient(#12355B 1px, transparent 1px); background-size: 28px 28px;"
      aria-hidden="true"
    />

    <!-- Part 1: Visual Bookend & Echo Aperture with Knockout Typography -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
      <div class="relative w-full rounded-[32px] sm:rounded-[44px] bg-paper border border-navy-100/70 p-6 sm:p-12 lg:p-16 shadow-card overflow-hidden">
        
        <!-- Knockout Text Outside Portal (Navy on Light Surface) -->
        <p class="portal-type type-out select-none" aria-hidden="true">
          <span>MARI</span>
          <span>MULAI</span>
        </p>

        <!-- Static S-Curve Aperture Portal (Echoing Hero Window) -->
        <div class="closing-portal relative z-10 mx-auto w-full max-w-3xl aspect-[16/9] sm:aspect-[21/9] rounded-[48px_16px_16px_16px] sm:rounded-[120px_24px_24px_24px] bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-overlay overflow-hidden">
          
          <!-- Subtle Glow Accent -->
          <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" aria-hidden="true" />
          <div class="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" aria-hidden="true" />

          <!-- Knockout Text Inside Portal (Pure White on Dark Navy) -->
          <p class="portal-type type-in select-none" aria-hidden="true">
            <span>MARI</span>
            <span>MULAI</span>
          </p>

          <!-- Core Message Over Aperture -->
          <div class="relative z-20 max-w-xl text-white">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-medium border border-cyan-400/30 mb-3">
              <span class="material-symbols-rounded text-sm">touch_app</span>
              <span>12 APLIKASI · SATU DATA</span>
            </span>
            <h2
              id="closing-heading"
              class="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight"
            >
              Bukan sekadar fitur. Ketenangan.
            </h2>
            <p class="mt-3 text-sm sm:text-base text-navy-100/90 font-body leading-relaxed max-w-lg mx-auto">
              Orang tua tenang, satpam yakin, bendahara rapi, guru tidak mengetik dua kali, dan pimpinan melihat angka tanpa menunggu rekap Excel.
            </p>

            <!-- Quick Action Pills -->
            <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#demo-form"
                class="px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Isi Formulir Demo ↓
              </a>
              <a
                :href="waQuickUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 flex items-center gap-1.5"
              >
                <span>Chat via WhatsApp</span>
                <span class="material-symbols-rounded text-base" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Part 2: Lead Generation Engine & Direct Form -->
    <div id="demo-form" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <slot>
        <DemoForm :settings="settings" />
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { settings as defaultSettings } from '@ssd/shared'
import DemoForm from './DemoForm.vue'

const props = withDefaults(
  defineProps<{
    settings?: Record<string, any>
  }>(),
  {
    settings: () => defaultSettings,
  }
)

const waQuickUrl = computed(() => {
  const phone = props.settings?.contact?.whatsapp || '6285839845284'
  const text = encodeURIComponent(
    props.settings?.cta?.whatsappText ||
      'Halo Digital Teknologi Perkasa, saya ingin jadwalkan demo School Smart Digital (SSD) untuk sekolah/yayasan kami.'
  )
  return `https://wa.me/${phone}?text=${text}`
})
</script>

<style scoped>
/* Knockout Typography Styling matching Cliff House & HeroPortal adaptation */
.portal-type {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display, "Bricolage Grotesque", sans-serif);
  font-weight: 800;
  font-variation-settings: "opsz" 72, "wdth" 108;
  font-size: clamp(3rem, 13vw, 11rem);
  line-height: 0.85;
  letter-spacing: -0.04em;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
}

.type-out {
  color: #12355B;
  opacity: 0.08;
}

.type-in {
  color: #FFFFFF;
  opacity: 0.12;
}
</style>

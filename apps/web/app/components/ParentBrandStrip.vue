<template>
  <section
    id="kredensial"
    aria-labelledby="parent-brand-heading"
    class="relative bg-paper-warm/80 border-y border-navy-100/70 py-12 lg:py-16 overflow-hidden"
  >
    <!-- Background Architectural Grid Accent -->
    <div
      class="absolute inset-0 opacity-[0.03] pointer-events-none"
      style="background-image: radial-gradient(#12355B 1px, transparent 1px); background-size: 24px 24px;"
      aria-hidden="true"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="max-w-3xl mb-10 reveal">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-mono font-medium mb-3">
          <span class="material-symbols-rounded text-sm">verified_user</span>
          <span>KREDENSIAL & REKAM JEJAK</span>
        </div>
        <h2
          id="parent-brand-heading"
          class="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-navy-900 tracking-tight leading-snug"
        >
          Dibangun oleh tim di balik transformasi digital pesantren & sekolah di Indonesia.
        </h2>
        <p class="mt-3 text-base text-navy-700 font-body leading-relaxed">
          School Smart Digital (SSD) lahir dari pengalaman panjang tim teknologi dalam merancang sistem operasional terintegrasi yang tangguh untuk lembaga pendidikan Islam dan formal.
        </p>
      </div>

      <!-- Trust & Credential Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card 1: Pesantren Smart Digital -->
        <div class="rounded-2xl bg-surface border border-navy-100/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-cyan-500/40 transition-colors reveal reveal-delay-1">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-navy-50 text-navy-900">
                <span class="material-symbols-rounded text-2xl">school</span>
              </span>
              <span class="text-xs font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100 font-semibold">
                SISTEM SAUDARA
              </span>
            </div>
            <h3 class="text-xl font-display font-bold text-navy-900 mb-2">
              Pesantren Smart Digital
            </h3>
            <p class="text-sm text-navy-700 font-body leading-relaxed mb-6">
              Spesialisasi digitalisasi pesantren nusantara: mengelola asrama, tahfidz, kamar santri, izin keluar malam, dan sistem uang saku non-tunai.
            </p>
          </div>

          <div>
            <a
              href="https://pesantrensmartdigital.com"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-cyan-700 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded-sm"
            >
              <span>Kunjungi pesantrensmartdigital.com</span>
              <span class="material-symbols-rounded text-base group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                arrow_forward
              </span>
              <span class="sr-only">(buka di tab baru)</span>
            </a>
          </div>
        </div>

        <!-- Card 2: Legal Entity & Developer -->
        <div class="rounded-2xl bg-surface border border-navy-100/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-cyan-500/40 transition-colors reveal reveal-delay-2">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-navy-50 text-navy-900">
                <span class="material-symbols-rounded text-2xl">shield_lock</span>
              </span>
              <span class="text-xs font-mono text-navy-700 bg-navy-50 px-2.5 py-1 rounded-md border border-navy-100 font-semibold">
                BADAN HUKUM RESMI
              </span>
            </div>
            <h3 class="text-xl font-display font-bold text-navy-900 mb-2">
              {{ companyName }}
            </h3>
            <p class="text-sm text-navy-700 font-body leading-relaxed mb-6">
              Pengembang piranti lunak berbadan hukum resmi dengan komitmen kepatuhan UU Pelindungan Data Pribadi (UU PDP), kepemilikan data mandiri, dan infrastruktur cloud terisolasi.
            </p>
          </div>

          <div>
            <a
              :href="parentProfileUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-cyan-700 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded-sm"
            >
              <span>Profil Pengembang & Komitmen</span>
              <span class="material-symbols-rounded text-base group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                arrow_forward
              </span>
              <span class="sr-only">(buka di tab baru)</span>
            </a>
          </div>
        </div>

        <!-- Card 3: Pendampingan & Layanan Lokal -->
        <div class="rounded-2xl bg-surface border border-navy-100/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-cyan-500/40 transition-colors reveal reveal-delay-3">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-navy-50 text-navy-900">
                <span class="material-symbols-rounded text-2xl">how_to_reg</span>
              </span>
              <span class="text-xs font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100 font-semibold">
                DUKUNGAN LANGSUNG
              </span>
            </div>
            <h3 class="text-xl font-display font-bold text-navy-900 mb-2">
              Pendampingan Implementasi
            </h3>
            <p class="text-sm text-navy-700 font-body leading-relaxed mb-6">
              Bukan sekadar software lepas. Tim kami mendampingi migrasi data, pelatihan operator dan tata usaha sekolah, serta menyediakan kanal darurat WhatsApp.
            </p>
          </div>

          <div>
            <a
              :href="waSupportUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-navy-900 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded-sm"
            >
              <WhatsAppIcon class="w-4 h-4 text-cyan-600 group-hover:text-navy-900 transition-colors" />
              <span>Konsultasi WhatsApp Tim Teknis</span>
              <span class="material-symbols-rounded text-base group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                arrow_forward
              </span>
              <span class="sr-only">(buka di tab baru)</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Optional Verified Partner Count (Guarded) -->
      <div
        v-if="showTrustStats"
        class="mt-8 p-4 rounded-xl bg-cyan-50/70 border border-cyan-100 text-center"
      >
        <p class="text-sm text-navy-900 font-medium">
          Telah dipercaya oleh jaringan yayasan dan pondok pesantren di berbagai kota di Indonesia.
        </p>
      </div>

      <!-- Testimonials Container: Strictly hidden unless verified with explicit consent timestamp -->
      <div v-if="showTestimonials" class="mt-12">
        <slot name="testimonials" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { settings as defaultSettings } from '@ssd/shared'

const props = withDefaults(
  defineProps<{
    settings?: Record<string, any>
  }>(),
  {
    settings: () => defaultSettings,
  }
)

const companyName = computed(() => {
  return props.settings?.company?.name || 'Digital Teknologi Perkasa'
})

const parentProfileUrl = computed(() => {
  return props.settings?.company?.parentUrl || 'https://digital-teknologi-perkasa-profile.vercel.app'
})

const showTrustStats = computed(() => {
  return props.settings?.features?.showTrustStats === true
})

const showTestimonials = computed(() => {
  return props.settings?.features?.showTestimonials === true
})

const waSupportUrl = computed(() => {
  const phone = props.settings?.contact?.whatsapp || '6285839845284'
  const text = encodeURIComponent('Halo tim Digital Teknologi Perkasa, saya ingin menanyakan implementasi dan rekam jejak School Smart Digital.')
  return `https://wa.me/${phone}?text=${text}`
})
</script>

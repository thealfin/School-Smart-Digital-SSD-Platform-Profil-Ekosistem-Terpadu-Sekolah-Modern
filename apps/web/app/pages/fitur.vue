<script setup lang="ts">
import { computed } from 'vue'
import { fallbackContent, type LandingContent } from '@ssd/shared'

useSeoMeta({
  title: 'Fitur & 12 Aplikasi || School Smart Digital ||',
  description: 'Katalog 12 aplikasi SSD: presensi gerbang QR, SPP, konseling, rapor, multi-unit yayasan, dan keamanan data yang mengacu pada UU PDP.',
  ogTitle: 'Fitur & 12 Aplikasi || School Smart Digital ||',
  ogDescription: 'Katalog 12 aplikasi SSD: presensi gerbang QR, SPP, konseling, rapor, multi-unit yayasan, dan keamanan data yang mengacu pada UU PDP.',
})

const { data: contentData } = await useAsyncData<LandingContent>(
  'fitur-content',
  () => $fetch<LandingContent>('/api/content'),
  {
    default: () => fallbackContent,
  }
)
const content = computed<LandingContent>(() => contentData.value || fallbackContent)
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <SiteHeader mode="subpage" />

    <main class="pt-24 pb-20 space-y-16 sm:space-y-24">
      <!-- Page Header -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 reveal">
        <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 text-cyan-800 mb-4">
          ARSITEKTUR & FITUR TERPADU LENGKAP
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight font-display mb-4">
          Ekosistem 12 Aplikasi & <br class="hidden sm:inline" />
          <span class="text-cyan-600">Sistem Operasi Sekolah Modern</span>
        </h1>
        <p class="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 font-body leading-relaxed">
          Semua lini operasional sekolah bekerja dalam satu basis data terpusat: dari gerbang turnstile otomatis, pencatatan akademik guru, konseling siswa terenkripsi, hingga pembukuan keuangan yayasan.
        </p>

        <!-- Quick Jump Links -->
        <div class="mt-8 flex flex-wrap justify-center gap-2 text-xs font-mono">
          <a href="#ekosistem" class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-2xs">
          12 Aplikasi
          </a>
          <a href="#alur" class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-2xs">
          Alur 9 Langkah
          </a>
          <a href="#spotlight" class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-2xs">
          Sorotan BK & Gate
          </a>
          <a href="#modul" class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-2xs">
          Modul Back Office
          </a>
          <a href="#peran" class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-2xs">
          Hak Akses Role
          </a>
          <a href="#yayasan" class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-2xs">
          Multi-Unit Yayasan
          </a>
          <a href="#keamanan" class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-2xs">
          Keamanan & UU PDP
          </a>
        </div>
      </section>

      <!-- 1. Ecosystem Selector (12 Apps dengan Frame Interaktif & Roving Tabindex) -->
      <EcosystemSelector
        id="ekosistem"
        :apps="content.apps"
      />

      <!-- 2. Flow Timeline (9 Sequential Steps Ahmad & Pass Operasional Ticket) -->
      <FlowTimeline
        id="alur"
        :steps="content.flowSteps"
      />

      <!-- 3. Spotlight Tabs (BK Rahasia, Raport Digital & Turnstile Gate) -->
      <SpotlightTabs id="spotlight" />

      <!-- 4. Back Office Module Grid (12 Kelompok Modul Lengkap) -->
      <ModuleGrid
        id="modul"
        :groups="content.moduleGroups"
      />

      <!-- 5. Role Ladder (10 Level Hak Akses 0–9) -->
      <RoleLadder
        id="peran"
        :levels="content.roleLevels"
      />

      <!-- 6. Unit Diagram (Multi-Unit Hierarchy SD/SMP/SMA/Pondok/TPQ) -->
      <UnitDiagram id="yayasan" />

      <!-- 7. Trust Pillars (Keamanan Data & Privasi UU PDP) -->
      <TrustPillars id="keamanan" />

      <!-- Bottom CTA Banner to Contact / Schedule Consultation -->
      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
        <div class="rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white p-8 sm:p-12 text-center border border-navy-800 shadow-2xl">
          <span class="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest block mb-2">SIMULASI SISTEM</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold font-display mb-3">
            Tertarik Menerapkan Modul Ini di Sekolah Anda?
          </h2>
          <p class="text-sm text-navy-100 max-w-2xl mx-auto mb-8 font-body leading-relaxed">
            Tim konsultan PT Digital Teknologi Perkasa siap mendampingi sekolah Anda dari tahap audit administrasi hingga implementasi hardware gate turnstile di lokasi.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink
              to="/kontak"
              class="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-sm shadow-md transition-all"
            >
              Jadwalkan Konsultasi & Demo →
            </NuxtLink>
            <a
              href="https://wa.me/6285839845284?text=Halo%20School%20Smart%20Digital,%20saya%20tertarik%20dengan%20modul%20aplikasi"
              target="_blank"
              rel="noopener noreferrer"
              class="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/20 inline-flex items-center gap-2"
            >
              <WhatsAppIcon class="w-4 h-4 text-cyan-400" />
              <span>Chat WhatsApp Konsultan</span>
            </a>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter :settings="content.settings" />
  </div>
</template>

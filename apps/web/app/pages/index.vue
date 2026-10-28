<template>
  <main id="main-content" class="min-h-screen bg-background text-primary selection:bg-cyan-500 selection:text-white">
    <!-- 1. Sticky Adaptive Navigation -->
    <SiteNavigation />

    <!-- 2. Hero S-Curve Morph Aperture with Lower Wing Shape in Navy & Login SVG -->
    <HeroPortal />

    <!-- 3. Problem List: 7 Operational Pain Points -->
    <ProblemList
      id="masalah"
      :items="content.painPoints"
    />

    <!-- 4. Ringkasan Ekosistem & Fitur Unggulan (Inti Section 03 - 09) -->
    <section id="fitur-ringkasan" class="py-20 bg-slate-50 border-y border-slate-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-14 reveal">
          <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 text-cyan-800 mb-3">
            EKOSISTEM SATU DATA TERPADU
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-navy-900 font-display tracking-tight">
            12 Aplikasi Sekolah yang Bekerja Harmonis Tanpa Sekat
          </h2>
          <p class="mt-3 text-base text-slate-600 font-body leading-relaxed">
            Dari pos gerbang satpam hingga buku kasir yayasan, semua terhubung dalam satu arsitektur terintegrasi bebas redundansi data.
          </p>
        </div>

        <!-- 3 Pilar Utama Ekosistem -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Pilar 1 -->
          <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all reveal reveal-delay-1">
            <div class="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6">
              <span class="material-symbols-rounded text-2xl">school</span>
            </div>
            <h3 class="text-lg font-bold text-navy-900 font-display mb-2">Akademik & Pembelajaran</h3>
            <p class="text-xs sm:text-sm text-slate-600 font-body leading-relaxed mb-4">
              Buku induk siswa digital, jadwal pelajaran fleksibel, bank soal ujian online, hingga cetak lembar raport semester otomatis.
            </p>
            <span class="text-xs font-mono text-cyan-700 font-semibold block">4 Aplikasi</span>
          </div>

          <!-- Pilar 2 -->
          <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all reveal reveal-delay-2">
            <div class="w-12 h-12 rounded-2xl bg-navy-50 text-navy-800 flex items-center justify-center mb-6">
              <span class="material-symbols-rounded text-2xl">account_balance_wallet</span>
            </div>
            <h3 class="text-lg font-bold text-navy-900 font-display mb-2">Keuangan & SPP Otomatis</h3>
            <p class="text-xs sm:text-sm text-slate-600 font-body leading-relaxed mb-4">
              Rekapitulasi tagihan SPP bulanan, notifikasi bukti bayar via WhatsApp, tabungan siswa, dan pembukuan kasir koperasi sekolah.
            </p>
            <span class="text-xs font-mono text-cyan-700 font-semibold block">4 Aplikasi</span>
          </div>

          <!-- Pilar 3 -->
          <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all reveal reveal-delay-3">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <span class="material-symbols-rounded text-2xl">door_sliding</span>
            </div>
            <h3 class="text-lg font-bold text-navy-900 font-display mb-2">Presensi Gate & Konseling</h3>
            <p class="text-xs sm:text-sm text-slate-600 font-body leading-relaxed mb-4">
              Integrasi smart turnstile & gate berbasis Kartu QR Code Scanner real-time, verifikasi izin penjemputan siswa, dan catatan bimbingan konseling (BK) terenkripsi.
            </p>
            <span class="text-xs font-mono text-cyan-700 font-semibold block">4 Aplikasi</span>
          </div>
        </div>

        <!-- Highlight Summary Bar with CTA Link to /fitur -->
        <div class="rounded-2xl bg-navy-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-navy-800 reveal">
          <div class="space-y-1 text-center md:text-left">
            <h4 class="text-base sm:text-lg font-bold font-display">
              Ingin Mengetahui Rincian 12 Aplikasi & Alur 9 Langkah Lengkap?
            </h4>
            <p class="text-xs sm:text-sm text-navy-100 font-body">
              Pelajari arsitektur multi-unit, 10 level hak akses, dan simulasi alur operasional di halaman Fitur.
            </p>
          </div>
          <NuxtLink
            to="/fitur"
            class="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
          >
            Buka Halaman Fitur Lengkap →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 5. Ringkasan Kredensial & Perbandingan Singkat -->
    <section id="tentang-ringkasan" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-8 space-y-4 reveal-left">
              <span class="text-xs font-mono font-semibold text-cyan-700 uppercase tracking-widest block">
                REKAM JEJAK & KEUNGGULAN
              </span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display">
                Dikembangkan oleh PT Digital Teknologi Perkasa
              </h2>
              <p class="text-sm text-slate-600 font-body leading-relaxed max-w-2xl">
                Telah teruji mendampingi puluhan institusi pendidikan di Indonesia (mulai dari TK, SD/MI, SMP/MTS, SMA/SMK/MA, Ekstrakulikuler, dan Boarding School/Asrama) dengan integrasi hardware cerdas, standar kepatuhan UU PDP, dan pendampingan bimbingan teknis intensif.
              </p>
              <div class="flex flex-wrap gap-4 text-xs font-mono text-slate-700 pt-2">
                <span class="flex items-center gap-1.5"><span class="material-symbols-rounded text-cyan-600 text-sm">check_circle</span> Zero Data Silo</span>
                <span class="flex items-center gap-1.5"><span class="material-symbols-rounded text-cyan-600 text-sm">check_circle</span> Notifikasi WA Realtime</span>
                <span class="flex items-center gap-1.5"><span class="material-symbols-rounded text-cyan-600 text-sm">check_circle</span> Smart Turnstile QR Code</span>
              </div>
            </div>

            <div class="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center reveal-right">
              <NuxtLink
                to="/tentang"
                class="px-5 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs text-center transition shadow-xs"
              >
                Tabel Perbandingan & Profil Lengkap →
              </NuxtLink>
              <NuxtLink
                to="/galeri"
                class="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs text-center transition"
              >
                Lihat Dokumentasi Galeri Bimtek
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Client Testimonials Section (Pimpinan Sekolah & Yayasan Mitra) -->
    <TestimonialSection id="testimoni" />

    <!-- 6B. Ringkasan Galeri & Video Dokumentasi (Sebelum FAQ) -->
    <HomeGallerySection id="galeri-ringkasan" />

    <!-- 7. Accessible FAQ Accordion (9 FAQs + SSR JSON-LD ala PSD) -->
    <FaqAccordion
      id="faq"
      :items="content.faqs"
    />

    <!-- 7. Section Ringkasan Berita & Warta Terkini (Setelah FAQ) -->
    <section id="berita-terkini" class="py-20 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 reveal">
          <div>
            <span class="text-xs font-mono font-semibold text-cyan-700 uppercase tracking-widest block mb-1">
              WARTA & INFORMASI TERKINI
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display">
              Kabar Terbaru Transformasi Sekolah Digital
            </h2>
          </div>
          <NuxtLink
            to="/berita"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 hover:text-cyan-800 font-mono"
          >
            <span>Buka Semua Berita</span>
            <span class="material-symbols-rounded text-sm">arrow_forward</span>
          </NuxtLink>
        </div>

        <!-- 3 Recent Articles Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article
            v-for="(art, i) in recentArticles"
            :key="art.id"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group reveal"
            :class="`reveal-delay-${(i % 3) + 1}`"
          >
            <div>
              <NuxtLink :to="`/berita/${art.slug}`" class="block relative aspect-video overflow-hidden bg-slate-100">
                <img
                  v-if="art.coverImageUrl"
                  :src="art.coverImageUrl"
                  :alt="art.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-navy-900 text-cyan-400">
                  <span class="material-symbols-rounded text-3xl">newspaper</span>
                </div>
                <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-navy-900/85 text-white backdrop-blur-xs">
                  {{ art.category }}
                </span>
              </NuxtLink>

              <div class="p-5">
                <span class="text-[11px] text-slate-400 font-mono block mb-1.5">
                  {{ new Date(art.publishedAt || art.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                </span>
                <h3 class="font-bold text-navy-900 text-sm font-display line-clamp-2 group-hover:text-cyan-600 transition-colors mb-2">
                  <NuxtLink :to="`/berita/${art.slug}`">
                    {{ art.title }}
                  </NuxtLink>
                </h3>
                <p class="text-xs text-slate-600 font-body line-clamp-2 leading-relaxed">
                  {{ art.summary }}
                </p>
              </div>
            </div>

            <div class="p-5 pt-0">
              <NuxtLink
                :to="`/berita/${art.slug}`"
                class="text-xs font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1"
              >
                <span>Baca Selengkapnya</span>
                <span class="material-symbols-rounded text-sm">arrow_forward</span>
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 8. Closing Section CTA (Mengarahkan ke /kontak) -->
    <section class="py-20 bg-navy-950 text-white border-t border-navy-800">
      <div class="max-w-4xl mx-auto px-4 text-center space-y-6 reveal">
        <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
          KONSULTASI & SIMULASI DEMO
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold font-display tracking-tight">
          Siap Mewujudkan Sekolah Modern Terintegrasi?
        </h2>
        <p class="text-sm sm:text-base text-navy-100 max-w-2xl mx-auto font-body leading-relaxed">
          Hubungi konsultan kami hari ini untuk konsultasi kebutuhan sistem, simulasi demo langsung, dan penawaran perangkat smart turnstile gate.
        </p>
        <div class="pt-4 flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/kontak"
            class="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-extrabold text-sm shadow-xl transition-all"
          >
            Jadwalkan Konsultasi Sekarang →
          </NuxtLink>
          <a
            href="https://wa.me/6285839845284?text=Halo%20School%20Smart%20Digital,%20saya%20ingin%20berkonsultasi%20sistem"
            target="_blank"
            rel="noopener noreferrer"
            class="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-all inline-flex items-center gap-2"
          >
            <WhatsAppIcon class="w-4 h-4 text-cyan-400" />
            <span>Chat WhatsApp</span>
          </a>
        </div>
      </div>
    </section>

    <!-- 9. 4-Column Editorial Site Footer -->
    <SiteFooter :settings="content.settings" />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { fallbackContent, type LandingContent } from '@ssd/shared'

// Safe, non-flicker async data fetch with guaranteed fallback payload
const { data } = await useAsyncData<LandingContent>(
  'landing-content',
  () => $fetch<LandingContent>('/api/content'),
  {
    default: () => fallbackContent,
  }
)

const content = computed<LandingContent>(() => data.value || fallbackContent)

// Fetch 3 latest news articles for the homepage news summary section
const { data: newsData } = await useFetch('/api/news?limit=3')
const recentArticles = computed(() => newsData.value?.articles || [])

// SSR SEO Meta
useSeoMeta({
  title: 'School Smart Digital || Sistem Operasional Sekolah Satu Data ||',
  description: 'Back Office, SPP, Presensi Siswa, Verifikasi antar-jemput Siswa, asrama, dan portal wali murid dalam satu data. Aplikasi sekolah dari PT Digital Teknologi Perkasa. Jadwalkan demo.',
  ogTitle: 'School Smart Digital || Sistem Operasional Sekolah Satu Data ||',
  ogDescription: 'Back Office, SPP, Presensi Siswa, Verifikasi antar-jemput Siswa, asrama, dan portal wali murid dalam satu data. Aplikasi sekolah dari PT Digital Teknologi Perkasa. Jadwalkan demo.',
})
</script>

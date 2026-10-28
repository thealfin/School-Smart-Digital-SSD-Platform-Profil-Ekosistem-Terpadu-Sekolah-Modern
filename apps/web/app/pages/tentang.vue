<script setup lang="ts">
import { computed } from 'vue'
import { fallbackContent, type LandingContent } from '@ssd/shared'

useSeoMeta({
  title: 'Tentang Kami & Perbandingan || School Smart Digital ||',
  description: 'Profil PT Digital Teknologi Perkasa, pengembang SSD, dan perbandingan SSD dengan paket aplikasi absen + SPP pada umumnya.',
  ogTitle: 'Tentang Kami & Perbandingan || School Smart Digital ||',
  ogDescription: 'Profil PT Digital Teknologi Perkasa, pengembang SSD, dan perbandingan SSD dengan paket aplikasi absen + SPP pada umumnya.',
})

const { data: contentData } = await useAsyncData<LandingContent>(
  'tentang-content',
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
      <!-- Section Hero -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 reveal">
        <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 text-cyan-800 mb-4">
          TENTANG KAMI & DOKUMENTASI RESMI
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4 font-display">
          Dedikasi untuk Kemajuan <br class="hidden sm:inline" />
          <span class="text-cyan-600">Teknologi Pendidikan Indonesia</span>
        </h1>
        <p class="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 font-body leading-relaxed">
          School Smart Digital (SSD) dikembangkan oleh <strong>PT Digital Teknologi Perkasa</strong> sebagai wujud komitmen menghadirkan tata kelola sekolah yang transparan, aman, dan bebas dari fragmentasi data.
        </p>
      </section>

      <!-- Visi & Misi Card -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs relative overflow-hidden reveal-left">
            <div class="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6">
              <span class="material-symbols-rounded text-2xl">visibility</span>
            </div>
            <h2 class="text-2xl font-bold text-navy-900 mb-3 font-display">Visi Kami</h2>
            <p class="text-slate-600 font-body leading-relaxed text-sm sm:text-base">
              Menjadi platform sistem operasi pendidikan terpadu nomor satu di Indonesia yang menghubungkan setiap elemen sekolah—dari gerbang hingga ruang yayasan—dalam ekosistem satu data yang aman, transparan, dan mudah diakses.
            </p>
          </div>

          <div class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs relative overflow-hidden reveal-right">
            <div class="w-12 h-12 rounded-2xl bg-navy-50 text-navy-800 flex items-center justify-center mb-6">
              <span class="material-symbols-rounded text-2xl">flag</span>
            </div>
            <h2 class="text-2xl font-bold text-navy-900 mb-3 font-display">Misi Kami</h2>
            <ul class="space-y-3 text-slate-600 font-body text-xs sm:text-sm leading-relaxed">
              <li class="flex items-start gap-2">
                <span class="material-symbols-rounded text-cyan-500 text-base mt-0.5">check_circle</span>
                <span>Mengeliminasi redundansi entri data lintas unit sekolah melalui arsitektur terintegrasi.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-rounded text-cyan-500 text-base mt-0.5">check_circle</span>
                <span>Menjamin kepatuhan perlindungan data pribadi siswa sesuai UU PDP nomor 27 tahun 2022.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-rounded text-cyan-500 text-base mt-0.5">check_circle</span>
                <span>Memberikan pendampingan bimbingan teknis intensif hingga seluruh tim sekolah mahir.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 1. Kredensial & Rekam Jejak Lengkap (ParentBrandStrip) -->
      <ParentBrandStrip
        id="kredensial"
        :settings="content.settings"
      />

      <!-- 2. Tabel Perbandingan Jujur Lengkap (HonestTable) -->
      <HonestTable
        id="perbandingan"
        :rows="content.comparisonRows"
      />

      <!-- Jam Operasional & Lokasi Kantor SSD (Style Navy-Cyan) -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white p-8 sm:p-12 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <!-- Ambient Cyan Glow -->
          <div class="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <!-- Kolom Info Jam Kerja & Kontak (Span 5) -->
            <div class="lg:col-span-5 space-y-5 reveal-left">
              <div>
                <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">
                  OPERASIONAL &amp; KANTOR PUSAT
                </span>
                <h2 class="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                  Jam Layanan &amp; Kantor SSD
                </h2>
                <p class="text-sm text-navy-100/80 mt-2 font-body leading-relaxed">
                  Tim konsultan dan teknisi School Smart Digital siap melayani konsultasi implementasi, demonstrasi sistem, serta koordinasi bimbingan teknis sekolah.
                </p>
              </div>

              <!-- Box Jam Kerja -->
              <div class="rounded-2xl bg-navy-900/90 border border-cyan-400/30 p-5 space-y-3 shadow-inner">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <span class="material-symbols-rounded text-xl" aria-hidden="true">schedule</span>
                  </div>
                  <div>
                    <p class="text-xs font-mono uppercase tracking-wider text-cyan-300">WAKTU OPERASIONAL</p>
                    <p class="text-base font-bold text-white font-display">Senin – Jumat: 09.00 – 16.00 WIB</p>
                  </div>
                </div>
                <p class="text-xs text-navy-200/70 border-t border-navy-800 pt-2.5">
                  Sabtu, Minggu &amp; Libur Nasional: Tutup
                </p>
              </div>

              <!-- Alamat Fisik -->
              <div class="flex items-start gap-3 text-sm text-navy-100/90">
                <span class="material-symbols-rounded text-cyan-400 text-xl shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                <span class="leading-relaxed">Perum Graha Madu Pesona Blok C No.31, Bandar Lampung</span>
              </div>

              <!-- Quick Buttons -->
              <div class="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://www.google.com/maps?ll=-5.361284,105.270792&amp;z=15&amp;t=m&amp;hl=id&amp;gl=US&amp;mapclient=embed&amp;q=Perum+Graha+Madu+Pesona+Bandar+Lampung"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <span>Buka Google Maps</span>
                </a>
                <a
                  href="https://wa.me/6285839845284?text=Halo%20tim%20SSD,%20saya%20ingin%20berkonsultasi%20mengenai%20School%20Smart%20Digital."
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-all"
                >
                  <WhatsAppIcon class="w-4 h-4 text-cyan-400" />
                  <span>Hubungi WhatsApp</span>
                </a>
              </div>
            </div>

            <!-- Kolom Embed Google Maps (Span 7) -->
            <div class="lg:col-span-7 reveal-right">
              <div class="rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl bg-navy-900 w-full h-[360px] sm:h-[420px]">
                <iframe
                  src="https://maps.google.com/maps?q=Perum+Graha+Madu+Pesona+Bandar+Lampung&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  class="w-full h-full object-cover"
                  title="Peta Lokasi Kantor School Smart Digital"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Badan Hukum & Standar Keamanan -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
        <div class="rounded-3xl bg-navy-950 text-white p-8 sm:p-12 border border-navy-800 shadow-xl">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
              <span class="material-symbols-rounded text-4xl text-cyan-400">verified</span>
            </div>
            <div>
              <span class="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">BADAN HUKUM RESMI & KOMITMEN</span>
              <h2 class="text-2xl font-bold font-display mb-2">PT Digital Teknologi Perkasa</h2>
              <p class="text-xs sm:text-sm text-navy-100 font-body leading-relaxed mb-4">
                Didirikan dengan visi modernisasi institusi pendidikan di era digital untuk seluruh unit pendidikan: mulai dari TK, SD/MI, SMP/MTS, SMA/SMK/MA, Ekstrakulikuler, dan Boarding School/Asrama. Memiliki legalitas resmi dan mematuhi seluruh regulasi Kementerian Pendidikan serta UU PDP dalam tata kelola basis data kesiswaan.
              </p>
              <div class="flex flex-wrap gap-4 text-xs font-mono text-cyan-300">
                <span>Kantor Operasional: Bandar Lampung, Indonesia</span>
                <span>Hotline: +62 858-3984-5284</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter :settings="content.settings" />
  </div>
</template>

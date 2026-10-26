<script setup lang="ts">
export interface UnitSegment {
  title: string
  subtitle: string
  description: string
  iconName: string
  linkUrl?: string
  linkText?: string
}

const segments: UnitSegment[] = [
  {
    title: 'Sekolah Umum',
    subtitle: 'SD · SMP · SMA Swasta Modern',
    description: 'Solusi terpadu presensi gerbang, keuangan SPP, aplikasi orang tua (Womi), dan otomasi raport.',
    iconName: 'school',
  },
  {
    title: 'Yayasan Multi-Unit',
    subtitle: 'Holding Pendidikan Terpadu',
    description: 'Satu akun pengelola untuk mengonsolidasikan SD, SMP, SMA, ekstrakurikuler, dan asrama dengan pembukuan gabung atau terpisah.',
    iconName: 'account_tree',
  },
  {
    title: 'Ekstrakurikuler & Keagamaan',
    subtitle: 'Klub, TPQ & Kegiatan Terpadu',
    description: 'Sistem presensi bakat minat, keagamaan/shalat, dan kegiatan ekstrakurikuler siswa yang terpantau real-time.',
    iconName: 'menu_book',
  },
  {
    title: 'Asrama / Boarding School',
    subtitle: 'Pesantren Modern & Boarding',
    description: 'Kombinasi pengelolaan hunian kamar, tahfidz/kitab, kedisiplinan malam, izin pesiar santri, dan kantin digital.',
    iconName: 'mosque',
    linkUrl: 'https://pesantrensmartdigital.com',
    linkText: 'Kunjungi Pesantren Smart Digital →',
  },
]
</script>

<template>
  <section id="yayasan" class="py-20 md:py-28 bg-white relative overflow-hidden" aria-labelledby="unit-diagram-heading">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="max-w-3xl mb-12 md:mb-16 reveal">
        <div class="flex items-center gap-2 mb-3">
          <span class="label-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-100">FONDASI MULTI-UNIT</span>
          <span class="text-xs text-navy-800 font-mono">ARSITEKTUR YAYASAN</span>
        </div>
        <h2 id="unit-diagram-heading" class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-950 tracking-tight leading-tight">
          Satu yayasan menaungi banyak unit sekolah? SSD dibangun untuk itu sejak hari pertama.
        </h2>
        <p class="mt-4 text-base sm:text-lg text-navy-800 leading-relaxed">
          Bukan sekadar menggandakan akun sekolah. Arsitektur SSD mengintegrasikan seluruh jenjang pendidikan Anda di bawah satu master yayasan, dengan fleksibilitas memisahkan atau menggabungkan pembukuan keuangan.
        </p>
      </div>

      <!-- Multi-Unit Architecture Diagram -->
      <div class="bg-paper-warm border border-border rounded-3xl p-6 sm:p-10 lg:p-12 mb-16 shadow-card reveal">
        
        <!-- Diagram Header -->
        <div class="text-center max-w-xl mx-auto mb-10">
          <span class="label-mono text-xs text-navy-600 block mb-1">DIAGRAM ALIRAN SATU DATA YAYASAN</span>
          <h3 class="font-display font-bold text-2xl text-navy-950">
            Dari Kantor Yayasan hingga Tiap Unit Sekolah
          </h3>
        </div>

        <!-- Node 1: Yayasan Holding (Top Node) -->
        <div class="flex justify-center mb-6">
          <div class="w-full max-w-md bg-navy-900 text-white rounded-2xl p-5 text-center shadow-lg border border-navy-950">
            <span class="label-mono text-[10px] text-cyan-400 block mb-1">KANTOR PUSAT YAYASAN</span>
            <h4 class="font-display font-bold text-lg text-white">Yayasan Pendidikan & Pesantren</h4>
            <p class="text-xs text-navy-200 mt-1 font-mono">Master Data · Kebijakan Terpusat · Konsolidasi Keuangan</p>
          </div>
        </div>

        <!-- Branching Connectors (Desktop Horizontal / Mobile Vertical) -->
        <div class="hidden md:flex justify-center items-center py-2">
          <div class="w-3/4 h-8 border-t-2 border-l-2 border-r-2 border-dashed border-navy-300 rounded-t-xl relative">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs">
              ↓
            </div>
          </div>
        </div>

        <!-- Node 2: 5 Institutional Units (SD, SMP, SMA, Ekstrakurikuler, Asrama / Boarding School) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          
          <div class="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
            <div class="w-8 h-8 rounded-lg bg-navy-100 text-navy-900 font-display font-bold flex items-center justify-center mx-auto mb-2 text-sm">
              SD
            </div>
            <h5 class="font-display font-bold text-navy-950 text-base">Unit SD / MI</h5>
            <p class="text-xs text-navy-700 mt-1">Presensi Tap QR, SPP Bulanan, Raport Digital</p>
          </div>

          <div class="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
            <div class="w-8 h-8 rounded-lg bg-navy-100 text-navy-900 font-display font-bold flex items-center justify-center mx-auto mb-2 text-sm">
              SMP
            </div>
            <h5 class="font-display font-bold text-navy-950 text-base">Unit SMP / MTs</h5>
            <p class="text-xs text-navy-700 mt-1">Bimbingan Konseling, Disiplin Poin, Absen HP</p>
          </div>

          <div class="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
            <div class="w-8 h-8 rounded-lg bg-navy-100 text-navy-900 font-display font-bold flex items-center justify-center mx-auto mb-2 text-sm">
              SMA
            </div>
            <h5 class="font-display font-bold text-navy-950 text-base">Unit SMA / MA</h5>
            <p class="text-xs text-navy-700 mt-1">Raport Otomatis, Peminatan, Kartu QR Pintar</p>
          </div>

          <div class="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
            <div class="w-8 h-8 rounded-lg bg-navy-100 text-navy-900 font-display font-bold flex items-center justify-center mx-auto mb-2 text-sm">
              EKS
            </div>
            <h5 class="font-display font-bold text-navy-950 text-base">Ekstrakurikuler</h5>
            <p class="text-xs text-navy-700 mt-1">Absensi Klub, Bakat Minat, Prestasi Siswa</p>
          </div>

          <div class="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
            <div class="w-8 h-8 rounded-lg bg-navy-100 text-navy-900 font-display font-bold flex items-center justify-center mx-auto mb-2 text-sm">
              ASR
            </div>
            <h5 class="font-display font-bold text-navy-950 text-base">Asrama / Boarding</h5>
            <p class="text-xs text-navy-700 mt-1">Izin Gerbang, E-Kantin, Disiplin Hunian</p>
          </div>

        </div>

        <!-- Node 3: Convergence to Satu Data (Bottom Node) -->
        <div class="flex justify-center">
          <div class="w-full max-w-lg bg-cyan-50 border border-cyan-200 rounded-2xl p-4 text-center">
            <div class="flex items-center justify-center gap-2 mb-1">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <strong class="font-mono text-xs text-cyan-900 uppercase">SATU BASIS DATA TERPADU</strong>
            </div>
            <p class="text-xs text-navy-800">
              Data santri, tagihan, dan mutasi saldo mengalir ke satu sistem tanpa input ganda antar-unit.
            </p>
          </div>
        </div>

      </div>

      <!-- 4 Market Segment Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(segment, idx) in segments"
          :key="segment.title"
          class="bg-paper-warm/70 border border-border rounded-2xl p-6 flex flex-col justify-between hover:bg-white hover:shadow-card transition-all reveal"
          :class="`reveal-delay-${idx + 1}`"
        >
          <div>
            <div class="w-12 h-12 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center mb-4">
              <span class="material-symbols-rounded text-2xl" aria-hidden="true">{{ segment.iconName }}</span>
            </div>
            <h4 class="font-display font-bold text-xl text-navy-950 mb-1">
              {{ segment.title }}
            </h4>
            <span class="font-mono text-xs text-cyan-700 font-semibold block mb-3">
              {{ segment.subtitle }}
            </span>
            <p class="text-xs sm:text-sm text-navy-800 leading-relaxed">
              {{ segment.description }}
            </p>
          </div>

          <div v-if="segment.linkUrl" class="mt-6 pt-4 border-t border-border/60">
            <a
              :href="segment.linkUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-xs font-semibold text-cyan-700 hover:text-cyan-800 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded"
            >
              {{ segment.linkText }}
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

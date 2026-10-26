<script setup lang="ts">
import type { ComparisonRow } from '@ssd/shared/types'
import { comparisonRows as fallbackRows } from '@ssd/shared/content'

const props = withDefaults(defineProps<{
  rows?: ComparisonRow[]
}>(), {
  rows: () => fallbackRows,
})
</script>

<template>
  <section id="perbandingan" class="py-20 md:py-28 bg-white relative overflow-hidden" aria-labelledby="honest-table-heading">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="max-w-3xl mb-12 md:mb-16 reveal">
        <div class="flex items-center gap-2 mb-3">
          <span class="label-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-100">PERBANDINGAN JUJUR</span>
          <span class="text-xs text-navy-800 font-mono">KATEGORI GENERIK</span>
        </div>
        <h2 id="honest-table-heading" class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-950 tracking-tight leading-tight">
          Bandingkan fakta operasional secara terbuka dan jujur.
        </h2>
        <p class="mt-4 text-base sm:text-lg text-navy-800 leading-relaxed">
          Kami membandingkan SSD dengan paket aplikasi tipikal yang beredar di pasar. Tanpa menyebut merek kompetitor, kami menunjukkan mengapa keterhubungan data adalah pembeda sesungguhnya.
        </p>
      </div>

      <!-- Desktop Table Layout (>= 640px) -->
      <div class="hidden sm:block overflow-x-auto rounded-3xl border border-border shadow-card mb-12 reveal">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-navy-900 text-white font-display text-sm sm:text-base border-b border-navy-950">
              <th scope="col" class="py-4 px-6 font-semibold w-1/3">Isu Operasional Sekolah</th>
              <th scope="col" class="py-4 px-6 font-semibold w-1/3 bg-navy-950/40 text-navy-200">Paket "Absen + SPP" Tipikal</th>
              <th scope="col" class="py-4 px-6 font-semibold w-1/3 bg-navy-800 text-cyan-300">School Smart Digital (SSD)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border text-xs sm:text-sm">
            <tr
              v-for="(row, idx) in rows"
              :key="row.topic"
              class="transition-colors hover:bg-paper-warm/50"
              :class="idx % 2 === 0 ? 'bg-white' : 'bg-paper/40'"
            >
              <!-- Column 1: Issue Topic -->
              <td class="py-4 px-6 font-semibold text-navy-950 align-top">
                <div class="flex items-start gap-2.5">
                  <span class="font-mono text-xs text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100 shrink-0">
                    {{ String(row.orderIndex || idx + 1).padStart(2, '0') }}
                  </span>
                  <span>{{ row.topic }}</span>
                </div>
              </td>

              <!-- Column 2: Typical Solution -->
              <td class="py-4 px-6 text-navy-700 align-top bg-navy-50/20">
                <div class="flex items-start gap-2">
                  <span class="text-rose-600 font-bold shrink-0">✕</span>
                  <span class="leading-relaxed">{{ row.typicalSolution }}</span>
                </div>
              </td>

              <!-- Column 3: SSD Solution -->
              <td class="py-4 px-6 text-navy-950 font-medium align-top bg-cyan-50/20">
                <div class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold shrink-0">✓</span>
                  <span class="leading-relaxed">{{ row.ssdSolution }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Stacked Cards Layout (< 640px) -->
      <div class="block sm:hidden space-y-4 mb-12 reveal">
        <div
          v-for="(row, idx) in rows"
          :key="row.topic"
          class="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-3"
        >
          <!-- Card Header: Topic -->
          <div class="flex items-start gap-2.5 pb-2 border-b border-border/60">
            <span class="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100 shrink-0">
              {{ String(row.orderIndex || idx + 1).padStart(2, '0') }}
            </span>
            <h3 class="font-display font-bold text-base text-navy-950 leading-snug">
              {{ row.topic }}
            </h3>
          </div>

          <!-- Sub-Card: Typical Solution -->
          <div class="p-3 bg-paper-warm/80 rounded-xl border border-border/60 text-xs">
            <div class="flex items-center gap-1.5 text-navy-600 font-semibold mb-1">
              <span class="text-rose-600 font-bold">✕</span>
              <span>Aplikasi Absensi & SPP Konvensional:</span>
            </div>
            <p class="text-navy-700 pl-4 leading-relaxed">
              {{ row.typicalSolution }}
            </p>
          </div>

          <!-- Sub-Card: SSD Solution -->
          <div class="p-3 bg-cyan-50/40 rounded-xl border border-cyan-200/60 text-xs">
            <div class="flex items-center gap-1.5 text-navy-950 font-semibold mb-1">
              <span class="text-emerald-600 font-bold">✓</span>
              <span class="text-cyan-900">School Smart Digital:</span>
            </div>
            <p class="text-navy-950 font-medium pl-4 leading-relaxed">
              {{ row.ssdSolution }}
            </p>
          </div>
        </div>
      </div>

      <!-- "Yang Tidak Kami Klaim" Disclaimer Card -->
      <div class="bg-paper-warm border-2 border-dashed border-navy-300 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative reveal">
        <div class="flex flex-col md:flex-row items-start gap-5">
          <div class="w-12 h-12 rounded-2xl bg-navy-900 text-white flex items-center justify-center shrink-0">
            <span class="material-symbols-rounded text-2xl" aria-hidden="true">verified</span>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="label-mono text-xs text-navy-700 bg-white px-2 py-0.5 rounded border border-border">BATASAN POSISI KAMI</span>
              <span class="text-xs font-mono text-emerald-700 font-semibold">100% TRANSPARAN</span>
            </div>

            <h3 class="font-display font-bold text-xl sm:text-2xl text-navy-950">
              Yang tidak kami klaim: SSD bukan aplikasi e-learning atau bank soal CBT.
            </h3>

            <p class="text-xs sm:text-sm text-navy-800 leading-relaxed">
              SSD bukan aplikasi e-learning, bank soal ujian nasional (CBT), atau perpustakaan video konten pelajaran. Kekuatan sejati SSD berakar pada operasional harian, tata kelola gerbang, kedisiplinan santri, dan kebersihan pembukuan keuangan sekolah. Jika kebutuhan utama Anda murni materi belajar online atau bank soal CBT, SSD bukan medan utama kami.
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import type { RoleLevel } from '@ssd/shared/types'
import { roleLevels as fallbackLevels } from '@ssd/shared/content'

const props = withDefaults(defineProps<{
  levels?: RoleLevel[]
}>(), {
  levels: () => fallbackLevels,
})

function getScopeBadge(levelLabel: string) {
  if (levelLabel === '0') return { label: 'Lintas Seluruh Unit', class: 'bg-navy-900 text-white' }
  if (levelLabel === '7') return { label: 'Ruang Tertutup Terenkripsi', class: 'bg-amber-100 text-amber-900 border border-amber-300' }
  if (levelLabel === '1') return { label: 'Unit Mandiri', class: 'bg-cyan-100 text-cyan-900' }
  return { label: 'Tugas Operasional', class: 'bg-navy-50 text-navy-800' }
}
</script>

<template>
  <section id="peran" class="py-16 md:py-24 bg-paper relative" aria-labelledby="role-ladder-heading">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="max-w-3xl mb-12 md:mb-16 reveal">
        <div class="flex items-center gap-2 mb-3">
          <span class="label-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-100">TINGKAT OTORISASI</span>
          <span class="text-xs text-navy-800 font-mono">ROLE LADDER 0–9</span>
        </div>
        <h2 id="role-ladder-heading" class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-950 tracking-tight leading-tight">
          Tiap staf hanya melihat menu dan data yang menjadi wewenangnya.
        </h2>
        <p class="mt-4 text-base sm:text-lg text-navy-800 leading-relaxed">
          Hierarki peran 8 tingkat memastikan pemisahan mutlak antara pimpinan yayasan, operator unit, bendahara, dan konselor BK. Tidak ada lagi risiko dokumen rahasia terbaca staf non-otoritas.
        </p>
      </div>

      <!-- Role Ladder Presentation -->
      <div class="relative bg-white rounded-3xl border border-border p-6 sm:p-8 lg:p-10 shadow-card reveal">
        
        <!-- Vertical Ladder Container -->
        <div class="space-y-4 relative">
          
          <div
            v-for="role in levels"
            :key="role.levelLabel"
            class="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200"
            :class="role.levelLabel === '0'
              ? 'bg-navy-900 text-white border-navy-950 shadow-md'
              : role.levelLabel === '7'
                ? 'bg-amber-50/60 border-amber-300 text-navy-950'
                : 'bg-paper-warm/70 border-border/80 text-navy-950 hover:bg-white'"
          >
            <!-- Left: Level Badge & Title -->
            <div class="flex items-start sm:items-center gap-4 mb-3 sm:mb-0">
              <span
                class="font-mono font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl shrink-0"
                :class="role.levelLabel === '0'
                  ? 'bg-cyan-500 text-navy-950'
                  : role.levelLabel === '7'
                    ? 'bg-amber-600 text-white'
                    : 'bg-navy-100 text-navy-900'"
              >
                LEVEL {{ role.levelLabel }}
              </span>

              <div>
                <div class="flex items-center gap-2.5">
                  <h3
                    class="font-display font-bold text-base sm:text-lg"
                    :class="role.levelLabel === '0' ? 'text-white' : 'text-navy-950'"
                  >
                    {{ role.name }}
                  </h3>
                  <span
                    class="hidden md:inline-block font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold"
                    :class="getScopeBadge(role.levelLabel).class"
                  >
                    {{ getScopeBadge(role.levelLabel).label }}
                  </span>
                </div>
                <p
                  class="text-xs sm:text-sm mt-1 leading-relaxed"
                  :class="role.levelLabel === '0' ? 'text-navy-200' : 'text-navy-700'"
                >
                  {{ role.description }}
                </p>
              </div>
            </div>

            <!-- Right: Access Policy Status -->
            <div class="sm:text-right shrink-0">
              <span
                class="inline-block md:hidden font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold mb-2"
                :class="getScopeBadge(role.levelLabel).class"
              >
                {{ getScopeBadge(role.levelLabel).label }}
              </span>
              <div
                class="text-xs font-mono"
                :class="role.levelLabel === '0' ? 'text-cyan-300' : 'text-navy-600'"
              >
                {{ role.levelLabel === '0' ? 'Otoritas Tertinggi Yayasan' : role.levelLabel === '7' ? 'Isolasi Rekam Konseling' : 'Akses Terikat Unit' }}
              </div>
            </div>
          </div>

        </div>

        <!-- Security Guarantee Notice -->
        <div class="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-navy-700">
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-emerald-600 text-lg" aria-hidden="true">verified_user</span>
            <span>Semua kueri dan filter akses ditegakkan langsung di level basis data (unit-scoped isolation).</span>
          </div>
          <span class="font-mono text-navy-500">Catatan: Level 8 sengaja tidak digunakan sesuai kebijakan sistem.</span>
        </div>

      </div>

    </div>
  </section>
</template>

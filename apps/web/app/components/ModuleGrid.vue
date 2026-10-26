<script setup lang="ts">
import type { ModuleGroup } from '@ssd/shared/types'
import { moduleGroups as fallbackGroups } from '@ssd/shared/content'

const props = withDefaults(defineProps<{
  groups?: ModuleGroup[]
}>(), {
  groups: () => fallbackGroups,
})
</script>

<template>
  <section id="modul" class="py-20 md:py-28 bg-white relative" aria-labelledby="module-grid-heading">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="max-w-3xl mb-12 md:mb-16 reveal">
        <div class="flex items-center gap-2 mb-3">
          <span class="label-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-100">MODUL OPERASIONAL</span>
          <span class="text-xs text-navy-800 font-mono">BACK OFFICE RESMI</span>
        </div>
        <h2 id="module-grid-heading" class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-950 tracking-tight leading-tight">
          12 grup modul Back Office untuk mengendalikan seluruh operasional sekolah.
        </h2>
        <p class="mt-4 text-base sm:text-lg text-navy-800 leading-relaxed">
          Dirancang berdasarkan alur kerja nyata tata usaha, bendahara, guru, konselor, dan pimpinan yayasan. Klik masing-masing modul untuk meninjau cakupan fungsionalnya.
        </p>
      </div>

      <!-- 12 Module Disclosure Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        <details
          v-for="(group, idx) in groups"
          :key="group.slug"
          class="group bg-paper-warm border border-border/80 rounded-2xl overflow-hidden transition-all duration-200 hover:border-navy-300 hover:shadow-card open:bg-white open:ring-1 open:ring-navy-900/10 reveal"
          :class="`reveal-delay-${(idx % 4) + 1}`"
        >
          <!-- Native HTML Summary Tag -->
          <summary class="cursor-pointer list-none p-5 sm:p-6 flex items-start justify-between gap-4 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded-2xl">
            <div class="flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center shrink-0 mt-0.5 group-open:bg-navy-900 group-open:text-white transition-colors">
                <span class="material-symbols-rounded text-xl" aria-hidden="true">{{ group.iconName || 'folder' }}</span>
              </div>
              <div>
                <h3 class="font-display font-bold text-lg text-navy-950 group-hover:text-cyan-700 transition-colors">
                  {{ group.title }}
                </h3>
                <p v-if="group.description" class="text-xs text-navy-700 line-clamp-2 mt-1 leading-relaxed">
                  {{ group.description }}
                </p>
                <span class="inline-block mt-2 font-mono text-[11px] font-semibold text-navy-600 bg-navy-50 px-2 py-0.5 rounded border border-border/50">
                  {{ group.items.length }} Modul Terintegrasi
                </span>
              </div>
            </div>

            <!-- Custom Animated Toggle Chevron -->
            <div class="shrink-0 text-navy-400 group-open:rotate-180 transition-transform duration-200 mt-1">
              <span class="material-symbols-rounded text-xl" aria-hidden="true">expand_more</span>
            </div>
          </summary>

          <!-- Progressive Disclosure Content: List of Items -->
          <div class="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-border/50">
            <ul class="space-y-2.5">
              <li
                v-for="item in group.items"
                :key="item.title"
                class="flex items-center gap-2.5 text-xs text-navy-800"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"></span>
                <span class="leading-relaxed">{{ item.title }}</span>
              </li>
            </ul>
          </div>
        </details>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Remove standard browser disclosure triangle */
summary::-webkit-details-marker {
  display: none;
}
</style>

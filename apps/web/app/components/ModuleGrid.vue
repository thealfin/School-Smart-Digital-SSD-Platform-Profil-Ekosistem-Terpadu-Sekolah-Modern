<script setup lang="ts">
import type { ModuleGroup } from '@ssd/shared/types'
import { moduleGroups as fallbackGroups } from '@ssd/shared/content'
import { APK_ICON_FILES, resolveApkIcon } from '~/utils/apkIcons'

const props = withDefaults(
  defineProps<{
    groups?: ModuleGroup[]
  }>(),
  {
    groups: () => fallbackGroups,
  }
)

function getModuleApkIcon(group: ModuleGroup, idx: number): string {
  const matched = resolveApkIcon(group.slug, group.title)
  if (matched) return matched
  const pool = [
    APK_ICON_FILES.pegawai,
    APK_ICON_FILES.waliMurid,
    APK_ICON_FILES.security,
    APK_ICON_FILES.mitraUsaha,
    APK_ICON_FILES.pimpinan,
  ]
  return pool[idx % pool.length]
}

function getMasonryHeightClass(idx: number): string {
  const heights = ['min-h-[260px]', 'min-h-[300px]', 'min-h-[275px]', 'min-h-[315px]']
  return heights[idx % heights.length]
}
</script>

<template>
  <section id="modul" class="py-20 md:py-28 bg-white relative" aria-labelledby="module-grid-heading">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mb-12 md:mb-16 reveal">
        <div class="flex items-center gap-2 mb-3">
          <span class="label-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-100">
            MODUL OPERASIONAL
          </span>
          <span class="text-xs text-navy-800 font-mono">BACK OFFICE RESMI</span>
        </div>
        <h2
          id="module-grid-heading"
          class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-950 tracking-tight leading-tight"
        >
          12 grup modul Back Office untuk mengendalikan seluruh operasional sekolah.
        </h2>
        <p class="mt-4 text-base sm:text-lg text-navy-800 leading-relaxed">
          Dirancang berdasarkan alur kerja nyata tata usaha, bendahara, guru, konselor, dan pimpinan yayasan. Arahkan kursor atau klik masing-masing kartu modul untuk membalik kartu dan meninjau cakupan fungsionalnya.
        </p>
      </div>

      <!-- 12 Module Masonry Grid with 3D Flipped Cards -->
      <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 sm:gap-6 space-y-5 sm:space-y-6">
        <details
          v-for="(group, idx) in groups"
          :key="group.slug"
          class="flip-card-details group break-inside-avoid rounded-3xl transition-all duration-300 reveal"
          :class="[`reveal-delay-${(idx % 4) + 1}`, getMasonryHeightClass(idx)]"
        >
          <!-- Native HTML Summary Tag (Front & Trigger for 3D Flip) -->
          <summary
            class="flip-card-summary cursor-pointer list-none p-5 sm:p-6 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded-3xl h-full"
            :class="getMasonryHeightClass(idx)"
          >
            <div class="flip-card-inner" :class="getMasonryHeightClass(idx)">
              <!-- FRONT FACE: Only APK Icon & Title -->
              <div class="flip-card-face flip-card-front p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-50 to-white border border-slate-200/90 rounded-3xl shadow-sm">
                <span class="absolute top-4 left-4 font-mono text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200/60">
                  MODUL {{ String(idx + 1).padStart(2, '0') }}
                </span>

                <div class="absolute top-4 right-4 text-slate-400 group-hover:text-cyan-600 transition-colors">
                  <span class="material-symbols-rounded text-lg" aria-hidden="true">expand_more</span>
                </div>

                <!-- Official APK Icon from /media -->
                <div class="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 flex items-center justify-center rounded-3xl bg-white shadow-md shadow-navy-950/8 border border-slate-100 p-2.5 group-hover:scale-105 transition-transform duration-300">
                  <img
                    :src="getModuleApkIcon(group, idx)"
                    :alt="`Ikon APK ${group.title}`"
                    class="w-full h-full object-contain drop-shadow-sm"
                    loading="lazy"
                  />
                  <span
                    class="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-navy-900 text-cyan-300 flex items-center justify-center shadow-md border border-white"
                    aria-hidden="true"
                  >
                    <span class="material-symbols-rounded text-sm">{{ group.iconName || 'folder' }}</span>
                  </span>
                </div>

                <h3 class="font-display font-bold text-lg sm:text-xl text-navy-950 tracking-tight leading-snug">
                  {{ group.title }}
                </h3>

                <span class="mt-3 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-cyan-700">
                  <span>{{ group.items.length }} Sub-Modul</span>
                  <span class="material-symbols-rounded text-xs">360</span>
                </span>
              </div>

              <!-- BACK FACE: Full Description & Integrated Sub-Modules List -->
              <div class="flip-card-face flip-card-back p-5 sm:p-6 flex flex-col justify-between bg-gradient-to-br from-navy-950 via-navy-900 to-cyan-950 text-white rounded-3xl border border-cyan-400/30 shadow-xl text-left">
                <div>
                  <div class="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10">
                    <div class="flex items-center gap-2 min-w-0">
                      <img
                        :src="getModuleApkIcon(group, idx)"
                        :alt="group.title"
                        class="w-7 h-7 object-contain shrink-0 rounded-lg bg-white/10 p-0.5"
                      />
                      <h4 class="font-display font-bold text-sm sm:text-base text-white truncate">
                        {{ group.title }}
                      </h4>
                    </div>
                    <span class="font-mono text-[10px] font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-400/30 shrink-0">
                      {{ group.items.length }} Fitur
                    </span>
                  </div>

                  <p v-if="group.description" class="text-xs text-slate-200 leading-relaxed mb-3">
                    {{ group.description }}
                  </p>

                  <ul class="space-y-1.5 max-h-[150px] overflow-y-auto pr-1 custom-back-scroll">
                    <li
                      v-for="item in group.items"
                      :key="item.title"
                      class="flex items-start gap-2 text-[11px] text-slate-100/95"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                      <span class="leading-snug">{{ item.title }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </summary>

          <!-- Screen-Reader & Progressive Disclosure Fallback Content -->
          <div class="sr-only">
            <p v-if="group.description">{{ group.description }}</p>
            <ul>
              <li v-for="item in group.items" :key="item.title">{{ item.title }}</li>
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

.flip-card-details {
  perspective: 1200px;
}

.flip-card-summary {
  padding: 0 !important;
  display: block;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  transform-style: preserve-3d;
}

/* Flip on hover (desktop) OR when <details open> is active (click/tap/keyboard) */
.flip-card-details:hover .flip-card-inner,
.flip-card-details[open] .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-face {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-card-front {
  transform: rotateY(0deg);
}

.flip-card-back {
  transform: rotateY(180deg);
}

.custom-back-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-back-scroll::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.35);
  border-radius: 9999px;
}

@media (prefers-reduced-motion: reduce) {
  .flip-card-inner {
    transition: none;
  }
}
</style>

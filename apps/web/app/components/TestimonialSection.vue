<script setup lang="ts">
import { computed } from 'vue'
import type { TestimonialItem } from '@ssd/shared/types'

const props = defineProps<{
  items?: TestimonialItem[]
}>()

const { data } = await useFetch<{ testimonials: TestimonialItem[] }>('/api/testimonials', {
  default: () => ({ testimonials: [] }),
})

const testimonialList = computed(() => {
  if (props.items && props.items.length > 0) return props.items
  return data.value?.testimonials || []
})
</script>

<template>
  <section
    v-if="testimonialList.length > 0"
    id="testimoni"
    class="py-20 md:py-28 bg-white relative border-t border-slate-200/80 overflow-hidden"
    aria-labelledby="testimonial-heading"
  >
    <!-- Background Decor Elements -->
    <div class="absolute top-0 right-1/4 w-96 h-96 bg-cyan-50/60 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-navy-50/50 rounded-full blur-3xl pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 reveal">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-mono font-semibold mb-3 border border-cyan-200">
          <span class="material-symbols-rounded text-sm">handshake</span>
          <span>KATA MITRA</span>
        </div>
        <h2
          id="testimonial-heading"
          class="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-navy-950 tracking-tight leading-tight"
        >
          Pengalaman Sekolah dan Yayasan Mitra
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-600 font-body leading-relaxed">
          Dari kepala sekolah, ketua yayasan, dan wakasek kesiswaan yang telah mentransformasikan operasional sekolahnya bersama School Smart Digital.
        </p>
      </div>

      <!-- Testimonial Cards Grid (3 Columns) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        <div
          v-for="(item, idx) in testimonialList"
          :key="item.id || item.name"
          class="bg-slate-50/80 hover:bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 reveal"
          :class="`reveal-delay-${(idx % 3) + 1}`"
        >
          <div>
            <!-- Top Row: 5 Star Rating & Verified Badge -->
            <div class="flex items-center justify-between mb-5">
              <!-- Star Rating -->
              <div class="flex items-center gap-1 text-amber-400" :aria-label="`Rating ${item.rating || 5} dari 5 bintang`">
                <span
                  v-for="star in (item.rating || 5)"
                  :key="star"
                  class="material-symbols-rounded text-lg text-amber-400"
                >
                  star
                </span>
              </div>

              <!-- Verified Badge -->
              <span
                v-if="item.isVerified !== false"
                class="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200"
              >
                <span class="material-symbols-rounded text-xs text-cyan-600">verified</span>
                <span>Mitra SSD</span>
              </span>
            </div>

            <!-- Quote Text -->
            <blockquote class="text-sm sm:text-base text-slate-700 font-body leading-relaxed mb-6 italic relative">
              <span class="text-2xl text-cyan-500 font-serif not-italic leading-none mr-1">&ldquo;</span>
              {{ item.content }}
              <span class="text-2xl text-cyan-500 font-serif not-italic leading-none ml-1">&rdquo;</span>
            </blockquote>
          </div>

          <!-- Bottom: Client Profile -->
          <div class="pt-5 border-t border-slate-200/70 flex items-center gap-3.5">
            <!-- Avatar / Photo -->
            <div class="relative shrink-0">
              <img
                v-if="item.avatarUrl"
                :src="item.avatarUrl"
                :alt="item.name"
                class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                loading="lazy"
              />
              <div
                v-else
                class="w-12 h-12 rounded-full bg-navy-900 text-white font-display font-bold flex items-center justify-center text-sm border-2 border-white shadow-xs"
              >
                {{ item.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('') }}
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-[9px] text-white">
                ✓
              </span>
            </div>

            <!-- Details -->
            <div class="min-w-0">
              <h3 class="font-display font-bold text-sm text-navy-950 truncate group-hover:text-cyan-700 transition-colors">
                {{ item.name }}
              </h3>
              <p class="text-xs text-slate-500 font-body truncate">
                {{ item.roleTitle }}
              </p>
              <p class="text-xs font-semibold text-cyan-700 font-body truncate">
                {{ item.organization }}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>


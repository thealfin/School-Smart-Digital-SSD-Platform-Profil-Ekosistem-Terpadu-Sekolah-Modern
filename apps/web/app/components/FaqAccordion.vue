<template>
  <section
    id="faq"
    aria-labelledby="faq-heading"
    class="relative bg-slate-50 py-20 sm:py-28 border-b border-navy-100/60 overflow-hidden"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- 2-Column Grid Layout ala Pesantren Smart Digital -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        <!-- Left Column: FAQ Section Header & Accordion List (7 Cols) -->
        <div class="lg:col-span-7 space-y-8 reveal-left">
          
          <!-- Section Header -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-mono font-semibold mb-3 border border-cyan-200">
              <span class="material-symbols-rounded text-sm">help_outline</span>
              <span>TANYA JAWAB &amp; TRANSPARANSI</span>
            </div>
            <h2
              id="faq-heading"
              class="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-navy-950 tracking-tight leading-tight"
            >
              Pertanyaan yang Sering Diajukan
            </h2>
            <p class="mt-3 text-base text-slate-600 font-body leading-relaxed">
              Jawaban jujur dan transparan seputar fitur, integrasi, batasan sistem, keamanan, dan skema investasi SSD.
            </p>
          </div>

          <!-- FAQ Accordion List (Single-Open State) -->
          <div class="space-y-3.5" role="list">
            <div
              v-for="(item, index) in faqList"
              :key="item.id || index"
              role="listitem"
              class="rounded-2xl border transition-all duration-200 overflow-hidden"
              :class="[
                isOpen(index)
                  ? 'border-cyan-500/60 bg-white shadow-md ring-1 ring-cyan-500/20'
                  : 'border-slate-200/90 bg-white/80 hover:bg-white hover:border-slate-300 shadow-xs'
              ]"
            >
              <!-- Accordion Trigger Button -->
              <button
                :id="`faq-btn-${index}`"
                type="button"
                :aria-expanded="isOpen(index) ? 'true' : 'false'"
                :aria-controls="`faq-panel-${index}`"
                class="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded-2xl select-none"
                @click="toggleFaq(index, item.question)"
              >
                <div class="flex items-center gap-3.5 pr-2">
                  <span
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-colors duration-200"
                    :class="[
                      isOpen(index)
                        ? 'bg-cyan-500 text-navy-950 font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    ]"
                    aria-hidden="true"
                  >
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                  <span
                    class="text-base sm:text-lg font-display font-bold leading-snug transition-colors duration-200"
                    :class="[isOpen(index) ? 'text-cyan-800' : 'text-navy-900']"
                  >
                    {{ item.question }}
                  </span>
                </div>

                <span
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-250 ease-standard"
                  :class="[
                    isOpen(index)
                      ? 'rotate-180 bg-cyan-100 text-cyan-700'
                      : 'bg-slate-100 text-slate-500'
                  ]"
                  aria-hidden="true"
                >
                  <span class="material-symbols-rounded text-lg">arrow_downward</span>
                </span>
              </button>

              <!-- Accordion Content Panel with CSS Grid Animation -->
              <div
                :id="`faq-panel-${index}`"
                role="region"
                :aria-labelledby="`faq-btn-${index}`"
                class="faq-panel grid transition-[grid-template-rows] duration-250 ease-standard"
                :class="[isOpen(index) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']"
              >
                <div class="overflow-hidden">
                  <div class="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 text-sm sm:text-base text-slate-600 font-body leading-relaxed border-t border-slate-100">
                    <p>{{ item.answer }}</p>
                    <div v-if="item.category" class="mt-3.5 flex items-center gap-2">
                      <span class="text-[11px] font-mono uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        Kategori: {{ item.category }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Card Visual Portal Showcase (5 Cols) -->
        <div class="lg:col-span-5 lg:sticky lg:top-28 reveal-right">
          <div
            class="relative rounded-2xl rounded-tl-[110px] overflow-hidden bg-gradient-to-br from-[#0C3161] via-[#082245] to-[#01A8CF] p-8 sm:p-10 text-white shadow-2xl border border-cyan-500/30 min-h-[460px] flex flex-col justify-between"
          >
            <!-- Ambient Portal Arcs & Glow -->
            <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
            <div class="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-navy-600/40 blur-3xl pointer-events-none" />
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/10 via-transparent to-transparent pointer-events-none" />

            <!-- Floating Bulb Badge (Top Right) ala PSD -->
            <div class="absolute top-6 right-6 z-10">
              <div class="w-12 h-12 rounded-2xl bg-amber-400/90 hover:bg-amber-400 text-navy-950 flex items-center justify-center shadow-lg border border-amber-300 transition-transform duration-300 hover:scale-110">
                <span class="text-2xl" role="img" aria-label="Ide Cerdas">
                  <span class="material-symbols-rounded">emoji_objects</span>
                </span>
              </div>
            </div>

            <!-- Top Visual Showcase Header -->
            <div class="relative z-10 pt-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cyan-300 text-xs font-mono font-semibold border border-white/15 mb-4">
                <span>PORTAL RESMI SSD</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-display font-extrabold tracking-tight leading-snug">
                Punya Pertanyaan Spesifik Tentang Sekolah Anda?
              </h3>
              <p class="mt-3 text-xs sm:text-sm text-cyan-100 font-body leading-relaxed">
                Struktur yayasan, integrasi smart turnstile gate QR Code, hingga sistem bagi hasil koperasi bisa dikonsultasikan langsung bersama tim ahli kami.
              </p>
            </div>

            <!-- Talent Silhouette / Portal Center Graphic -->
            <div class="relative z-10 my-8 py-4 flex items-center justify-center">
              <div class="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-dashed border-cyan-300/40 p-2 flex items-center justify-center">
                <div class="w-full h-full rounded-full bg-white/10 backdrop-blur-sm border border-cyan-400/50 flex flex-col items-center justify-center text-center p-4">
                  <span class="material-symbols-rounded text-4xl text-cyan-300 mb-1">support_agent</span>
                  <span class="text-[11px] font-mono uppercase tracking-wider text-white font-bold">KONSULTAN AHLI</span>
                  <span class="text-[10px] text-cyan-200">Siap Dampingi</span>
                </div>
                <!-- Orbiting Pulse Indicator -->
                <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
                <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400" />
              </div>
            </div>

            <!-- Floating Info Pill & Action Button at Bottom -->
            <div class="relative z-10 space-y-3 pt-2">
              <div class="rounded-xl bg-white/10 backdrop-blur-md p-3.5 border border-white/20 text-xs text-white/90">
                <p class="leading-relaxed">
                <strong class="text-cyan-300">Konsultasi Interaktif:</strong> 
                <br />Tim konsultan SSD siap membantu membedah alur operasional sekolah Anda via Google Meet atau kunjungan langsung.
                </p>
              </div>

              <NuxtLink
                to="/kontak"
                class="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-extrabold text-xs uppercase tracking-wider shadow-xl transition-all duration-200 hover:shadow-cyan-500/30"
              >
                <span>Konsultasikan Kebutuhan Anda</span>
              </NuxtLink>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { faqs as defaultFaqs, type FaqItem } from '@ssd/shared'

const props = withDefaults(
  defineProps<{
    items?: FaqItem[]
  }>(),
  {
    items: () => defaultFaqs,
  }
)

const faqList = computed(() => props.items || defaultFaqs)

// Single-open state: Only 1 question open at a time (first open by default)
const openIndex = ref<number | null>(0)

function isOpen(index: number): boolean {
  return openIndex.value === index
}

function toggleFaq(index: number, question: string) {
  if (openIndex.value === index) {
    openIndex.value = null
  } else {
    openIndex.value = index
    // First-party telemetry event
    if (import.meta.client) {
      const payload = JSON.stringify({
        eventName: 'faq_open',
        pagePath: window.location.pathname,
        props: { question, index },
        sessionId: undefined,
      })
      if (!navigator.sendBeacon?.('/api/track', new Blob([payload], { type: 'application/json' }))) {
        $fetch('/api/track', { method: 'POST', body: JSON.parse(payload) }).catch(() => {})
      }
    }
  }
}

// Inject SSR JSON-LD Schema.org FAQPage
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqList.value.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      }),
    },
  ],
})
</script>

<style scoped>
/* Progressive enhancement: when JavaScript is disabled, render answers visible */
@media (scripting: none) {
  .faq-panel {
    grid-template-rows: 1fr !important;
  }
}
</style>

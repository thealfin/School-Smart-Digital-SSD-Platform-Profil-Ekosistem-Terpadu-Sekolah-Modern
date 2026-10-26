<template>
  <div class="min-h-screen bg-background text-primary selection:bg-cyan-500 selection:text-white">
    <!-- Header / Brand Bar -->
    <header class="border-b border-navy-100/40 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-sm">
          <img src="/brand/logo.svg" alt="School Smart Digital" class="h-8 w-auto" />
        </NuxtLink>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-cyan-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-sm px-2 py-1"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Beranda</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
      <div class="mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-mono font-medium mb-4">
          <span class="material-symbols-rounded text-sm">help_outline</span>
          <span>PUSAT PERTANYAAN & JAWABAN</span>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-900 tracking-tight leading-tight">
          Pertanyaan yang Sering Diajukan
        </h1>
        <p class="mt-3 text-base sm:text-lg text-navy-700 font-body">
          Penjelasan transparan seputar fitur, keamanan, integrasi, dan investasi sistem School Smart Digital (SSD).
        </p>
      </div>

      <!-- FAQ Items List -->
      <div class="space-y-4">
        <details
          v-for="(faq, index) in faqs"
          :key="index"
          class="group rounded-xl border border-navy-100/80 bg-surface p-5 transition-colors open:bg-paper-warm/50 open:border-cyan-200"
        >
          <summary class="flex items-center justify-between cursor-pointer list-none font-display font-semibold text-lg text-navy-900 select-none">
            <span class="pr-4">{{ faq.question }}</span>
            <span class="material-symbols-rounded text-navy-700 transition-transform group-open:rotate-180">
              arrow_downward
            </span>
          </summary>
          <div class="mt-4 pt-3 border-t border-navy-100/50 text-navy-700 font-body leading-relaxed text-sm sm:text-base">
            <p>{{ faq.answer }}</p>
          </div>
        </details>
      </div>

      <!-- Consultation Callout -->
      <div class="mt-12 p-8 rounded-2xl bg-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 class="text-xl font-display font-bold">Punya pertanyaan spesifik untuk yayasan Anda?</h3>
          <p class="mt-1 text-sm text-navy-100/80">Tim konsultan kami siap memberikan simulasi dan presentasi sistem secara langsung.</p>
        </div>
        <NuxtLink
          to="/#demo"
          class="shrink-0 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          Jadwalkan Demo
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { faqs } from '@ssd/shared'

useHead({
  title: 'FAQ — School Smart Digital (SSD)',
  meta: [
    {
      name: 'description',
      content: 'Pertanyaan yang sering diajukan mengenai School Smart Digital (SSD). Fitur, keamanan, integrasi satu data, dan biaya investasi sekolah.',
    },
  ],
})
</script>

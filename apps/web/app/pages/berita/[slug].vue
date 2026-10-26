<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, error } = await useFetch(`/api/news/${slug.value}`)
const article = computed(() => data.value?.article)

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel Tidak Ditemukan' })
}

useHead({
  title: `${article.value?.title} — School Smart Digital`,
  meta: [
    { name: 'description', content: article.value?.summary || article.value?.title },
    { property: 'og:title', content: article.value?.title },
    { property: 'og:description', content: article.value?.summary },
    { property: 'og:image', content: article.value?.coverImageUrl },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <SiteHeader mode="subpage" />

    <main class="pt-28 pb-20">
      <article v-if="article" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-xs font-mono text-slate-500 mb-8" aria-label="Breadcrumb">
          <NuxtLink to="/" class="hover:text-cyan-600 transition-colors">Beranda</NuxtLink>
          <span>/</span>
          <NuxtLink to="/berita" class="hover:text-cyan-600 transition-colors">Berita</NuxtLink>
          <span>/</span>
          <span class="text-slate-800 truncate max-w-xs">{{ article.title }}</span>
        </nav>

        <!-- Category & Date Header -->
        <div class="flex items-center gap-3 text-xs font-mono text-cyan-700 mb-4">
          <span class="px-3 py-1 rounded-full bg-cyan-100 font-semibold">{{ article.category }}</span>
          <span>•</span>
          <span>{{ new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          <span>•</span>
          <span>Oleh {{ article.author }}</span>
        </div>

        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight leading-snug mb-6 font-display">
          {{ article.title }}
        </h1>

        <p v-if="article.summary" class="text-base sm:text-lg text-slate-600 font-body leading-relaxed mb-8 border-l-4 border-cyan-500 pl-4 py-1 italic bg-cyan-50/40 rounded-r-lg">
          {{ article.summary }}
        </p>

        <!-- Cover Image -->
        <div v-if="article.coverImageUrl" class="rounded-2xl overflow-hidden aspect-video mb-10 shadow-lg border border-slate-200">
          <img
            :src="article.coverImageUrl"
            :alt="article.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Article Content -->
        <div
          class="prose prose-slate max-w-none font-body leading-relaxed text-slate-700 space-y-4 text-base"
          v-html="article.content"
        />

        <!-- Article Footer / Share -->
        <div class="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NuxtLink
            to="/berita"
            class="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-cyan-600 transition-colors"
          >
            <span class="material-symbols-rounded text-base">arrow_back</span>
            <span>Kembali ke Semua Berita</span>
          </NuxtLink>

          <NuxtLink
            to="/#demo"
            class="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-md transition-all"
          >
            Jadwalkan Konsultasi Sekolah
          </NuxtLink>
        </div>
      </article>
    </main>

    <SiteFooter />
  </div>
</template>


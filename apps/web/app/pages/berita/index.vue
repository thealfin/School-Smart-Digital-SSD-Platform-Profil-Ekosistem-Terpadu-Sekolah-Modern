<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Berita & Warta Edukasi — School Smart Digital',
  meta: [
    {
      name: 'description',
      content: 'Kabar terkini seputar transformasi digital sekolah, liputan bimbingan teknis SSD, dan wawasan pengelolaan institusi pendidikan modern.',
    },
  ],
})

const route = useRoute()
const search = ref('')
const selectedCategory = ref('all')

const { data } = await useFetch('/api/news')
const articles = computed(() => data.value?.articles || [])

const filteredArticles = computed(() => {
  return articles.value.filter((art: any) => {
    const matchesCategory = selectedCategory.value === 'all' || art.category === selectedCategory.value
    const matchesSearch = !search.value ||
      art.title.toLowerCase().includes(search.value.toLowerCase()) ||
      (art.summary && art.summary.toLowerCase().includes(search.value.toLowerCase()))
    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <SiteHeader mode="subpage" />

    <main class="pt-28 pb-20">
      <!-- Header -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 reveal">
        <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 text-cyan-800 mb-4">
          WARTA & PUBLIKASI RESMI
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4 font-display">
          Berita & Wawasan <br class="hidden sm:inline" />
          <span class="text-cyan-600">Transformasi Sekolah Digital</span>
        </h1>
        <p class="max-w-2xl mx-auto text-base text-slate-600 font-body">
          Ikuti perkembangan teknologi pendidikan, liputan implementasi sistem, dan tips praktis mengelola administrasi sekolah di era serba digital.
        </p>

        <!-- Search & Filter Bar -->
        <div class="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <span class="material-symbols-rounded absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              v-model="search"
              type="text"
              placeholder="Cari judul berita atau artikel..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
            />
          </div>
          <select
            v-model="selectedCategory"
            class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
          >
            <option value="all">Semua Kategori</option>
            <option value="Bimtek">Bimtek</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Manajemen">Manajemen</option>
            <option value="Studi Kasus">Studi Kasus</option>
          </select>
        </div>
      </section>

      <!-- Articles Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="(article, idx) in filteredArticles"
            :key="article.id"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group reveal"
            :class="`reveal-delay-${(idx % 3) + 1}`"
          >
            <div>
              <NuxtLink :to="`/berita/${article.slug}`" class="block relative aspect-video overflow-hidden bg-slate-100">
                <img
                  v-if="article.coverImageUrl"
                  :src="article.coverImageUrl"
                  :alt="article.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-navy-900 text-cyan-400">
                  <span class="material-symbols-rounded text-4xl">newspaper</span>
                </div>
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-navy-900/80 text-white backdrop-blur-sm">
                  {{ article.category }}
                </span>
              </NuxtLink>

              <div class="p-6">
                <div class="flex items-center gap-3 text-xs text-slate-500 font-mono mb-2">
                  <span>{{ new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
                  <span>•</span>
                  <span>{{ article.author }}</span>
                </div>

                <h2 class="text-lg font-bold text-navy-900 group-hover:text-cyan-600 transition-colors font-display line-clamp-2 mb-3">
                  <NuxtLink :to="`/berita/${article.slug}`">
                    {{ article.title }}
                  </NuxtLink>
                </h2>

                <p class="text-sm text-slate-600 font-body line-clamp-3 leading-relaxed">
                  {{ article.summary }}
                </p>
              </div>
            </div>

            <div class="p-6 pt-0">
              <NuxtLink
                :to="`/berita/${article.slug}`"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                <span>Baca Selengkapnya</span>
                <span class="material-symbols-rounded text-sm">arrow_forward</span>
              </NuxtLink>
            </div>
          </article>
        </div>

        <div v-else class="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <span class="material-symbols-rounded text-5xl text-slate-300 mb-2">article</span>
          <p class="text-base font-semibold text-slate-600 font-display">Tidak ada artikel yang cocok</p>
          <p class="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>


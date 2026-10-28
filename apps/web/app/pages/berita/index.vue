<script setup lang="ts">
import { ref, computed } from 'vue'

useSeoMeta({
  title: 'Berita & Wawasan || School Smart Digital ||',
  description: 'Kabar implementasi, liputan bimtek SSD, dan wawasan pengelolaan sekolah modern.',
  ogTitle: 'Berita & Wawasan || School Smart Digital ||',
  ogDescription: 'Kabar implementasi, liputan bimtek SSD, dan wawasan pengelolaan sekolah modern.',
})

const search = ref('')
const selectedCategory = ref('all')

const { data } = await useFetch('/api/news')
const articles = computed(() => data.value?.articles || [])

const defaultCategoryOptions = [
  { id: 'Bimtek', label: 'Bimtek', color: '#01A8CF' },
  { id: 'Teknologi', label: 'Teknologi', color: '#0C3161' },
  { id: 'Manajemen', label: 'Manajemen', color: '#10b981' },
  { id: 'Studi Kasus', label: 'Studi Kasus', color: '#6366f1' },
  { id: 'Pengumuman', label: 'Pengumuman', color: '#f59e0b' },
]

function getCategoryName(art: any): string {
  if (art?.category) return String(art.category)
  const meta = art?.meta || {}
  if (meta.category_name) return String(meta.category_name)
  if (Array.isArray(meta.category) && meta.category.length) return String(meta.category[0])
  return 'Berita'
}

function getReadTimeMinutes(art: any): number {
  if (art?.meta?.read_time_minutes) return Number(art.meta.read_time_minutes)
  const words = String(art?.content || '')
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

const categoryOptions = computed(() => {
  const map = new Map<string, { id: string; label: string; color: string }>()
  for (const c of defaultCategoryOptions) {
    map.set(c.id.toLowerCase(), c)
  }
  for (const art of articles.value) {
    const cat = getCategoryName(art)
    if (cat && !map.has(cat.toLowerCase())) {
      map.set(cat.toLowerCase(), {
        id: cat,
        label: cat,
        color: art.meta?.category_color || '#01A8CF',
      })
    }
  }
  return Array.from(map.values())
})

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const art of articles.value) {
    const cat = getCategoryName(art)
    counts[cat] = (counts[cat] || 0) + 1
  }
  return counts
})

const filteredArticles = computed(() => {
  return articles.value.filter((art: any) => {
    const cat = getCategoryName(art)
    const matchesCategory =
      selectedCategory.value === 'all' ||
      cat.toLowerCase() === selectedCategory.value.toLowerCase()
    const q = search.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      String(art.title || '').toLowerCase().includes(q) ||
      String(art.summary || '').toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })
})

function formatDate(d: string | Date | undefined) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <SiteHeader mode="subpage" />

    <main class="pt-28 pb-20">
      <!-- Header -->
      <section class="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 reveal">
        <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 text-cyan-800 mb-4">
          WARTA &amp; PUBLIKASI RESMI
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4 font-display">
          Berita &amp; Wawasan <br class="hidden sm:inline" />
          <span class="text-cyan-600">Transformasi Sekolah Digital</span>
        </h1>
        <p class="max-w-2xl mx-auto text-base text-slate-600 font-body">
          Ikuti perkembangan teknologi pendidikan, liputan implementasi sistem, dan tips praktis mengelola administrasi sekolah di era serba digital.
        </p>

        <!-- Search & S-Curve Category Filter Dropdown Bar -->
        <div class="relative z-30 mt-8 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <div class="relative w-full sm:flex-1">
            <span class="material-symbols-rounded absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              v-model="search"
              type="text"
              placeholder="Cari judul berita atau artikel..."
              class="w-full pl-10 pr-4 py-2.5 rounded-tl-[1.2rem] rounded-br-[1.2rem] rounded-tr-md rounded-bl-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xs"
            />
          </div>

          <CategoryFilterDropdown
            v-model="selectedCategory"
            all-value="all"
            all-label="Semua"
            filter-label="Filter Kategori"
            :categories="categoryOptions"
            :total-count="articles.length"
            :counts="categoryCounts"
          />
        </div>
      </section>

      <!-- Articles Grid -->
      <section class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="(article, idx) in filteredArticles"
            :key="article.id"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group reveal"
            :class="`reveal-delay-${(idx % 3) + 1}`"
          >
            <div>
              <NuxtLink :to="`/berita/${article.slug}`" class="block relative aspect-video overflow-hidden bg-slate-100">
                <img
                  v-if="article.coverImageUrl"
                  :src="article.coverImageUrl"
                  :alt="article.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-navy-900 text-cyan-400">
                  <span class="material-symbols-rounded text-4xl">newspaper</span>
                </div>
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-navy-900/85 text-white backdrop-blur-sm">
                  {{ getCategoryName(article) }}
                </span>
              </NuxtLink>

              <div class="p-6">
                <div class="flex items-center justify-between gap-2 text-xs text-slate-500 font-mono mb-2.5">
                  <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
                  <span class="inline-flex items-center gap-1 text-cyan-700">
                    <span class="material-symbols-rounded text-sm">schedule</span>
                    <span>{{ getReadTimeMinutes(article) }} mnt</span>
                  </span>
                </div>

                <h2 class="text-lg font-bold text-navy-900 group-hover:text-cyan-600 transition-colors font-display line-clamp-2 mb-3 leading-snug">
                  <NuxtLink :to="`/berita/${article.slug}`">
                    {{ article.title }}
                  </NuxtLink>
                </h2>

                <p class="text-sm text-slate-600 font-body line-clamp-3 leading-relaxed">
                  {{ article.summary || 'Baca selengkapnya artikel ini untuk mendapatkan wawasan terbaru seputar ekosistem sekolah digital.' }}
                </p>
              </div>
            </div>

            <div class="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-400 font-mono truncate max-w-[140px]">
                {{ article.author || article.meta?.author_name || 'Tim SSD' }}
              </span>
              <NuxtLink
                :to="`/berita/${article.slug}`"
                class="inline-flex items-center gap-1.5 font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                <span>Baca Selengkapnya</span>
                <span class="material-symbols-rounded text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </NuxtLink>
            </div>
          </article>
        </div>

        <div v-else class="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <span class="material-symbols-rounded text-5xl text-slate-300 mb-2">article</span>
          <p class="text-base font-semibold text-slate-600 font-display">Tidak ada artikel yang cocok</p>
          <p class="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian atau kategori yang lain.</p>
          <button
            v-if="selectedCategory !== 'all' || search"
            type="button"
            class="mt-4 px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 transition cursor-pointer"
            @click="selectedCategory = 'all'; search = ''"
          >
            Tampilkan Semua Artikel
          </button>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

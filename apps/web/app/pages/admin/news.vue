<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminNewsFormModal, { type NewsCategoryOption } from '~/components/admin/AdminNewsFormModal.vue'

definePageMeta({
  middleware: 'admin',
})

useHead({
  title: 'Kelola Berita & Artikel - Admin SSD',
})

const { user, clear: clearSession } = useUserSession()
const router = useRouter()

const { data, refresh } = await useFetch('/api/admin/news')
const articles = computed(() => data.value?.articles || [])

const isModalOpen = ref(false)
const selectedArticle = ref<any | null>(null)
const isLogoutModalOpen = ref(false)
const isMobileSidebarOpen = ref(false)

const search = ref('')
const filterCategory = ref('all')

const customCategories = ref<NewsCategoryOption[]>([
  { name: 'Bimtek', color: '#01A8CF' },
  { name: 'Teknologi', color: '#0C3161' },
  { name: 'Manajemen', color: '#10b981' },
  { name: 'Studi Kasus', color: '#6366f1' },
  { name: 'Pengumuman', color: '#f59e0b' },
])

const allCategoryOptions = computed(() => {
  const map = new Map<string, NewsCategoryOption>()
  for (const c of customCategories.value) {
    map.set(c.name.toLowerCase(), c)
  }
  for (const art of articles.value) {
    const catName = getArticleCategory(art)
    if (catName && !map.has(catName.toLowerCase())) {
      map.set(catName.toLowerCase(), {
        name: catName,
        color: art.meta?.category_color || '#01A8CF',
      })
    }
  }
  return Array.from(map.values())
})

const dropdownCategories = computed(() =>
  allCategoryOptions.value.map((c) => ({
    id: c.name,
    label: c.name,
    color: c.color || '#01A8CF',
  }))
)

function getArticleCategory(art: any): string {
  if (art?.category) return String(art.category)
  const meta = art?.meta || {}
  if (meta.category_name) return String(meta.category_name)
  if (Array.isArray(meta.category) && meta.category.length) return String(meta.category[0])
  return 'Bimtek'
}

function getArticleFormat(art: any): 'html' | 'markdown' {
  if (art?.meta?.format === 'markdown' || art?.meta?.format === 'html') {
    return art.meta.format
  }
  return art?.content?.trim()?.startsWith('<') ? 'html' : 'markdown'
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

const categoryCounts = computed(() => {
  const map: Record<string, number> = {}
  for (const art of articles.value) {
    const cat = getArticleCategory(art)
    map[cat] = (map[cat] || 0) + 1
  }
  return map
})

const filteredArticles = computed(() => {
  return articles.value.filter((art: any) => {
    const q = search.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      String(art.title || '').toLowerCase().includes(q) ||
      String(art.slug || '').toLowerCase().includes(q) ||
      String(art.summary || '').toLowerCase().includes(q)

    if (!matchesSearch) return false
    if (filterCategory.value === 'all') return true
    return getArticleCategory(art).toLowerCase() === filterCategory.value.toLowerCase()
  })
})

function openAddModal() {
  selectedArticle.value = null
  isModalOpen.value = true
}

function openEditModal(article: any) {
  selectedArticle.value = article
  isModalOpen.value = true
}

function onCategoryAdded(newCat: NewsCategoryOption) {
  if (!customCategories.value.some((c) => c.name.toLowerCase() === newCat.name.toLowerCase())) {
    customCategories.value.push(newCat)
  }
}

async function handleDelete(id: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus artikel berita ini?')) return
  try {
    await $fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menghapus artikel.')
  }
}

function formatDate(d: string | Date | undefined) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const isLoggingOut = ref(false)

async function handleLogout() {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  } finally {
    await clearSession()
    isLogoutModalOpen.value = false
    isLoggingOut.value = false
    await navigateTo('/admin/login', { replace: true })
  }
}
</script>

<template>
  <div class="h-screen overflow-hidden bg-slate-50 flex" data-lenis-prevent>
    <AdminSidebar
      :user="user"
      :is-open-mobile="isMobileSidebarOpen"
      @open-logout-modal="isLogoutModalOpen = true"
      @close-mobile="isMobileSidebarOpen = false"
    />

    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto" data-lenis-prevent>
      <header class="h-16 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            @click="isMobileSidebarOpen = true"
          >
            <span class="material-symbols-rounded">menu</span>
          </button>
          <div>
            <h1 class="text-lg font-bold text-navy-900 font-display">
              Manajemen Berita &amp; Artikel
            </h1>
            <p class="text-[11px] text-slate-500 hidden sm:block font-body">
              Mendukung format HTML &amp; Markdown, import dokumen (.html/.md/.docx), dan optimasi SEO
            </p>
          </div>
        </div>

        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          @click="openAddModal"
        >
          <span class="material-symbols-rounded text-base">add</span>
          <span>Tulis Berita Baru</span>
        </button>
      </header>

      <main class="flex-1 p-6 space-y-5">
        <!-- Search & S-Curve Category Filter Bar -->
        <div class="relative z-30 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div class="relative w-full md:w-80">
            <span class="material-symbols-rounded absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              v-model="search"
              type="search"
              placeholder="Cari berita berdasarkan judul atau slug..."
              class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>

          <CategoryFilterDropdown
            v-model="filterCategory"
            all-value="all"
            all-label="Semua"
            filter-label="Filter Kategori"
            :categories="dropdownCategories"
            :total-count="articles.length"
            :counts="categoryCounts"
          />
        </div>

        <!-- Articles Table -->
        <div class="relative z-10 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono tracking-wider">
                  <th class="py-3.5 px-4">Judul &amp; Ringkasan</th>
                  <th class="py-3.5 px-4">Slug Permalink</th>
                  <th class="py-3.5 px-4">Kategori &amp; Format</th>
                  <th class="py-3.5 px-4">Tanggal &amp; Status</th>
                  <th class="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-body">
                <tr v-for="art in filteredArticles" :key="art.id" class="hover:bg-slate-50/80 transition">
                  <td class="py-3.5 px-4 max-w-md">
                    <div class="flex items-center gap-3">
                      <img
                        v-if="art.coverImageUrl"
                        :src="art.coverImageUrl"
                        class="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div
                        v-else
                        class="w-12 h-12 rounded-xl bg-navy-900 text-cyan-400 flex items-center justify-center shrink-0"
                      >
                        <span class="material-symbols-rounded text-lg">newspaper</span>
                      </div>
                      <div class="min-w-0">
                        <NuxtLink
                          :to="`/berita/${art.slug}`"
                          target="_blank"
                          class="font-bold text-navy-900 hover:text-cyan-600 transition line-clamp-1 font-display"
                        >
                          {{ art.title }}
                        </NuxtLink>
                        <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {{ art.summary || 'Tidak ada ringkasan' }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="py-3.5 px-4">
                    <span class="font-mono text-[11px] text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
                      /berita/{{ art.slug }}
                    </span>
                  </td>

                  <td class="py-3.5 px-4">
                    <div class="flex flex-col gap-1 items-start">
                      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-navy-50 text-navy-900 border border-navy-200/60">
                        {{ getArticleCategory(art) }}
                      </span>
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider"
                        :class="
                          getArticleFormat(art) === 'html'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        "
                      >
                        {{ getArticleFormat(art) }}
                      </span>
                    </div>
                  </td>

                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <div class="flex flex-col gap-1 items-start">
                      <div class="text-slate-600 font-mono text-[11px]">
                        {{ formatDate(art.publishedAt || art.createdAt) }} · ±{{ getReadTimeMinutes(art) }} mnt
                      </div>
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                        :class="
                          art.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        "
                      >
                        {{ art.isPublished ? 'Dipublikasikan' : 'Draft' }}
                      </span>
                    </div>
                  </td>

                  <td class="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                    <NuxtLink
                      :to="`/berita/${art.slug}`"
                      target="_blank"
                      class="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 transition"
                      title="Buka Pratinjau Artikel"
                    >
                      <span class="material-symbols-rounded text-sm">open_in_new</span>
                    </NuxtLink>
                    <button
                      type="button"
                      class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-900 font-semibold transition cursor-pointer"
                      @click="openEditModal(art)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold transition cursor-pointer"
                      @click="handleDelete(art.id)"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredArticles.length === 0">
                  <td colspan="5" class="py-14 text-center text-slate-400">
                    <span class="material-symbols-rounded text-4xl text-slate-300 block mb-2">newspaper</span>
                    <p class="font-semibold text-slate-600">Belum ada artikel berita yang ditemukan.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Form Berita Cerdas (Adopsi DTP, Lebar 3/4 Admin Panel) -->
    <AdminNewsFormModal
      v-model="isModalOpen"
      :edit-post="selectedArticle"
      :category-options="allCategoryOptions"
      @saved="refresh"
      @category-added="onCategoryAdded"
    />

    <AdminLogoutModal
      :is-open="isLogoutModalOpen"
      :user-name="user?.name"
      :is-loading="isLoggingOut"
      @confirm="handleLogout"
      @confirm-logout="handleLogout"
      @close="isLogoutModalOpen = false"
    />
  </div>
</template>

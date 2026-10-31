<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import {
  type GalleryMediaType,
  detectMediaType,
  parseMediaUrl,
  resolveGalleryCardThumbnail,
  resolveGalleryEmbedUrl,
} from '~/utils/mediaParser'

definePageMeta({
  middleware: 'admin',
})

useHead({
  title: 'Kelola Galeri & Kegiatan - Admin SSD',
})

const { user, clear: clearSession } = useUserSession()
const router = useRouter()

const { data, refresh } = await useFetch('/api/admin/gallery')
const items = computed(() => data.value?.items || [])

const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const isSubmitting = ref(false)
const isLogoutModalOpen = ref(false)
const isMobileSidebarOpen = ref(false)
const previewItem = ref<any | null>(null)
const brokenThumbs = reactive<Record<string, boolean>>({})
const extractedThumbs = reactive<Record<string, string>>({})
const fetchingThumbs = reactive<Record<string, boolean>>({})
const isExtractingFormThumb = ref(false)
const autoExtractedFormThumb = ref('')
let extractTimer: ReturnType<typeof setTimeout> | null = null

// Official SVG paths from https://thesvg.org/icon/{youtube,tiktok,instagram}
const THESVG_PATHS: Record<'youtube' | 'tiktok' | 'instagram', string> = {
  youtube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok:
    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  instagram:
    'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
}

const mediaTypeOptions: Array<{
  id: GalleryMediaType
  label: string
  icon: string
  svgPath: string | null
  badgeClass: string
}> = [
  { id: 'image', label: 'Foto Dokumentasi', icon: 'image', svgPath: null, badgeClass: 'bg-cyan-500/90 text-navy-950' },
  { id: 'youtube', label: 'YouTube Video', icon: 'smart_display', svgPath: THESVG_PATHS.youtube, badgeClass: 'bg-red-600/95 text-white' },
  { id: 'tiktok', label: 'TikTok Video', icon: 'movie', svgPath: THESVG_PATHS.tiktok, badgeClass: 'bg-slate-950/95 text-cyan-300 border border-cyan-400/40' },
  { id: 'instagram', label: 'IG Reels', icon: 'video_camera_back', svgPath: THESVG_PATHS.instagram, badgeClass: 'bg-gradient-to-r from-pink-600 to-amber-500 text-white' },
]

const defaultCategories = [
  { id: 'bimtek', label: 'Bimtek & Pendampingan' },
  { id: 'pelatihan', label: 'Pelatihan Guru & Operator' },
  { id: 'hardware', label: 'Instalasi Gate & Hardware' },
  { id: 'sosialisasi', label: 'Sosialisasi Wali Siswa' },
  { id: 'kegiatan', label: 'Kegiatan Lainnya' },
]

const customCategories = ref<Array<{ id: string; label: string }>>([])
const isCreatingCategory = ref(false)
const newCategoryName = ref('')

const categoryOptions = computed(() => {
  const map = new Map<string, { id: string; label: string }>()
  for (const cat of defaultCategories) {
    map.set(cat.id.toLowerCase(), cat)
  }
  for (const cat of customCategories.value) {
    map.set(cat.id.toLowerCase(), cat)
  }
  for (const item of items.value) {
    const rawCat = String(item.category || '').trim()
    if (!rawCat) continue
    const key = rawCat.toLowerCase()
    if (!map.has(key)) {
      map.set(key, {
        id: rawCat,
        label: rawCat.charAt(0).toUpperCase() + rawCat.slice(1),
      })
    }
  }
  return Array.from(map.values())
})

function handleCreateCategory() {
  const name = newCategoryName.value.trim()
  if (!name) return
  const existing = categoryOptions.value.find(
    (c) => c.id.toLowerCase() === name.toLowerCase() || c.label.toLowerCase() === name.toLowerCase()
  )
  if (existing) {
    form.category = existing.id
  } else {
    customCategories.value.push({ id: name, label: name })
    form.category = name
  }
  newCategoryName.value = ''
  isCreatingCategory.value = false
}

const form = reactive({
  title: '',
  category: 'bimtek',
  location: '',
  mediaType: 'image' as GalleryMediaType,
  sourceUrl: '',
  thumbnailUrl: '',
  description: '',
})

const dynamicSourcePlaceholder = computed(() => {
  switch (form.mediaType) {
    case 'youtube':
      return 'https://www.youtube.com/watch?v=... atau https://youtu.be/...'
    case 'tiktok':
      return 'https://www.tiktok.com/@schoolsmartdigital/video/7700126040416406836'
    case 'instagram':
      return 'https://www.instagram.com/reel/De9N5uDp5JZ/'
    default:
      return 'https://images.unsplash.com/... atau link foto dokumentasi'
  }
})

const liveParsedMedia = computed(() => {
  return parseMediaUrl(
    form.sourceUrl,
    form.mediaType,
    form.thumbnailUrl || autoExtractedFormThumb.value
  )
})

async function triggerFormThumbnailExtraction(rawUrl: string) {
  const url = rawUrl.trim()
  if (!url) {
    autoExtractedFormThumb.value = ''
    return
  }
  const detected = detectMediaType(url, form.mediaType)
  if (detected !== 'tiktok' && detected !== 'instagram') {
    autoExtractedFormThumb.value = ''
    return
  }

  isExtractingFormThumb.value = true
  try {
    const res = await $fetch<{ thumbnailUrl?: string | null }>('/api/extract-thumbnail', {
      query: { url },
    })
    if (res?.thumbnailUrl) {
      autoExtractedFormThumb.value = res.thumbnailUrl
      if (!form.thumbnailUrl.trim()) {
        form.thumbnailUrl = res.thumbnailUrl
      }
    }
  } catch {
    // Silent fallback
  } finally {
    isExtractingFormThumb.value = false
  }
}

function onSourceUrlInput() {
  if (!form.sourceUrl.trim()) {
    autoExtractedFormThumb.value = ''
    return
  }
  const detected = detectMediaType(form.sourceUrl, form.mediaType)
  form.mediaType = detected

  if (extractTimer) clearTimeout(extractTimer)
  extractTimer = setTimeout(() => {
    triggerFormThumbnailExtraction(form.sourceUrl)
  }, 450)
}

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  isCreatingCategory.value = false
  newCategoryName.value = ''
  autoExtractedFormThumb.value = ''
  form.title = ''
  form.category = 'bimtek'
  form.location = ''
  form.mediaType = 'image'
  form.sourceUrl = ''
  form.thumbnailUrl = ''
  form.description = ''
  isModalOpen.value = true
}

function openEditModal(item: any) {
  isEditing.value = true
  editingId.value = item.id
  isCreatingCategory.value = false
  newCategoryName.value = ''
  autoExtractedFormThumb.value = extractedThumbs[item.id] || ''
  form.title = item.title || ''
  form.category = item.category || 'bimtek'
  form.location = item.location || ''
  const src = item.sourceUrl || item.source_url || item.imageUrl || ''
  form.mediaType = detectMediaType(src, item.mediaType || item.media_type)
  form.sourceUrl = src
  const rawThumb = item.thumbnailUrl || item.thumbnail_url || ''
  const isVideoLink = /tiktok\.com|instagram\.com|youtube\.com|youtu\.be/i.test(rawThumb)
  form.thumbnailUrl = (rawThumb === src || isVideoLink) ? (extractedThumbs[item.id] || '') : rawThumb
  form.description = item.description || ''
  isModalOpen.value = true

  if (!form.thumbnailUrl && (form.mediaType === 'tiktok' || form.mediaType === 'instagram')) {
    triggerFormThumbnailExtraction(src)
  }
}

function getCardMediaType(item: any): GalleryMediaType {
  return detectMediaType(item.sourceUrl || item.source_url || item.imageUrl || '', item.mediaType || item.media_type)
}

async function hydrateAdminCardThumbnail(item: any) {
  if (!import.meta.client || !item?.id) return
  if (extractedThumbs[item.id] || fetchingThumbs[item.id]) return
  const mType = getCardMediaType(item)
  if (mType !== 'tiktok' && mType !== 'instagram') return
  const srcUrl = String(item.sourceUrl || item.source_url || item.imageUrl || '').trim()
  if (!srcUrl) return

  fetchingThumbs[item.id] = true
  try {
    const res = await $fetch<{ thumbnailUrl?: string | null }>('/api/extract-thumbnail', {
      query: { url: srcUrl, id: item.id },
    })
    if (res?.thumbnailUrl) {
      extractedThumbs[item.id] = res.thumbnailUrl
      delete brokenThumbs[item.id]
    }
  } catch {
    // Keep placeholder if extraction fails
  } finally {
    fetchingThumbs[item.id] = false
  }
}

function hydrateAllAdminThumbnails() {
  if (!import.meta.client) return
  for (const item of items.value) {
    if (!resolveGalleryCardThumbnail(item)) {
      hydrateAdminCardThumbnail(item)
    }
  }
}

function getCardThumbnail(item: any): string | null {
  if (!item || brokenThumbs[item.id]) return null
  if (extractedThumbs[item.id]) return extractedThumbs[item.id]
  const resolved = resolveGalleryCardThumbnail(item)
  if (resolved) return resolved
  if (import.meta.client) {
    hydrateAdminCardThumbnail(item)
  }
  return null
}

watch(
  () => items.value,
  () => {
    hydrateAllAdminThumbnails()
  },
  { immediate: true }
)

onMounted(() => {
  hydrateAllAdminThumbnails()
})

function getPlatformBadge(mediaType: GalleryMediaType) {
  return mediaTypeOptions.find((m) => m.id === mediaType) || mediaTypeOptions[0]
}

async function handleSave() {
  if (isCreatingCategory.value && newCategoryName.value.trim()) {
    handleCreateCategory()
  }
  if (!form.title.trim() || !form.sourceUrl.trim()) return
  isSubmitting.value = true
  try {
    const payload = {
      title: form.title.trim(),
      category: form.category,
      location: form.location.trim(),
      mediaType: liveParsedMedia.value.mediaType,
      sourceUrl: form.sourceUrl.trim(),
      thumbnailUrl: form.thumbnailUrl.trim() || null,
      description: form.description.trim(),
    }

    if (isEditing.value && editingId.value) {
      await $fetch(`/api/admin/gallery/${editingId.value}`, {
        method: 'PUT',
        body: payload,
      })
    } else {
      await $fetch('/api/admin/gallery', {
        method: 'POST',
        body: payload,
      })
    }
    isModalOpen.value = false
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menyimpan dokumentasi kegiatan.')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(id: string) {
  if (!confirm('Hapus dokumentasi kegiatan ini dari galeri?')) return
  try {
    await $fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menghapus dokumentasi.')
  }
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
          <h1 class="text-lg font-bold text-navy-900 font-display">
            Manajemen Galeri &amp; Portfolio
          </h1>
        </div>

        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          @click="openAddModal"
        >
          <span class="material-symbols-rounded text-base">add_photo_alternate</span>
          <span>Tambah Dokumentasi</span>
        </button>
      </header>

      <main class="flex-1 p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in items"
            :key="item.id"
            class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <!-- Facade Thumbnail / Placeholder Card Media -->
              <div
                class="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                @click="previewItem = item"
              >
                <img
                  v-if="getCardThumbnail(item)"
                  :src="getCardThumbnail(item)!"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  @error="brokenThumbs[item.id] = true"
                />

                <!-- Dark Branded Fallback Placeholder when TikTok/IG has no thumbnail -->
                <div
                  v-else
                  class="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-navy-950 via-navy-900 to-cyan-950 text-white"
                >
                  <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-2 text-cyan-400">
                    <svg
                      v-if="getPlatformBadge(getCardMediaType(item)).svgPath"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-6 h-6"
                      aria-hidden="true"
                    >
                      <path :d="getPlatformBadge(getCardMediaType(item)).svgPath!" />
                    </svg>
                    <span v-else class="material-symbols-rounded text-2xl">
                      {{ getPlatformBadge(getCardMediaType(item)).icon }}
                    </span>
                  </div>
                  <span class="text-xs font-bold font-display tracking-wide text-cyan-300 uppercase">
                    {{ getPlatformBadge(getCardMediaType(item)).label }}
                  </span>
                  <span class="text-[11px] text-slate-300/80 mt-0.5 line-clamp-1 max-w-[220px]">
                    Klik untuk memutar video
                  </span>
                </div>

                <!-- Play Button Overlay for Video Items -->
                <div
                  v-if="getCardMediaType(item) !== 'image'"
                  class="absolute inset-0 bg-navy-950/30 group-hover:bg-navy-950/45 transition-colors flex items-center justify-center"
                >
                  <div class="w-12 h-12 rounded-full bg-white/95 text-navy-950 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-rounded text-2xl ml-0.5">play_arrow</span>
                  </div>
                </div>

                <!-- Platform Badge (Top Left) -->
                <span
                  class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                  :class="getPlatformBadge(getCardMediaType(item)).badgeClass"
                >
                  <svg
                    v-if="getPlatformBadge(getCardMediaType(item)).svgPath"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-3 h-3 shrink-0"
                    aria-hidden="true"
                  >
                    <path :d="getPlatformBadge(getCardMediaType(item)).svgPath!" />
                  </svg>
                  <span v-else class="material-symbols-rounded text-xs">
                    {{ getPlatformBadge(getCardMediaType(item)).icon }}
                  </span>
                  <span>
                    {{
                      getCardMediaType(item) === 'youtube'
                        ? 'YouTube'
                        : getCardMediaType(item) === 'tiktok'
                          ? 'TikTok'
                          : getCardMediaType(item) === 'instagram'
                            ? 'Reels'
                            : 'Foto'
                    }}
                  </span>
                </span>

                <!-- Category Badge (Top Right) -->
                <span class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-navy-900/85 text-white text-[10px] font-mono uppercase backdrop-blur-xs">
                  {{ item.category }}
                </span>
              </div>

              <div class="p-4">
                <p v-if="item.location" class="text-[11px] font-mono text-cyan-700 mb-1 flex items-center gap-1">
                  <span>📍</span>
                  <span>{{ item.location }}</span>
                </p>
                <h2 class="text-sm font-bold text-navy-900 font-display line-clamp-2 mb-1">
                  {{ item.title }}
                </h2>
                <p class="text-xs text-slate-500 font-body line-clamp-2">
                  {{ item.description }}
                </p>
              </div>
            </div>

            <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                @click="previewItem = item"
              >
                <span class="material-symbols-rounded text-sm">
                  {{ getCardMediaType(item) === 'image' ? 'visibility' : 'play_circle' }}
                </span>
                <span>{{ getCardMediaType(item) === 'image' ? 'Pratinjau' : 'Putar Video' }}</span>
              </button>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="px-3 py-1 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-navy-900 text-xs font-semibold transition cursor-pointer"
                  @click="openEditModal(item)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition cursor-pointer"
                  @click="handleDelete(item.id)"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Tambah / Edit Dokumentasi (3/4 Lebar Admin Panel) -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="isModalOpen = false"
      >
        <div class="bg-white rounded-3xl w-full lg:w-3/4 max-w-6xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
          <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-600 font-bold">
                MULTI-SOURCE MEDIA EMBED
              </span>
              <h2 class="text-lg sm:text-xl font-bold text-navy-900 font-display">
                {{ isEditing ? 'Edit Dokumentasi Kegiatan' : 'Tambah Dokumentasi Kegiatan' }}
              </h2>
            </div>
            <button
              type="button"
              class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              @click="isModalOpen = false"
            >
              <span class="material-symbols-rounded text-lg">close</span>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-body">
            <!-- Left Column: Form Inputs (7 Cols) -->
            <div class="lg:col-span-7 space-y-4">
              <div>
                <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">
                  Judul Kegiatan <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="Contoh: Bimbingan Teknis Operator Sekolah di SMA Negeri 1"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block font-mono uppercase font-semibold text-slate-700">
                      Kategori
                    </label>
                    <button
                      type="button"
                      class="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 cursor-pointer"
                      @click="isCreatingCategory = !isCreatingCategory"
                    >
                      {{ isCreatingCategory ? 'Batal' : '+ Kategori Baru' }}
                    </button>
                  </div>

                  <!-- Input Kategori Baru -->
                  <div
                    v-if="isCreatingCategory"
                    class="mb-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <input
                      v-model="newCategoryName"
                      type="text"
                      placeholder="Nama kategori baru (misal: Kunjungan Kerja)..."
                      class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      @keydown.enter.prevent="handleCreateCategory"
                    />
                    <button
                      type="button"
                      class="w-full py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-[11px] font-semibold transition cursor-pointer"
                      @click="handleCreateCategory"
                    >
                      Simpan &amp; Pilih Kategori Baru
                    </button>
                  </div>

                  <select
                    v-model="form.category"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
                  >
                    <option v-for="cat in categoryOptions" :key="cat.id" :value="cat.id">
                      {{ cat.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">
                    Lokasi
                  </label>
                  <input
                    v-model="form.location"
                    type="text"
                    placeholder="Contoh: Bandar Lampung"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <!-- Pilihan / Auto-detect Tipe Media -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block font-mono uppercase font-semibold text-slate-700">
                    Tipe Media (Otomatis Terdeteksi dari URL)
                  </label>
                  <span class="text-[11px] text-cyan-700 font-mono">
                    Aktif: {{ liveParsedMedia.platformLabel }}
                  </span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    v-for="opt in mediaTypeOptions"
                    :key="opt.id"
                    type="button"
                    class="px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    :class="
                      form.mediaType === opt.id
                        ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    "
                    @click="form.mediaType = opt.id"
                  >
                    <svg
                      v-if="opt.svgPath"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-4 h-4 shrink-0"
                      aria-hidden="true"
                    >
                      <path :d="opt.svgPath" />
                    </svg>
                    <span v-else class="material-symbols-rounded text-base">{{ opt.icon }}</span>
                    <span>{{ opt.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Input URL Sumber (Foto / Video) -->
              <div>
                <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">
                  URL Sumber (Foto / Video) <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="form.sourceUrl"
                  type="url"
                  required
                  :placeholder="dynamicSourcePlaceholder"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  @input="onSourceUrlInput"
                />
                <p class="text-[11px] text-slate-500 mt-1">
                  Mendukung URL gambar langsung, link YouTube (Watch / Shorts / Share), TikTok Video, dan Instagram Reels tanpa perlu unggah file MP4 manual.
                </p>
              </div>

              <!-- Input URL Thumbnail Cover (Opsional) -->
              <div>
                <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">
                  URL Thumbnail Cover (Opsional)
                </label>
                <input
                  v-model="form.thumbnailUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/... (Opsional)"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <p class="text-[11px] text-slate-500 mt-1">
                  Opsional: Isi link gambar cover jika preview TikTok/IG tidak muncul otomatis
                </p>
              </div>

              <div>
                <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">
                  Keterangan Singkat
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Tuliskan deskripsi singkat mengenai kegiatan dokumentasi ini..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Right Column: Live Preview Box (5 Cols) -->
            <div class="lg:col-span-5 flex flex-col justify-between bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="font-mono uppercase font-bold text-[11px] text-navy-900">
                    Pratinjau Kartu &amp; Validasi Link
                  </span>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase inline-flex items-center gap-1"
                    :class="getPlatformBadge(liveParsedMedia.mediaType).badgeClass"
                  >
                    <svg
                      v-if="getPlatformBadge(liveParsedMedia.mediaType).svgPath"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-3 h-3 shrink-0"
                      aria-hidden="true"
                    >
                      <path :d="getPlatformBadge(liveParsedMedia.mediaType).svgPath!" />
                    </svg>
                    <span>{{ liveParsedMedia.platformLabel }} ({{ liveParsedMedia.aspectRatio }})</span>
                  </span>
                </div>

                <!-- Live Card Thumbnail Simulation -->
                <div class="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
                  <img
                    v-if="liveParsedMedia.autoThumbnailUrl"
                    :src="liveParsedMedia.autoThumbnailUrl"
                    alt="Live Preview"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-navy-950 via-navy-900 to-cyan-950 text-white"
                  >
                    <svg
                      v-if="getPlatformBadge(liveParsedMedia.mediaType).svgPath"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-8 h-8 text-cyan-400 mb-1.5"
                      aria-hidden="true"
                    >
                      <path :d="getPlatformBadge(liveParsedMedia.mediaType).svgPath!" />
                    </svg>
                    <span v-else class="material-symbols-rounded text-3xl text-cyan-400 mb-1.5">
                      {{ getPlatformBadge(liveParsedMedia.mediaType).icon }}
                    </span>
                    <p class="text-xs font-bold font-display text-cyan-300">
                      {{
                        form.sourceUrl
                          ? `Siap Di-embed (${liveParsedMedia.platformLabel})`
                          : 'Masukkan URL Sumber untuk melihat pratinjau'
                      }}
                    </p>
                    <p v-if="liveParsedMedia.mediaType === 'tiktok' && !form.thumbnailUrl" class="text-[11px] text-slate-300 mt-1">
                      Thumbnail TikTok akan diambil otomatis via oEmbed saat disimpan.
                    </p>
                  </div>

                  <div
                    v-if="liveParsedMedia.mediaType !== 'image' && form.sourceUrl"
                    class="absolute inset-0 bg-navy-950/30 flex items-center justify-center pointer-events-none"
                  >
                    <div class="w-11 h-11 rounded-full bg-white/95 text-navy-950 flex items-center justify-center shadow-lg">
                      <span class="material-symbols-rounded text-xl ml-0.5">play_arrow</span>
                    </div>
                  </div>
                </div>

                <!-- Parsed Embed Diagnostics -->
                <div class="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-[11px]">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 font-mono">Tipe Terdeteksi:</span>
                    <span class="font-bold text-navy-900 uppercase font-mono">{{ liveParsedMedia.mediaType }}</span>
                  </div>
                  <div v-if="liveParsedMedia.videoId" class="flex items-center justify-between">
                    <span class="text-slate-500 font-mono">ID / Kode Video:</span>
                    <span class="font-mono text-cyan-700 font-semibold truncate max-w-[180px]">{{ liveParsedMedia.videoId }}</span>
                  </div>
                  <div v-if="liveParsedMedia.embedUrl" class="pt-1 border-t border-slate-100">
                    <span class="text-slate-400 font-mono block mb-0.5">Embed Player URL:</span>
                    <p class="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded truncate">
                      {{ liveParsedMedia.embedUrl }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  @click="isModalOpen = false"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {{ isSubmitting ? 'Menyimpan...' : 'Simpan Dokumentasi' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Interactive Video / Lightbox Player (Lazy Mounted Iframe) -->
    <Teleport to="body">
      <div
        v-if="previewItem"
        class="fixed inset-0 z-50 bg-navy-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        @click.self="previewItem = null"
      >
        <div
          class="bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/15 w-full transition-all my-auto"
          :class="
            getCardMediaType(previewItem) === 'tiktok' || getCardMediaType(previewItem) === 'instagram'
              ? 'max-w-md'
              : 'max-w-4xl'
          "
        >
          <div class="flex items-center justify-between px-5 py-3.5 bg-navy-950 text-white">
            <div class="flex items-center gap-2 min-w-0">
              <span
                class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase inline-flex items-center gap-1.5 shrink-0"
                :class="getPlatformBadge(getCardMediaType(previewItem)).badgeClass"
              >
                <svg
                  v-if="getPlatformBadge(getCardMediaType(previewItem)).svgPath"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-3 h-3 shrink-0"
                  aria-hidden="true"
                >
                  <path :d="getPlatformBadge(getCardMediaType(previewItem)).svgPath!" />
                </svg>
                <span>{{ getPlatformBadge(getCardMediaType(previewItem)).label }}</span>
              </span>
              <span class="text-xs font-display font-bold truncate">{{ previewItem.title }}</span>
            </div>
            <button
              type="button"
              class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer shrink-0"
              @click="previewItem = null"
            >
              <span class="material-symbols-rounded text-base">close</span>
            </button>
          </div>

          <!-- Lazy-Mounted Player Container -->
          <div class="bg-slate-950 flex items-center justify-center">
            <iframe
              v-if="getCardMediaType(previewItem) === 'youtube' && resolveGalleryEmbedUrl(previewItem)"
              :src="resolveGalleryEmbedUrl(previewItem)!"
              class="w-full aspect-video border-0"
              referrerpolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowfullscreen
            />
            <div
              v-else-if="
                (getCardMediaType(previewItem) === 'tiktok' || getCardMediaType(previewItem) === 'instagram') &&
                resolveGalleryEmbedUrl(previewItem)
              "
              class="max-w-sm w-full aspect-[9/16] mx-auto bg-black"
            >
              <iframe
                :src="resolveGalleryEmbedUrl(previewItem)!"
                class="w-full h-full border-0"
                referrerpolicy="strict-origin-when-cross-origin"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; web-share"
                allowfullscreen
              />
            </div>
            <img
              v-else
              :src="previewItem.sourceUrl || previewItem.imageUrl"
              :alt="previewItem.title"
              class="w-full max-h-[70vh] object-contain"
            />
          </div>

          <div class="p-5 bg-white">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 text-xs font-mono font-semibold uppercase">
                  {{ previewItem.category }}
                </span>
                <span v-if="previewItem.location" class="text-xs text-slate-500 font-mono">
                  📍 {{ previewItem.location }}
                </span>
              </div>
              <a
                v-if="previewItem.sourceUrl"
                :href="previewItem.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-mono font-semibold text-cyan-600 hover:underline flex items-center gap-1"
              >
                <span>Buka Link Asli</span>
                <span class="material-symbols-rounded text-sm">open_in_new</span>
              </a>
            </div>
            <h3 class="text-base font-bold text-navy-900 font-display mb-1">
              {{ previewItem.title }}
            </h3>
            <p v-if="previewItem.description" class="text-xs text-slate-600 font-body leading-relaxed">
              {{ previewItem.description }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>

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

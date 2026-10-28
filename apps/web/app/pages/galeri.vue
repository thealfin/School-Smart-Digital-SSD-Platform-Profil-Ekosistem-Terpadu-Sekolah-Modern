<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  type GalleryMediaType,
  detectMediaType,
  resolveGalleryCardThumbnail,
  resolveGalleryEmbedUrl,
} from '~/utils/mediaParser'

useHead({
  title: 'Galeri & Dokumentasi Bimtek - School Smart Digital',
  meta: [
    {
      name: 'description',
      content: 'Dokumentasi kegiatan bimbingan teknis, pelatihan guru, sosialisasi wali siswa, dan instalasi hardware smart turnstile gate SSD.',
    },
  ],
})

const { data } = await useFetch('/api/gallery')
const items = computed(() => data.value?.items || [])

const activeCategory = ref('all')
const activeItem = ref<any | null>(null)
const brokenThumbs = reactive<Record<string, boolean>>({})
const extractedThumbs = reactive<Record<string, string>>({})
const fetchingThumbs = reactive<Record<string, boolean>>({})

const defaultGalleryCategories = [
  { id: 'bimtek', label: 'Bimtek & Pendampingan', color: '#01A8CF' },
  { id: 'hardware', label: 'Smart Turnstile Gate', color: '#0C3161' },
  { id: 'sosialisasi', label: 'Sosialisasi Wali Siswa', color: '#10b981' },
  { id: 'pelatihan', label: 'Pelatihan Guru & Operator', color: '#6366f1' },
  { id: 'kegiatan', label: 'Kegiatan & Liputan', color: '#f59e0b' },
]

const galleryCategories = computed(() => {
  const map = new Map<string, { id: string; label: string; color: string }>()
  for (const cat of defaultGalleryCategories) {
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
        color: '#01A8CF',
      })
    }
  }
  return Array.from(map.values())
})

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const item of items.value) {
    const cat = String(item.category || 'kegiatan')
    counts[cat] = (counts[cat] || 0) + 1
  }
  return counts
})

const filteredItems = computed(() => {
  if (activeCategory.value === 'all') return items.value
  return items.value.filter(
    (i: any) => String(i.category || '').toLowerCase() === activeCategory.value.toLowerCase()
  )
})

function getItemMediaType(item: any): GalleryMediaType {
  return detectMediaType(
    item?.sourceUrl || item?.source_url || item?.imageUrl || '',
    item?.mediaType || item?.media_type
  )
}

async function hydrateItemThumbnail(item: any) {
  if (!import.meta.client || !item?.id) return
  if (extractedThumbs[item.id] || fetchingThumbs[item.id]) return
  const mType = getItemMediaType(item)
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
    // Keep elegant fallback placeholder if extraction fails
  } finally {
    fetchingThumbs[item.id] = false
  }
}

function hydrateAllMissingThumbnails() {
  if (!import.meta.client) return
  for (const item of items.value) {
    if (!resolveGalleryCardThumbnail(item)) {
      hydrateItemThumbnail(item)
    }
  }
}

function getItemThumbnail(item: any): string | null {
  if (!item || brokenThumbs[item.id]) return null
  if (extractedThumbs[item.id]) return extractedThumbs[item.id]
  const resolved = resolveGalleryCardThumbnail(item)
  if (resolved) return resolved
  if (import.meta.client) {
    hydrateItemThumbnail(item)
  }
  return null
}

// Official SVG paths from https://thesvg.org/icon/{youtube,tiktok,instagram}
const THESVG_PATHS: Record<'youtube' | 'tiktok' | 'instagram', string> = {
  youtube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok:
    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  instagram:
    'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
}

function getPlatformMeta(mediaType: GalleryMediaType) {
  switch (mediaType) {
    case 'youtube':
      return {
        label: 'YouTube',
        icon: 'smart_display',
        svgPath: THESVG_PATHS.youtube,
        badgeClass: 'bg-red-600/95 text-white',
      }
    case 'tiktok':
      return {
        label: 'TikTok',
        icon: 'movie',
        svgPath: THESVG_PATHS.tiktok,
        badgeClass: 'bg-slate-950/90 text-cyan-300 border border-cyan-400/40',
      }
    case 'instagram':
      return {
        label: 'Reels',
        icon: 'video_camera_back',
        svgPath: THESVG_PATHS.instagram,
        badgeClass: 'bg-gradient-to-r from-pink-600 to-amber-500 text-white',
      }
    default:
      return {
        label: 'Foto',
        icon: 'image',
        svgPath: null,
        badgeClass: 'bg-cyan-500/90 text-navy-950',
      }
  }
}

const activeEmbedUrl = computed(() => {
  if (!activeItem.value) return null
  return resolveGalleryEmbedUrl(activeItem.value)
})

const activeMediaType = computed<GalleryMediaType>(() => {
  if (!activeItem.value) return 'image'
  return getItemMediaType(activeItem.value)
})

function openPreview(item: any) {
  activeItem.value = item
  if (import.meta.client) {
    document.body.classList.add('has-video-modal-open')
  }
}

function closePreview() {
  activeItem.value = null
  if (import.meta.client) {
    document.body.classList.remove('has-video-modal-open')
  }
}

watch(
  () => items.value,
  () => {
    hydrateAllMissingThumbnails()
  },
  { immediate: true }
)

onMounted(() => {
  hydrateAllMissingThumbnails()
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.classList.remove('has-video-modal-open')
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <SiteHeader mode="subpage" />

    <main class="pt-28 pb-20">
      <!-- Section Header -->
      <section class="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 reveal">
        <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 text-cyan-800 mb-4">
          DOKUMENTASI &amp; KEGIATAN LAPANGAN
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4 font-display">
          Galeri Implementasi <br class="hidden sm:inline" />
          <span class="text-cyan-600">School Smart Digital</span>
        </h1>
        <p class="max-w-2xl mx-auto text-base text-slate-600 font-body">
          Bukti nyata pendampingan tim PT Digital Teknologi Perkasa di lapangan: mulai dari pelatihan operator, sosialisasi wali siswa, hingga instalasi gerbang turnstile otomatis.
        </p>

        <!-- S-Curve Category Filter Dropdown -->
        <div class="relative z-30 mt-8 flex justify-center">
          <CategoryFilterDropdown
            v-model="activeCategory"
            all-value="all"
            all-label="Semua Dokumentasi"
            filter-label="Filter Kategori"
            :categories="galleryCategories"
            :total-count="items.length"
            :counts="categoryCounts"
          />
        </div>
      </section>

      <!-- Gallery Grid (Facade Pattern: No Iframes in Cards) -->
      <section class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(item, idx) in filteredItems"
            :key="item.id"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all cursor-pointer group reveal flex flex-col justify-between"
            :class="`reveal-delay-${(idx % 3) + 1}`"
            @click="openPreview(item)"
          >
            <div>
              <div class="relative aspect-video overflow-hidden bg-slate-900">
                <!-- Priority 1-3: Thumbnail Image -->
                <img
                  v-if="getItemThumbnail(item)"
                  :src="getItemThumbnail(item)!"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  @error="brokenThumbs[item.id] = true"
                />

                <!-- Priority 4: Elegant Dark Platform Placeholder for TikTok / IG Reels -->
                <div
                  v-else
                  class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-navy-950 via-navy-900 to-cyan-950 text-white"
                >
                  <div class="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-2.5 text-cyan-400">
                    <svg
                      v-if="getPlatformMeta(getItemMediaType(item)).svgPath"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-7 h-7"
                      aria-hidden="true"
                    >
                      <path :d="getPlatformMeta(getItemMediaType(item)).svgPath!" />
                    </svg>
                    <span v-else class="material-symbols-rounded text-3xl">
                      {{ getPlatformMeta(getItemMediaType(item)).icon }}
                    </span>
                  </div>
                  <span class="text-xs font-bold font-display tracking-wider uppercase text-cyan-300">
                    Video {{ getPlatformMeta(getItemMediaType(item)).label }}
                  </span>
                  <span class="text-[11px] text-slate-300/80 mt-0.5">
                    Klik untuk memutar dokumentasi video
                  </span>
                </div>

                <!-- Play Button Overlay on Video Cards -->
                <div
                  v-if="getItemMediaType(item) !== 'image'"
                  class="absolute inset-0 bg-navy-950/25 group-hover:bg-navy-950/45 transition-colors flex items-center justify-center"
                >
                  <div class="w-14 h-14 rounded-full bg-white/95 text-navy-950 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ring-4 ring-white/30">
                    <span class="material-symbols-rounded text-3xl ml-0.5">play_arrow</span>
                  </div>
                </div>

                <!-- Platform Badge (Top Left) -->
                <span
                  v-if="getItemMediaType(item) !== 'image'"
                  class="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5 backdrop-blur-xs"
                  :class="getPlatformMeta(getItemMediaType(item)).badgeClass"
                >
                  <svg
                    v-if="getPlatformMeta(getItemMediaType(item)).svgPath"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-3.5 h-3.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path :d="getPlatformMeta(getItemMediaType(item)).svgPath!" />
                  </svg>
                  <span v-else class="material-symbols-rounded text-sm">
                    {{ getPlatformMeta(getItemMediaType(item)).icon }}
                  </span>
                  <span>{{ getPlatformMeta(getItemMediaType(item)).label }}</span>
                </span>

                <!-- Category Badge (Top Right) -->
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-navy-900/85 text-white backdrop-blur-sm uppercase">
                  {{ item.category }}
                </span>
              </div>

              <div class="p-5">
                <div v-if="item.location" class="flex items-center gap-1.5 text-xs text-cyan-700 font-mono mb-1.5">
                  <span class="material-symbols-rounded text-sm">location_on</span>
                  <span>{{ item.location }}</span>
                </div>
                <h3 class="text-base font-bold text-navy-900 group-hover:text-cyan-600 transition-colors font-display line-clamp-2 mb-2">
                  {{ item.title }}
                </h3>
                <p v-if="item.description" class="text-xs text-slate-500 font-body line-clamp-2">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Lightbox / Video Player Modal (Lazy Mount Iframe Only When Open) -->
      <Teleport to="body">
        <div
          v-if="activeItem"
          data-lenis-prevent
          class="fixed inset-0 z-50 bg-navy-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          @click.self="closePreview"
        >
          <div
            class="bg-white rounded-3xl w-full overflow-hidden shadow-2xl animate-fade-in my-auto border border-white/10"
            :class="
              activeMediaType === 'tiktok' || activeMediaType === 'instagram'
                ? 'max-w-lg'
                : 'max-w-4xl'
            "
          >
            <!-- Modal Top Bar -->
            <div class="flex items-center justify-between px-5 py-3.5 bg-navy-950 text-white">
              <div class="flex items-center gap-2 min-w-0">
                <span
                  class="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0"
                  :class="getPlatformMeta(activeMediaType).badgeClass"
                >
                  <svg
                    v-if="getPlatformMeta(activeMediaType).svgPath"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-3.5 h-3.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path :d="getPlatformMeta(activeMediaType).svgPath!" />
                  </svg>
                  <span>{{ getPlatformMeta(activeMediaType).label }}</span>
                </span>
                <span class="text-xs sm:text-sm font-bold font-display truncate">
                  {{ activeItem.title }}
                </span>
              </div>
              <button
                type="button"
                class="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer shrink-0"
                aria-label="Tutup pemutar media"
                @click="closePreview"
              >
                <span class="material-symbols-rounded text-lg">close</span>
              </button>
            </div>

            <!-- Media Player Viewport -->
            <div class="relative bg-slate-950 flex items-center justify-center">
              <!-- YouTube 16:9 Embed -->
              <iframe
                v-if="activeMediaType === 'youtube' && activeEmbedUrl"
                :src="activeEmbedUrl"
                class="w-full aspect-video border-0"
                referrerpolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowfullscreen
              />

              <!-- TikTok / Instagram Reels Vertical 9:16 Embed -->
              <div
                v-else-if="(activeMediaType === 'tiktok' || activeMediaType === 'instagram') && activeEmbedUrl"
                class="max-w-sm w-full aspect-[9/16] mx-auto bg-black"
              >
                <iframe
                  :src="activeEmbedUrl"
                  class="w-full h-full border-0"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; web-share"
                  allowfullscreen
                />
              </div>

              <!-- Image Full-Res Preview -->
              <div v-else class="w-full aspect-video bg-slate-900 flex items-center justify-center">
                <img
                  :src="activeItem.sourceUrl || activeItem.imageUrl"
                  :alt="activeItem.title"
                  class="w-full h-full object-contain"
                />
              </div>
            </div>

            <!-- Metadata Footer -->
            <div class="p-6 bg-white">
              <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-md bg-cyan-100 text-cyan-800 text-xs font-mono font-semibold uppercase">
                    {{ activeItem.category }}
                  </span>
                  <span class="material-symbols-rounded text-sm text-cyan-700">location_on</span>
                  <span v-if="activeItem.location" class="text-xs text-slate-500 font-mono">
                     {{ activeItem.location }}
                  </span>
                </div>

                <a
                  v-if="activeItem.sourceUrl && activeMediaType !== 'image'"
                  :href="activeItem.sourceUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs font-mono font-semibold text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                  <span>Buka di {{ getPlatformMeta(activeMediaType).label }}</span>
                  <span class="material-symbols-rounded text-sm">open_in_new</span>
                </a>
              </div>
              <h2 class="text-lg sm:text-xl font-bold text-navy-900 font-display mb-2">
                {{ activeItem.title }}
              </h2>
              <p class="text-sm text-slate-600 font-body leading-relaxed">
                {{ activeItem.description }}
              </p>
            </div>
          </div>
        </div>
      </Teleport>
    </main>

    <SiteFooter />
  </div>
</template>

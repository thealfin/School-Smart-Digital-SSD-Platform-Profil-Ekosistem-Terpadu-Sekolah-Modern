<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  type GalleryMediaType,
  detectMediaType,
  resolveGalleryCardThumbnail,
  resolveGalleryEmbedUrl,
} from '~/utils/mediaParser'

const { data } = await useFetch('/api/gallery')
const allItems = computed(() => data.value?.items || [])

// Display the 3 latest or featured media items
const recentMedia = computed(() => {
  return allItems.value.slice(0, 3)
})

const activeItem = ref<any | null>(null)
const brokenThumbs = reactive<Record<string, boolean>>({})
const extractedThumbs = reactive<Record<string, string>>({})
const fetchingThumbs = reactive<Record<string, boolean>>({})

// Official SVG paths from https://thesvg.org/icon/{youtube,tiktok,instagram}
const THESVG_PATHS: Record<'youtube' | 'tiktok' | 'instagram', string> = {
  youtube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok:
    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  instagram:
    'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
}

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
    // Keep fallback placeholder
  } finally {
    fetchingThumbs[item.id] = false
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

function openModal(item: any) {
  activeItem.value = item
  if (typeof document !== 'undefined') {
    document.body.classList.add('has-video-modal-open')
  }
}

function closeModal() {
  activeItem.value = null
  if (typeof document !== 'undefined') {
    document.body.classList.remove('has-video-modal-open')
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && activeItem.value) {
    closeModal()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  if (typeof document !== 'undefined') {
    document.body.classList.remove('has-video-modal-open')
  }
})
</script>

<template>
  <section
    id="galeri-ringkasan"
    class="py-20 md:py-24 bg-slate-50 relative border-t border-slate-200/80 overflow-hidden"
    aria-labelledby="home-gallery-heading"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-14 reveal">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-mono font-semibold mb-3 border border-cyan-200">
          <span class="material-symbols-rounded text-sm">photo_library</span>
          <span>DOKUMENTASI KEGIATAN</span>
        </div>
        <h2
          id="home-gallery-heading"
          class="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-navy-950 tracking-tight leading-tight"
        >
          Galeri Implementasi Sekolah Modern
        </h2>
        <p class="mt-4 text-base sm:text-lg text-slate-600 font-body leading-relaxed">
          Dokumentasi pelatihan operator, sosialisasi wali murid, dan pemasangan gerbang smart turnstile di berbagai sekolah mitra.
        </p>
      </div>

      <!-- 3 Gallery Highlight Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div
          v-for="(item, idx) in recentMedia"
          :key="item.id || idx"
          class="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 cursor-pointer reveal"
          :class="`reveal-delay-${(idx % 3) + 1}`"
          @click="openModal(item)"
        >
          <div>
            <!-- Media Visual Box with Thumbnail -->
            <div class="relative aspect-video w-full overflow-hidden bg-slate-900">
              <img
                v-if="getItemThumbnail(item)"
                :src="getItemThumbnail(item)!"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                @error="brokenThumbs[item.id] = true"
              />
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white"
              >
                <div class="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
                  <span class="material-symbols-rounded text-2xl">
                    {{ getItemMediaType(item) === 'image' ? 'photo_camera' : 'smart_display' }}
                  </span>
                </div>
                <span class="text-xs font-mono text-cyan-300">{{ item.location || 'Dokumentasi SSD' }}</span>
              </div>

              <!-- Media Platform Badge -->
              <div class="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                <!-- TikTok Badge -->
                <span
                  v-if="getItemMediaType(item) === 'tiktok'"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-950/90 text-cyan-300 border border-cyan-400/30 backdrop-blur-xs shadow-xs"
                >
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path :d="THESVG_PATHS.tiktok" />
                  </svg>
                  <span>TIKTOK</span>
                </span>

                <!-- Instagram Reels Badge -->
                <span
                  v-else-if="getItemMediaType(item) === 'instagram'"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-gradient-to-r from-pink-600 to-amber-500 text-white backdrop-blur-xs shadow-xs"
                >
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path :d="THESVG_PATHS.instagram" />
                  </svg>
                  <span>REELS</span>
                </span>

                <!-- YouTube Badge -->
                <span
                  v-else-if="getItemMediaType(item) === 'youtube'"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-red-600 text-white backdrop-blur-xs shadow-xs"
                >
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path :d="THESVG_PATHS.youtube" />
                  </svg>
                  <span>YOUTUBE</span>
                </span>

                <!-- Photo Badge -->
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-navy-900/85 text-white backdrop-blur-xs shadow-xs"
                >
                  <span class="material-symbols-rounded text-xs">photo_camera</span>
                  <span>FOTO</span>
                </span>
              </div>

              <!-- Category Badge -->
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-navy-950/80 text-white backdrop-blur-xs z-10">
                {{ item.category || 'Kegiatan' }}
              </span>

              <!-- Hover Play Button Overlay for Videos -->
              <div
                v-if="getItemMediaType(item) !== 'image'"
                class="absolute inset-0 bg-navy-950/30 group-hover:bg-navy-950/50 flex items-center justify-center transition-colors duration-300"
              >
                <div class="w-13 h-13 rounded-full bg-white/90 group-hover:bg-cyan-500 text-navy-900 group-hover:text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <span class="material-symbols-rounded text-2xl ml-0.5">play_arrow</span>
                </div>
              </div>
            </div>

            <!-- Card Copy -->
            <div class="p-6">
              <h3 class="font-display font-bold text-base text-navy-950 group-hover:text-cyan-700 transition-colors line-clamp-2 mb-2">
                {{ item.title }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 font-body line-clamp-2 leading-relaxed">
                {{ item.description || 'Dokumentasi resmi implementasi ekosistem School Smart Digital di institusi sekolah mitra.' }}
              </p>
            </div>
          </div>

          <!-- Bottom Meta Bar -->
          <div class="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span class="flex items-center gap-1 truncate max-w-[170px]">
              <span class="material-symbols-rounded text-sm text-cyan-600">location_on</span>
              <span>{{ item.location || 'Indonesia' }}</span>
            </span>
            <span class="text-cyan-600 font-semibold group-hover:underline">
              {{ getItemMediaType(item) === 'image' ? 'Lihat Foto →' : 'Putar Video →' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Button leading to /galeri -->
      <div class="text-center reveal">
        <NuxtLink
          to="/galeri"
          class="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
        >
          <span>Buka Galeri &amp; Dokumentasi Lengkap ({{ allItems.length || '9+' }})</span>
          <span class="material-symbols-rounded text-base">arrow_forward</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Interactive Lightbox Video / Photo Modal -->
    <Teleport to="body">
      <div
        v-if="activeItem"
        class="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 backdrop-blur-md p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        @click.self="closeModal"
      >
        <div class="relative w-full max-w-4xl bg-navy-900 rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl flex flex-col max-h-[90vh]">
          <!-- Modal Top Bar -->
          <div class="px-5 py-3.5 bg-navy-950/90 border-b border-white/10 flex items-center justify-between gap-3 text-white">
            <div class="flex items-center gap-2 truncate">
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                {{ getItemMediaType(activeItem).toUpperCase() }}
              </span>
              <span class="text-sm font-bold truncate">{{ activeItem.title }}</span>
            </div>
            <button
              type="button"
              class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
              title="Tutup (Esc)"
              @click="closeModal"
            >
              <span class="material-symbols-rounded text-lg">close</span>
            </button>
          </div>

          <!-- Modal Body Embed -->
          <div class="flex-1 bg-black flex items-center justify-center overflow-hidden">
            <!-- Video Iframe -->
            <iframe
              v-if="getItemMediaType(activeItem) !== 'image'"
              :src="resolveGalleryEmbedUrl(activeItem.sourceUrl || activeItem.source_url || activeItem.imageUrl || '', getItemMediaType(activeItem))"
              class="w-full aspect-video min-h-[340px] sm:min-h-[460px] border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>

            <!-- Photo Fullscreen -->
            <img
              v-else
              :src="activeItem.imageUrl || activeItem.sourceUrl || activeItem.source_url"
              :alt="activeItem.title"
              class="max-h-[75vh] w-auto object-contain"
            />
          </div>

          <!-- Modal Footer Details -->
          <div class="p-4 sm:p-5 bg-navy-950/90 border-t border-white/10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs text-slate-300 font-body">{{ activeItem.description }}</p>
              <p class="text-[11px] font-mono text-cyan-400 mt-0.5">Lokasi: {{ activeItem.location || 'Indonesia' }}</p>
            </div>
            <a
              v-if="activeItem.sourceUrl || activeItem.source_url"
              :href="activeItem.sourceUrl || activeItem.source_url"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs shrink-0 transition"
            >
              Buka Sumber Asli ↗
            </a>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Galeri & Dokumentasi Bimtek — School Smart Digital',
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

const filteredItems = computed(() => {
  if (activeCategory.value === 'all') return items.value
  return items.value.filter((i: any) => i.category === activeCategory.value)
})

function openPreview(item: any) {
  activeItem.value = item
}

function closePreview() {
  activeItem.value = null
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <SiteHeader mode="subpage" />

    <main class="pt-28 pb-20">
      <!-- Section Header -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 reveal">
        <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 text-cyan-800 mb-4">
          DOKUMENTASI & KEGIATAN LAPANGAN
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4 font-display">
          Galeri Implementasi <br class="hidden sm:inline" />
          <span class="text-cyan-600">School Smart Digital</span>
        </h1>
        <p class="max-w-2xl mx-auto text-base text-slate-600 font-body">
          Bukti nyata pendampingan tim PT Digital Teknologi Perkasa di lapangan: mulai dari pelatihan operator, sosialisasi wali santri/siswa, hingga instalasi gerbang turnstile otomatis.
        </p>

        <!-- Categories -->
        <div class="mt-8 flex flex-wrap justify-center gap-2">
          <button
            v-for="cat in [
              { id: 'all', label: 'Semua Dokumentasi' },
              { id: 'bimtek', label: 'Bimtek & Pendampingan' },
              { id: 'hardware', label: 'Smart Turnstile Gate' },
              { id: 'sosialisasi', label: 'Sosialisasi Wali Siswa' },
              { id: 'pelatihan', label: 'Pelatihan Guru & Operator' },
            ]"
            :key="cat.id"
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="activeCategory === cat.id
              ? 'bg-navy-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'"
            @click="activeCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>
      </section>

      <!-- Gallery Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(item, idx) in filteredItems"
            :key="item.id"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all cursor-pointer group reveal"
            :class="`reveal-delay-${(idx % 3) + 1}`"
            @click="openPreview(item)"
          >
            <div class="relative aspect-video overflow-hidden bg-slate-100">
              <img
                :src="item.imageUrl"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-navy-900/80 text-white backdrop-blur-sm">
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
      </section>

      <!-- Lightbox Modal Preview -->
      <Teleport to="body">
        <div
          v-if="activeItem"
          class="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4"
          @click.self="closePreview"
        >
          <div class="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-fade-in">
            <div class="relative aspect-video bg-slate-900">
              <img
                :src="activeItem.imageUrl"
                :alt="activeItem.title"
                class="w-full h-full object-contain"
              />
              <button
                type="button"
                class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                @click="closePreview"
              >
                <span class="material-symbols-rounded text-lg">close</span>
              </button>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2.5 py-1 rounded-md bg-cyan-100 text-cyan-800 text-xs font-mono font-medium">
                  {{ activeItem.category }}
                </span>
                <span v-if="activeItem.location" class="text-xs text-slate-500 font-mono">
                  📍 {{ activeItem.location }}
                </span>
              </div>
              <h2 class="text-xl font-bold text-navy-900 font-display mb-2">
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


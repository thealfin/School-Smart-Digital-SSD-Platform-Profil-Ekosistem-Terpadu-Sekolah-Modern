<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({
  middleware: 'admin',
})

useHead({
  title: 'Kelola Galeri & Portfolio — Admin SSD',
})

const { user, clear: clearSession } = useUserSession()
const router = useRouter()

const { data, refresh } = await useFetch('/api/admin/gallery')
const items = computed(() => data.value?.items || [])

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isLogoutModalOpen = ref(false)
const isMobileSidebarOpen = ref(false)

const form = reactive({
  title: '',
  category: 'bimtek',
  imageUrl: '',
  description: '',
  location: '',
  orderIndex: 0,
})

function openAddModal() {
  form.title = ''
  form.category = 'bimtek'
  form.imageUrl = ''
  form.description = ''
  form.location = ''
  form.orderIndex = items.value.length
  isModalOpen.value = true
}

async function handleSave() {
  if (!form.title || !form.imageUrl) return
  isSubmitting.value = true
  try {
    await $fetch('/api/admin/gallery', {
      method: 'POST',
      body: form,
    })
    isModalOpen.value = false
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menyimpan foto kegiatan.')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(id: string) {
  if (!confirm('Hapus dokumentasi ini dari galeri?')) return
  try {
    await $fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menghapus.')
  }
}

async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  await clearSession()
  router.replace('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <AdminSidebar
      :user="user"
      :is-open-mobile="isMobileSidebarOpen"
      @open-logout-modal="isLogoutModalOpen = true"
      @close-mobile="isMobileSidebarOpen = false"
    />

    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            @click="isMobileSidebarOpen = true"
          >
            <span class="material-symbols-rounded">menu</span>
          </button>
          <h1 class="text-lg font-bold text-navy-900 font-display">
            Manajemen Galeri & Portfolio
          </h1>
        </div>

        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
          @click="openAddModal"
        >
          <span class="material-symbols-rounded text-base">add_a_photo</span>
          <span>Tambah Foto Dokumentasi</span>
        </button>
      </header>

      <main class="flex-1 p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in items"
            :key="item.id"
            class="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div class="relative aspect-video bg-slate-100">
                <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover" />
                <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-navy-900/80 text-white backdrop-blur-xs">
                  {{ item.category }}
                </span>
              </div>
              <div class="p-4">
                <p v-if="item.location" class="text-[11px] text-cyan-700 font-mono mb-1">
                  📍 {{ item.location }}
                </p>
                <h3 class="font-bold text-navy-900 text-xs font-display mb-1">{{ item.title }}</h3>
                <p class="text-[11px] text-slate-500 font-body line-clamp-2">{{ item.description }}</p>
              </div>
            </div>

            <div class="p-4 pt-0 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                class="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded font-semibold transition"
                @click="handleDelete(item.id)"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Tambah Galeri -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="isModalOpen = false"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
          <h2 class="text-lg font-bold text-navy-900 font-display mb-4">
            Tambah Dokumentasi Kegiatan
          </h2>

          <form @submit.prevent="handleSave" class="space-y-4 text-xs font-body">
            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Judul Kegiatan *</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Contoh: Bimtek Operator SSD di Lampung"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Kategori</label>
                <select v-model="form.category" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
                  <option value="bimtek">Bimtek & Pendampingan</option>
                  <option value="hardware">Smart Turnstile Gate</option>
                  <option value="sosialisasi">Sosialisasi</option>
                  <option value="pelatihan">Pelatihan Guru</option>
                  <option value="kegiatan">Kegiatan Umum</option>
                </select>
              </div>

              <div>
                <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Lokasi</label>
                <input
                  v-model="form.location"
                  type="text"
                  placeholder="Bandar Lampung"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">URL Gambar *</label>
              <input
                v-model="form.imageUrl"
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Keterangan Singkat</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                @click="isModalOpen = false"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold disabled:opacity-50"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Foto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AdminLogoutModal
      :is-open="isLogoutModalOpen"
      @confirm="handleLogout"
      @close="isLogoutModalOpen = false"
    />
  </div>
</template>


<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({
  middleware: 'admin',
})

useHead({
  title: 'Kelola Berita & Artikel — Admin SSD',
})

const { user, clear: clearSession } = useUserSession()
const router = useRouter()

const { data, refresh } = await useFetch('/api/admin/news')
const articles = computed(() => data.value?.articles || [])

const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const isSubmitting = ref(false)
const isLogoutModalOpen = ref(false)
const isMobileSidebarOpen = ref(false)

const form = reactive({
  title: '',
  category: 'Bimtek',
  summary: '',
  content: '',
  coverImageUrl: '',
  isPublished: true,
})

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.title = ''
  form.category = 'Bimtek'
  form.summary = ''
  form.content = ''
  form.coverImageUrl = ''
  form.isPublished = true
  isModalOpen.value = true
}

function openEditModal(article: any) {
  isEditing.value = true
  editingId.value = article.id
  form.title = article.title
  form.category = article.category
  form.summary = article.summary || ''
  form.content = article.content || ''
  form.coverImageUrl = article.coverImageUrl || ''
  form.isPublished = Boolean(article.isPublished)
  isModalOpen.value = true
}

async function handleSave() {
  if (!form.title) return
  isSubmitting.value = true
  try {
    if (isEditing.value && editingId.value) {
      await $fetch(`/api/admin/news/${editingId.value}`, {
        method: 'PUT',
        body: form,
      })
    } else {
      await $fetch('/api/admin/news', {
        method: 'POST',
        body: form,
      })
    }
    isModalOpen.value = false
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menyimpan artikel.')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(id: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return
  try {
    await $fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menghapus artikel.')
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
            Manajemen Berita & Artikel
          </h1>
        </div>

        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
          @click="openAddModal"
        >
          <span class="material-symbols-rounded text-base">add</span>
          <span>Tambah Berita Baru</span>
        </button>
      </header>

      <main class="flex-1 p-6">
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono tracking-wider">
                  <th class="py-3 px-4">Artikel</th>
                  <th class="py-3 px-4">Kategori</th>
                  <th class="py-3 px-4">Penulis</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-body">
                <tr v-for="art in articles" :key="art.id" class="hover:bg-slate-50/80 transition">
                  <td class="py-3.5 px-4 max-w-sm">
                    <div class="flex items-center gap-3">
                      <img
                        v-if="art.coverImageUrl"
                        :src="art.coverImageUrl"
                        class="w-12 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                      />
                      <div class="min-w-0">
                        <p class="font-bold text-navy-900 truncate">{{ art.title }}</p>
                        <p class="text-[11px] text-slate-400 font-mono">/berita/{{ art.slug }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-medium text-cyan-800">
                    {{ art.category }}
                  </td>
                  <td class="py-3.5 px-4 text-slate-600">
                    {{ art.author }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                      :class="art.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                    >
                      {{ art.isPublished ? 'Dipublikasikan' : 'Draft' }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-navy-900 font-medium transition"
                      @click="openEditModal(art)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium transition"
                      @click="handleDelete(art.id)"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Tambah/Edit Berita -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="isModalOpen = false"
      >
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
          <h2 class="text-lg font-bold text-navy-900 font-display mb-4">
            {{ isEditing ? 'Edit Artikel' : 'Tambah Artikel Baru' }}
          </h2>

          <form @submit.prevent="handleSave" class="space-y-4 text-xs font-body">
            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Judul Artikel *</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Kategori</label>
                <select
                  v-model="form.category"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="Bimtek">Bimtek</option>
                  <option value="Teknologi">Teknologi</option>
                  <option value="Manajemen">Manajemen</option>
                  <option value="Studi Kasus">Studi Kasus</option>
                  <option value="Pengumuman">Pengumuman</option>
                </select>
              </div>

              <div>
                <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Status Publikasi</label>
                <select
                  v-model="form.isPublished"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                >
                  <option :value="true">Publikasikan Langsung</option>
                  <option :value="false">Simpan sebagai Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">URL Gambar Sampul</label>
              <input
                v-model="form.coverImageUrl"
                type="url"
                placeholder="https://..."
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Ringkasan Singkat</label>
              <textarea
                v-model="form.summary"
                rows="2"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Konten Lengkap (HTML didukung)</label>
              <textarea
                v-model="form.content"
                rows="6"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
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
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Artikel' }}
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


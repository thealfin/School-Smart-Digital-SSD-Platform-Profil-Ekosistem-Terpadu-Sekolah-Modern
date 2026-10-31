<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({
  middleware: 'admin',
})

useHead({
  title: 'Kelola 12 Modul Aplikasi - Admin SSD',
})

const { user, clear: clearSession } = useUserSession()
const router = useRouter()

const { data, refresh } = await useFetch('/api/admin/services')
const apps = computed(() => data.value?.apps || [])

const isModalOpen = ref(false)
const selectedApp = ref<any | null>(null)
const isSubmitting = ref(false)
const isLogoutModalOpen = ref(false)
const isMobileSidebarOpen = ref(false)

const form = reactive({
  name: '',
  tagline: '',
  description: '',
  status: 'available',
  isPublished: true,
})

function openEditModal(app: any) {
  selectedApp.value = app
  form.name = app.name
  form.tagline = app.tagline
  form.description = app.description || ''
  form.status = app.status
  form.isPublished = Boolean(app.isPublished)
  isModalOpen.value = true
}

async function handleSave() {
  if (!selectedApp.value) return
  isSubmitting.value = true
  try {
    await $fetch(`/api/admin/services/${selectedApp.value.id}`, {
      method: 'PATCH',
      body: form,
    })
    isModalOpen.value = false
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menyimpan modul.')
  } finally {
    isSubmitting.value = false
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
            Manajemen 12 Aplikasi Ekosistem SSD
          </h1>
        </div>
      </header>

      <main class="flex-1 p-6">
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono tracking-wider">
                <th class="py-3 px-4">No</th>
                <th class="py-3 px-4">Nama Aplikasi</th>
                <th class="py-3 px-4">Sasaran / Role</th>
                <th class="py-3 px-4">Platform</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-body">
              <tr v-for="app in apps" :key="app.id" class="hover:bg-slate-50/80 transition">
                <td class="py-3 px-4 font-mono font-bold text-slate-400">
                  {{ String(app.number).padStart(2, '0') }}
                </td>
                <td class="py-3 px-4">
                  <p class="font-bold text-navy-900">{{ app.name }}</p>
                  <p class="text-[11px] text-slate-500 font-body">{{ app.tagline }}</p>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                    {{ app.audience }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-600 font-mono text-[11px]">
                  {{ app.platformLabel }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                    :class="app.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                  >
                    {{ app.status }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-navy-900 font-medium transition"
                    @click="openEditModal(app)"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- Edit App Modal (3/4 Lebar Admin Panel) -->
    <Teleport to="body">
      <div
        v-if="isModalOpen && selectedApp"
        class="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="isModalOpen = false"
      >
        <div class="bg-white rounded-3xl w-full lg:w-3/4 max-w-6xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <h2 class="text-lg font-bold text-navy-900 font-display mb-4">
            Edit Aplikasi: {{ selectedApp.name }}
          </h2>

          <form @submit.prevent="handleSave" class="space-y-4 text-xs font-body">
            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Nama Aplikasi</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                v-model="form.tagline"
                type="text"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Status Ketersediaan</label>
                <select v-model="form.status" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
                  <option value="available">Tersedia (Available)</option>
                  <option value="development">Pengembangan (Development)</option>
                  <option value="partial">Parsial (Partial)</option>
                </select>
              </div>

              <div>
                <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Publikasi Landing</label>
                <select v-model="form.isPublished" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
                  <option :value="true">Tampilkan</option>
                  <option :value="false">Sembunyikan</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Deskripsi Ringkas</label>
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
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </form>
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


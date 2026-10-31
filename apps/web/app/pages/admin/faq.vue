<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({
  middleware: 'admin',
})

useHead({
  title: 'Kelola FAQ - Admin SSD',
})

const { user, clear: clearSession } = useUserSession()
const router = useRouter()

const { data, refresh } = await useFetch('/api/admin/faq')
const faqs = computed(() => data.value?.faqs || [])

const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const isSubmitting = ref(false)
const isLogoutModalOpen = ref(false)
const isMobileSidebarOpen = ref(false)

const form = reactive({
  question: '',
  answer: '',
  category: 'umum',
  orderIndex: 0,
})

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.question = ''
  form.answer = ''
  form.category = 'umum'
  form.orderIndex = faqs.value.length
  isModalOpen.value = true
}

function openEditModal(faq: any) {
  isEditing.value = true
  editingId.value = faq.id
  form.question = faq.question
  form.answer = faq.answer
  form.category = faq.category || 'umum'
  form.orderIndex = faq.orderIndex || 0
  isModalOpen.value = true
}

async function handleSave() {
  if (!form.question || !form.answer) return
  isSubmitting.value = true
  try {
    if (isEditing.value && editingId.value) {
      await $fetch(`/api/admin/faq/${editingId.value}`, {
        method: 'PATCH',
        body: form,
      })
    } else {
      await $fetch('/api/admin/faq', {
        method: 'POST',
        body: form,
      })
    }
    isModalOpen.value = false
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menyimpan FAQ.')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(id: string) {
  if (!confirm('Hapus pertanyaan ini dari FAQ?')) return
  try {
    await $fetch(`/api/admin/faq/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menghapus FAQ.')
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
            Manajemen Tanya Jawab (FAQ)
          </h1>
        </div>

        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
          @click="openAddModal"
        >
          <span class="material-symbols-rounded text-base">add</span>
          <span>Tambah Pertanyaan</span>
        </button>
      </header>

      <main class="flex-1 p-6">
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          <div v-for="faq in faqs" :key="faq.id" class="p-5 hover:bg-slate-50/80 transition flex items-start justify-between gap-4">
            <div class="min-w-0">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700 font-semibold mb-1 inline-block">
                {{ faq.category }}
              </span>
              <h2 class="text-xs font-bold text-navy-900 font-display mb-1">{{ faq.question }}</h2>
              <p class="text-xs text-slate-600 font-body leading-relaxed">{{ faq.answer }}</p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-navy-900 font-medium text-xs transition"
                @click="openEditModal(faq)"
              >
                Edit
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs transition"
                @click="handleDelete(faq.id)"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Tambah/Edit FAQ (3/4 Lebar Admin Panel) -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="isModalOpen = false"
      >
        <div class="bg-white rounded-3xl w-full lg:w-3/4 max-w-6xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <h2 class="text-lg font-bold text-navy-900 font-display mb-4">
            {{ isEditing ? 'Edit Pertanyaan' : 'Tambah Pertanyaan FAQ' }}
          </h2>

          <form @submit.prevent="handleSave" class="space-y-4 text-xs font-body">
            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Pertanyaan *</label>
              <input
                v-model="form.question"
                type="text"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Kategori</label>
              <select v-model="form.category" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
                <option value="umum">Umum</option>
                <option value="teknis">Teknis & Gate</option>
                <option value="keuangan">Keuangan & SPP</option>
                <option value="implementasi">Implementasi & Bimtek</option>
              </select>
            </div>

            <div>
              <label class="block font-mono uppercase font-semibold text-slate-700 mb-1">Jawaban Lengkap *</label>
              <textarea
                v-model="form.answer"
                rows="4"
                required
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
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan FAQ' }}
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


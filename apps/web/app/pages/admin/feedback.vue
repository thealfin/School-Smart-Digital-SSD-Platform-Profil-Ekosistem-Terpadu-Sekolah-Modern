<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  middleware: 'admin',
})

useHead({
  title: 'Kotak Masuk Pesan - Admin SSD',
})

const { user, clear: clearSession } = useUserSession()
const router = useRouter()

const { data, refresh } = await useFetch('/api/admin/feedback')
const messages = computed(() => data.value?.messages || [])

const selectedMessage = ref<any | null>(null)
const isLogoutModalOpen = ref(false)
const isMobileSidebarOpen = ref(false)

function viewMessage(msg: any) {
  selectedMessage.value = msg
  if (!msg.isRead) {
    toggleRead(msg.id, true)
  }
}

async function toggleRead(id: string, isRead: boolean) {
  try {
    await $fetch(`/api/admin/feedback/${id}`, {
      method: 'PATCH',
      body: { isRead },
    })
    await refresh()
  } catch (err: any) {
    console.error('Failed to update read status', err)
  }
}

async function handleDelete(id: string) {
  if (!confirm('Hapus pesan ini dari kotak masuk?')) return
  try {
    await $fetch(`/api/admin/feedback/${id}`, { method: 'DELETE' })
    if (selectedMessage.value?.id === id) {
      selectedMessage.value = null
    }
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menghapus pesan.')
  }
}

async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  await clearSession()
  router.replace('/admin/login')
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
            Kotak Masuk Pesan & Pertanyaan (Feedback)
          </h1>
        </div>
      </header>

      <main class="flex-1 p-6">
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div v-if="messages.length > 0" class="divide-y divide-slate-100">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="p-4 sm:p-5 hover:bg-slate-50/80 transition cursor-pointer flex items-center justify-between gap-4"
              :class="{ 'bg-cyan-50/20': !msg.isRead }"
              @click="viewMessage(msg)"
            >
              <div class="flex items-start gap-3 min-w-0">
                <span
                  class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                  :class="msg.isRead ? 'bg-transparent' : 'bg-cyan-500'"
                />
                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="font-bold text-navy-900 text-xs font-display">{{ msg.senderName }}</span>
                    <span class="text-[10px] text-slate-400 font-mono">
                      {{ new Date(msg.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                    </span>
                  </div>
                  <p class="text-xs font-semibold text-slate-700 truncate mb-0.5">{{ msg.subject }}</p>
                  <p class="text-[11px] text-slate-500 line-clamp-1 font-body">{{ msg.message }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0" @click.stop>
                <button
                  type="button"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  :title="msg.isRead ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'"
                  @click="toggleRead(msg.id, !msg.isRead)"
                >
                  <span class="material-symbols-rounded text-lg">
                    {{ msg.isRead ? 'mark_email_unread' : 'mark_email_read' }}
                  </span>
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Hapus pesan"
                  @click="handleDelete(msg.id)"
                >
                  <span class="material-symbols-rounded text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="p-12 text-center text-xs text-slate-400">
            <span class="material-symbols-rounded text-4xl text-slate-300 block mb-2">inbox</span>
            Belum ada pesan masuk di kotak feedback.
          </div>
        </div>
      </main>
    </div>

    <!-- Message Detail Modal (3/4 Lebar Admin Panel) -->
    <Teleport to="body">
      <div
        v-if="selectedMessage"
        class="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="selectedMessage = null"
      >
        <div class="bg-white rounded-3xl w-full lg:w-3/4 max-w-6xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <span class="text-[10px] font-mono text-cyan-600 uppercase font-semibold">DETAIL PESAN MASUK</span>
              <h2 class="text-base font-bold text-navy-900 font-display">{{ selectedMessage.subject }}</h2>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              @click="selectedMessage = null"
            >
              <span class="material-symbols-rounded">close</span>
            </button>
          </div>

          <div class="space-y-4 text-xs font-body mb-6">
            <div class="bg-slate-50 rounded-xl p-3.5 space-y-1.5 font-mono text-[11px]">
              <p><strong class="text-slate-700">Pengirim:</strong> {{ selectedMessage.senderName }}</p>
              <p><strong class="text-slate-700">Email:</strong> {{ selectedMessage.senderEmail }}</p>
              <p v-if="selectedMessage.senderPhone"><strong class="text-slate-700">Telepon / WA:</strong> {{ selectedMessage.senderPhone }}</p>
              <p><strong class="text-slate-700">Waktu:</strong> {{ new Date(selectedMessage.createdAt).toLocaleString('id-ID') }}</p>
            </div>

            <div class="p-4 bg-white border border-slate-200 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed text-xs">
              {{ selectedMessage.message }}
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold"
              @click="handleDelete(selectedMessage.id)"
            >
              Hapus Pesan
            </button>

            <div class="flex items-center gap-2">
              <a
                v-if="selectedMessage.senderPhone"
                :href="`https://wa.me/${selectedMessage.senderPhone.replace(/[^0-9]/g, '')}`"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <span>Balas via WhatsApp</span>
              </a>
              <a
                :href="`mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`"
                class="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <span>Balas Email</span>
              </a>
            </div>
          </div>
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


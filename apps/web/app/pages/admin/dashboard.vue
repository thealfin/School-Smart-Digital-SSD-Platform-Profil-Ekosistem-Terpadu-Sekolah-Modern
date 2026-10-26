<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  middleware: 'admin',
})

useHead({
  title: 'Dashboard Admin — School Smart Digital',
})

const { user, clear: clearSession } = useUserSession()
const router = useRouter()

const { data: statsData, refresh: refreshStats } = await useFetch('/api/admin/stats')
const stats = computed(() => statsData.value?.stats || {
  totalLeads: 0,
  newLeads: 0,
  totalNews: 0,
  totalGalleries: 0,
  unreadFeedbacks: 0,
})

const recentLeads = computed(() => statsData.value?.recentLeads || [])
const recentFeedbacks = computed(() => statsData.value?.recentFeedbacks || [])

const isLogoutModalOpen = ref(false)
const isMobileSidebarOpen = ref(false)

async function handleLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  await clearSession()
  router.replace('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Admin Sidebar -->
    <AdminSidebar
      :user="user"
      :is-open-mobile="isMobileSidebarOpen"
      @open-logout-modal="isLogoutModalOpen = true"
      @close-mobile="isMobileSidebarOpen = false"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Bar -->
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
            Ringkasan Sistem & Aktivitas
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/admin/leads"
            class="px-3.5 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 transition"
          >
            Kelola Prospek
          </NuxtLink>
        </div>
      </header>

      <!-- Dashboard Body -->
      <main class="flex-1 p-6 space-y-8">
        <!-- KPI Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- KPI 1: Leads -->
          <NuxtLink
            to="/admin/leads"
            class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all group"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-mono font-semibold uppercase text-slate-500">Total Prospek</span>
              <span class="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <span class="material-symbols-rounded text-lg">contact_mail</span>
              </span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-extrabold text-navy-900 font-display">{{ stats.totalLeads }}</span>
              <span v-if="stats.newLeads > 0" class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                +{{ stats.newLeads }} Baru
              </span>
            </div>
          </NuxtLink>

          <!-- KPI 2: News -->
          <NuxtLink
            to="/admin/news"
            class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all group"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-mono font-semibold uppercase text-slate-500">Berita & Artikel</span>
              <span class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span class="material-symbols-rounded text-lg">newspaper</span>
              </span>
            </div>
            <span class="text-2xl font-extrabold text-navy-900 font-display">{{ stats.totalNews }}</span>
          </NuxtLink>

          <!-- KPI 3: Galleries -->
          <NuxtLink
            to="/admin/portfolio"
            class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all group"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-mono font-semibold uppercase text-slate-500">Galeri Bimtek</span>
              <span class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <span class="material-symbols-rounded text-lg">photo_library</span>
              </span>
            </div>
            <span class="text-2xl font-extrabold text-navy-900 font-display">{{ stats.totalGalleries }}</span>
          </NuxtLink>

          <!-- KPI 4: Feedback -->
          <NuxtLink
            to="/admin/feedback"
            class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all group"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-mono font-semibold uppercase text-slate-500">Pesan Masuk</span>
              <span class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <span class="material-symbols-rounded text-lg">mail</span>
              </span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-extrabold text-navy-900 font-display">{{ stats.unreadFeedbacks }}</span>
              <span v-if="stats.unreadFeedbacks > 0" class="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                Belum Dibaca
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- Tables Section: Recent Leads & Recent Feedbacks -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Leads -->
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div class="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 class="text-sm font-bold text-navy-900 font-display">Prospek Konsultasi Terbaru</h2>
              <NuxtLink to="/admin/leads" class="text-xs text-cyan-600 hover:text-cyan-700 font-semibold">
                Lihat Semua →
              </NuxtLink>
            </div>

            <div v-if="recentLeads.length > 0" class="divide-y divide-slate-100">
              <div v-for="lead in recentLeads" :key="lead.id" class="p-4 hover:bg-slate-50/80 transition flex items-center justify-between">
                <div>
                  <h3 class="text-xs font-bold text-navy-900 font-display">{{ lead.name }}</h3>
                  <p class="text-xs text-slate-500 font-body">{{ lead.organization }} ({{ lead.roleTitle || 'Mitra' }})</p>
                  <p class="text-[11px] font-mono text-cyan-700 mt-0.5">WA: {{ lead.whatsapp }}</p>
                </div>
                <span class="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase bg-slate-100 text-slate-700">
                  {{ lead.status }}
                </span>
              </div>
            </div>
            <div v-else class="p-8 text-center text-xs text-slate-400">
              Belum ada data prospek masuk.
            </div>
          </div>

          <!-- Recent Feedback Messages -->
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div class="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 class="text-sm font-bold text-navy-900 font-display">Pesan Masuk Terbaru (Hubungi Kami)</h2>
              <NuxtLink to="/admin/feedback" class="text-xs text-cyan-600 hover:text-cyan-700 font-semibold">
                Lihat Semua →
              </NuxtLink>
            </div>

            <div v-if="recentFeedbacks.length > 0" class="divide-y divide-slate-100">
              <div v-for="msg in recentFeedbacks" :key="msg.id" class="p-4 hover:bg-slate-50/80 transition flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <span v-if="!msg.isRead" class="w-2 h-2 rounded-full bg-rose-500"></span>
                    <h3 class="text-xs font-bold text-navy-900 font-display">{{ msg.senderName }}</h3>
                  </div>
                  <p class="text-xs text-slate-600 font-body line-clamp-1 mt-0.5 font-medium">{{ msg.subject }}</p>
                  <p class="text-[11px] text-slate-400 font-mono">{{ msg.senderEmail }}</p>
                </div>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-mono"
                  :class="msg.isRead ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-700 font-bold'"
                >
                  {{ msg.isRead ? 'Sudah Dibaca' : 'Baru' }}
                </span>
              </div>
            </div>
            <div v-else class="p-8 text-center text-xs text-slate-400">
              Belum ada pesan masuk dari pengunjung.
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Logout Confirmation Modal -->
    <AdminLogoutModal
      :is-open="isLogoutModalOpen"
      @confirm="handleLogout"
      @close="isLogoutModalOpen = false"
    />
  </div>
</template>


<script setup lang="ts">
import type { Lead, LeadStatus } from '@ssd/shared'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import AdminLeadDetailModal from '~/components/admin/AdminLeadDetailModal.vue'
import AdminExportModal from '~/components/admin/AdminExportModal.vue'
import AdminLogoutModal from '~/components/admin/AdminLogoutModal.vue'

definePageMeta({
  middleware: 'admin',
  layout: false,
})

useHead({
  title: 'CRM Lead Admin — School Smart Digital',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const router = useRouter()
const { user, clear: clearSession } = useUserSession()

// Filter states
const selectedStatus = ref<string>('all')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

// Data states
const leads = ref<Lead[]>([])
const totalLeads = ref(0)
const totalPages = ref(1)
const isLoading = ref(false)
const selectedLead = ref<Lead | null>(null)

// UI Modal & Sidebar states
const isMobileSidebarOpen = ref(false)
const isDetailModalOpen = ref(false)
const isExportModalOpen = ref(false)
const isLogoutModalOpen = ref(false)

// Notes editing state
const isSavingNotes = ref(false)
const toastMessage = ref('')

const statusOptions: { label: string; value: string; color: string }[] = [
  { label: 'Semua Status', value: 'all', color: 'bg-slate-100 text-slate-700' },
  { label: 'Baru', value: 'new', color: 'bg-blue-100 text-blue-800' },
  { label: 'Dihubungi', value: 'contacted', color: 'bg-amber-100 text-amber-800' },
  { label: 'Demo Terjadwal', value: 'demo_scheduled', color: 'bg-purple-100 text-purple-800' },
  { label: 'Won / Deal', value: 'won', color: 'bg-emerald-100 text-emerald-800' },
  { label: 'Lost', value: 'lost', color: 'bg-rose-100 text-rose-800' },
  { label: 'Spam', value: 'spam', color: 'bg-gray-100 text-gray-600' },
]

function getStatusBadge(status: string) {
  const found = statusOptions.find((o) => o.value === status)
  return found || { label: status, color: 'bg-slate-100 text-slate-700' }
}

async function fetchLeads() {
  isLoading.value = true
  try {
    const params: Record<string, string | number> = {
      page: currentPage.value,
      limit: pageSize.value,
    }
    if (selectedStatus.value !== 'all') {
      params.status = selectedStatus.value
    }
    if (searchQuery.value.trim()) {
      params.q = searchQuery.value.trim()
    }

    const res = await $fetch<{ ok: boolean; leads: Lead[]; pagination: { total: number; totalPages: number } }>(
      '/api/admin/leads',
      { query: params }
    )

    leads.value = res.leads || []
    totalLeads.value = res.pagination.total || 0
    totalPages.value = res.pagination.totalPages || 1
  } catch {
    showToast('Gagal memuat daftar lead.')
  } finally {
    isLoading.value = false
  }
}

// Watch filters
watch([selectedStatus, currentPage], () => {
  fetchLeads()
})

// Debounced search
let searchTimeout: any = null
function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchLeads()
  }, 350)
}

function handleSelectStatus(status: string) {
  selectedStatus.value = status
  currentPage.value = 1
}

function openLeadDetail(lead: Lead) {
  selectedLead.value = { ...lead }
  isDetailModalOpen.value = true
}

function closeDetailModal() {
  isDetailModalOpen.value = false
  selectedLead.value = null
}

async function updateLeadStatus(newStatus: LeadStatus) {
  if (!selectedLead.value) return
  try {
    const res = await $fetch<{ ok: boolean; lead: Lead }>(`/api/admin/leads/${selectedLead.value.id}`, {
      method: 'PATCH',
      body: { status: newStatus },
    })
    selectedLead.value.status = res.lead.status
    showToast(`Status diperbarui ke: ${newStatus}`)
    fetchLeads()
  } catch {
    showToast('Gagal memperbarui status lead.')
  }
}

async function saveLeadNotes(notesText: string) {
  if (!selectedLead.value) return
  isSavingNotes.value = true
  try {
    const res = await $fetch<{ ok: boolean; lead: Lead }>(`/api/admin/leads/${selectedLead.value.id}`, {
      method: 'PATCH',
      body: { notes: notesText },
    })
    selectedLead.value.notes = res.lead.notes
    showToast('Catatan berhasil disimpan.')
    fetchLeads()
  } catch {
    showToast('Gagal menyimpan catatan.')
  } finally {
    isSavingNotes.value = false
  }
}

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

function handleConfirmExport(filterStatus: string) {
  isExportModalOpen.value = false
  const url = `/api/admin/leads.csv${filterStatus !== 'all' ? `?status=${filterStatus}` : ''}`
  window.open(url, '_blank')
}

async function handleConfirmLogout() {
  isLogoutModalOpen.value = false
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
  } finally {
    await clearSession()
    await router.push('/admin/login')
  }
}

function formatDate(iso: string | Date | undefined) {
  if (!iso) return '-'
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  fetchLeads()
})
</script>

<template>
  <div class="min-h-screen bg-[var(--ssd-background,#f6f9fc)] text-[var(--color-navy-950,#0a2036)] flex font-body">
    <!-- Dedicated Admin Sidebar Component -->
    <AdminSidebar
      :user="(user as any)"
      :selected-status="selectedStatus"
      :status-options="statusOptions"
      :total-leads="totalLeads"
      :is-open-mobile="isMobileSidebarOpen"
      @select-status="handleSelectStatus"
      @open-export-modal="isExportModalOpen = true"
      @open-logout-modal="isLogoutModalOpen = true"
      @close-mobile="isMobileSidebarOpen = false"
    />

    <!-- Right Workspace Column -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Workspace Header Bar -->
      <header class="bg-white border-b border-[var(--ssd-border,#d7e2ec)] px-4 sm:px-8 py-3.5 sticky top-0 z-20 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="lg:hidden p-2 rounded-xl border border-slate-200 text-[#0C3161] hover:bg-slate-50"
            aria-label="Buka menu sidebar admin"
            @click="isMobileSidebarOpen = true"
          >
            <span class="material-symbols-rounded text-xl">menu</span>
          </button>

          <div>
            <h1 class="text-lg sm:text-xl font-bold font-display text-[#0C3161]">
              Daftar Permintaan Demo
            </h1>
            <p class="text-[11px] text-[var(--color-secondary,#46607a)] font-mono">
              Total {{ totalLeads }} data prospek masuk
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <button
            type="button"
            class="px-3.5 py-2 rounded-xl bg-[#01A8CF] hover:bg-[#00b4d8] text-[#0A2036] font-bold text-xs transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#0C3161]"
            @click="isExportModalOpen = true"
          >
            <span class="material-symbols-rounded text-sm">download</span>
            <span class="hidden sm:inline">Ekspor CSV</span>
          </button>

          <button
            type="button"
            class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold text-xs transition focus:outline-none focus:ring-2 focus:ring-rose-500"
            @click="isLogoutModalOpen = true"
          >
            Logout
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <!-- Search & Quick Filter Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <!-- Status Filter Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              v-for="opt in statusOptions"
              :key="opt.value"
              type="button"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C3161]',
                selectedStatus === opt.value
                  ? 'bg-[#0C3161] text-white shadow-xs'
                  : 'bg-white text-[var(--color-secondary,#46607a)] hover:bg-slate-100 border border-[var(--ssd-border,#d7e2ec)]',
              ]"
              @click="handleSelectStatus(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>

          <!-- Search Input -->
          <div class="w-full sm:w-80 relative shrink-0">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama, sekolah, WA..."
              class="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--ssd-border,#d7e2ec)] bg-white text-xs text-[#0C3161] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C3161]"
              @input="onSearchInput"
            />
            <span class="absolute left-3 top-2.5 text-slate-400 text-xs" aria-hidden="true">🔍</span>
          </div>
        </div>

        <!-- Leads Table Container -->
        <div class="bg-white rounded-2xl border border-[var(--ssd-border,#d7e2ec)] shadow-[0_1px_2px_rgb(10_32_54/0.06)] overflow-hidden">
          <!-- Desktop Table View (>= 768px) -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-[var(--ssd-border,#d7e2ec)] text-[#0C3161] font-mono uppercase tracking-wider">
                <tr>
                  <th class="py-3 px-4">Tanggal</th>
                  <th class="py-3 px-4">Nama & Lembaga</th>
                  <th class="py-3 px-4">Kontak (WhatsApp)</th>
                  <th class="py-3 px-4">Tipe</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--ssd-border,#d7e2ec)]">
                <tr v-if="isLoading" class="text-center">
                  <td colspan="6" class="py-12 text-slate-400 font-mono">Memuat data prospek...</td>
                </tr>
                <tr v-else-if="leads.length === 0" class="text-center">
                  <td colspan="6" class="py-12 text-slate-400 font-mono">Tidak ada lead yang cocok dengan filter.</td>
                </tr>
                <tr
                  v-for="lead in leads"
                  :key="lead.id"
                  class="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  @click="openLeadDetail(lead)"
                >
                  <td class="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {{ formatDate(lead.createdAt) }}
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="font-semibold text-[#0C3161]">{{ lead.name }}</div>
                    <div class="text-[11px] text-slate-500">
                      {{ lead.organization }} <span v-if="lead.roleTitle">({{ lead.roleTitle }})</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 font-mono">
                    <a
                      :href="`https://wa.me/${lead.whatsapp}`"
                      target="_blank"
                      rel="noopener"
                      class="text-[#01A8CF] hover:underline font-semibold"
                      @click.stop
                    >
                      {{ lead.whatsapp }}
                    </a>
                  </td>
                  <td class="py-3.5 px-4 font-mono uppercase text-[11px] text-slate-600">
                    {{ lead.orgType }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span :class="['px-2.5 py-1 rounded-full text-[11px] font-semibold', getStatusBadge(lead.status).color]">
                      {{ getStatusBadge(lead.status).label }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
                      @click.stop="openLeadDetail(lead)"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Stacked Cards (< 768px) -->
          <div class="md:hidden divide-y divide-[var(--ssd-border,#d7e2ec)]">
            <div v-if="isLoading" class="p-8 text-center text-slate-400 font-mono text-xs">
              Memuat data prospek...
            </div>
            <div v-else-if="leads.length === 0" class="p-8 text-center text-slate-400 font-mono text-xs">
              Tidak ada data prospek yang cocok.
            </div>
            <div
              v-for="lead in leads"
              :key="lead.id"
              class="p-4 space-y-2 hover:bg-slate-50 transition cursor-pointer"
              @click="openLeadDetail(lead)"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-mono text-slate-400 text-[11px]">{{ formatDate(lead.createdAt) }}</span>
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-semibold', getStatusBadge(lead.status).color]">
                  {{ getStatusBadge(lead.status).label }}
                </span>
              </div>
              <div>
                <div class="font-semibold text-sm text-[#0C3161]">{{ lead.name }}</div>
                <div class="text-xs text-slate-600">
                  {{ lead.organization }} <span v-if="lead.roleTitle">({{ lead.roleTitle }})</span>
                </div>
              </div>
              <div class="flex items-center justify-between pt-1">
                <a
                  :href="`https://wa.me/${lead.whatsapp}`"
                  target="_blank"
                  rel="noopener"
                  class="text-xs font-mono font-semibold text-[#01A8CF] hover:underline"
                  @click.stop
                >
                  📱 {{ lead.whatsapp }}
                </a>
                <span class="text-[11px] font-mono text-slate-500 uppercase">{{ lead.orgType }}</span>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div class="px-4 py-3 bg-slate-50 border-t border-[var(--ssd-border,#d7e2ec)] flex items-center justify-between text-xs">
            <span class="font-mono text-slate-500">
              Halaman {{ currentPage }} dari {{ totalPages }}
            </span>
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                :disabled="currentPage <= 1 || isLoading"
                class="px-3 py-1 rounded-lg border border-[var(--ssd-border,#d7e2ec)] bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                @click="currentPage--"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                :disabled="currentPage >= totalPages || isLoading"
                class="px-3 py-1 rounded-lg border border-[var(--ssd-border,#d7e2ec)] bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                @click="currentPage++"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 1. Dedicated Lead Detail Modal Component -->
    <AdminLeadDetailModal
      :is-open="isDetailModalOpen"
      :lead="selectedLead"
      :status-options="statusOptions"
      :is-saving-notes="isSavingNotes"
      @close="closeDetailModal"
      @update-status="updateLeadStatus"
      @save-notes="saveLeadNotes"
    />

    <!-- 2. Dedicated CSV Export Modal Component -->
    <AdminExportModal
      :is-open="isExportModalOpen"
      :current-status="selectedStatus"
      :status-options="statusOptions"
      :total-leads="totalLeads"
      @close="isExportModalOpen = false"
      @confirm-export="handleConfirmExport"
    />

    <!-- 3. Dedicated Logout Confirmation Modal Component -->
    <AdminLogoutModal
      :is-open="isLogoutModalOpen"
      :user-name="(user as any)?.name"
      @close="isLogoutModalOpen = false"
      @confirm-logout="handleConfirmLogout"
    />

    <!-- Floating Toast Notification -->
    <div
      v-if="toastMessage"
      role="status"
      class="fixed bottom-6 right-6 z-50 bg-[#0C3161] text-white px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-[#01A8CF]"
    >
      <span>ℹ️</span>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

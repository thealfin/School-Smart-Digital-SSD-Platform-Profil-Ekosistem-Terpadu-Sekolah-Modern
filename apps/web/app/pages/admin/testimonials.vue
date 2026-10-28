<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

definePageMeta({
  middleware: 'admin',
})

useHead({
  title: 'Kelola Testimoni & Ulasan Klien - Admin SSD',
})

const { user, clear: clearSession } = useUserSession()
const router = useRouter()

const { data, refresh } = await useFetch('/api/admin/testimonials')
const rawTestimonials = computed(() => data.value?.testimonials || [])

const searchQuery = ref('')
const filterStatus = ref<'all' | 'published' | 'draft'>('all')

const testimonials = computed(() => {
  return rawTestimonials.value.filter((item: any) => {
    const matchesSearch =
      !searchQuery.value ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.organization && item.organization.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (item.roleTitle && item.roleTitle.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      item.content.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      filterStatus.value === 'all' ||
      (filterStatus.value === 'published' && item.isPublished) ||
      (filterStatus.value === 'draft' && !item.isPublished)

    return matchesSearch && matchesStatus
  })
})

const stats = computed(() => {
  const total = rawTestimonials.value.length
  const published = rawTestimonials.value.filter((t: any) => t.isPublished).length
  const verified = rawTestimonials.value.filter((t: any) => t.isVerified).length
  return { total, published, verified }
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const isSubmitting = ref(false)
const isPurgingCache = ref(false)
const cacheNotice = ref('')
const isLogoutModalOpen = ref(false)
const isMobileSidebarOpen = ref(false)

async function handleManualPurgeCache() {
  isPurgingCache.value = true
  cacheNotice.value = ''
  try {
    await $fetch('/api/admin/purge-cache', { method: 'POST' })
    cacheNotice.value = 'Cache beranda dan testimoni berhasil dibersihkan!'
    setTimeout(() => {
      cacheNotice.value = ''
    }, 4000)
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal membersihkan cache.')
  } finally {
    isPurgingCache.value = false
  }
}

const form = reactive({
  name: '',
  roleTitle: '',
  organization: '',
  content: '',
  avatarUrl: '',
  rating: 5,
  isVerified: true,
  isPublished: true,
  orderIndex: 0,
})

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.name = ''
  form.roleTitle = ''
  form.organization = ''
  form.content = ''
  form.avatarUrl = ''
  form.rating = 5
  form.isVerified = true
  form.isPublished = true
  form.orderIndex = rawTestimonials.value.length + 1
  isModalOpen.value = true
}

function openEditModal(item: any) {
  isEditing.value = true
  editingId.value = item.id
  form.name = item.name
  form.roleTitle = item.roleTitle || ''
  form.organization = item.organization || ''
  form.content = item.content || ''
  form.avatarUrl = item.avatarUrl || ''
  form.rating = item.rating || 5
  form.isVerified = Boolean(item.isVerified)
  form.isPublished = Boolean(item.isPublished)
  form.orderIndex = item.orderIndex || 0
  isModalOpen.value = true
}

async function handleSave() {
  if (!form.name.trim() || !form.content.trim()) {
    alert('Nama klien dan isi testimoni wajib diisi.')
    return
  }

  isSubmitting.value = true
  try {
    if (isEditing.value && editingId.value) {
      await $fetch(`/api/admin/testimonials/${editingId.value}`, {
        method: 'PUT',
        body: form,
      })
    } else {
      await $fetch('/api/admin/testimonials', {
        method: 'POST',
        body: form,
      })
    }
    isModalOpen.value = false
    cacheNotice.value = 'Data berhasil disimpan & cache beranda otomatis dibersihkan!'
    setTimeout(() => {
      if (cacheNotice.value.includes('disimpan')) cacheNotice.value = ''
    }, 4000)
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menyimpan testimoni.')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(id: string, name: string) {
  if (!confirm(`Apakah Anda yakin ingin menghapus testimoni dari "${name}"?`)) return
  try {
    await $fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    cacheNotice.value = 'Testimoni dihapus & cache beranda otomatis dibersihkan!'
    setTimeout(() => {
      if (cacheNotice.value.includes('dihapus')) cacheNotice.value = ''
    }, 4000)
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menghapus testimoni.')
  }
}

async function togglePublish(item: any) {
  try {
    await $fetch(`/api/admin/testimonials/${item.id}`, {
      method: 'PUT',
      body: { isPublished: !item.isPublished },
    })
    cacheNotice.value = 'Status publikasi diperbarui & cache beranda dibersihkan!'
    setTimeout(() => {
      if (cacheNotice.value.includes('publikasi')) cacheNotice.value = ''
    }, 4000)
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal memperbarui status publikasi.')
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
      <!-- Top Header -->
      <header class="h-16 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            @click="isMobileSidebarOpen = true"
          >
            <span class="material-symbols-rounded">menu</span>
          </button>
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-cyan-600">reviews</span>
            <h1 class="text-base sm:text-lg font-bold text-navy-900 font-display">
              Moderasi Testimoni &amp; Ulasan Klien
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="isPurgingCache"
            class="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            title="Bersihkan cache ISR halaman beranda & API testimoni"
            @click="handleManualPurgeCache"
          >
            <span class="material-symbols-rounded text-base text-cyan-600" :class="{ 'animate-spin': isPurgingCache }">cached</span>
            <span class="hidden sm:inline">{{ isPurgingCache ? 'Membersihkan...' : 'Bersihkan Cache' }}</span>
          </button>

          <button
            type="button"
            class="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            @click="openAddModal"
          >
            <span class="material-symbols-rounded text-base">add</span>
            <span>Tambah Testimoni</span>
          </button>
        </div>
      </header>

      <main class="flex-1 p-6 space-y-6">
        <!-- Live Auto-Purge Cache Notification Banner -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div
            v-if="cacheNotice"
            class="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-medium flex items-center justify-between gap-2 shadow-xs"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-rounded text-cyan-600 text-base">check_circle</span>
              <span>{{ cacheNotice }}</span>
            </div>
            <button
              type="button"
              class="text-cyan-600 hover:text-cyan-900 text-xs p-1"
              @click="cacheNotice = ''"
            >
              ✕
            </button>
          </div>
        </transition>
        
        <!-- Summary Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-500 font-mono uppercase tracking-wider">Total Testimoni</p>
              <h3 class="text-2xl font-bold font-display text-navy-900 mt-1">{{ stats.total }}</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center">
              <span class="material-symbols-rounded">rate_review</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-500 font-mono uppercase tracking-wider">Dipublikasikan</p>
              <h3 class="text-2xl font-bold font-display text-emerald-600 mt-1">{{ stats.published }}</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span class="material-symbols-rounded">visibility</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-500 font-mono uppercase tracking-wider">Terverifikasi SSD</p>
              <h3 class="text-2xl font-bold font-display text-cyan-600 mt-1">{{ stats.verified }}</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <span class="material-symbols-rounded">verified</span>
            </div>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div class="relative flex-1 max-w-md">
            <span class="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama klien, jabatan, sekolah, atau isi ulasan..."
              class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              :class="filterStatus === 'all' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              @click="filterStatus = 'all'"
            >
              Semua ({{ stats.total }})
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              :class="filterStatus === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              @click="filterStatus = 'published'"
            >
              Publik ({{ stats.published }})
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              :class="filterStatus === 'draft' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              @click="filterStatus = 'draft'"
            >
              Draft ({{ stats.total - stats.published }})
            </button>
          </div>
        </div>

        <!-- Testimonial Table -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono tracking-wider">
                  <th class="py-3 px-4">Klien &amp; Sekolah Mitra</th>
                  <th class="py-3 px-4">Isi Testimoni</th>
                  <th class="py-3 px-4">Rating</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4">Verifikasi</th>
                  <th class="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-body">
                <tr v-if="testimonials.length === 0">
                  <td colspan="6" class="py-12 text-center text-slate-400">
                    <span class="material-symbols-rounded text-3xl mb-1 block">sentiment_dissatisfied</span>
                    Tidak ada testimoni yang sesuai filter.
                  </td>
                </tr>
                <tr v-for="item in testimonials" :key="item.id" class="hover:bg-slate-50/80 transition">
                  <!-- Klien & Sekolah -->
                  <td class="py-3.5 px-4 min-w-[200px]">
                    <div class="flex items-center gap-3">
                      <img
                        v-if="item.avatarUrl"
                        :src="item.avatarUrl"
                        class="w-10 h-10 rounded-full object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div
                        v-else
                        class="w-10 h-10 rounded-full bg-navy-900 text-white font-bold flex items-center justify-center shrink-0 text-xs"
                      >
                        {{ item.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('') }}
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-navy-900 truncate">{{ item.name }}</p>
                        <p class="text-[11px] text-slate-500 truncate">{{ item.roleTitle }}</p>
                        <p class="text-[11px] font-semibold text-cyan-700 truncate">{{ item.organization }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Isi Testimoni -->
                  <td class="py-3.5 px-4 max-w-md text-slate-600 line-clamp-2">
                    &ldquo;{{ item.content }}&rdquo;
                  </td>

                  <!-- Rating -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <div class="flex items-center text-amber-400">
                      <span v-for="star in (item.rating || 5)" :key="star" class="material-symbols-rounded text-sm">
                        star
                      </span>
                    </div>
                  </td>

                  <!-- Status Publikasi -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <button
                      type="button"
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold transition cursor-pointer"
                      :class="item.isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'"
                      @click="togglePublish(item)"
                    >
                      {{ item.isPublished ? 'Dipublikasikan' : 'Draft' }}
                    </button>
                  </td>

                  <!-- Status Verifikasi -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold inline-flex items-center gap-1"
                      :class="item.isVerified ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' : 'bg-slate-100 text-slate-500'"
                    >
                      <span class="material-symbols-rounded text-xs">{{ item.isVerified ? 'verified' : 'pending' }}</span>
                      {{ item.isVerified ? 'Terverifikasi' : 'Belum' }}
                    </span>
                  </td>

                  <!-- Aksi -->
                  <td class="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-navy-900 font-medium transition cursor-pointer"
                      @click="openEditModal(item)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium transition cursor-pointer"
                      @click="handleDelete(item.id, item.name)"
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

    <!-- Modal Tambah / Edit Testimoni (3/4 Lebar Admin Panel) -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        @click.self="isModalOpen = false"
      >
        <div class="bg-white rounded-3xl w-full lg:w-3/4 max-w-6xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 class="text-lg font-bold text-navy-900 font-display">
              {{ isEditing ? 'Edit Testimoni Klien' : 'Tambah Testimoni Baru' }}
            </h3>
            <button
              type="button"
              class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              @click="isModalOpen = false"
            >
              <span class="material-symbols-rounded text-base">close</span>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="space-y-4 text-xs font-body">
            <!-- Nama Klien -->
            <div>
              <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                Nama Lengkap Klien <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="cth. Drs. H. Ahmad Fauzi, M.Pd"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <!-- Jabatan & Nama Sekolah -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Jabatan / Posisi
                </label>
                <input
                  v-model="form.roleTitle"
                  type="text"
                  placeholder="cth. Kepala Sekolah / Ketua Yayasan"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Nama Sekolah / Lembaga
                </label>
                <input
                  v-model="form.organization"
                  type="text"
                  placeholder="cth. SMP IT Nurul Fikri"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <!-- Isi Testimoni -->
            <div>
              <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                Isi Testimoni / Kutipan <span class="text-rose-500">*</span>
              </label>
              <textarea
                v-model="form.content"
                required
                rows="4"
                placeholder="Tuliskan pengalaman nyata sekolah dalam menggunakan ekosistem School Smart Digital..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 leading-relaxed"
              />
            </div>

            <!-- Rating & Foto Avatar URL -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Rating Bintang
                </label>
                <select
                  v-model.number="form.rating"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
                >
                  <option :value="5">⭐⭐⭐⭐⭐ (5 Bintang - Sangat Puas)</option>
                  <option :value="4">⭐⭐⭐⭐ (4 Bintang - Puas)</option>
                  <option :value="3">⭐⭐⭐ (3 Bintang - Cukup)</option>
                </select>
              </div>

              <div>
                <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  URL Foto Avatar (Opsional)
                </label>
                <input
                  v-model="form.avatarUrl"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <!-- Checkboxes: Published & Verified -->
            <div class="pt-2 flex flex-wrap gap-6">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  v-model="form.isPublished"
                  type="checkbox"
                  class="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span class="text-xs font-semibold text-navy-900">Publikasikan ke Landing Page</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  v-model="form.isVerified"
                  type="checkbox"
                  class="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span class="text-xs font-semibold text-navy-900">Beri Badge "Terverifikasi SSD"</span>
              </label>
            </div>

            <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition font-medium cursor-pointer"
                @click="isModalOpen = false"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <span v-if="isSubmitting" class="material-symbols-rounded text-sm animate-spin">refresh</span>
                <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Testimoni' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Konfirmasi Logout -->
    <AdminLogoutModal
      :is-open="isLogoutModalOpen"
      @confirm="handleLogout"
      @close="isLogoutModalOpen = false"
    />
  </div>
</template>

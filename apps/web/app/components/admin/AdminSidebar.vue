<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    user?: { name?: string; email?: string; role?: string } | null
    selectedStatus?: string
    statusOptions?: { label: string; value: string; color: string }[]
    totalLeads?: number
    isOpenMobile?: boolean
  }>(),
  {
    user: null,
    selectedStatus: 'all',
    statusOptions: () => [],
    totalLeads: 0,
    isOpenMobile: false,
  }
)

const emit = defineEmits<{
  (e: 'selectStatus', value: string): void
  (e: 'openExportModal'): void
  (e: 'openLogoutModal'): void
  (e: 'closeMobile'): void
}>()

const route = useRoute()

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/leads', label: 'Prospek & Demo', icon: 'contact_mail' },
  { to: '/admin/news', label: 'Kelola Berita', icon: 'newspaper' },
  { to: '/admin/portfolio', label: 'Galeri & Kegiatan', icon: 'photo_library' },
  { to: '/admin/services', label: 'Kelola 12 Modul', icon: 'apps' },
  { to: '/admin/testimonials', label: 'Testimoni', icon: 'reviews' },
  { to: '/admin/faq', label: 'Kelola FAQ', icon: 'help' },
  { to: '/admin/feedback', label: 'Feedback Pesan', icon: 'mail' },
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <!-- Mobile Backdrop Scrim -->
  <div
    v-if="isOpenMobile"
    class="fixed inset-0 z-30 bg-navy-950/60 backdrop-blur-xs lg:hidden"
    aria-hidden="true"
    @click="emit('closeMobile')"
  />

  <!-- Sidebar Panel -->
  <aside
    aria-label="Navigasi Admin Panel SSD"
    data-lenis-prevent
    :class="[
      'fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#0C3161] text-white flex flex-col border-r border-white/10 transition-transform duration-200 ease-out shrink-0',
      isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Brand Header with Authentic Logo SSD -->
    <div class="px-5 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
      <NuxtLink to="/admin/dashboard" class="inline-flex items-center focus:outline-none">
        <BrandLogo variant="light" size="sm" subtitle="Admin CMS Panel" />
      </NuxtLink>

      <button
        type="button"
        class="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
        aria-label="Tutup sidebar"
        @click="emit('closeMobile')"
      >
        <span class="material-symbols-rounded text-xl">close</span>
      </button>
    </div>

    <!-- Navigation List -->
    <div class="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-6" data-lenis-prevent>
      <!-- Section 1: Main Admin Menu -->
      <div>
        <p class="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-cyan-300/80 font-semibold">
          Menu Manajemen
        </p>
        <ul class="space-y-1">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              :class="[
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all',
                isActive(item.to)
                  ? 'bg-[#01A8CF] text-[#0A2036] font-bold shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white',
              ]"
              @click="emit('closeMobile')"
            >
              <span class="flex items-center gap-2.5">
                <span class="material-symbols-rounded text-base">
                  {{ item.icon }}
                </span>
                <span>{{ item.label }}</span>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Section 2: Pipeline Filters (Show when on /admin/leads) -->
      <div v-if="route.path.startsWith('/admin/leads') && statusOptions.length > 0">
        <p class="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-cyan-300/80 font-semibold">
          Filter Status Prospek
        </p>
        <ul class="space-y-1">
          <li v-for="opt in statusOptions" :key="opt.value">
            <button
              type="button"
              :class="[
                'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left',
                selectedStatus === opt.value
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
              ]"
              @click="emit('selectStatus', opt.value); emit('closeMobile')"
            >
              <span>{{ opt.label }}</span>
              <span
                v-if="opt.value === 'all'"
                class="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/15 text-white"
              >
                {{ totalLeads }}
              </span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Section 3: Web Link -->
      <div>
        <p class="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-cyan-300/80 font-semibold">
          Pintasan Situs
        </p>
        <NuxtLink
          to="/"
          target="_blank"
          class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <span class="flex items-center gap-2.5">
            <span class="material-symbols-rounded text-base text-cyan-300">public</span>
            <span>Kunjungi Website Publik</span>
          </span>
          <span class="material-symbols-rounded text-sm opacity-70">open_in_new</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Admin User Footer & Logout -->
    <div class="p-4 border-t border-white/10 bg-[#082246]">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="text-xs font-bold text-white truncate">
            {{ user?.name || 'Administrator SSD' }}
          </p>
          <p class="text-[10px] font-mono uppercase tracking-wider text-cyan-300 truncate">
            Role: {{ user?.role || 'owner' }}
          </p>
        </div>

        <button
          type="button"
          class="px-3 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-xs transition flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-white"
          title="Keluar Sesi Admin"
          @click="emit('openLogoutModal')"
        >
          <span class="material-symbols-rounded text-sm">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>

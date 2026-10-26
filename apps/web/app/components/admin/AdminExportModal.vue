<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  currentStatus: string
  statusOptions: { label: string; value: string; color: string }[]
  totalLeads: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirmExport', filterStatus: string): void
}>()

const exportFilter = ref('all')

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      exportFilter.value = props.currentStatus || 'all'
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-export-title"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-2xl max-w-md w-full border border-[var(--ssd-border,#d7e2ec)] shadow-2xl p-6 space-y-5 text-[var(--color-navy-950,#0a2036)]">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#01A8CF]">
              <span class="material-symbols-rounded">download</span>
            </div>
            <div>
              <h2 id="modal-export-title" class="text-lg font-bold font-display text-[#0C3161]">
                Ekspor Prospek ke CSV
              </h2>
              <p class="text-xs text-slate-500">
                Data diamankan dari injeksi formula spreadsheet
              </p>
            </div>
          </div>

          <button
            type="button"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            aria-label="Tutup modal ekspor"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <div class="space-y-2">
          <label for="export-status-select" class="block text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold">
            Pilih Kategori Status Prospek
          </label>
          <select
            id="export-status-select"
            v-model="exportFilter"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[var(--ssd-border,#d7e2ec)] bg-slate-50 text-xs font-semibold text-[#0C3161] focus:outline-none focus:ring-2 focus:ring-[#0C3161]"
          >
            <option
              v-for="opt in statusOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <p class="font-semibold text-[#0C3161]">Format Berkas: UTF-8 CSV (.csv)</p>
          <p>Mencakup kolom nama, lembaga, tipe unit, nomor WhatsApp ternormalisasi, minat aplikasi, status, dan catatan internal.</p>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
            @click="emit('close')"
          >
            Batal
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-xl bg-[#01A8CF] hover:bg-[#00b4d8] text-[#0A2036] font-bold text-xs transition flex items-center gap-1.5"
            @click="emit('confirmExport', exportFilter)"
          >
            <span class="material-symbols-rounded text-sm">download</span>
            <span>Unduh CSV Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>


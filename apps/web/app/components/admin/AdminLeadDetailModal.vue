<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Lead, LeadStatus } from '@ssd/shared'

const props = defineProps<{
  isOpen: boolean
  lead: Lead | null
  statusOptions: { label: string; value: string; color: string }[]
  isSavingNotes?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updateStatus', status: LeadStatus): void
  (e: 'saveNotes', notes: string): void
}>()

const localNotes = ref('')

watch(
  () => props.lead,
  (newLead) => {
    localNotes.value = newLead?.notes || ''
  },
  { immediate: true }
)

function getStatusBadge(status: string) {
  const found = props.statusOptions.find((o) => o.value === status)
  return found || { label: status, color: 'bg-slate-100 text-slate-700' }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && lead"
      data-lenis-prevent
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-lead-title"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-3xl w-full lg:w-3/4 max-w-6xl max-h-[90vh] overflow-y-auto border border-[var(--ssd-border,#d7e2ec)] shadow-2xl p-6 sm:p-8 space-y-6 text-[var(--color-navy-950,#0a2036)]">
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-[var(--ssd-border,#d7e2ec)] pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span :class="['px-2.5 py-0.5 rounded-full text-xs font-semibold', getStatusBadge(lead.status).color]">
                {{ getStatusBadge(lead.status).label }}
              </span>
              <span class="text-xs font-mono text-slate-400">ID: {{ lead.id.slice(0, 8) }}</span>
            </div>
            <h2 id="modal-lead-title" class="text-xl font-bold font-display text-[#0C3161] mt-1">
              {{ lead.name }}
            </h2>
            <p class="text-xs text-slate-600">
              {{ lead.organization }} <span v-if="lead.roleTitle">· {{ lead.roleTitle }}</span>
            </p>
          </div>
          <button
            type="button"
            class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg text-lg font-bold"
            aria-label="Tutup modal detail prospek"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <!-- Detail Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span class="font-mono text-slate-400 uppercase tracking-wider text-[10px]">WhatsApp</span>
            <div class="font-semibold">
              <a
                :href="`https://wa.me/${lead.whatsapp}`"
                target="_blank"
                rel="noopener"
                class="text-[#01A8CF] hover:underline flex items-center gap-1 font-mono text-sm"
              >
                <span>📱 {{ lead.whatsapp }}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span class="font-mono text-slate-400 uppercase tracking-wider text-[10px]">Email</span>
            <div class="font-semibold text-slate-800">
              {{ lead.email || '-' }}
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span class="font-mono text-slate-400 uppercase tracking-wider text-[10px]">Jenis Lembaga & Unit</span>
            <div class="font-semibold capitalize text-slate-800">
              {{ lead.orgType }} · {{ lead.unitCount || 1 }} Unit
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span class="font-mono text-slate-400 uppercase tracking-wider text-[10px]">Rentang Siswa</span>
            <div class="font-semibold text-slate-800">
              {{ lead.studentCountRange || '-' }} Siswa
            </div>
          </div>
        </div>

        <!-- Interests Tags -->
        <div v-if="lead.interests && lead.interests.length > 0">
          <span class="block font-mono text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
            Aplikasi yang Diminati
          </span>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="appSlug in lead.interests"
              :key="appSlug"
              class="px-2.5 py-1 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-900 font-mono text-[11px] font-medium"
            >
              {{ appSlug }}
            </span>
          </div>
        </div>

        <!-- Lead Message -->
        <div v-if="lead.message" class="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs">
          <span class="font-mono text-slate-400 uppercase tracking-wider text-[10px]">Pesan Tambahan</span>
          <p class="text-slate-700 whitespace-pre-wrap">{{ lead.message }}</p>
        </div>

        <!-- Status Changer -->
        <div class="border-t border-[var(--ssd-border,#d7e2ec)] pt-4 space-y-2">
          <span class="block font-mono text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
            Ubah Status Prospek
          </span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="opt in statusOptions.filter((o) => o.value !== 'all')"
              :key="opt.value"
              type="button"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition',
                lead.status === opt.value
                  ? 'bg-[#0C3161] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700',
              ]"
              @click="emit('updateStatus', opt.value as LeadStatus)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Internal Notes Editor -->
        <div class="border-t border-[var(--ssd-border,#d7e2ec)] pt-4 space-y-2">
          <label for="lead-notes" class="block font-mono text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
            Catatan Internal Tim
          </label>
          <textarea
            id="lead-notes"
            v-model="localNotes"
            rows="3"
            placeholder="Tambahkan catatan tindak lanjut, jadwal call, atau hasil diskusi..."
            class="w-full p-3 rounded-xl border border-[var(--ssd-border,#d7e2ec)] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3161]"
          />
          <div class="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
              @click="emit('close')"
            >
              Tutup
            </button>
            <button
              type="button"
              :disabled="isSavingNotes"
              class="px-4 py-2 rounded-xl bg-[#0C3161] hover:bg-[#12355b] text-white font-semibold text-xs transition disabled:opacity-50"
              @click="emit('saveNotes', localNotes)"
            >
              {{ isSavingNotes ? 'Menyimpan...' : 'Simpan Catatan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>


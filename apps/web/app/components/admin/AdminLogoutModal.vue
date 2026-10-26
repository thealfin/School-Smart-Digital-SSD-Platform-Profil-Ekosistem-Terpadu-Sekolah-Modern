<script setup lang="ts">
defineProps<{
  isOpen: boolean
  userName?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirmLogout'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-logout-title"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full border border-[var(--ssd-border,#d7e2ec)] shadow-2xl p-6 space-y-5 text-[var(--color-navy-950,#0a2036)]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <span class="material-symbols-rounded">logout</span>
          </div>
          <div>
            <h2 id="modal-logout-title" class="text-lg font-bold font-display text-[#0C3161]">
              Konfirmasi Keluar Sesi
            </h2>
            <p class="text-xs text-slate-500">
              Admin CRM School Smart Digital
            </p>
          </div>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed">
          Apakah Anda yakin ingin mengakhiri sesi administrator
          <strong class="text-[#0C3161]">{{ userName || 'Admin' }}</strong>? Anda perlu masuk kembali untuk mengakses data prospek.
        </p>

        <div class="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
            @click="emit('close')"
          >
            Batal
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition"
            @click="emit('confirmLogout')"
          >
            Ya, Keluar Sesi
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>


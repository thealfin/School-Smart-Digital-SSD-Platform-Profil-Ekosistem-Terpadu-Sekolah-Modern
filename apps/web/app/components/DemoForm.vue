<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
    <!-- Left Column: 11-Field Lead Intake Form -->
    <div class="lg:col-span-7 bg-surface rounded-3xl border border-navy-100/80 p-6 sm:p-10 shadow-card reveal-left">
      <div class="mb-8">
        <h3 class="text-2xl sm:text-3xl font-display font-bold text-navy-900 tracking-tight">
          Jadwalkan Demo & Konsultasi
        </h3>
        <p class="mt-2 text-sm sm:text-base text-navy-700 font-body">
          Isi profil singkat sekolah Anda. Tim konsultan kami akan menyiapkan simulasi data sesuai jenjang unit Anda.
        </p>
      </div>

      <!-- State 3: Success Confirmation Card -->
      <div
        v-if="formState === 'success'"
        class="rounded-2xl bg-cyan-50 border border-cyan-200 p-6 sm:p-8 text-center animate-fade-in"
      >
        <div class="w-14 h-14 rounded-full bg-cyan-500 text-navy-950 flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-rounded text-3xl">check_circle</span>
        </div>
        <h4 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-2">
          Permintaan Demo Terkirim!
        </h4>
        <p class="text-navy-700 font-body text-sm sm:text-base leading-relaxed mb-6">
          Terima kasih, <strong class="text-navy-950">{{ formData.name }}</strong>. Tim konsultan kami akan menghubungi Anda melalui WhatsApp di nomor <strong class="text-navy-950 font-mono">{{ formData.whatsapp }}</strong> untuk mengonfirmasi jadwal demo <strong class="text-navy-950">{{ formData.organization }}</strong>.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            :href="dynamicWaUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900"
          >
            <WhatsAppIcon class="w-4 h-4 text-cyan-400" />
            <span>Buka WhatsApp Langsung</span>
            <span class="material-symbols-rounded text-base" aria-hidden="true">arrow_forward</span>
          </a>
          <button
            type="button"
            class="w-full sm:w-auto px-5 py-3 rounded-xl border border-navy-200 text-navy-700 hover:bg-white text-sm font-medium transition-colors cursor-pointer"
            @click="resetForm"
          >
            Kirim Permintaan Lain
          </button>
        </div>
      </div>

      <!-- State 4: Rate-Limited Friendly Notice -->
      <div
        v-else-if="formState === 'rate-limited'"
        class="rounded-2xl bg-amber-50 border border-amber-200 p-6 sm:p-8 text-center"
      >
        <div class="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-rounded text-3xl">schedule</span>
        </div>
        <h4 class="text-xl font-display font-bold text-navy-900 mb-2">
          Pengiriman Dibatasi Sementara
        </h4>
        <p class="text-navy-700 font-body text-sm leading-relaxed mb-6">
          Anda sudah mengirim beberapa permintaan dalam waktu singkat. Demi kenyamanan Anda, silakan hubungi tim kami langsung melalui WhatsApp untuk respon instan.
        </p>
        <a
          :href="dynamicWaUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900"
        >
          <WhatsAppIcon class="w-4 h-4 text-cyan-400" />
          <span>Chat via WhatsApp Sekarang</span>
          <span class="material-symbols-rounded text-base" aria-hidden="true">arrow_forward</span>
        </a>
      </div>

      <!-- Form Mode (Idle, Submitting, Error) -->
      <form
        v-else
        action="/api/leads"
        method="POST"
        novalidate
        :aria-busy="formState === 'submitting'"
        @submit.prevent="handleSubmit"
      >
        <!-- State 5: Top Error Summary Banner -->
        <div
          v-if="errorMessageSummary"
          role="alert"
          class="rounded-xl bg-red-50 border border-red-200 p-4 mb-6 text-red-900 text-sm flex items-start gap-3"
        >
          <span class="material-symbols-rounded text-red-600 text-xl flex-shrink-0">info</span>
          <div>
            <p class="font-semibold mb-1">Mohon lengkapi formulir dengan benar:</p>
            <p class="text-red-700 text-xs sm:text-sm">{{ errorMessageSummary }}</p>
          </div>
        </div>

        <div class="space-y-5">
          <!-- Row 1: Nama & Jabatan -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- 1. Nama Lengkap (Required) -->
            <div>
              <label for="lead-name" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Nama Lengkap <span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="lead-name"
                v-model="formData.name"
                name="name"
                type="text"
                required
                autocomplete="name"
                placeholder="cth. Dr. H. Mulyono"
                :class="inputClass('name')"
                :aria-invalid="!!fieldErrors.name"
                :aria-describedby="fieldErrors.name ? 'lead-name-error' : undefined"
                @blur="validateField('name')"
              >
              <p v-if="fieldErrors.name" id="lead-name-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.name }}
              </p>
            </div>

            <!-- 2. Jabatan (Optional) -->
            <div>
              <label for="lead-role" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Jabatan / Peran
              </label>
              <input
                id="lead-role"
                v-model="formData.roleTitle"
                name="roleTitle"
                type="text"
                autocomplete="organization-title"
                placeholder="cth. Ketua Yayasan / Kepala Sekolah"
                :class="inputClass('roleTitle')"
              >
            </div>
          </div>

          <!-- Row 2: Lembaga & Jenis Lembaga -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- 3. Nama Sekolah / Yayasan (Required) -->
            <div>
              <label for="lead-org" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Nama Sekolah / Yayasan <span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="lead-org"
                v-model="formData.organization"
                name="organization"
                type="text"
                required
                autocomplete="organization"
                placeholder="cth. Yayasan Insan Cita Mandiri"
                :class="inputClass('organization')"
                :aria-invalid="!!fieldErrors.organization"
                :aria-describedby="fieldErrors.organization ? 'lead-org-error' : undefined"
                @blur="validateField('organization')"
              >
              <p v-if="fieldErrors.organization" id="lead-org-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.organization }}
              </p>
            </div>

            <!-- 4. Jenis Lembaga (Required Select) -->
            <div>
              <label for="lead-org-type" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Jenis Lembaga <span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="lead-org-type"
                v-model="formData.orgType"
                name="orgType"
                required
                :class="inputClass('orgType')"
                :aria-invalid="!!fieldErrors.orgType"
                :aria-describedby="fieldErrors.orgType ? 'lead-org-type-error' : undefined"
                @blur="validateField('orgType')"
              >
                <option value="sekolah">Sekolah Formal (TK · SD/MI · SMP/MTS · SMA/SMK/MA)</option>
                <option value="yayasan">Yayasan Multi-Unit (TK · SD/MI · SMP/MTS · SMA/SMK/MA · Ekstrakulikuler · Boarding School/Asrama)</option>
                <option value="pondok">Boarding School / Asrama</option>
                <option value="tpq">Ekstrakulikuler / Pengembangan Bakat</option>
                <option value="lainnya">Lainnya</option>
              </select>
              <p v-if="fieldErrors.orgType" id="lead-org-type-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.orgType }}
              </p>
            </div>
          </div>

          <!-- Row 3: Siswa & Unit Count -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- 5. Perkiraan Jumlah Siswa -->
            <div>
              <label for="lead-students" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Perkiraan Jumlah Siswa
              </label>
              <select
                id="lead-students"
                v-model="formData.studentCountRange"
                name="studentCountRange"
                :class="inputClass('studentCountRange')"
              >
                <option value="">Pilih perkiraan siswa (opsional)</option>
                <option value="<100">&lt; 100 siswa</option>
                <option value="100-300">100 – 300 siswa</option>
                <option value="301-700">301 – 700 siswa</option>
                <option value="701-1500">701 – 1500 siswa</option>
                <option value=">1500">&gt; 1500 siswa</option>
              </select>
            </div>

            <!-- 6. Jumlah Unit -->
            <div>
              <label for="lead-units" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Jumlah Unit Pendidikan (1–50)
              </label>
              <input
                id="lead-units"
                v-model.number="formData.unitCount"
                name="unitCount"
                type="number"
                min="1"
                max="50"
                placeholder="cth. 3 (TK, SD/MI, SMP/MTS, Boarding School/Asrama)"
                :class="inputClass('unitCount')"
                :aria-invalid="!!fieldErrors.unitCount"
                :aria-describedby="fieldErrors.unitCount ? 'lead-units-error' : undefined"
                @blur="validateField('unitCount')"
              >
              <p v-if="fieldErrors.unitCount" id="lead-units-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.unitCount }}
              </p>
            </div>
          </div>

          <!-- Row 4: WhatsApp & Email -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- 7. WhatsApp (Required) -->
            <div>
              <label for="lead-wa" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp <span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="lead-wa"
                v-model="formData.whatsapp"
                name="whatsapp"
                type="tel"
                required
                autocomplete="tel"
                placeholder="cth. 081234567890"
                :class="inputClass('whatsapp')"
                :aria-invalid="!!fieldErrors.whatsapp"
                :aria-describedby="fieldErrors.whatsapp ? 'lead-wa-error' : undefined"
                @blur="validateField('whatsapp')"
              >
              <p v-if="fieldErrors.whatsapp" id="lead-wa-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.whatsapp }}
              </p>
            </div>

            <!-- 8. Email (Optional) -->
            <div>
              <label for="lead-email" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <input
                id="lead-email"
                v-model="formData.email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="cth. yayasan@insancita.sch.id"
                :class="inputClass('email')"
                :aria-invalid="!!fieldErrors.email"
                :aria-describedby="fieldErrors.email ? 'lead-email-error' : undefined"
                @blur="validateField('email')"
              >
              <p v-if="fieldErrors.email" id="lead-email-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.email }}
              </p>
            </div>
          </div>

          <!-- 9. Minat Aplikasi (Multi-checkbox / Chips) -->
          <div>
            <label class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-2">
              Modul / Aplikasi yang Ingin Diprioritaskan (Pilih Sesuai Kebutuhan)
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label
                v-for="app in availableApps"
                :key="app.slug"
                class="flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors select-none"
                :class="[
                  formData.interests.includes(app.slug)
                    ? 'bg-cyan-50 border-cyan-400 text-navy-950 font-semibold'
                    : 'bg-surface border-navy-100 text-navy-700 hover:bg-paper-warm/50'
                ]"
              >
                <input
                  v-model="formData.interests"
                  type="checkbox"
                  :value="app.slug"
                  class="rounded text-cyan-600 focus:ring-navy-900 border-navy-300"
                >
                <span class="truncate">{{ app.name }}</span>
              </label>
            </div>
          </div>

          <!-- 10. Catatan Khusus / Pesan -->
          <div>
            <label for="lead-msg" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
              Kebutuhan Khusus / Pertanyaan Awal
            </label>
            <textarea
              id="lead-msg"
              v-model="formData.message"
              name="message"
              rows="3"
              maxlength="1000"
              placeholder="Ceritakan kendala operasional yang paling mendesak di sekolah Anda saat ini..."
              :class="inputClass('message')"
            />
          </div>

          <!-- 11. Persetujuan Syarat & Kebijakan Privasi (Required Checkbox) -->
          <div class="pt-2">
            <label class="flex items-start gap-3 cursor-pointer select-none">
              <input
                id="lead-consent"
                v-model="formData.consent"
                name="consent"
                type="checkbox"
                required
                class="mt-1 rounded text-cyan-600 focus:ring-navy-900 border-navy-300 h-4 w-4"
                :aria-invalid="!!fieldErrors.consent"
                :aria-describedby="fieldErrors.consent ? 'lead-consent-error' : undefined"
              >
              <span class="text-xs text-navy-700 font-body leading-relaxed">
                Saya menyetujui
                <NuxtLink to="/privacy-policy" target="_blank" class="text-cyan-700 font-semibold underline hover:text-navy-900">
                  Kebijakan Privasi
                </NuxtLink>
                dan memberikan izin kepada tim School Smart Digital untuk menghubungi saya via WhatsApp/Telepon untuk keperluan demo.
                <span class="text-red-500" aria-hidden="true">*</span>
              </span>
            </label>
            <p v-if="fieldErrors.consent" id="lead-consent-error" class="mt-1 text-xs text-red-600">
              {{ fieldErrors.consent }}
            </p>
          </div>

          <!-- 12. Honeypot Field (Offscreen & Hidden from Real Users) -->
          <div aria-hidden="true" style="position: absolute; opacity: 0; pointer-events: none;" tabindex="-1">
            <label for="lead-website">Jangan isi kolom ini jika Anda manusia</label>
            <input
              id="lead-website"
              v-model="formData.website"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
            >
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="formState === 'submitting'"
              class="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:bg-navy-700 text-white font-display font-semibold text-base transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer"
            >
              <span v-if="formState === 'submitting'" class="inline-flex items-center gap-2">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Mengirim Permintaan...</span>
              </span>
              <span v-else class="inline-flex items-center gap-2">
                <span>Kirim Permintaan Demo</span>
                <span class="material-symbols-rounded text-lg" aria-hidden="true">arrow_forward</span>
              </span>
            </button>
            <p class="mt-3 text-center text-xs text-navy-700/70 font-mono">
              Tanpa komitmen pembelian • Privasi terjaga • Pendampingan langsung
            </p>
          </div>
        </div>
      </form>
    </div>

    <!-- Right Column: Merged WhatsApp Direct & Office Hotline, Demo Guarantee, Integrity Guarantee -->
    <div class="lg:col-span-5 space-y-6 reveal-right">
      <!-- 1. Top Card: Merged Direct WhatsApp Channel & Kantor Operasional / Hotline -->
      <div class="rounded-3xl bg-gradient-to-br from-navy-950 to-navy-900 text-white p-6 sm:p-8 shadow-card border border-navy-800">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-medium border border-cyan-400/30 mb-4">
          <WhatsAppIcon class="w-3.5 h-3.5 text-cyan-400" />
          <span>RESPON LEBIH CEPAT &amp; HOTLINE RESMI</span>
        </div>
        <h4 class="text-xl sm:text-2xl font-display font-bold text-white mb-2">
          Ingin Diskusi Langsung?
        </h4>
        <p class="text-sm text-navy-100/85 font-body leading-relaxed mb-5">
          Jika yayasan Anda sedang merencanakan anggaran tahun ajaran baru atau ingin konsultasi cepat via pesan, langsung hubungi kantor operasional dan konsultan kami.
        </p>

        <!-- Kantor Operasional & Hotline Details -->
        <div class="rounded-2xl bg-white/5 border border-white/10 p-4 mb-6 space-y-3.5 text-xs font-body">
          <div class="text-xs font-bold text-cyan-300 font-display uppercase tracking-wider border-b border-white/10 pb-2">
            Kantor Operasional &amp; Hotline
          </div>

          <div class="flex items-start gap-3">
            <span class="material-symbols-rounded text-cyan-400 text-lg mt-0.5 shrink-0">location_on</span>
            <div>
              <strong class="block text-white font-semibold mb-0.5">PT Digital Teknologi Perkasa:</strong>
              <p class="text-navy-100/80 leading-relaxed">
                Perum Graha Madu Pesona Blok C No.31, Bandar Lampung, Lampung, Indonesia
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <WhatsAppIcon class="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <strong class="block text-white font-semibold mb-0.5">WhatsApp Konsultan Resmi:</strong>
              <a
                :href="dynamicWaUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-cyan-400 hover:text-cyan-300 font-medium font-mono"
              >
                +62 858-3984-5284
              </a>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="material-symbols-rounded text-cyan-400 text-lg mt-0.5 shrink-0">mail</span>
            <div>
              <strong class="block text-white font-semibold mb-0.5">Email Korespondensi:</strong>
              <a
                href="mailto:halo@schoolsmartdigital.com"
                class="text-cyan-400 hover:text-cyan-300 font-medium break-all"
              >
                halo@schoolsmartdigital.com
              </a>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="material-symbols-rounded text-cyan-400 text-lg mt-0.5 shrink-0">schedule</span>
            <div>
              <strong class="block text-white font-semibold mb-0.5">Jam Kerja Support:</strong>
              <p class="text-navy-100/80 font-mono text-[11px]">
                Senin - Jumat: 08.00 - 17.00 WIB
              </p>
            </div>
          </div>
        </div>

        <a
          :href="dynamicWaUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-md"
          @click="trackWaClick"
        >
          <WhatsAppIcon class="w-4 h-4 text-navy-950" />
          <span>Chat via WhatsApp Sekarang</span>
        </a>
      </div>

      <!-- 2. Middle Card: Jaminan Layanan Demo -->
      <div class="rounded-3xl bg-surface border border-navy-100/80 p-6 sm:p-8 shadow-xs">
        <h5 class="text-base font-display font-bold text-navy-900 mb-4 flex items-center gap-2">
          <span class="material-symbols-rounded text-cyan-700">verified_user</span>
          <span>Jaminan Layanan Demo</span>
        </h5>
        <ul class="space-y-3 text-xs sm:text-sm text-navy-700 font-body">
          <li class="flex items-start gap-2.5">
            <span class="material-symbols-rounded text-emerald-600 text-base flex-shrink-0 mt-0.5">check_circle</span>
            <span>Simulasi langsung dengan skenario nyata unit sekolah Anda.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <span class="material-symbols-rounded text-emerald-600 text-base flex-shrink-0 mt-0.5">check_circle</span>
            <span>Uji coba alur pos gerbang, TV monitoring, dan laporan bendahara.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <span class="material-symbols-rounded text-emerald-600 text-base flex-shrink-0 mt-0.5">check_circle</span>
            <span>Perhitungan proposal biaya transparan tanpa biaya tersembunyi.</span>
          </li>
        </ul>
      </div>

      <!-- 3. Bottom Card: Jaminan Integritas -->
      <div class="rounded-3xl bg-navy-900 text-white p-6 sm:p-8 border border-navy-800 shadow-md">
        <span class="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">JAMINAN INTEGRITAS</span>
        <h4 class="text-base font-bold font-display mb-2">Perlindungan Kerahasiaan Data Sekolah</h4>
        <p class="text-xs text-navy-100 font-body leading-relaxed">
          Seluruh data konsultasi dan identitas sekolah dijaga ketat sesuai UU Perlindungan Data Pribadi (UU PDP). Tidak ada data yang dibagikan ke pihak ketiga tanpa izin tertulis.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { leadInputSchema, apps as defaultApps, settings as defaultSettings, type AppItem } from '@ssd/shared'

const props = withDefaults(
  defineProps<{
    settings?: Record<string, any>
    apps?: AppItem[]
  }>(),
  {
    settings: () => defaultSettings,
    apps: () => defaultApps,
  }
)

const availableApps = computed(() => {
  return (props.apps || defaultApps).slice(0, 12)
})

type FormState = 'idle' | 'submitting' | 'success' | 'rate-limited' | 'error'

const formState = ref<FormState>('idle')
const errorMessageSummary = ref<string | null>(null)
const fieldErrors = reactive<Record<string, string>>({})

const formData = reactive({
  name: '',
  roleTitle: '',
  organization: '',
  orgType: 'sekolah' as 'sekolah' | 'yayasan' | 'tpq' | 'pondok' | 'lainnya',
  studentCountRange: '' as '' | '<100' | '100-300' | '301-700' | '701-1500' | '>1500',
  unitCount: undefined as number | undefined,
  whatsapp: '',
  email: '',
  interests: [] as string[],
  message: '',
  consent: false,
  website: '', // honeypot
})

function inputClass(fieldName: string) {
  const base =
    'w-full px-4 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface placeholder:text-navy-700/40 focus:outline-none focus:ring-2 transition-colors'
  if (fieldErrors[fieldName]) {
    return `${base} border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50/20`
  }
  return `${base} border-navy-200 focus:ring-navy-900 focus:border-navy-900`
}

function validateField(fieldName: keyof typeof formData) {
  const shape = leadInputSchema.shape[fieldName as keyof typeof leadInputSchema.shape]
  if (!shape) return
  let val: unknown = formData[fieldName]
  if (fieldName === 'studentCountRange' && val === '') val = undefined
  if (fieldName === 'unitCount' && (!val || val === 0)) val = undefined
  const result = shape.safeParse(val)
  if (!result.success) {
    fieldErrors[fieldName] = result.error.issues[0]?.message || 'Input tidak valid'
  } else {
    delete fieldErrors[fieldName]
  }
}

const dynamicWaUrl = computed(() => {
  const phone = props.settings?.contact?.whatsapp || '6285839845284'
  const name = formData.name.trim() || 'Pimpinan'
  const org = formData.organization.trim() || 'Sekolah/Yayasan'
  const text = `Halo School Smart Digital, saya ${name} dari ${org}. Saya ingin konsultasi demo sistem operasi sekolah.\n\n(sumber: website_form_cta)`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
})

function trackWaClick() {
  if (import.meta.client) {
    const payload = JSON.stringify({
      eventName: 'cta_whatsapp',
      pagePath: window.location.pathname,
      props: { orgType: formData.orgType, source: 'side_panel' },
    })
    if (!navigator.sendBeacon?.('/api/track', new Blob([payload], { type: 'application/json' }))) {
      $fetch('/api/track', { method: 'POST', body: JSON.parse(payload) }).catch(() => {})
    }
  }
}

async function handleSubmit() {
  // Clear past error states
  errorMessageSummary.value = null
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])

  // Run full Zod schema validation
  const validationResult = leadInputSchema.safeParse({
    name: formData.name,
    roleTitle: formData.roleTitle,
    organization: formData.organization,
    orgType: formData.orgType,
    studentCountRange: formData.studentCountRange || undefined,
    unitCount: formData.unitCount ? Number(formData.unitCount) : undefined,
    whatsapp: formData.whatsapp,
    email: formData.email,
    interests: formData.interests,
    message: formData.message,
    consent: formData.consent,
    website: formData.website,
    source: 'landing_closing_form',
  })

  if (!validationResult.success) {
    formState.value = 'error'
    for (const issue of validationResult.error.issues) {
      const field = issue.path[0] as string
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message
      }
    }
    errorMessageSummary.value = validationResult.error.issues[0]?.message || 'Periksa kembali data formulir Anda.'
    return
  }

  // Honeypot check: if filled, absorb silently without server error
  if (formData.website && formData.website.trim().length > 0) {
    formState.value = 'success'
    return
  }

  formState.value = 'submitting'

  try {
    const res = await $fetch<{ ok: boolean; id?: string }>('/api/leads', {
      method: 'POST',
      body: validationResult.data,
    })

    if (res.ok) {
      formState.value = 'success'
      // First-party telemetry
      if (import.meta.client) {
        const payload = JSON.stringify({
          eventName: 'lead_submit',
          pagePath: window.location.pathname,
          props: { orgType: formData.orgType, units: formData.unitCount },
        })
        if (!navigator.sendBeacon?.('/api/track', new Blob([payload], { type: 'application/json' }))) {
          $fetch('/api/track', { method: 'POST', body: JSON.parse(payload) }).catch(() => {})
        }
      }
    }
  } catch (err: any) {
    if (err.statusCode === 429) {
      formState.value = 'rate-limited'
    } else {
      formState.value = 'error'
      errorMessageSummary.value =
        err?.data?.message || 'Maaf, terjadi kendala saat mengirim formulir. Silakan coba lagi atau hubungi via WhatsApp.'
    }
  }
}

function resetForm() {
  formData.name = ''
  formData.roleTitle = ''
  formData.organization = ''
  formData.orgType = 'sekolah'
  formData.studentCountRange = ''
  formData.unitCount = undefined
  formData.whatsapp = ''
  formData.email = ''
  formData.interests = []
  formData.message = ''
  formData.consent = false
  formData.website = ''
  formState.value = 'idle'
  errorMessageSummary.value = null
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
}
</script>

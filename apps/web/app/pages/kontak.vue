<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { fallbackContent, type LandingContent } from '@ssd/shared'

useHead({
  title: 'Hubungi Kami & Jadwalkan Konsultasi — School Smart Digital',
  meta: [
    {
      name: 'description',
      content: 'Jadwalkan demo sistem operasi terpadu School Smart Digital atau hubungi konsultan kami untuk pertanyaan, penawaran harga, dan bimbingan teknis.',
    },
  ],
})

const { data: contentData } = await useAsyncData<LandingContent>(
  'contact-content',
  () => $fetch<LandingContent>('/api/content'),
  {
    default: () => fallbackContent,
  }
)
const content = computed<LandingContent>(() => contentData.value || fallbackContent)

// Form Feedback / Pertanyaan Umum
const feedbackForm = reactive({
  senderName: '',
  senderEmail: '',
  senderPhone: '',
  subject: '',
  message: '',
})

const isSubmittingFeedback = ref(false)
const isFeedbackSuccess = ref(false)
const feedbackError = ref('')

async function handleFeedbackSubmit() {
  feedbackError.value = ''
  if (!feedbackForm.senderName || !feedbackForm.senderEmail || !feedbackForm.message) {
    feedbackError.value = 'Nama, email, dan pesan wajib diisi.'
    return
  }

  isSubmittingFeedback.value = true
  try {
    await $fetch('/api/feedback', {
      method: 'POST',
      body: feedbackForm,
    })
    isFeedbackSuccess.value = true
    feedbackForm.senderName = ''
    feedbackForm.senderEmail = ''
    feedbackForm.senderPhone = ''
    feedbackForm.subject = ''
    feedbackForm.message = ''
  } catch (err: any) {
    feedbackError.value = err?.data?.message || 'Gagal mengirim pesan. Silakan coba beberapa saat lagi.'
  } finally {
    isSubmittingFeedback.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <SiteHeader mode="subpage" />

    <main class="pt-28 pb-20 space-y-20">
      <!-- Section 1: Form Jadwalkan Demo & Konsultasi (Main Focus) -->
      <section id="demo" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-10 reveal">
          <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 text-cyan-800 mb-3">
            KONSULTASI & DEMO SISTEM
          </span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight font-display mb-3">
            Jadwalkan Konsultasi <br class="hidden sm:inline" />
            <span class="text-cyan-600">School Smart Digital</span>
          </h1>
          <p class="text-base text-slate-600 font-body">
            Pilih tanggal dan modul yang ingin disimulasikan. Tim konsultan PT Digital Teknologi Perkasa siap memberikan demo daring maupun tatap muka langsung di sekolah Anda.
          </p>
        </div>

        <!-- 11-Field Demo Form Component -->
        <DemoForm
          :settings="content.settings"
          :apps="content.apps"
        />
      </section>

      <!-- Section 2: Pertanyaan Umum & Informasi Kantor -->
      <section id="inquiry" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200">
        <div class="text-center max-w-2xl mx-auto mb-12 reveal">
          <span class="text-xs font-mono font-semibold text-cyan-700 uppercase tracking-widest block mb-1">
            PERTANYAAN LAINNYA
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display">
            Hubungi Kantor & Tim Support
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 font-body mt-2">
            Punya pertanyaan mengenai kerjasama vendor hardware, pengadaan smart turnstile gate, atau pengaduan layanan? Silakan sampaikan melalui formulir berikut.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <!-- Left Column: Feedback Form -->
          <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs reveal-left">
            <h3 class="text-lg font-bold text-navy-900 font-display mb-1">Formulir Pesan Masuk</h3>
            <p class="text-xs text-slate-500 mb-6 font-body">
              Pesan ini diteruskan langsung ke kotak masuk admin back-office kami.
            </p>

            <div v-if="isFeedbackSuccess" class="rounded-xl bg-emerald-50 border border-emerald-200 p-4 mb-6 flex items-center gap-3">
              <span class="material-symbols-rounded text-emerald-600 text-xl">check_circle</span>
              <p class="text-xs font-medium text-emerald-800">
                Pesan Anda berhasil dikirim! Tim kami akan menindaklanjuti dalam waktu 1x24 jam kerja.
              </p>
            </div>

            <div v-if="feedbackError" class="rounded-xl bg-red-50 border border-red-200 p-4 mb-6 flex items-center gap-3">
              <span class="material-symbols-rounded text-red-600 text-xl">error</span>
              <p class="text-xs font-medium text-red-800">
                {{ feedbackError }}
              </p>
            </div>

            <form @submit.prevent="handleFeedbackSubmit" class="space-y-4 text-xs font-body">
              <div>
                <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Nama Lengkap *
                </label>
                <input
                  v-model="feedbackForm.senderName"
                  type="text"
                  required
                  placeholder="Contoh: Drs. H. Ahmad Fauzi, M.Pd"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                    Email Resmi *
                  </label>
                  <input
                    v-model="feedbackForm.senderEmail"
                    type="email"
                    required
                    placeholder="nama@sekolah.sch.id"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    v-model="feedbackForm.senderPhone"
                    type="tel"
                    placeholder="081234567890"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Subjek Pertanyaan
                </label>
                <input
                  v-model="feedbackForm.subject"
                  type="text"
                  placeholder="Misal: Penawaran Smart Gate QR Code untuk 500 Siswa"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label class="block font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Pesan atau Kebutuhan *
                </label>
                <textarea
                  v-model="feedbackForm.message"
                  required
                  rows="4"
                  placeholder="Tuliskan pesan pertanyaan Anda..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                :disabled="isSubmittingFeedback"
                class="w-full py-3 px-6 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
              >
                <span v-if="isSubmittingFeedback" class="material-symbols-rounded animate-spin text-base">progress_activity</span>
                <span>{{ isSubmittingFeedback ? 'Mengirim...' : 'Kirim Pesan Pertanyaan' }}</span>
              </button>
            </form>
          </div>

          <!-- Right Column: Office & Hotline Contacts -->
          <div class="lg:col-span-5 space-y-6 reveal-right">
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
              <h3 class="text-base font-bold text-navy-900 font-display">Kontor Operasional & Hotline</h3>

              <div class="space-y-4 text-xs font-body">
                <div class="flex items-start gap-3">
                  <span class="material-symbols-rounded text-cyan-600 text-lg mt-0.5">location_on</span>
                  <div>
                    <strong class="block text-slate-900 font-semibold mb-0.5">PT Digital Teknologi Perkasa:</strong>
                    <p class="text-slate-600 leading-relaxed">
                      Bandar Lampung, Lampung, Indonesia
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <span class="material-symbols-rounded text-cyan-600 text-lg mt-0.5">chat</span>
                  <div>
                    <strong class="block text-slate-900 font-semibold mb-0.5">WhatsApp Konsultan Resmi:</strong>
                    <a
                      href="https://wa.me/6285839845284?text=Halo%20School%20Smart%20Digital,%20saya%20ingin%20berkonsultasi"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-cyan-600 hover:text-cyan-700 font-medium font-mono"
                    >
                      +62 858-3984-5284
                    </a>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <span class="material-symbols-rounded text-cyan-600 text-lg mt-0.5">mail</span>
                  <div>
                    <strong class="block text-slate-900 font-semibold mb-0.5">Email Korespondensi:</strong>
                    <a
                      href="mailto:halo@schoolsmartdigital.com"
                      class="text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      halo@schoolsmartdigital.com
                    </a>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <span class="material-symbols-rounded text-cyan-600 text-lg mt-0.5">schedule</span>
                  <div>
                    <strong class="block text-slate-900 font-semibold mb-0.5">Jam Kerja Support:</strong>
                    <p class="text-slate-600 font-mono text-[11px]">
                      Senin – Jumat: 08.00 – 17.00 WIB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-3xl bg-navy-900 text-white p-6 sm:p-8 border border-navy-800 shadow-md">
              <span class="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">JAMINAN INTEGRITAS</span>
              <h4 class="text-base font-bold font-display mb-2">Perlindungan Kerahasiaan Data Sekolah</h4>
              <p class="text-xs text-navy-100 font-body leading-relaxed">
                Seluruh data konsultasi dan identitas sekolah dijaga ketat sesuai UU Perlindungan Data Pribadi (UU PDP). Tidak ada data yang dibagikan ke pihak ketiga tanpa izin tertulis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

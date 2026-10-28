<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { fallbackContent, type LandingContent } from '@ssd/shared'

useSeoMeta({
  title: 'Jadwalkan Demo & Hubungi Kami || School Smart Digital ||',
  description: 'Jadwalkan demo SSD daring atau di sekolah Anda, atau hubungi konsultan kami untuk pertanyaan dan estimasi biaya.',
  ogTitle: 'Jadwalkan Demo & Hubungi Kami || School Smart Digital ||',
  ogDescription: 'Jadwalkan demo SSD daring atau di sekolah Anda, atau hubungi konsultan kami untuk pertanyaan dan estimasi biaya.',
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

          <!-- Right Column: Jam Layanan & Kantor SSD + Google Maps (Vertical Composition) -->
          <div class="lg:col-span-5 reveal-right">
            <div class="rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between gap-6 h-full">
              <!-- Ambient Cyan Glow -->
              <div class="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

              <!-- Top Part: Redaksi Jam Layanan & Kantor SSD -->
              <div class="space-y-5 relative z-10">
                <div>
                  <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">
                    OPERASIONAL &amp; KANTOR PUSAT
                  </span>
                  <h3 class="text-2xl font-extrabold font-display text-white tracking-tight">
                    Jam Layanan &amp; Kantor SSD
                  </h3>
                  <p class="text-xs sm:text-sm text-navy-100/80 mt-2 font-body leading-relaxed">
                    Tim konsultan dan teknisi School Smart Digital siap melayani konsultasi implementasi, demonstrasi sistem, serta koordinasi bimbingan teknis sekolah.
                  </p>
                </div>

                <!-- Box Jam Kerja -->
                <div class="rounded-2xl bg-navy-900/90 border border-cyan-400/30 p-4 sm:p-5 space-y-2.5 shadow-inner">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <span class="material-symbols-rounded text-xl" aria-hidden="true">schedule</span>
                    </div>
                    <div>
                      <p class="text-[11px] font-mono uppercase tracking-wider text-cyan-300">WAKTU OPERASIONAL</p>
                      <p class="text-sm sm:text-base font-bold text-white font-display">Senin - Jumat: 09.00 - 16.00 WIB</p>
                    </div>
                  </div>
                  <p class="text-xs text-navy-200/70 border-t border-navy-800 pt-2">
                    Sabtu, Minggu &amp; Libur Nasional: Tutup
                  </p>
                </div>

                <!-- Alamat Fisik -->
                <div class="flex items-start gap-3 text-xs sm:text-sm text-navy-100/90">
                  <span class="material-symbols-rounded text-cyan-400 text-xl shrink-0 mt-0.5" aria-hidden="true">location_on</span>
                  <span class="leading-relaxed">Perum Graha Madu Pesona Blok C No.31, Bandar Lampung</span>
                </div>

                <!-- Quick Buttons -->
                <div class="flex flex-wrap gap-3 pt-1">
                  <a
                    href="https://www.google.com/maps?ll=-5.361284,105.270792&amp;z=15&amp;t=m&amp;hl=id&amp;gl=US&amp;mapclient=embed&amp;q=Perum+Graha+Madu+Pesona+Bandar+Lampung"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    <span>Buka Google Maps</span>
                  </a>
                  <a
                    href="https://wa.me/6285839845284?text=Halo%20tim%20SSD,%20saya%20ingin%20berkonsultasi%20mengenai%20School%20Smart%20Digital."
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-all"
                  >
                    <WhatsAppIcon class="w-4 h-4 text-cyan-400" />
                    <span>Hubungi WhatsApp</span>
                  </a>
                </div>
              </div>

              <!-- Bottom Part: Section Maps -->
              <div class="relative z-10 pt-1">
                <div class="rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl bg-navy-900 w-full h-[250px] sm:h-[280px]">
                  <iframe
                    src="https://maps.google.com/maps?q=Perum+Graha+Madu+Pesona+Bandar+Lampung&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                    width="100%"
                    height="100%"
                    style="border:0;"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    class="w-full h-full object-cover"
                    title="Peta Lokasi Kantor School Smart Digital"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

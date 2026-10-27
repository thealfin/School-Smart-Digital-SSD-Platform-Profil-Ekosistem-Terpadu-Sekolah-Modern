<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

export interface SpotlightTabItem {
  id: 'bk' | 'raport' | 'security'
  number: string
  name: string
  tagline: string
  mascotName?: string | null
  stampText: string
  heading: string
  description: string
  cardTitle: string
  cardSubtitle: string
}

const props = withDefaults(defineProps<{
  initialTab?: 'bk' | 'raport' | 'security'
}>(), {
  initialTab: 'bk',
})

const tabs: SpotlightTabItem[] = [
  {
    id: 'bk',
    number: '',
    name: 'Bimbingan Konseling',
    tagline: 'Ruang konseling yang rapi',
    mascotName: 'Biku',
    stampText: 'RAHASIA / TERJAGA',
    heading: 'Pemisahan Mutlak Catatan Internal dan Ringkasan Orang Tua',
    description: 'Guru BK membutuhkan ruang aman untuk mendokumentasikan dinamika siswa tanpa khawatir diagnosa sensitif bocor ke papan informasi publik atau aplikasi orang tua.',
    cardTitle: 'Lembar Disposisi & Privasi BK',
    cardSubtitle: 'Protokol Kerahasiaan Sesi Bimbingan Siswa',
  },
  {
    id: 'raport',
    number: '',
    name: 'Raport Digital',
    tagline: 'HP-nya guru: absen, jurnal, nilai',
    mascotName: null,
    stampText: 'SEMESTER / 0–100',
    heading: 'Otomatisasi Nilai Akhir, Predikat Capaian, dan Catatan Wali Kelas',
    description: 'Guru mengisi nilai formatif dan sumatif secara langsung melalui ponsel. Sistem otomatis mengalkulasi predikat A, B, C, atau D serta menyusun lembar raport digital siap cetak.',
    cardTitle: 'Aturan Predikat Otomatis',
    cardSubtitle: 'Standar Penilaian Capaian Kompetensi Semester',
  },
  {
    id: 'security',
    number: '',
    name: 'Security Gate',
    tagline: 'Gerbang yang tahu siapa boleh keluar',
    mascotName: 'Gati',
    stampText: 'FASE 4 / QR HARIAN',
    heading: 'Validasi Izin Keluar dan Jam Serah Terima Santri di Pos Gerbang',
    description: 'Satpam memindai kartu santri untuk memastikan izin aktif sebelum membuka pintu gerbang. Integrasi QR penjemputan harian menjamin santri hanya dijemput oleh pihak yang sah.',
    cardTitle: 'Matriks Kontrol Penjemputan',
    cardSubtitle: 'Prosedur Verifikasi Izin Gerbang & Serah Terima',
  },
]

const activeTabId = ref<'bk' | 'raport' | 'security'>(props.initialTab)
const tabRefs = ref<HTMLElement[]>([])

const currentTab = computed(() => {
  return tabs.find(t => t.id === activeTabId.value) || tabs[0]
})

function selectTab(id: 'bk' | 'raport' | 'security') {
  activeTabId.value = id
}

function handleKeydown(event: KeyboardEvent, index: number) {
  let newIndex = index
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    newIndex = (index + 1) % tabs.length
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    newIndex = (index - 1 + tabs.length) % tabs.length
  } else if (event.key === 'Home') {
    event.preventDefault()
    newIndex = 0
  } else if (event.key === 'End') {
    event.preventDefault()
    newIndex = tabs.length - 1
  } else {
    return
  }

  const targetTab = tabs[newIndex]
  if (targetTab) {
    activeTabId.value = targetTab.id
    nextTick(() => {
      tabRefs.value[newIndex]?.focus()
    })
  }
}
</script>

<template>
  <section id="spotlight" class="py-20 md:py-28 bg-paper relative overflow-hidden" aria-labelledby="spotlight-heading">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="max-w-3xl mb-12 md:mb-16 reveal">
        <div class="flex items-center gap-2 mb-3">
          <span class="label-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-100">SOROTAN MODUL</span>
          <span class="text-xs text-navy-800 font-mono">DETAIL OPERASIONAL</span>
        </div>
        <h2 id="spotlight-heading" class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-950 tracking-tight leading-tight">
          Tiga alur krusial yang membutuhkan ketelitian tingkat tinggi.
        </h2>
        <p class="mt-4 text-base sm:text-lg text-navy-800 leading-relaxed">
          Bimbingan konseling, penilaian raport, dan keamanan gerbang sekolah bukan sekadar fitur administratif—ketiganya adalah benteng privasi, akurasi, dan keselamatan santri Anda.
        </p>
      </div>

      <!-- WAI-ARIA Tablist -->
      <div
        role="tablist"
        aria-label="Sorotan Modul Unggulan SSD"
        class="flex items-center gap-2 sm:gap-3 p-1.5 bg-navy-50/70 border border-border/80 rounded-2xl max-w-full overflow-x-auto no-scrollbar mb-10 reveal"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="tab.id"
          :ref="el => { if (el) tabRefs[index] = el as HTMLElement }"
          role="tab"
          :id="'tab-' + tab.id"
          :aria-controls="'panel-' + tab.id"
          :aria-selected="activeTabId === tab.id"
          :tabindex="activeTabId === tab.id ? 0 : -1"
          @click="selectTab(tab.id)"
          @keydown="handleKeydown($event, index)"
          class="flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-xl font-body font-semibold text-sm transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900"
          :class="activeTabId === tab.id
            ? 'bg-navy-900 text-white shadow-md'
            : 'text-navy-800 hover:text-navy-950 hover:bg-white/60'"
        >
          <span class="font-mono text-xs opacity-70">{{ tab.number }}</span>
          <span>{{ tab.name }}</span>
          <span
            v-if="tab.mascotName"
            class="text-[10px] font-mono px-1.5 py-0.5 rounded tracking-wide uppercase"
            :class="activeTabId === tab.id ? 'bg-cyan-500 text-navy-950 font-bold' : 'bg-navy-100 text-navy-800'"
          >
            {{ tab.mascotName }}
          </span>
        </button>
      </div>

      <!-- Tab Panels Container -->
      <div class="relative">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          v-show="activeTabId === tab.id"
          role="tabpanel"
          :id="'panel-' + tab.id"
          :aria-labelledby="'tab-' + tab.id"
          tabindex="0"
          class="focus-visible:outline-none"
        >
          <!-- Grid Layout: Stage & Tilted Paper Card -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            <!-- Left Column: Context & Mockup Stage (7 cols) -->
            <div class="lg:col-span-7 bg-white rounded-3xl border border-border p-6 sm:p-8 lg:p-10 shadow-card reveal-left">
              <div class="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-cyan-500"></span>
                  <span class="label-mono text-xs text-navy-700 uppercase">{{ tab.tagline }}</span>
                </div>
                <span class="text-xs font-mono text-navy-600 bg-paper-warm px-2 py-1 rounded border border-border/50">
                  Data Demo Terverifikasi
                </span>
              </div>

              <h3 class="text-2xl sm:text-3xl font-display font-bold text-navy-950 mb-4 leading-snug">
                {{ tab.heading }}
              </h3>
              <p class="text-navy-800 text-sm sm:text-base leading-relaxed mb-8">
                {{ tab.description }}
              </p>

              <!-- Interactive Mockup Stage: BK -->
              <div v-if="tab.id === 'bk'" class="space-y-4">
                <div class="p-4 bg-paper-warm rounded-2xl border border-border/70 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-semibold text-navy-700">PIPELINE RUJUKAN KASUS BK</span>
                    <span class="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">Prioritas Tinggi</span>
                  </div>
                  <div class="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div class="p-2 rounded bg-navy-100 text-navy-900 font-bold border border-navy-200">1. Baru</div>
                    <div class="p-2 rounded bg-cyan-100 text-cyan-900 font-bold border border-cyan-300">2. Proses</div>
                    <div class="p-2 rounded bg-white text-navy-600 border border-border">3. Sesi</div>
                    <div class="p-2 rounded bg-white text-navy-600 border border-border">4. Selesai</div>
                  </div>
                </div>

                <div class="p-4 bg-navy-50 rounded-2xl border border-border/70 text-xs text-navy-800 space-y-2">
                  <div class="flex justify-between font-mono text-navy-700">
                    <span>Konteks Siswa Otomatis:</span>
                    <span>30 Hari Terakhir</span>
                  </div>
                  <div class="flex gap-4">
                    <span class="font-semibold text-navy-950">• Presensi: 94% (Alpa 2x)</span>
                    <span class="font-semibold text-navy-950">• Poin Pelanggaran: 15 Poin</span>
                  </div>
                </div>
              </div>

              <!-- Interactive Mockup Stage: Raport -->
              <div v-if="tab.id === 'raport'" class="space-y-4">
                <div class="p-4 bg-paper-warm rounded-2xl border border-border/70 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-semibold text-navy-700">ALUR PENILAIAN CEPAT</span>
                    <span class="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">Kalkulasi Otomatis</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div class="p-2.5 rounded bg-white border border-border">
                      <span class="block text-navy-600 text-[10px]">Guru Mapel</span>
                      <strong class="text-navy-950">Input 0–100</strong>
                    </div>
                    <div class="p-2.5 rounded bg-cyan-100 border border-cyan-300">
                      <span class="block text-cyan-800 text-[10px]">Sistem SSD</span>
                      <strong class="text-cyan-950">Konversi A–D</strong>
                    </div>
                    <div class="p-2.5 rounded bg-white border border-border">
                      <span class="block text-navy-600 text-[10px]">Wali Kelas</span>
                      <strong class="text-navy-950">Catatan & Naik</strong>
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-navy-50 rounded-2xl border border-border/70 flex items-center justify-between text-xs">
                  <span class="text-navy-800">Capaian Kompetensi Terpilih: <strong>Matematika Wajib (Kelas X)</strong></span>
                  <span class="font-mono font-bold text-navy-900 bg-white px-2 py-1 rounded border border-border">Rerata: 87.5 (Predikat A)</span>
                </div>
              </div>

              <!-- Interactive Mockup Stage: Security Gate -->
              <div v-if="tab.id === 'security'" class="space-y-4">
                <div class="p-4 bg-paper-warm rounded-2xl border border-border/70 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-semibold text-navy-700">VALIDASI POS GERBANG SATPAM</span>
                    <span class="text-xs bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded font-medium">Kamera / Barcode</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div class="p-2 rounded bg-white border border-border">
                      <span class="block text-navy-600 text-[10px]">Scan Kartu QR</span>
                      <span class="text-navy-900 font-bold">Tap Santri</span>
                    </div>
                    <div class="p-2 rounded bg-emerald-100 border border-emerald-300">
                      <span class="block text-emerald-800 text-[10px]">Izin Aktif</span>
                      <span class="text-emerald-950 font-bold">Sah Keluar</span>
                    </div>
                    <div class="p-2 rounded bg-white border border-border">
                      <span class="block text-navy-600 text-[10px]">Wali Murid</span>
                      <span class="text-navy-900 font-bold">Notifikasi WA</span>
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span>Daftar Siswa Masih di Luar Kampus:</span>
                  <span class="font-mono font-bold text-amber-950 bg-white px-2 py-0.5 rounded border border-amber-300">3 Santri Terpantau</span>
                </div>
              </div>
            </div>

            <!-- Right Column: Tactile Tilted Paper Card (5 cols) -->
            <div class="lg:col-span-5 relative mt-8 lg:mt-0 reveal-right">
              <div
                class="card-tilted bg-[#F1F6FB] border border-[#D7E2EC] rounded-2xl p-6 sm:p-8 shadow-[0_30px_60px_rgba(10,32,54,0.18)] relative transition-transform duration-300 hover:rotate-0"
              >
                <!-- Circular Stamp in Corner -->
                <div class="absolute -top-3 right-2 sm:-top-4 sm:-right-4 stamp rotate-8 bg-white/95 shadow-md">
                  {{ tab.stampText }}
                </div>

                <!-- Card Header -->
                <div class="mb-6 pb-4 border-b border-navy-200/60">
                  <span class="label-mono text-[11px] text-navy-600 block mb-1">DOKUMEN OPERASIONAL RESMI</span>
                  <h4 class="font-display font-bold text-xl text-navy-950 leading-snug">
                    {{ tab.cardTitle }}
                  </h4>
                  <p class="text-xs text-navy-700 mt-1 font-mono">
                    {{ tab.cardSubtitle }}
                  </p>
                </div>

                <!-- Card Content: BK Confidentiality Matrix -->
                <div v-if="tab.id === 'bk'" class="space-y-4 text-xs">
                  <div class="p-3 bg-white/80 rounded-xl border border-border/80">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <strong class="text-navy-950">Yang Dilihat Wali Kelas:</strong>
                    </div>
                    <p class="text-navy-800 leading-relaxed">
                      Status rujukan (Baru / Diproses / Selesai), tanggal rujukan, dan konfirmasi tindak lanjut tanpa membuka rahasia pribadi siswa.
                    </p>
                  </div>

                  <div class="p-3 bg-navy-900 text-white rounded-xl shadow-inner">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <strong class="text-cyan-300">Hak Akses Khusus Guru BK:</strong>
                    </div>
                    <p class="text-navy-100 leading-relaxed">
                      Catatan konseling internal tertutup, kronologi kasus, diagnosa pribadi, dan rekam sesi tatap muka terenkripsi.
                    </p>
                  </div>

                  <div class="p-3 bg-white/80 rounded-xl border border-border/80">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                      <strong class="text-navy-950">Yang Diterima Orang Tua:</strong>
                    </div>
                    <p class="text-navy-800 leading-relaxed">
                      Hanya ringkasan resmi yang disetujui konselor. Catatan BK internal TIDAK PERNAH tampil di aplikasi Wali Murid maupun Command Center TV.
                    </p>
                  </div>
                </div>

                <!-- Card Content: Raport Grading Scale -->
                <div v-if="tab.id === 'raport'" class="space-y-4 text-xs">
                  <div class="p-3 bg-white/80 rounded-xl border border-border/80">
                    <div class="font-mono font-semibold text-navy-700 mb-2">TABEL KONVERSI NILAI AKHIR (0–100):</div>
                    <div class="grid grid-cols-2 gap-2 font-mono">
                      <div class="p-2 bg-emerald-50 text-emerald-900 rounded border border-emerald-200">
                        <strong>Predikat A:</strong> ≥ 85 (Sangat Baik)
                      </div>
                      <div class="p-2 bg-cyan-50 text-cyan-900 rounded border border-cyan-200">
                        <strong>Predikat B:</strong> 70 – 84 (Baik)
                      </div>
                      <div class="p-2 bg-amber-50 text-amber-900 rounded border border-amber-200">
                        <strong>Predikat C:</strong> 60 – 69 (Cukup)
                      </div>
                      <div class="p-2 bg-rose-50 text-rose-900 rounded border border-rose-200">
                        <strong>Predikat D:</strong> &lt; 60 (Perlu Bimbingan)
                      </div>
                    </div>
                  </div>

                  <div class="p-3 bg-white/80 rounded-xl border border-border/80 space-y-1">
                    <strong class="text-navy-950 block">Catatan & Keputusan Wali Kelas:</strong>
                    <p class="text-navy-800 leading-relaxed">
                      Wali kelas mengesahkan rekapitulasi kehadiran, catatan ekstrakurikuler, serta keputusan kenaikan kelas (Naik / Lulus) sebelum dicetak atau dibuka ke orang tua.
                    </p>
                  </div>
                </div>

                <!-- Card Content: Security Gate Pickup Matrix -->
                <div v-if="tab.id === 'security'" class="space-y-4 text-xs">
                  <div class="p-3 bg-white/80 rounded-xl border border-border/80">
                    <strong class="text-navy-950 block mb-1">Mode 1: Penyerahan Terbuka</strong>
                    <p class="text-navy-800 leading-relaxed">
                      Untuk santri yang dijemput langsung oleh orang tua di pos penjagaan; satpam mencatat jam kepulangan secara manual atau scan kartu fisik.
                    </p>
                  </div>

                  <div class="p-3 bg-white/80 rounded-xl border border-border/80">
                    <div class="flex items-center justify-between mb-1">
                      <strong class="text-navy-950">Mode 2: Wajib QR Harian (Fase 4)</strong>
                      <span class="text-[10px] bg-cyan-100 text-cyan-900 font-mono px-1.5 py-0.5 rounded font-bold">Segera Hadir</span>
                    </div>
                    <p class="text-navy-800 leading-relaxed">
                      QR dinamis diterbitkan dari aplikasi Wali Murid, berlaku spesifik satu hari untuk satu siswa, hangus pukul 23:59:59 zona waktu sekolah. Aman diteruskan ke kurir/ojek.
                    </p>
                  </div>
                </div>

                <!-- Card Footer Stamp Note -->
                <div class="mt-6 pt-4 border-t border-navy-200/50 flex items-center justify-between text-[11px] text-navy-700 font-mono">
                  <span>STATUS: RESMI & TERUJI</span>
                  <span>SSD KERNEL v4</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.stamp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.85rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-amber, #b45309);
  border: 2px dashed var(--color-amber, #b45309);
  border-radius: 9999px;
  transform: rotate(8deg);
}

.card-tilted {
  transform: rotate(-1.5deg);
  box-shadow: 0 30px 60px rgba(10, 32, 54, 0.18);
}

@media (max-width: 719px) {
  .card-tilted {
    margin: -48px 12px 0;
    transform: rotate(-1deg);
  }
}
</style>

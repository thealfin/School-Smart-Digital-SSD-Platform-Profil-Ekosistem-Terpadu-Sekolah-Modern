<script setup lang="ts">
export interface TrustPillar {
  id: number
  numberLabel: string
  title: string
  rule: string
  description: string
  badgeText: string
  iconName: string
}

const pillars: TrustPillar[] = [
  {
    id: 1,
    numberLabel: '01',
    title: 'Privasi Konseling',
    rule: 'Catatan BK tidak muncul di TV maupun akun non-BK',
    description: 'Diagnosa kasus, hasil bimbingan pribadi, dan rekam medis klinik UKS terisolasi mutlak. Guru non-BK dan display TV tidak dapat melihat detail rahasia siswa.',
    badgeText: 'Kerahasiaan Terjamin',
    iconName: 'psychology',
  },
  {
    id: 2,
    numberLabel: '02',
    title: 'Akses Berjenjang 0–9',
    rule: 'Tiap akun dibatasi ketat sesuai unit dan wewenang',
    description: 'Role-based access control (RBAC) membatasi akses per level dan unit sekolah. Bendahara SD tidak bisa melihat kas SMP tanpa otorisasi resmi yayasan.',
    badgeText: 'Unit-Scoped RBAC',
    iconName: 'admin_panel_settings',
  },
  {
    id: 3,
    numberLabel: '03',
    title: 'QR Jemput Harian',
    rule: 'Satu siswa, satu hari, kedaluwarsa tengah malam',
    description: 'Token digital penjemputan diterbitkan unik per siswa per hari dan otomatis hangus pukul 23:59:59 zona waktu sekolah untuk mencegah penyalahgunaan.',
    badgeText: 'Segera Hadir — Fase 4',
    iconName: 'qr_code_2',
  },
  {
    id: 4,
    numberLabel: '04',
    title: 'Jejak Audit Terbuka',
    rule: 'Riwayat izin keluar dan presensi tercatat di Back Office',
    description: 'Seluruh pencatatan izin santri, pemindaian pos gerbang, mutasi kas, hingga penarikan tabungan tercatat permanen dalam audit trail yang tidak dapat diubah.',
    badgeText: 'Audit Trail Otomatis',
    iconName: 'history',
  },
]
</script>

<template>
  <section id="keamanan" class="py-20 md:py-28 bg-paper relative" aria-labelledby="trust-pillars-heading">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="max-w-3xl mb-12 md:mb-16 reveal">
        <div class="flex items-center gap-2 mb-3">
          <span class="label-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-100">KEAMANAN & PRIVASI</span>
          <span class="text-xs text-navy-800 font-mono">4 PILAR TERVERIFIKASI</span>
        </div>
        <h2 id="trust-pillars-heading" class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-950 tracking-tight leading-tight">
          Dirancang untuk melindungi santri, data sekolah, dan ketenangan pimpinan.
        </h2>
        <p class="mt-4 text-base sm:text-lg text-navy-800 leading-relaxed">
          Kami hanya mencantumkan fitur keamanan yang benar-benar aktif atau teruji secara arsitektural. Tidak ada klaim kosong atau angka persentase tanpa bukti.
        </p>
      </div>

      <!-- 4 Pillars Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="pillar in pillars"
          :key="pillar.id"
          class="bg-white border border-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-card hover:border-navy-300 transition-all duration-200 reveal"
          :class="`reveal-delay-${pillar.id}`"
        >
          <div>
            <!-- Pillar Header & Icon -->
            <div class="flex items-center justify-between mb-5">
              <span class="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-100">
                PILAR {{ pillar.numberLabel }}
              </span>
              <div class="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center">
                <span class="material-symbols-rounded text-xl" aria-hidden="true">{{ pillar.iconName }}</span>
              </div>
            </div>

            <!-- Title & Rule -->
            <h3 class="font-display font-bold text-xl text-navy-950 mb-2 leading-snug">
              {{ pillar.title }}
            </h3>
            <p class="font-body font-semibold text-xs text-cyan-700 mb-3 leading-relaxed">
              "{{ pillar.rule }}"
            </p>
            <p class="text-xs sm:text-sm text-navy-800 leading-relaxed">
              {{ pillar.description }}
            </p>
          </div>

          <!-- Bottom Verification Badge -->
          <div class="mt-6 pt-4 border-t border-border/60 flex items-center gap-2">
            <span class="material-symbols-rounded text-emerald-600 text-base" aria-hidden="true">check_circle</span>
            <span class="font-mono text-[11px] font-semibold text-navy-700">{{ pillar.badgeText }}</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

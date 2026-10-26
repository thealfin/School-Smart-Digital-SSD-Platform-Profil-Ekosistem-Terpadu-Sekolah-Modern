<template>
  <div class="min-h-screen bg-background text-primary selection:bg-cyan-500 selection:text-white">
    <!-- Header / Brand Bar -->
    <header class="border-b border-navy-100/40 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-sm">
          <img src="/brand/logo.svg" alt="School Smart Digital" class="h-8 w-auto" />
        </NuxtLink>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-cyan-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-sm px-2 py-1"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Beranda</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
      <div class="mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-mono font-medium mb-4">
          <span class="material-symbols-rounded text-sm">shield_lock</span>
          <span>KETENTUAN PENGGUNAAN RESMI</span>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-900 tracking-tight leading-tight">
          Syarat dan Ketentuan
        </h1>
        <p class="mt-3 text-sm text-navy-700/70 font-mono">
          Terakhir diperbarui: 24 Oktober 2026 • Digital Teknologi Perkasa
        </p>
      </div>

      <!-- Quick Summary Card -->
      <div class="p-6 rounded-xl bg-cyan-50/60 border border-cyan-100 mb-10 text-navy-800">
        <h2 class="text-lg font-display font-bold text-navy-900 mb-2 flex items-center gap-2">
          <span class="material-symbols-rounded text-cyan-700">verified_user</span>
          <span>Prinsip Layanan & Kemitraan</span>
        </h2>
        <p class="text-sm leading-relaxed text-navy-700">
          Syarat dan Ketentuan ini memandu aksesibilitas informasi ekosistem School Smart Digital (SSD), hak penggunaan fitur, dan mekanisme pengajuan konsultasi atau demo sistem bagi sekolah, yayasan, dan pesantren.
        </p>
      </div>

      <!-- Article Sections -->
      <article class="space-y-10 text-navy-800 leading-relaxed font-body">
        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            1. Penerimaan Ketentuan
          </h2>
          <p class="text-navy-700">
            Dengan mengakses situs web ini, menelusuri katalog ekosistem, atau mengisi formulir permintaan demo, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini serta Kebijakan Privasi PT Digital Teknologi Perkasa.
          </p>
        </section>

        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            2. Hak Kekayaan Intelektual
          </h2>
          <p class="text-navy-700 mb-3">
            Seluruh komponen antarmuka, arsitektur perangkat lunak, logo merek, tipografi, visualisasi diagram, materi dokumentasi, dan teks pada platform School Smart Digital (SSD) merupakan hak kekayaan intelektual eksklusif PT Digital Teknologi Perkasa.
          </p>
          <p class="text-navy-700">
            Dilarang keras menyalin, mereproduksi, mendistribusikan ulang, membongkar (*reverse engineering*), atau memanfaatkan bagian mana pun dari platform ini untuk kepentingan komersial tanpa izin tertulis dari manajemen PT Digital Teknologi Perkasa.
          </p>
        </section>

        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            3. Pengajuan Permintaan Demo
          </h2>
          <p class="text-navy-700 mb-3">
            Dalam mengajukan formulir demonstrasi atau konsultasi sistem:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-navy-700">
            <li>Anda menyatakan bertindak atas nama institusi pendidikan atau yayasan yang sah dengan kapasitas untuk mengajukan konsultasi.</li>
            <li>Informasi nomor kontak WhatsApp dan email yang diberikan adalah saluran komunikasi aktif yang dapat diverifikasi oleh tim konsultan kami.</li>
            <li>Pengajuan tunduk pada mekanisme verifikasi otomatis guna menyaring spam atau pengiriman bot.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            4. Tanggung Jawab Operasional Institusi
          </h2>
          <p class="text-navy-700 mb-3">
            Bagi institusi sekolah atau yayasan yang bermitra menggunakan sistem operasional SSD:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-navy-700">
            <li>Institusi bertanggung jawab penuh atas pengelolaan hierarki akun pengguna (Level 0 hingga Level 9) di lingkungan sekolah masing-masing.</li>
            <li>Setiap akun wajib menjaga kerahasiaan kata sandi dan hak akses internal.</li>
            <li>Institusi wajib memastikan integritas data santri, nilai, dan rekam medis yang diinput ke dalam modul Back Office.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            5. Batasan Tanggung Jawab
          </h2>
          <p class="text-navy-700">
            Informasi pada situs web publik ini disajikan dengan itikad baik dan transparansi penuh mengenai kesiapan modul operasional. Ketersediaan layanan, perjanjian tingkat layanan (SLA), serta ketentuan dukungan teknis lanjutan akan dituangkan secara terperinci dalam Perjanjian Kerja Sama (PKS) resmi saat institusi mengaktifkan sistem produksi.
          </p>
        </section>

        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            6. Hukum yang Mengatur
          </h2>
          <p class="text-navy-700">
            Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Negara Kesatuan Republik Indonesia. Setiap perselisihan yang timbul akan diupayakan diselesaikan melalui musyawarah mufakat.
          </p>
        </section>

        <section class="border-t border-navy-100/60 pt-6">
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            7. Pertanyaan & Bantuan Hukum
          </h2>
          <div class="p-5 rounded-lg bg-paper-warm border border-navy-100 text-sm space-y-2 text-navy-800">
            <p><strong class="text-navy-900">PT Digital Teknologi Perkasa</strong></p>
            <p>Alamat: Perum Graha Madu Pesona Blok C No.31, Bandar Lampung</p>
            <p>Email: <a href="mailto:digitalteknologiperkasa.lampung@gmail.com" class="text-cyan-700 hover:underline">digitalteknologiperkasa.lampung@gmail.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/6285839845284" class="text-cyan-700 hover:underline">+62 858-3984-5284</a></p>
          </div>
        </section>
      </article>

      <div class="mt-12 pt-8 border-t border-navy-100/60 flex justify-between items-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-cyan-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Beranda</span>
        </NuxtLink>
        <NuxtLink
          to="/privacy-policy"
          class="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-cyan-700 transition-colors"
        >
          <span>Kebijakan Privasi</span>
          <span class="material-symbols-rounded text-lg">arrow_forward</span>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Syarat dan Ketentuan — School Smart Digital (SSD)',
  meta: [
    {
      name: 'description',
      content: 'Syarat dan ketentuan resmi penggunaan platform dan pengajuan demo School Smart Digital (SSD) oleh Digital Teknologi Perkasa.',
    },
  ],
})
</script>

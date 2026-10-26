<template>
  <div class="min-h-screen bg-background text-primary selection:bg-cyan-500 selection:text-white flex flex-col">
    <!-- Dedicated Header & Navbar Component -->
    <SiteHeader mode="subpage" />

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
      <div class="mb-10 reveal">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-mono font-medium mb-4">
          <span class="material-symbols-rounded text-sm">shield_lock</span>
          <span>KEBIJAKAN PRIVASI RESMI</span>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-900 tracking-tight leading-tight">
          Kebijakan Privasi
        </h1>
        <p class="mt-3 text-sm text-navy-700/70 font-mono">
          Terakhir diperbarui: 24 Oktober 2026 • Digital Teknologi Perkasa
        </p>
      </div>

      <!-- Quick Summary Card -->
      <div class="p-6 rounded-xl bg-cyan-50/60 border border-cyan-100 mb-10 text-navy-800 reveal">
        <h2 class="text-lg font-display font-bold text-navy-900 mb-2 flex items-center gap-2">
          <span class="material-symbols-rounded text-cyan-700">verified_user</span>
          <span>Komitmen Perlindungan Data Kami</span>
        </h2>
        <p class="text-sm leading-relaxed text-navy-700">
          School Smart Digital (SSD) menempatkan privasi sekolah, santri, guru, dan wali murid sebagai fondasi utama. Kami mengumpulkan data secara terbatas sesuai kebutuhan operasional, menerapkan enkripsi modern, tidak pernah menjual data ke pihak ketiga, dan melindungi kerahasiaan konseling peserta didik.
        </p>
      </div>

      <!-- Article Sections -->
      <article class="space-y-10 text-navy-800 leading-relaxed font-body reveal">
        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            1. Ruang Lingkup dan Landasan Hukum
          </h2>
          <p class="text-navy-700">
            Kebijakan Privasi ini mengatur tata cara perolehan, pengelolaan, pemrosesan, dan perlindungan data pribadi yang Anda berikan melalui situs profil <strong class="text-navy-900">School Smart Digital (SSD)</strong> yang dikembangkan oleh <strong class="text-navy-900">PT Digital Teknologi Perkasa</strong>. Kami berkomitmen mematuhi ketentuan perundang-undangan perlindungan data yang berlaku di Republik Indonesia, termasuk Undang-Undang Perlindungan Data Pribadi (UU PDP).
          </p>
        </section>

        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            2. Data yang Dikumpulkan
          </h2>
          <p class="text-navy-700 mb-3">
            Kami hanya mengumpulkan data yang relevan dan dibutuhkan untuk memberikan layanan konsultasi dan demonstrasi sistem:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-navy-700">
            <li>
              <strong class="text-navy-900">Formulir Permintaan Demo:</strong> Nama lengkap penanggung jawab, jabatan/peran institusi, nama lembaga/yayasan, jenjang/tipe pendidikan (SD, SMP, SMA, Pondok Pesantren, TPQ, Yayasan), estimasi jumlah peserta didik, nomor kontak WhatsApp, alamat email, serta catatan kebutuhan modul.
            </li>
            <li>
              <strong class="text-navy-900">Telemetri First-Party Tanpa Pelacak Pihak Ketiga:</strong> Kami mencatat interaksi navigasi situs (halaman yang dikunjungi, pemilihan aplikasi pada katalog, durasi sesi) secara first-party. Alamat IP pengunjung diubah menjadi hash satu arah (*salted SHA-256 hash*) untuk keperluan pencegahan spam dan pembatasan laju (*rate limiting*). Alamat IP mentah tidak pernah disimpan di basis data.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            3. Tujuan Penggunaan Data
          </h2>
          <p class="text-navy-700 mb-3">
            Informasi yang Anda sampaikan digunakan secara eksklusif untuk:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-navy-700">
            <li>Memproses penjadwalan presentasi dan demo langsung sistem SSD bagi institusi Anda.</li>
            <li>Menghitung estimasi simulasi paket modul operasional yang sesuai dengan skala sekolah atau yayasan Anda.</li>
            <li>Menghubungi Anda melalui saluran komunikasi resmi (WhatsApp resmi atau email) untuk koordinasi lanjutan.</li>
            <li>Mencegah penyalahgunaan bot, serangan brute force, dan pengiriman spam pada formulir publik.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            4. Perlindungan Khusus Fitur Sensitif Sekolah
          </h2>
          <p class="text-navy-700 mb-3">
            Dalam arsitektur sistem operasi SSD:
          </p>
          <ul class="list-disc pl-6 space-y-2 text-navy-700">
            <li>
              <strong class="text-navy-900">Kerahasiaan Bimbingan & Konseling (BK):</strong> Catatan internal konseling siswa hanya dapat diakses oleh Guru BK yang memiliki otoritas. Catatan kasus internal tidak dipublikasikan ke papan pengumuman, TV Command Center, maupun akun orang tua tanpa persetujuan penanganan formal.
            </li>
            <li>
              <strong class="text-navy-900">Keamanan Gerbang & Presensi:</strong> Kode QR penjemputan santri dan siswa menggunakan token dinamis dengan batas kedaluwarsa harian (*expiring token*) untuk memitigasi risiko pemalsuan penjemputan.
            </li>
            <li>
              <strong class="text-navy-900">Isolasi Multi-Unit Yayasan:</strong> Hak akses berjenjang (Level 0–9) memastikan operator sekolah di satu unit tidak dapat mengakses data santri atau keuangan unit lain tanpa izin yayasan.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            5. Keamanan Penyimpanan Data
          </h2>
          <p class="text-navy-700">
            Kami menerapkan enkripsi standar industri (TLS 1.3) pada setiap transmisi data antara peramban dan server kami. Basis data disimpan dalam lingkungan komputasi berkeandalan tinggi dengan pembatasan hak akses berbasis peran, pencatatan log audit (*audit log*), dan pengamanan sandi berstandar kriptografi scrypt.
          </p>
        </section>

        <section>
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            6. Hak Anda sebagai Pemilik Data
          </h2>
          <p class="text-navy-700">
            Anda memiliki hak untuk meminta klarifikasi, pembaruan, maupun penghapusan data kontak yang telah dikirimkan melalui formulir permintaan demo. Untuk mengajukan permohonan terkait data pribadi Anda, silakan hubungi tim kami melalui kontak resmi di bawah ini.
          </p>
        </section>

        <section class="border-t border-navy-100/60 pt-6">
          <h2 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-3">
            7. Kontak Resmi Pengelola
          </h2>
          <p class="text-navy-700 mb-3">
            Apabila Anda memiliki pertanyaan atau kendala seputar Kebijakan Privasi ini, silakan menghubungi:
          </p>
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
          to="/terms"
          class="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-cyan-700 transition-colors"
        >
          <span>Baca Syarat & Ketentuan</span>
          <span class="material-symbols-rounded text-lg">arrow_forward</span>
        </NuxtLink>
      </div>
    </main>

    <!-- Dedicated Footer Component -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Kebijakan Privasi — School Smart Digital (SSD)',
  meta: [
    {
      name: 'description',
      content: 'Kebijakan privasi resmi School Smart Digital (SSD) oleh Digital Teknologi Perkasa. Perlindungan data sekolah, guru, santri, dan wali murid.',
    },
  ],
})
</script>

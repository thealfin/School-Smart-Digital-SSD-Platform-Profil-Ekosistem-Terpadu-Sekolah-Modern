<template>
  <footer
    id="kontak"
    aria-labelledby="footer-heading"
    class="bg-navy-950 text-white border-t border-navy-800/80 pt-16 sm:pt-20 pb-12 selection:bg-cyan-500 selection:text-navy-950 relative overflow-hidden"
    style="background-image: url('data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.735-5.197-1.575-8.244-2.653C65.666 14.195 59.554 11.968 50 11.968c-9.643 0-16.196 2.37-25.766 5.672-3.238 1.117-6.07 1.962-8.683 2.682h5.633zM28.452 8.35c3.06-.47 6.326-.743 9.77-.743 17.585 0 28.528 7.058 35.15 13.393h6.233c-7.77-7.61-20.252-14.393-41.383-14.393-4.717 0-9.124.443-13.155 1.144L28.452 8.35z\' fill=\'%2301a8cf\' fill-opacity=\'0.04\' fill-rule=\'evenodd\'/%3E%3C/svg%3E');"
  >
    <h2 id="footer-heading" class="sr-only">Navigasi Footer & Informasi Perusahaan</h2>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal">
      <!-- 4-Column Editorial Footer Grid ala PSD Katalog -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-navy-800/60">
        
        <!-- Column 1: Brand & Socials (Col 1-4) -->
        <div class="lg:col-span-4 flex flex-col gap-5">
          <NuxtLink to="/" class="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
            <BrandLogo variant="light" size="md" />
          </NuxtLink>

          <p class="text-sm text-navy-100/90 font-body leading-relaxed max-w-sm">
            Platform Sistem Operasi Digital Sekolah Terpadu oleh 
            <br>
            <strong class="text-white">PT Digital Teknologi Perkasa</strong>. Menghubungkan gerbang, ruang guru, asrama, hingga pembukuan yayasan dalam satu basis data terpadu.
          </p>

          <!-- Social Media & Partner Icons (Round pills) -->
          <div class="flex items-center gap-2.5 pt-1">
            <!-- Instagram -->
            <a
              href="https://www.instagram.com/schoolsmartdigital?exln=MWR3dGZsejM2dDJ4dQ%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram School Smart Digital"
              title="Instagram School Smart Digital"
              class="w-9 h-9 rounded-full bg-white/10 hover:bg-cyan-500 hover:text-navy-950 transition-all duration-300 flex items-center justify-center text-white border border-white/20 shadow-sm"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            <!-- TikTok -->
            <a
              href="https://www.tiktok.com/@schoolsmartdigital?_r=1&_t=ZS-9ArrTSlSgrw"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok School Smart Digital"
              title="TikTok School Smart Digital"
              class="w-9 h-9 rounded-full bg-white/10 hover:bg-cyan-500 hover:text-navy-950 transition-all duration-300 flex items-center justify-center text-white border border-white/20 shadow-sm"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>

            <!-- School Smart Digital (Home) -->
            <a
              href="/#"
              aria-label="School Smart Digital"
              title="School Smart Digital"
              class="w-9 h-9 rounded-full bg-white/10 hover:bg-cyan-500 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center border border-white/20 shadow-sm p-1.5"
            >
              <img src="/brand/logo-link-ssd-white.svg" alt="School Smart Digital" class="w-full h-full object-contain rounded-full" />
            </a>

            <!-- Pesantren Smart Digital -->
            <a
              href="https://pesantrensmartdigital.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pesantren Smart Digital"
              title="Pesantren Smart Digital"
              class="w-9 h-9 rounded-full bg-white/10 hover:bg-cyan-500 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center border border-white/20 shadow-sm p-1.5"
            >
              <img src="/brand/logo-link-psd-white.svg" alt="Pesantren Smart Digital" class="w-full h-full object-contain rounded-full" />
            </a>

            <!-- Profil Digital Teknologi Perkasa -->
            <a
              :href="parentProfileUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Profil Digital Teknologi Perkasa"
              title="Profil Digital Teknologi Perkasa"
              class="w-9 h-9 rounded-full bg-white/10 hover:bg-cyan-500 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center border border-white/20 shadow-sm p-1.5"
            >
              <img src="/brand/logo-link-dtp-white.svg" alt="PT Digital Teknologi Perkasa" class="w-full h-full object-contain" />
            </a>
          </div>
        </div>

        <!-- Column 2: Navigasi (Col 5-6) -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <div>
            <h3 class="text-white font-bold text-base tracking-tight font-display">Navigasi</h3>
            <!-- S-Curve Accent Line in Cyan -->
            <svg class="h-2 w-10 text-cyan-400 mt-1.5" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 6C8 6 12 2 20 2C28 2 32 6 38 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </div>

          <ul class="flex flex-col gap-2.5 text-sm font-body">
            <li>
              <NuxtLink to="/" class="text-navy-100/80 hover:text-cyan-400 transition-colors">
                Beranda
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/fitur" class="text-navy-100/80 hover:text-cyan-400 transition-colors">
                Fitur &amp; Modul
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/galeri" class="text-navy-100/80 hover:text-cyan-400 transition-colors">
                Galeri Bimtek
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/berita" class="text-navy-100/80 hover:text-cyan-400 transition-colors">
                Warta &amp; Berita
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#faq" class="text-navy-100/80 hover:text-cyan-400 transition-colors">
                Pusat FAQ &amp; Panduan
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/tentang" class="text-navy-100/80 hover:text-cyan-400 transition-colors">
                Tentang Kami
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/kontak" class="text-navy-100/80 hover:text-cyan-400 transition-colors">
                Hubungi Kami
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 3: Hubungi Kami (Col 7-9) -->
        <div class="lg:col-span-3 flex flex-col gap-4">
          <div>
            <h3 class="text-white font-bold text-base tracking-tight font-display">Hubungi Kami</h3>
            <!-- S-Curve Accent Line in Cyan -->
            <svg class="h-2 w-10 text-cyan-400 mt-1.5" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 6C8 6 12 2 20 2C28 2 32 6 38 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </div>

          <ul class="flex flex-col gap-3 text-sm text-navy-100/85 font-body">
            <!-- Address -->
            <li class="flex items-start gap-2.5">
              <span class="material-symbols-rounded text-cyan-400 text-[20px] shrink-0 mt-0.5" aria-hidden="true">location_on</span>
              <span class="leading-relaxed">
                Perum Graha Madu Pesona Blok C No.31, Bandar Lampung
              </span>
            </li>

            <!-- Phone / WhatsApp -->
            <li class="flex items-center gap-2.5">
              <WhatsAppIcon class="w-4 h-4 text-cyan-400 shrink-0" />
              <a
                :href="waUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-cyan-400 transition-colors font-medium"
              >
                +62 858-3984-5284
              </a>
            </li>

            <!-- Email -->
            <li class="flex items-center gap-2.5">
              <span class="material-symbols-rounded text-cyan-400 text-[20px] shrink-0" aria-hidden="true">mail</span>
              <a
                :href="`mailto:${companyEmail}`"
                class="hover:text-cyan-400 transition-colors font-medium break-all"
              >
                {{ companyEmail }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 4: Download App & Jaringan (Col 10-12) -->
        <div class="lg:col-span-3 flex flex-col gap-4">
          <div>
            <h3 class="text-white font-bold text-base tracking-tight font-display">Download App</h3>
            <!-- S-Curve Accent Line in Cyan -->
            <svg class="h-2 w-10 text-cyan-400 mt-1.5" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 6C8 6 12 2 20 2C28 2 32 6 38 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </div>

          <p class="text-xs text-navy-200/90 italic leading-relaxed">
            Dapatkan Aplikasi Ekosistem School Smart Digital di PlayStore &amp; AppStore.
          </p>

          <!-- Store Badges -->
          <div class="flex flex-col gap-2.5 pt-1">
            <!-- Google Play Store Badge -->
            <a
              href="#"
              class="w-56 max-w-full bg-navy-900/90 hover:bg-navy-900 border border-white/15 hover:border-cyan-400/50 rounded-xl px-4 py-2 flex items-center gap-3 transition-all duration-300 shadow-md group"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current text-white shrink-0 group-hover:scale-105 transition-transform">
                <title>Google Play</title>
                <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/>
              </svg>
              <div class="flex flex-col text-left">
                <span class="text-[9px] uppercase tracking-wider text-navy-200 font-medium leading-none">Tersedia di</span>
                <span class="text-sm font-bold text-white tracking-tight leading-snug">Google Play</span>
              </div>
            </a>

            <!-- Apple App Store Badge -->
            <a
              href="#"
              class="w-56 max-w-full bg-navy-900/90 hover:bg-navy-900 border border-white/15 hover:border-cyan-400/50 rounded-xl px-4 py-2 flex items-center gap-3 transition-all duration-300 shadow-md group"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current text-white shrink-0 group-hover:scale-105 transition-transform">
                <title>App Store</title>
                <path d="M8.8086 14.9194l6.1107-11.0368c.0837-.1513.1682-.302.2437-.4584.0685-.142.1267-.2854.1646-.4403.0803-.3259.0588-.6656-.066-.9767-.1238-.3095-.3417-.5678-.6201-.7355a1.4175 1.4175 0 0 0-.921-.1924c-.3207.043-.6135.1935-.8443.4288-.1094.1118-.1996.2361-.2832.369-.092.1463-.175.2979-.259.4492l-.3864.6979-.3865-.6979c-.0837-.1515-.1667-.303-.2587-.4492-.0837-.1329-.1739-.2572-.2835-.369-.2305-.2353-.5233-.3857-.844-.429a1.4181 1.4181 0 0 0-.921.1926c-.2784.1677-.4964.426-.6203.7355-.1246.311-.1461.6508-.066.9767.038.155.0962.2984.1648.4403.0753.1564.1598.307.2437.4584l1.248 2.2543-4.8625 8.7825H2.0295c-.1676 0-.3351-.0007-.5026.0092-.1522.009-.3004.0284-.448.0714-.3108.0906-.5822.2798-.7783.548-.195.2665-.3006.5929-.3006.9279 0 .3352.1057.6612.3006.9277.196.2683.4675.4575.7782.548.1477.043.296.0623.4481.0715.1675.01.335.009.5026.009h13.0974c.0171-.0357.059-.1294.1-.2697.415-1.4151-.6156-2.843-2.0347-2.843zM3.113 18.5418l-.7922 1.5008c-.0818.1553-.1644.31-.2384.4705-.067.1458-.124.293-.1611.452-.0785.3346-.0576.6834.0645 1.0029.1212.3175.3346.583.607.7549.2727.172.5891.2416.9013.1975.3139-.044.6005-.1986.8263-.4402.1072-.1148.1954-.2424.2772-.3787.0902-.1503.1714-.3059.2535-.4612L6 19.4636c-.0896-.149-.9473-1.4704-2.887-.9218m20.5861-3.0056a1.4707 1.4707 0 0 0-.779-.5407c-.1476-.0425-.2961-.0616-.4483-.0705-.1678-.0099-.3352-.0091-.503-.0091H18.648l-4.3891-7.817c-.6655.7005-.9632 1.485-1.0773 2.1976-.1655 1.0333.0367 2.0934.546 3.0004l5.2741 9.3933c.084.1494.167.299.2591.4435.0837.131.1739.2537.2836.364.231.2323.5238.3809.8449.4232.3192.0424.643-.0244.9217-.1899.2784-.1653.4968-.4204.621-.7257.1246-.3072.146-.6425.0658-.9641-.0381-.1529-.0962-.2945-.165-.4346-.0753-.1543-.1598-.303-.2438-.4524l-1.216-2.1662h1.596c.1677 0 .3351.0009.5029-.009.1522-.009.3007-.028.4483-.0705a1.4707 1.4707 0 0 0 .779-.5407A1.5386 1.5386 0 0 0 24 16.452a1.539 1.539 0 0 0-.3009-.9158Z"/>
              </svg>
              <div class="flex flex-col text-left">
                <span class="text-[9px] uppercase tracking-wider text-navy-200 font-medium leading-none">Tersedia di</span>
                <span class="text-sm font-bold text-white tracking-tight leading-snug">App Store</span>
              </div>
            </a>
          </div>
        </div>

      </div>

      <!-- Bottom Bar: Copyright & Privacy / Terms Links -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-100/70 font-body">
        <p>
          © 2026 PT Digital Teknologi Perkasa. Hak Cipta Dilindungi.
        </p>
        <div class="flex items-center gap-3 font-body">
          <NuxtLink to="/privacy-policy" class="hover:text-cyan-400 transition-colors">
            Kebijakan Privasi
          </NuxtLink>
          <span class="text-navy-700" aria-hidden="true">•</span>
          <NuxtLink to="/terms" class="hover:text-cyan-400 transition-colors">
            Syarat &amp; Ketentuan Layanan
          </NuxtLink>
          <span class="sr-only">Aksesibilitas WCAG 2.1 AA • S-Curve Design System</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { settings as defaultSettings } from '@ssd/shared'

const props = withDefaults(
  defineProps<{
    settings?: Record<string, any>
  }>(),
  {
    settings: () => defaultSettings,
  }
)

const companyAddress = computed(() => {
  return (
    props.settings?.contact?.address ||
    'Perum Graha Madu Pesona Blok C No.31, Bandar Lampung, Lampung'
  )
})

const companyEmail = computed(() => {
  return props.settings?.contact?.email || 'digitalteknologiperkasa.lampung@gmail.com'
})

const parentProfileUrl = computed(() => {
  return props.settings?.company?.parentUrl || 'https://digital-teknologi-perkasa-profile.vercel.app'
})

const waUrl = computed(() => {
  const phone = props.settings?.contact?.whatsapp || '6285839845284'
  const text = encodeURIComponent('Halo tim Digital Teknologi Perkasa, saya ingin berkonsultasi mengenai School Smart Digital.')
  return `https://wa.me/${phone}?text=${text}`
})
</script>

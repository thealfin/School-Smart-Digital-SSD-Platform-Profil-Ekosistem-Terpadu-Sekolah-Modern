<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isLoading = ref(true)
const isMounted = ref(true)

function dismissPreloader() {
  if (!isLoading.value) return
  // Berikan jeda visual minimal 180ms agar animasi transisi terasa halus
  setTimeout(() => {
    isLoading.value = false
    // Tunggu transisi fade-out selesai sebelum menghapus elemen dari DOM
    setTimeout(() => {
      isMounted.value = false
    }, 460)
  }, 180)
}

onMounted(() => {
  if (!import.meta.client) return

  // Periksa apakah dokumen sudah berstatus 'complete'
  if (document.readyState === 'complete') {
    dismissPreloader()
  } else {
    window.addEventListener('load', dismissPreloader, { once: true })
  }

  // Failsafe timer pengaman maksimal 3.5 detik agar halaman tidak tertahan jika ada resource eksternal lambat
  const failsafeTimer = setTimeout(() => {
    dismissPreloader()
  }, 3500)

  onUnmounted(() => {
    window.removeEventListener('load', dismissPreloader)
    clearTimeout(failsafeTimer)
  })
})
</script>

<template>
  <div
    v-if="isMounted"
    class="fullscreen-preloader"
    :class="{ 'is-fading': !isLoading }"
    role="status"
    aria-live="polite"
    aria-label="Memuat aplikasi School Smart Digital"
  >
    <div class="preloader-content">
      <!-- Lingkaran Loading Spinner (Berputar Halus Tanpa Henti) -->
      <div class="preloader-spinner-wrapper">
        <div class="preloader-spinner" aria-hidden="true" />

        <!-- ============================================================== -->
        <!-- LOGO PLACEHOLDER (DI TITIK TENGAH, STATIS / TIDAK BERPUTAR)    -->
        <!-- Anda dapat mengganti file / sumber pada tag <img> di bawah ini  -->
        <!-- atau menggunakan tag inline <svg> yang telah disediakan.       -->
        <!-- ============================================================== -->
        <div class="preloader-logo-slot" aria-hidden="true">
          <!-- Opsi 1: Tag <img> (Aktif bawaan mengarah ke logo SSD) -->
          <img
            src="/brand/logo-ssd.svg"
            alt="Logo School Smart Digital"
            class="preloader-logo-img"
            width="44"
            height="44"
            loading="eager"
            decoding="sync"
          />

          <!-- Opsi 2: Tag Inline <svg> (Silakan aktifkan jika ingin inline SVG)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1000"
            class="preloader-logo-img"
            width="44"
            height="44"
            role="img"
          >
            <path fill="#0C3161" d="...path logo Anda..." />
            <path fill="#01A8CF" d="...path logo Anda..." />
          </svg>
          -->
        </div>
      </div>

      <!-- Label Status Halus -->
      <div class="preloader-brand-label">
        <span class="label-navy">School Smart</span>
        <span class="label-cyan">Digital</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==================== FULLSCREEN OVERLAY CONTAINER ==================== */
.fullscreen-preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: opacity 0.45s cubic-bezier(0.2, 0, 0, 1),
              visibility 0.45s cubic-bezier(0.2, 0, 0, 1);
}

/* Transisi Fade-Out Halus */
.fullscreen-preloader.is-fading {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* Wrapper Konten Tengah */
.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  user-select: none;
}

/* ==================== SPINNER & LOGO WRAPPER ==================== */
.preloader-spinner-wrapper {
  position: relative;
  width: 92px;
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
  .preloader-spinner-wrapper {
    width: 98px;
    height: 98px;
  }
}

/* Lingkaran Berputar Halus (Infinite Spin) */
.preloader-spinner {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  /* Rel dasar tipis */
  border: 2.5px solid rgba(10, 32, 54, 0.08);
  /* Aksen putaran warna utama #0a2036 & cyan #01a8cf */
  border-top-color: #0a2036;
  border-right-color: #01a8cf;
  animation: preloader-spin 0.9s linear infinite;
  will-change: transform;
}

@keyframes preloader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ==================== LOGO STATIS (DI TENGAH) ==================== */
.preloader-logo-slot {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
}

.preloader-logo-img {
  width: 44px;
  height: 44px;
  max-width: 44px;
  max-height: 44px;
  object-fit: contain;
  display: block;
}

@media (min-width: 640px) {
  .preloader-logo-img {
    width: 48px;
    height: 48px;
    max-width: 48px;
    max-height: 48px;
  }
}

/* ==================== LABEL BRAND ==================== */
.preloader-brand-label {
  font-family: var(--font-display, ui-sans-serif, system-ui, sans-serif);
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.label-navy {
  color: #0a2036;
}

.label-cyan {
  color: #01a8cf;
}

/* ==================== PREFERS REDUCED MOTION ==================== */
@media (prefers-reduced-motion: reduce) {
  .fullscreen-preloader {
    transition: none !important;
  }
  .preloader-spinner {
    animation: none !important;
  }
}
</style>


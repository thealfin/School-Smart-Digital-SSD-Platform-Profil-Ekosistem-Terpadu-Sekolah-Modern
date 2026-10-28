<template>
  <div class="min-h-screen bg-background text-primary selection:bg-cyan-500 selection:text-white">
    <!-- Fullscreen Preloader (Logo Spinner Loader) -->
    <FullscreenPreloader />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

const requestUrl = useRequestURL()
const ogImageUrl = computed(() => `${requestUrl.origin}/og-image.png`)

useSeoMeta({
  ogSiteName: 'School Smart Digital',
  ogType: 'website',
  ogImage: ogImageUrl,
  ogImageSecureUrl: ogImageUrl,
  ogImageType: 'image/png',
  ogImageWidth: 512,
  ogImageHeight: 512,
  ogImageAlt: 'Logo School Smart Digital',
  twitterCard: 'summary',
  twitterImage: ogImageUrl,
})

// Prevent Material Symbols ligature text flashing (FOUC)
onMounted(() => {
  const doc = typeof document !== 'undefined' ? document : null
  if (!doc) return

  if ('fonts' in doc && (doc as unknown as { fonts?: { ready: Promise<void> } }).fonts) {
    (doc as unknown as { fonts: { ready: Promise<void> } }).fonts.ready.then(() => {
      doc.documentElement.classList.add('icons-ready')
    })
  } else {
    doc.documentElement.classList.add('icons-ready')
  }
})
</script>

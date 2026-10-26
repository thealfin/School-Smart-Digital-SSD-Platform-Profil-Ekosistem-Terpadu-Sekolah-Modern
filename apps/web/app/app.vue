<template>
  <div class="min-h-screen bg-background text-primary selection:bg-cyan-500 selection:text-white">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
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

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppItem } from '@ssd/shared/types'
import { apps as fallbackApps } from '@ssd/shared/content'

export const useEcosystemStore = defineStore('ecosystem', () => {
  // ── State ──
  const apps = ref<AppItem[]>(fallbackApps)
  const activeSlug = ref<string>('back-office')
  const isNavigatingViaKeyboard = ref<boolean>(false)

  // ── Getters ──
  const totalApps = computed(() => apps.value.length)

  const activeIndex = computed(() => {
    const idx = apps.value.findIndex(a => a.slug === activeSlug.value)
    return idx >= 0 ? idx : 0
  })

  const activeApp = computed<AppItem>(() => {
    return (apps.value[activeIndex.value] || apps.value[0] || fallbackApps[0]) as AppItem
  })

  // ── Actions ──
  function setApps(newApps: AppItem[]) {
    if (newApps && newApps.length > 0) {
      apps.value = newApps
    }
  }

  function setActiveSlug(slug: string, updateHash: boolean = true) {
    const found = apps.value.find(a => a.slug === slug)
    if (found) {
      activeSlug.value = slug
    } else {
      activeSlug.value = apps.value[0]?.slug || 'back-office'
    }

    if (updateHash && import.meta.client) {
      // Use replaceState to update hash without triggering disruptive page jumps
      const newHash = `#app-${activeSlug.value}`
      if (window.location.hash !== newHash) {
        history.replaceState(null, '', newHash)
      }
    }
  }

  function setActiveIndex(index: number, updateHash: boolean = true) {
    if (apps.value.length === 0) return
    // Wrap around boundaries modulo length
    const wrapped = ((index % apps.value.length) + apps.value.length) % apps.value.length
    const targetApp = apps.value[wrapped]
    if (targetApp) {
      setActiveSlug(targetApp.slug, updateHash)
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    let handled = false
    switch (event.key) {
      case 'ArrowDown':
        setActiveIndex(activeIndex.value + 1)
        handled = true
        break
      case 'ArrowUp':
        setActiveIndex(activeIndex.value - 1)
        handled = true
        break
      case 'Home':
        setActiveIndex(0)
        handled = true
        break
      case 'End':
        setActiveIndex(apps.value.length - 1)
        handled = true
        break
    }

    if (handled) {
      event.preventDefault()
      isNavigatingViaKeyboard.value = true
    }
  }

  function initFromHash() {
    if (!import.meta.client) return
    const hash = window.location.hash
    const match = hash.match(/^#app-([a-z0-9-]+)$/)
    if (match && match[1]) {
      const targetSlug = match[1]
      if (apps.value.some(a => a.slug === targetSlug)) {
        setActiveSlug(targetSlug, false)
      }
    }
  }

  function setupHashListener() {
    if (!import.meta.client) return () => {}
    initFromHash()
    const onHashChange = () => initFromHash()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }

  return {
    apps,
    activeSlug,
    activeIndex,
    activeApp,
    totalApps,
    isNavigatingViaKeyboard,
    setApps,
    setActiveSlug,
    setActiveIndex,
    handleKeydown,
    initFromHash,
    setupHashListener,
  }
})

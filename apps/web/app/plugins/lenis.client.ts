import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  let lenis: Lenis | null = null
  let rafId: number | null = null

  function createLenisInstance() {
    if (lenis || typeof window === 'undefined') return
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      prevent: (node) => {
        if (!node || typeof node.closest !== 'function') return false
        return (
          window.location.pathname.startsWith('/admin') ||
          node.closest('[data-lenis-prevent]') !== null
        )
      },
    })

    const raf = (time: number) => {
      if (!lenis) return
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
  }

  function destroyLenisInstance() {
    if (rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (lenis) {
      lenis.destroy()
      lenis = null
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling')
      document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling')
    }
  }

  // Completely destroy Lenis on /admin routes so native scrolling in Admin Panel works without overflow: clip
  watch(
    () => router.currentRoute.value.path,
    (path) => {
      if (path.startsWith('/admin')) {
        destroyLenisInstance()
      } else {
        createLenisInstance()
      }
    },
    { immediate: true }
  )

  // On route change without hash, scroll to top on public pages
  router.afterEach((to) => {
    if (!to.hash && !to.path.startsWith('/admin') && lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
  })

  return {
    provide: {
      lenis,
    },
  }
})

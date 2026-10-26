import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  })

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // Auto-stop Lenis on admin routes to prevent scroll interference with admin forms and tables
  watch(
    () => router.currentRoute.value.path,
    (path) => {
      if (path.startsWith('/admin')) {
        lenis.stop()
      } else {
        lenis.start()
      }
    },
    { immediate: true }
  )

  // On route change without hash, scroll to top on public pages
  router.afterEach((to) => {
    if (!to.hash && !to.path.startsWith('/admin')) {
      lenis.scrollTo(0, { immediate: true })
    }
  })

  return {
    provide: {
      lenis,
    },
  }
})


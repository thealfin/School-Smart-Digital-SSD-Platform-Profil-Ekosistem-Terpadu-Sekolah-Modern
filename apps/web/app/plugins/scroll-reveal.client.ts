export default defineNuxtPlugin(() => {
  const router = useRouter()

  let observer: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null

  function initReveal() {
    if (import.meta.server) return

    // Never execute on admin routes
    const currentPath = router.currentRoute.value.path || ''
    if (currentPath.startsWith('/admin')) {
      if (observer) {
        observer.disconnect()
        observer = null
      }
      return
    }

    // Accessibility: Reduced Motion users see content immediately without motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
        el.classList.add('visible')
      })
      return
    }

    // Clean up previous observer
    if (observer) {
      observer.disconnect()
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    const elements = document.querySelectorAll<HTMLElement>(
      '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)'
    )

    const winHeight = window.innerHeight || 800

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      // If element is already in initial viewport on page load/hydration, reveal immediately
      if (rect.top <= winHeight * 0.92 && rect.bottom >= 0) {
        el.classList.add('visible')
      } else {
        observer?.observe(el)
      }
    })
  }

  // Handle route transitions
  router.afterEach(async (to) => {
    if (to.path.startsWith('/admin')) {
      if (observer) observer.disconnect()
      return
    }
    await nextTick()
    setTimeout(initReveal, 150)
  })

  // Initial client setup
  if (import.meta.client) {
    onNuxtReady(() => {
      initReveal()

      // Watch for dynamically loaded content/components
      mutationObserver = new MutationObserver(() => {
        const currentPath = router.currentRoute.value.path || ''
        if (currentPath.startsWith('/admin')) return

        const unobserved = document.querySelectorAll<HTMLElement>(
          '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)'
        )
        if (unobserved.length > 0 && observer) {
          const winHeight = window.innerHeight || 800
          unobserved.forEach((el) => {
            const rect = el.getBoundingClientRect()
            if (rect.top <= winHeight * 0.92 && rect.bottom >= 0) {
              el.classList.add('visible')
            } else {
              observer?.observe(el)
            }
          })
        }
      })

      mutationObserver.observe(document.body, { childList: true, subtree: true })
    })
  }

  return {
    provide: {
      initScrollReveal: initReveal,
    },
  }
})


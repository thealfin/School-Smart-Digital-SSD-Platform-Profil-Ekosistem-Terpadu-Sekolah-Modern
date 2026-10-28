/**
 * Automatic Cache Invalidation Utility for Nitro ISR and Route Caches
 * Purges cached HTML responses for '/' and other routes when content is updated in Admin Panel
 */
export async function purgeAppCache(targets = ['/', '/api/testimonials', '/api/content']) {
  const clearedKeys: string[] = []

  try {
    // 1. Purge from default Nitro cache storage
    const cacheStorage = useStorage('cache')
    if (cacheStorage) {
      const keys = await cacheStorage.getKeys()
      for (const key of keys) {
        // Target nitro route caches e.g. 'nitro:routes:_', 'nitro:routes:index', 'nitro:handlers:_'
        const isRouteMatch = targets.some((t) => {
          if (t === '/') {
            return key.includes('nitro:routes') && (key.endsWith(':_') || key.endsWith(':index') || key.includes('/_') || key.includes('_index'))
          }
          const clean = t.replace(/^\//, '').replace(/\//g, ':')
          return key.includes(clean)
        })

        if (isRouteMatch || key.startsWith('nitro:routes:_')) {
          await cacheStorage.removeItem(key)
          clearedKeys.push(key)
        }
      }
    }

    // 2. Also check root storage for any custom runtime caches
    const rootStorage = useStorage('root')
    if (rootStorage) {
      const rootKeys = await rootStorage.getKeys('cache:nitro:routes')
      for (const key of rootKeys) {
        await rootStorage.removeItem(key)
        clearedKeys.push(key)
      }
    }
  } catch (err: any) {
    console.warn('[CachePurge] Warning while purging Nitro cache:', err?.message || err)
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    clearedKeys,
    targets,
  }
}


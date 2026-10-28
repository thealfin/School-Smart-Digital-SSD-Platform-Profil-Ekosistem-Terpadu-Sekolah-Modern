import {
  type GalleryMediaType,
  type ParsedMediaResult,
  extractYouTubeId,
  extractTikTokId,
  extractInstagramCode,
  detectMediaType,
  parseMediaUrl,
  resolveGalleryCardThumbnail,
  resolveGalleryEmbedUrl,
} from '../../app/utils/mediaParser'

export {
  type GalleryMediaType,
  type ParsedMediaResult,
  extractYouTubeId,
  extractTikTokId,
  extractInstagramCode,
  detectMediaType,
  parseMediaUrl,
  resolveGalleryCardThumbnail,
  resolveGalleryEmbedUrl,
}

function wrapWithImageProxy(imageUrl: string): string {
  const trimmed = imageUrl.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('/api/image-proxy')) return trimmed
  return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`
}

async function fetchMicrolinkThumbnail(cleanUrl: string): Promise<string | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 7000)
  try {
    const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) return null
    const payload = (await response.json()) as {
      status?: string
      data?: { image?: { url?: string }; logo?: { url?: string } }
    }
    const imageUrl = payload?.data?.image?.url
    if (imageUrl && /^https?:\/\//i.test(imageUrl)) {
      return wrapWithImageProxy(imageUrl)
    }
    return null
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Server-side helper to extract thumbnail from TikTok, Instagram Reels, or YouTube URLs
 */
export async function extractExternalMediaThumbnail(sourceUrl: string): Promise<string | null> {
  if (!sourceUrl || typeof sourceUrl !== 'string') return null
  const raw = sourceUrl.trim()
  if (!raw) return null

  // 1. YouTube check (keep query params for watch?v=...)
  const ytId = extractYouTubeId(raw)
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
  }

  // Strip tracking query parameters (?vrfl=..., ?_r=1&_t=...) for TikTok & Instagram
  const cleanUrl = raw.split('?')[0].replace(/\/+$/, '')

  // 2. TikTok extraction: oEmbed primary -> Microlink fallback
  if (/tiktok\.com/i.test(cleanUrl)) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    try {
      const oembedEndpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`
      const response = await fetch(oembedEndpoint, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      })
      if (response.ok) {
        const data = (await response.json()) as { thumbnail_url?: string }
        if (data?.thumbnail_url) {
          return wrapWithImageProxy(String(data.thumbnail_url))
        }
      }
    } catch {
      // Fall through to Microlink fallback
    } finally {
      clearTimeout(timeout)
    }

    return await fetchMicrolinkThumbnail(cleanUrl)
  }

  // 3. Instagram Reels / Post extraction: OpenGraph meta primary -> Microlink fallback
  if (/instagram\.com/i.test(cleanUrl)) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    try {
      const response = await fetch(`${cleanUrl}/`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'facebookexternalhit/1.1',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      })
      if (response.ok) {
        const html = await response.text()
        const ogMatch =
          html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
        if (ogMatch && ogMatch[1]) {
          const decodedUrl = ogMatch[1].replace(/&amp;/g, '&').trim()
          if (/^https?:\/\//i.test(decodedUrl)) {
            return wrapWithImageProxy(decodedUrl)
          }
        }
      }
    } catch {
      // Fall through to Microlink fallback
    } finally {
      clearTimeout(timeout)
    }

    return await fetchMicrolinkThumbnail(cleanUrl)
  }

  // 4. Generic fallback via Microlink
  return await fetchMicrolinkThumbnail(cleanUrl)
}

/**
 * Backwards-compatible alias used by gallery POST/PUT endpoints
 */
export async function fetchTikTokOembedThumbnail(sourceUrl: string): Promise<string | null> {
  return await extractExternalMediaThumbnail(sourceUrl)
}

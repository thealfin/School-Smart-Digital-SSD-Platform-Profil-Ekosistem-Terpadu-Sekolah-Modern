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

/**
 * Server-side helper to fetch TikTok oEmbed thumbnail_url automatically when not provided
 */
export async function fetchTikTokOembedThumbnail(sourceUrl: string): Promise<string | null> {
  if (!sourceUrl || !/tiktok\.com/i.test(sourceUrl)) return null
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4500)
  try {
    const oembedEndpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(sourceUrl.split('?')[0])}`
    const response = await fetch(oembedEndpoint, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SchoolSmartDigitalBot/1.0)',
        Accept: 'application/json',
      },
    })
    if (!response.ok) return null
    const data = (await response.json()) as { thumbnail_url?: string }
    return data?.thumbnail_url ? String(data.thumbnail_url).trim() : null
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}


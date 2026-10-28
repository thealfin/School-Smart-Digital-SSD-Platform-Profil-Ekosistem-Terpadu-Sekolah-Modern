export type GalleryMediaType = 'image' | 'youtube' | 'tiktok' | 'instagram'

export interface ParsedMediaResult {
  mediaType: GalleryMediaType
  videoId: string | null
  sourceUrl: string
  embedUrl: string | null
  autoThumbnailUrl: string | null
  aspectRatio: '16:9' | '9:16'
  platformLabel: string
}

/**
 * Extract YouTube Video ID from watch, youtu.be, shorts, or embed URLs
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  )
  return match?.[1] || null
}

/**
 * Extract TikTok Video ID from @user/video/{id} or /v/{id} or /player/v1/{id}
 */
export function extractTikTokId(url: string): string | null {
  if (!url) return null
  const match = url.match(/tiktok\.com\/(?:@[^/?#]+\/video\/|v\/|player\/v1\/)(\d+)/i)
  return match?.[1] || null
}

/**
 * Extract Instagram Reel / Post shortcode from /reel/{code}, /reels/{code}, or /p/{code}
 */
export function extractInstagramCode(url: string): string | null {
  if (!url) return null
  const match = url.match(/instagram\.com\/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/i)
  return match?.[1] || null
}

/**
 * Automatically detect media_type from a given URL
 */
export function detectMediaType(url: string, explicitType?: string | null): GalleryMediaType {
  const cleanUrl = (url || '').trim()
  if (extractYouTubeId(cleanUrl) || /youtube\.com|youtu\.be/i.test(cleanUrl)) {
    return 'youtube'
  }
  if (extractTikTokId(cleanUrl) || /tiktok\.com/i.test(cleanUrl)) {
    return 'tiktok'
  }
  if (extractInstagramCode(cleanUrl) || /instagram\.com\/(?:reel|reels|p)\//i.test(cleanUrl)) {
    return 'instagram'
  }
  if (
    explicitType === 'youtube' ||
    explicitType === 'tiktok' ||
    explicitType === 'instagram' ||
    explicitType === 'image'
  ) {
    return explicitType
  }
  return 'image'
}

/**
 * Parse a media URL into structured embed URL, auto-thumbnail, and metadata
 */
export function parseMediaUrl(
  rawUrl: string,
  explicitType?: string | null,
  customThumbnailUrl?: string | null
): ParsedMediaResult {
  const sourceUrl = (rawUrl || '').trim()
  const customThumb = (customThumbnailUrl || '').trim() || null
  const mediaType = detectMediaType(sourceUrl, explicitType)

  if (mediaType === 'youtube') {
    const videoId = extractYouTubeId(sourceUrl)
    const isShorts = /youtube\.com\/shorts\//i.test(sourceUrl)
    return {
      mediaType: 'youtube',
      videoId,
      sourceUrl,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null,
      autoThumbnailUrl: customThumb || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null),
      aspectRatio: isShorts ? '9:16' : '16:9',
      platformLabel: 'YouTube',
    }
  }

  if (mediaType === 'tiktok') {
    const videoId = extractTikTokId(sourceUrl)
    return {
      mediaType: 'tiktok',
      videoId,
      sourceUrl,
      embedUrl: videoId ? `https://www.tiktok.com/player/v1/${videoId}?autoplay=1` : null,
      autoThumbnailUrl: customThumb,
      aspectRatio: '9:16',
      platformLabel: 'TikTok',
    }
  }

  if (mediaType === 'instagram') {
    const code = extractInstagramCode(sourceUrl)
    return {
      mediaType: 'instagram',
      videoId: code,
      sourceUrl,
      embedUrl: code ? `https://www.instagram.com/reel/${code}/embed` : null,
      autoThumbnailUrl: customThumb,
      aspectRatio: '9:16',
      platformLabel: 'Reels',
    }
  }

  return {
    mediaType: 'image',
    videoId: null,
    sourceUrl,
    embedUrl: null,
    autoThumbnailUrl: customThumb || sourceUrl || null,
    aspectRatio: '16:9',
    platformLabel: 'Foto',
  }
}

/**
 * Resolve thumbnail URL for a gallery card following strict priority:
 * 1. thumbnail_url / thumbnailUrl (if non-empty and not a raw video page link)
 * 2. YouTube auto-thumbnail (if media_type === 'youtube')
 * 3. source_url / imageUrl (only if media_type === 'image')
 * 4. null (triggers elegant dark branded placeholder for TikTok / Instagram Reels)
 */
export function resolveGalleryCardThumbnail(item: Record<string, any>): string | null {
  if (!item) return null
  const sourceUrl = String(item.sourceUrl || item.source_url || item.imageUrl || item.image_url || '').trim()
  const rawThumb = String(item.thumbnailUrl || item.thumbnail_url || '').trim()
  const mediaType = detectMediaType(sourceUrl, item.mediaType || item.media_type)

  const isVideoPageLink = (u: string) =>
    /tiktok\.com\/@|tiktok\.com\/v\/|instagram\.com\/(?:reel|reels|p)\/|youtube\.com\/watch|youtu\.be\//i.test(u)

  const ensureProxyIfNeeded = (u: string) => {
    if (!u) return u
    if (u.startsWith('/api/image-proxy')) return u
    if (/cdninstagram\.com|fbcdn\.net|tiktokcdn/i.test(u)) {
      return `/api/image-proxy?url=${encodeURIComponent(u)}`
    }
    return u
  }

  if (rawThumb && !isVideoPageLink(rawThumb)) {
    return ensureProxyIfNeeded(rawThumb)
  }

  if (mediaType === 'youtube') {
    const ytId = extractYouTubeId(sourceUrl)
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
  }

  if (mediaType === 'image') {
    const fallbackImg = String(item.imageUrl || item.image_url || sourceUrl).trim()
    return fallbackImg ? ensureProxyIfNeeded(fallbackImg) : null
  }

  // If imageUrl was populated with an actual image CDN URL (e.g. from TikTok oEmbed), use it
  const legacyImg = String(item.imageUrl || item.image_url || '').trim()
  if (legacyImg && legacyImg !== sourceUrl && !isVideoPageLink(legacyImg)) {
    return ensureProxyIfNeeded(legacyImg)
  }

  return null
}

/**
 * Resolve official iframe embed URL when opening the interactive modal player
 */
export function resolveGalleryEmbedUrl(item: Record<string, any>): string | null {
  if (!item) return null
  const sourceUrl = String(item.sourceUrl || item.source_url || item.imageUrl || item.image_url || '').trim()
  const parsed = parseMediaUrl(sourceUrl, item.mediaType || item.media_type, item.thumbnailUrl || item.thumbnail_url)
  return parsed.embedUrl
}


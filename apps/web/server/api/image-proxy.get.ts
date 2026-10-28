import { defineEventHandler, getQuery, setHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawUrl = typeof query.url === 'string' ? query.url.trim() : ''

  if (!rawUrl || !/^https?:\/\//i.test(rawUrl)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Valid image URL parameter is required.',
    })
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(rawUrl)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Malformed image URL.',
    })
  }

  const isInstagram = /instagram\.com|fbcdn\.net/i.test(parsedUrl.hostname)
  const isTikTok = /tiktokcdn|tiktok\.com|ibytedtos/i.test(parsedUrl.hostname)

  const referer = isInstagram
    ? 'https://www.instagram.com/'
    : isTikTok
      ? 'https://www.tiktok.com/'
      : `${parsedUrl.protocol}//${parsedUrl.host}/`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(rawUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        Referer: referer,
      },
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Upstream Image Error',
        message: `Failed to fetch upstream image (${response.status})`,
      })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const arrayBuffer = await response.arrayBuffer()

    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cross-Origin-Resource-Policy', 'cross-origin')
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(
      event,
      'Cache-Control',
      'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
    )

    return new Uint8Array(arrayBuffer)
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message: 'Unable to proxy external image.',
    })
  } finally {
    clearTimeout(timeout)
  }
})


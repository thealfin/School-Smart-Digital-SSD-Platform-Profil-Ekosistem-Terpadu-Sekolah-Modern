import { defineEventHandler, readBody, createError } from 'h3'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'
import { parseMediaUrl, extractExternalMediaThumbnail } from '../../../utils/mediaParser'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const title = String(body.title || '').trim()
  const rawSourceUrl = String(body.sourceUrl || body.source_url || body.imageUrl || body.image_url || '').trim()

  if (!title || !rawSourceUrl) {
    throw createError({ statusCode: 400, message: 'Judul kegiatan dan URL sumber media wajib diisi.' })
  }

  const rawThumb = body.thumbnailUrl || body.thumbnail_url ? String(body.thumbnailUrl || body.thumbnail_url).trim() : null
  const parsed = parseMediaUrl(rawSourceUrl, body.mediaType || body.media_type, rawThumb)

  let finalThumbnailUrl = parsed.autoThumbnailUrl

  // Auto-fetch TikTok or Instagram Reels thumbnail if thumbnail_url is empty
  if ((parsed.mediaType === 'tiktok' || parsed.mediaType === 'instagram') && !finalThumbnailUrl) {
    finalThumbnailUrl = await extractExternalMediaThumbnail(rawSourceUrl)
  }

  const category = body.category ? String(body.category).trim() : 'bimtek'
  const description = body.description ? String(body.description).trim() : null
  const location = body.location ? String(body.location).trim() : null
  const orderIndex = Number(body.orderIndex || 0)
  const isPublished = Boolean(body.isPublished ?? true)

  const db = useDb()
  const [created] = await db
    .insert(schema.galleries)
    .values({
      title,
      category,
      mediaType: parsed.mediaType,
      sourceUrl: rawSourceUrl,
      thumbnailUrl: finalThumbnailUrl,
      imageUrl: finalThumbnailUrl || rawSourceUrl,
      description,
      location,
      orderIndex,
      isPublished,
    })
    .returning()

  return { item: created }
})

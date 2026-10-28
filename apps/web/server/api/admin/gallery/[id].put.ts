import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'
import { parseMediaUrl, extractExternalMediaThumbnail } from '../../../utils/mediaParser'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID dokumentasi diperlukan.' })

  const body = await readBody(event)
  const title = String(body.title || '').trim()
  const rawSourceUrl = String(body.sourceUrl || body.source_url || body.imageUrl || body.image_url || '').trim()

  if (!title || !rawSourceUrl) {
    throw createError({ statusCode: 400, message: 'Judul kegiatan dan URL sumber media wajib diisi.' })
  }

  const rawThumb = body.thumbnailUrl !== undefined || body.thumbnail_url !== undefined
    ? String(body.thumbnailUrl ?? body.thumbnail_url ?? '').trim() || null
    : null

  const parsed = parseMediaUrl(rawSourceUrl, body.mediaType || body.media_type, rawThumb)
  let finalThumbnailUrl = parsed.autoThumbnailUrl

  if ((parsed.mediaType === 'tiktok' || parsed.mediaType === 'instagram') && !finalThumbnailUrl) {
    finalThumbnailUrl = await extractExternalMediaThumbnail(rawSourceUrl)
  }

  const db = useDb()
  const [updated] = await db
    .update(schema.galleries)
    .set({
      title,
      category: body.category ? String(body.category).trim() : 'bimtek',
      mediaType: parsed.mediaType,
      sourceUrl: rawSourceUrl,
      thumbnailUrl: finalThumbnailUrl,
      imageUrl: finalThumbnailUrl || rawSourceUrl,
      description: body.description !== undefined ? (String(body.description).trim() || null) : null,
      location: body.location !== undefined ? (String(body.location).trim() || null) : null,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      updatedAt: new Date(),
    })
    .where(eq(schema.galleries.id, id))
    .returning()

  return { item: updated }
})


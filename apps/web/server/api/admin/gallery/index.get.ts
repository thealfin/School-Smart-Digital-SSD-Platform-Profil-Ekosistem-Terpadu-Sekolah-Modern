import { defineEventHandler } from 'h3'
import { asc, desc } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'
import { detectMediaType, resolveGalleryCardThumbnail } from '../../../utils/mediaParser'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = useDb()

  const rows = await db
    .select()
    .from(schema.galleries)
    .orderBy(asc(schema.galleries.orderIndex), desc(schema.galleries.createdAt))

  const items = rows.map((row) => {
    const sourceUrl = row.sourceUrl || row.imageUrl
    const mediaType = detectMediaType(sourceUrl, row.mediaType)
    const thumbnailUrl = resolveGalleryCardThumbnail({ ...row, sourceUrl, mediaType })
    return {
      ...row,
      mediaType,
      media_type: mediaType,
      sourceUrl,
      source_url: sourceUrl,
      thumbnailUrl,
      thumbnail_url: thumbnailUrl,
      imageUrl: thumbnailUrl || row.imageUrl || sourceUrl,
    }
  })

  return { items }
})

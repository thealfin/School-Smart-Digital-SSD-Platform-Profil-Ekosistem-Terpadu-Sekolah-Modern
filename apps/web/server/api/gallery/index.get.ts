import { defineEventHandler, getQuery } from 'h3'
import { asc, eq, and } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../utils/db'
import { detectMediaType, resolveGalleryCardThumbnail } from '../../utils/mediaParser'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = typeof query.category === 'string' && query.category !== 'all' ? query.category : undefined

  const db = useDb()
  const conditions = [eq(schema.galleries.isPublished, true)]

  if (category) {
    conditions.push(eq(schema.galleries.category, category))
  }

  const rows = await db
    .select()
    .from(schema.galleries)
    .where(and(...conditions))
    .orderBy(asc(schema.galleries.orderIndex), asc(schema.galleries.createdAt))

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

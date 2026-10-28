import { defineEventHandler, getQuery, setHeader, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../utils/db'
import { detectMediaType, extractExternalMediaThumbnail } from '../utils/mediaParser'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawUrl = typeof query.url === 'string' ? query.url.trim() : ''
  const itemId = typeof query.id === 'string' ? query.id.trim() : ''

  if (!rawUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Parameter url wajib diisi.',
    })
  }

  const mediaType = detectMediaType(rawUrl)
  const thumbnailUrl = await extractExternalMediaThumbnail(rawUrl)

  // If an item id is provided and we successfully extracted a thumbnail, persist it to DB
  if (itemId && thumbnailUrl) {
    try {
      const db = useDb()
      await db
        .update(schema.galleries)
        .set({
          thumbnailUrl,
          imageUrl: thumbnailUrl,
          updatedAt: new Date(),
        })
        .where(eq(schema.galleries.id, itemId))
    } catch {
      // Non-blocking DB update
    }
  }

  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  return {
    url: rawUrl,
    mediaType,
    thumbnailUrl,
  }
})


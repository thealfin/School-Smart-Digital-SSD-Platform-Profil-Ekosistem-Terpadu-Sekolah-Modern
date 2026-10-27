import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID diperlukan' })

  const body = await readBody(event)
  const db = useDb()

  const updateData: Partial<typeof schema.newsArticles.$inferInsert> = {
    updatedAt: new Date(),
  }

  if (body.title !== undefined) updateData.title = String(body.title).trim()
  if (body.slug !== undefined && String(body.slug).trim()) {
    updateData.slug = String(body.slug)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  if (body.summary !== undefined) updateData.summary = String(body.summary).trim() || null
  if (body.content !== undefined) updateData.content = String(body.content).trim()

  const meta = body.meta && typeof body.meta === 'object' ? body.meta : undefined
  if (meta !== undefined) {
    updateData.meta = meta
  }

  if (body.category !== undefined) {
    updateData.category = String(body.category).trim()
  } else if (meta?.category_name) {
    updateData.category = String(meta.category_name).trim()
  }

  if (body.coverImageUrl !== undefined || body.image_url !== undefined || body.featured_image !== undefined) {
    const rawCover = body.coverImageUrl ?? body.image_url ?? body.featured_image ?? ''
    updateData.coverImageUrl = String(rawCover).trim() || null
  }

  if (body.author !== undefined || meta?.author_name !== undefined) {
    updateData.author = String(body.author || meta?.author_name || 'Tim SSD').trim()
  }

  if (body.isPublished !== undefined || body.is_published !== undefined) {
    updateData.isPublished = Boolean(body.isPublished ?? body.is_published)
  }

  const [updated] = await db
    .update(schema.newsArticles)
    .set(updateData)
    .where(eq(schema.newsArticles.id, id))
    .returning()

  return { article: updated }
})

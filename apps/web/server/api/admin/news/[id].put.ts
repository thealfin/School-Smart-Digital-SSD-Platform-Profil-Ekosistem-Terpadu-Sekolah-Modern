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
  if (body.summary !== undefined) updateData.summary = String(body.summary).trim()
  if (body.content !== undefined) updateData.content = String(body.content).trim()
  if (body.category !== undefined) updateData.category = String(body.category).trim()
  if (body.coverImageUrl !== undefined) updateData.coverImageUrl = String(body.coverImageUrl).trim()
  if (body.isPublished !== undefined) updateData.isPublished = Boolean(body.isPublished)

  const [updated] = await db
    .update(schema.newsArticles)
    .set(updateData)
    .where(eq(schema.newsArticles.id, id))
    .returning()

  return { article: updated }
})


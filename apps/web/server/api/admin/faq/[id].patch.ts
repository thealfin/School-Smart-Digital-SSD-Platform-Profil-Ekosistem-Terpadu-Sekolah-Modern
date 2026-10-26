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

  const updateData: Partial<typeof schema.faqs.$inferInsert> = {
    updatedAt: new Date(),
  }

  if (body.question !== undefined) updateData.question = String(body.question).trim()
  if (body.answer !== undefined) updateData.answer = String(body.answer).trim()
  if (body.category !== undefined) updateData.category = String(body.category).trim()
  if (body.orderIndex !== undefined) updateData.orderIndex = Number(body.orderIndex)
  if (body.isPublished !== undefined) updateData.isPublished = Boolean(body.isPublished)

  const [updated] = await db
    .update(schema.faqs)
    .set(updateData)
    .where(eq(schema.faqs.id, id))
    .returning()

  return { faq: updated }
})


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

  const updateData: Partial<typeof schema.feedbacks.$inferInsert> = {
    updatedAt: new Date(),
  }

  if (body.isRead !== undefined) updateData.isRead = Boolean(body.isRead)
  if (body.notes !== undefined) updateData.notes = String(body.notes)

  const [updated] = await db
    .update(schema.feedbacks)
    .set(updateData)
    .where(eq(schema.feedbacks.id, id))
    .returning()

  return { message: updated }
})


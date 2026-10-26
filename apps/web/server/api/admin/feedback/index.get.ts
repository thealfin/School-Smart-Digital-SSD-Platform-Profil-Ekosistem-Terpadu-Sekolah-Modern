import { defineEventHandler } from 'h3'
import { desc } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = useDb()

  const messages = await db
    .select()
    .from(schema.feedbacks)
    .orderBy(desc(schema.feedbacks.createdAt))

  return { messages }
})


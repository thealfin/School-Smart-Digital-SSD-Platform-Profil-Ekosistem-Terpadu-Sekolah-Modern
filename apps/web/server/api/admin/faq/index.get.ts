import { defineEventHandler } from 'h3'
import { asc } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = useDb()

  const faqs = await db
    .select()
    .from(schema.faqs)
    .orderBy(asc(schema.faqs.orderIndex))

  return { faqs }
})


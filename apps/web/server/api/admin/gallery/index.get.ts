import { defineEventHandler } from 'h3'
import { asc, desc } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = useDb()

  const items = await db
    .select()
    .from(schema.galleries)
    .orderBy(asc(schema.galleries.orderIndex), desc(schema.galleries.createdAt))

  return { items }
})


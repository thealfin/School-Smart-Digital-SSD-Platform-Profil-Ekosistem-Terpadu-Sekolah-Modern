import { defineEventHandler, getQuery } from 'h3'
import { asc, eq, and } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = typeof query.category === 'string' && query.category !== 'all' ? query.category : undefined

  const db = useDb()
  const conditions = [eq(schema.galleries.isPublished, true)]

  if (category) {
    conditions.push(eq(schema.galleries.category, category))
  }

  const items = await db
    .select()
    .from(schema.galleries)
    .where(and(...conditions))
    .orderBy(asc(schema.galleries.orderIndex), asc(schema.galleries.createdAt))

  return { items }
})


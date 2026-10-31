import { defineEventHandler, setResponseHeaders } from 'h3'
import { asc, eq, and } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { getSafeDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  })

  try {
    const db = getSafeDb()
    if (!db) {
      return { testimonials: [] }
    }

    const rows = await db
      .select()
      .from(schema.testimonials)
      .where(and(eq(schema.testimonials.isPublished, true), eq(schema.testimonials.archived, false)))
      .orderBy(asc(schema.testimonials.orderIndex), asc(schema.testimonials.createdAt))

    return { testimonials: rows || [] }
  } catch {
    return { testimonials: [] }
  }
})


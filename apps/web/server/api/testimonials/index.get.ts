import { defineEventHandler } from 'h3'
import { asc, eq, and } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { testimonials as fallbackTestimonials } from '@ssd/shared/content'
import { getSafeDb } from '../../utils/db'

export default defineEventHandler(async () => {
  try {
    const db = getSafeDb()
    if (!db) {
      return { testimonials: fallbackTestimonials }
    }

    const rows = await db
      .select()
      .from(schema.testimonials)
      .where(and(eq(schema.testimonials.isPublished, true), eq(schema.testimonials.archived, false)))
      .orderBy(asc(schema.testimonials.orderIndex), asc(schema.testimonials.createdAt))

    if (!rows || rows.length === 0) {
      return { testimonials: fallbackTestimonials }
    }

    return { testimonials: rows }
  } catch {
    return { testimonials: fallbackTestimonials }
  }
})


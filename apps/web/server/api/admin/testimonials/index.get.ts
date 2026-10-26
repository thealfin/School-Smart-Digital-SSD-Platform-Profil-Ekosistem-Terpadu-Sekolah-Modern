import { defineEventHandler, getQuery } from 'h3'
import { desc, asc, eq, and, ilike, or } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = useDb()
  const query = getQuery(event)
  const search = query.search ? String(query.search).trim() : ''

  let baseQuery = db
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.archived, false))

  const rows = await baseQuery
    .orderBy(asc(schema.testimonials.orderIndex), desc(schema.testimonials.createdAt))

  const filtered = search
    ? rows.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.organization && r.organization.toLowerCase().includes(search.toLowerCase())) ||
        (r.roleTitle && r.roleTitle.toLowerCase().includes(search.toLowerCase()))
      )
    : rows

  return { testimonials: filtered }
})


import { defineEventHandler, getQuery } from 'h3'
import { desc, eq, and, sql, or, ilike } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const offset = (page - 1) * limit

  const status = typeof query.status === 'string' && query.status !== 'all' ? query.status : undefined
  const search = typeof query.q === 'string' && query.q.trim() ? query.q.trim() : undefined

  const db = useDb()
  const conditions = [eq(schema.leads.archived, false)]

  if (status) {
    conditions.push(eq(schema.leads.status, status as any))
  }

  if (search) {
    const searchPattern = `%${search}%`
    conditions.push(
      or(
        ilike(schema.leads.name, searchPattern),
        ilike(schema.leads.organization, searchPattern),
        ilike(schema.leads.whatsapp, searchPattern),
        ilike(schema.leads.email, searchPattern)
      )!
    )
  }

  const whereClause = and(...conditions)

  const [totalRes, leadsList] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.leads)
      .where(whereClause),
    db
      .select()
      .from(schema.leads)
      .where(whereClause)
      .orderBy(desc(schema.leads.createdAt))
      .limit(limit)
      .offset(offset),
  ])

  const total = totalRes[0]?.count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    ok: true,
    leads: leadsList,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  }
})

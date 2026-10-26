import { defineEventHandler, getQuery } from 'h3'
import { desc, eq, and, or, ilike } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = typeof query.category === 'string' && query.category !== 'all' ? query.category : undefined
  const search = typeof query.q === 'string' && query.q.trim() ? query.q.trim() : undefined
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12))

  const db = useDb()
  const conditions = [eq(schema.newsArticles.isPublished, true)]

  if (category) {
    conditions.push(eq(schema.newsArticles.category, category))
  }

  if (search) {
    const pattern = `%${search}%`
    conditions.push(
      or(
        ilike(schema.newsArticles.title, pattern),
        ilike(schema.newsArticles.summary, pattern),
        ilike(schema.newsArticles.content, pattern)
      )!
    )
  }

  const articles = await db
    .select()
    .from(schema.newsArticles)
    .where(and(...conditions))
    .orderBy(desc(schema.newsArticles.publishedAt), desc(schema.newsArticles.createdAt))
    .limit(limit)

  return { articles }
})


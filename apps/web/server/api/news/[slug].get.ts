import { defineEventHandler, getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug diperlukan' })
  }

  const db = useDb()
  const [article] = await db
    .select()
    .from(schema.newsArticles)
    .where(eq(schema.newsArticles.slug, slug))
    .limit(1)

  if (!article || !article.isPublished) {
    throw createError({ statusCode: 404, message: 'Berita atau artikel tidak ditemukan' })
  }

  return { article }
})


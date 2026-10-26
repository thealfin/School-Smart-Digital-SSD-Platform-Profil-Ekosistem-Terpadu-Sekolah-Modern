import { defineEventHandler, readBody, createError } from 'h3'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const title = String(body.title || '').trim()
  if (!title) {
    throw createError({ statusCode: 400, message: 'Judul berita wajib diisi.' })
  }

  const rawSlug = String(body.slug || title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const slug = rawSlug || `berita-${Date.now()}`
  const summary = body.summary ? String(body.summary).trim() : null
  const content = body.content ? String(body.content).trim() : ''
  const category = body.category ? String(body.category).trim() : 'Berita'
  const coverImageUrl = body.coverImageUrl ? String(body.coverImageUrl).trim() : null
  const author = body.author ? String(body.author).trim() : 'Tim SSD'
  const isPublished = Boolean(body.isPublished ?? true)

  const db = useDb()
  const [created] = await db
    .insert(schema.newsArticles)
    .values({
      slug,
      title,
      summary,
      content,
      category,
      coverImageUrl,
      author,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    })
    .returning()

  return { article: created }
})


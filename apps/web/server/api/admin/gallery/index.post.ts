import { defineEventHandler, readBody, createError } from 'h3'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const title = String(body.title || '').trim()
  const imageUrl = String(body.imageUrl || '').trim()
  if (!title || !imageUrl) {
    throw createError({ statusCode: 400, message: 'Judul dan URL gambar wajib diisi.' })
  }

  const category = body.category ? String(body.category).trim() : 'bimtek'
  const description = body.description ? String(body.description).trim() : null
  const location = body.location ? String(body.location).trim() : null
  const orderIndex = Number(body.orderIndex) || 0
  const isPublished = Boolean(body.isPublished ?? true)

  const db = useDb()
  const [created] = await db
    .insert(schema.galleries)
    .values({
      title,
      imageUrl,
      category,
      description,
      location,
      orderIndex,
      isPublished,
    })
    .returning()

  return { item: created }
})


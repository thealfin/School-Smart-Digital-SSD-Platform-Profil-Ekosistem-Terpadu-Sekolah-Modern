import { defineEventHandler, readBody, createError } from 'h3'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const question = String(body.question || '').trim()
  const answer = String(body.answer || '').trim()
  if (!question || !answer) {
    throw createError({ statusCode: 400, message: 'Pertanyaan dan jawaban wajib diisi.' })
  }

  const category = body.category ? String(body.category).trim() : 'umum'
  const orderIndex = Number(body.orderIndex) || 0

  const db = useDb()
  const [created] = await db
    .insert(schema.faqs)
    .values({
      question,
      answer,
      category,
      orderIndex,
      isPublished: true,
      archived: false,
    })
    .returning()

  return { faq: created }
})


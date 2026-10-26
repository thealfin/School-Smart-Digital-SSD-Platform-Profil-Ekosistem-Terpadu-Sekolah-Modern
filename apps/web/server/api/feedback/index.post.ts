import { defineEventHandler, readBody, createError } from 'h3'
import { schema } from '@ssd/db'
import { useDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const senderName = String(body.senderName || body.name || '').trim()
  const senderEmail = String(body.senderEmail || body.email || '').trim()
  const senderPhone = String(body.senderPhone || body.phone || body.whatsapp || '').trim()
  const subject = String(body.subject || 'Pesan dari Website').trim()
  const message = String(body.message || '').trim()

  if (!senderName || !senderEmail || !message) {
    throw createError({
      statusCode: 400,
      message: 'Nama, email, dan pesan wajib diisi.',
    })
  }

  const db = useDb()
  const [created] = await db
    .insert(schema.feedbacks)
    .values({
      senderName,
      senderEmail,
      senderPhone: senderPhone || null,
      subject,
      message,
      isRead: false,
    })
    .returning()

  return { ok: true, id: created.id }
})


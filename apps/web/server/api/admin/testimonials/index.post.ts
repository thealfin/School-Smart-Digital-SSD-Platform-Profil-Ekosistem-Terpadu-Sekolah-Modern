import { defineEventHandler, readBody, createError } from 'h3'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'
import { purgeAppCache } from '../../../utils/cachePurge'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const name = String(body.name || '').trim()
  const content = String(body.content || '').trim()

  if (!name) {
    throw createError({ statusCode: 400, message: 'Nama klien wajib diisi.' })
  }
  if (!content) {
    throw createError({ statusCode: 400, message: 'Isi testimoni wajib diisi.' })
  }

  const roleTitle = body.roleTitle ? String(body.roleTitle).trim() : null
  const organization = body.organization ? String(body.organization).trim() : null
  const avatarUrl = body.avatarUrl ? String(body.avatarUrl).trim() : null
  const rating = Number.isInteger(Number(body.rating)) ? Math.max(1, Math.min(5, Number(body.rating))) : 5
  const isVerified = Boolean(body.isVerified ?? true)
  const isPublished = Boolean(body.isPublished ?? true)
  const orderIndex = Number(body.orderIndex) || 0

  const db = useDb()
  const [created] = await db
    .insert(schema.testimonials)
    .values({
      name,
      roleTitle,
      organization,
      content,
      avatarUrl,
      rating,
      isVerified,
      consentAt: isVerified ? new Date() : null,
      isPublished,
      orderIndex,
      archived: false,
    })
    .returning()

  // Auto purge homepage ISR cache
  await purgeAppCache()

  return { testimonial: created }
})


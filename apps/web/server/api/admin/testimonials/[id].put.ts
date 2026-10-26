import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID testimoni diperlukan.' })

  const body = await readBody(event)
  const db = useDb()

  const updateData: Partial<typeof schema.testimonials.$inferInsert> = {
    updatedAt: new Date(),
  }

  if (body.name !== undefined) updateData.name = String(body.name).trim()
  if (body.roleTitle !== undefined) updateData.roleTitle = String(body.roleTitle).trim()
  if (body.organization !== undefined) updateData.organization = String(body.organization).trim()
  if (body.content !== undefined) updateData.content = String(body.content).trim()
  if (body.avatarUrl !== undefined) updateData.avatarUrl = String(body.avatarUrl).trim()
  if (body.rating !== undefined) updateData.rating = Math.max(1, Math.min(5, Number(body.rating) || 5))
  if (body.isVerified !== undefined) {
    updateData.isVerified = Boolean(body.isVerified)
    if (updateData.isVerified) updateData.consentAt = new Date()
  }
  if (body.isPublished !== undefined) updateData.isPublished = Boolean(body.isPublished)
  if (body.orderIndex !== undefined) updateData.orderIndex = Number(body.orderIndex) || 0

  const [updated] = await db
    .update(schema.testimonials)
    .set(updateData)
    .where(eq(schema.testimonials.id, id))
    .returning()

  return { testimonial: updated }
})


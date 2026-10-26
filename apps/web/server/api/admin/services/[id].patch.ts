import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID diperlukan' })

  const body = await readBody(event)
  const db = useDb()

  const updateData: Partial<typeof schema.apps.$inferInsert> = {
    updatedAt: new Date(),
  }

  if (body.name !== undefined) updateData.name = String(body.name).trim()
  if (body.tagline !== undefined) updateData.tagline = String(body.tagline).trim()
  if (body.description !== undefined) updateData.description = String(body.description).trim()
  if (body.status !== undefined) updateData.status = body.status
  if (body.isPublished !== undefined) updateData.isPublished = Boolean(body.isPublished)

  const [updated] = await db
    .update(schema.apps)
    .set(updateData)
    .where(eq(schema.apps.id, id))
    .returning()

  return { app: updated }
})


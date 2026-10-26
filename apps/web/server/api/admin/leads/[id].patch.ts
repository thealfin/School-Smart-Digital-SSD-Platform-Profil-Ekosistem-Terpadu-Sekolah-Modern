import { defineEventHandler, getRouterParam, readValidatedBody, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { leadUpdateSchema } from '@ssd/shared'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID lead diperlukan' })
  }

  const body = await readValidatedBody(event, (b) => leadUpdateSchema.parse(b))

  const db = useDb()
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  }

  if (body.status !== undefined) {
    updateData.status = body.status
  }
  if (body.notes !== undefined) {
    updateData.notes = body.notes
  }
  if (body.assignedTo !== undefined) {
    updateData.assignedTo = body.assignedTo
  }

  const [updatedLead] = await db
    .update(schema.leads)
    .set(updateData)
    .where(eq(schema.leads.id, id))
    .returning()

  if (!updatedLead) {
    throw createError({ statusCode: 404, message: 'Lead tidak ditemukan' })
  }

  return {
    ok: true,
    lead: updatedLead,
  }
})

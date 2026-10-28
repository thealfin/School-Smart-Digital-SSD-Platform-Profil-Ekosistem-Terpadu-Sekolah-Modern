import { defineEventHandler, getRouterParam, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'
import { purgeAppCache } from '../../../utils/cachePurge'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID diperlukan' })

  const db = useDb()
  await db
    .delete(schema.testimonials)
    .where(eq(schema.testimonials.id, id))

  // Auto purge homepage ISR cache
  await purgeAppCache()

  return { success: true }
})


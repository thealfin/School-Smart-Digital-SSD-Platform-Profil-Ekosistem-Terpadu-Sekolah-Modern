import { defineEventHandler } from 'h3'
import { requireAdmin } from '../../utils/auth'
import { purgeAppCache } from '../../utils/cachePurge'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const result = await purgeAppCache()
  return result
})


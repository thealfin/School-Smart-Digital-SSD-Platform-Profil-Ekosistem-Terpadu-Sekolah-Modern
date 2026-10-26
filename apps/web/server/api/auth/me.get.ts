import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user || !(session.user as any).adminId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Sesi tidak ditemukan atau telah kedaluwarsa.',
    })
  }

  return {
    ok: true,
    user: session.user,
  }
})

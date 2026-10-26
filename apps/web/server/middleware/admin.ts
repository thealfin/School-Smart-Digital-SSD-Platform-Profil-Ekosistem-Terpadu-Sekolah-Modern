import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // Only intercept /api/admin/** routes
  if (!event.path.startsWith('/api/admin')) {
    return
  }

  const session = await getUserSession(event)
  if (!session?.user || !(session.user as any).adminId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Sesi admin tidak valid atau telah berakhir. Silakan login kembali.',
    })
  }

  event.context.admin = session.user
})

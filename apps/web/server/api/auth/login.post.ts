import { defineEventHandler, readValidatedBody, createError } from 'h3'
import { eq } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { authSchema } from '@ssd/shared'
import { useDb } from '../../utils/db'
import { verifyPassword } from '../../utils/auth'

const DUMMY_HASH = '$scrypt$n=16384,r=8,p=1$c29tZXNhbHQ$5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
const UNIFORM_AUTH_ERROR = 'Email atau kata sandi salah'

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, (b) => authSchema.parse(b))

  let db
  try {
    db = useDb()
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: 'Layanan database tidak tersedia. Silakan hubungi tim IT.',
    })
  }

  let admin: typeof schema.adminUsers.$inferSelect | undefined
  try {
    const rows = await db
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, email.toLowerCase().trim()))
      .limit(1)
    admin = rows[0]
  } catch (err: any) {
    // Retry once with a brief pause in case of serverless HTTP cold-start fetch failure
    try {
      await new Promise((r) => setTimeout(r, 800))
      const rows = await db
        .select()
        .from(schema.adminUsers)
        .where(eq(schema.adminUsers.email, email.toLowerCase().trim()))
        .limit(1)
      admin = rows[0]
    } catch (retryErr: any) {
      console.error('Database connection error in login:', retryErr?.message || retryErr)
      throw createError({
        statusCode: 503,
        statusMessage: 'Service Unavailable',
        message: 'Koneksi database Neon sedang sinkronisasi. Silakan coba beberapa detik lagi.',
      })
    }
  }

  // Anti-enumeration: if user not found, perform dummy verification to balance timing
  if (!admin) {
    await verifyPassword(DUMMY_HASH, password).catch(() => {})
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: UNIFORM_AUTH_ERROR,
    })
  }

  // Verify password with scrypt
  const isValid = await verifyPassword(admin.passwordHash, password)

  // Inactive admin or incorrect password returns uniform error
  if (!admin.isActive || !isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: UNIFORM_AUTH_ERROR,
    })
  }

  // Update last login timestamp in background
  event.waitUntil(
    db
      .update(schema.adminUsers)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.adminUsers.id, admin.id))
      .catch((err) => console.error('Failed to update lastLoginAt:', err))
  )

  // Establish sealed session via nuxt-auth-utils
  await setUserSession(event, {
    user: {
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
    loggedInAt: Date.now(),
  })

  return { ok: true }
})

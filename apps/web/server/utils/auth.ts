import { scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { Hash } from '@adonisjs/hash'
import { Scrypt } from '@adonisjs/hash/drivers/scrypt'
import type { H3Event } from 'h3'
import { createError } from 'h3'

const scryptAsync = promisify(scrypt)
const adonisScrypt = new Scrypt({})
const adonisHasher = new Hash(adonisScrypt)

export interface AdminSessionUser {
  adminId: string
  role: 'owner' | 'editor' | 'sales'
  name: string
  email: string
}

/**
 * Universal secure scrypt password verification.
 * Handles AdonisJS PHC format ($scrypt$...) and native Node.js crypto (salt:hash hex)
 * with constant-time equality checks.
 */
export async function verifyPassword(passwordHash: string, plainPassword: string): Promise<boolean> {
  if (!passwordHash || !plainPassword) return false

  // 1. If stored in standard PHC format ($scrypt$...)
  if (passwordHash.startsWith('$scrypt$')) {
    try {
      return await adonisHasher.verify(passwordHash, plainPassword)
    } catch {
      // Fallback if adonis format error
    }
  }

  // 2. If stored in native salt:hash (hex) format
  if (passwordHash.includes(':')) {
    try {
      const parts = passwordHash.split(':')
      if (parts.length === 2 && parts[0] && parts[1]) {
        const [saltHex, keyHex] = parts as [string, string]
        const salt = Buffer.from(saltHex, 'hex')
        const expectedKey = Buffer.from(keyHex, 'hex')
        const derivedKey = (await scryptAsync(plainPassword, salt, expectedKey.length)) as Buffer
        if (derivedKey.length !== expectedKey.length) return false
        return timingSafeEqual(derivedKey, expectedKey)
      }
    } catch {
      return false
    }
  }

  // 3. Fallback attempt using adonisHasher
  try {
    return await adonisHasher.verify(passwordHash, plainPassword)
  } catch {
    return false
  }
}

/**
 * Enforces admin session authentication in Nitro API event handlers.
 * Throws HTTP 401 if unauthenticated or session expired.
 */
export async function requireAdmin(event: H3Event): Promise<AdminSessionUser> {
  const session = await getUserSession(event)
  const user = session?.user as AdminSessionUser | undefined

  if (!user || !user.adminId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Sesi admin tidak valid atau telah berakhir.',
    })
  }

  return user
}

import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'
import { getRequestIP, createError } from 'h3'

export interface RateLimitOptions {
  maxRequests?: number
  windowMs?: number
  salt?: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  ipHash: string
}

// In-memory sliding window store: ipHash -> Array of timestamps (ms)
const rateLimitStore = new Map<string, number[]>()
let operationCount = 0

/**
 * Periodically prunes expired timestamps and empty IP buckets to prevent memory leaks.
 */
function pruneStaleEntries(windowMs: number, now: number): void {
  operationCount++
  if (operationCount < 500) return
  operationCount = 0

  for (const [hash, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter(ts => now - ts < windowMs)
    if (valid.length === 0) {
      rateLimitStore.delete(hash)
    } else {
      rateLimitStore.set(hash, valid)
    }
  }
}

/**
 * Produces a salted SHA-256 hash of the client IP address.
 * Never exposes or stores raw IP addresses.
 */
export function hashIp(eventOrIp: H3Event | string, customSalt?: string): string {
  let ip = '127.0.0.1'

  if (typeof eventOrIp === 'string') {
    ip = eventOrIp.trim() || '127.0.0.1'
  } else {
    try {
      ip = getRequestIP(eventOrIp, { xForwardedFor: true }) || '127.0.0.1'
    } catch {
      ip = '127.0.0.1'
    }
  }

  let salt = customSalt
  if (!salt) {
    try {
      salt = (useRuntimeConfig().ipHashSalt as string) || ''
    } catch {
      // Fallback if called outside Nuxt context
    }
  }
  if (!salt) {
    salt = process.env.NUXT_IP_HASH_SALT || 'ssd_salt_k37_secure_hash_string_2026_neon'
  }

  return createHash('sha256').update(ip + salt).digest('hex')
}

/**
 * Checks and records request submission within a sliding time window.
 * Default: 3 requests per 10 minutes (600,000 ms).
 */
export function checkRateLimit(
  eventOrIp: H3Event | string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const maxRequests = options.maxRequests ?? 3
  const windowMs = options.windowMs ?? 10 * 60 * 1000
  const ipHash = hashIp(eventOrIp, options.salt)
  const now = Date.now()

  pruneStaleEntries(windowMs, now)

  const existingTimestamps = rateLimitStore.get(ipHash) || []
  const validTimestamps = existingTimestamps.filter(ts => now - ts < windowMs)

  if (validTimestamps.length >= maxRequests) {
    rateLimitStore.set(ipHash, validTimestamps)
    return {
      allowed: false,
      remaining: 0,
      ipHash,
    }
  }

  validTimestamps.push(now)
  rateLimitStore.set(ipHash, validTimestamps)

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - validTimestamps.length),
    ipHash,
  }
}

/**
 * Enforces rate limiting on an H3 event.
 * Automatically throws HTTP 429 Too Many Requests if the limit is exceeded.
 */
export function enforceRateLimit(event: H3Event, options?: RateLimitOptions): { ipHash: string; remaining: number } {
  const result = checkRateLimit(event, options)
  if (!result.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Terlalu banyak permintaan. Silakan hubungi kami via WhatsApp.',
    })
  }
  return { ipHash: result.ipHash, remaining: result.remaining }
}

/**
 * Clears the rate limit store (used in testing and maintenance).
 */
export function resetRateLimiter(): void {
  rateLimitStore.clear()
  operationCount = 0
}

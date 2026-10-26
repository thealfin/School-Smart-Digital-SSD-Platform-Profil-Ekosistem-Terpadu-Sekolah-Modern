import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'
import { Hash } from '@adonisjs/hash'
import { Scrypt } from '@adonisjs/hash/drivers/scrypt'
import * as schema from './schema'

export * as schema from './schema'
export * from './schema'

export type Db = NeonHttpDatabase<typeof schema>

/**
 * Resolves the database connection string from environment variables in order of precedence:
 * 1. DATABASE_URL (Standard pooled runtime)
 * 2. NEON_DATABASE_URL (Alternative Neon env name)
 * 3. NUXT_DATABASE_URL (Nuxt runtime config env)
 * 4. DATABASE_URL_UNPOOLED (Direct connection for DDL / seeding)
 */
export function getDatabaseUrl(): string | undefined {
  const url =
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.NUXT_DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED
  return url?.trim() || undefined
}

/**
 * Creates a Drizzle database client backed by the Neon serverless HTTP driver.
 * Safe to call with an explicit URL or defaults to environment resolution.
 */
export function createDb(url?: string): Db {
  const connectionString = url?.trim() || getDatabaseUrl()
  if (!connectionString) {
    throw new Error(
      'Database connection URL is not set. Ensure DATABASE_URL or NEON_DATABASE_URL is defined.'
    )
  }
  const client: NeonQueryFunction<false, false> = neon(connectionString)
  return drizzle({ client, schema })
}

/**
 * Singleton database instance with resilient lazy evaluation.
 * Does NOT crash upon module import if connection string is missing during static builds.
 */
let _dbInstance: Db | null = null

export function getDb(): Db {
  if (!_dbInstance) {
    const url = getDatabaseUrl()
    if (!url) {
      throw new Error(
        'DATABASE_URL or NEON_DATABASE_URL is missing. Cannot establish database connection.'
      )
    }
    _dbInstance = createDb(url)
  }
  return _dbInstance
}

/**
 * Default lazy database client proxy.
 * Safe for use in Nitro server routes; initializes on first database operation.
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const instance = getDb()
    const value = Reflect.get(instance, prop, receiver)
    return typeof value === 'function' ? value.bind(instance) : value
  },
})

/**
 * Health check helper to verify database connectivity.
 * Returns true if database is reachable, false otherwise (without throwing).
 */
export async function checkDbConnection(client?: Db): Promise<boolean> {
  try {
    const targetDb = client || getDb()
    await targetDb.execute(sql`SELECT 1`)
    return true
  } catch {
    return false
  }
}

/**
 * Scrypt password hashing instance (cost: 16384, r: 8, p: 1).
 * Generates standard PHC string: $scrypt$ln=14,r=8,p=1$...
 */
const scryptDriver = new Scrypt({
  cost: 16384,
  blockSize: 8,
  parallelization: 1,
  saltSize: 16,
  keyLength: 64,
})
const hasher = new Hash(scryptDriver)

export async function hashPassword(plain: string): Promise<string> {
  return await hasher.make(plain)
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await hasher.verify(hash, plain)
  } catch {
    return false
  }
}

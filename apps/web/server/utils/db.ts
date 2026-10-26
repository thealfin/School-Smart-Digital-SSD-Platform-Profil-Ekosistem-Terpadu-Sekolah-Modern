import { createDb, type Db, schema } from '@ssd/db'
import { asc, eq } from 'drizzle-orm'
import { fallbackContent } from '@ssd/shared/content'
import type { LandingContent } from '@ssd/shared'

let _dbInstance: Db | null = null

/**
 * Resolves the singleton Neon PostgreSQL database client.
 * Uses runtimeConfig.databaseUrl or process.env fallbacks.
 */
export function useDb(): Db {
  if (_dbInstance) return _dbInstance

  let databaseUrl = ''
  try {
    const config = useRuntimeConfig()
    databaseUrl = (config.databaseUrl as string) || ''
  } catch {
    // Fallback if called outside active Nuxt context
  }

  if (!databaseUrl) {
    databaseUrl = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL || ''
  }

  if (!databaseUrl) {
    throw new Error('Database URL is not configured. Set NUXT_DATABASE_URL or DATABASE_URL.')
  }

  _dbInstance = createDb(databaseUrl)
  return _dbInstance
}

/**
 * Safely resolves the DB client without throwing. Returns null if unconfigured or unreachable.
 */
export function getSafeDb(): Db | null {
  try {
    return useDb()
  } catch {
    return null
  }
}

/**
 * Queries all landing content tables with relations.
 * Gracefully falls back to fallbackContent if the database is unreachable or empty.
 */
export async function fetchContentData(): Promise<{ content: LandingContent; isFallback: boolean }> {
  try {
    const db = useDb()
    const [
      dbApps,
      dbModuleGroups,
      dbRoleLevels,
      dbPainPoints,
      dbFlowSteps,
      dbComparisonRows,
      dbFaqs,
      dbSettings,
    ] = await Promise.all([
      db.query.apps.findMany({
        where: (a, { and, eq }) => and(eq(a.isPublished, true), eq(a.archived, false)),
        orderBy: (a, { asc }) => [asc(a.orderIndex)],
        with: {
          features: {
            orderBy: (f, { asc }) => [asc(f.orderIndex)],
          },
        },
      }),
      db.query.moduleGroups.findMany({
        where: (g, { eq }) => eq(g.archived, false),
        orderBy: (g, { asc }) => [asc(g.orderIndex)],
        with: {
          items: {
            orderBy: (i, { asc }) => [asc(i.orderIndex)],
          },
        },
      }),
      db.select().from(schema.roleLevels).orderBy(asc(schema.roleLevels.sortKey)),
      db.select().from(schema.painPoints).orderBy(asc(schema.painPoints.orderIndex)),
      db.query.flowSteps.findMany({
        orderBy: (s, { asc }) => [asc(s.stepNo)],
        with: { app: true },
      }),
      db.select().from(schema.comparisonRows).orderBy(asc(schema.comparisonRows.orderIndex)),
      db.select().from(schema.faqs)
        .where(eq(schema.faqs.isPublished, true))
        .orderBy(asc(schema.faqs.orderIndex)),
      db.select().from(schema.siteSettings),
    ])

    // If the database has not been seeded yet, return the static fallback payload
    if (!dbApps || dbApps.length === 0) {
      return { content: fallbackContent, isFallback: true }
    }

    const settingsMap = Object.fromEntries(dbSettings.map(s => [s.key, s.value]))

    const assembledContent: LandingContent = {
      apps: dbApps as unknown as LandingContent['apps'],
      moduleGroups: dbModuleGroups as unknown as LandingContent['moduleGroups'],
      roleLevels: dbRoleLevels as unknown as LandingContent['roleLevels'],
      painPoints: dbPainPoints as unknown as LandingContent['painPoints'],
      flowSteps: dbFlowSteps as unknown as LandingContent['flowSteps'],
      comparisonRows: dbComparisonRows as unknown as LandingContent['comparisonRows'],
      faqs: dbFaqs as unknown as LandingContent['faqs'],
      settings: settingsMap,
    }

    return { content: assembledContent, isFallback: false }
  } catch (error) {
    // Database connection timeout or offline: recover with complete static fallback
    return { content: fallbackContent, isFallback: true }
  }
}

import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const databaseUrl = (config.databaseUrl as string) || process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL || ''

  if (!databaseUrl) {
    return {
      connected: false,
      error: 'DATABASE_URL is not configured',
    }
  }

  try {
    const sql = neon(databaseUrl)
    const [response] = await sql`SELECT version(), current_database() as database`
    const [counts] = await sql`SELECT 
      (SELECT count(*)::int FROM apps) as apps_count,
      (SELECT count(*)::int FROM app_features) as features_count,
      (SELECT count(*)::int FROM faqs) as faqs_count`

    return {
      connected: true,
      database: response.database,
      version: response.version,
      stats: counts,
    }
  } catch (error: any) {
    return {
      connected: false,
      error: error.message,
    }
  }
})


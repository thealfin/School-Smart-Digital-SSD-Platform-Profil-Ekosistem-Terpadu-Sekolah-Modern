// Uji koneksi Neon + status skema. Jalankan: pnpm db:check
import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'

config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) })

const url = process.env.DATABASE_URL
if (!url) {
  console.error('✖ DATABASE_URL tidak ditemukan di .env root')
  process.exit(1)
}

const sql = neon(url)
try {
  const [v] = await sql`SELECT version() AS version, current_database() AS db`
  console.log('✔ Terhubung ke Neon')
  console.log('  Database :', v.db)
  console.log('  Versi    :', v.version)
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name`
  console.log(`  Tabel public (${tables.length}):`, tables.map((t) => t.table_name).join(', ') || '-')
  if (tables.some((t) => t.table_name === 'apps')) {
    const [c] = await sql`SELECT
      (SELECT count(*)::int FROM apps) AS apps,
      (SELECT count(*)::int FROM app_features) AS features,
      (SELECT count(*)::int FROM faqs) AS faqs,
      (SELECT count(*)::int FROM leads) AS leads,
      (SELECT count(*)::int FROM admin_users) AS admins`
    console.log('  Isi      :', c)
    const admins = await sql`SELECT email, name, role, is_active FROM admin_users`
    console.log('  Admin users:', admins)
  }
} catch (e) {
  console.error('✖ Gagal terhubung:', (e as Error).message)
  process.exit(1)
}


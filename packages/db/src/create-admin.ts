import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) })
config()
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { eq } from 'drizzle-orm'
import { createDb, hashPassword } from './index'
import * as schema from './schema'

/**
 * Parses command-line arguments formatted as --flag=value or --flag value
 */
function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=')
      if (eqIdx !== -1) {
        const key = arg.slice(2, eqIdx)
        const val = arg.slice(eqIdx + 1)
        result[key] = val
      } else if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        result[arg.slice(2)] = args[i + 1]
        i++
      }
    }
  }
  return result
}

async function run(): Promise<void> {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL or DATABASE_URL_UNPOOLED must be set.')
    process.exit(1)
  }

  const db = createDb(connectionString)
  const cliArgs = parseArgs(process.argv.slice(2))

  let email = (cliArgs.email || process.env.ADMIN_EMAIL)?.trim().toLowerCase()
  let password = cliArgs.password || process.env.ADMIN_PASSWORD
  let name = (cliArgs.name || process.env.ADMIN_NAME)?.trim()
  let role = ((cliArgs.role || process.env.ADMIN_ROLE)?.trim().toLowerCase() as 'owner' | 'editor' | 'sales') || 'owner'

  // If credentials are not provided via CLI or env, prompt interactively
  if (!email || !password || !name) {
    const rl = readline.createInterface({ input, output })
    try {
      if (!email) email = (await rl.question('Admin Email: ')).trim().toLowerCase()
      if (!name) name = (await rl.question('Admin Name: ')).trim()
      if (!password) password = await rl.question('Admin Password (min 8 chars): ')
      const roleInput = (await rl.question('Admin Role [owner/editor/sales] (default: owner): ')).trim().toLowerCase()
      if (roleInput && ['owner', 'editor', 'sales'].includes(roleInput)) {
        role = roleInput as 'owner' | 'editor' | 'sales'
      }
    } finally {
      rl.close()
    }
  }

  // Strict Validation
  if (!email || !email.includes('@') || !email.includes('.')) {
    console.error('❌ Error: Valid email address is required.')
    process.exit(1)
  }
  if (!password || password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long.')
    process.exit(1)
  }
  if (!name) {
    console.error('❌ Error: Name is required.')
    process.exit(1)
  }
  if (!['owner', 'editor', 'sales'].includes(role)) {
    console.error('❌ Error: Invalid role. Must be one of: owner, editor, sales.')
    process.exit(1)
  }

  console.log(`🔐 Hashing password with scrypt for ${email}...`)
  const passwordHash = await hashPassword(password)

  console.log(`🔍 Checking existing admin user for ${email}...`)
  const existing = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email))
    .limit(1)

  if (existing.length > 0) {
    console.log(`Updating existing admin user: ${email}`)
    await db
      .update(schema.adminUsers)
      .set({
        name,
        passwordHash,
        role,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.adminUsers.email, email))
  } else {
    console.log(`Creating new admin user: ${email} (${role})`)
    await db.insert(schema.adminUsers).values({
      email,
      name,
      passwordHash,
      role,
      isActive: true,
    })
  }

  console.log(`✔ Admin user ${email} successfully created/updated!`)
}

// Only execute when run directly from command line
const isCLI = process.argv[1] && (
  process.argv[1].endsWith('create-admin.ts') ||
  process.argv[1].endsWith('create-admin.js') ||
  process.argv[1].endsWith('create-admin.mjs')
)

if (isCLI) {
  run().catch((err) => {
    console.error('❌ Error creating admin:', err)
    process.exit(1)
  })
}

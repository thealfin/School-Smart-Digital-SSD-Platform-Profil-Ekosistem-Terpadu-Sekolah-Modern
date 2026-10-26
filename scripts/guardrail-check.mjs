import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const FORBIDDEN_PATTERNS = [
  {
    regex: /(?:guru123|walimurid123|bk123|cc123|bkdemo|cctv1|62811110\d{3}|62813001\d{3})/i,
    reason: 'Test credential or private phone leak detected'
  },
  {
    regex: /(?:MySCH|Smarteschool|Smart School Project|Sekolah Smart|Google Classroom|Dapodik)/i,
    reason: 'Direct competitor brand name detected (must use generic comparison)'
  },
  {
    regex: /(?:Super Admin Platform|Admin Keuangan Platform|Master Admin IT)/i,
    reason: 'Internal Cockpit platform detected (must not appear on public landing)'
  },
  {
    regex: /scsd\.my\.id/i,
    reason: 'Development domain scsd.my.id detected (must not be linked on public landing)'
  },
  {
    regex: /(?:98%\s*klien puas|aggregateRating)/i,
    reason: 'Unverified statistical claim or artificial rating schema detected'
  }
]

const DIRS_TO_SCAN = ['apps', 'packages', 'scripts']

let hasError = false

function scanDir(dir) {
  try {
    const entries = readdirSync(dir)
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.nuxt' || entry === '.output' || entry === 'dist' || entry.startsWith('.')) {
        continue
      }
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        scanDir(fullPath)
      } else if (stat.isFile() && /\.(vue|ts|js|mjs|json|css|html|md)$/i.test(entry)) {
        // Skip scanning guardrail-check itself for pattern definitions
        if (entry === 'guardrail-check.mjs') continue
        
        const content = readFileSync(fullPath, 'utf8')
        for (const rule of FORBIDDEN_PATTERNS) {
          const match = content.match(rule.regex)
          if (match) {
            console.error(`\x1b[31m[GUARDRAIL VIOLATION]\x1b[0m ${relative(process.cwd(), fullPath)}: ${rule.reason}`)
            console.error(`  Found matching text: "${match[0]}"`)
            hasError = true
          }
        }
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`Warning: Could not scan ${dir}:`, err.message)
    }
  }
}

console.log('Running SSD Guardrail Compliance Scan...')
for (const dir of DIRS_TO_SCAN) {
  scanDir(join(process.cwd(), dir))
}

if (hasError) {
  console.error('\n\x1b[31mGuardrail scan FAILED. Fix violations above before proceeding.\x1b[0m')
  process.exit(1)
} else {
  console.log('\x1b[32m✔ Guardrail scan PASSED: Codebase is clean of credentials, competitors, and internal leaks.\x1b[0m')
}

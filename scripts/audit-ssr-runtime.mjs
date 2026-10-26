import http from 'node:http'

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body
        })
      })
    })
    req.on('error', reject)
    if (data) {
      req.write(data)
    }
    req.end()
  })
}

async function runAudit() {
  console.log('=== AUDITING RUNTIME SSR SERVER ON PORT 39871 ===\n')

  // 1. GET /
  console.log('[1] Testing GET http://localhost:39871/ ...')
  const home = await request({
    hostname: 'localhost',
    port: 39871,
    path: '/',
    method: 'GET'
  })
  console.log(`Status Code: ${home.statusCode}`)
  console.log('Security Headers:')
  console.log(`  X-Frame-Options: ${home.headers['x-frame-options']}`)
  console.log(`  X-Content-Type-Options: ${home.headers['x-content-type-options']}`)
  console.log(`  Referrer-Policy: ${home.headers['referrer-policy']}`)
  console.log(`  Content-Security-Policy: ${home.headers['content-security-policy']?.slice(0, 80)}...`)

  // Verify H1
  const h1Match = home.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match) {
    const h1Text = h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    console.log(`Semantic <h1> tag found: ${h1Match[0]}`)
    console.log(`Semantic <h1> text: "${h1Text}"`)
    console.log(`H1 match check: ${h1Text === 'Sistem operasi untuk sekolah Anda.' ? 'PASS' : 'FAIL'}`)
  } else {
    console.log('Semantic <h1> tag found: NONE (FAIL)')
  }

  // Verify 12 apps in raw SSR HTML
  const appSlugs = [
    'back-office', 'pegawai', 'wali-murid', 'wali-kelas',
    'bk', 'absensi-tap', 'security-gate', 'command-center',
    'mitra-usaha', 'psb', 'layanan-terpadu', 'pimpinan'
  ]
  const missingApps = appSlugs.filter(slug => !home.body.includes(slug))
  console.log(`12 apps in SSR HTML: ${missingApps.length === 0 ? 'PASS (All 12 slugs present)' : 'FAIL: missing ' + missingApps.join(', ')}`)

  // Verify FAQ in raw SSR HTML
  const hasFaq = home.body.includes('id="faq"') && home.body.includes('Pertanyaan yang Sering Diajukan') && home.body.includes('faq-btn-0')
  console.log(`FAQ Accordion in SSR HTML: ${hasFaq ? 'PASS' : 'FAIL'}`)

  // Verify JSON-LD schemas in raw SSR HTML
  const hasJsonLd = home.body.includes('application/ld+json')
  console.log(`JSON-LD schema tag present: ${hasJsonLd ? 'PASS' : 'FAIL'}`)
  if (hasJsonLd) {
    const jsonLdMatches = [...home.body.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    console.log(`Found ${jsonLdMatches.length} JSON-LD block(s):`)
    for (let i = 0; i < jsonLdMatches.length; i++) {
      try {
        const parsed = JSON.parse(jsonLdMatches[i][1])
        const type = parsed['@type'] || (parsed['@graph'] ? 'Graph' : 'unknown')
        console.log(`  Block #${i+1}: Valid JSON (@type: ${type})`)
      } catch (e) {
        console.error(`  Block #${i+1}: JSON Parse Error:`, e.message)
      }
    }
  }

  // 2. GET /api/content
  console.log('\n[2] Testing GET http://localhost:39871/api/content ...')
  const content = await request({
    hostname: 'localhost',
    port: 39871,
    path: '/api/content',
    method: 'GET'
  })
  console.log(`Status Code: ${content.statusCode}`)
  console.log(`Cache-Control Header: ${content.headers['cache-control']}`)
  try {
    const json = JSON.parse(content.body)
    const keys = Object.keys(json)
    console.log(`Payload keys: ${keys.join(', ')}`)
    console.log(`Apps count: ${json.apps?.length} (expected 12)`)
    console.log(`FAQs count: ${json.faqs?.length} (expected 9)`)
  } catch (e) {
    console.error('Failed to parse JSON:', e.message)
  }

  // 3. POST /api/leads with honeypot website: "http://bot.com"
  console.log('\n[3] Testing POST http://localhost:39871/api/leads with honeypot ...')
  const leadPayload = JSON.stringify({
    name: 'Spam Bot',
    website: 'http://bot.com',
    whatsapp: '081234567890',
    organization: 'Bot Org',
    orgType: 'sekolah',
    consent: true
  })
  const honeypotRes = await request({
    hostname: 'localhost',
    port: 39871,
    path: '/api/leads',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(leadPayload)
    }
  }, leadPayload)
  console.log(`Status Code: ${honeypotRes.statusCode} (Expected 202: ${honeypotRes.statusCode === 202 ? 'PASS' : 'FAIL'})`)
  console.log(`Response Body: ${honeypotRes.body}`)

  // 4. GET /admin/login
  console.log('\n[4] Testing GET http://localhost:39871/admin/login ...')
  const adminLogin = await request({
    hostname: 'localhost',
    port: 39871,
    path: '/admin/login',
    method: 'GET'
  })
  console.log(`Status Code: ${adminLogin.statusCode}`)
  console.log(`X-Robots-Tag: ${adminLogin.headers['x-robots-tag']} (${adminLogin.headers['x-robots-tag'] === 'noindex, nofollow' ? 'PASS' : 'FAIL'})`)

  console.log('\n=== RUNTIME SSR SERVER AUDIT COMPLETE ===')
}

runAudit().catch(err => {
  console.error('Audit run failed:', err)
  process.exit(1)
})

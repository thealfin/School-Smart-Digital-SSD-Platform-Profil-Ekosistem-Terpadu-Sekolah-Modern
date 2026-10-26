import { spawn } from 'node:child_process'
import http from 'node:http'

const PORT = 3042
const serverProcess = spawn('node', ['apps/web/.output/server/index.mjs'], {
  env: { ...process.env, PORT: String(PORT), NITRO_PORT: String(PORT) },
  stdio: 'inherit'
})

function checkServer() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${PORT}/`, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }))
    })
    req.on('error', reject)
  })
}

async function run() {
  try {
    // Wait 2 seconds for server boot
    await new Promise(r => setTimeout(r, 2500))
    const res = await checkServer()
    console.log('HTTP Status:', res.statusCode)
    console.log('Body length:', res.body.length)
    console.log('Has H1 Sistem operasi?:', res.body.includes('Sistem operasi untuk sekolah Anda.'))
    console.log('Has Back Office SSD?:', res.body.includes('Back Office SSD'))
    console.log('Has JSON-LD SoftwareApplication?:', res.body.includes('SoftwareApplication'))
    console.log('Has FAQPage JSON-LD?:', res.body.includes('FAQPage'))
    console.log('Has Pass Operasional ticket?:', res.body.includes('Pass Operasional Satu Data'))
  } catch (err) {
    console.error('Failed to verify production server:', err.message)
    process.exitCode = 1
  } finally {
    serverProcess.kill('SIGTERM')
    setTimeout(() => serverProcess.kill('SIGKILL'), 1000)
  }
}

run()

import http from 'node:http'
import fs from 'node:fs'

http.get('http://localhost:39871/', (res) => {
  let body = ''
  res.on('data', (c) => { body += c })
  res.on('end', () => {
    fs.writeFileSync('scripts/ssr_dump.html', body)
    console.log('Saved ssr_dump.html (length:', body.length, ')')
    const h1Matches = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
    console.log('H1 elements found:', h1Matches.length)
    h1Matches.forEach((m, i) => console.log(`  H1 #${i+1}:`, m[0]))

    // Check for exact text: "Sistem operasi untuk sekolah Anda."
    console.log('Contains "Sistem operasi untuk sekolah Anda.":', body.includes('Sistem operasi untuk sekolah Anda.'))

    // Check for 12 app names / descriptions
    const appNames = [
      'Back Office',
      'Guru Mobile',
      'Absensi Tap',
      'Bimbingan Konseling',
      'Wali Murid',
      'POS & Kantin',
      'Security Gate',
      'Buku Tamu',
      'Pimpinan Yayasan',
      'Portal Alumni',
      'Koperasi Siswa',
      'Spesialis Infaq'
    ]
    console.log('\n--- Checking 12 App Names in SSR HTML ---')
    for (const name of appNames) {
      console.log(`  ${name}: ${body.includes(name)}`)
    }
  })
})

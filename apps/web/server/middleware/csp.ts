import { defineEventHandler, setHeader } from 'h3'

const CSP_POLICY =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; media-src 'self' https: data: blob:; frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://www.tiktok.com https://tiktok.com https://www.instagram.com https://instagram.com https://www.google.com https://maps.google.com; child-src 'self' blob: https://www.youtube.com https://www.youtube-nocookie.com https://www.tiktok.com https://www.instagram.com; connect-src 'self' https: ws: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Security-Policy', CSP_POLICY)
})


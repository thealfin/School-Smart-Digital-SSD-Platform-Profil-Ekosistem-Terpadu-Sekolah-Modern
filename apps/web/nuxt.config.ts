import tailwindcss from '@tailwindcss/vite'
import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'

config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) })
config()

export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  devtools: { enabled: false },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  fonts: {
    families: [
      { name: 'Bricolage Grotesque', provider: 'google', weights: [400, 600, 700, 800] },
      { name: 'Plus Jakarta Sans', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'JetBrains Mono', provider: 'google', weights: [500] },
    ],
  },

  icon: {
    serverBundle: 'remote',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#12355B' },
        {
          name: 'description',
          content: 'School Smart Digital (SSD) — Sistem operasi terpadu untuk sekolah modern oleh Digital Teknologi Perkasa. Menghubungkan seluruh lini operasional sekolah dalam satu ekosistem.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&display=block',
        },
      ],
    },
  },

  runtimeConfig: {
    databaseUrl: process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL || '',
    ipHashSalt: process.env.NUXT_IP_HASH_SALT || 'ssd_salt_k37_secure_hash_string_2026_neon',
    turnstileSecret: process.env.NUXT_TURNSTILE_SECRET || '',
    notifyWebhookUrl: process.env.NUXT_NOTIFY_WEBHOOK_URL || '',
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || 'ssd_admin_session_secret_password_minimum_32_chars_long_prod',
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '6285839845284',
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; media-src 'self' https: data: blob:; frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://www.tiktok.com https://tiktok.com https://www.instagram.com https://instagram.com https://www.google.com https://maps.google.com; child-src 'self' blob: https://www.youtube.com https://www.youtube-nocookie.com https://www.tiktok.com https://www.instagram.com; connect-src 'self' https: ws: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
        'Cross-Origin-Opener-Policy': 'same-origin',
        'X-XSS-Protection': '0',
      },
    },
    '/': { isr: 300 },
    '/faq': { isr: 3600 },
    '/privacy-policy': { prerender: true },
    '/terms': { prerender: true },
    '/admin/**': { ssr: false, robots: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } } as any,
    '/api/leads': { cors: false },
  },

  nitro: {
    externals: {
      inline: ['@ssd/db', '@ssd/shared'],
    },
    prerender: {
      crawlLinks: false,
      ignore: ['/admin/**', '/api/**'],
    },
  },

  typescript: {
    strict: true,
  },
})

import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) })
config()
import { eq } from 'drizzle-orm'
import { createDb, type Db } from './index'
import * as schema from './schema'
import {
  apps as rawApps,
  flowSteps as rawFlowSteps,
  painPoints as rawPainPoints,
  moduleGroups as rawModuleGroups,
  roleLevels as rawRoleLevels,
  comparisonRows as rawComparisonRows,
  faqs as rawFaqs,
  settings as rawSettings,
} from '@ssd/shared/content'

/**
 * Idempotent seed function populating all baseline content from @ssd/shared/content.
 * Can be run via CLI (`pnpm db:seed`) or imported programmatically.
 */
export async function seed(dbInstance?: Db): Promise<void> {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!dbInstance && !connectionString) {
    console.error('❌ Error: DATABASE_URL or DATABASE_URL_UNPOOLED is not defined in environment.')
    process.exit(1)
  }

  const db = dbInstance || createDb(connectionString!)
  console.log('🌱 Starting idempotent database seed...')

  // 1. Seed Site Settings
  console.log('  -> Seeding site_settings...')
  for (const [key, value] of Object.entries(rawSettings)) {
    await db
      .insert(schema.siteSettings)
      .values({
        key,
        value: value as any,
      })
      .onConflictDoUpdate({
        target: schema.siteSettings.key,
        set: { value: value as any, updatedAt: new Date() },
      })
  }

  // 2. Seed Apps and App Features
  console.log('  -> Seeding apps and features...')
  const appSlugToId = new Map<string, string>()

  for (const a of rawApps) {
    const [row] = await db
      .insert(schema.apps)
      .values({
        slug: a.slug,
        number: a.number,
        name: a.name,
        mascotName: a.mascotName ?? null,
        tagline: a.tagline,
        description: a.description ?? null,
        audience: a.audience,
        platformLabel: a.platformLabel,
        platforms: a.platforms,
        status: a.status,
        statusNote: a.statusNote ?? null,
        iconName: a.iconName,
        previewType: a.previewType,
        isFeatured: a.isFeatured ?? false,
        isPublished: a.isPublished ?? true,
        orderIndex: a.orderIndex ?? a.number,
        archived: false,
      })
      .onConflictDoUpdate({
        target: schema.apps.slug,
        set: {
          number: a.number,
          name: a.name,
          mascotName: a.mascotName ?? null,
          tagline: a.tagline,
          description: a.description ?? null,
          audience: a.audience,
          platformLabel: a.platformLabel,
          platforms: a.platforms,
          status: a.status,
          statusNote: a.statusNote ?? null,
          iconName: a.iconName,
          previewType: a.previewType,
          isFeatured: a.isFeatured ?? false,
          isPublished: a.isPublished ?? true,
          orderIndex: a.orderIndex ?? a.number,
          archived: false,
          updatedAt: new Date(),
        },
      })
      .returning({ id: schema.apps.id, slug: schema.apps.slug })

    appSlugToId.set(row.slug, row.id)

    // Delete existing features for this app and re-insert for clean idempotency
    await db.delete(schema.appFeatures).where(eq(schema.appFeatures.appId, row.id))
    if (a.features && a.features.length > 0) {
      await db.insert(schema.appFeatures).values(
        a.features.map((f, idx) => ({
          appId: row.id,
          title: f.title,
          description: f.description ?? null,
          iconName: f.iconName ?? null,
          status: f.status ?? 'available',
          orderIndex: f.orderIndex ?? idx,
        }))
      )
    }
  }

  // 3. Seed Module Groups and Items
  console.log('  -> Seeding module_groups and items...')
  for (const mg of rawModuleGroups) {
    const [groupRow] = await db
      .insert(schema.moduleGroups)
      .values({
        slug: mg.slug,
        title: mg.title,
        description: mg.description ?? null,
        iconName: mg.iconName,
        orderIndex: mg.orderIndex ?? 0,
        archived: false,
      })
      .onConflictDoUpdate({
        target: schema.moduleGroups.slug,
        set: {
          title: mg.title,
          description: mg.description ?? null,
          iconName: mg.iconName,
          orderIndex: mg.orderIndex ?? 0,
          archived: false,
          updatedAt: new Date(),
        },
      })
      .returning({ id: schema.moduleGroups.id })

    await db.delete(schema.moduleItems).where(eq(schema.moduleItems.groupId, groupRow.id))
    if (mg.items && mg.items.length > 0) {
      await db.insert(schema.moduleItems).values(
        mg.items.map((item, idx) => ({
          groupId: groupRow.id,
          title: typeof item === 'string' ? item : item.title,
          orderIndex: idx,
        }))
      )
    }
  }

  // 4. Seed Role Levels
  console.log('  -> Seeding role_levels...')
  await db.delete(schema.roleLevels)
  await db.insert(schema.roleLevels).values(
    rawRoleLevels.map((r) => ({
      levelLabel: r.levelLabel,
      sortKey: r.sortKey,
      name: r.name,
      description: r.description ?? null,
    }))
  )

  // 5. Seed Pain Points
  console.log('  -> Seeding pain_points...')
  await db.delete(schema.painPoints)
  await db.insert(schema.painPoints).values(
    rawPainPoints.map((p, idx) => ({
      number: p.number,
      title: p.title,
      description: p.description ?? null,
      solvedByAppSlugs: p.solvedByAppSlugs,
      orderIndex: p.orderIndex ?? idx,
    }))
  )

  // 6. Seed Flow Steps
  console.log('  -> Seeding flow_steps...')
  for (const step of rawFlowSteps) {
    const targetAppId = step.appSlug ? appSlugToId.get(step.appSlug) ?? null : null
    await db
      .insert(schema.flowSteps)
      .values({
        stepNo: step.stepNo,
        title: step.title,
        description: step.description ?? null,
        actor: step.actor,
        appId: targetAppId,
        status: step.status,
        fallbackNote: step.fallbackNote ?? null,
      })
      .onConflictDoUpdate({
        target: schema.flowSteps.stepNo,
        set: {
          title: step.title,
          description: step.description ?? null,
          actor: step.actor,
          appId: targetAppId,
          status: step.status,
          fallbackNote: step.fallbackNote ?? null,
        },
      })
  }

  // 7. Seed Comparison Rows
  console.log('  -> Seeding comparison_rows...')
  await db.delete(schema.comparisonRows)
  await db.insert(schema.comparisonRows).values(
    rawComparisonRows.map((c, idx) => ({
      topic: c.topic,
      typicalSolution: c.typicalSolution,
      ssdSolution: c.ssdSolution,
      orderIndex: c.orderIndex ?? idx,
    }))
  )

  // 8. Seed FAQs
  console.log('  -> Seeding faqs...')
  await db.delete(schema.faqs)
  await db.insert(schema.faqs).values(
    rawFaqs.map((f, idx) => ({
      question: f.question,
      answer: f.answer,
      category: f.category ?? 'umum',
      orderIndex: f.orderIndex ?? idx,
      isPublished: true,
      archived: false,
    }))
  )

  // 9. Seed News Articles
  console.log('  -> Seeding news_articles...')
  const initialNews = [
    {
      slug: 'bimtek-implementasi-school-smart-digital',
      title: 'Bimbingan Teknis Implementasi School Smart Digital Bersama Puluhan Sekolah Mitra',
      summary: 'PT Digital Teknologi Perkasa menyelenggarakan bimbingan teknis terpadu untuk percepatan digitalisasi operasional sekolah berbasis satu ekosistem data terintegrasi.',
      content: `<p>Sebagai wujud komitmen dalam mengakselerasi transformasi digital pendidikan nasional, <strong>PT Digital Teknologi Perkasa</strong> menggelar agenda Bimbingan Teknis (Bimtek) Implementasi <em>School Smart Digital (SSD)</em> bersama para kepala sekolah, wakil kurikulum, dan staf tata usaha dari puluhan sekolah mitra.</p><p>Kegiatan ini memfokuskan pada integrasi 12 pilar aplikasi sekolah—mulai dari manajemen presensi berbasis smart turnstile & gate Kartu Pelajar Pintar QR Code, buku induk digital terpadu, hingga otomasi laporan keuangan dan SPP sekolah.</p><p>Dengan hadirnya ekosistem SSD, sekolah kini mampu menghemat ratusan jam kerja administratif bulanan serta menyajikan transparansi data akademik dan perkembangan karakter siswa langsung ke perangkat telepon pintar para orang tua/wali murid secara realtime.</p>`,
      category: 'Bimtek',
      coverImageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      author: 'Tim Humas SSD',
      isPublished: true,
    },
    {
      slug: 'integrasi-qr-smart-turnstile-gate',
      title: 'Transformasi Presensi Siswa Modern: Integrasi QR Code Smart Turnstile Gate dan WhatsApp Realtime',
      summary: 'Bagaimana teknologi smart gate SSD membantu sekolah dan wali murid memantau kedisiplinan dan keamanan siswa secara instan.',
      content: `<p>Keamanan dan kedisiplinan siswa di lingkungan sekolah kini memasuki era baru. Melalui integrasi hardware smart gate barrier turnstile dengan modul presensi pintar SSD, setiap siswa yang melakukan tap kartu pelajar atau deteksi biometrik otomatis memicu notifikasi WhatsApp ke nomor handphone orang tua.</p><p>Sistem ini tidak hanya memastikan kehadiran siswa di dalam gerbang sekolah secara akurat tanpa manipulasi, namun juga secara signifikan meningkatkan rasa ketenangan bagi para wali murid di tengah kesibukan harian.</p>`,
      category: 'Teknologi',
      coverImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      author: 'Divisi Hardware IoT DTP',
      isPublished: true,
    },
    {
      slug: 'pemberdayaan-tata-usaha-modul-keuangan-spp',
      title: 'Pemberdayaan Tata Usaha Sekolah Lewat Modul Keuangan & SPP Terotomatisasi',
      summary: 'Mengatasi kebocoran administrasi dan mempermudah rekapitulasi pembayaran SPP serta infaq sekolah dengan portal bendahara pintar.',
      content: `<p>Pengelolaan keuangan sekolah sering kali menghadapi kendala rekonsiliasi manual, tumpukan kwitansi fisik, serta keterlambatan informasi tagihan ke orang tua siswa. Modul Keuangan SSD hadir memberikan solusi tata kelola kasir dan bendahara modern.</p><p>Dilengkapi dengan fitur virtual account pembayaran instan, bukti bayar digital terkirim ke WhatsApp, serta laporan arus kas otomatis yang dapat diakses oleh kepala sekolah dan ketua yayasan kapan pun dan di mana pun.</p>`,
      category: 'Manajemen',
      coverImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      author: 'Tim Akuntansi SSD',
      isPublished: true,
    },
    {
      slug: 'studi-kasus-sinergi-satu-data-terpadu',
      title: 'Studi Kasus Digitalisasi Sekolah: Sinergi Satu Data Terpadu Menghubungkan Guru, Siswa, dan Wali',
      summary: 'Refleksi keberhasilan sekolah mitra dalam mengeliminasi redudansi entri data dan mempercepat pelaporan akademik berkala.',
      content: `<p>Menerapkan sistem multi-aplikasi terpisah sering kali berujung pada data silo yang saling bertolak belakang. Melalui arsitektur Satu Data Terpadu SSD, perubahan data di satu lini (seperti perizinan siswa di pos satpam atau catatan bimbingan konseling) langsung tersinkronisasi ke dashboard wali kelas dan kurikulum secara harmonis.</p>`,
      category: 'Studi Kasus',
      coverImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      author: 'Divisi Edukasi SSD',
      isPublished: true,
    },
  ]

  for (const article of initialNews) {
    await db
      .insert(schema.newsArticles)
      .values(article)
      .onConflictDoUpdate({
        target: schema.newsArticles.slug,
        set: { ...article, updatedAt: new Date() },
      })
  }

  // 10. Seed Galleries
  console.log('  -> Seeding galleries...')
  await db.delete(schema.galleries)
  const initialGalleries = [
    {
      title: 'Bimbingan Teknis & Pelatihan Operator Sekolah SSD',
      category: 'bimtek',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      description: 'Pendampingan langsung teknis operasional 12 aplikasi School Smart Digital kepada tim administrator dan tata usaha.',
      location: 'Bandar Lampung',
      orderIndex: 0,
      isPublished: true,
    },
    {
      title: 'Implementasi Pemasangan Smart Turnstile Gate QR Code',
      category: 'hardware',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      description: 'Instalasi gerbang presensi otomatis presisi tinggi terhubung langsung ke database cloud SSD.',
      location: 'Sekolah Mitra Teladan',
      orderIndex: 1,
      isPublished: true,
    },
    {
      title: 'Sosialisasi Aplikasi Wali Siswa & Tabungan Sekolah Digital',
      category: 'sosialisasi',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      description: 'Pertemuan interaktif bersama para wali murid mengenai kemudahan pantauan absensi, nilai, dan tagihan SPP lewat smartphone.',
      location: 'Aula Graha Pendidikan',
      orderIndex: 2,
      isPublished: true,
    },
    {
      title: 'Rapat Koordinasi Evaluasi Satu Data Sekolah Terpadu',
      category: 'kegiatan',
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
      description: 'Sesi brainstorming berkala antara tim engineering PT Digital Teknologi Perkasa dan pengurus yayasan pendidikan.',
      location: 'Kantor PT Digital Teknologi Perkasa',
      orderIndex: 3,
      isPublished: true,
    },
    {
      title: 'Workshop Guru: Asesmen & Raport Digital Modern',
      category: 'pelatihan',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      description: 'Pelatihan pembuatan soal digital, penilaian terpadu, dan otomatisasi cetak lembar raport semester.',
      location: 'Laboratorium Komputer',
      orderIndex: 4,
      isPublished: true,
    },
    {
      title: 'Simulasi Sistem Konseling Terenkripsi & Buku Saku Disiplin Siswa',
      category: 'pelatihan',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      description: 'Penerapan kode etik keamanan data pada modul Bimbingan Konseling (BK) untuk privasi maksimal siswa.',
      location: 'Ruang Guru & Konseling',
      orderIndex: 5,
      isPublished: true,
    },
  ]

  await db.insert(schema.galleries).values(initialGalleries)

  // 10. Seed Initial Client Testimonials (if empty)
  const existingTestimonials = await db.select().from(schema.testimonials).limit(1)
  if (existingTestimonials.length === 0) {
    console.log('  -> Seeding client testimonials...')
    await db.insert(schema.testimonials).values([
      {
        name: 'Drs. H. Ahmad Fauzi, M.Pd',
        roleTitle: 'Kepala Sekolah',
        organization: 'SMP IT Nurul Fikri',
        content: 'Integrasi smart turnstile QR Code dan laporan keuangan SPP di SSD sangat membantu kami. Rekapitulasi absensi siswa dan notifikasi WhatsApp ke orang tua berjalan otomatis tanpa repot rekap manual.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        isVerified: true,
        isPublished: true,
        orderIndex: 1,
      },
      {
        name: 'Dr. Ir. H. Muhammad Ridwan',
        roleTitle: 'Ketua Yayasan',
        organization: 'Yayasan Pendidikan Darul Hikmah',
        content: 'Sebagai pengelola yayasan dengan unit SD, SMP, SMA, dan asrama, arsitektur satu data SSD adalah jawaban tepat. Pembukuan tiap unit rapi, hak akses terisolasi ketat, dan konsolidasi keuangan yayasan sangat transparan.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        isVerified: true,
        isPublished: true,
        orderIndex: 2,
      },
      {
        name: 'Siti Rahmawati, S.Pd',
        roleTitle: 'Wakasek Kesiswaan',
        organization: 'SMA Al-Azhar',
        content: 'Pencatatan konseling BK di SSD benar-benar menjaga kerahasiaan siswa. Data poin kedisiplinan dan riwayat konseling terpisah aman dari sistem umum, memberi ketenangan bagi guru dan siswa.',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        isVerified: true,
        isPublished: true,
        orderIndex: 3,
      },
    ])
  }

  console.log('✔ Database seed completed successfully!')
}

// Execute immediately if run directly as script
const isCLI = process.argv[1] && (
  process.argv[1].endsWith('seed.ts') ||
  process.argv[1].endsWith('seed.js') ||
  process.argv[1].endsWith('seed.mjs')
)

if (isCLI) {
  seed().catch((err) => {
    console.error('❌ Database seed failed:', err)
    process.exit(1)
  })
}

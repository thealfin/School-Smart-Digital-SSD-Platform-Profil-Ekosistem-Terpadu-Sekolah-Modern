export const APK_ICON_FILES = {
  pegawai: '/media/APK SSD PEGAWAI.webp',
  waliMurid: '/media/APK SSD WALI MURID.webp',
  security: '/media/APK SSD Security.webp',
  mitraUsaha: '/media/APK SSD Mitra Usaha.webp',
  pimpinan: '/media/APK SSD PIMPINAN.webp',
} as const

/**
 * Resolves the exact APK WebP icon for an application or module group by slug or title
 */
export function resolveApkIcon(slugOrTitle?: string | null, fallbackTitle?: string | null): string | null {
  const key = `${slugOrTitle || ''} ${fallbackTitle || ''}`.toLowerCase()

  if (key.includes('pegawai') || key.includes('kepegawaian') || key.includes('guru')) {
    return APK_ICON_FILES.pegawai
  }
  if (
    key.includes('wali-murid') ||
    key.includes('wali murid') ||
    key.includes('wali-kelas') ||
    key.includes('wali kelas') ||
    key.includes('komunikasi') ||
    key.includes('kesiswaan')
  ) {
    return APK_ICON_FILES.waliMurid
  }
  if (
    key.includes('security') ||
    key.includes('gate') ||
    key.includes('presensi') ||
    key.includes('absensi')
  ) {
    return APK_ICON_FILES.security
  }
  if (
    key.includes('mitra-usaha') ||
    key.includes('mitra usaha') ||
    key.includes('keuangan') ||
    key.includes('pembayaran') ||
    key.includes('kantin')
  ) {
    return APK_ICON_FILES.mitraUsaha
  }
  if (
    key.includes('pimpinan') ||
    key.includes('laporan') ||
    key.includes('command-center') ||
    key.includes('command center') ||
    key.includes('back-office') ||
    key.includes('back office')
  ) {
    return APK_ICON_FILES.pimpinan
  }

  return null
}


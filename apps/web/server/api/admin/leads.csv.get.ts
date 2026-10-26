import { defineEventHandler, getQuery, setResponseHeaders } from 'h3'
import { desc, eq, and } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../utils/db'
import { sanitizeCsvCell } from '../../utils/sanitize'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const statusFilter = typeof query.status === 'string' && query.status !== 'all' ? query.status : undefined

  const db = useDb()
  const conditions = [eq(schema.leads.archived, false)]
  if (statusFilter) {
    conditions.push(eq(schema.leads.status, statusFilter as any))
  }

  const rows = await db
    .select()
    .from(schema.leads)
    .where(and(...conditions))
    .orderBy(desc(schema.leads.createdAt))

  const headers = [
    'ID',
    'Tanggal Masuk',
    'Nama',
    'Jabatan',
    'Lembaga',
    'Jenis Lembaga',
    'Rentang Siswa',
    'Jumlah Unit',
    'WhatsApp',
    'Email',
    'Minat Aplikasi',
    'Pesan',
    'Status',
    'Catatan Internal',
  ]

  const csvRows: string[] = [
    headers.map(sanitizeCsvCell).join(','),
  ]

  for (const lead of rows) {
    const row = [
      lead.id,
      lead.createdAt ? new Date(lead.createdAt).toISOString() : '',
      lead.name,
      lead.roleTitle || '',
      lead.organization,
      lead.orgType,
      lead.studentCountRange || '',
      lead.unitCount ?? '',
      lead.whatsapp,
      lead.email || '',
      Array.isArray(lead.interests) ? lead.interests.join('; ') : '',
      lead.message || '',
      lead.status,
      lead.notes || '',
    ]
    csvRows.push(row.map(sanitizeCsvCell).join(','))
  }

  const todayStr = new Date().toISOString().slice(0, 10)
  // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
  const csvContent = '\uFEFF' + csvRows.join('\r\n')

  setResponseHeaders(event, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="leads-${todayStr}.csv"`,
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
  })

  return csvContent
})

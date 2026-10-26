import { defineEventHandler, readBody, setResponseStatus, createError, getRequestHeader } from 'h3'
import { leadInputSchema } from '@ssd/shared/schemas'
import { normalizeWa } from '@ssd/shared/phone'
import { schema } from '@ssd/db'
import { useDb } from '../utils/db'
import { checkRateLimit } from '../utils/rateLimit'
import { dispatchLeadWebhook } from '../utils/webhook'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. Honeypot check (Priority 1 per Tier 3 Pairwise 1 & 8)
  // Whitespace-only string in website does NOT trigger honeypot (Tier 2 test 3.3)
  const website = typeof body?.website === 'string' ? body.website.trim() : body?.website
  if (website) {
    // Return HTTP 202 Accepted immediately without charging NAT proxy rate limit or writing to DB
    setResponseStatus(event, 202)
    return { ok: true }
  }

  // 2. Salted IP rate limit check (Priority 2 per Tier 1 test 20.4 & Tier 2 Boundary 4)
  const rateLimit = checkRateLimit(event)
  if (!rateLimit.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Terlalu banyak permintaan. Silakan hubungi kami via WhatsApp.',
    })
  }

  // 3. Payload validation via Zod (Priority 3 per Tier 1 test 20.2 & Tier 2 Boundary 1 & 2)
  const parseResult = leadInputSchema.safeParse(body)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Validation failed',
      data: parseResult.error.issues,
    })
  }
  const input = parseResult.data

  // 4. WhatsApp phone number normalization to E.164 without plus ('628...')
  const normalizedWa = normalizeWa(input.whatsapp)

  // 5. Database insert into 'leads' table
  let leadId: string
  try {
    const db = useDb()
    const userAgent = getRequestHeader(event, 'user-agent')?.slice(0, 300) || null

    const [inserted] = await db
      .insert(schema.leads)
      .values({
        name: input.name,
        roleTitle: input.roleTitle || null,
        organization: input.organization,
        orgType: input.orgType,
        studentCountRange: input.studentCountRange || null,
        unitCount: input.unitCount ?? null,
        whatsapp: normalizedWa,
        email: input.email || null,
        interests: input.interests || [],
        message: input.message || null,
        source: input.source || 'landing',
        utm: input.utm ?? null,
        ipHash: rateLimit.ipHash,
        userAgent,
        consent: true,
      })
      .returning({ id: schema.leads.id })
    if (!inserted) {
      throw new Error('Gagal menyimpan lead.')
    }
    leadId = inserted.id
  } catch (dbError) {
    // Mask database error to prevent leaking connection credentials or stack traces (Tier 3 Pairwise 3)
    console.error('[API /api/leads] Database write failure:', dbError instanceof Error ? dbError.message : 'Unknown')
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: 'Layanan pendaftaran demo sedang mengalami kendala jaringan. Silakan hubungi kami via WhatsApp.',
    })
  }

  // 6. Asynchronous telemetry logging via event.waitUntil
  event.waitUntil(
    (async () => {
      try {
        const db = useDb()
        const ua = getRequestHeader(event, 'user-agent') || ''
        await db.insert(schema.analyticsEvents).values({
          eventName: 'lead_submit',
          pagePath: input.source || '/#demo',
          sectionId: 'demo-form',
          props: {
            leadId,
            orgType: input.orgType,
            hasInterests: (input.interests || []).length > 0,
          },
          device: /Mobi|Android/i.test(ua) ? 'mobile' : 'desktop',
          browser: ua.slice(0, 120),
        })
      } catch {
        // Non-blocking telemetry failure
      }
    })()
  )

  // 7. Asynchronous sales webhook notification via event.waitUntil (Tier 3 Pairwise 9)
  dispatchLeadWebhook(event, {
    event: 'lead.created',
    timestamp: new Date().toISOString(),
    lead: {
      id: leadId,
      name: input.name,
      roleTitle: input.roleTitle,
      organization: input.organization,
      orgType: input.orgType,
      studentCountRange: input.studentCountRange,
      unitCount: input.unitCount,
      whatsapp: normalizedWa,
      email: input.email,
      interests: input.interests || [],
      message: input.message,
      source: input.source || 'landing',
    },
  })

  // 8. Return HTTP 201 Created with lead id
  setResponseStatus(event, 201)
  return { ok: true, id: leadId }
})

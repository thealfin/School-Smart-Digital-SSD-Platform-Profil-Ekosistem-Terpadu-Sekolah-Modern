import { defineEventHandler, readBody, setResponseStatus, createError, getRequestHeader } from 'h3'
import { trackSchema } from '@ssd/shared/schemas'
import { schema } from '@ssd/db'
import { useDb } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. Validate payload against trackSchema
  const parseResult = trackSchema.safeParse(body)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid telemetry payload',
      data: parseResult.error.issues,
    })
  }
  const input = parseResult.data

  // 2. Extract client device/browser without recording raw IP (Tier 1 test 21.4 Privacy Preservation)
  const ua = getRequestHeader(event, 'user-agent') || ''
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua)
  const device = isMobile ? 'mobile' : 'desktop'
  const browser = ua.slice(0, 120)

  // 3. Asynchronously record event in analytics_events table via event.waitUntil
  // Non-blocking execution ensures client is never delayed or failed by DB errors (Tier 1 test 21.5)
  event.waitUntil(
    (async () => {
      try {
        const db = useDb()
        await db.insert(schema.analyticsEvents).values({
          eventName: input.eventName,
          pagePath: input.pagePath || null,
          sectionId: input.sectionId || null,
          props: input.props ?? null,
          sessionId: input.sessionId || null,
          referrer: input.referrer || null,
          device,
          browser,
        })
      } catch {
        // Silently swallow analytics errors
      }
    })()
  )

  // 4. Return HTTP 204 No Content
  setResponseStatus(event, 204)
  return null
})

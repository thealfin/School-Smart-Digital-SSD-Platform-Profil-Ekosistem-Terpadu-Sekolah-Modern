import type { H3Event } from 'h3'

export interface LeadWebhookPayload {
  event: 'lead.created'
  timestamp: string
  lead: {
    id: string
    name: string
    roleTitle?: string | null
    organization: string
    orgType: string
    studentCountRange?: string | null
    unitCount?: number | null
    whatsapp: string
    email?: string | null
    interests: string[]
    message?: string | null
    source: string
  }
}

export interface WebhookOptions {
  timeoutMs?: number
  maxRetries?: number
  backoffMs?: number
}

/**
 * Sends an HTTP POST notification to the configured webhook endpoint with retry logic.
 * Guaranteed never to throw an unhandled exception.
 */
export async function sendWebhook(
  url: string,
  payload: unknown,
  options: WebhookOptions = {}
): Promise<boolean> {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return false
  }

  const timeoutMs = options.timeoutMs ?? 5000
  const maxRetries = options.maxRetries ?? 2
  const initialBackoff = options.backoffMs ?? 500

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SSD-Webhook-Dispatcher/1.0',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs),
      })

      if (response.ok) {
        return true
      }
    } catch {
      // Retry on network timeout or connection reset
    }

    if (attempt < maxRetries) {
      const delay = initialBackoff * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  return false
}

/**
 * Dispatches a lead creation webhook in the background via event.waitUntil.
 * Fully isolated: errors or timeouts will never delay or crash the client response.
 */
export function dispatchLeadWebhook(event: H3Event, payload: LeadWebhookPayload): void {
  let webhookUrl = ''
  try {
    const config = useRuntimeConfig()
    webhookUrl = (config.notifyWebhookUrl as string) || ''
  } catch {
    // Outside Nuxt context
  }

  if (!webhookUrl) {
    webhookUrl = process.env.NUXT_NOTIFY_WEBHOOK_URL || ''
  }

  if (!webhookUrl) {
    return
  }

  event.waitUntil(
    sendWebhook(webhookUrl, payload).catch((err) => {
      console.error('[Webhook] Failed to dispatch async lead notification:', err)
    })
  )
}

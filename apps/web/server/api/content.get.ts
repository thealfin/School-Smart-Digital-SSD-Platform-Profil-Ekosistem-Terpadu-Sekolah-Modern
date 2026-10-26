import { defineEventHandler, setResponseHeaders } from 'h3'
import { fetchContentData } from '../utils/db'

export default defineEventHandler(async (event) => {
  // SWR Caching header matching Tier 1 test 19.5, Tier 3 P2.1, and DISPATCH.md
  // max-age=300 (5 mins local/edge), s-maxage=3600 (1 hour shared CDN), stale-while-revalidate=86400 (24 hours SWR)
  setResponseHeaders(event, {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
  })

  const { content, isFallback } = await fetchContentData()

  if (isFallback) {
    setResponseHeaders(event, {
      'X-Fallback': 'true',
    })
  }

  // Contract response: provide all 8 required blocks, plus 'comparisons' alias for test oracle compatibility
  return {
    apps: content.apps,
    moduleGroups: content.moduleGroups,
    roleLevels: content.roleLevels,
    painPoints: content.painPoints,
    flowSteps: content.flowSteps,
    comparisonRows: content.comparisonRows,
    comparisons: content.comparisonRows, // Alias ensuring Tier 1 test 19.2 and PROJECT.md line 170 compliance
    faqs: content.faqs,
    settings: content.settings,
  }
})

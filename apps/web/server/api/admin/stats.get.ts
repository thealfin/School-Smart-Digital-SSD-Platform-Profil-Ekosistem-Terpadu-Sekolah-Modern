import { defineEventHandler } from 'h3'
import { eq, sql, desc } from 'drizzle-orm'
import { schema } from '@ssd/db'
import { useDb } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = useDb()

  const [
    totalLeadsRes,
    newLeadsRes,
    newsCountRes,
    galleryCountRes,
    unreadFeedbacksRes,
    recentLeads,
    recentFeedbacks,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(schema.leads).where(eq(schema.leads.archived, false)),
    db.select({ count: sql<number>`count(*)::int` }).from(schema.leads).where(sql`${schema.leads.status} = 'new' and ${schema.leads.archived} = false`),
    db.select({ count: sql<number>`count(*)::int` }).from(schema.newsArticles),
    db.select({ count: sql<number>`count(*)::int` }).from(schema.galleries),
    db.select({ count: sql<number>`count(*)::int` }).from(schema.feedbacks).where(eq(schema.feedbacks.isRead, false)),
    db
      .select({
        id: schema.leads.id,
        name: schema.leads.name,
        organization: schema.leads.organization,
        roleTitle: schema.leads.roleTitle,
        whatsapp: schema.leads.whatsapp,
        status: schema.leads.status,
        createdAt: schema.leads.createdAt,
      })
      .from(schema.leads)
      .where(eq(schema.leads.archived, false))
      .orderBy(desc(schema.leads.createdAt))
      .limit(5),
    db
      .select()
      .from(schema.feedbacks)
      .orderBy(desc(schema.feedbacks.createdAt))
      .limit(5),
  ])

  return {
    stats: {
      totalLeads: totalLeadsRes[0]?.count || 0,
      newLeads: newLeadsRes[0]?.count || 0,
      totalNews: newsCountRes[0]?.count || 0,
      totalGalleries: galleryCountRes[0]?.count || 0,
      unreadFeedbacks: unreadFeedbacksRes[0]?.count || 0,
    },
    recentLeads,
    recentFeedbacks,
  }
})


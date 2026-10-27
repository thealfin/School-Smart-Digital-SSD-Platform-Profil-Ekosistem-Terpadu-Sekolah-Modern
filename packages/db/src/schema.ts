import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  bigserial,
  index,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

/* ───────── 5 Enums ───────── */
export const appStatus = pgEnum('app_status', ['available', 'partial', 'development'])
export const featureStatus = pgEnum('feature_status', ['available', 'roadmap'])
export const leadStatus = pgEnum('lead_status', ['new', 'contacted', 'demo_scheduled', 'won', 'lost', 'spam'])
export const orgType = pgEnum('org_type', ['sekolah', 'yayasan', 'tpq', 'pondok', 'lainnya'])
export const adminRole = pgEnum('admin_role', ['owner', 'editor', 'sales'])

/* ───────── Helper Column Definitions ───────── */
const id = () => uuid('id').primaryKey().defaultRandom()
const stamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}

/* ───────── 1. Admin Users ───────── */
export const adminUsers = pgTable('admin_users', {
  id: id(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: adminRole('role').notNull().default('sales'),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  ...stamps,
})

/* ───────── 2. Site Settings ───────── */
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedBy: uuid('updated_by').references(() => adminUsers.id, { onDelete: 'set null' }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

/* ───────── 3. Media Metadata ───────── */
export const media = pgTable('media', {
  id: id(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  storageProvider: text('storage_provider').notNull().default('vercel-blob'),
  mimeType: text('mime_type'),
  fileSize: integer('file_size'),
  width: integer('width'),
  height: integer('height'),
  altText: text('alt_text'),
  caption: text('caption'),
  uploadedBy: uuid('uploaded_by').references(() => adminUsers.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

/* ───────── 4. Apps ───────── */
export const apps = pgTable(
  'apps',
  {
    id: id(),
    slug: text('slug').notNull().unique(),
    number: integer('number').notNull(),
    name: text('name').notNull(),
    mascotName: text('mascot_name'),
    tagline: text('tagline').notNull(),
    description: text('description'),
    audience: text('audience').notNull(),
    platformLabel: text('platform_label').notNull(),
    platforms: text('platforms').array().notNull().default(sql`'{}'::text[]`),
    status: appStatus('status').notNull().default('available'),
    statusNote: text('status_note'),
    iconName: text('icon_name').notNull(),
    previewMediaId: uuid('preview_media_id').references(() => media.id, { onDelete: 'set null' }),
    previewType: text('preview_type').notNull().default('phone'),
    isFeatured: boolean('is_featured').notNull().default(false),
    isPublished: boolean('is_published').notNull().default(true),
    orderIndex: integer('order_index').notNull().default(0),
    archived: boolean('archived').notNull().default(false),
    ...stamps,
  },
  (t) => [index('apps_order_idx').on(t.orderIndex)]
)

/* ───────── 5. App Features ───────── */
export const appFeatures = pgTable(
  'app_features',
  {
    id: id(),
    appId: uuid('app_id').notNull().references(() => apps.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    iconName: text('icon_name'),
    status: featureStatus('status').notNull().default('available'),
    orderIndex: integer('order_index').notNull().default(0),
    ...stamps,
  },
  (t) => [index('app_features_app_idx').on(t.appId)]
)

/* ───────── 6. Module Groups ───────── */
export const moduleGroups = pgTable('module_groups', {
  id: id(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  iconName: text('icon_name').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  archived: boolean('archived').notNull().default(false),
  ...stamps,
})

/* ───────── 7. Module Items ───────── */
export const moduleItems = pgTable(
  'module_items',
  {
    id: id(),
    groupId: uuid('group_id').notNull().references(() => moduleGroups.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    orderIndex: integer('order_index').notNull().default(0),
  },
  (t) => [index('module_items_group_idx').on(t.groupId)]
)

/* ───────── 8. Role Levels ───────── */
export const roleLevels = pgTable('role_levels', {
  id: id(),
  levelLabel: text('level_label').notNull(),
  sortKey: integer('sort_key').notNull(),
  name: text('name').notNull(),
  description: text('description'),
})

/* ───────── 9. Pain Points ───────── */
export const painPoints = pgTable('pain_points', {
  id: id(),
  number: integer('number').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  solvedByAppSlugs: text('solved_by_app_slugs').array().notNull().default(sql`'{}'::text[]`),
  orderIndex: integer('order_index').notNull().default(0),
})

/* ───────── 10. Flow Steps ───────── */
export const flowSteps = pgTable('flow_steps', {
  id: id(),
  stepNo: integer('step_no').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  actor: text('actor').notNull(),
  appId: uuid('app_id').references(() => apps.id, { onDelete: 'set null' }),
  status: featureStatus('status').notNull().default('available'),
  fallbackNote: text('fallback_note'),
})

/* ───────── 11. Comparison Rows ───────── */
export const comparisonRows = pgTable('comparison_rows', {
  id: id(),
  topic: text('topic').notNull(),
  typicalSolution: text('typical_solution').notNull(),
  ssdSolution: text('ssd_solution').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
})

/* ───────── 12. FAQs ───────── */
export const faqs = pgTable('faqs', {
  id: id(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull().default('umum'),
  orderIndex: integer('order_index').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  archived: boolean('archived').notNull().default(false),
  ...stamps,
})

/* ───────── 13. Testimonials (Default Hidden) ───────── */
export const testimonials = pgTable('testimonials', {
  id: id(),
  name: text('name').notNull(),
  roleTitle: text('role_title'),
  organization: text('organization'),
  content: text('content').notNull(),
  avatarUrl: text('avatar_url'),
  rating: integer('rating').notNull().default(5),
  photoMediaId: uuid('photo_media_id').references(() => media.id, { onDelete: 'set null' }),
  isVerified: boolean('is_verified').notNull().default(false),
  consentAt: timestamp('consent_at', { withTimezone: true }),
  isPublished: boolean('is_published').notNull().default(false),
  orderIndex: integer('order_index').notNull().default(0),
  archived: boolean('archived').notNull().default(false),
  ...stamps,
})

/* ───────── 14. Leads ───────── */
export const leads = pgTable(
  'leads',
  {
    id: id(),
    name: text('name').notNull(),
    roleTitle: text('role_title'),
    organization: text('organization').notNull(),
    orgType: orgType('org_type').notNull(),
    studentCountRange: text('student_count_range'),
    unitCount: integer('unit_count'),
    whatsapp: text('whatsapp').notNull(),
    email: text('email'),
    interests: text('interests').array().notNull().default(sql`'{}'::text[]`),
    message: text('message'),
    preferredDemoAt: timestamp('preferred_demo_at', { withTimezone: true }),
    status: leadStatus('status').notNull().default('new'),
    source: text('source').notNull().default('landing'),
    utm: jsonb('utm'),
    ipHash: text('ip_hash'),
    userAgent: text('user_agent'),
    consent: boolean('consent').notNull(),
    consentAt: timestamp('consent_at', { withTimezone: true }).notNull().defaultNow(),
    notes: text('notes'),
    assignedTo: uuid('assigned_to').references(() => adminUsers.id, { onDelete: 'set null' }),
    archived: boolean('archived').notNull().default(false),
    ...stamps,
  },
  (t) => [
    index('leads_status_idx').on(t.status, t.createdAt),
    index('leads_ip_idx').on(t.ipHash, t.createdAt),
  ]
)

/* ───────── 15. Analytics Events ───────── */
export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    eventName: text('event_name').notNull(),
    pagePath: text('page_path'),
    sectionId: text('section_id'),
    props: jsonb('props'),
    sessionId: text('session_id'),
    referrer: text('referrer'),
    utm: jsonb('utm'),
    device: text('device'),
    browser: text('browser'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('events_name_idx').on(t.eventName, t.createdAt)]
)

/* ───────── 16. News & Articles ───────── */
export const newsArticles = pgTable(
  'news_articles',
  {
    id: id(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    summary: text('summary'),
    content: text('content').notNull(),
    category: text('category').notNull().default('Berita'),
    coverImageUrl: text('cover_image_url'),
    author: text('author').notNull().default('Tim SSD'),
    meta: jsonb('meta').$type<Record<string, any>>().default({}),
    isPublished: boolean('is_published').notNull().default(true),
    publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow(),
    ...stamps,
  },
  (t) => [
    index('news_published_idx').on(t.isPublished, t.publishedAt),
    index('news_slug_idx').on(t.slug),
  ]
)

/* ───────── 17. Galleries / Portfolio ───────── */
export const galleries = pgTable(
  'galleries',
  {
    id: id(),
    title: text('title').notNull(),
    category: text('category').notNull().default('bimtek'), // bimtek, pelatihan, hardware, sosialisasi, kegiatan
    mediaType: text('media_type').notNull().default('image'), // 'image' | 'youtube' | 'tiktok' | 'instagram'
    sourceUrl: text('source_url').notNull().default(''),
    thumbnailUrl: text('thumbnail_url'),
    imageUrl: text('image_url').notNull(),
    description: text('description'),
    location: text('location'),
    orderIndex: integer('order_index').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(true),
    ...stamps,
  },
  (t) => [index('galleries_order_idx').on(t.orderIndex)]
)

/* ───────── 18. Feedbacks / Inbox Messages ───────── */
export const feedbacks = pgTable(
  'feedbacks',
  {
    id: id(),
    senderName: text('sender_name').notNull(),
    senderEmail: text('sender_email').notNull(),
    senderPhone: text('sender_phone'),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    isRead: boolean('is_read').notNull().default(false),
    notes: text('notes'),
    ...stamps,
  },
  (t) => [index('feedbacks_read_idx').on(t.isRead, t.createdAt)]
)

/* ───────── Drizzle ORM Relations ───────── */
export const appsRelations = relations(apps, ({ many, one }) => ({
  features: many(appFeatures),
  previewMedia: one(media, { fields: [apps.previewMediaId], references: [media.id] }),
}))

export const appFeaturesRelations = relations(appFeatures, ({ one }) => ({
  app: one(apps, { fields: [appFeatures.appId], references: [apps.id] }),
}))

export const moduleGroupsRelations = relations(moduleGroups, ({ many }) => ({
  items: many(moduleItems),
}))

export const moduleItemsRelations = relations(moduleItems, ({ one }) => ({
  group: one(moduleGroups, { fields: [moduleItems.groupId], references: [moduleGroups.id] }),
}))

export const flowStepsRelations = relations(flowSteps, ({ one }) => ({
  app: one(apps, { fields: [flowSteps.appId], references: [apps.id] }),
}))

export const leadsRelations = relations(leads, ({ one }) => ({
  assignee: one(adminUsers, { fields: [leads.assignedTo], references: [adminUsers.id] }),
}))

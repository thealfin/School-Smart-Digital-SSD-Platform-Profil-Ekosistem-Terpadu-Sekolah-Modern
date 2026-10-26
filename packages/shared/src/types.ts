export type AppStatus = 'available' | 'partial' | 'development'
export type FeatureStatus = 'available' | 'roadmap'
export type LeadStatus = 'new' | 'contacted' | 'demo_scheduled' | 'won' | 'lost' | 'spam'
export type OrgType = 'sekolah' | 'yayasan' | 'tpq' | 'pondok' | 'lainnya'
export type AdminRole = 'owner' | 'editor' | 'sales'
export type PlatformType = 'web' | 'android' | 'pwa' | 'tv' | 'kiosk'
export type PreviewType = 'phone' | 'desktop' | 'tv' | 'kiosk'

export interface AppFeature {
  id?: string
  appId?: string
  title: string
  description?: string | null
  iconName?: string | null
  status: FeatureStatus
  orderIndex: number
}

export interface AppItem {
  id?: string
  slug: string
  number: number
  name: string
  mascotName?: string | null
  tagline: string
  description?: string | null
  audience: string
  platformLabel: string
  platforms: string[]
  status: AppStatus
  statusNote?: string | null
  iconName: string
  previewMediaId?: string | null
  previewType: PreviewType | string
  isFeatured?: boolean
  isPublished?: boolean
  orderIndex: number
  features: AppFeature[]
}

export interface ModuleItem {
  id?: string
  groupId?: string
  title: string
  orderIndex?: number
}

export interface ModuleGroup {
  id?: string
  slug: string
  title: string
  description?: string | null
  iconName: string
  orderIndex: number
  items: ModuleItem[]
}

export interface RoleLevel {
  id?: string
  levelLabel: string
  sortKey: number
  name: string
  description?: string | null
}

export interface PainPoint {
  id?: string
  number: number
  title: string
  description?: string | null
  solvedByAppSlugs: string[]
  orderIndex: number
}

export interface FlowStep {
  id?: string
  stepNo: number
  title: string
  description?: string | null
  actor: string
  appId?: string | null
  appSlug?: string
  status: FeatureStatus
  fallbackNote?: string | null
  app?: Partial<AppItem> | null
}

export interface ComparisonRow {
  id?: string
  topic: string
  typicalSolution: string
  ssdSolution: string
  orderIndex: number
}

export interface FaqItem {
  id?: string
  question: string
  answer: string
  category: string
  orderIndex: number
}

export interface TestimonialItem {
  id?: string
  name: string
  roleTitle?: string | null
  organization?: string | null
  content: string
  avatarUrl?: string | null
  rating?: number
  isVerified?: boolean
  isPublished?: boolean
  orderIndex?: number
  createdAt?: Date | string
}

export interface ContactSettings {
  email: string
  whatsapp: string
  address: string
}

export interface SocialSettings {
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
}

export interface CtaSettings {
  primary: string
  whatsappText: string
}

export interface FeatureFlags {
  showTestimonials: boolean
  showTrustStats: boolean
}

export interface CompanySettings {
  name: string
  parentUrl: string
}

export interface SiteSettings {
  contact: ContactSettings
  social: SocialSettings
  cta: CtaSettings
  features: FeatureFlags
  company: CompanySettings
  [key: string]: unknown
}

export interface LandingContent {
  apps: AppItem[]
  moduleGroups: ModuleGroup[]
  roleLevels: RoleLevel[]
  painPoints: PainPoint[]
  flowSteps: FlowStep[]
  comparisonRows: ComparisonRow[]
  faqs: FaqItem[]
  settings: Record<string, unknown>
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  isActive: boolean
  lastLoginAt?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Lead {
  id: string
  name: string
  roleTitle?: string | null
  organization: string
  orgType: OrgType
  studentCountRange?: string | null
  unitCount?: number | null
  whatsapp: string
  email?: string | null
  interests: string[]
  message?: string | null
  preferredDemoAt?: Date | string | null
  status: LeadStatus
  source: string
  utm?: Record<string, unknown> | null
  ipHash?: string | null
  userAgent?: string | null
  consent: boolean
  consentAt: Date | string
  notes?: string | null
  assignedTo?: string | null
  archived: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

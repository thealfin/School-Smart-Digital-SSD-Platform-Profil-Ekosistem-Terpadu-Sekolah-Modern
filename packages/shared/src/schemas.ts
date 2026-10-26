import { z } from 'zod'

export const waRegex = /^(\+?62|0)8[0-9]{7,13}$/

export const leadInputSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
  roleTitle: z.string().trim().max(100).optional().or(z.literal('')),
  organization: z.string().trim().min(2, 'Isi nama sekolah atau yayasan').max(150),
  orgType: z.enum(['sekolah', 'yayasan', 'tpq', 'pondok', 'lainnya'], {
    errorMap: () => ({ message: 'Pilih jenis lembaga yang valid' }),
  }),
  studentCountRange: z.enum(['<100', '100-300', '301-700', '701-1500', '>1500']).optional(),
  unitCount: z.coerce.number().int().min(1, 'Minimal 1 unit').max(50, 'Maksimal 50 unit').optional(),
  whatsapp: z.string().trim().regex(waRegex, 'Nomor WhatsApp tidak valid, contoh: 081234567890'),
  email: z.string().trim().email('Format email tidak valid').max(150).optional().or(z.literal('')),
  interests: z.array(z.string().max(50)).max(12).default([]),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  consent: z.boolean().refine((v) => v === true, {
    message: 'Persetujuan syarat dan ketentuan diperlukan',
  }),
  website: z.string().optional(), // Honeypot field: must be empty
  turnstileToken: z.string().optional(),
  source: z.string().max(60).optional(),
  utm: z.record(z.string(), z.string()).optional(),
})

export type LeadInput = z.infer<typeof leadInputSchema>

export const leadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'demo_scheduled', 'won', 'lost', 'spam']).optional(),
  notes: z.string().max(2000).optional().or(z.literal('')),
  assignedTo: z.string().uuid().nullable().optional(),
})

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>

export const trackSchema = z.object({
  eventName: z.enum([
    'page_view',
    'section_view',
    'app_select',
    'flow_step_view',
    'cta_click',
    'cta_whatsapp',
    'lead_submit',
    'faq_open',
  ]),
  pagePath: z.string().max(200).optional(),
  sectionId: z.string().max(60).optional(),
  props: z.record(z.string(), z.unknown()).optional(),
  sessionId: z.string().max(100).optional(),
  referrer: z.string().max(300).nullish(),
})

export type TrackInput = z.infer<typeof trackSchema>

export const authSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
})

export type AuthInput = z.infer<typeof authSchema>

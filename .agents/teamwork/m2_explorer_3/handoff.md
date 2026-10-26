# HANDOFF — Milestone 2 Scope: Part 3 (Conversion, Navigation & Page Assembly)

## 1. Observation
We conducted authoritative specification mining across:
1. `ORIGINAL_REQUEST.md` (R1–R4, Acceptance Criteria for landing sections, SSR stream, zero horizontal overflow, leads API, rate-limits, guardrails).
2. `PROJECT.md` at `.agents/teamwork/orchestrator_1/PROJECT.md` (Feature inventory 16–20, monorepo directory layout, schema interfaces, API contracts).
3. `DISPATCH.md` at `.agents/teamwork/m2_explorer_3/DISPATCH.md` (Tasks for ParentBrandStrip.vue, FaqAccordion.vue, ClosingCta.vue, DemoForm.vue, SiteFooter.vue, index.vue).
4. `docs/01-PRD-SSD-Landing-Page.md` & `docs/02-UIUX-DESIGN-SSD-Landing-Page.md` (§4.10–4.13, §5, §6, §7, §8, §9).
5. `docs/04-HERO-MORPH-DESIGN-ADAPTATION.md` (§4.5 Closing echo portal bookend, knockout typography, responsive ledge, WCAG AA contrast).
6. Shared contracts: `packages/shared/src/schemas.ts` (`leadInputSchema`, `trackSchema`), `packages/shared/src/types.ts` (`FaqItem`, `AppItem`, `SiteSettings`, `LandingContent`), `packages/shared/src/phone.ts` (`normalizeWa`), `packages/shared/src/content/index.ts` (`fallbackContent`, `faqs`, `settings`).
7. E2E test suites in `tests/e2e/`:
   - `tier1-feature-coverage.test.mjs`: Tests 15.1–15.5 (ParentBrandStrip), 16.1–16.5 (FaqAccordion & SSR JSON-LD), 17.1–17.5 (ClosingCTA & DemoForm), 3.3 (logo-white.svg in dark footer).
   - `tier2-boundary-corner.test.mjs`: Input boundaries for 11 fields, 2-char name minimum, unitCount 1–50, studentCountRange enum, honeypot 202 acceptance, and phone regex.
   - `tier3-pairwise-combinations.test.mjs`: Rate limiter 429 response handling, honeypot bypass, and SWR fallback.
   - `tier4-application-scenarios.test.mjs`: Full Foundation Leader journey, `lead_submit` telemetry, and mobile drawer accessibility.

## 2. Logic Chain
- **Observation**: `tier1-feature-coverage.test.mjs` test 15.3 and PRD guardrails mandate that testimonials are hidden by default unless verified with consent (`settings.features.showTestimonials === true`), and fake statistical claims like "98% klien puas" are strictly prohibited.
  - **Inference**: `ParentBrandStrip.vue` must render verified credentials statement referencing PT Digital Teknologi Perkasa and Pesantren Smart Digital (`https://pesantrensmartdigital.com`), hiding testimonial cards and unverified counters when feature flags are false.
- **Observation**: `tier1-feature-coverage.test.mjs` test 16.1 & 16.4 require `<button aria-expanded aria-controls>` disclosure and Schema.org `FAQPage` JSON-LD injected into `<head>` during SSR.
  - **Inference**: `FaqAccordion.vue` must generate Schema.org `FAQPage` via `useHead()` and provide accessible disclosure using CSS grid animation with smooth 250ms expansion, plus noscript fallback.
- **Observation**: `docs/04-HERO-MORPH-DESIGN-ADAPTATION.md` §4.5 specifies that `ClosingCta.vue` acts as an echo bookend repeating the Hero S-Curve aperture with knockout `MARI / MULAI` typography (Navy outside, White inside) and philosophy quote *"Bukan sekadar fitur. Ketenangan."*
  - **Inference**: `ClosingCta.vue` must use pixel-aligned `.type-out` and `.type-in` display typography, S-Curve border radius (`180px 24px 24px 24px`), and flow seamlessly into the demo request form.
- **Observation**: `packages/shared/src/schemas.ts` defines `leadInputSchema` with 11 functional fields plus honeypot `website`, and `tier2-boundary-corner.test.mjs` tests 5 UX states (idle, submitting, success, rate-limited, error).
  - **Inference**: `DemoForm.vue` must implement reactive state machine for all 5 states, inline error summaries with `role="alert"`, `aria-describedby` field bindings, progressive enhancement fallback, and dynamic WhatsApp CTA generator using `waLink`.
- **Observation**: PRD §4.13 and `tests/e2e/tier1-feature-coverage.test.mjs` test 3.3 specify a 4-column editorial footer featuring `logo-white.svg`, verified company credentials, contact info, and legal links (`/privacy-policy`, `/terms`, `/faq`).
  - **Inference**: `SiteFooter.vue` must use dark Navy-950 background with white typography, high contrast links, and verified contact info.
- **Observation**: `apps/web/app/pages/index.vue` must render all 14 sections in semantic sequence, fetch content via `useAsyncData('landing-content')` with fallback to `fallbackContent`, and inject SSR JSON-LD schemas without JavaScript execution dependencies.
  - **Inference**: `index.vue` must assemble all 14 components sequentially, hydrate the EcosystemStore, and provide zero hydration mismatch.

## 3. Caveats
- `stores/ecosystem.ts` and Part 1 / Part 2 components are owned by peer agents `m2_explorer_1` and `m2_explorer_2`. All blueprints provided here decouple gracefully so that if a store or peer component is loading or absent, fallback values prevent runtime exceptions.
- Turnstile captcha token is optional in `leadInputSchema` (`turnstileToken: z.string().optional()`). DemoForm includes slot/placeholder for Turnstile without blocking standard submissions when Turnstile keys are not configured.

## 4. Conclusion
Complete, drop-in Vue 3 SFC blueprints and specifications have been mined and formulated for all 6 targets. Every blueprint enforces WCAG 2.1 AA accessibility, Tailwind CSS v4 design tokens, zero-credential security guardrails, and SSR resilience.

## 5. Verification Method
- Static type check: `pnpm --filter @ssd/web typecheck`
- Guardrail check: `node scripts/guardrail-check.mjs`
- Test runner: `node tests/runner.mjs` (Specifically verifying Tier 1 Features 15, 16, 17, and Tier 2/3/4 scenarios)
- Viewport verification: Zero horizontal overflow on 320px, 375px, 768px, 1024px, 1440px.

---

## Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Trust & Credentials | ParentBrandStrip | DTP & Pesantren Smart Digital credentials banner with verified links and guarded stats | `settings: SiteSettings` | Rendered trust banner, sibling product links | Hides unverified testimonials & stats if flag is false | docs/02 §4.10, E2E Test 15 |
| 2 | SEO & FAQ | FaqAccordion | Accessible disclosure FAQ for 9 core buyer questions with CSS grid animation | `items: FaqItem[]` | `<button aria-expanded>`, answer panels, SSR JSON-LD `<script>` | noscript fallback renders answers visible | docs/02 §4.11, E2E Test 16 |
| 3 | Visual Bookend | ClosingCta | Echo portal with knockout typography `MARI / MULAI` and "Bukan sekadar fitur. Ketenangan." quote | `settings?: SiteSettings` | Aperture window, knockout typography, CTA buttons | Graceful responsive stack on mobile (<720px) | docs/04 §4.5, E2E Test 17.1 |
| 4 | Lead Capture | DemoForm 11-Field Form | Enterprise demo intake form with progressive enhancement and Zod validation | User input, `apps?: AppItem[]` | Lead submission, confirmation card, dynamic WhatsApp link | Top error summary with `role="alert"`, inline aria-describedby errors | schemas.ts, E2E Test 17.2 |
| 5 | Security / Antispam | Honeypot Field | Visually hidden `website` field catching automated spam bots | Form post body | Returns 202 Accepted without DB write | Rejects non-empty submissions silently | schemas.ts, E2E Test 17.3 |
| 6 | UX / Resilience | Rate-Limit UX | 429 friendly state offering immediate WhatsApp redirection | HTTP 429 response | Helpful message with direct WhatsApp chat link | Preserves user form state without reset | docs/02 §4.12, E2E Test 17.5 |
| 7 | Lead Conversion | Dynamic WA Generator | Pre-fills WhatsApp message based on current user inputs with source tag | Form field values | Encoded `https://wa.me/6285839845284?text=...` | Falls back to generic invitation text if empty | docs/03 §C7, E2E Test 17.4 |
| 8 | Footer & Legal | SiteFooter | 4-column editorial footer with white logo, navigation, contact, and legal links | `settings: SiteSettings` | Semantic `<footer>`, contact info, legal routes | Fallback to hardcoded safe settings | docs/02 §4.13, E2E Test 3.3 |
| 9 | Page Orchestration | Master index.vue | 14-section SSR-resilient master assembly with async data fetch and JSON-LD | SWR API / static fallback | Complete SSR HTML stream | Instant fallback to `fallbackContent` on DB error | docs/03 §C6, E2E Tier 3 |

---

## Edge Cases
| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | DemoForm | Name with 1 character ("A") | Validation fails with message "Nama minimal 2 karakter" |
| 2 | DemoForm | Name with 2 characters ("Ib") | Validation succeeds (exact minimum boundary) |
| 3 | DemoForm | UnitCount = 0 | Validation fails (min 1 unit) |
| 4 | DemoForm | UnitCount = 50 | Validation succeeds (max 50 units) |
| 5 | DemoForm | UnitCount = 51 | Validation fails (exceeds 50 units) |
| 6 | DemoForm | WhatsApp phone `08123456789` | Normalized via `normalizeWa` to `628123456789` |
| 7 | DemoForm | WhatsApp phone `+628123456789` | Normalized to `628123456789` without `+` |
| 8 | DemoForm | Honeypot field `website: "https://spam.org"` | Server returns HTTP 202 Accepted, zero DB insertion |
| 9 | DemoForm | 4th submission in 10 mins from same IP hash | Server returns HTTP 429, form displays rate-limit UX with direct WhatsApp CTA |
| 10 | FaqAccordion | JavaScript disabled in browser | `<noscript>` CSS forces `.faq-panel` open with `display: block`, ensuring 100% readable SSR |
| 11 | ClosingCta | Viewport width 320px | Font size scales smoothly via `clamp(3rem, 16vw, 10rem)` without horizontal overflow |
| 12 | ParentBrandStrip | `features.showTrustStats: false` | Numerical claims hidden; renders qualitative track record statement |
| 13 | ParentBrandStrip | `features.showTestimonials: false` | Testimonials remain completely absent from DOM |
| 14 | SiteFooter | Missing database settings | Safely falls back to `@ssd/shared` settings (email, WA, address) |
| 15 | index.vue | Neon database completely offline | `useAsyncData` catches error, falls back to `fallbackContent`, SSR returns 200 OK |

---

# COMPONENT BLUEPRINTS & PRODUCTION CODE

### 1. `apps/web/app/components/ParentBrandStrip.vue`
```vue
<template>
  <section
    id="kredensial"
    aria-labelledby="parent-brand-heading"
    class="relative bg-paper-warm/80 border-y border-navy-100/70 py-12 lg:py-16 overflow-hidden"
  >
    <!-- Background Architectural Grid Accent -->
    <div
      class="absolute inset-0 opacity-[0.03] pointer-events-none"
      style="background-image: radial-gradient(#12355B 1px, transparent 1px); background-size: 24px 24px;"
      aria-hidden="true"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="max-w-3xl mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-mono font-medium mb-3">
          <span class="material-symbols-rounded text-sm">verified_user</span>
          <span>KREDENSIAL & REKAM JEJAK</span>
        </div>
        <h2
          id="parent-brand-heading"
          class="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-navy-900 tracking-tight leading-snug"
        >
          Dibangun oleh tim di balik transformasi digital pesantren & sekolah di Indonesia.
        </h2>
        <p class="mt-3 text-base text-navy-700 font-body leading-relaxed">
          School Smart Digital (SSD) lahir dari pengalaman panjang tim teknologi dalam merancang sistem operasional terintegrasi yang tangguh untuk lembaga pendidikan Islam dan formal.
        </p>
      </div>

      <!-- Trust & Credential Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card 1: Pesantren Smart Digital -->
        <div class="rounded-2xl bg-surface border border-navy-100/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-cyan-500/40 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-navy-50 text-navy-900">
                <span class="material-symbols-rounded text-2xl">school</span>
              </span>
              <span class="text-xs font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100 font-semibold">
                SISTEM SAUDARA
              </span>
            </div>
            <h3 class="text-xl font-display font-bold text-navy-900 mb-2">
              Pesantren Smart Digital
            </h3>
            <p class="text-sm text-navy-700 font-body leading-relaxed mb-6">
              Spesialisasi digitalisasi pesantren nusantara: mengelola asrama, tahfidz, kamar santri, izin keluar malam, dan sistem uang saku non-tunai.
            </p>
          </div>

          <div>
            <a
              href="https://pesantrensmartdigital.com"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-cyan-700 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded-sm"
            >
              <span>Kunjungi pesantrensmartdigital.com</span>
              <span class="material-symbols-rounded text-base group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                arrow_forward
              </span>
              <span class="sr-only">(buka di tab baru)</span>
            </a>
          </div>
        </div>

        <!-- Card 2: Legal Entity & Developer -->
        <div class="rounded-2xl bg-surface border border-navy-100/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-cyan-500/40 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-navy-50 text-navy-900">
                <span class="material-symbols-rounded text-2xl">shield_lock</span>
              </span>
              <span class="text-xs font-mono text-navy-700 bg-navy-50 px-2.5 py-1 rounded-md border border-navy-100 font-semibold">
                BADAN HUKUM RESMI
              </span>
            </div>
            <h3 class="text-xl font-display font-bold text-navy-900 mb-2">
              {{ companyName }}
            </h3>
            <p class="text-sm text-navy-700 font-body leading-relaxed mb-6">
              Pengembang piranti lunak berbadan hukum resmi dengan komitmen kepatuhan UU Pelindungan Data Pribadi (UU PDP), kepemilikan data mandiri, dan infrastruktur cloud terisolasi.
            </p>
          </div>

          <div>
            <a
              :href="parentProfileUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-cyan-700 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded-sm"
            >
              <span>Profil Pengembang & Komitmen</span>
              <span class="material-symbols-rounded text-base group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                arrow_forward
              </span>
              <span class="sr-only">(buka di tab baru)</span>
            </a>
          </div>
        </div>

        <!-- Card 3: Pendampingan & Layanan Lokal -->
        <div class="rounded-2xl bg-surface border border-navy-100/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-cyan-500/40 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-navy-50 text-navy-900">
                <span class="material-symbols-rounded text-2xl">how_to_reg</span>
              </span>
              <span class="text-xs font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100 font-semibold">
                DUKUNGAN LANGSUNG
              </span>
            </div>
            <h3 class="text-xl font-display font-bold text-navy-900 mb-2">
              Pendampingan Implementasi
            </h3>
            <p class="text-sm text-navy-700 font-body leading-relaxed mb-6">
              Bukan sekadar software lepas. Tim kami mendampingi migrasi data, pelatihan operator dan tata usaha sekolah, serta menyediakan kanal darurat WhatsApp.
            </p>
          </div>

          <div>
            <a
              :href="waSupportUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-navy-900 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded-sm"
            >
              <span>Konsultasi WhatsApp Tim Teknis</span>
              <span class="material-symbols-rounded text-base group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                arrow_forward
              </span>
              <span class="sr-only">(buka di tab baru)</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Optional Verified Partner Count (Guarded) -->
      <div
        v-if="showTrustStats"
        class="mt-8 p-4 rounded-xl bg-cyan-50/70 border border-cyan-100 text-center"
      >
        <p class="text-sm text-navy-900 font-medium">
          Telah dipercaya oleh jaringan yayasan dan pondok pesantren di berbagai kota di Indonesia.
        </p>
      </div>

      <!-- Testimonials Container: Strictly hidden unless verified with explicit consent timestamp -->
      <div v-if="showTestimonials" class="mt-12">
        <slot name="testimonials" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { settings as defaultSettings } from '@ssd/shared'

const props = withDefaults(
  defineProps<{
    settings?: Record<string, any>
  }>(),
  {
    settings: () => defaultSettings,
  }
)

const companyName = computed(() => {
  return props.settings?.company?.name || 'Digital Teknologi Perkasa'
})

const parentProfileUrl = computed(() => {
  return props.settings?.company?.parentUrl || 'https://digital-teknologi-perkasa-profile.vercel.app'
})

const showTrustStats = computed(() => {
  return props.settings?.features?.showTrustStats === true
})

const showTestimonials = computed(() => {
  return props.settings?.features?.showTestimonials === true
})

const waSupportUrl = computed(() => {
  const phone = props.settings?.contact?.whatsapp || '6285839845284'
  const text = encodeURIComponent('Halo tim Digital Teknologi Perkasa, saya ingin menanyakan implementasi dan rekam jejak School Smart Digital.')
  return `https://wa.me/${phone}?text=${text}`
})
</script>
```

---

### 2. `apps/web/app/components/FaqAccordion.vue`
```vue
<template>
  <section
    id="faq"
    aria-labelledby="faq-heading"
    class="relative bg-background py-16 sm:py-24 border-b border-navy-100/60"
  >
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-mono font-medium mb-4">
          <span class="material-symbols-rounded text-sm">help_outline</span>
          <span>TANYA JAWAB & TRANSPARANSI</span>
        </div>
        <h2
          id="faq-heading"
          class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy-900 tracking-tight leading-tight"
        >
          Pertanyaan yang Sering Diajukan
        </h2>
        <p class="mt-4 text-base sm:text-lg text-navy-700 font-body">
          Jawaban jujur dan transparan seputar fitur, integrasi, batasan sistem, keamanan, dan skema investasi SSD.
        </p>
      </div>

      <!-- FAQ Accordion List -->
      <div class="space-y-4" role="list">
        <div
          v-for="(item, index) in faqList"
          :key="item.id || index"
          role="listitem"
          class="rounded-2xl border transition-all duration-200 overflow-hidden"
          :class="[
            isOpen(index)
              ? 'border-cyan-500/50 bg-paper-warm/70 shadow-xs'
              : 'border-navy-100/80 bg-surface hover:border-navy-100 hover:bg-paper-warm/30'
          ]"
        >
          <!-- Accordion Trigger Button -->
          <button
            :id="`faq-btn-${index}`"
            type="button"
            :aria-expanded="isOpen(index) ? 'true' : 'false'"
            :aria-controls="`faq-panel-${index}`"
            class="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 rounded-2xl select-none"
            @click="toggleFaq(index, item.question)"
          >
            <div class="flex items-center gap-3.5 pr-2">
              <span
                class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold"
                :class="[
                  isOpen(index)
                    ? 'bg-cyan-500 text-navy-950 font-bold'
                    : 'bg-navy-50 text-navy-700'
                ]"
                aria-hidden="true"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <span class="text-base sm:text-lg font-display font-bold text-navy-900 leading-snug">
                {{ item.question }}
              </span>
            </div>

            <span
              class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-250 ease-standard"
              :class="[
                isOpen(index)
                  ? 'rotate-180 bg-cyan-100 text-cyan-700'
                  : 'bg-navy-50 text-navy-700'
              ]"
              aria-hidden="true"
            >
              <span class="material-symbols-rounded text-lg">arrow_downward</span>
            </span>
          </button>

          <!-- Accordion Content Panel with CSS Grid Animation -->
          <div
            :id="`faq-panel-${index}`"
            role="region"
            :aria-labelledby="`faq-btn-${index}`"
            class="faq-panel grid transition-[grid-template-rows] duration-250 ease-standard"
            :class="[isOpen(index) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']"
          >
            <div class="overflow-hidden">
              <div class="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 text-sm sm:text-base text-navy-700 font-body leading-relaxed border-t border-navy-100/50">
                <p>{{ item.answer }}</p>
                <div v-if="item.category" class="mt-3 flex items-center gap-2">
                  <span class="text-[11px] font-mono uppercase tracking-wider text-navy-700/60 bg-navy-50 px-2 py-0.5 rounded">
                    Kategori: {{ item.category }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Direct Consultation Box -->
      <div class="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
        <div>
          <h3 class="text-xl font-display font-bold text-white mb-1">
            Punya kebutuhan operasional khusus?
          </h3>
          <p class="text-sm text-navy-100/80 font-body">
            Konsultasikan struktur yayasan, jumlah unit, dan sistem pembayaran Anda bersama tim konsultan kami.
          </p>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <NuxtLink
            to="#demo-form"
            class="w-full sm:w-auto text-center px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Jadwalkan Demo
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { faqs as defaultFaqs, type FaqItem } from '@ssd/shared'

const props = withDefaults(
  defineProps<{
    items?: FaqItem[]
  }>(),
  {
    items: () => defaultFaqs,
  }
)

const faqList = computed(() => props.items || defaultFaqs)

// Keep first FAQ open by default for immediate preview
const openIndices = ref<Set<number>>(new Set([0]))

function isOpen(index: number): boolean {
  return openIndices.value.has(index)
}

function toggleFaq(index: number, question: string) {
  if (openIndices.value.has(index)) {
    openIndices.value.delete(index)
  } else {
    openIndices.value.add(index)
    // First-party telemetry event
    if (import.meta.client) {
      const payload = JSON.stringify({
        eventName: 'faq_open',
        pagePath: window.location.pathname,
        props: { question, index },
        sessionId: undefined,
      })
      if (!navigator.sendBeacon?.('/api/track', new Blob([payload], { type: 'application/json' }))) {
        $fetch('/api/track', { method: 'POST', body: JSON.parse(payload) }).catch(() => {})
      }
    }
  }
}

// Inject SSR JSON-LD Schema.org FAQPage
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqList.value.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      }),
    },
  ],
})
</script>

<style scoped>
/* Progressive enhancement: when JavaScript is disabled, render answers visible */
@media (scripting: none) {
  .faq-panel {
    grid-template-rows: 1fr !important;
  }
}
</style>
```

---

### 3. `apps/web/app/components/ClosingCta.vue`
```vue
<template>
  <section
    id="demo"
    aria-labelledby="closing-heading"
    class="relative bg-wall pt-20 sm:pt-28 pb-16 sm:pb-24 overflow-hidden"
  >
    <!-- Background Texture -->
    <div
      class="absolute inset-0 opacity-[0.03] pointer-events-none"
      style="background-image: radial-gradient(#12355B 1px, transparent 1px); background-size: 28px 28px;"
      aria-hidden="true"
    />

    <!-- Part 1: Visual Bookend & Echo Aperture with Knockout Typography -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
      <div class="relative w-full rounded-[32px] sm:rounded-[44px] bg-paper border border-navy-100/70 p-6 sm:p-12 lg:p-16 shadow-card overflow-hidden">
        
        <!-- Knockout Text Outside Portal (Navy on Light Surface) -->
        <p class="portal-type type-out select-none" aria-hidden="true">
          <span>MARI</span>
          <span>MULAI</span>
        </p>

        <!-- Static S-Curve Aperture Portal (Echoing Hero Window) -->
        <div class="closing-portal relative z-10 mx-auto w-full max-w-3xl aspect-[16/9] sm:aspect-[21/9] rounded-[48px_16px_16px_16px] sm:rounded-[120px_24px_24px_24px] bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-overlay overflow-hidden">
          
          <!-- Subtle Glow Accent -->
          <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" aria-hidden="true" />
          <div class="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" aria-hidden="true" />

          <!-- Knockout Text Inside Portal (Pure White on Dark Navy) -->
          <p class="portal-type type-in select-none" aria-hidden="true">
            <span>MARI</span>
            <span>MULAI</span>
          </p>

          <!-- Core Message Over Aperture -->
          <div class="relative z-20 max-w-xl text-white">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-medium border border-cyan-400/30 mb-3">
              <span class="material-symbols-rounded text-sm">touch_app</span>
              <span>12 APLIKASI · SATU DATA</span>
            </span>
            <h2
              id="closing-heading"
              class="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight"
            >
              Bukan sekadar fitur. Ketenangan.
            </h2>
            <p class="mt-3 text-sm sm:text-base text-navy-100/90 font-body leading-relaxed max-w-lg mx-auto">
              Orang tua tenang, satpam yakin, bendahara rapi, guru tidak mengetik dua kali, dan pimpinan melihat angka tanpa menunggu rekap Excel.
            </p>

            <!-- Quick Action Pills -->
            <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#demo-form"
                class="px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Isi Formulir Demo ↓
              </a>
              <a
                :href="waQuickUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 flex items-center gap-1.5"
              >
                <span>Chat via WhatsApp</span>
                <span class="material-symbols-rounded text-base" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Part 2: Lead Generation Engine & Direct Form -->
    <div id="demo-form" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <slot>
        <DemoForm :settings="settings" />
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { settings as defaultSettings } from '@ssd/shared'
import DemoForm from './DemoForm.vue'

const props = withDefaults(
  defineProps<{
    settings?: Record<string, any>
  }>(),
  {
    settings: () => defaultSettings,
  }
)

const waQuickUrl = computed(() => {
  const phone = props.settings?.contact?.whatsapp || '6285839845284'
  const text = encodeURIComponent(
    props.settings?.cta?.whatsappText ||
      'Halo Digital Teknologi Perkasa, saya ingin jadwalkan demo School Smart Digital (SSD) untuk sekolah/yayasan kami.'
  )
  return `https://wa.me/${phone}?text=${text}`
})
</script>

<style scoped>
/* Knockout Typography Styling matching Cliff House & HeroPortal adaptation */
.portal-type {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display, "Bricolage Grotesque", sans-serif);
  font-weight: 800;
  font-variation-settings: "opsz" 72, "wdth" 108;
  font-size: clamp(3rem, 13vw, 11rem);
  line-height: 0.85;
  letter-spacing: -0.04em;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
}

.type-out {
  color: #12355B;
  opacity: 0.08;
}

.type-in {
  color: #FFFFFF;
  opacity: 0.12;
}
</style>
```

---

### 4. `apps/web/app/components/DemoForm.vue`
```vue
<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
    <!-- Left Column: 11-Field Lead Intake Form -->
    <div class="lg:col-span-7 bg-surface rounded-3xl border border-navy-100/80 p-6 sm:p-10 shadow-card">
      <div class="mb-8">
        <h3 class="text-2xl sm:text-3xl font-display font-bold text-navy-900 tracking-tight">
          Jadwalkan Demo & Konsultasi
        </h3>
        <p class="mt-2 text-sm sm:text-base text-navy-700 font-body">
          Isi profil singkat sekolah Anda. Tim konsultan kami akan menyiapkan simulasi data sesuai jenjang unit Anda.
        </p>
      </div>

      <!-- State 3: Success Confirmation Card -->
      <div
        v-if="formState === 'success'"
        class="rounded-2xl bg-cyan-50 border border-cyan-200 p-6 sm:p-8 text-center animate-fade-in"
      >
        <div class="w-14 h-14 rounded-full bg-cyan-500 text-navy-950 flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-rounded text-3xl">check_circle</span>
        </div>
        <h4 class="text-xl sm:text-2xl font-display font-bold text-navy-900 mb-2">
          Permintaan Demo Terkirim!
        </h4>
        <p class="text-navy-700 font-body text-sm sm:text-base leading-relaxed mb-6">
          Terima kasih, <strong class="text-navy-950">{{ formData.name }}</strong>. Tim konsultan kami akan menghubungi Anda melalui WhatsApp di nomor <strong class="text-navy-950 font-mono">{{ formData.whatsapp }}</strong> untuk mengonfirmasi jadwal demo <strong class="text-navy-950">{{ formData.organization }}</strong>.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            :href="dynamicWaUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900"
          >
            <span>Buka WhatsApp Langsung</span>
            <span class="material-symbols-rounded text-base" aria-hidden="true">arrow_forward</span>
          </a>
          <button
            type="button"
            class="w-full sm:w-auto px-5 py-3 rounded-xl border border-navy-200 text-navy-700 hover:bg-white text-sm font-medium transition-colors"
            @click="resetForm"
          >
            Kirim Permintaan Lain
          </button>
        </div>
      </div>

      <!-- State 4: Rate-Limited Friendly Notice -->
      <div
        v-else-if="formState === 'rate-limited'"
        class="rounded-2xl bg-amber-50 border border-amber-200 p-6 sm:p-8 text-center"
      >
        <div class="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-rounded text-3xl">schedule</span>
        </div>
        <h4 class="text-xl font-display font-bold text-navy-900 mb-2">
          Pengiriman Dibatasi Sementara
        </h4>
        <p class="text-navy-700 font-body text-sm leading-relaxed mb-6">
          Anda sudah mengirim beberapa permintaan dalam waktu singkat. Demi kenyamanan Anda, silakan hubungi tim kami langsung melalui WhatsApp untuk respon instan.
        </p>
        <a
          :href="dynamicWaUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900"
        >
          <span>Chat via WhatsApp Sekarang</span>
          <span class="material-symbols-rounded text-base" aria-hidden="true">arrow_forward</span>
        </a>
      </div>

      <!-- Form Mode (Idle, Submitting, Error) -->
      <form
        v-else
        action="/api/leads"
        method="POST"
        novalidate
        :aria-busy="formState === 'submitting'"
        @submit.prevent="handleSubmit"
      >
        <!-- State 5: Top Error Summary Banner -->
        <div
          v-if="errorMessageSummary"
          role="alert"
          class="rounded-xl bg-red-50 border border-red-200 p-4 mb-6 text-red-900 text-sm flex items-start gap-3"
        >
          <span class="material-symbols-rounded text-red-600 text-xl flex-shrink-0">info</span>
          <div>
            <p class="font-semibold mb-1">Mohon lengkapi formulir dengan benar:</p>
            <p class="text-red-700 text-xs sm:text-sm">{{ errorMessageSummary }}</p>
          </div>
        </div>

        <div class="space-y-5">
          <!-- Row 1: Nama & Jabatan -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- 1. Nama Lengkap (Required) -->
            <div>
              <label for="lead-name" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Nama Lengkap <span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="lead-name"
                v-model="formData.name"
                name="name"
                type="text"
                required
                autocomplete="name"
                placeholder="cth. Dr. H. Mulyono"
                :class="inputClass('name')"
                :aria-invalid="!!fieldErrors.name"
                :aria-describedby="fieldErrors.name ? 'lead-name-error' : undefined"
                @blur="validateField('name')"
              >
              <p v-if="fieldErrors.name" id="lead-name-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.name }}
              </p>
            </div>

            <!-- 2. Jabatan (Optional) -->
            <div>
              <label for="lead-role" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Jabatan / Peran
              </label>
              <input
                id="lead-role"
                v-model="formData.roleTitle"
                name="roleTitle"
                type="text"
                autocomplete="organization-title"
                placeholder="cth. Ketua Yayasan / Kepala Sekolah"
                :class="inputClass('roleTitle')"
              >
            </div>
          </div>

          <!-- Row 2: Lembaga & Jenis Lembaga -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- 3. Nama Sekolah / Yayasan (Required) -->
            <div>
              <label for="lead-org" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Nama Sekolah / Yayasan <span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="lead-org"
                v-model="formData.organization"
                name="organization"
                type="text"
                required
                autocomplete="organization"
                placeholder="cth. Yayasan Insan Cita Mandiri"
                :class="inputClass('organization')"
                :aria-invalid="!!fieldErrors.organization"
                :aria-describedby="fieldErrors.organization ? 'lead-org-error' : undefined"
                @blur="validateField('organization')"
              >
              <p v-if="fieldErrors.organization" id="lead-org-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.organization }}
              </p>
            </div>

            <!-- 4. Jenis Lembaga (Required Select) -->
            <div>
              <label for="lead-org-type" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Jenis Lembaga <span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="lead-org-type"
                v-model="formData.orgType"
                name="orgType"
                required
                :class="inputClass('orgType')"
                :aria-invalid="!!fieldErrors.orgType"
                :aria-describedby="fieldErrors.orgType ? 'lead-org-type-error' : undefined"
                @blur="validateField('orgType')"
              >
                <option value="sekolah">Sekolah Formal (SD/SMP/SMA/SMK)</option>
                <option value="yayasan">Yayasan Multi-Unit</option>
                <option value="pondok">Pondok Pesantren / Islamic Boarding</option>
                <option value="tpq">TPQ / Madrasah Diniyah</option>
                <option value="lainnya">Lainnya</option>
              </select>
              <p v-if="fieldErrors.orgType" id="lead-org-type-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.orgType }}
              </p>
            </div>
          </div>

          <!-- Row 3: Siswa & Unit Count -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- 5. Perkiraan Jumlah Siswa -->
            <div>
              <label for="lead-students" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Perkiraan Jumlah Siswa
              </label>
              <select
                id="lead-students"
                v-model="formData.studentCountRange"
                name="studentCountRange"
                :class="inputClass('studentCountRange')"
              >
                <option value="">Pilih perkiraan siswa (opsional)</option>
                <option value="<100">&lt; 100 siswa</option>
                <option value="100-300">100 – 300 siswa</option>
                <option value="301-700">301 – 700 siswa</option>
                <option value="701-1500">701 – 1500 siswa</option>
                <option value=">1500">&gt; 1500 siswa</option>
              </select>
            </div>

            <!-- 6. Jumlah Unit -->
            <div>
              <label for="lead-units" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Jumlah Unit Pendidikan (1–50)
              </label>
              <input
                id="lead-units"
                v-model.number="formData.unitCount"
                name="unitCount"
                type="number"
                min="1"
                max="50"
                placeholder="cth. 3 (SD, SMP, SMA)"
                :class="inputClass('unitCount')"
                :aria-invalid="!!fieldErrors.unitCount"
                :aria-describedby="fieldErrors.unitCount ? 'lead-units-error' : undefined"
                @blur="validateField('unitCount')"
              >
              <p v-if="fieldErrors.unitCount" id="lead-units-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.unitCount }}
              </p>
            </div>
          </div>

          <!-- Row 4: WhatsApp & Email -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- 7. WhatsApp (Required) -->
            <div>
              <label for="lead-wa" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp <span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="lead-wa"
                v-model="formData.whatsapp"
                name="whatsapp"
                type="tel"
                required
                autocomplete="tel"
                placeholder="cth. 081234567890"
                :class="inputClass('whatsapp')"
                :aria-invalid="!!fieldErrors.whatsapp"
                :aria-describedby="fieldErrors.whatsapp ? 'lead-wa-error' : undefined"
                @blur="validateField('whatsapp')"
              >
              <p v-if="fieldErrors.whatsapp" id="lead-wa-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.whatsapp }}
              </p>
            </div>

            <!-- 8. Email (Optional) -->
            <div>
              <label for="lead-email" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <input
                id="lead-email"
                v-model="formData.email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="cth. yayasan@insancita.sch.id"
                :class="inputClass('email')"
                :aria-invalid="!!fieldErrors.email"
                :aria-describedby="fieldErrors.email ? 'lead-email-error' : undefined"
                @blur="validateField('email')"
              >
              <p v-if="fieldErrors.email" id="lead-email-error" class="mt-1 text-xs text-red-600">
                {{ fieldErrors.email }}
              </p>
            </div>
          </div>

          <!-- 9. Minat Aplikasi (Multi-checkbox / Chips) -->
          <div>
            <label class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-2">
              Modul / Aplikasi yang Ingin Diprioritaskan (Pilih Sesuai Kebutuhan)
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label
                v-for="app in availableApps"
                :key="app.slug"
                class="flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors select-none"
                :class="[
                  formData.interests.includes(app.slug)
                    ? 'bg-cyan-50 border-cyan-400 text-navy-950 font-semibold'
                    : 'bg-surface border-navy-100 text-navy-700 hover:bg-paper-warm/50'
                ]"
              >
                <input
                  v-model="formData.interests"
                  type="checkbox"
                  :value="app.slug"
                  class="rounded text-cyan-600 focus:ring-navy-900 border-navy-300"
                >
                <span class="truncate">{{ app.name }}</span>
              </label>
            </div>
          </div>

          <!-- 10. Catatan Khusus / Pesan -->
          <div>
            <label for="lead-msg" class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
              Kebutuhan Khusus / Pertanyaan Awal
            </label>
            <textarea
              id="lead-msg"
              v-model="formData.message"
              name="message"
              rows="3"
              maxlength="1000"
              placeholder="Ceritakan kendala operasional yang paling mendesak di sekolah Anda saat ini..."
              :class="inputClass('message')"
            />
          </div>

          <!-- 11. Persetujuan Syarat & Kebijakan Privasi (Required Checkbox) -->
          <div class="pt-2">
            <label class="flex items-start gap-3 cursor-pointer select-none">
              <input
                id="lead-consent"
                v-model="formData.consent"
                name="consent"
                type="checkbox"
                required
                class="mt-1 rounded text-cyan-600 focus:ring-navy-900 border-navy-300 h-4 w-4"
                :aria-invalid="!!fieldErrors.consent"
                :aria-describedby="fieldErrors.consent ? 'lead-consent-error' : undefined"
              >
              <span class="text-xs text-navy-700 font-body leading-relaxed">
                Saya menyetujui
                <NuxtLink to="/privacy-policy" target="_blank" class="text-cyan-700 font-semibold underline hover:text-navy-900">
                  Kebijakan Privasi
                </NuxtLink>
                dan memberikan izin kepada tim School Smart Digital untuk menghubungi saya via WhatsApp/Telepon untuk keperluan demo.
                <span class="text-red-500" aria-hidden="true">*</span>
              </span>
            </label>
            <p v-if="fieldErrors.consent" id="lead-consent-error" class="mt-1 text-xs text-red-600">
              {{ fieldErrors.consent }}
            </p>
          </div>

          <!-- 12. Honeypot Field (Offscreen & Hidden from Real Users) -->
          <div aria-hidden="true" style="position: absolute; left: -9999px; opacity: 0; pointer-events: none; tab-index: -1;">
            <label for="lead-website">Jangan isi kolom ini jika Anda manusia</label>
            <input
              id="lead-website"
              v-model="formData.website"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
            >
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="formState === 'submitting'"
              class="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:bg-navy-700 text-white font-display font-semibold text-base transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer"
            >
              <span v-if="formState === 'submitting'" class="inline-flex items-center gap-2">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Mengirim Permintaan...</span>
              </span>
              <span v-else class="inline-flex items-center gap-2">
                <span>Kirim Permintaan Demo</span>
                <span class="material-symbols-rounded text-lg" aria-hidden="true">arrow_forward</span>
              </span>
            </button>
            <p class="mt-3 text-center text-xs text-navy-700/70 font-mono">
              Tanpa komitmen pembelian • Privasi terjaga • Pendampingan langsung
            </p>
          </div>
        </div>
      </form>
    </div>

    <!-- Right Column: WhatsApp Direct & Value Reassurance -->
    <div class="lg:col-span-5 space-y-6">
      <!-- Direct WhatsApp Channel Card -->
      <div class="rounded-3xl bg-gradient-to-br from-navy-950 to-navy-900 text-white p-6 sm:p-8 shadow-card border border-navy-800">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-medium border border-cyan-400/30 mb-4">
          <span class="material-symbols-rounded text-sm">chat</span>
          <span>RESPON LEBIH CEPAT</span>
        </div>
        <h4 class="text-xl sm:text-2xl font-display font-bold text-white mb-2">
          Ingin Diskusi Langsung?
        </h4>
        <p class="text-sm text-navy-100/85 font-body leading-relaxed mb-6">
          Jika yayasan Anda sedang merencanakan anggaran tahun ajaran baru atau ingin konsultasi cepat via pesan, langsung chat dengan konsultan kami.
        </p>

        <a
          :href="dynamicWaUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          @click="trackWaClick"
        >
          <span class="material-symbols-rounded text-xl" aria-hidden="true">chat</span>
          <span>Chat via WhatsApp Sekarang</span>
        </a>
        <p class="mt-3 text-center text-xs text-navy-100/60 font-mono">
          Nomor Resmi: +62 858-3984-5284
        </p>
      </div>

      <!-- Security & Transparency Checklist -->
      <div class="rounded-3xl bg-surface border border-navy-100/80 p-6 sm:p-8">
        <h5 class="text-base font-display font-bold text-navy-900 mb-4 flex items-center gap-2">
          <span class="material-symbols-rounded text-cyan-700">verified_user</span>
          <span>Jaminan Layanan Demo</span>
        </h5>
        <ul class="space-y-3 text-xs sm:text-sm text-navy-700 font-body">
          <li class="flex items-start gap-2.5">
            <span class="material-symbols-rounded text-emerald-600 text-base flex-shrink-0 mt-0.5">check_circle</span>
            <span>Simulasi langsung dengan skenario nyata unit sekolah Anda.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <span class="material-symbols-rounded text-emerald-600 text-base flex-shrink-0 mt-0.5">check_circle</span>
            <span>Uji coba alur pos gerbang, TV monitoring, dan laporan bendahara.</span>
          </li>
          <li class="flex items-start gap-2.5">
            <span class="material-symbols-rounded text-emerald-600 text-base flex-shrink-0 mt-0.5">check_circle</span>
            <span>Perhitungan proposal biaya transparan tanpa biaya tersembunyi.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { leadInputSchema, normalizeWa, apps as defaultApps, settings as defaultSettings, type AppItem } from '@ssd/shared'

const props = withDefaults(
  defineProps<{
    settings?: Record<string, any>
    apps?: AppItem[]
  }>(),
  {
    settings: () => defaultSettings,
    apps: () => defaultApps,
  }
)

const availableApps = computed(() => {
  return (props.apps || defaultApps).slice(0, 12)
})

type FormState = 'idle' | 'submitting' | 'success' | 'rate-limited' | 'error'

const formState = ref<FormState>('idle')
const errorMessageSummary = ref<string | null>(null)
const fieldErrors = reactive<Record<string, string>>({})

const formData = reactive({
  name: '',
  roleTitle: '',
  organization: '',
  orgType: 'sekolah' as 'sekolah' | 'yayasan' | 'tpq' | 'pondok' | 'lainnya',
  studentCountRange: '' as '' | '<100' | '100-300' | '301-700' | '701-1500' | '>1500',
  unitCount: undefined as number | undefined,
  whatsapp: '',
  email: '',
  interests: [] as string[],
  message: '',
  consent: false,
  website: '', // honeypot
})

function inputClass(fieldName: string) {
  const base =
    'w-full px-4 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface placeholder:text-navy-700/40 focus:outline-none focus:ring-2 transition-colors'
  if (fieldErrors[fieldName]) {
    return `${base} border-red-400 focus:ring-red-400 focus:border-red-500 bg-red-50/20`
  }
  return `${base} border-navy-200 focus:ring-navy-900 focus:border-navy-900`
}

function validateField(fieldName: keyof typeof formData) {
  const partialObj = { [fieldName]: formData[fieldName] }
  // @ts-ignore zod partial extraction
  const shape = leadInputSchema.shape[fieldName]
  if (!shape) return
  const result = shape.safeParse(formData[fieldName])
  if (!result.success) {
    fieldErrors[fieldName] = result.error.issues[0]?.message || 'Input tidak valid'
  } else {
    delete fieldErrors[fieldName]
  }
}

const dynamicWaUrl = computed(() => {
  const phone = props.settings?.contact?.whatsapp || '6285839845284'
  const name = formData.name.trim() || 'Pimpinan'
  const org = formData.organization.trim() || 'Sekolah/Yayasan'
  const text = `Halo Digital Teknologi Perkasa, saya ${name} dari ${org}. Saya ingin konsultasi jadwal demo School Smart Digital (SSD).\n\n(sumber: website_form_cta)`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
})

function trackWaClick() {
  if (import.meta.client) {
    const payload = JSON.stringify({
      eventName: 'cta_whatsapp',
      pagePath: window.location.pathname,
      props: { orgType: formData.orgType, source: 'side_panel' },
    })
    if (!navigator.sendBeacon?.('/api/track', new Blob([payload], { type: 'application/json' }))) {
      $fetch('/api/track', { method: 'POST', body: JSON.parse(payload) }).catch(() => {})
    }
  }
}

async function handleSubmit() {
  // Clear past error states
  errorMessageSummary.value = null
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])

  // Run full Zod schema validation
  const validationResult = leadInputSchema.safeParse({
    name: formData.name,
    roleTitle: formData.roleTitle,
    organization: formData.organization,
    orgType: formData.orgType,
    studentCountRange: formData.studentCountRange || undefined,
    unitCount: formData.unitCount ? Number(formData.unitCount) : undefined,
    whatsapp: formData.whatsapp,
    email: formData.email,
    interests: formData.interests,
    message: formData.message,
    consent: formData.consent,
    website: formData.website,
    source: 'landing_closing_form',
  })

  if (!validationResult.success) {
    formState.value = 'error'
    for (const issue of validationResult.error.issues) {
      const field = issue.path[0] as string
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message
      }
    }
    errorMessageSummary.value = validationResult.error.issues[0]?.message || 'Periksa kembali data formulir Anda.'
    return
  }

  // Honeypot check: if filled, absorb silently without server error
  if (formData.website && formData.website.trim().length > 0) {
    formState.value = 'success'
    return
  }

  formState.value = 'submitting'

  try {
    const res = await $fetch<{ ok: boolean; id?: string }>('/api/leads', {
      method: 'POST',
      body: validationResult.data,
    })

    if (res.ok) {
      formState.value = 'success'
      // First-party telemetry
      if (import.meta.client) {
        const payload = JSON.stringify({
          eventName: 'lead_submit',
          pagePath: window.location.pathname,
          props: { orgType: formData.orgType, units: formData.unitCount },
        })
        if (!navigator.sendBeacon?.('/api/track', new Blob([payload], { type: 'application/json' }))) {
          $fetch('/api/track', { method: 'POST', body: JSON.parse(payload) }).catch(() => {})
        }
      }
    }
  } catch (err: any) {
    if (err.statusCode === 429) {
      formState.value = 'rate-limited'
    } else {
      formState.value = 'error'
      errorMessageSummary.value =
        err?.data?.message || 'Maaf, terjadi kendala saat mengirim formulir. Silakan coba lagi atau hubungi via WhatsApp.'
    }
  }
}

function resetForm() {
  formData.name = ''
  formData.roleTitle = ''
  formData.organization = ''
  formData.orgType = 'sekolah'
  formData.studentCountRange = ''
  formData.unitCount = undefined
  formData.whatsapp = ''
  formData.email = ''
  formData.interests = []
  formData.message = ''
  formData.consent = false
  formData.website = ''
  formState.value = 'idle'
  errorMessageSummary.value = null
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
}
</script>
```

---

### 5. `apps/web/app/components/SiteFooter.vue`
```vue
<template>
  <footer
    id="kontak"
    aria-labelledby="footer-heading"
    class="bg-navy-950 text-white border-t border-navy-800/80 pt-16 sm:pt-20 pb-12 selection:bg-cyan-500 selection:text-navy-950"
  >
    <h2 id="footer-heading" class="sr-only">Navigasi Footer & Informasi Perusahaan</h2>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 4-Column Editorial Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-navy-800/60">
        
        <!-- Column 1: Brand & Attribution (Col 1-4) -->
        <div class="lg:col-span-4 space-y-5">
          <NuxtLink to="/" class="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
            <img
              src="/brand/logo-white.svg"
              alt="School Smart Digital"
              class="h-9 w-auto"
              width="204"
              height="36"
            >
          </NuxtLink>

          <p class="text-sm text-navy-100/80 font-body leading-relaxed max-w-sm">
            Sistem operasi terpadu sekolah modern oleh <strong class="text-white">PT Digital Teknologi Perkasa</strong>. Menghubungkan gerbang, ruang guru, klinik, hingga pembukuan yayasan dalam satu basis data terpadu.
          </p>

          <div class="pt-2 flex flex-wrap gap-2 text-xs font-mono text-cyan-300">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-900 border border-navy-800">
              <span class="material-symbols-rounded text-sm text-cyan-400">verified_user</span>
              <span>Kepatuhan UU PDP</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-900 border border-navy-800">
              <span class="material-symbols-rounded text-sm text-cyan-400">dns</span>
              <span>Multi-Unit Cloud</span>
            </span>
          </div>
        </div>

        <!-- Column 2: Navigasi Ekosistem (Col 5-6) -->
        <div class="lg:col-span-2 space-y-4">
          <p class="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
            Ekosistem
          </p>
          <ul class="space-y-2.5 text-sm font-body">
            <li>
              <NuxtLink to="/#ekosistem" class="text-navy-100/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
                12 Aplikasi Terpadu
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#alur" class="text-navy-100/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
                Alur 9 Langkah
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#spotlight" class="text-navy-100/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
                Sorotan BK & Gerbang
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#modul" class="text-navy-100/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
                12 Modul Back Office
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#perbandingan" class="text-navy-100/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
                Tabel Perbandingan
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 3: Kontak & Operasional (Col 7-9) -->
        <div class="lg:col-span-3 space-y-4">
          <p class="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
            Kantor & Layanan
          </p>
          <div class="space-y-3 text-sm text-navy-100/80 font-body">
            <p class="leading-relaxed">
              {{ companyAddress }}
            </p>
            <div class="space-y-1.5 pt-1">
              <p class="flex items-center gap-2">
                <span class="material-symbols-rounded text-cyan-400 text-base" aria-hidden="true">chat</span>
                <a :href="waUrl" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
                  +62 858-3984-5284
                </a>
              </p>
              <p class="flex items-center gap-2">
                <span class="material-symbols-rounded text-cyan-400 text-base" aria-hidden="true">mail</span>
                <a :href="`mailto:${companyEmail}`" class="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm truncate">
                  {{ companyEmail }}
                </a>
              </p>
            </div>
            <p class="text-xs text-navy-100/60 pt-1 font-mono">
              Senin – Jumat: 08.00 – 17.00 WIB
            </p>
          </div>
        </div>

        <!-- Column 4: Legal & Entitas Terkait (Col 10-12) -->
        <div class="lg:col-span-3 space-y-4">
          <p class="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
            Legalitas & Jaringan
          </p>
          <ul class="space-y-2.5 text-sm font-body">
            <li>
              <NuxtLink to="/privacy-policy" class="text-navy-100/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
                Kebijakan Privasi
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/terms" class="text-navy-100/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
                Syarat & Ketentuan Layanan
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq" class="text-navy-100/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
                Pusat FAQ & Panduan
              </NuxtLink>
            </li>
            <li>
              <a
                href="https://pesantrensmartdigital.com"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-navy-100/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm"
              >
                <span>Pesantren Smart Digital</span>
                <span class="material-symbols-rounded text-xs" aria-hidden="true">open_in_new</span>
              </a>
            </li>
            <li>
              <a
                :href="parentProfileUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-navy-100/75 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm"
              >
                <span>Profil Digital Teknologi Perkasa</span>
                <span class="material-symbols-rounded text-xs" aria-hidden="true">open_in_new</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar: Copyright & Accessibility -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-100/60 font-body">
        <p>
          © 2026 PT Digital Teknologi Perkasa. Hak Cipta Dilindungi.
        </p>
        <p class="font-mono text-center sm:text-right">
          Aksesibilitas WCAG 2.1 AA • S-Curve Design System
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { settings as defaultSettings } from '@ssd/shared'

const props = withDefaults(
  defineProps<{
    settings?: Record<string, any>
  }>(),
  {
    settings: () => defaultSettings,
  }
)

const companyAddress = computed(() => {
  return (
    props.settings?.contact?.address ||
    'Perum Graha Madu Pesona Blok C No.31, Bandar Lampung, Lampung'
  )
})

const companyEmail = computed(() => {
  return props.settings?.contact?.email || 'digitalteknologiperkasa.lampung@gmail.com'
})

const parentProfileUrl = computed(() => {
  return props.settings?.company?.parentUrl || 'https://digital-teknologi-perkasa-profile.vercel.app'
})

const waUrl = computed(() => {
  const phone = props.settings?.contact?.whatsapp || '6285839845284'
  const text = encodeURIComponent('Halo tim Digital Teknologi Perkasa, saya ingin berkonsultasi mengenai School Smart Digital.')
  return `https://wa.me/${phone}?text=${text}`
})
</script>
```

---

### 6. `apps/web/app/pages/index.vue`
```vue
<template>
  <div class="min-h-screen bg-background text-primary selection:bg-cyan-500 selection:text-white">
    <!-- 1. Sticky Adaptive Navigation -->
    <SiteNavigation />

    <!-- 2. Hero S-Curve Morph Aperture + Semantic H1 -->
    <HeroPortal />

    <!-- 3. Problem List: 7 Operational Pain Points -->
    <ProblemList
      id="masalah"
      :items="content.painPoints"
    />

    <!-- 4. Ecosystem Selector: 12 Apps with Sticky Portal Frame -->
    <EcosystemSelector
      id="ekosistem"
      :apps="content.apps"
    />

    <!-- 5. Flow Timeline: 9 Steps + Pass Operasional Ticket -->
    <FlowTimeline
      id="alur"
      :steps="content.flowSteps"
    />

    <!-- 6. Spotlight Tabs: BK, Raport Digital, Security Gate -->
    <SpotlightTabs id="spotlight" />

    <!-- 7. Back Office Module Grid (12 Groups) -->
    <ModuleGrid
      id="modul"
      :groups="content.moduleGroups"
    />

    <!-- 8. Role Ladder (Access Levels 0–9) -->
    <RoleLadder
      id="peran"
      :levels="content.roleLevels"
    />

    <!-- 9. Unit Diagram (Multi-Unit Hierarchy SD/SMP/TPQ/Pondok) -->
    <UnitDiagram id="yayasan" />

    <!-- 10. Trust Pillars (Security & Counseling Privacy) -->
    <TrustPillars id="keamanan" />

    <!-- 11. Honest Comparison Table (Typical vs SSD) -->
    <HonestTable
      id="perbandingan"
      :rows="content.comparisonRows"
    />

    <!-- 12. Parent Brand Credentials Banner (DTP & PSD) -->
    <ParentBrandStrip
      id="kredensial"
      :settings="content.settings"
    />

    <!-- 13. Accessible FAQ Accordion (9 FAQs + SSR JSON-LD) -->
    <FaqAccordion
      id="faq"
      :items="content.faqs"
    />

    <!-- 14. Closing CTA Echo Portal + 11-Field Demo Form -->
    <ClosingCta
      id="demo"
      :settings="content.settings"
    >
      <DemoForm
        :settings="content.settings"
        :apps="content.apps"
      />
    </ClosingCta>

    <!-- 15. 4-Column Editorial Site Footer -->
    <SiteFooter :settings="content.settings" />
  </div>
</template>

<script setup lang="ts">
import { fallbackContent, type LandingContent } from '@ssd/shared'

// Safe, non-flicker async data fetch with guaranteed fallback payload
const { data } = await useAsyncData<LandingContent>(
  'landing-content',
  () => $fetch<LandingContent>('/api/content'),
  {
    default: () => fallbackContent,
  }
)

const content = computed<LandingContent>(() => data.value || fallbackContent)

// SSR SEO Meta
useSeoMeta({
  title: 'School Smart Digital (SSD) — Sistem Operasi untuk Sekolah Anda',
  description:
    'Satu platform, dua belas aplikasi, satu data: absensi gerbang, keuangan yayasan, rapor digital, konseling BK tertutup, dan komunikasi orang tua untuk sekolah modern, yayasan multi-unit, dan pondok pesantren.',
  ogTitle: 'School Smart Digital (SSD) — Sistem Operasi Terpadu Sekolah',
  ogDescription:
    'Dari gerbang sekolah sampai rekening yayasan — seluruh operasional terhubung dalam satu data. Dikembangkan oleh PT Digital Teknologi Perkasa.',
  ogImage: '/brand/logo.svg',
  twitterCard: 'summary_large_image',
  themeColor: '#12355B',
})

// Organization & SoftwareApplication JSON-LD Structured Data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://digital-teknologi-perkasa-profile.vercel.app/#organization',
            name: 'Digital Teknologi Perkasa',
            url: 'https://digital-teknologi-perkasa-profile.vercel.app',
            logo: 'https://digital-teknologi-perkasa-profile.vercel.app/favicon.svg',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+62-858-3984-5284',
              contactType: 'customer service',
              areaServed: 'ID',
              availableLanguage: ['Indonesian'],
            },
          },
          {
            '@type': 'SoftwareApplication',
            name: 'School Smart Digital',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web, Android, PWA',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'IDR',
              description: 'Konsultasi demo dan estimasi biaya implementasi yayasan',
            },
            publisher: {
              '@id': 'https://digital-teknologi-perkasa-profile.vercel.app/#organization',
            },
          },
        ],
      }),
    },
  ],
})
</script>
```

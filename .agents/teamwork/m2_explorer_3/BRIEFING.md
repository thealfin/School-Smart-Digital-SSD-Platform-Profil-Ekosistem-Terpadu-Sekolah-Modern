# BRIEFING — 2026-10-24T19:56:00Z

## Mission
Discover and document exhaustive specifications, edge cases, schemas, and complete Vue 3 SFC blueprints for Part 3 components: ParentBrandStrip, FaqAccordion, ClosingCta, DemoForm, SiteFooter, and index.vue.

## 🔒 My Identity
- Archetype: specification_miner
- Roles: teamwork_preview_spec_miner
- Working directory: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_3
- Original parent: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Milestone: Milestone 2 Scope - Part 3: Conversion, Navigation & Page Assembly

## 🔒 Key Constraints
- Discover and document features by probing authoritative specification; do NOT implement directly in production app source code (blueprints go to handoff.md).
- Deliver exhaustive component blueprints and code in handoff.md for: ParentBrandStrip.vue, FaqAccordion.vue, ClosingCta.vue, DemoForm.vue, SiteFooter.vue, index.vue.
- Respect content guardrails: no fabricated testimonials, no fake partner logos, strictly follow official shared content and schemas.
- Ensure SSR hydration resilience, WCAG 2.1 AA accessibility (aria-expanded, form labels, keyboard navigation), JSON-LD schema injection.
- Keep BRIEFING under 100 lines and maintain progress.md heartbeat.

## Current Parent
- Conversation ID: 1ff91f96-3422-4423-9647-7ab08609ae2d
- Updated: 2026-10-24T19:56:00Z

## Task Summary
- **What to build**: Exhaustive blueprints & Vue 3 SFC implementations for ParentBrandStrip.vue, FaqAccordion.vue, ClosingCta.vue, DemoForm.vue, SiteFooter.vue, and master index.vue.
- **Success criteria**: Complete specification mining of features, interfaces, props, slots, edge cases, accessibility, validation schemas, and drop-in code blueprints ready for builder agent.
- **Interface contracts**: PROJECT.md, ORIGINAL_REQUEST.md, packages/shared/src/content/index.ts, packages/shared/src/schemas.ts, docs/01, docs/02, docs/04.
- **Code layout**: apps/web/app/components/ and apps/web/app/pages/.

## Key Decisions Made
- ParentBrandStrip: Strictly adheres to zero-fake-stats guardrail; renders verified credentials of PT Digital Teknologi Perkasa and Pesantren Smart Digital (`pesantrensmartdigital.com`), hiding testimonials and unverified counters when flags are false.
- FaqAccordion: Accessible disclosure using CSS grid animation (`grid-template-rows: 0fr -> 1fr`) in 250ms with `<button :aria-expanded :aria-controls>`, SSR JSON-LD `FAQPage` injection via `useHead`, and noscript progressive enhancement.
- ClosingCta: Echo portal bookend mimicking HeroPortal aperture with knockout `MARI / MULAI` display typography (Navy on wall, White in aperture) and philosophy quote.
- DemoForm: 11 fields + honeypot `website`, Zod schema validation matching `leadInputSchema`, 5 UX states (idle, submitting, success, rate-limited, error), inline `aria-describedby` errors, top `role="alert"` summary, and direct dynamic WhatsApp URL generator with source tracking.
- SiteFooter: Dark Navy-950 4-column editorial layout with `logo-white.svg`, verified contact info, legal links, and WCAG AA contrast.
- index.vue: Assembles all 14 components in semantic sequence with non-blocking async data fetch defaulting to `fallbackContent` for flicker-free SSR and zero hydration mismatch.

## Artifact Index
- handoff.md — 5-section handoff report, Features Discovered (9 items), Edge Cases (15 items), and complete production-ready SFC code for all 6 components.
- progress.md — Liveness heartbeat and milestone tracking.

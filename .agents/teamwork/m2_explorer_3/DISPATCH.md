# DISPATCH — m2_explorer_3

## Task
You are m2_explorer_3 (teamwork_preview_spec_miner).
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_3
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md
Read PROJECT.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md
Read authoritative UI/UX docs:
- `docs/01-PRD-SSD-Landing-Page.md`
- `docs/02-UIUX-DESIGN-SSD-Landing-Page.md`
- `docs/04-HERO-MORPH-DESIGN-ADAPTATION.md`
- `packages/shared/src/content/index.ts`
- `packages/shared/src/schemas.ts`

## Objective (Milestone 2 Scope - Part 3: Conversion, Navigation & Page Assembly)
Provide complete, production-ready Vue 3 SFC component blueprints for:
1. `apps/web/app/components/ParentBrandStrip.vue`:
   - Digital Teknologi Perkasa & Pesantren Smart Digital track record.
   - Guardrail-clean: partner count (if enabled), official credentials banner, testimonials hidden unless verified.
2. `apps/web/app/components/FaqAccordion.vue`:
   - 9 accessible FAQs (`<button aria-expanded>`) with smooth disclosure.
   - SSR JSON-LD `FAQPage` schema injected into `<head>`.
3. `apps/web/app/components/ClosingCta.vue`:
   - Echo portal visual bookend with giant `MARI / MULAI` knockout display typography.
   - Direct lead-in to DemoForm and primary CTA buttons.
4. `apps/web/app/components/DemoForm.vue`:
   - 11-field comprehensive demo request form:
     Name, Role, Org, OrgType (select), StudentCountRange (select), UnitCount, WhatsApp, Email, Interests (multi-checkbox), Message, Consent (checkbox), Honeypot field `website` (hidden).
   - 5 states: Idle, Submitting, Success, Error, Rate-limit (with friendly message).
   - Progressive enhancement: fallback direct submission or WA redirect.
   - Direct WhatsApp CTA generator with prefilled encoded text and source placement tracking.
5. `apps/web/app/components/SiteFooter.vue`:
   - 4-column editorial footer: Brand & attribution, Nav links, Contact & Social, Legal links (`/privacy-policy`, `/terms`, `/faq`).
6. `apps/web/app/pages/index.vue`:
   - Master assembly file orchestrating all 14 components in semantic sequence with SSR hydration resilience.

Write your exhaustive component blueprints to `handoff.md` and notify orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`).


## 2026-10-24T19:49:46Z
You are m2_explorer_3.
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_3
You must read ORIGINAL_REQUEST.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\ORIGINAL_REQUEST.md
Your dispatch instructions are at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m2_explorer_3\DISPATCH.md
Read PROJECT.md at: d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md

Provide exhaustive component blueprints and code for:
- ParentBrandStrip.vue (credentials banner)
- FaqAccordion.vue (accessible FAQ accordion + JSON-LD)
- ClosingCta.vue (echo portal + MARI/MULAI knockout text)
- DemoForm.vue (11 fields, progressive enhancement, WA generator)
- SiteFooter.vue (4-column editorial footer)
- index.vue (master assembly of all 14 sections)

Write your blueprints to `handoff.md` and notify orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`).

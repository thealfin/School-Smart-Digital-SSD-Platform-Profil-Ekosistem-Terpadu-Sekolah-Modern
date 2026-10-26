# DISPATCH — m4_explorer_3

**Agent**: `m4_explorer_3`  
**Role**: `teamwork_preview_spec_miner` (Viewport Responsiveness & SSR Resilience Spec Miner)  
**Parent / Dispatcher**: `orchestrator_1` (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_explorer_3`  

## Objective
Author the viewport responsiveness and resilient SSR stream hardening blueprint for Milestone 4:
1. Multi-Viewport Layout Integrity (320px, 375px, 768px, 1024px, 1440px):
   - Verify that horizontal overflow is strictly eliminated across all 14 landing sections, legal pages, and admin pages (`max-width: 100vw; overflow-x: clip;`).
   - Check mobile pinning (42vh) in `EcosystemSelector.vue`.
   - Check mobile card conversion in `HonestTable.vue` (<640px) and `apps/web/app/pages/admin/leads.vue` (<768px).
2. Resilient SSR Stream & Zero-JS Progressive Enhancement:
   - Verify that raw SSR response from `GET /` contains:
     - Heading `<h1>Sistem operasi<br />untuk sekolah Anda.</h1>`
     - All 12 application names, slugs, and summaries
     - All 9 buyer FAQs and Schema.org `FAQPage` JSON-LD
     - Schema.org `Organization` and `SoftwareApplication` structured data
   - Verify that all `<noscript>` or zero-JS styles allow full content consumption without client JavaScript.
3. Reduced Motion Support:
   - Verify `@media (prefers-reduced-motion: reduce)` in `main.css` and `HeroPortal.vue` (static display with $e=1, b=1$, ledge visible).
4. Formulate any necessary polish patches for `m4_worker`.

## Mandatory Input Documents (READ FIRST)
1. `d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md` (Mandatory - read first!)
2. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `d:\All Project Website\Web School Smart Digital\TEST_READY.md`

## Output Requirements
Write `handoff.md` in your working directory (`d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_explorer_3\handoff.md`) with verification results and exact code patches for `m4_worker`.
Notify parent `1ff91f96-3422-4423-9647-7ab08609ae2d` when complete.


## 2026-10-25T06:48:22Z
You are m4_explorer_3, the Viewport Responsiveness & SSR Resilience Spec Miner for Milestone 4.
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_explorer_3
Read d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_explorer_3\DISPATCH.md for your full task.

MANDATORY INPUT DOCUMENTS (READ FIRST):
1. d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md
2. d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md
3. d:\All Project Website\Web School Smart Digital\TEST_READY.md

Audit multi-viewport layout boundaries across 320px, 375px, 768px, 1024px, 1440px.
Audit resilient SSR stream generation without client JS (semantic h1, 12 apps, FAQs, Schema.org JSON-LD).
Audit reduced motion support (prefers-reduced-motion: reduce).
Formulate drop-in polish patches if needed.

Write your report in d:\All Project Website\Web School Smart Digital\.agents\teamwork\m4_explorer_3\handoff.md and send a message back to parent 1ff91f96-3422-4423-9647-7ab08609ae2d.

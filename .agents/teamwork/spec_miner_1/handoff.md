# Handoff Report: Specification Mining for School Smart Digital (SSD) Landing Page

**Agent**: `spec_miner_1` (Teamwork Preview Spec Miner)  
**Date**: 2026-10-24T18:42:00Z  
**Recipient**: Orchestrator (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\spec_miner_1`  
**Reference Specification Documents**:
- `docs/00-MASTER-PROMPT-SSD-LANDING.md`
- `docs/01-PRD-SSD-Landing-Page.md`
- `docs/02-UIUX-DESIGN-SSD-Landing-Page.md`
- `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md`
- `docs/04-HERO-MORPH-DESIGN-ADAPTATION.md`
- `scripts/guardrail-check.mjs`
- `ORIGINAL_REQUEST.md`

---

## 1. Observation

Direct examination of authoritative specification files reveals the following explicit structural, visual, technical, and guardrail requirements:

1. **Brand Identity & Core Theme**:
   - Primary palette: Navy `#12355B` (`navy-900`), Cyan `#00B4D8` (`cyan-500`), Deep Navy `#0A2036` (`navy-950`).
   - Surfaces: Wall/Paper `#F6F9FC` (`--ssd-wall` / `--color-paper`), White `#FFFFFF` (`--ssd-paper`), Warm Paper `#F1F6FB` (`--ssd-paper-warm`), Tinted `#EDFAFD` (`cyan-50`).
   - Text on light surfaces: Primary `#0A2036`, Secondary `#46607A` (contrast ≈ 6:1), Cyan Text `#00758F` (`cyan-700`, contrast ≈ 5.3:1). Cyan `#00B4D8` text is **forbidden** on white/light backgrounds (contrast ≈ 2.5:1, fails WCAG AA).
   - Focus rings: Navy 3px (`#12355B`) on light surfaces; Cyan 3px (`#00B4D8`) on Navy surfaces (`.surface-inverse`).
   - Typography: Variable display font **Bricolage Grotesque** (`font-variation-settings: "opsz" 72, "wdth" 92` / `108`), body font **Plus Jakarta Sans**, monospace font **JetBrains Mono**. Self-hosted via `@nuxt/fonts`.

2. **Hero S-Curve Morph Aperture Mechanics (`HeroPortal.vue`)**:
   - Adapted from the architectural "Cliff House" metaphor into the signature **SSD S-Curve Portal** (derived from the iconic SSD logo: a square block with an oversized rounded top-left corner and 16–18px subtle rounded corners for the remaining three).
   - Staging: Section height `250svh` when JavaScript and motion are enabled; inner `.stage` is `position: sticky; top: 0; height: 100svh; overflow: hidden`.
   - Scroll Progress:
     - Total progress: $p = \text{clamp}((\text{scrollY} - \text{top}) / (\text{height} - H), 0, 1)$
     - Window aperture expansion: $e = \text{easeInOutCubic}(\text{clamp}(p / 0.70, 0, 1))$ (opens fully within the first 70% of scroll).
     - Ledge rise: $b = 1 - (1 - \text{clamp}((p - 0.70) / 0.30, 0, 1))^3$ (rises smoothly during the remaining 30% of scroll).
     - Initial aperture dimension: Mobile $w_0 = 0.62W$, $h_0 = \min(0.48H, 1.35w_0)$; Desktop $w_0 = \text{clamp}(0.24W, 220, 420)$, $h_0 = \min(0.58H, 1.38w_0)$.
     - Radius interpolation: $rTL = (0.44 w_0) \times (1 - e)$, $rOther = 18 \times (1 - e)$.
     - Clip-path applied to `.media`: `inset(${top}px ${side}px ${bottom}px ${side}px round ${rTL}px ${rOther}px ${rOther}px ${rOther}px)`.
   - Knockout typography: Gigantic display text `SCHOOL / SMART` (`15.5vw`, max 260px) rendered identically in `.type-out` (Navy `#12355B` on light wall) and `.type-in` (White `#FFFFFF` inside `.media` on Navy background). Both elements share exact same CSS sizing and positioning.
   - Semantic Heading: The semantic `<h1>Sistem operasi untuk sekolah Anda.</h1>` is housed in the rising `.ledge` component alongside 3 key fact definitions (`<dl>`) and CTA buttons, rising into view at $b \ge 0.5$ (`pointer-events: auto`).
   - Fallback & A11y: When `prefers-reduced-motion: reduce` or without JS, `--e: 1; --b: 1; height: 100svh`, displaying the fully revealed stage with all semantic content visible.

3. **Complete 14 Landing Sections**:
   - `0. SiteNavigation`: Sticky adaptive nav with dynamic `color-mix()` transition over the hero (Navy → White based on `--over`), followed by a blurred solid bar (`#F6F9FC` @ 92%) with scrollspy and full-screen mobile drawer.
   - `1. HeroPortal`: S-Curve morph portal + Knockout typography + rising `.ledge` with `<h1>`, fact list, and CTAs.
   - `2. ProblemList`: Restaurant analogy statement ("Sekolah seperti restoran...") + 7 daily operational pain points with interactive app chips linking to `#app-<slug>`.
   - `3. EcosystemSelector`: 12-app catalog with sticky S-Curve portal frame (pinned `42vh` on mobile) displaying device mockup, status badge, platform, 3–5 feature chips, contextual demo CTA; right column has 01–12 numbered list supporting keyboard navigation (ArrowUp/Down, Home/End) and URL hash `#app-<slug>`.
   - `4. FlowTimeline`: 9-step operational timeline illustrating the "Ahmad" demo flow from exit permit to ledger accounting, topped by the perforated "Pass Operasional Satu Data" ticket card (`.ops-ticket` + `.stub`).
   - `5. SpotlightTabs`: WAI-ARIA tabs for BK, Raport Digital, and Security Gate featuring tilted tactile paper cards (`rotate(-1.5deg)`) and circular stamps (`.stamp`).
   - `6. ModuleGrid & RoleLadder`: 12 Back Office module groups (collapsible disclosure `<details>`) and role access hierarchy (levels 0–9).
   - `7. UnitDiagram`: Multi-unit foundation visualization (Yayasan → SD · SMP · TPQ · Pondok) and 4 school segments.
   - `8. TrustPillars`: 4 verified security & privacy pillars (counseling privacy, tiered access 0–9, expiring daily QR, audit log).
   - `9. HonestTable`: 9-issue generic comparison table (typical vs SSD) transforming into stacked cards on mobile + "Yang tidak kami klaim" note (disclaiming LMS/CBT).
   - `10. ParentBrandStrip`: Track record of Digital Teknologi Perkasa & Pesantren Smart Digital (PSD) with verified citations; testimonials hidden by default.
   - `11. FaqAccordion`: Accessible accordion (`aria-expanded`) containing 8–9 Q&As and SSR JSON-LD `FAQPage`.
   - `12. ClosingCta & DemoForm`: Static echo portal with giant `MARI / MULAI` knockout text + "Bukan sekadar fitur. Ketenangan." leading directly to the 11-field Demo Request Form + direct WhatsApp CTA.
   - `13. SiteFooter`: 4-column editorial footer with official DTP attribution, quick links, contact info, theSVG brand icons, and legal links (`/privacy-policy`, `/terms`, `/faq`).

4. **Zero-Credential & Content Guardrails (`scripts/guardrail-check.mjs`)**:
   - Strictly forbidden in code, seed, and docs: test credentials (`guru123`, `walimurid123`, `bk123`, `cc123`, `bkdemo`, `cctv1`), private phone numbers (`62811110...`, `62813001...`).
   - Direct competitor brand names are banned (`MySCH`, `Smarteschool`, `Smart School Project`, `Sekolah Smart`, `Google Classroom`, `Dapodik`); generic categories must be used.
   - Internal cockpit platforms must NEVER appear: `Super Admin Platform`, `Admin Keuangan Platform`, `Master Admin IT`.
   - Development domain `scsd.my.id` must not be referenced in public links.
   - Fake stats ("98% klien puas", unverified counters, or artificial `aggregateRating` schema) are forbidden.

---

## 2. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Design Tokens | Tailwind CSS v4 `@theme` & CSS Variables | Unified color palette, Bricolage Grotesque / Plus Jakarta Sans / JetBrains Mono fonts, spacing, semantic tokens, and SVG grain | CSS rules in `main.css` | Global styling & design consistency | Fallback to system fonts & standard colors | `docs/03` §A6, `docs/04` §2 |
| 2 | Hero Experience | S-Curve Morph Aperture (`HeroPortal.vue`) | Scroll-linked aperture expansion with dual-stage morph (`--e`, `--b`), knockout text, inner glow, and ambient drift | Scroll offset, viewport dimensions, reduced-motion query | Dynamic `clip-path`, transform, CSS variables `--e`, `--b`, `--over` | Instant static open state when reduced motion or no JS | `docs/04` §3, `docs/02` §4.1 |
| 3 | Hero Experience | Knockout Split Typography | Dual identical text blocks (`SCHOOL / SMART`) rendering Navy on wall and White inside portal | DOM span hierarchy, `--font-display`, responsive viewport width | Seamless optical split without font jitter | Resets to hidden when aperture opens ($e \to 1$) | `docs/04` §3.1, `docs/02` §4.1 |
| 4 | Hero Experience | Rising Ledge Container | Rising semantic card housing `<h1>`, fact list (`<dl>`), and primary/secondary CTAs | Progress variable $b \ge 0.5$ | `pointer-events: auto`, translateY transition | Fully visible by default on reduced motion / SSR | `docs/04` §3.1, `docs/01` FR-03 |
| 5 | Navigation | Sticky Adaptive Navigation (`SiteNavigation.vue`) | Sticky nav bar with `color-mix()` transition from Navy to White over hero, scrollspy, and mobile drawer | Scroll position, active section ID, hamburger click | Dynamic text/pill color, solid background post-hero, drawer state | Trap focus in drawer; Esc closes drawer | `docs/04` §4.1, `docs/02` §4.0 |
| 6 | Value Narrative | 7 Operational Pain Points (`ProblemList.vue`) | Restaurant analogy statement + 7 daily operational school pain points with interactive app chips | Array of 7 pain points from seed/DB | 2-column layout; chip click navigates to `#app-<slug>` | Fallbacks to static list if DB unavailable | `docs/01` Lampiran C, `docs/02` §4.2 |
| 7 | Core Product | 12-App Ecosystem Selector (`EcosystemSelector.vue`) | Interactive catalog of 12 apps with sticky S-Curve portal preview (pinned on mobile) and 01–12 numbered list | App items array, keyboard events, hash change | Device preview, status badge, feature chips, URL hash update | Fallback to Back Office (`apps[0]`) if invalid slug | `docs/02` §4.3, `docs/04` §4.2 |
| 8 | Operational Evidence | 9-Step Timeline (`FlowTimeline.vue`) | Step-by-step daily journey of "Ahmad" with sticky device preview synced via IntersectionObserver | 9 flow steps from seed/DB | Step highlighting, sticky mockup crossfade | Static vertical list on reduced-motion | `docs/01` Lampiran B, `docs/02` §4.4 |
| 9 | Operational Evidence | Perforated Operation Pass Ticket (`.ops-ticket`) | Skeuomorphic perforated ticket with `.stub` mask separating route data and "1 DATA" badge | Static demo scenario metadata | Perforated card with radial mask | Collapses to vertical ticket on mobile (<720px) | `docs/04` §4.3 |
| 10 | Deep Dive | Spotlight Tabs (`SpotlightTabs.vue`) | WAI-ARIA tabs for BK, Raport Digital, and Security Gate with -1.5° tilted cards & circular stamps | Tab click, ArrowLeft/Right keys | Crossfade panel, tactile paper card, stamp badge | Horizontal scrollable segmented control on mobile | `docs/02` §4.5, `docs/04` §4.4 |
| 11 | Administration | Back Office Module Disclosure Grid (`ModuleGrid.vue`) | 12 module group cards with Material Symbols icons and disclosure `<details>` listing items | Module groups & items array | Interactive accordion grid without leaking URLs | Progressive enhancement: open by default if no JS | `docs/01` Lampiran E, `docs/02` §4.6 |
| 12 | Administration | Role Level Ladder (`RoleLadder.vue`) | Visual role hierarchy showing access levels 0 to 9 and permissions | Role levels array | Vertical ladder with role descriptions | Renders static list | `docs/01` Lampiran D, `docs/02` §4.6 |
| 13 | Scalability | Multi-Unit Architecture Diagram (`UnitDiagram.vue`) | Diagram displaying Yayasan → SD · SMP · TPQ · Pondok multi-tenant separation | Static structure data | Visual flow diagram + 4 segment cards | Fluid responsive flex/stack | `docs/01` §7, `docs/02` §4.7 |
| 14 | Security & Trust | Security & Privacy Pillars (`TrustPillars.vue`) | 4 verified pillars: counseling privacy, tiered access 0–9, expiring daily QR, audit log | Static pillar list | 4 structured security cards | No unverified encryption/cert claims | `docs/02` §4.8 |
| 15 | Market Positioning | Honest Comparison Table (`HonestTable.vue`) | 3-column table comparing SSD vs generic "Absen + SPP" + "What we don't claim" card | 9 comparison rows | 3-column table on desktop; stacked cards on mobile | Zero horizontal overflow on mobile | `docs/01` Lampiran F, `docs/02` §4.9 |
| 16 | Social Proof | Parent Brand Strip (`ParentBrandStrip.vue`) | Attributed track record of Digital Teknologi Perkasa & Pesantren Smart Digital | Verified partner count (if enabled) | Branded credential banner with link to PSD | Testimonials hidden by default until verified | `docs/01` §5 & Lampiran H |
| 17 | Objection Handling | Accessible FAQ Accordion (`FaqAccordion.vue`) | 8–9 accessible Q&As (`<button aria-expanded>`) with SSR JSON-LD `FAQPage` | FAQ array from seed/DB | Smooth disclosure accordion + Schema.org | Standard HTML disclosure fallback without JS | `docs/01` Lampiran G, `docs/02` §4.11 |
| 18 | Conversion | Echo Portal Closing CTA (`ClosingCta.vue`) | Echo of S-Curve portal with giant `MARI / MULAI` knockout text & closing motto | Static copy & CTAs | Visual bookend with "Jadwalkan Demo" & WhatsApp | Static layout without sticky overhead | `docs/04` §4.5, `docs/02` §4.12 |
| 19 | Conversion | 11-Field Demo Request Form (`DemoForm.vue`) | Comprehensive lead capture with Zod validation, honeypot, rate-limit, and progressive enhancement | Form fields: Name, Role, Org, OrgType, Students, Units, WA, Email, Interests, Msg, Consent | Submits to `/api/leads`; shows Idle, Submitting, Success, Error, Rate-limit | Inline field errors; summary alert; friendly 429 message | `docs/02` §4.12, `docs/03` §D4 |
| 20 | Conversion | Direct WhatsApp CTA with Prefilled Tracking | Dynamic `wa.me` link with normalized recipient number, prefilled text, and source placement | WA number, student name/org, placement source | Direct chat URL with encoded URI text | Graceful fallback to default company number | `docs/02` §9, `docs/03` §C7 |
| 21 | Navigation & Legal | 4-Column Editorial Footer (`SiteFooter.vue`) | Comprehensive footer with SSD white logo, DTP attribution, quick links, contact, social SVGs, legal links | `site_settings` data | Responsive 4-column layout | Renders fallback static links if DB down | `docs/02` §4.13 |
| 22 | Data Resilience | SWR Content Endpoint with Static Fallback | `GET /api/content` serves cached content from Neon or falls back to `@ssd/shared` | HTTP GET request | JSON payload matching `Content` interface | Returns HTTP 200 with fallback static data on DB error | `docs/03` §D5 |
| 23 | Security & Privacy | Spam Prevention & IP Hash Rate Limiting | Honeypot trap, SHA-256 hashed client IP, 3 requests per 10 mins rate limiter | POST payload, client headers | HTTP 201 on success, 202 on honeypot, 429 on rate limit | Returns generic friendly message without error dump | `docs/03` §D4 |
| 24 | Telemetry | First-Party Analytics Event Logger | `POST /api/track` logs `page_view`, `section_view`, `app_select`, `cta_click`, `lead_submit` | Navigator sendBeacon / fetch POST | HTTP 204 No Content | Silent failure; never interrupts user flow | `docs/01` §11, `docs/03` §D6 |
| 25 | Administration | Admin-Lite Management SPA | Protected routes `/admin/login`, `/admin/leads`, `/admin/leads/[id]`, CSV export | Email, password, lead updates | Session cookie, lead list, CSV download | HTTP 401 on bad credentials; uniform error msg | `docs/01` FR-19, `docs/03` §D7 |

---

## 3. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Hero Morph (`HeroPortal.vue`) | User has `prefers-reduced-motion: reduce` enabled | Morph animation is disabled; hero renders immediately at 100svh with `--e: 1; --b: 1`; portal is fully open and `.ledge` is visible with all semantic text and CTAs. |
| 2 | Hero Morph (`HeroPortal.vue`) | JavaScript disabled (SSR / curl / crawler) | CSS fallback styles apply: `.hero` height is auto/100svh, `.hero__portal` has `clip-path: none`, `.hero__echo` and `.type-out` are styled statically, semantic `<h1>` in `.ledge` is immediately available in HTML stream. |
| 3 | Ecosystem Selector | URL contains unknown hash `#app-invalid-slug` | Store falls back to default `back-office` (01); no component crash occurs. |
| 4 | Ecosystem Selector | Mobile screen width 320px | Preview portal stays pinned at top (`42vh`), list 01–12 scrolls below; font scales down smoothly without horizontal overflow. |
| 5 | Ecosystem Selector | Keyboard navigation on 12-app list | `ArrowDown` selects next app, `ArrowUp` selects previous app, `Home` jumps to 01, `End` jumps to 12; active tab updates preview and replaces URL hash without page jump. |
| 6 | Flow Timeline | Steps 4 and 5 (Daily QR Pickup) | Feature is in Phase 4 / roadmap; steps display "Segera hadir" badge with explicit alternative note ("tanpa QR: penyerahan terbuka"). |
| 7 | Spotlight Tabs | Screen width < 720px | Tab bar transforms into a touch-scrollable horizontal segmented control; tilted paper card overlaps smoothly (`-48px 12px 0`) without horizontal blowout. |
| 8 | Honest Table | Screen width < 640px | Table converts to a series of vertical stacked comparison cards; each card embeds row headers internally, preventing horizontal scrollbars. |
| 9 | Demo Request Form | Bot fills hidden `website` input field (honeypot) | Server intercepts request, does not insert record into `leads` table, and immediately returns `202 Accepted` to fool the bot. |
| 10 | Demo Request Form | User submits 4 times within 10 minutes from same IP | Rate limiter triggers on 4th attempt; server throws `429 Too Many Requests`; client displays friendly rate-limit message offering direct WhatsApp link. |
| 11 | Demo Request Form | WhatsApp phone input formats: `08123456789`, `+628123456789`, `628123456789` | `normalizeWa()` cleans non-digits, converts leading `0` to `62`, yielding standard E.164 string `628123456789`. |
| 12 | Content API (`/api/content`) | PostgreSQL / Neon connection down or cold start timeout | Handler catches exception, logs warning, and returns complete static fallback payload from `@ssd/shared/content` with HTTP 200 OK. |
| 13 | Material Symbols Icons | Network latency or slow font download | `.material-symbols-rounded` has `visibility: hidden` until `document.fonts.ready` adds `icons-ready` class to `<html>`, preventing unstyled ligature text flashes ("dashboard", "shield_lock"). |
| 14 | Responsive Viewport | Ultra-compact viewport (320px width) | All headings use responsive `clamp()` or `min(15.5vw, ...)`; containers have `padding: 16px`; table is stacked; zero horizontal scroll (`scrollWidth <= innerWidth`). |
| 15 | Responsive Viewport | Low-height landscape (height < 500px, width > 800px) | Hero unpins (`position: static`), height becomes unrestricted; `.portal-type` scales down via `min(15.5vw, 26vh)`; mobile navigation sheet becomes vertically scrollable. |

---

## 4. In-Depth Specification Breakdown

### 4.1 UI/UX Design System Tokens & Typography

#### Color Tokens
```css
/* Core Brand & Surfaces */
--color-navy-950: #0a2036;       /* Primary text on light wall; stage deep background */
--color-navy-900: #12355b;       /* Primary Brand Navy: inverse surfaces, primary buttons */
--color-navy-800: #1b4673;       /* Hover state for Navy buttons */
--color-navy-700: #265b93;       /* Borders and icons on light surfaces */
--color-navy-100: #dce7f2;       /* Soft borders, badges, chips */
--color-navy-50:  #eef3f8;       /* Secondary neutral surface */

--color-cyan-700: #00758f;       /* Accessible Accent Text on light wall (contrast >= 5.3:1) */
--color-cyan-500: #00b4d8;       /* Primary Brand Cyan: accent buttons, portal background, glow */
--color-cyan-400: #2cc6e4;       /* Hover state for Cyan elements */
--color-cyan-100: #d5f3fa;       /* Light cyan badge/chip backgrounds */
--color-cyan-50:  #edfafd;       /* Tinted section backgrounds */

--color-paper:    #f6f9fc;       /* Main wall surface (--ssd-wall) */
--color-white:    #ffffff;       /* Pure white card surface */
--color-paper-warm: #f1f6fb;     /* Tactile paper surface (spotlight & ticket card) */
--color-amber:    #b45309;       /* Warm accent for stamps & partial status */

/* Status Indicators */
--status-available-fg: #0f6b45; --status-available-bg: #e2f5ec;
--status-partial-fg:   #7a4e00; --status-partial-bg:   #fff1cf;
--status-dev-fg:       #1b4673; --status-dev-bg:       #e6eef7;
--status-danger-fg:    #9b1c1c; --status-danger-bg:    #fde8e8;
```

#### Typography Specs
- **Display**: Bricolage Grotesque (Variable: `wght` 400–800, `wdth` 92–108, `opsz` 72). Used for headline display and portal knockout typography.
- **Body**: Plus Jakarta Sans (Weights 400, 500, 600, 700). Used for all body copy, descriptions, and UI text.
- **Mono**: JetBrains Mono (Weight 500). Used for eyebrows, application numbers `01–12`, timestamps, and metadata.

#### Contrast Ratios (WCAG AA Compliance)
- Navy-900 on White: **12.4:1** (Passes AAA)
- Navy-950 on Paper (`#F6F9FC`): **13.1:1** (Passes AAA)
- Cyan-700 (`#00758F`) on Paper: **5.3:1** (Passes AA for body and small text)
- Cyan-500 (`#00B4D8`) on Navy-900: **5.0:1** (Passes AA)
- *Prohibition*: Cyan-500 (`#00B4D8`) on White/Paper is only **2.5:1**; strictly forbidden for text and light-surface focus rings.

---

### 4.2 Hero S-Curve Morph Aperture Mechanics (`HeroPortal.vue`)

#### Mathematical Formulation & Animation Phases
1. **Scroll Travel Range**:
   - Total height of `.hero-cliff`: `250svh`.
   - `.stage`: `position: sticky; top: 0; height: 100svh; overflow: hidden`.
   - Total scroll distance: $S = \text{root.offsetHeight} - H$.
   - Progress $p = \text{clamp}((\text{scrollY} - \text{root.offsetTop}) / S, 0, 1)$.

2. **Phase 1: Aperture Expansion ($p \in [0.0, 0.70]$)**:
   - $e = \text{easeInOutCubic}(\text{clamp}(p / 0.70, 0, 1))$.
   - Ease function: `easeInOutCubic(t) = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2`.
   - Dimensions:
     - Desktop: $w_0 = \text{clamp}(0.24W, 220, 420)$, $h_0 = \min(0.58H, 1.38w_0)$.
     - Mobile ($W < 720\text{px}$): $w_0 = 0.62W$, $h_0 = \min(0.48H, 1.35w_0)$.
   - Morph interpolation:
     - $w = w_0 + (W - w_0) \cdot e$
     - $\text{side} = (W - w) / 2$
     - $\text{top} = (0.52H - h_0 / 2) \cdot (1 - e)$
     - $\text{bottom} = (H - 0.52H - h_0 / 2) \cdot (1 - e)$
   - Corner radius morph:
     - $rTL = (0.44 w_0) \cdot (1 - e)$ (signature large curve)
     - $rOther = 18 \cdot (1 - e)$ (smooth secondary corners)
   - Final CSS rule:
     ```js
     mediaEl.style.clipPath = `inset(${top}px ${side}px ${bottom}px ${side}px round ${rTL}px ${rOther}px ${rOther}px ${rOther}px)`
     ```

3. **Phase 2: Ledge Rise ($p \in [0.70, 1.0]$)**:
   - $b = 1 - \text{Math.pow}(1 - \text{clamp}((p - 0.70) / 0.30, 0, 1), 3)$.
   - `.ledge` transform: `translateY(calc((1 - var(--b)) * 100%))`.
   - At $b \ge 0.5$, `.hero-cliff` adds `.is-open`, enabling `pointer-events: auto` on CTA buttons.

4. **Knockout Typography Split**:
   - `.type-out` (Navy `#12355B` on `#F6F9FC` wall) and `.type-in` (White `#FFFFFF` on Navy `#0A2036` inside `.media`) share identical rules:
     ```css
     .portal-type {
       font-family: var(--font-display);
       font-weight: 800;
       font-variation-settings: "opsz" 72, "wdth" 108;
       font-size: min(15.5vw, 30vh, 260px);
       line-height: 0.86;
       letter-spacing: -0.035em;
       white-space: nowrap;
     }
     ```
   - Both text blocks contain `aria-hidden="true"`.
   - Semantic `<h1>` is inside `.ledge`: `<h1 id="hero-h1">Sistem operasi<br>untuk sekolah Anda.</h1>`.

---

### 4.3 Detailed Breakdown of All 14 Landing Sections

1. **`SiteNavigation.vue`**:
   - Logo: Clean SVG logo mark + wordmark.
   - Links: Ekosistem (`#ekosistem`), Alur (`#alur`), Modul (`#modul`), Keamanan (`#keamanan`), FAQ (`#faq`).
   - Action: Pill button **Jadwalkan Demo** (`#demo`).
   - Adaptive transition: CSS `color-mix(in srgb, #ffffff var(--over), #0a2036)` transitions text from Navy to White while scrolling over the dark hero portal, then transforms into solid backdrop `#F6F9FC` with 12px blur once past the hero.

2. **`HeroPortal.vue`**:
   - S-Curve portal aperture with living HTML/CSS stage (`HeroProductStage.vue` containing dashboard mockup, mobile Womi, and gate scanner with "Data demo" label).
   - Rising `.ledge` displaying the `<h1>`, 3 facts (`<dl>`: Ekosistem: 12 Aplikasi, Arsitektur: Multi-Unit, Transparansi: Satu Data & Status Jujur), and two CTAs: Primary **Jadwalkan Demo** (`#demo`) and Secondary **Lihat 12 Aplikasi ↓** (`#ekosistem`).

3. **`ProblemList.vue`**:
   - Left column: The restaurant analogy statement ("Sekolah seperti restoran. Banyak yang hanya menjual kasir atau absen...").
   - Right column: 7 daily pain points with interactive chips linking to specific applications:
     1. Kehadiran siswa & kabar orang tua → Absensi Tap, Pegawai, Wali Murid
     2. Orang tua bertanya lokasi anak → Security Gate, Wali Murid, Command Center
     3. SPP menunggak & tagihan grup WA → Back Office, Wali Murid
     4. Kantin tunai & uang saku hilang → Mitra Usaha
     5. Satpam ragu izin keluar anak → Security Gate
     6. Guru piket mengecek izin hari ini → Command Center
     7. Pimpinan meminta laporan multi-unit → Back Office, Pimpinan

4. **`EcosystemSelector.vue`**:
   - Left column (`.eco-pin`, sticky): S-Curve portal device frame (`border-radius: 220px 20px 20px 20px`), showing high-fidelity device mockup of selected app, audience caption, platform, status badge, 3–5 feature chips, and contextual CTA **Minta demo aplikasi ini** (pre-fills form interest).
   - Right column (`.eco-list`): Numbered list 01 to 12.
     - 01 Back Office SSD (Tersedia)
     - 02 Pegawai SSD (Tersedia)
     - 03 Wali Murid SSD [Womi] (Tersedia)
     - 04 Wali Kelas SSD (Tersedia / Sebagian fitur segera hadir)
     - 05 BK SSD [Biku] (Tersedia / Push notifikasi segera hadir)
     - 06 Absensi Tap [Tapi] (Sebagian)
     - 07 Security Gate [Gati] (Sebagian / QR jemput tahap 4)
     - 08 Command Center [Comi] (Tersedia)
     - 09 Mitra Usaha [Miti] (Tersedia)
     - 10 PSB / PPDB (Dalam pengembangan)
     - 11 Layanan Terpadu (Dalam pengembangan)
     - 12 Pimpinan (Dalam pengembangan)
   - Keyboard: `ArrowUp`, `ArrowDown`, `Home`, `End`. URL Hash: `#app-<slug>`.

5. **`FlowTimeline.vue`**:
   - Header: Skeuomorphic perforated ticket card (`.ops-ticket` + `.stub`) labeled **"Pass Operasional Satu Data"** (Scenario: Ahmad — Data Demo; Coverage: 6 Apps; Stub: `1 DATA / Tanpa ketik ulang`).
   - 9-step timeline:
     - 01 Petugas mencatat izin pulang Ahmad (Back Office / Pegawai)
     - 02 Papan TV otomatis menampilkan nama Ahmad (Command Center)
     - 03 Satpam scan kartu Ahmad — izin aktif, boleh keluar (Security Gate)
     - 04 Orang tua menerima QR jemput hari ini (Wali Murid — Segera hadir)
     - 05 Satpam scan QR penjemput (Security Gate — Segera hadir)
     - 06 Orang tua menerima notifikasi (Wali Murid)
     - 07 Sore hari orang tua top-up uang saku (Wali Murid)
     - 08 Anak jajan di kantin, saldo terpotong (Mitra Usaha)
     - 09 Bendahara membuka Back Office, transaksi langsung terbaca (Back Office)
   - Sticky visual stage highlights corresponding device screen per active step.

6. **`SpotlightTabs.vue`**:
   - Three WAI-ARIA tabs with detailed mockups and `-1.5deg` tilted cards with circular stamps:
     - **BK**: "Lembar Disposisi & Privasi BK" + Stamp **`RAHASIA / TERJAGA`** (clarifying what parents see vs what remains confidential to counselors).
     - **Raport Digital**: "Aturan Predikat Otomatis" + Stamp **`SEMESTER / 0–100`** (A $\ge$ 85, B 70–84, C 60–69, D < 60 + teacher remarks and promotion decisions).
     - **Security Gate**: "Matriks Kontrol Penjemputan" + Stamp **`FASE 4 / QR HARIAN`** (Unit rules, parent toggles, third-party ojek pickup handling).

7. **`ModuleGrid.vue` & `RoleLadder.vue`**:
   - `ModuleGrid`: 12 Back Office module cards with Material Symbols icons and disclosure `<details>`: Bimbingan Konseling, Akademik, Kesiswaan, Wali Kelas, Sarana Prasarana, Keuangan, Pembayaran, Kepegawaian, PSB, Presensi, Komunikasi, Laporan.
   - `RoleLadder`: 8 role levels: Level 0 (Admin Yayasan), Level 1 (Admin Unit), Level 2–3 (Bendahara), Level 4 (Pengawas Mitra), Level 5 (Operator Presensi), Level 6 (Petugas UKS), Level 7 (Petugas BK), Level 9 (Admin PSB).

8. **`UnitDiagram.vue`**:
   - Multi-tenant foundation diagram: Yayasan node branching into SD, SMP, TPQ, and Pondok.
   - 4 market segment cards: Sekolah Umum, Yayasan Multi-Unit, TPQ, and Pondok Pesantren (linking to PSD).

9. **`TrustPillars.vue`**:
   - 4 verified pillars:
     1. Privasi Konseling (diagnoses and sessions hidden from TV and unauthorized eyes).
     2. Akses Berjenjang (role levels 0–9 strictly scoped per unit).
     3. QR Jemput Harian (one student, one day, midnight expiry).
     4. Jejak Audit (audit logs in Back Office with gate timestamps).

10. **`HonestTable.vue`**:
    - 9-row honest comparison between generic "Absen + SPP" software and SSD.
    - Prominent callout card **"Yang tidak kami klaim"**: Open admission that SSD is focused on school operations and finance, NOT e-learning, CBT question banks, or national video libraries.

11. **`ParentBrandStrip.vue`**:
    - "Dari tim di balik Pesantren Smart Digital" with official PSD logo and link to `pesantrensmartdigital.com`.
    - Strict guardrail: Testimonial section is hidden by default until verified client records with `is_verified` and `consent_at` are provided.

12. **`FaqAccordion.vue`**:
    - 8–9 accessible Q&As answering critical buyer questions (multi-unit support, e-learning scope, iPhone availability, pricing at demo, implementation assistance).
    - Emits SSR JSON-LD `FAQPage`.

13. **`ClosingCta.vue` & `DemoForm.vue`**:
    - Echo aperture visual displaying giant `MARI / MULAI` knockout text with quote: *"Bukan sekadar fitur. Ketenangan. — Orang tua tenang, satpam yakin, bendahara rapi, guru tidak mengetik dua kali, pimpinan melihat angka tanpa menunggu Excel."*
    - Direct WhatsApp CTA: Prefilled URL with UTM source tracking.
    - 11-field form:
      1. Nama Lengkap (required, min 2)
      2. Jabatan
      3. Nama Sekolah / Yayasan (required, min 2)
      4. Jenis Lembaga (required: Sekolah, Yayasan, TPQ, Pondok, Lainnya)
      5. Perkiraan Jumlah Siswa (<100, 100-300, 301-700, 701-1500, >1500)
      6. Jumlah Unit (1-50)
      7. WhatsApp (required, validated regex)
      8. Email (optional, validated email)
      9. Kebutuhan Utama (multi-select app chips)
      10. Pesan Tambahan
      11. Persetujuan Privasi (required checkbox)
      12. Honeypot field `website` (hidden).

14. **`SiteFooter.vue`**:
    - White SVG logo mark + "School Smart Digital".
    - Attribution: "School Smart Digital adalah produk dari Digital Teknologi Perkasa".
    - Official contact: WhatsApp `+62 858-3984-5284`, Email `digitalteknologiperkasa.lampung@gmail.com`, Address in Bandar Lampung.
    - Verified social icons via theSVG (Instagram, Facebook, YouTube).
    - Legal navigation: `/privacy-policy`, `/terms`, `/faq`.

---

### 4.4 Interactive Behaviors, Keyboard Accessibility & Responsive Matrix

#### Keyboard Navigation Matrix
- **Ecosystem Selector (12 Apps)**:
  - Container role: `role="tablist"` (aria-orientation="vertical").
  - Item role: `role="tab"`, `aria-selected="true|false"`, `aria-controls="panel-<slug>"`.
  - Keys:
    - `ArrowDown`: Moves focus and selection to `(index + 1) % 12`.
    - `ArrowUp`: Moves focus and selection to `(index - 1 + 12) % 12`.
    - `Home`: Moves focus and selection to App 01 (`back-office`).
    - `End`: Moves focus and selection to App 12 (`pimpinan`).
    - `Enter` / `Space`: Activates selection.
    - History: Replaces URL hash `#app-<slug>` without scroll jitter.
- **Spotlight Tabs**:
  - `role="tablist"` with `ArrowLeft` / `ArrowRight` navigation and `role="tabpanel"`.
- **FAQ Accordion**:
  - `<button aria-expanded="true|false" :aria-controls="contentId">` controlling disclosure content with smooth CSS grid row animation (`grid-template-rows: 0fr` to `1fr`).
- **Mobile Menu Drawer**:
  - Focus trap inside drawer; `Esc` key dismisses drawer; focus restores to hamburger trigger upon closure.

#### Responsive Breakpoint Matrix
- **320px (Minimum Viewport)**:
  - Padding: `16px`. Single column.
  - Headline uses `clamp()` to scale down to `2.5rem` without character clipping.
  - Honest table converts to single-column stacked cards.
  - Buttons expand to full width (`w-full`).
  - Zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`).
- **375px – 390px (Standard Mobile)**:
  - Touch targets strictly $\ge 44 \times 44\text{px}$.
  - Ecosystem preview sticky pin at top (`42vh`), app list scrolls underneath.
  - Safe-area insets applied: `env(safe-area-inset-bottom)` on CTA bars and drawer.
- **720px – 768px (Tablet Portrait)**:
  - Problem list and modules transition to 2 columns.
  - Ops ticket stub changes from horizontal layout to vertical bottom notch with horizontal perforation.
  - Ledge switches to 2-column layout.
- **1024px – 1100px (Desktop / Laptop)**:
  - Full 2-column layout for Hero, Ecosystem Selector, and Flow Timeline with sticky media panels.
  - Ledge expands to 3-column layout (`pitch`, `facts`, `cta-box`).
- **1440px (Wide Desktop)**:
  - Container maximum width clamped to `1280px` (`--container-max`).
  - Ample editorial margins and whitespace.
- **Landscape Viewport with Low Height (< 500px)**:
  - Hero unpins (`position: static`) to prevent screen occlusion.
  - `.portal-type` size constrained by `26vh`.
  - Non-critical lead text and captions in ledge hidden to guarantee visibility of `<h1>` and CTA buttons.

---

### 4.5 Content, Microcopy & Visual Assets (SVGs & Icons)

#### Brand Logos Required in `apps/web/public/brand/`
1. `logo.svg`: Full horizontal brand logo with navy `#12355B` and cyan `#00B4D8` shapes and "School Smart Digital" wordmark.
2. `logo-mark.svg`: Standalone S-Curve square icon mark (Navy and Cyan dual blocks separated by negative S-curve).
3. `logo-white.svg`: All-white version of the logo for dark footer and hero scrim.
4. `favicon.svg`: Vector icon favicon with clean viewBox.

#### Material Symbols Rounded Subset
Extracted directly from code references:
- `dashboard` (Back Office)
- `badge` (Pegawai)
- `family_restroom` (Wali Murid)
- `school` (Wali Kelas)
- `volunteer_activism` (BK)
- `nfc` (Absensi Tap)
- `shield_lock` (Security Gate)
- `tv` (Command Center)
- `storefront` (Mitra Usaha)
- `how_to_reg` (PSB)
- `touch_app` (Layanan Terpadu)
- `monitoring` (Pimpinan)
- `qr_code_scanner`
- `account_balance_wallet`
- `check_circle`
- `schedule`
- `arrow_downward`
- `lock`

Loaded with `display=block` and guarded with `.icons-ready` class to eliminate FOUT/FOIT ligature flashes.

---

## 5. Logic Chain

1. **Premise**: Calon klien (Yayasan, Kepala Sekolah, TU) sering menganggap SSD hanyalah aplikasi pencatat absen atau SPP biasa, padahal SSD adalah platform sistem operasi sekolah terpadu dengan 12 aplikasi.
2. **Strategy**: Landing page harus membuktikan keterhubungan data sejak detik pertama melalui metafora visual yang kuat (**S-Curve Portal**) dan bukti alur harian nyata (**Alur 9 Langkah Ahmad**), bukan sekadar daftar fitur kering.
3. **Architectural Choice**: Nuxt 4 monorepo dengan Tailwind CSS v4 CSS-first token system, Nitro API, Neon PostgreSQL via Drizzle ORM, serta static fallback data di `@ssd/shared` memastikan landing page dapat beroperasi dengan kecepatan tinggi (LCP $\le$ 2.5s) dan tetap tampil 100% utuh bahkan jika database tidak tersedia atau JavaScript dimatikan.
4. **Execution Safety**: Guardrail compliance scanner (`scripts/guardrail-check.mjs`) harus lulus dengan 0 pelanggaran untuk mencegah bocornya akun uji internal, kompetitor trademark, atau data tidak terverifikasi.

---

## 6. Caveats

- **Media Mockups**: File screenshot awal di folder dokumen internal masih bertema warna hijau warisan sistem lama dan memuat nama pengguna nyata. Mockup visual yang dipasang di komponen harus dirender dengan tema Navy-Cyan dan memakai label *"Data demo"* sesuai Guardrail PRD Bagian 5.
- **Unconfirmed Product Statuses (PRD Q1)**: Fitur QR jemput harian (Wali Murid & Security Gate) dan aplikasi 10–12 berstatus *"Dalam pengembangan"* atau *"Segera hadir"*. Hal ini wajib diberi lencana status yang transparan dan tidak boleh diklaim sebagai fitur yang sudah aktif secara instan.
- **Pricing**: Tidak ada nominal harga pada landing page MVP; seluruh CTA diarahkan untuk menjadwalkan demo atau berkonsultasi langsung via WhatsApp.

---

## 7. Conclusion

Spesifikasi lengkap dari seluruh 4 dokumen rujukan (`00`, `01`, `02`, `04`) serta guardrails `scripts/guardrail-check.mjs` telah berhasil digali, dipetakan, dan didokumentasikan secara menyeluruh. Seluruh token desain, rumus matematika Hero S-Curve Morph, 14 section halaman landing, penanganan aksesibilitas keyboard, perilaku responsif multi-breakpoint, hingga detail endpoint Nitro dan skema Drizzle siap digunakan oleh tim implementasi (System Architect, Frontend Engineer, Backend Engineer, QA Engineer).

---

## 8. Verification Method

To independently verify these findings:
1. **Guardrail Scan**:
   ```powershell
   node scripts/guardrail-check.mjs
   ```
   (Must output `✔ Guardrail scan PASSED: Codebase is clean`).
2. **Design Tokens Inspection**:
   - Inspect `docs/03-DESIGN-SYSTEM-DB-FE-BE-SSD.md` §A6 and `docs/04-HERO-MORPH-DESIGN-ADAPTATION.md` §2.1 for matching CSS variables (`--color-navy-900: #12355b`, `--color-cyan-500: #00b4d8`, `--ssd-wall: #f6f9fc`).
3. **Hero Math Verification**:
   - Inspect `docs/04-HERO-MORPH-DESIGN-ADAPTATION.md` §3.2 for $p$, $e$, $b$, $w_0$, $h_0$, and `clip-path` inset formula.
4. **Content & Catalog Verification**:
   - Inspect `docs/01-PRD-SSD-Landing-Page.md` Lampiran A through G to confirm all 12 apps, 9 flow steps, 7 pain points, 8 role levels, 12 module groups, and comparison rows.

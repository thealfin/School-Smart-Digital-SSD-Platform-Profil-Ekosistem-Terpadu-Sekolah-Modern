# E2E Test Infra: School Smart Digital (SSD) Landing Page

## Test Philosophy
- Opaque-box, requirement-driven testing directly mapped to user requirements in `ORIGINAL_REQUEST.md` and `PROJECT.md § Feature Inventory`.
- Independent of internal framework implementation details.
- Comprehensive 4-Tier design: Category-Partition, Boundary Value Analysis, Pairwise Combinatorial, and Real-World Scenarios.
- Progressive testability: verification does not depend on features more complex than the target under test.

## Feature Inventory Mapping
| # | Feature | Source (Requirement) | Tier 1 (Min 5) | Tier 2 (Min 5) | Tier 3 (Pairwise) | Tier 4 (Scenario) |
|---|---------|---------------------|:--------------:|:--------------:|:-----------------:|:-----------------:|
| 1 | Monorepo Structure & Build | R1, package.json | 5 | 5 | ✓ | ✓ |
| 2 | Design Tokens & CSS Variables | R1, docs/03, docs/04 | 5 | 5 | ✓ | ✓ |
| 3 | Brand SVG Assets & Logos | R1, docs/02 | 5 | 5 | ✓ | ✓ |
| 4 | Hero S-Curve Morph & Knockout | R1, docs/04 | 5 | 5 | ✓ | ✓ |
| 5 | Shared Schemas & Phone Normalizer | R1, packages/shared | 5 | 5 | ✓ | ✓ |
| 6 | SiteNavigation & Scrollspy | R2, docs/02 §4.0 | 5 | 5 | ✓ | ✓ |
| 7 | ProblemList 7 Pain Points | R2, docs/02 §4.2 | 5 | 5 | ✓ | ✓ |
| 8 | EcosystemSelector 12 Apps | R2, docs/02 §4.3 | 5 | 5 | ✓ | ✓ |
| 9 | FlowTimeline 9 Steps & Ticket | R2, docs/02 §4.4 | 5 | 5 | ✓ | ✓ |
| 10 | SpotlightTabs WAI-ARIA & Stamps | R2, docs/02 §4.5 | 5 | 5 | ✓ | ✓ |
| 11 | ModuleGrid & RoleLadder | R2, docs/02 §4.6 | 5 | 5 | ✓ | ✓ |
| 12 | UnitDiagram & Multi-Unit | R2, docs/02 §4.7 | 5 | 5 | ✓ | ✓ |
| 13 | TrustPillars 4 Pillars | R2, docs/02 §4.8 | 5 | 5 | ✓ | ✓ |
| 14 | HonestTable & Mobile Stack | R2, docs/02 §4.9 | 5 | 5 | ✓ | ✓ |
| 15 | ParentBrandStrip & Credentials | R2, docs/01 §5 | 5 | 5 | ✓ | ✓ |
| 16 | FaqAccordion & JSON-LD | R2, docs/02 §4.11 | 5 | 5 | ✓ | ✓ |
| 17 | ClosingCta Echo Portal | R2, docs/02 §4.12 | 5 | 5 | ✓ | ✓ |
| 18 | DemoForm 11 Fields & WhatsApp | R2, docs/02 §4.12 | 5 | 5 | ✓ | ✓ |
| 19 | SiteFooter 4 Columns & Legal | R2, docs/02 §4.13 | 5 | 5 | ✓ | ✓ |
| 20 | Drizzle Schema (15 Tables, 5 Enums) | R3, docs/03 | 5 | 5 | ✓ | ✓ |
| 21 | Seed Script & Admin CLI | R3, docs/03 | 5 | 5 | ✓ | ✓ |
| 22 | GET /api/content & Fallback | R3, docs/03 | 5 | 5 | ✓ | ✓ |
| 23 | POST /api/leads & Rate Limit | R3, docs/03 | 5 | 5 | ✓ | ✓ |
| 24 | POST /api/track Telemetry | R3, docs/03 | 5 | 5 | ✓ | ✓ |
| 25 | Admin Auth & Sessions | R3, docs/03 | 5 | 5 | ✓ | ✓ |
| 26 | Admin Leads API & CSV Escaping | R3, docs/03 | 5 | 5 | ✓ | ✓ |
| 27 | Admin-Lite SPA Pages | R3, docs/03 | 5 | 5 | ✓ | ✓ |
| 28 | Guardrails & Zero Leaks | R4, scripts/guardrail-check | 5 | 5 | ✓ | ✓ |
| 29 | WCAG AA Contrast & Focus | R4, docs/03 | 5 | 5 | ✓ | ✓ |
| 30 | Viewport Responsiveness | R4, docs/02 | 5 | 5 | ✓ | ✓ |
| 31 | Resilient SSR & Zero-JS | R4, docs/01 | 5 | 5 | ✓ | ✓ |
| 32 | Reduced Motion Accessibility | R4, docs/04 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Location**: `tests/` at project root
- **Test Runner**: Node-based automated test runner (`node tests/runner.mjs`) executing all tiers with exit code 0 on full pass.
- **Reporting**: Structured test summary table by tier and feature with execution timing.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Full School Foundation Leader Demo Journey | SiteNavigation, HeroPortal, ProblemList, EcosystemSelector, FlowTimeline, SpotlightTabs, DemoForm | High |
| 2 | High-Speed Mobile Operator Assessment | 320px/375px viewport, Mobile drawer, EcosystemSelector touch/keyboard, HonestTable stacked cards, Direct WA | High |
| 3 | Offline/Cold Database Lead Capture & Browsing | GET /api/content fallback, DemoForm submission with simulated network resilience, SSR HTML stream | High |
| 4 | Admin Lead Processing & CSV Export with Injection Resistance | Admin login, Lead review, Status patch, CSV download with formula sanitization | Medium |
| 5 | Accessibility & Reduced-Motion Audit | prefers-reduced-motion: reduce, keyboard Tab/Arrow navigation across all ARIA widgets, WCAG contrast verification | High |


# Scope: Remediate Template Side-Effect Tags & Vite Runtime Error

## Problem Statement
During `nuxt dev`, Vue 3 / Vite throws compiler error:
`Tags with side effect (<script> and <style>) are ignored in client component templates.`
resulting in 404 for `HeroPortal.vue` and dynamic import failure for `pages/index.vue`.
In Vue 3 / Vite SFC compilation, `<style>` and `<script>` tags cannot be placed inside `<template>` (such as `<noscript><style>...</style></noscript>`).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Template Side-Effect Audit | Audit all `.vue` components across `apps/web` and packages for any `<style>` or `<script>` inside `<template>` (e.g. `<noscript><style>`), cataloging all occurrences and providing standard progressive enhancement alternatives. | none | DONE |
| M2 | Worker Implementation & Verification | Worker updates the components to use standard Nuxt/Vue progressive enhancement (e.g. scoped CSS `@media (scripting: none)` or `useHead`) without side-effect tags inside `<template>`. Worker runs build, typecheck, guardrail, and test runner. | M1 | DONE |
| M3 | Multi-Agent Verification & Gate | 2 Reviewers, 2 Challengers, and 1 Forensic Auditor verify code hygiene, zero side-effect tags, full test passing (229/229), and authentic implementation. | M2 | DONE |

## Acceptance Criteria
- Zero `<style>` or `<script>` tags inside `<template>` in any `.vue` file.
- Clean progressive enhancement maintained without side-effect template tags.
- `pnpm guardrail` passes with 0 violations.
- `pnpm typecheck` passes with 0 errors.
- `pnpm --filter web build` builds cleanly.
- `node tests/runner.mjs` passes all 229 tests (229/229).
- Gate passes with APPROVE from reviewers, challengers, and CLEAN from forensic auditor.

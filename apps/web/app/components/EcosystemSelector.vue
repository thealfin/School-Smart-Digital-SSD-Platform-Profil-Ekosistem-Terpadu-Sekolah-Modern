<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useEcosystemStore } from '~/stores/ecosystem'
import type { AppItem } from '@ssd/shared/types'

const props = defineProps<{
  apps?: AppItem[]
}>()

const ecosystemStore = useEcosystemStore()
const listContainerEl = ref<HTMLElement | null>(null)
const pinColEl = ref<HTMLElement | null>(null)

if (props.apps && props.apps.length > 0) {
  ecosystemStore.setApps(props.apps)
}

watch(() => props.apps, (newApps) => {
  if (newApps && newApps.length > 0) {
    ecosystemStore.setApps(newApps)
  }
})

// Status configuration helper
function getStatusBadge(status: string) {
  switch (status) {
    case 'available':
      return { label: 'Tersedia', icon: 'check_circle', class: 'status-available' }
    case 'partial':
      return { label: 'Sebagian', icon: 'pending', class: 'status-partial' }
    case 'development':
      return { label: 'Dalam pengembangan', icon: 'construction', class: 'status-dev' }
    default:
      return { label: status, icon: 'info', class: 'status-dev' }
  }
}

// Select app and focus corresponding tab element
function handleAppSelect(slug: string, index: number) {
  ecosystemStore.setActiveSlug(slug)
  const tabEl = listContainerEl.value?.querySelector(`[data-index="${index}"]`) as HTMLElement | null
  tabEl?.focus()
  if (import.meta.client && window.innerWidth < 1024 && pinColEl.value) {
    const rect = pinColEl.value.getBoundingClientRect()
    if (rect.top < 60) {
      const targetY = window.scrollY + rect.top - 84
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' })
    }
  }
}

// Synchronize keyboard focus during roving tabindex navigation
function handleKeydown(event: KeyboardEvent) {
  ecosystemStore.handleKeydown(event)
  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    nextTick(() => {
      const activeEl = listContainerEl.value?.querySelector(`[data-index="${ecosystemStore.activeIndex}"]`) as HTMLElement | null
      activeEl?.focus()
    })
  }
}

onMounted(() => {
  const cleanup = ecosystemStore.setupHashListener()
  onUnmounted(() => cleanup())
})
</script>

<template>
  <section
    id="ekosistem"
    class="ecosystem-section"
    aria-labelledby="ecosystem-heading"
  >
    <div class="ecosystem-container">
      <!-- Section Header -->
      <div class="section-intro reveal">
        <p class="eyebrow">KATALOG LENGKAP · 12 APLIKASI SATU PLATFORM</p>
        <h2 id="ecosystem-heading" class="section-title">
          Satu sistem operasi untuk setiap peran.
        </h2>
        <p class="section-desc">
          Dari staf kantor, guru piket, wali murid, hingga satpam gerbang — masing-masing memiliki alat kerja spesifik yang saling bertukar data secara instan tanpa input ganda.
        </p>
      </div>

      <!-- 2-Column Catalog Layout -->
      <div class="ecosystem-grid">
        <!-- Left Column: Sticky S-Curve Portal Frame Preview -->
        <div ref="pinColEl" class="eco-pin-col reveal-left">
          <div
            :id="`panel-app-${ecosystemStore.activeApp.slug}`"
            class="eco-portal-frame"
            role="tabpanel"
            :aria-labelledby="`tab-app-${ecosystemStore.activeApp.slug}`"
          >
            <!-- S-Curve Outer Portal -->
            <div class="portal-viewport">
              <!-- Mockup Header -->
              <div class="viewport-header">
                <div class="viewport-dots">
                  <span class="v-dot" />
                  <span class="v-dot" />
                  <span class="v-dot" />
                </div>
                <div class="viewport-meta">
                  <span
                    class="status-pill"
                    :class="getStatusBadge(ecosystemStore.activeApp.status).class"
                  >
                    <span class="material-symbols-rounded pill-icon">
                      {{ getStatusBadge(ecosystemStore.activeApp.status).icon }}
                    </span>
                    {{ getStatusBadge(ecosystemStore.activeApp.status).label }}
                  </span>
                  <span v-if="ecosystemStore.activeApp.mascotName" class="mascot-pill">
                    Maskot: {{ ecosystemStore.activeApp.mascotName }}
                  </span>
                </div>
              </div>

              <!-- Mockup Visual Display Screen -->
              <div class="viewport-screen">
                <div class="screen-preview-content">
                  <div class="screen-hero-badge">
                    <span class="screen-app-num">
                      APP {{ String(ecosystemStore.activeApp.number).padStart(2, '0') }}
                    </span>
                    <span class="screen-platform">
                      {{ ecosystemStore.activeApp.platformLabel }}
                    </span>
                  </div>

                  <h3 class="screen-app-name">
                    {{ ecosystemStore.activeApp.name }}
                  </h3>
                  <p class="screen-tagline">
                    {{ ecosystemStore.activeApp.tagline }}
                  </p>
                  <p class="screen-audience">
                    <strong>Sasaran Pengguna:</strong> {{ ecosystemStore.activeApp.audience }}
                  </p>

                  <div v-if="ecosystemStore.activeApp.statusNote" class="status-note-alert">
                    <span class="material-symbols-rounded alert-icon">info</span>
                    <span>{{ ecosystemStore.activeApp.statusNote }}</span>
                  </div>
                </div>
              </div>

              <!-- Feature List Chips -->
              <div class="viewport-features">
                <h4 class="features-heading">Fitur Utama:</h4>
                <ul class="features-list">
                  <li
                    v-for="(feat, idx) in ecosystemStore.activeApp.features.slice(0, 5)"
                    :key="idx"
                    class="feature-bullet"
                  >
                    <span class="material-symbols-rounded feat-check">
                      {{ feat.status === 'roadmap' ? 'schedule' : 'check_circle' }}
                    </span>
                    <span class="feat-text">
                      {{ feat.title }}
                      <span v-if="feat.status === 'roadmap'" class="roadmap-badge">Segera hadir</span>
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Contextual Action Footer -->
              <div class="viewport-actions">
                <a
                  :href="`#demo`"
                  class="btn-demo-contextual"
                  :aria-label="`Minta demo khusus untuk ${ecosystemStore.activeApp.name}`"
                >
                  Minta Demo Aplikasi Ini &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Numbered App Tablist (01 - 12) -->
        <div
          ref="listContainerEl"
          class="eco-list-col reveal-right"
          role="tablist"
          aria-orientation="vertical"
          aria-label="Daftar 12 Aplikasi School Smart Digital"
          @keydown="handleKeydown"
        >
          <button
            v-for="(app, index) in ecosystemStore.apps"
            :id="`tab-app-${app.slug}`"
            :key="app.slug"
            type="button"
            role="tab"
            :data-index="index"
            class="eco-list-row"
            :class="{ 'is-active': ecosystemStore.activeSlug === app.slug }"
            :aria-selected="ecosystemStore.activeSlug === app.slug"
            :aria-controls="`panel-app-${app.slug}`"
            :tabindex="ecosystemStore.activeSlug === app.slug ? 0 : -1"
            @click="handleAppSelect(app.slug, index)"
          >
            <!-- 2-Digit Number -->
            <span class="row-num">{{ String(app.number).padStart(2, '0') }}</span>

            <!-- App Meta -->
            <div class="row-info">
              <div class="row-name-group">
                <span class="row-name">{{ app.name }}</span>
                <span v-if="app.mascotName" class="row-mascot">({{ app.mascotName }})</span>
              </div>
              <span class="row-tagline">{{ app.tagline }}</span>
            </div>

            <!-- Status Indicator Badge -->
            <div class="row-badge-wrap">
              <span class="mini-status-badge" :class="getStatusBadge(app.status).class">
                {{ getStatusBadge(app.status).label }}
              </span>
              <span class="material-symbols-rounded row-arrow" aria-hidden="true">
                arrow_forward
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Zero-JS Accessible Full Catalog Fallback -->
      <noscript>
        <div class="mt-12 p-6 bg-white border border-[#d7e2ec] rounded-2xl space-y-6">
          <h3 class="font-display font-bold text-xl text-[#0a2036]">
            Daftar Lengkap 12 Aplikasi School Smart Digital
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="app in (apps || ecosystemStore.apps)"
              :key="app.slug"
              class="p-4 bg-[#f1f6fb] rounded-xl border border-[#d7e2ec]"
            >
              <span class="font-mono text-xs font-bold text-[#00758f]">APP {{ String(app.number).padStart(2, '0') }}</span>
              <h4 class="font-display font-bold text-base text-[#0a2036] mt-1">{{ app.name }}</h4>
              <p class="text-xs text-[#46607a] mt-1">{{ app.tagline }}</p>
              <p class="text-xs text-[#0a2036] mt-2 font-medium">Sasaran: {{ app.audience }}</p>
              <ul class="mt-3 space-y-1 text-xs text-[#46607a]">
                <li v-for="(feat, fIdx) in app.features.slice(0, 3)" :key="fIdx" class="flex items-center gap-1.5">
                  <span>•</span>
                  <span>{{ feat.title }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </noscript>
    </div>
  </section>
</template>

<style scoped>
.ecosystem-section {
  padding: clamp(4rem, 8vw, 8rem) 0;
  background: var(--ssd-wall, #f6f9fc);
}

.ecosystem-container {
  max-width: var(--container-max, 1280px);
  margin: 0 auto;
  padding: 0 var(--container-padding, 1.5rem);
}

.section-intro {
  max-width: 760px;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.eyebrow {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-cyan-700, #00758f);
  margin-bottom: 0.75rem;
}

.section-title {
  font-family: var(--font-display, sans-serif);
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: var(--color-navy-950, #0a2036);
  margin-bottom: 1rem;
}

.section-desc {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--ssd-text-secondary, #46607a);
}

/* 2-Column Grid */
.ecosystem-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 1024px) {
  .ecosystem-grid {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: 3.5rem;
  }
}

/* Sticky Preview Portal Frame */
.eco-pin-col {
  position: relative;
}
@media (max-width: 1023px) {
  .eco-pin-col {
    position: relative;
    top: auto;
    z-index: 1;
    height: auto;
    min-height: 42vh;
    background: var(--ssd-wall, #f6f9fc);
    padding-bottom: 0.75rem;
    margin-bottom: 1.5rem;
    overflow: visible;
  }
}
@media (min-width: 1024px) {
  .eco-pin-col {
    position: sticky;
    top: 96px;
    align-self: start;
  }
}

.eco-portal-frame {
  background: #ffffff;
  border: 1px solid var(--ssd-border, #d7e2ec);
  border-radius: 72px 20px 20px 20px;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(10, 32, 54, 0.08);
}
@media (min-width: 640px) {
  .eco-portal-frame {
    border-radius: 120px 24px 24px 24px;
  }
}
@media (min-width: 1024px) {
  .eco-portal-frame {
    /* Signature S-Curve Radius */
    border-radius: 220px 24px 24px 24px;
  }
}

.portal-viewport {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
@media (min-width: 640px) {
  .portal-viewport {
    padding: 1.75rem;
  }
}

.viewport-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.viewport-dots {
  display: flex;
  gap: 6px;
}
.v-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--ssd-border, #d7e2ec);
}

.viewport-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.pill-icon {
  font-size: 14px;
}
.status-available {
  background: #e2f5ec;
  color: #0f6b45;
}
.status-partial {
  background: #fff1cf;
  color: #7a4e00;
}
.status-dev {
  background: #e6eef7;
  color: #1b4673;
}
.mascot-pill {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: var(--color-cyan-50, #edfafd);
  color: var(--color-cyan-700, #00758f);
  border-radius: 4px;
}

/* Simulated Screen Content */
.viewport-screen {
  background: var(--color-paper-warm, #f1f6fb);
  border: 1px solid var(--ssd-border, #d7e2ec);
  border-radius: 16px;
  padding: 1.5rem;
}
.screen-hero-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.screen-app-num {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-cyan-700, #00758f);
}
.screen-platform {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--ssd-text-secondary, #46607a);
}
.screen-app-name {
  font-family: var(--font-display, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-navy-950, #0a2036);
  margin: 0 0 0.25rem 0;
}
.screen-tagline {
  font-size: 0.9375rem;
  color: var(--color-navy-900, #12355b);
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}
.screen-audience {
  font-size: 0.8125rem;
  color: var(--ssd-text-secondary, #46607a);
  margin: 0;
}
.status-note-alert {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #fff8eb;
  border: 1px solid #fed7aa;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #9a3412;
}
.alert-icon {
  font-size: 16px;
}

/* Features List */
.viewport-features {
  padding-top: 0.5rem;
}
.features-heading {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-navy-950, #0a2036);
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.features-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.feature-bullet {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--ssd-text-secondary, #46607a);
  line-height: 1.4;
}
.feat-check {
  font-size: 16px;
  color: var(--color-cyan-500, #00b4d8);
  flex-shrink: 0;
  margin-top: 2px;
}
.roadmap-badge {
  display: inline-block;
  font-size: 0.6875rem;
  padding: 0.1rem 0.4rem;
  background: #fff1cf;
  color: #7a4e00;
  border-radius: 4px;
  margin-left: 0.375rem;
}

/* Contextual Demo CTA */
.btn-demo-contextual {
  display: block;
  text-align: center;
  padding: 0.75rem 1.25rem;
  background: var(--color-navy-900, #12355b);
  color: #ffffff;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background-color 200ms ease;
}
.btn-demo-contextual:hover {
  background: var(--color-navy-800, #1b4673);
}

/* Numbered Right Tablist */
.eco-list-col {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--ssd-border, #d7e2ec);
}

.eco-list-row {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 48px; /* Accessible 44px+ touch target */
  padding: 1.125rem 0.75rem;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--ssd-border, #d7e2ec);
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease, padding-left 200ms ease;
}
.eco-list-row:hover {
  background-color: rgba(255, 255, 255, 0.7);
  padding-left: 1.25rem;
}
.eco-list-row.is-active {
  background-color: #ffffff;
  padding-left: 1.25rem;
  border-left: 4px solid var(--color-cyan-500, #00b4d8);
}

.row-num {
  font-family: var(--font-mono, monospace);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-cyan-700, #00758f);
  width: 3rem;
  flex-shrink: 0;
}
.eco-list-row.is-active .row-num {
  color: var(--color-cyan-500, #00b4d8);
}

.row-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.row-name-group {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}
.row-name {
  font-family: var(--font-display, sans-serif);
  font-weight: 700;
  font-size: 1.0625rem;
  color: var(--color-navy-950, #0a2036);
}
.row-mascot {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--color-cyan-700, #00758f);
}
.row-tagline {
  font-size: 0.8125rem;
  color: var(--ssd-text-secondary, #46607a);
  margin-top: 0.125rem;
}

.row-badge-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.mini-status-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  display: none;
}
@media (min-width: 640px) {
  .mini-status-badge {
    display: inline-block;
  }
}
.row-arrow {
  color: var(--color-cyan-500, #00b4d8);
  font-size: 20px;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 200ms ease;
}
.eco-list-row.is-active .row-arrow,
.eco-list-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { FlowStep } from '@ssd/shared/types'
import { flowSteps as defaultSteps } from '@ssd/shared/content'

const props = withDefaults(defineProps<{
  steps?: FlowStep[]
}>(), {
  steps: () => defaultSteps,
})

const activeStepNo = ref<number>(1)
const timelineSteps = computed(() => props.steps || defaultSteps)
let observer: IntersectionObserver | null = null

function setActiveStep(num: number) {
  activeStepNo.value = num
}

onMounted(() => {
  if (import.meta.client) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const no = Number(entry.target.getAttribute('data-step-no'))
          if (!isNaN(no)) {
            activeStepNo.value = no
          }
        }
      }
    }, {
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.2,
    })

    const stepEls = document.querySelectorAll('.flow-step-card')
    stepEls.forEach(el => observer?.observe(el))
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <section
    id="alur"
    class="flow-section"
    aria-labelledby="flow-heading"
  >
    <div class="flow-container">
      <!-- Section Intro -->
      <div class="flow-intro reveal">
        <p class="eyebrow-light">BUKTI KETERHUBUNGAN DATA · ALUR HARIAN</p>
        <h2 id="flow-heading" class="flow-title">
          Satu data mengalir: dari izin santri hingga buku besar.
        </h2>
        <p class="flow-desc">
          Ikuti perjalanan harian santri Ahmad. Satu ketukan di gerbang atau kasir langsung terhubung ke seluruh sistem tanpa rekonsiliasi manual atau ketik ganda.
        </p>
      </div>

      <!-- Skeuomorphic Perforated Ticket: Pass Operasional Satu Data -->
      <div class="ops-ticket reveal" role="region" aria-label="Pass Operasional Satu Data">
        <div class="ticket-main">
          <div class="ticket-header">
            <span class="ticket-tagline">Pass Operasional Satu Data</span>
            <span class="ticket-demo-pill">Skenario: Ahmad (Data Demo)</span>
          </div>

          <div class="ticket-route">
            <div class="route-point">
              <span class="point-code">FO / GURU</span>
              <span class="point-sub">Izin Pulang</span>
            </div>
            <div class="route-line" aria-hidden="true">
              <span class="route-dot" />
              <span class="route-connector" />
              <span class="route-dot" />
            </div>
            <div class="route-point">
              <span class="point-code">GATE &amp; WOMI</span>
              <span class="point-sub">Verifikasi Gerbang</span>
            </div>
            <div class="route-line" aria-hidden="true">
              <span class="route-dot" />
              <span class="route-connector" />
              <span class="route-dot" />
            </div>
            <div class="route-point">
              <span class="point-code">BACK OFFICE</span>
              <span class="point-sub">Buku Besar Kas</span>
            </div>
          </div>

          <div class="ticket-meta-grid">
            <div class="ticket-meta-item">
              <span class="meta-label">Cakupan Sistem</span>
              <span class="meta-val">6 Aplikasi Terkoneksi</span>
            </div>
            <div class="ticket-meta-item">
              <span class="meta-label">Metode Integrasi</span>
              <span class="meta-val">Satu Basis Data Neon</span>
            </div>
            <div class="ticket-meta-item">
              <span class="meta-label">Status Alur</span>
              <span class="meta-val">Langkah 4 &amp; 5 Segera Hadir</span>
            </div>
          </div>
        </div>

        <!-- Ticket Stub with Perforated Edge -->
        <div class="ticket-stub">
          <div class="stub-content">
            <span class="stub-big">1 DATA</span>
            <span class="stub-sub">Tanpa ketik ulang</span>
            <span class="stub-badge">9 Langkah Terhubung</span>
          </div>
        </div>
      </div>

      <!-- 9-Step Timeline -->
      <div class="timeline-wrapper reveal">
        <div class="timeline-track" aria-hidden="true" />

        <ol class="timeline-steps" role="list">
          <li
            v-for="step in timelineSteps"
            :key="step.stepNo"
            :data-step-no="step.stepNo"
            class="flow-step-card"
            :class="{ 'is-active': activeStepNo === step.stepNo }"
            @click="setActiveStep(step.stepNo)"
          >
            <!-- Step Node Marker -->
            <div class="step-node" aria-hidden="true">
              <span class="node-number">{{ String(step.stepNo).padStart(2, '0') }}</span>
            </div>

            <!-- Card Body -->
            <div class="step-card-content">
              <div class="step-top-bar">
                <span class="step-actor">
                  <span class="material-symbols-rounded actor-icon">person</span>
                  {{ step.actor }}
                </span>
                <span class="step-app-pill">
                  {{ step.app?.name || step.appSlug }}
                </span>
                <span
                  v-if="step.status === 'roadmap'"
                  class="step-roadmap-pill"
                >
                  Segera hadir — Fase 4
                </span>
              </div>

              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>

              <!-- Roadmap Fallback Operational Note -->
              <div v-if="step.fallbackNote" class="fallback-note-box">
                <span class="material-symbols-rounded note-icon">info</span>
                <span>Prosedur transisi: {{ step.fallbackNote }}</span>
              </div>
            </div>
          </li>
        </ol>
      </div>

      <!-- Footer Disclaimer -->
      <div class="timeline-watermark">
        <span>* Ilustrasi alur di atas menggunakan data demo dan akun team QA & QC SSD</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.flow-section {
  padding: clamp(4rem, 8vw, 8rem) 0;
  background: var(--color-navy-900, #12355b);
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.flow-container {
  max-width: var(--container-max, 1280px);
  margin: 0 auto;
  padding: 0 var(--container-padding, 1.5rem);
}

.flow-intro {
  max-width: 760px;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.eyebrow-light {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-cyan-400, #2cc6e4);
  margin-bottom: 0.75rem;
}

.flow-title {
  font-family: var(--font-display, sans-serif);
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: #ffffff;
  margin-bottom: 1rem;
}

.flow-desc {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-navy-100, #dce7f2);
}

/* Skeuomorphic Perforated Ticket */
.ops-ticket {
  display: flex;
  flex-direction: column;
  background: var(--color-paper-warm, #f1f6fb);
  color: #0a2036;
  border-radius: 16px;
  margin-bottom: 4rem;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}
@media (min-width: 768px) {
  .ops-ticket {
    flex-direction: row;
  }
}

.ticket-main {
  flex: 1;
  padding: clamp(1.5rem, 3vw, 2.25rem);
}

.ticket-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.ticket-tagline {
  font-family: var(--font-mono, monospace);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-navy-900, #12355b);
}
.ticket-demo-pill {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: var(--color-navy-100, #dce7f2);
  color: var(--color-navy-950, #0a2036);
  border-radius: 4px;
}

/* Route Visual */
.ticket-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0;
  border-top: 1px dashed rgba(18, 53, 91, 0.2);
  border-bottom: 1px dashed rgba(18, 53, 91, 0.2);
  margin-bottom: 1.5rem;
  gap: 0.25rem;
}
.route-point {
  display: flex;
  flex-direction: column;
}
.point-code {
  font-family: var(--font-display, sans-serif);
  font-weight: 800;
  font-size: clamp(0.875rem, 2.8vw, 1.125rem);
  color: var(--color-navy-950, #0a2036);
}
.point-sub {
  font-size: clamp(0.6875rem, 2vw, 0.75rem);
  color: var(--ssd-text-secondary, #46607a);
}

.route-line {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 clamp(0.35rem, 1.5vw, 1rem);
  min-width: 16px;
}
.route-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-cyan-500, #00b4d8);
}
.route-connector {
  flex: 1;
  height: 2px;
  background: rgba(18, 53, 91, 0.2);
}

.ticket-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}
.ticket-meta-item {
  display: flex;
  flex-direction: column;
}
.meta-label {
  font-size: 0.75rem;
  color: var(--ssd-text-secondary, #46607a);
}
.meta-val {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-navy-950, #0a2036);
}

/* Ticket Stub with Cutouts */
.ticket-stub {
  background: var(--color-cyan-500, #00b4d8);
  color: var(--color-navy-950, #0a2036);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 200px;
}
@media (min-width: 768px) {
  .ticket-stub {
    border-left: 2px dashed rgba(10, 32, 54, 0.25);
  }
  /* Perforated cutout circles */
  .ticket-stub::before,
  .ticket-stub::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    background: var(--color-navy-900, #12355b);
    border-radius: 50%;
    left: -12px;
  }
  .ticket-stub::before {
    top: -12px;
  }
  .ticket-stub::after {
    bottom: -12px;
  }
}

.stub-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}
.stub-big {
  font-family: var(--font-display, sans-serif);
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}
.stub-sub {
  font-size: 0.8125rem;
  font-weight: 600;
}
.stub-badge {
  font-family: var(--font-mono, monospace);
  font-size: 0.6875rem;
  padding: 0.2rem 0.5rem;
  background: rgba(10, 32, 54, 0.15);
  border-radius: 4px;
  margin-top: 0.25rem;
}

/* Timeline Layout */
.timeline-wrapper {
  position: relative;
  padding-left: 2.5rem;
}
@media (min-width: 768px) {
  .timeline-wrapper {
    padding-left: 4.5rem;
  }
}

.timeline-track {
  position: absolute;
  top: 1.5rem;
  bottom: 2rem;
  left: 1.25rem;
  width: 2px;
  background: rgba(255, 255, 255, 0.15);
}
@media (min-width: 768px) {
  .timeline-track {
    left: 2rem;
  }
}

.timeline-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.flow-step-card {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 250ms ease;
}
.flow-step-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-cyan-500, #00b4d8);
  transform: translateX(4px);
}
.flow-step-card.is-active {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-cyan-400, #2cc6e4);
  box-shadow: 0 8px 32px rgba(0, 180, 216, 0.15);
}

.step-node {
  position: absolute;
  left: -2.5rem;
  top: 1.5rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-navy-950, #0a2036);
  border: 2px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
}
@media (min-width: 768px) {
  .step-node {
    left: -4.5rem;
    width: 34px;
    height: 34px;
  }
}
.flow-step-card.is-active .step-node {
  background: var(--color-cyan-500, #00b4d8);
  border-color: #ffffff;
}

.node-number {
  font-family: var(--font-mono, monospace);
  font-size: 0.6875rem;
  font-weight: 700;
  color: #ffffff;
}
.flow-step-card.is-active .node-number {
  color: var(--color-navy-950, #0a2036);
}

.step-top-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
}

.step-actor {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-cyan-100, #d5f3fa);
}
.actor-icon {
  font-size: 16px;
}

.step-app-pill {
  font-family: var(--font-mono, monospace);
  font-size: 0.6875rem;
  padding: 0.15rem 0.5rem;
  background: rgba(0, 180, 216, 0.15);
  color: var(--color-cyan-400, #2cc6e4);
  border-radius: 4px;
}

.step-roadmap-pill {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  background: #fff1cf;
  color: #7a4e00;
  border-radius: 4px;
}

.step-title {
  font-family: var(--font-display, sans-serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
}

.step-description {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--color-navy-100, #dce7f2);
  margin: 0;
}

.fallback-note-box {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 241, 207, 0.1);
  border: 1px solid rgba(255, 241, 207, 0.3);
  border-radius: 6px;
  font-size: 0.75rem;
  color: #fed7aa;
}
.note-icon {
  font-size: 16px;
}

.timeline-watermark {
  margin-top: 3rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--ssd-text-secondary, #46607a);
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { useEcosystemStore } from '~/stores/ecosystem'
import type { PainPoint } from '@ssd/shared/types'
import { painPoints as defaultPainPoints } from '@ssd/shared/content'

const props = withDefaults(defineProps<{
  items?: PainPoint[]
}>(), {
  items: () => defaultPainPoints,
})

const ecosystemStore = useEcosystemStore()
const painPointList = computed(() => props.items || defaultPainPoints)

function selectApp(slug: string) {
  ecosystemStore.setActiveSlug(slug)
  if (import.meta.client) {
    const ecoSection = document.getElementById('ekosistem')
    if (ecoSection) {
      ecoSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// App badge label mapping helper
function formatAppLabel(slug: string): string {
  const map: Record<string, string> = {
    'back-office': 'Back Office',
    'pegawai': 'Pegawai',
    'wali-murid': 'Wali Murid',
    'wali-kelas': 'Wali Kelas',
    'bk': 'BK SSD',
    'absensi-tap': 'Absensi Tap',
    'security-gate': 'Security Gate',
    'command-center': 'Command Center',
    'mitra-usaha': 'Mitra Usaha',
    'psb': 'PSB / PPDB',
    'layanan-terpadu': 'Layanan Terpadu',
    'pimpinan': 'Pimpinan',
  }
  return map[slug] || slug
}
</script>

<template>
  <section id="masalah" class="problem-section" aria-labelledby="problem-heading">
    <div class="problem-container">
      <!-- 2-Column Grid Layout -->
      <div class="problem-grid">
        <!-- Left Column: Analogy Statement & Context -->
        <div class="problem-statement-col reveal-left">
          <p class="eyebrow">OPERASIONAL SEKOLAH</p>
          <h2 id="problem-heading" class="statement-heading">
            Ribetnya sekolah ada di operasional harian.
          </h2>
          
          <blockquote class="analogy-card">
            <p class="analogy-quote">
              &ldquo;Sekolah seperti restoran. Banyak yang hanya menjual kasir atau absen, tetapi operasional dapur tetap berantakan. SSD menyediakan dapur, kasir, satpam, aplikasi orang tua, kantin digital, sampai TV monitoring semua tersambung ke satu data.&rdquo;
            </p>
            <cite class="analogy-cite">Prinsip Arsitektur SSD</cite>
          </blockquote>

          <div class="statement-note">
            <p>
              Tujuh pain point di samping diselesaikan bukan dengan menumpuk aplikasi berbeda dari vendor terpisah, melainkan mengalirkannya ke satu basis data terpadu.
            </p>
          </div>
        </div>

        <!-- Right Column: 7 Daily Pain Points -->
        <div class="problem-list-col reveal-right">
          <ol class="pain-point-list" role="list">
            <li
              v-for="point in painPointList"
              :key="point.number"
              class="pain-point-item"
            >
              <div class="item-accent-line" aria-hidden="true" />
              <div class="item-header">
                <span class="item-no">{{ String(point.number).padStart(2, '0') }}</span>
                <h3 class="item-title">{{ point.title }}</h3>
              </div>
              <p class="item-desc">{{ point.description }}</p>

              <!-- Interactive Solved-By App Chips -->
              <div class="item-solutions" aria-label="Aplikasi penyelesai">
                <span class="sol-label">Diselesaikan oleh:</span>
                <div class="chips-group">
                  <button
                    v-for="slug in point.solvedByAppSlugs"
                    :key="slug"
                    type="button"
                    class="app-chip"
                    :aria-label="`Pilih aplikasi ${formatAppLabel(slug)} di ekosistem`"
                    @click="selectApp(slug)"
                  >
                    <span class="chip-dot" aria-hidden="true" />
                    <span class="chip-name">{{ formatAppLabel(slug) }}</span>
                  </button>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.problem-section {
  padding: clamp(4rem, 8vw, 8rem) 0;
  background: var(--ssd-wall, #f6f9fc);
  position: relative;
}

.problem-container {
  max-width: var(--container-max, 1280px);
  margin: 0 auto;
  padding: 0 var(--container-padding, 1.5rem);
}

.problem-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 5vw, 5rem);
}
@media (min-width: 1024px) {
  .problem-grid {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    align-items: start;
  }
}

.problem-statement-col {
  display: flex;
  flex-direction: column;
}
@media (min-width: 1024px) {
  .problem-statement-col {
    position: sticky;
    top: 96px;
  }
}

.eyebrow {
  font-family: var(--font-mono, monospace);
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-cyan-700, #00758f);
  margin-bottom: 0.75rem;
}

.statement-heading {
  font-family: var(--font-display, sans-serif);
  font-size: clamp(2rem, 3.2vw, 3.25rem);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--color-navy-950, #0a2036);
  margin-bottom: 1.75rem;
}

.analogy-card {
  margin: 0 0 1.5rem 0;
  padding: 1.5rem 1.75rem;
  background: var(--color-paper-warm, #f1f6fb);
  border-left: 3px solid var(--color-cyan-500, #00b4d8);
  border-radius: 0 12px 12px 0;
}

.analogy-quote {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-navy-900, #12355b);
  margin: 0 0 0.75rem 0;
  font-style: italic;
}

.analogy-cite {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-cyan-700, #00758f);
  display: block;
}

.statement-note {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--ssd-text-secondary, #46607a);
}

/* Pain Point List Styling */
.pain-point-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pain-point-item {
  position: relative;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid var(--ssd-border, #d7e2ec);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.pain-point-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(10, 32, 54, 0.06);
}

.item-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-cyan-500, #00b4d8);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 250ms var(--ease-standard, ease);
}
.pain-point-item:hover .item-accent-line,
.pain-point-item:focus-within .item-accent-line {
  transform: scaleY(1);
}

.item-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.item-no {
  font-family: var(--font-mono, monospace);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-cyan-700, #00758f);
}

.item-title {
  font-family: var(--font-display, sans-serif);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-navy-950, #0a2036);
  margin: 0;
}

.item-desc {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--ssd-text-secondary, #46607a);
  margin: 0 0 1rem 0;
}

.item-solutions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px dashed rgba(18, 53, 91, 0.1);
}

.sol-label {
  font-size: 0.75rem;
  color: var(--ssd-text-secondary, #46607a);
}

.chips-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.app-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  background: var(--color-paper-warm, #f1f6fb);
  border: 1px solid var(--ssd-border, #d7e2ec);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-navy-900, #12355b);
  cursor: pointer;
  transition: all 150ms ease;
}
.app-chip:hover {
  background: var(--color-cyan-50, #edfafd);
  border-color: var(--color-cyan-500, #00b4d8);
  color: var(--color-cyan-700, #00758f);
  transform: translateY(-1px);
}
.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-cyan-500, #00b4d8);
}
</style>

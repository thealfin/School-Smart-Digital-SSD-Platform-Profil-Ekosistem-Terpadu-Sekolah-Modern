<script setup lang="ts">
import {
  SSD_LOGO_VIEWBOX,
  SSD_LOGO_NAVY_PATH,
  SSD_LOGO_CYAN_PATH,
  SSD_LOGO_NAVY_COLOR,
  SSD_LOGO_CYAN_COLOR,
} from '~/utils/ssd-logo-paths'

withDefaults(
  defineProps<{
    variant?: 'default' | 'light' | 'adaptive'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    showText?: boolean
    subtitle?: string
  }>(),
  {
    variant: 'default',
    size: 'md',
    showText: true,
    subtitle: '',
  }
)
</script>

<template>
  <span class="brand-logo" :class="[`variant-${variant}`, `size-${size}`]">
    <span class="logo-mark-box" aria-hidden="true">
      <svg
        :viewBox="SSD_LOGO_VIEWBOX"
        class="logo-mark-svg"
        role="img"
        aria-label="Logo School Smart Digital"
      >
        <path
          :fill="SSD_LOGO_NAVY_COLOR"
          :d="SSD_LOGO_NAVY_PATH"
          class="logo-path-navy"
        />
        <path
          :fill="SSD_LOGO_CYAN_COLOR"
          :d="SSD_LOGO_CYAN_PATH"
          class="logo-path-cyan"
        />
      </svg>
    </span>

    <span v-if="showText" class="brand-wordmark">
      <span class="brand-line-main">
        <span class="brand-primary">School Smart</span>
        <span class="brand-accent">Digital</span>
      </span>
      <span v-if="subtitle" class="brand-subtitle">{{ subtitle }}</span>
    </span>
  </span>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  user-select: none;
}

.logo-mark-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 8px;
  transition: background-color 200ms ease, box-shadow 200ms ease;
}

/* On dark backgrounds, give the authentic Navy+Cyan mark a crisp light badge frame so both Navy (#0C3161) and Cyan (#01A8CF) pop clearly */
.variant-light .logo-mark-box {
  background: #ffffff;
  padding: 3px;
  border-radius: 9px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.logo-mark-svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* Sizes */
.size-sm .logo-mark-box {
  width: 28px;
  height: 28px;
}
.size-md .logo-mark-box {
  width: 36px;
  height: 36px;
}
.size-lg .logo-mark-box {
  width: 44px;
  height: 44px;
}
.size-xl .logo-mark-box {
  width: 56px;
  height: 56px;
}

.brand-wordmark {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-line-main {
  font-family: var(--font-display, "Bricolage Grotesque", sans-serif);
  font-weight: 700;
  letter-spacing: -0.02em;
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
}

.size-sm .brand-line-main {
  font-size: 1rem;
}
.size-md .brand-line-main {
  font-size: 1.125rem;
}
.size-lg .brand-line-main {
  font-size: 1.25rem;
}
.size-xl .brand-line-main {
  font-size: 1.5rem;
}

.variant-default .brand-primary {
  color: #0c3161;
}
.variant-light .brand-primary {
  color: #ffffff;
}
.variant-adaptive .brand-primary {
  color: inherit;
}

.brand-accent {
  color: #01a8cf;
}
.variant-light .brand-accent {
  color: #2cc6e4;
}

.brand-subtitle {
  font-family: var(--font-mono, monospace);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #01a8cf;
  margin-top: 2px;
}
.variant-light .brand-subtitle {
  color: #2cc6e4;
}
</style>


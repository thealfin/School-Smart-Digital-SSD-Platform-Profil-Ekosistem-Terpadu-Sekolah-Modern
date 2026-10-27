<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export interface FilterCategoryOption {
  id: string
  label: string
  color?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    allValue?: string
    allLabel?: string
    filterLabel?: string
    categories?: Array<string | FilterCategoryOption>
    totalCount?: number
    counts?: Record<string, number>
  }>(),
  {
    modelValue: 'all',
    allValue: 'all',
    allLabel: 'Semua Kategori',
    filterLabel: 'Filter Kategori',
    categories: () => [],
    totalCount: 0,
    counts: () => ({}),
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const wrapperRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const normalizedCategories = computed<FilterCategoryOption[]>(() => {
  return props.categories
    .map((cat) => {
      if (typeof cat === 'string') {
        return { id: cat, label: cat, color: '#01A8CF' }
      }
      return {
        id: cat.id || cat.label,
        label: cat.label || cat.id,
        color: cat.color || '#01A8CF',
      }
    })
    .filter(
      (c) =>
        c.id &&
        c.id.toLowerCase() !== props.allValue.toLowerCase() &&
        c.id.toLowerCase() !== 'all'
    )
})

const isAllActive = computed(() => {
  return (
    !props.modelValue ||
    props.modelValue === props.allValue ||
    props.modelValue.toLowerCase() === 'all'
  )
})

const isSpecificActive = computed(() => !isAllActive.value)

const activeCategoryObj = computed(() => {
  if (!isSpecificActive.value) return null
  return (
    normalizedCategories.value.find(
      (c) =>
        c.id.toLowerCase() === props.modelValue.toLowerCase() ||
        c.label.toLowerCase() === props.modelValue.toLowerCase()
    ) || { id: props.modelValue, label: props.modelValue, color: '#01A8CF' }
  )
})

const currentButtonLabel = computed(() => {
  if (isSpecificActive.value && activeCategoryObj.value) {
    return activeCategoryObj.value.label
  }
  return props.filterLabel
})

function getItemCount(catIdOrLabel: string): number {
  if (!catIdOrLabel || !props.counts) return 0
  if (props.counts[catIdOrLabel] !== undefined) return props.counts[catIdOrLabel]
  const foundKey = Object.keys(props.counts).find(
    (k) => k.toLowerCase() === catIdOrLabel.toLowerCase()
  )
  return foundKey !== undefined ? props.counts[foundKey] || 0 : 0
}

const currentSelectedCount = computed(() => {
  if (!isSpecificActive.value || !activeCategoryObj.value) return undefined
  return getItemCount(activeCategoryObj.value.id)
})

function selectAll() {
  isOpen.value = false
  emit('update:modelValue', props.allValue)
  emit('change', props.allValue)
}

function selectCategory(catId: string) {
  isOpen.value = false
  emit('update:modelValue', catId)
  emit('change', catId)
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function handleClickOutside(event: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div ref="wrapperRef" class="relative inline-flex flex-wrap items-center gap-2.5 z-40 select-none">
    <!-- Button 1: Semua Kategori (S-Curve Pill) -->
    <button
      type="button"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-tl-[1.2rem] rounded-br-[1.2rem] rounded-tr-md rounded-bl-md text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95"
      :class="
        isAllActive
          ? 'bg-navy-900 text-white shadow-md shadow-navy-950/15 border border-navy-900'
          : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-500 hover:text-navy-900 shadow-xs'
      "
      @click="selectAll"
    >
      <span class="font-display font-bold tracking-tight">{{ allLabel }}</span>
      <span
        v-if="totalCount !== undefined"
        class="px-1.5 py-0.5 min-w-5 h-5 rounded-full text-[11px] font-mono font-bold inline-flex items-center justify-center transition-colors"
        :class="
          isAllActive
            ? 'bg-cyan-400 text-navy-950'
            : 'bg-slate-100 text-slate-600'
        "
      >
        {{ totalCount }}
      </span>
    </button>

    <!-- Button 2: Filter Kategori Trigger with Custom Funnel SVG Icon (S-Curve Shape) -->
    <div class="relative z-40">
      <button
        type="button"
        :aria-expanded="isOpen"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-tl-[1.2rem] rounded-br-[1.2rem] rounded-tr-md rounded-bl-md text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 group"
        :class="
          isSpecificActive
            ? 'bg-navy-900 text-white shadow-md shadow-navy-950/15 border border-cyan-400/60 ring-2 ring-cyan-400/25'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-500 hover:text-navy-900 shadow-xs'
        "
        @click="toggleDropdown"
      >
        <!-- Requested Filter SVG Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="18px"
          viewBox="0 -960 960 960"
          width="18px"
          fill="currentColor"
          class="shrink-0 transition-transform duration-200 group-hover:scale-110"
          :class="isSpecificActive ? 'text-cyan-400' : 'text-navy-900 group-hover:text-cyan-600'"
        >
          <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
        </svg>

        <span class="font-display font-bold tracking-tight max-w-[160px] sm:max-w-[220px] truncate">
          {{ currentButtonLabel }}
        </span>

        <span
          v-if="isSpecificActive && currentSelectedCount !== undefined"
          class="px-1.5 py-0.5 min-w-5 h-5 rounded-full text-[11px] font-mono font-bold inline-flex items-center justify-center bg-cyan-400 text-navy-950"
        >
          {{ currentSelectedCount }}
        </span>

        <span
          class="material-symbols-rounded text-base transition-transform duration-200 opacity-75"
          :class="isOpen ? 'rotate-180' : ''"
        >
          expand_more
        </span>
      </button>

      <!-- S-Curve Floating Dropdown Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0 -translate-y-2"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 -translate-y-2"
      >
        <div
          v-if="isOpen"
          class="absolute left-0 sm:left-auto sm:right-0 mt-2.5 min-w-[240px] sm:min-w-[270px] max-w-[320px] bg-white border border-slate-200 rounded-tl-[1.75rem] rounded-br-[1.75rem] rounded-tr-xl rounded-bl-xl p-2.5 z-[100] max-h-[360px] overflow-y-auto shadow-2xl shadow-navy-950/20 ring-1 ring-slate-900/5"
        >
          <div class="px-3 py-2 border-b border-slate-100 text-[10px] uppercase font-mono font-bold tracking-wider flex justify-between items-center mb-1.5 text-slate-400">
            <span>Pilih Kategori</span>
            <span class="text-cyan-600">{{ normalizedCategories.length }} Kategori</span>
          </div>

          <div class="space-y-1">
            <!-- Option: Semua -->
            <button
              type="button"
              class="w-full text-left px-3 py-2 rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 transition-all cursor-pointer"
              :class="
                isAllActive
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-navy-900'
              "
              @click="selectAll"
            >
              <div class="flex items-center gap-2.5 truncate">
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  :class="isAllActive ? 'bg-cyan-400' : 'bg-slate-400'"
                />
                <span class="truncate">{{ allLabel }}</span>
              </div>
              <span
                class="px-1.5 py-0.5 min-w-5 h-5 rounded-full text-[11px] font-mono font-bold inline-flex items-center justify-center shrink-0"
                :class="isAllActive ? 'bg-cyan-400 text-navy-950' : 'bg-slate-100 text-slate-600'"
              >
                {{ totalCount }}
              </span>
            </button>

            <!-- Category Items -->
            <button
              v-for="cat in normalizedCategories"
              :key="cat.id"
              type="button"
              class="w-full text-left px-3 py-2 rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 transition-all cursor-pointer"
              :class="
                modelValue.toLowerCase() === cat.id.toLowerCase()
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-navy-900'
              "
              @click="selectCategory(cat.id)"
            >
              <div class="flex items-center gap-2.5 truncate">
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  :style="{ backgroundColor: modelValue.toLowerCase() === cat.id.toLowerCase() ? '#22d3ee' : (cat.color || '#01A8CF') }"
                />
                <span class="truncate">{{ cat.label }}</span>
              </div>
              <span
                class="px-1.5 py-0.5 min-w-5 h-5 rounded-full text-[11px] font-mono font-bold inline-flex items-center justify-center shrink-0"
                :class="
                  modelValue.toLowerCase() === cat.id.toLowerCase()
                    ? 'bg-cyan-400 text-navy-950'
                    : 'bg-slate-100 text-slate-600'
                "
              >
                {{ getItemCount(cat.id) }}
              </span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>


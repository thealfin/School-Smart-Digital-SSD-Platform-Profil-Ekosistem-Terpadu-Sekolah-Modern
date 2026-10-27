<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  slugifyText,
  renderMarkdown,
  cleanHtmlContent,
  cleanMarkdownContent,
  extractSourcesFromHtml,
  extractSourcesFromMarkdown,
} from '~/utils/markdown'
import { parseUploadedDocument } from '~/utils/documentParser'

export interface NewsCategoryOption {
  id?: string | number
  name: string
  color?: string
  description?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    editPost?: Record<string, any> | null
    categoryOptions?: NewsCategoryOption[]
  }>(),
  {
    modelValue: false,
    editPost: null,
    categoryOptions: () => [],
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
  (e: 'category-added', category: NewsCategoryOption): void
}>()

const formErrorMessage = ref('')
const showAddCategoryModal = ref(false)
const newCategoryForm = reactive({
  name: '',
  color: '#01A8CF',
  description: '',
})
const addCategoryError = ref('')

const defaultCategories: NewsCategoryOption[] = [
  { name: 'Bimtek', color: '#01A8CF' },
  { name: 'Teknologi', color: '#0C3161' },
  { name: 'Manajemen', color: '#10b981' },
  { name: 'Studi Kasus', color: '#6366f1' },
  { name: 'Pengumuman', color: '#f59e0b' },
]

const localCategoryList = ref<NewsCategoryOption[]>([...defaultCategories])

watch(
  () => props.categoryOptions,
  (newVal) => {
    if (Array.isArray(newVal) && newVal.length) {
      const existingNames = new Set(localCategoryList.value.map((c) => c.name.toLowerCase()))
      const merged = [...localCategoryList.value]
      for (const item of newVal) {
        if (item?.name && !existingNames.has(item.name.toLowerCase())) {
          merged.push(item)
          existingNames.add(item.name.toLowerCase())
        }
      }
      localCategoryList.value = merged
    }
  },
  { immediate: true }
)

const categoryColorPresets = [
  { label: 'SSD Cyan', value: '#01A8CF' },
  { label: 'SSD Navy', value: '#0C3161' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Teal', value: '#14b8a6' },
]

function openAddCategoryDialog() {
  newCategoryForm.name = ''
  newCategoryForm.color = '#01A8CF'
  newCategoryForm.description = ''
  addCategoryError.value = ''
  showAddCategoryModal.value = true
}

function closeAddCategoryDialog() {
  showAddCategoryModal.value = false
  addCategoryError.value = ''
}

function handleSaveNewCategory() {
  const name = newCategoryForm.name.trim()
  if (!name) {
    addCategoryError.value = 'Nama kategori wajib diisi!'
    return
  }

  const exists = localCategoryList.value.some((c) => c.name.toLowerCase() === name.toLowerCase())
  if (exists) {
    form.category = name
    closeAddCategoryDialog()
    return
  }

  const newCat: NewsCategoryOption = {
    id: Date.now(),
    name,
    color: newCategoryForm.color || '#01A8CF',
    description: newCategoryForm.description.trim() || undefined,
  }
  localCategoryList.value.push(newCat)
  form.category = name
  emit('category-added', newCat)
  closeAddCategoryDialog()
}

const fileInputRef = ref<HTMLInputElement | null>(null)
const parsingFile = ref(false)
const importNotice = ref('')
const saving = ref(false)
const activeTab = ref<'content' | 'seo' | 'scripts' | 'preview'>('content')
const isFullscreen = ref(false)

const tabs = [
  { id: 'content' as const, label: 'Konten Utama', icon: 'article' },
  { id: 'seo' as const, label: 'Metadata & Optimasi SEO', icon: 'travel_explore' },
  { id: 'scripts' as const, label: 'Kustom CSS & Skrip JS', icon: 'code' },
  { id: 'preview' as const, label: 'Live Preview', icon: 'visibility' },
]

const isEdit = computed(() => Boolean(props.editPost?.id))

const form = reactive({
  title: '',
  slug: '',
  category: 'Bimtek',
  author_name: 'Tim SSD',
  image_url: '',
  summary: '',
  content: '',
  sources: '',
  sources_align: 'left' as 'left' | 'justify',
  format: 'html' as 'html' | 'markdown',
  meta_title: '',
  meta_description: '',
  keywords: '',
  tags: '',
  canonical: '',
  read_time_minutes: 5,
  is_published: true,
  custom_css: '',
  custom_scripts_text: '',
  schema_json_text: '',
})

const wordCount = computed(() => {
  const text = form.content ? form.content.replace(/<[^>]*>/g, ' ') : ''
  return text.trim().split(/\s+/).filter(Boolean).length
})

const renderedMarkdownContent = computed(() => {
  const cleanMd = cleanMarkdownContent(form.content || '')
  return renderMarkdown(cleanMd)
})

const renderedHtmlContent = computed(() => {
  return cleanHtmlContent(form.content || '')
})

const canExtractSourcesFromContent = computed(() => {
  if (!form.content) return false
  if (form.format === 'html') {
    return /<h2[^>]*id=["']sumber["'][^>]*>|<h2>\s*Sumber\s+dan\s+Referensi/i.test(form.content)
  }
  return /##\s+Sumber\s+dan\s+Referensi/i.test(form.content)
})

function extractSourcesFromCurrentContent() {
  if (form.format === 'html') {
    const ext = extractSourcesFromHtml(form.content)
    if (ext.sources) {
      form.sources = ext.sources
      form.content = ext.body
      form.sources_align = 'left'
    }
  } else {
    const ext = extractSourcesFromMarkdown(form.content)
    if (ext.sources) {
      form.sources = ext.sources
      form.content = ext.body
      form.sources_align = 'left'
    }
  }
}

const renderedPreviewSources = computed(() => {
  if (!form.sources) return ''
  if (form.format === 'html' || form.sources.trim().startsWith('<')) {
    return form.sources
  }
  return renderMarkdown(form.sources)
})

function resetForm() {
  form.title = ''
  form.slug = ''
  form.category = localCategoryList.value?.[0]?.name || 'Bimtek'
  form.author_name = 'Tim SSD'
  form.image_url = ''
  form.summary = ''
  form.content = ''
  form.sources = ''
  form.sources_align = 'left'
  form.format = 'html'
  form.meta_title = ''
  form.meta_description = ''
  form.keywords = ''
  form.tags = ''
  form.canonical = ''
  form.read_time_minutes = 5
  form.is_published = true
  form.custom_css = ''
  form.custom_scripts_text = ''
  form.schema_json_text = ''
  importNotice.value = ''
  formErrorMessage.value = ''
  activeTab.value = 'content'
}

watch(
  () => [props.editPost, props.modelValue],
  ([p, open]) => {
    if (!open) return
    if (p && typeof p === 'object') {
      const meta = p.meta || {}
      form.title = p.title || ''
      form.slug = p.slug || ''
      form.summary = p.summary || ''
      form.content = p.content || ''
      form.image_url = p.coverImageUrl || p.image_url || p.featured_image || ''
      form.category =
        p.category ||
        meta.category_name ||
        (Array.isArray(meta.category) ? meta.category[0] : meta.category) ||
        'Bimtek'
      form.author_name = p.author || meta.author_name || 'Tim SSD'
      form.format = meta.format || (p.content?.trim()?.startsWith('<') ? 'html' : 'markdown')
      form.sources = meta.sources || ''
      form.sources_align = meta.sources_align || 'left'

      if (!form.sources && form.content) {
        if (form.format === 'html') {
          const ext = extractSourcesFromHtml(form.content)
          if (ext.sources) {
            form.sources = ext.sources
            form.content = ext.body
          }
        } else {
          const ext = extractSourcesFromMarkdown(form.content)
          if (ext.sources) {
            form.sources = ext.sources
            form.content = ext.body
          }
        }
      }

      form.meta_title = meta.meta_title || ''
      form.meta_description = meta.meta_description || p.summary || ''
      form.keywords = meta.keywords || ''
      form.tags = Array.isArray(meta.tags) ? meta.tags.join(', ') : meta.tags || ''
      form.canonical = meta.canonical || ''
      form.read_time_minutes =
        meta.read_time_minutes || Math.max(1, Math.ceil(wordCount.value / 200))
      form.is_published =
        p.isPublished !== undefined
          ? Boolean(p.isPublished)
          : p.is_published !== undefined
            ? Boolean(p.is_published)
            : true
      form.custom_css = meta.custom_css || ''
      form.custom_scripts_text = meta.custom_scripts
        ? typeof meta.custom_scripts === 'string'
          ? meta.custom_scripts
          : JSON.stringify(meta.custom_scripts, null, 2)
        : ''
      form.schema_json_text = meta.schema_json ? JSON.stringify(meta.schema_json, null, 2) : ''
      importNotice.value = ''
      formErrorMessage.value = ''
      activeTab.value = 'content'
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function onTitleInput() {
  if (!isEdit.value && !form.slug) {
    form.slug = slugifyText(form.title)
  }
}

function regenerateSlug() {
  form.slug = slugifyText(form.title)
}

function cleanSlug() {
  form.slug = form.slug
    .toLowerCase()
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
}

function recalculateStats() {
  form.read_time_minutes = Math.max(1, Math.ceil(wordCount.value / 200))
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  parsingFile.value = true
  importNotice.value = ''
  formErrorMessage.value = ''

  try {
    const parsed = await parseUploadedDocument(file)

    form.title = parsed.title || form.title
    form.slug = parsed.slug || slugifyText(parsed.title || file.name)
    form.summary = parsed.summary || form.summary
    form.content = parsed.content || form.content
    form.format = parsed.format || 'html'
    if (parsed.sources) form.sources = parsed.sources
    if (parsed.sources_align) form.sources_align = parsed.sources_align
    if (parsed.image_url) form.image_url = parsed.image_url
    if (parsed.category?.length) {
      const catName = parsed.category[0]
      if (!localCategoryList.value.some((c) => c.name.toLowerCase() === catName.toLowerCase())) {
        localCategoryList.value.push({ name: catName, color: '#01A8CF' })
      }
      form.category = catName
    }
    if (parsed.tags?.length) form.tags = parsed.tags.join(', ')
    if (parsed.author) form.author_name = parsed.author
    if (parsed.canonical) form.canonical = parsed.canonical
    if (parsed.meta_title) form.meta_title = parsed.meta_title
    if (parsed.meta_description) form.meta_description = parsed.meta_description
    if (parsed.keywords) form.keywords = parsed.keywords
    if (parsed.read_time_minutes) form.read_time_minutes = parsed.read_time_minutes
    if (parsed.custom_css) form.custom_css = parsed.custom_css
    if (parsed.custom_scripts?.length) {
      form.custom_scripts_text = JSON.stringify(parsed.custom_scripts, null, 2)
    }
    if (parsed.schema_json) {
      form.schema_json_text = JSON.stringify(parsed.schema_json, null, 2)
    }

    importNotice.value = `Berhasil mengimpor "${file.name}"! Judul, slug, metadata SEO, ${parsed.sources ? 'Sumber rujukan, ' : ''}${parsed.custom_css ? 'CSS kustom, ' : ''}${parsed.schema_json ? 'Schema JSON-LD, ' : ''}dan konten otomatis terisi.`
  } catch (err: any) {
    formErrorMessage.value = `Gagal membaca berkas: ${err?.message || err}`
  } finally {
    parsingFile.value = false
    input.value = ''
  }
}

function formatJsonSchema() {
  if (!form.schema_json_text.trim()) return
  try {
    const parsed = JSON.parse(form.schema_json_text)
    form.schema_json_text = JSON.stringify(parsed, null, 2)
  } catch {
    formErrorMessage.value =
      'Format JSON Schema tidak valid. Silakan periksa kembali tanda kurung atau kutip.'
  }
}

function close() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  formErrorMessage.value = ''
  if (!form.title.trim()) {
    formErrorMessage.value = 'Judul berita wajib diisi!'
    activeTab.value = 'content'
    return
  }
  if (!form.slug.trim()) {
    form.slug = slugifyText(form.title)
  }
  if (!form.content.trim()) {
    formErrorMessage.value = 'Isi konten berita wajib diisi!'
    activeTab.value = 'content'
    return
  }

  saving.value = true

  let parsedSchema: Record<string, any> | null = null
  if (form.schema_json_text.trim()) {
    try {
      parsedSchema = JSON.parse(form.schema_json_text)
    } catch {
      parsedSchema = null
    }
  }

  let parsedCustomScripts: any = null
  if (form.custom_scripts_text.trim()) {
    if (form.custom_scripts_text.trim().startsWith('[')) {
      try {
        parsedCustomScripts = JSON.parse(form.custom_scripts_text)
      } catch {
        parsedCustomScripts = form.custom_scripts_text.trim()
      }
    } else {
      parsedCustomScripts = [{ content: form.custom_scripts_text.trim() }]
    }
  }

  const tagsArray = form.tags
    ? form.tags
        .split(/[,·|]/)
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  const matchedCat = localCategoryList.value.find(
    (c) => c.name.toLowerCase() === form.category.toLowerCase()
  )

  const metaPayload = {
    format: form.format,
    meta_title: form.meta_title || form.title,
    meta_description: form.meta_description || form.summary,
    keywords: form.keywords,
    tags: tagsArray,
    category: [form.category],
    category_name: form.category,
    category_color: matchedCat?.color || '#01A8CF',
    author_name: form.author_name || 'Tim SSD',
    read_time_minutes: form.read_time_minutes || 5,
    canonical: form.canonical,
    sources: form.sources ? form.sources.trim() : null,
    sources_align: form.sources_align || 'left',
    schema_json: parsedSchema,
    custom_css: form.custom_css,
    custom_scripts: parsedCustomScripts,
  }

  const payload = {
    title: form.title.trim(),
    slug: form.slug.trim(),
    category: form.category,
    author: form.author_name.trim() || 'Tim SSD',
    summary: form.summary.trim(),
    content: form.content,
    coverImageUrl: form.image_url.trim() || null,
    image_url: form.image_url.trim() || null,
    isPublished: form.is_published,
    is_published: form.is_published,
    meta: metaPayload,
  }

  try {
    if (isEdit.value && props.editPost?.id) {
      await $fetch(`/api/admin/news/${props.editPost.id}`, {
        method: 'PUT',
        body: payload,
      })
    } else {
      await $fetch('/api/admin/news', {
        method: 'POST',
        body: payload,
      })
    }

    emit('saved')
    close()
  } catch (err: any) {
    const errorMsg =
      err?.data?.message || err?.data?.statusMessage || err?.message || 'Gagal menyimpan artikel'
    formErrorMessage.value = `Gagal menyimpan artikel: ${errorMsg}`
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      data-lenis-prevent
      class="fixed inset-0 bg-navy-950/75 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 backdrop-blur-md"
      @click.self="close"
    >
      <div
        :class="
          isFullscreen
            ? 'fixed inset-0 w-screen h-screen max-w-none max-h-none rounded-none shadow-none z-50'
            : 'w-full lg:w-3/4 max-w-6xl h-[93vh] max-h-[93vh] rounded-3xl shadow-2xl'
        "
        class="bg-white flex flex-col overflow-hidden transform transition-all duration-200 border border-slate-200"
      >
        <!-- Header -->
        <div class="px-6 py-4 md:px-8 md:py-5 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-700 flex items-center justify-center font-bold shrink-0">
              <span class="material-symbols-rounded text-xl">newspaper</span>
            </div>
            <div>
              <h2 class="text-lg md:text-xl font-extrabold text-navy-900 font-display">
                {{ isEdit ? 'Edit Berita & Artikel' : 'Tulis Berita Baru' }}
              </h2>
              <p class="text-xs text-slate-500 hidden sm:block font-body">
                Editor multi-format (HTML &amp; Markdown) dengan kontrol penuh metadata SEO, styling, dan perataan rujukan
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Tombol Import Berkas Cerdas -->
            <input
              ref="fileInputRef"
              type="file"
              accept=".html,.htm,.md,.markdown,.docx"
              class="hidden"
              @change="onFileChange"
            />
            <button
              type="button"
              :disabled="parsingFile"
              class="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              title="Import berkas HTML, Markdown, atau Word (.html, .md, .docx)"
              @click="triggerFileInput"
            >
              <span class="material-symbols-rounded text-base">upload_file</span>
              <span class="hidden sm:inline">
                {{ parsingFile ? 'Memproses...' : 'Import Berkas (HTML/MD/DOCX)' }}
              </span>
              <span class="sm:hidden">Import</span>
            </button>

            <!-- Toggle Fullscreen -->
            <button
              type="button"
              class="p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              :title="isFullscreen ? 'Kecilkan Tampilan' : 'Perluas ke Layar Penuh'"
              @click="isFullscreen = !isFullscreen"
            >
              <span class="material-symbols-rounded text-xl">
                {{ isFullscreen ? 'close_fullscreen' : 'open_in_full' }}
              </span>
            </button>

            <!-- Tombol Tutup -->
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Tutup Form"
              @click="close"
            >
              <span class="material-symbols-rounded text-xl">close</span>
            </button>
          </div>
        </div>

        <!-- Alert Notifikasi Import Berkas -->
        <div
          v-if="importNotice"
          class="px-6 md:px-8 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800 shrink-0"
        >
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-emerald-600 text-base">check_circle</span>
            <span>{{ importNotice }}</span>
          </div>
          <button type="button" class="text-emerald-600 hover:text-emerald-800 font-bold" @click="importNotice = ''">
            ✕
          </button>
        </div>

        <!-- Alert Error Validasi Form -->
        <div
          v-if="formErrorMessage"
          class="px-6 md:px-8 py-2.5 bg-rose-50 border-b border-rose-100 flex items-center justify-between text-xs text-rose-800 shrink-0"
        >
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-rose-600 text-base">error</span>
            <span>{{ formErrorMessage }}</span>
          </div>
          <button
            type="button"
            class="text-rose-600 hover:text-rose-800 font-bold text-base leading-none"
            @click="formErrorMessage = ''"
          >
            ✕
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex border-b border-slate-100 bg-slate-50/50 px-6 md:px-8 gap-2 text-xs sm:text-sm font-bold overflow-x-auto shrink-0 select-none">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer font-display"
            :class="
              activeTab === tab.id
                ? 'border-cyan-600 text-navy-900 bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-navy-900 hover:bg-slate-100/60'
            "
            @click="activeTab = tab.id"
          >
            <span class="material-symbols-rounded text-base text-cyan-600">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Modal Body (Tab Content) -->
        <div class="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 text-sm font-body">
          <!-- TAB 1: KONTEN UTAMA -->
          <div v-show="activeTab === 'content'" class="space-y-5">
            <!-- Format Picker & Reading Time Info -->
            <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider">Format Konten:</span>
                <div class="inline-flex rounded-xl bg-slate-200/70 p-1">
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    :class="
                      form.format === 'html'
                        ? 'bg-white text-navy-900 shadow-xs'
                        : 'text-slate-600 hover:text-navy-900'
                    "
                    @click="form.format = 'html'"
                  >
                    <span class="material-symbols-rounded text-sm">code</span>
                    <span>HTML Post</span>
                  </button>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    :class="
                      form.format === 'markdown'
                        ? 'bg-white text-navy-900 shadow-xs'
                        : 'text-slate-600 hover:text-navy-900'
                    "
                    @click="form.format = 'markdown'"
                  >
                    <span class="material-symbols-rounded text-sm">description</span>
                    <span>Markdown</span>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-rounded text-sm text-cyan-600">notes</span>
                  <b>{{ wordCount }}</b> kata
                </span>
                <span>•</span>
                <span class="flex items-center gap-1">
                  <span class="material-symbols-rounded text-sm text-cyan-600">schedule</span>
                  <b>{{ form.read_time_minutes }}</b> menit baca
                </span>
              </div>
            </div>

            <!-- Judul Berita -->
            <div class="space-y-1">
              <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider ml-1">
                Judul Berita <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Contoh: Transformasi Presensi Smart Gate QR Code di Sekolah Mitra SSD"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm font-semibold text-navy-900"
                @input="onTitleInput"
              />
            </div>

            <!-- Slug URL -->
            <div class="space-y-1">
              <div class="flex justify-between items-center ml-1">
                <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider">
                  Slug / Permalink URL <span class="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  class="text-[11px] text-cyan-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  @click="regenerateSlug"
                >
                  <span class="material-symbols-rounded text-xs">refresh</span>
                  <span>Generate dari Judul</span>
                </button>
              </div>
              <div class="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all overflow-hidden">
                <span class="px-3.5 py-3 text-xs text-slate-500 bg-slate-100 border-r border-slate-200 font-mono select-none">
                  /berita/
                </span>
                <input
                  v-model="form.slug"
                  type="text"
                  required
                  placeholder="slug-artikel-berita"
                  class="w-full px-3.5 py-3 bg-transparent outline-none text-sm font-mono text-navy-900"
                  @input="cleanSlug"
                />
              </div>
            </div>

            <!-- Kategori & Penulis Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider ml-1">
                  Kategori Artikel <span class="text-rose-500">*</span>
                </label>
                <div class="flex gap-2">
                  <select
                    v-model="form.category"
                    class="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 outline-none transition-all text-sm font-medium text-navy-900"
                  >
                    <option v-for="cat in localCategoryList" :key="cat.id || cat.name" :value="cat.name">
                      {{ cat.name }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="px-3.5 py-3 rounded-xl bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200 font-bold text-xs flex items-center gap-1 transition shrink-0 cursor-pointer"
                    title="Tambah Kategori Baru"
                    @click="openAddCategoryDialog"
                  >
                    <span class="material-symbols-rounded text-base">add</span>
                    <span class="hidden sm:inline">Kategori Baru</span>
                  </button>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider ml-1">
                  Penulis / Redaksi
                </label>
                <input
                  v-model="form.author_name"
                  type="text"
                  placeholder="Tim SSD"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 outline-none transition-all text-sm font-medium text-navy-900"
                />
              </div>
            </div>

            <!-- URL Gambar Sampul -->
            <div class="space-y-1">
              <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider ml-1">
                URL Gambar Sampul (Hero)
              </label>
              <input
                v-model="form.image_url"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 outline-none transition-all text-sm font-mono"
              />
              <div
                v-if="form.image_url"
                class="mt-2 flex items-center gap-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200"
              >
                <img
                  :src="form.image_url"
                  class="w-20 h-14 rounded-lg object-cover bg-white shrink-0 shadow-xs"
                  alt="Preview Sampul"
                />
                <div class="text-xs text-slate-500 overflow-hidden">
                  <p class="font-bold text-navy-900">Pratinjau Gambar Sampul</p>
                  <p class="truncate text-slate-400 font-mono text-[11px]">{{ form.image_url }}</p>
                </div>
              </div>
            </div>

            <!-- Ringkasan -->
            <div class="space-y-1">
              <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider ml-1">
                Ringkasan Berita
              </label>
              <textarea
                v-model="form.summary"
                rows="2"
                placeholder="Ringkasan singkat artikel yang tampil pada daftar kartu berita dan pencarian..."
                class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 outline-none transition-all text-sm resize-none"
              />
            </div>

            <!-- Isi Konten Berita -->
            <div class="space-y-1">
              <div class="flex justify-between items-center ml-1">
                <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider">
                  Isi Konten Berita <span class="text-rose-500">*</span> ({{ form.format.toUpperCase() }})
                </label>
                <span class="text-[11px] text-slate-400 font-mono">
                  Gunakan syntax {{ form.format === 'html' ? 'HTML (<p>, <h2>, <table>)' : 'Markdown (##, **, ```)' }}
                </span>
              </div>
              <textarea
                v-model="form.content"
                rows="12"
                required
                :placeholder="
                  form.format === 'html'
                    ? 'Tulis isi konten dalam tag HTML...'
                    : 'Tulis isi konten dalam format Markdown...'
                "
                class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 outline-none transition-all text-sm font-mono resize-y"
                @input="recalculateStats"
              />
            </div>

            <!-- Form Khusus: Sumber & Referensi Artikel (Citations) -->
            <div class="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-cyan-50/30 space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-sm shrink-0">
                    <span class="material-symbols-rounded text-base">menu_book</span>
                  </div>
                  <div>
                    <h4 class="text-xs font-extrabold uppercase tracking-wider text-navy-900 font-display">
                      Sumber &amp; Referensi Artikel (Citations)
                    </h4>
                    <p class="text-[11px] text-slate-500">
                      Daftar rujukan atau tautan literatur yang diletakkan pada section khusus di akhir artikel.
                    </p>
                  </div>
                </div>

                <!-- Alignment Selector -->
                <div class="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  <span class="text-[10px] uppercase font-mono font-bold text-slate-400 px-2 select-none">Perataan:</span>
                  <button
                    type="button"
                    :class="
                      form.sources_align === 'left'
                        ? 'bg-navy-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    "
                    class="px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    @click="form.sources_align = 'left'"
                  >
                    <span class="material-symbols-rounded text-sm">format_align_left</span>
                    <span>Rata Kiri (Default)</span>
                  </button>
                  <button
                    type="button"
                    :class="
                      form.sources_align === 'justify'
                        ? 'bg-navy-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    "
                    class="px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    @click="form.sources_align = 'justify'"
                  >
                    <span class="material-symbols-rounded text-sm">format_align_justify</span>
                    <span>Justify</span>
                  </button>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <label class="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider ml-1">
                    Daftar Teks Rujukan / Sitasi
                  </label>
                  <button
                    v-if="canExtractSourcesFromContent"
                    type="button"
                    class="text-[11px] text-cyan-700 hover:text-cyan-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    @click="extractSourcesFromCurrentContent"
                  >
                    <span class="material-symbols-rounded text-sm">auto_fix_high</span>
                    <span>Pindahkan Sumber dari Isi Berita ke Form Ini</span>
                  </button>
                </div>
                <textarea
                  v-model="form.sources"
                  rows="4"
                  :style="{ textAlign: form.sources_align }"
                  placeholder="1. Kemendikbudristek (2026). Panduan Transformasi Digital Sekolah.&#10;2. Dokumentasi Implementasi School Smart Digital."
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-cyan-500 outline-none transition-all text-xs font-mono resize-y"
                />
              </div>
            </div>
          </div>

          <!-- TAB 2: METADATA & SEO -->
          <div v-show="activeTab === 'seo'" class="space-y-5">
            <div class="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 text-xs text-navy-900 flex items-start gap-3">
              <span class="material-symbols-rounded text-lg text-cyan-600 mt-0.5 shrink-0">travel_explore</span>
              <div>
                <p class="font-bold font-display">Optimasi Mesin Pencari (Google &amp; Web Crawlers)</p>
                <p class="text-slate-600 mt-0.5">
                  Konfigurasi ini disuntikkan otomatis melalui Server-Side Rendering (SSR) agar langsung terbaca oleh Googlebot dan pratinjau media sosial.
                </p>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider ml-1">
                Meta Title (Tag Judul SEO)
              </label>
              <input
                v-model="form.meta_title"
                type="text"
                placeholder="Judul yang tampil di tab browser dan hasil pencarian Google"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 outline-none transition-all text-sm"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider ml-1">
                Meta Description
              </label>
              <textarea
                v-model="form.meta_description"
                rows="3"
                placeholder="Deskripsi ringkas yang tampil di cuplikan snippet Google (150-160 karakter)"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 outline-none transition-all text-sm resize-none"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider ml-1">
                  Kata Kunci Utama (Keywords)
                </label>
                <input
                  v-model="form.keywords"
                  type="text"
                  placeholder="aplikasi sekolah digital, presensi qr code, sistem spp"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 outline-none transition-all text-sm"
                />
              </div>
              <div class="space-y-1">
                <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider ml-1">
                  Tags (Pisahkan dengan koma)
                </label>
                <input
                  v-model="form.tags"
                  type="text"
                  placeholder="bimtek, smart gate, manajemen sekolah, ssd"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider ml-1">
                Canonical URL
              </label>
              <input
                v-model="form.canonical"
                type="url"
                placeholder="https://schoolsmartdigital.com/berita/slug-artikel"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 outline-none transition-all text-sm font-mono"
              />
            </div>

            <!-- Schema.org JSON-LD -->
            <div class="space-y-1.5 pt-3 border-t border-slate-100">
              <div class="flex justify-between items-center ml-1">
                <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider">
                  Schema.org JSON-LD (Data Terstruktur Google Rich Snippets)
                </label>
                <button
                  type="button"
                  class="text-[11px] text-cyan-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  @click="formatJsonSchema"
                >
                  <span class="material-symbols-rounded text-xs">auto_fix_high</span>
                  <span>Rapikan Format JSON</span>
                </button>
              </div>
              <textarea
                v-model="form.schema_json_text"
                rows="5"
                placeholder='{ "@context": "https://schema.org", "@type": "Article", ... }'
                class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-navy-950 text-emerald-400 focus:border-cyan-400 outline-none transition-all text-xs font-mono resize-y"
              />
            </div>

            <div class="pt-2 flex items-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  v-model="form.is_published"
                  type="checkbox"
                  class="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span class="font-bold text-navy-900 text-sm">Publikasikan Sekarang (Status Aktif)</span>
              </label>
            </div>
          </div>

          <!-- TAB 3: KUSTOM CSS & SKRIP JS -->
          <div v-show="activeTab === 'scripts'" class="space-y-6">
            <div class="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
              <span class="material-symbols-rounded text-lg text-navy-900 mt-0.5 shrink-0">code</span>
              <div>
                <p class="font-bold text-navy-900 font-display">Kustomisasi Kode Tambahan (CSS &amp; JavaScript Khusus Artikel)</p>
                <p class="text-slate-600 mt-0.5">
                  Opsional: Gunakan jika artikel memerlukan styling tabel/kotak khusus atau skrip interaktif. Kode diisolasi ke kontainer artikel pembaca.
                </p>
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between items-center ml-1">
                <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider">
                  1. Custom CSS (Styling Khusus Artikel)
                </label>
                <span class="text-[11px] text-cyan-700 font-mono font-semibold bg-cyan-50 px-2 py-0.5 rounded">
                  Diisolasi ke #article-content
                </span>
              </div>
              <textarea
                v-model="form.custom_css"
                rows="6"
                placeholder=".custom-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 1rem; }"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-navy-950 text-cyan-300 focus:border-cyan-400 outline-none transition-all text-xs font-mono resize-y"
              />
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between items-center ml-1">
                <label class="text-[11px] text-slate-600 uppercase font-mono font-bold tracking-wider">
                  2. Custom JavaScript Code (Widget Interaktif)
                </label>
                <span class="text-[11px] text-emerald-700 font-mono font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Dieksekusi saat halaman artikel dimuat
                </span>
              </div>
              <textarea
                v-model="form.custom_scripts_text"
                rows="6"
                placeholder="// Kode JavaScript interaktif untuk artikel ini"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-navy-950 text-amber-300 focus:border-cyan-400 outline-none transition-all text-xs font-mono resize-y"
              />
            </div>
          </div>

          <!-- TAB 4: LIVE PREVIEW -->
          <div v-show="activeTab === 'preview'" class="space-y-5">
            <div class="p-4 rounded-2xl bg-slate-100 flex justify-between items-center text-xs">
              <span class="font-bold text-navy-900 font-display">Simulasi Tampilan Pembaca:</span>
              <span class="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 font-mono font-bold uppercase">
                Mode: {{ form.format }}
              </span>
            </div>

            <div class="p-6 rounded-2xl border border-slate-200 bg-white max-h-[60vh] overflow-y-auto">
              <div class="border-b border-slate-100 pb-4 mb-6">
                <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800">
                  {{ form.category }}
                </span>
                <h1 class="text-2xl md:text-3xl font-extrabold text-navy-900 mt-3 mb-2 leading-tight font-display">
                  {{ form.title || 'Judul Artikel' }}
                </h1>
                <div class="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>Oleh <strong>{{ form.author_name || 'Tim SSD' }}</strong></span>
                  <span>•</span>
                  <span>{{ form.read_time_minutes }} menit baca</span>
                  <span>•</span>
                  <span class="text-cyan-600">/berita/{{ form.slug }}</span>
                </div>
              </div>

              <div v-if="form.image_url" class="mb-6">
                <img :src="form.image_url" class="w-full h-64 object-cover rounded-xl shadow-sm" alt="Sampul" />
              </div>

              <div
                v-if="form.format === 'markdown'"
                class="prose prose-slate max-w-none text-slate-800"
                v-html="renderedMarkdownContent"
              />
              <div
                v-else
                class="prose prose-slate max-w-none text-slate-800"
                v-html="renderedHtmlContent"
              />

              <div v-if="form.sources" class="mt-8 pt-6 border-t border-slate-200">
                <div class="flex items-center gap-2 mb-3">
                  <span class="material-symbols-rounded text-base text-cyan-600">menu_book</span>
                  <h3 class="text-sm font-bold text-navy-900 uppercase tracking-wider font-display">
                    Sumber dan Referensi
                  </h3>
                </div>
                <div
                  class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200"
                  :style="{ textAlign: form.sources_align }"
                  v-html="renderedPreviewSources"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="px-6 py-4 md:px-8 md:py-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/90 shrink-0">
          <div class="text-xs text-slate-500 flex flex-wrap items-center gap-3 font-mono">
            <span>Format: <b class="uppercase text-navy-900">{{ form.format }}</b></span>
            <span class="text-slate-300">•</span>
            <span>
              Status:
              <b :class="form.is_published ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'">
                {{ form.is_published ? 'Dipublikasikan (Aktif)' : 'Draft (Nonaktif)' }}
              </b>
            </span>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              class="px-5 py-2.5 text-slate-600 font-bold text-xs sm:text-sm hover:text-navy-900 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
              @click="close"
            >
              Batal
            </button>
            <button
              type="button"
              :disabled="saving"
              class="px-7 py-2.5 bg-navy-900 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-navy-800 transition shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              @click="handleSubmit"
            >
              <span v-if="saving" class="material-symbols-rounded text-sm animate-spin">refresh</span>
              <span>{{ saving ? 'Menyimpan...' : isEdit ? 'Update Berita' : 'Simpan & Publikasikan' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Inline Modal: Tambah Kategori Baru -->
      <div
        v-if="showAddCategoryModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs"
        @click.self="closeAddCategoryDialog"
      >
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 class="font-bold text-navy-900 text-sm font-display">Tambah Kategori Artikel Baru</h3>
            <button
              type="button"
              class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              @click="closeAddCategoryDialog"
            >
              ✕
            </button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div v-if="addCategoryError" class="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs">
              {{ addCategoryError }}
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">
                Nama Kategori <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="newCategoryForm.name"
                type="text"
                placeholder="Contoh: Kurikulum Merdeka, prestasi Siswa"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-cyan-500 outline-none text-xs font-semibold"
                @keyup.enter="handleSaveNewCategory"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">
                Warna Aksen Badge
              </label>
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  v-for="preset in categoryColorPresets"
                  :key="preset.value"
                  type="button"
                  class="w-7 h-7 rounded-full transition-transform flex items-center justify-center shadow-xs cursor-pointer"
                  :style="{ backgroundColor: preset.value }"
                  :class="
                    newCategoryForm.color === preset.value
                      ? 'ring-2 ring-offset-2 ring-navy-900 scale-110'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  "
                  :title="preset.label"
                  @click="newCategoryForm.color = preset.value"
                />
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-200/60 transition text-xs cursor-pointer"
              @click="closeAddCategoryDialog"
            >
              Batal
            </button>
            <button
              type="button"
              class="px-5 py-2 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition text-xs cursor-pointer"
              @click="handleSaveNewCategory"
            >
              Simpan Kategori
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>


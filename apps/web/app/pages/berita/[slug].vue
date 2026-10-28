<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  renderMarkdown,
  cleanHtmlContent,
  cleanMarkdownContent,
  extractSourcesFromHtml,
  extractSourcesFromMarkdown,
  ICON_COPY_SVG,
  ICON_CHECK_SVG,
} from '~/utils/markdown'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, error } = await useFetch(`/api/news/${slug.value}`)
const article = computed<any>(() => data.value?.article)

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel Tidak Ditemukan' })
}

useSeoMeta({
  title: () => `${article.value?.title || 'Berita'} || School Smart Digital ||`,
  description: () => article.value?.summary || 'Warta dan informasi ekosistem School Smart Digital.',
  ogTitle: () => `${article.value?.title || 'Berita'} || School Smart Digital ||`,
  ogDescription: () => article.value?.summary || 'Warta dan informasi ekosistem School Smart Digital.',
  ogImage: () => article.value?.coverImageUrl || '/og-image.png',
  twitterCard: 'summary_large_image',
})

const scrollProgress = ref(0)
const linkCopied = ref(false)

const isHtmlFormat = computed(() => {
  if (article.value?.meta?.format) return article.value.meta.format === 'html'
  return article.value?.content?.trim()?.startsWith('<') || false
})

const categoryName = computed(() => {
  if (article.value?.category) return String(article.value.category)
  const meta = article.value?.meta || {}
  if (meta.category_name) return String(meta.category_name)
  if (Array.isArray(meta.category) && meta.category.length) return String(meta.category[0])
  return 'Berita'
})

const authorName = computed(() => {
  return article.value?.author || article.value?.meta?.author_name || 'Tim SSD'
})

const readTimeMinutes = computed(() => {
  if (article.value?.meta?.read_time_minutes) return Number(article.value.meta.read_time_minutes)
  const words = String(article.value?.content || '')
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
})

const articleTags = computed<string[]>(() => {
  const raw = article.value?.meta?.tags
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string' && raw.trim()) {
    return raw
      .split(/[,·|]/)
      .map((t) => t.trim())
      .filter(Boolean)
  }
  return []
})

const displayHtmlContent = computed(() => {
  if (!article.value?.content) return ''
  return cleanHtmlContent(article.value.content, false)
})

const renderedMarkdown = computed(() => {
  if (isHtmlFormat.value || !article.value?.content) return ''
  const cleanMd = cleanMarkdownContent(article.value.content, false)
  return renderMarkdown(cleanMd)
})

const articleSources = computed(() => {
  if (article.value?.meta?.sources) {
    return article.value.meta.sources
  }
  if (article.value?.content) {
    if (isHtmlFormat.value) {
      return extractSourcesFromHtml(article.value.content).sources
    }
    return extractSourcesFromMarkdown(article.value.content).sources
  }
  return ''
})

const sourcesAlign = computed(() => {
  return article.value?.meta?.sources_align || 'left'
})

const renderedSources = computed(() => {
  if (!articleSources.value) return ''
  if (isHtmlFormat.value || articleSources.value.trim().startsWith('<')) {
    return articleSources.value
  }
  return renderMarkdown(articleSources.value)
})

const metaTitle = computed(
  () =>
    article.value?.meta?.meta_title ||
    `${article.value?.title} - School Smart Digital`
)
const metaDescription = computed(
  () => article.value?.meta?.meta_description || article.value?.summary || article.value?.title
)

useSeoMeta({
  title: () => metaTitle.value,
  description: () => metaDescription.value,
  keywords: () => article.value?.meta?.keywords || '',
  ogTitle: () => metaTitle.value,
  ogDescription: () => metaDescription.value,
  ogImage: () => article.value?.coverImageUrl || '',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => metaTitle.value,
  twitterDescription: () => metaDescription.value,
  twitterImage: () => article.value?.coverImageUrl || '',
})

useHead(() => {
  const headConfig: Record<string, any> = {
    link: [],
    style: [],
    script: [],
  }

  if (article.value?.meta?.canonical) {
    headConfig.link.push({ rel: 'canonical', href: article.value.meta.canonical })
  }

  if (article.value?.meta?.custom_css) {
    headConfig.style.push({
      id: `article-style-${article.value.id}`,
      children: article.value.meta.custom_css,
    })
  }

  if (article.value?.meta?.schema_json) {
    headConfig.script.push({
      type: 'application/ld+json',
      children: JSON.stringify(article.value.meta.schema_json),
    })
  }

  return headConfig
})

function onScroll() {
  if (typeof window === 'undefined') return
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value =
    docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0
}

function handleArticleClick(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  const copyBtn = target?.closest('.copy-code-btn') as HTMLElement | null
  if (copyBtn) {
    const rawCode = decodeURIComponent(copyBtn.dataset.code || '')
    if (rawCode && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(rawCode).then(() => {
        const label = copyBtn.querySelector('.copy-label')
        const icon = copyBtn.querySelector('.copy-icon')
        if (label) label.textContent = 'Disalin!'
        if (icon) icon.innerHTML = ICON_CHECK_SVG
        setTimeout(() => {
          if (label) label.textContent = 'Salin'
          if (icon) icon.innerHTML = ICON_COPY_SVG
        }, 2000)
      })
    }
  }
}

function shareWhatsApp() {
  if (typeof window === 'undefined') return
  const text = encodeURIComponent(`${article.value?.title}\n\nBaca selengkapnya di: ${window.location.href}`)
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
}

function shareLinkedIn() {
  if (typeof window === 'undefined') return
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    '_blank'
  )
}

function shareTwitter() {
  if (typeof window === 'undefined') return
  const text = encodeURIComponent(article.value?.title || '')
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`,
    '_blank'
  )
}

function copyArticleLink() {
  if (typeof window === 'undefined' || !navigator.clipboard) return
  navigator.clipboard.writeText(window.location.href).then(() => {
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  if (article.value?.meta?.custom_scripts && Array.isArray(article.value.meta.custom_scripts)) {
    article.value.meta.custom_scripts.forEach((sc: any) => {
      if (sc.src) {
        const s = document.createElement('script')
        s.src = sc.src
        if (sc.type) s.type = sc.type
        document.body.appendChild(s)
      } else if (sc.content) {
        try {
          const fn = new Function(sc.content)
          fn()
        } catch (err) {
          console.warn('Gagal menjalankan skrip kustom artikel:', err)
        }
      }
    })
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <!-- Top Fixed Reading Progress Bar -->
    <div class="fixed top-0 left-0 right-0 z-[70] h-1 bg-slate-200/70 overflow-hidden pointer-events-none">
      <div
        class="h-full bg-gradient-to-r from-navy-900 via-cyan-500 to-cyan-400 transition-all duration-150 ease-out"
        :style="{ width: `${scrollProgress}%` }"
      />
    </div>

    <SiteHeader mode="subpage" />

    <main class="pt-28 pb-20">
      <article v-if="article" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
        <!-- Breadcrumb -->
        <nav class="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-200 text-xs font-mono text-slate-500" aria-label="Breadcrumb">
          <div class="flex items-center gap-2 flex-wrap">
            <NuxtLink to="/" class="hover:text-cyan-600 transition-colors">Beranda</NuxtLink>
            <span>/</span>
            <NuxtLink to="/berita" class="hover:text-cyan-600 transition-colors">Berita</NuxtLink>
            <span>/</span>
            <span class="text-navy-900 font-semibold truncate max-w-xs">{{ article.title }}</span>
          </div>

          <NuxtLink
            to="/berita"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-cyan-500 text-navy-900 text-xs font-semibold transition"
          >
            <span class="material-symbols-rounded text-sm">arrow_back</span>
            <span>Kembali ke Berita</span>
          </NuxtLink>
        </nav>

        <!-- Category, Read Time & Date Header -->
        <div class="flex flex-wrap items-center gap-3 text-xs font-mono text-cyan-800 mb-4">
          <span class="px-3 py-1 rounded-full bg-cyan-100 font-bold uppercase tracking-wider">
            {{ categoryName }}
          </span>
          <span class="text-slate-300">•</span>
          <span class="inline-flex items-center gap-1 text-slate-600">
            <span class="material-symbols-rounded text-sm text-cyan-600">schedule</span>
            <span>{{ readTimeMinutes }} Menit Baca</span>
          </span>
          <span class="text-slate-300">•</span>
          <span class="text-slate-600">
            {{
              new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            }}
          </span>
          <span class="text-slate-300">•</span>
          <span class="text-slate-700 font-semibold">Oleh {{ authorName }}</span>
        </div>

        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight leading-snug mb-6 font-display">
          {{ article.title }}
        </h1>

        <p
          v-if="article.summary"
          class="text-base sm:text-lg text-slate-600 font-body leading-relaxed mb-8 border-l-4 border-cyan-500 pl-4 py-2 italic bg-cyan-50/50 rounded-r-xl"
        >
          {{ article.summary }}
        </p>

        <!-- Cover Image -->
        <div
          v-if="article.coverImageUrl"
          class="rounded-2xl overflow-hidden aspect-video mb-10 shadow-lg border border-slate-200 bg-slate-100"
        >
          <img
            :src="article.coverImageUrl"
            :alt="article.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Dual-Engine Article Content (HTML or Markdown) -->
        <div class="w-full" @click="handleArticleClick">
          <div
            v-if="!isHtmlFormat"
            id="article-content"
            class="ssd-article-body prose prose-slate max-w-none font-body leading-relaxed text-slate-700 text-base"
            v-html="renderedMarkdown"
          />
          <div
            v-else
            id="article-content"
            class="ssd-article-body prose prose-slate max-w-none font-body leading-relaxed text-slate-700 text-base"
            v-html="displayHtmlContent"
          />
        </div>

        <!-- Sumber dan Referensi Section (Adopsi DTP) -->
        <section
          v-if="articleSources"
          id="article-sources"
          class="mt-12 pt-8 border-t border-slate-200"
        >
          <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div class="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
              <div class="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
                <span class="material-symbols-rounded text-lg">menu_book</span>
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-bold text-navy-900 font-display">
                  Sumber dan Referensi
                </h2>
                <p class="text-xs text-slate-500">
                  Rujukan literatur, dokumentasi resmi, dan sitasi yang digunakan dalam artikel ini.
                </p>
              </div>
            </div>

            <div
              class="ssd-article-sources text-sm text-slate-700 leading-relaxed font-body"
              :style="{ textAlign: sourcesAlign }"
              v-html="renderedSources"
            />
          </div>
        </section>

        <!-- Tags Section -->
        <div
          v-if="articleTags.length > 0"
          class="pt-6 mt-8 border-t border-slate-200 flex flex-wrap items-center gap-2"
        >
          <span class="text-xs text-slate-500 font-mono mr-1 inline-flex items-center gap-1">
            <span class="material-symbols-rounded text-sm text-cyan-600">sell</span>
            <span>Tag:</span>
          </span>
          <span
            v-for="tag in articleTags"
            :key="tag"
            class="px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-navy-900"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Share Bar -->
        <div class="mt-10 p-6 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <p class="font-bold text-navy-900 text-base font-display">Bagikan Artikel Ini</p>
            <p class="text-slate-500 text-xs mt-0.5">
              Teruskan wawasan pendidikan digital ini kepada rekan guru, kepala sekolah, dan pengurus yayasan.
            </p>
          </div>
          <div class="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              class="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 text-navy-900 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Bagikan ke WhatsApp"
              @click="shareWhatsApp"
            >
              <WhatsAppIcon class="w-4 h-4 text-cyan-600" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              class="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-navy-900 text-xs font-semibold transition cursor-pointer"
              title="Bagikan ke LinkedIn"
              @click="shareLinkedIn"
            >
              LinkedIn
            </button>

            <button
              type="button"
              class="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-navy-900 text-xs font-semibold transition cursor-pointer"
              title="Bagikan ke X"
              @click="shareTwitter"
            >
              X / Twitter
            </button>

            <button
              type="button"
              class="px-3.5 py-2 rounded-xl border border-slate-200 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              @click="copyArticleLink"
            >
              <span class="material-symbols-rounded text-sm text-cyan-400">
                {{ linkCopied ? 'check' : 'link' }}
              </span>
              <span>{{ linkCopied ? 'Tersalin!' : 'Salin Tautan' }}</span>
            </button>
          </div>
        </div>

        <!-- Article Footer CTA -->
        <div class="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NuxtLink
            to="/berita"
            class="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-cyan-600 transition-colors"
          >
            <span class="material-symbols-rounded text-base">arrow_back</span>
            <span>Kembali ke Semua Berita</span>
          </NuxtLink>

          <NuxtLink
            to="/#demo"
            class="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-md transition-all"
          >
            Jadwalkan Konsultasi Sekolah
          </NuxtLink>
        </div>
      </article>
    </main>

    <SiteFooter />
  </div>
</template>

<style>
.ssd-article-body p {
  margin-bottom: 1.25em;
  line-height: 1.85;
}

.ssd-article-body h2 {
  color: #0a2036;
  font-weight: 800;
  font-size: 1.5rem;
  margin-top: 2em;
  margin-bottom: 0.75em;
}

.ssd-article-body h3 {
  color: #0c3161;
  font-weight: 700;
  font-size: 1.25rem;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
}

.ssd-article-body ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-bottom: 1.25em;
}

.ssd-article-body ol {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin-bottom: 1.25em;
}

.ssd-article-sources ol,
.ssd-article-sources ul {
  list-style-position: inside;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ssd-article-sources a {
  color: #01a8cf;
  text-decoration: underline;
  word-break: break-all;
}
</style>

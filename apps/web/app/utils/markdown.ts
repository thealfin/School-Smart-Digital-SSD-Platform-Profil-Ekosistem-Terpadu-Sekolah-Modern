import { marked } from 'marked'
import hljs from 'highlight.js'

// Slugify function for headings, slugs, and anchor navigation
export function slugifyText(text: string): string {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// Icons for copy code button
export const ICON_COPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" class="copy-svg shrink-0" aria-hidden="true"><path d="M9 18q-.825 0-1.412-.587Q7 16.825 7 16V4q0-.825.588-1.413Q8.175 2 9 2h9q.825 0 1.413.587Q20 3.175 20 4v12q0 .825-.587 1.413Q18.825 18 18 18Zm0-2h9V4H9v12Zm-4 6q-.825 0-1.412-.587Q3 20.825 3 20V6h2v14h11v2H5Zm4-6V4v12Z"/></svg>`

export const ICON_CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" class="check-svg shrink-0 text-emerald-400" aria-hidden="true"><path d="m9.55 15.15 8.475-8.475q.3-.3.7-.3t.7.3q.3.3.3.713 0 .412-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 12.3q-.3-.3-.288-.712.013-.413.313-.713.3-.3.713-.3t.712.3Z"/></svg>`

const renderer = {
  heading({ tokens, depth }: { tokens: any[]; depth: number }) {
    // @ts-ignore
    const text = this.parser.parseInline(tokens)
    const id = slugifyText(text)
    return `<h${depth} id="${id}" class="article-h${depth} group relative flex items-center">${text}<a href="#${id}" class="anchor-link opacity-0 group-hover:opacity-60 transition-opacity ml-2 text-cyan-600 hover:text-cyan-700 font-normal text-sm" aria-label="Link to section">#</a></h${depth}>\n`
  },

  code({ text, lang }: { text: string; lang?: string }) {
    const language = (lang || '').trim().toLowerCase()
    const validLang = language && hljs.getLanguage(language) ? language : ''

    let highlighted: string
    if (validLang) {
      try {
        highlighted = hljs.highlight(text, { language: validLang }).value
      } catch {
        highlighted = hljs.highlightAuto(text).value
      }
    } else {
      try {
        highlighted = hljs.highlightAuto(text).value
      } catch {
        highlighted = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
      }
    }

    const displayLang = (validLang || language || 'CODE').toUpperCase()
    const encoded = encodeURIComponent(text)

    return `
<div class="code-block-wrapper my-6 rounded-2xl overflow-hidden border border-slate-200 bg-[#0a2036] text-[#e2e8f0] font-mono text-[13px] shadow-lg">
  <div class="code-block-header flex items-center justify-between px-4 py-2.5 bg-[#0c3161] border-b border-white/10 select-none">
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block"></span>
      </div>
      <span class="ml-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-white/10 text-cyan-300">${displayLang}</span>
    </div>
    <button type="button" class="copy-code-btn flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-sans font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer active:scale-95" data-code="${encoded}">
      <span class="copy-icon flex items-center justify-center">${ICON_COPY_SVG}</span>
      <span class="copy-label">Salin</span>
    </button>
  </div>
  <div class="code-block-body p-4 overflow-x-auto text-[13px] leading-relaxed custom-scrollbar">
    <pre class="m-0 p-0 bg-transparent"><code class="hljs ${validLang ? 'language-' + validLang : ''}">${highlighted}</code></pre>
  </div>
</div>\n`
  },

  table(token: any) {
    let headerHtml = '<tr>'
    if (typeof token.header === 'string') {
      headerHtml = token.header
    } else if (Array.isArray(token.header)) {
      for (const cell of token.header) {
        // @ts-ignore
        const cellContent =
          typeof cell === 'string'
            ? cell
            : cell.tokens
              ? // @ts-ignore
                this.parser.parseInline(cell.tokens)
              : cell.text || ''
        const alignAttr = cell.align ? ` style="text-align: ${cell.align}"` : ''
        headerHtml += `<th${alignAttr} class="px-4 py-3 font-bold text-left border-b border-slate-200">${cellContent}</th>`
      }
      headerHtml += '</tr>'
    }

    let bodyHtml = ''
    if (typeof token.rows === 'string') {
      bodyHtml = token.rows
    } else if (Array.isArray(token.rows)) {
      for (const row of token.rows) {
        if (typeof row === 'string') {
          bodyHtml += row
        } else if (Array.isArray(row)) {
          bodyHtml += '<tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">'
          for (const cell of row) {
            // @ts-ignore
            const cellContent =
              typeof cell === 'string'
                ? cell
                : cell.tokens
                  ? // @ts-ignore
                    this.parser.parseInline(cell.tokens)
                  : cell.text || ''
            const alignAttr = cell.align ? ` style="text-align: ${cell.align}"` : ''
            bodyHtml += `<td${alignAttr} class="px-4 py-3">${cellContent}</td>`
          }
          bodyHtml += '</tr>'
        }
      }
    }

    return `
<div class="table-responsive-wrapper my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
  <table class="article-table w-full text-left text-sm border-collapse">
    <thead class="bg-slate-50 text-xs uppercase font-bold tracking-wider text-navy-900">${headerHtml}</thead>
    <tbody>${bodyHtml}</tbody>
  </table>
</div>\n`
  },

  blockquote({ tokens }: { tokens: any[] }) {
    // @ts-ignore
    const quote = this.parser.parse(tokens)
    return `<blockquote class="article-blockquote my-6 pl-5 pr-4 py-3.5 border-l-4 border-cyan-500 bg-cyan-50/50 rounded-r-2xl italic text-slate-700">${quote}</blockquote>\n`
  },

  link({ href, title, tokens }: { href: string; title?: string | null; tokens: any[] }) {
    // @ts-ignore
    const text = this.parser.parseInline(tokens)
    const titleAttr = title ? ` title="${title}"` : ''
    const isExternal = href.startsWith('http://') || href.startsWith('https://')
    const targetRel = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${href}" class="article-link text-cyan-600 hover:text-cyan-700 font-semibold underline underline-offset-4 transition-colors"${titleAttr}${targetRel}>${text}</a>`
  },

  hr() {
    return `<hr class="article-hr my-8 border-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />\n`
  },
}

marked.use({
  gfm: true,
  breaks: true,
  renderer,
})

/**
 * Parse markdown text into editorial HTML
 */
export function renderMarkdown(content: string): string {
  if (!content) return ''
  try {
    return marked.parse(content) as string
  } catch (err) {
    console.error('Error rendering markdown:', err)
    return content.replace(/\n/g, '<br>')
  }
}

/**
 * Extract Table of Contents items (H2 and H3) from Markdown text or HTML text
 */
export function extractTableOfContents(
  content: string,
  isHtml = false
): Array<{ id: string; text: string; depth: number }> {
  if (!content) return []
  const toc: Array<{ id: string; text: string; depth: number }> = []

  if (isHtml) {
    const hRegex = /<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi
    let match: RegExpExecArray | null
    while ((match = hRegex.exec(content)) !== null) {
      const depth = parseInt(match[1], 10)
      const attrs = match[2]
      const idMatch = attrs.match(/id=["']([^"']+)["']/i)
      const rawText = match[3].replace(/<[^>]*>/g, '').trim()
      const id = idMatch ? idMatch[1] : slugifyText(rawText)
      if (rawText) {
        toc.push({ id, text: rawText, depth })
      }
    }
    return toc
  }

  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length
    const rawText = match[2].trim()
    const cleanText = rawText.replace(/\*\*|__|\*|_|`|\[.*?\]\(.*?\)/g, '').trim()
    const id = slugifyText(cleanText)
    toc.push({ id, text: cleanText, depth })
  }

  return toc
}

/**
 * Ekstrak Sumber dan Referensi dari dokumen HTML
 */
export function extractSourcesFromHtml(html: string): { body: string; sources: string } {
  if (!html) return { body: '', sources: '' }
  const m =
    html.match(
      /<h2[^>]*id=["']sumber["'][^>]*>[\s\S]*?<\/h2>([\s\S]*?)(?=<div\s+class=["']cta|<div\s+class=["']tags|<\/article>|$)/i
    ) ||
    html.match(
      /<h2>\s*Sumber\s+dan\s+Referensi\s*<\/h2>([\s\S]*?)(?=<div\s+class=["']cta|<div\s+class=["']tags|<\/article>|$)/i
    )
  if (!m) return { body: html, sources: '' }
  const sources = m[1].trim()
  const body = html
    .replace(
      /<h2[^>]*id=["']sumber["'][^>]*>[\s\S]*?<\/h2>[\s\S]*?(?=<div\s+class=["']cta|<div\s+class=["']tags|<\/article>|$)/i,
      ''
    )
    .replace(
      /<h2>\s*Sumber\s+dan\s+Referensi\s*<\/h2>[\s\S]*?(?=<div\s+class=["']cta|<div\s+class=["']tags|<\/article>|$)/i,
      ''
    )
    .trim()
  return { body, sources }
}

/**
 * Ekstrak Sumber dan Referensi dari dokumen Markdown
 */
export function extractSourcesFromMarkdown(md: string): { body: string; sources: string } {
  if (!md) return { body: '', sources: '' }
  const m = md.match(/##\s+Sumber\s+dan\s+Referensi\s*\n+([\s\S]*?)(?=\n##|\n---\s*$|$)/i)
  if (!m) return { body: md, sources: '' }
  const sources = m[1].trim()
  const body = md
    .replace(/##\s+Sumber\s+dan\s+Referensi\s*\n+[\s\S]*?(?=\n##|\n---\s*$|$)/i, '')
    .trim()
  return { body, sources }
}

/**
 * Membersihkan metadata atas dan section sumber dari dokumen HTML
 */
export function cleanHtmlContent(html: string, keepSources = false): string {
  if (!html) return ''
  let c = html

  const artMatch = c.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  if (artMatch) c = artMatch[1]

  c = c
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<div\s+class=["']crumb["'][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<span\s+class=["']cat["'][^>]*>[\s\S]*?<\/span>/gi, '')
    .replace(/<div\s+class=["']byline["'][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>/i, '')
    .replace(/<div\s+class=["']seo["'][\s\S]*?<\/div>\s*<\/div>/gi, '')
    .replace(/<div\s+class=["']seo["'][\s\S]*?(?=<div\s+class=["']hero|<p\s+class=["']hook|<p>|<h[2-6]>)/gi, '')
    .replace(/<div\s+class=["']hero["'][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div>\s*<b>(?:Judul\s*SEO|Slug|Meta\s*description|Kata\s*kunci|Tag)[\s\S]*?<\/div>/gi, '')
    .replace(/<p>\s*<strong>(?:Judul\s*SEO|Slug|Meta\s*description|Kata\s*kunci|Tag)[\s\S]*?<\/p>/gi, '')

  if (!keepSources) {
    c = c
      .replace(
        /<h2[^>]*id=["']sumber["'][^>]*>[\s\S]*?<\/h2>[\s\S]*?(?=<div\s+class=["']cta|<div\s+class=["']tags|<\/article>|$)/i,
        ''
      )
      .replace(
        /<h2>\s*Sumber\s+dan\s+Referensi\s*<\/h2>[\s\S]*?(?=<div\s+class=["']cta|<div\s+class=["']tags|<\/article>|$)/i,
        ''
      )
  }

  return c.trim()
}

/**
 * Membersihkan metadata atas dan section sumber dari dokumen Markdown
 */
export function cleanMarkdownContent(md: string, keepSources = false): string {
  if (!md) return ''
  let c = md

  c = c
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/^\[Beranda\][^\n]*\n+/im, '')
    .replace(/^#\s+[^\n]+\n+/m, '')
    .replace(/^Oleh\s+\*\*[^*]+\*\*.*?\n+/im, '')
    .replace(/^\*\*Judul\s*SEO[^*]*\*\*.*?\n+/gim, '')
    .replace(/^\*\*Slug[^*]*\*\*.*?\n+/gim, '')
    .replace(/^\*\*Meta\s*description[^*]*\*\*.*?\n+/gim, '')
    .replace(/^\*\*Kata\s*kunci[^*]*\*\*.*?\n+/gim, '')
    .replace(/^\*\*Tag[^*]*\*\*.*?\n+/gim, '')
    .replace(/^Ilustrasi\s+sampul:.*?\n+/gim, '')

  if (!keepSources) {
    c = c.replace(/##\s+Sumber\s+dan\s+Referensi\s*\n+[\s\S]*?(?=\n##|\n---\s*$|$)/i, '')
  }

  return c.trim()
}

/**
 * Pembersih konten universal berdasarkan format (HTML / Markdown)
 */
export function cleanArticleContent(content: string, isHtml = false, keepSources = false): string {
  if (!content) return ''
  return isHtml ? cleanHtmlContent(content, keepSources) : cleanMarkdownContent(content, keepSources)
}


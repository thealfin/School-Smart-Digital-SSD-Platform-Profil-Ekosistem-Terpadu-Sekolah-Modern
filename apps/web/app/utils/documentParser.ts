import TurndownService from 'turndown'
import mammoth from 'mammoth'
import {
  slugifyText,
  cleanHtmlContent,
  cleanMarkdownContent,
  extractSourcesFromHtml,
  extractSourcesFromMarkdown,
} from './markdown'

export interface ParsedDocument {
  title: string
  slug: string
  summary: string
  category: string[]
  tags: string[]
  author: string
  read_time_minutes: number
  format: 'html' | 'markdown'
  content: string
  sources: string
  sources_align: 'left' | 'justify'
  image_url: string
  canonical: string
  meta_title: string
  meta_description: string
  keywords: string
  custom_css: string
  custom_scripts: Array<{
    id?: string
    type?: string
    src?: string
    content?: string
  }>
  schema_json: Record<string, any> | null
}

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
  bulletListMarker: '-',
})

turndownService.addRule('table', {
  filter: 'table',
  replacement: function (_content, node: any) {
    const rows = Array.from(node.querySelectorAll('tr')) as HTMLElement[]
    if (!rows.length) return ''

    let md = '\n\n'
    const headerRow = rows[0]
    const headerCells = Array.from(headerRow.querySelectorAll('th,td')).map(
      (c) => c.textContent?.trim().replace(/\|/g, '\\|') || ''
    )
    md += '| ' + headerCells.join(' | ') + ' |\n'
    md += '| ' + headerCells.map(() => '---').join(' | ') + ' |\n'

    for (let i = 1; i < rows.length; i++) {
      const cells = Array.from(rows[i].querySelectorAll('td,th')).map(
        (c) => c.textContent?.trim().replace(/\|/g, '\\|') || ''
      )
      md += '| ' + cells.join(' | ') + ' |\n'
    }
    return md + '\n\n'
  },
})

function extractFromHtml(htmlText: string, defaultTitle: string): ParsedDocument {
  let title = ''
  let slug = ''
  let summary = ''
  const categories: string[] = []
  const tags: string[] = []
  let author = 'Tim SSD'
  let canonical = ''
  let meta_title = ''
  let meta_description = ''
  let keywords = ''
  let image_url = ''
  let custom_css = ''
  const custom_scripts: Array<{ id?: string; type?: string; src?: string; content?: string }> = []
  let schema_json: Record<string, any> | null = null
  let bodyContent = htmlText

  if (typeof window !== 'undefined' && window.DOMParser) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlText, 'text/html')

    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content')
    const tagTitle = doc.querySelector('title')?.textContent
    const h1 = doc.querySelector('h1')?.textContent
    title = (ogTitle || tagTitle || h1 || defaultTitle).trim()
    meta_title = tagTitle?.trim() || title

    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content')
    const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content')
    const hookEl = doc.querySelector('.hook')?.textContent
    const firstP = doc.querySelector('article p, main p, body p')?.textContent
    summary = (metaDesc || ogDesc || hookEl || firstP || '').trim()
    meta_description = metaDesc?.trim() || summary

    canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
    if (canonical) {
      const parts = canonical.split('/').filter(Boolean)
      slug = parts[parts.length - 1] || ''
    }

    const seoSlugEl = doc.querySelector('.seo b')
    if (seoSlugEl) {
      doc.querySelectorAll('.seo div').forEach((div) => {
        const text = div.textContent || ''
        if (text.includes('Slug') || text.includes('permalink')) {
          const s = text
            .replace(/Slug(?:\s*[\/]\s*permalink)?/i, '')
            .replace(/[:]/, '')
            .trim()
          if (s) slug = s
        }
        if (text.includes('Kata kunci utama')) {
          const k = text
            .replace(/Kata\s*kunci\s*utama/i, '')
            .replace(/[:]/, '')
            .trim()
          if (k) keywords = k
        }
        if (text.includes('Tag')) {
          const rawTags = text
            .replace(/Tag/i, '')
            .replace(/[:]/, '')
            .trim()
          rawTags.split(/[,·|]/).forEach((t) => {
            const clean = t.trim()
            if (clean && !tags.includes(clean)) tags.push(clean)
          })
        }
      })
    }

    if (!slug) {
      slug = slugifyText(title)
    }

    const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content')
    if (metaKeywords) {
      keywords = metaKeywords.trim()
      metaKeywords.split(/[,·|]/).forEach((t) => {
        const clean = t.trim()
        if (clean && !tags.includes(clean)) tags.push(clean)
      })
    }

    const catEl = doc.querySelector('.cat')
    if (catEl?.textContent?.trim()) {
      categories.push(catEl.textContent.trim())
    }
    const crumbLinks = doc.querySelectorAll('.crumb a')
    if (crumbLinks.length > 0) {
      const lastCrumb = doc.querySelector('.crumb')?.textContent?.split('›').pop()?.trim()
      if (lastCrumb && !categories.includes(lastCrumb)) categories.push(lastCrumb)
    }

    const bylineEl = doc.querySelector('.byline')
    if (bylineEl) {
      const authorStrong = bylineEl.querySelector('strong')?.textContent
      if (authorStrong) author = authorStrong.trim()
    }

    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')
    const firstImg = doc.querySelector('article img, main img, body img')?.getAttribute('src')
    image_url = ogImage || firstImg || ''

    const styleTags = doc.querySelectorAll('style')
    const stylesArray: string[] = []
    styleTags.forEach((st) => {
      if (st.textContent?.trim()) stylesArray.push(st.textContent.trim())
    })
    custom_css = stylesArray.join('\n\n')

    const scriptTags = doc.querySelectorAll('script')
    scriptTags.forEach((sc) => {
      const type = sc.getAttribute('type') || ''
      if (type === 'application/ld+json') {
        try {
          schema_json = JSON.parse(sc.textContent || '{}')
          if (schema_json?.author?.name && (!author || author === 'Tim SSD')) {
            author = schema_json.author.name
          }
        } catch (e) {
          console.warn('Gagal parse Schema JSON-LD:', e)
        }
      } else {
        const src = sc.getAttribute('src') || ''
        const content = sc.textContent?.trim() || ''
        if (src || content) {
          custom_scripts.push({
            id: sc.getAttribute('id') || undefined,
            type: type || 'text/javascript',
            src: src || undefined,
            content: content || undefined,
          })
        }
      }
    })

    const articleEl = doc.querySelector('article') || doc.querySelector('.wrap') || doc.body
    if (articleEl) {
      articleEl.querySelectorAll('style, script, .crumb, .cat, .byline, .seo, .hero').forEach((el) => el.remove())
      const firstH1 = articleEl.querySelector('h1')
      if (firstH1) firstH1.remove()
      bodyContent = cleanHtmlContent(articleEl.innerHTML.trim(), false)
    }
  } else {
    bodyContent = cleanHtmlContent(bodyContent, false)
  }

  let sources = ''
  const sources_align: 'left' | 'justify' = 'left'
  const srcExt = extractSourcesFromHtml(htmlText)
  if (srcExt.sources) {
    sources = srcExt.sources
  }

  if (categories.length === 0) {
    categories.push('Bimtek')
  }

  const words = (summary + ' ' + bodyContent.replace(/<[^>]*>/g, ' '))
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  const read_time_minutes = Math.max(1, Math.ceil(words / 200))

  return {
    title,
    slug,
    summary,
    category: categories,
    tags,
    author,
    read_time_minutes,
    format: 'html',
    content: bodyContent,
    sources,
    sources_align,
    image_url,
    canonical,
    meta_title,
    meta_description,
    keywords,
    custom_css,
    custom_scripts,
    schema_json,
  }
}

function extractFromMarkdown(mdText: string, defaultTitle: string): ParsedDocument {
  let title = ''
  let slug = ''
  let summary = ''
  const categories: string[] = []
  const tags: string[] = []
  let author = 'Tim SSD'
  const canonical = ''
  let meta_title = ''
  let meta_description = ''
  let keywords = ''
  const image_url = ''

  const seoTitleMatch =
    mdText.match(/\*\*(?:Judul\s*SEO(?:\s*\(title\s*tag\))?|Judul)\s*:\*\*\s*(.+)/i) ||
    mdText.match(/\*\*Judul\s*SEO\*\*\s*(.+)/i) ||
    mdText.match(/(?:Judul\s*SEO|Judul)\s*:\s*(.+)/i)
  if (seoTitleMatch && seoTitleMatch[1]) {
    title = seoTitleMatch[1].trim()
    meta_title = title
  } else {
    const h1Match = mdText.match(/^#\s+(.+)$/m)
    if (h1Match && h1Match[1]) {
      title = h1Match[1].trim()
    }
  }

  if (!title) title = defaultTitle

  const slugMatch =
    mdText.match(/\*\*(?:Slug\s*[\/]\s*permalink|Slug\s*URL|Slug)\s*:\*\*\s*(.+)/i) ||
    mdText.match(/\*\*Slug\s*[\/]\s*permalink\*\*\s*(.+)/i) ||
    mdText.match(/(?:Slug\s*URL|Slug)\s*:\s*(.+)/i)
  if (slugMatch && slugMatch[1]) {
    slug = slugMatch[1].trim().replace(/^\/+/, '').replace(/\/+$/, '')
  } else {
    slug = slugifyText(title)
  }

  const descMatch =
    mdText.match(/\*\*(?:Meta\s*description|Ringkasan|Deskripsi)\s*:\*\*\s*(.+)/i) ||
    mdText.match(/\*\*Meta\s*description\*\*\s*(.+)/i)
  if (descMatch && descMatch[1]) {
    summary = descMatch[1].trim()
    meta_description = summary
  } else {
    const pMatch = mdText.match(/(?:^|\n\n)([A-Z0-9][^\n#]+)/)
    if (pMatch && pMatch[1]) {
      summary = pMatch[1].slice(0, 160).trim()
    }
  }

  const kwMatch =
    mdText.match(/\*\*(?:Kata\s*kunci\s*utama|Kata\s*kunci|Keywords)\s*:\*\*\s*(.+)/i) ||
    mdText.match(/\*\*Kata\s*kunci\s*utama\*\*\s*(.+)/i)
  if (kwMatch && kwMatch[1]) {
    keywords = kwMatch[1].trim()
  }

  const tagMatch =
    mdText.match(/\*\*(?:Tag|Tags)\s*:\*\*\s*(.+)/i) || mdText.match(/\*\*Tag\*\*\s*(.+)/i)
  if (tagMatch && tagMatch[1]) {
    tagMatch[1].split(/[,·|]/).forEach((t) => {
      const clean = t.trim()
      if (clean && !tags.includes(clean)) tags.push(clean)
    })
  }

  const catMatch = mdText.match(/(?:Kategori|Category)\s*:\s*(.+)/i)
  if (catMatch && catMatch[1]) {
    catMatch[1].split(/[,|]/).forEach((c) => {
      const clean = c.trim()
      if (clean && !categories.includes(clean)) categories.push(clean)
    })
  }
  if (categories.length === 0) {
    categories.push('Bimtek')
  }

  const authorMatch = mdText.match(/Oleh\s+\*\*([^*]+)\*\*/i) || mdText.match(/Oleh\s+([^\n0-9]+)/i)
  if (authorMatch && authorMatch[1]) {
    author = authorMatch[1].trim()
  }

  let sources = ''
  const sources_align: 'left' | 'justify' = 'left'
  const srcExt = extractSourcesFromMarkdown(mdText)
  if (srcExt.sources) {
    sources = srcExt.sources
  }

  const words = mdText.trim().split(/\s+/).filter(Boolean).length
  const read_time_minutes = Math.max(1, Math.ceil(words / 200))

  return {
    title,
    slug,
    summary,
    category: categories,
    tags,
    author,
    read_time_minutes,
    format: 'markdown',
    content: cleanMarkdownContent(mdText, false),
    sources,
    sources_align,
    image_url,
    canonical,
    meta_title: meta_title || title,
    meta_description: meta_description || summary,
    keywords,
    custom_css: '',
    custom_scripts: [],
    schema_json: null,
  }
}

export async function parseUploadedDocument(file: File): Promise<ParsedDocument> {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const baseName = file.name.replace(/\.[^/.]+$/, '').trim()

  if (extension === 'html' || extension === 'htm') {
    const htmlText = await file.text()
    return extractFromHtml(htmlText, baseName)
  }

  if (extension === 'md' || extension === 'markdown') {
    const mdText = await file.text()
    return extractFromMarkdown(mdText, baseName)
  }

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer })
    return extractFromHtml(result.value, baseName)
  }

  throw new Error('Format berkas tidak didukung. Gunakan berkas .html, .md, atau .docx.')
}


import type { ContentData, ContentDirective, Frontmatter, GallerySection } from '$types/Content'
import fs from 'node:fs/promises'
import { pagePath } from '$lib/site'
import { error } from '@sveltejs/kit'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import { draftSlugs, isDraft, resolveContentFile } from './content'

/**
 * Props inside `::name{...}::` are parsed as a YAML flow mapping rather than
 * JSON, so `{columns: 3}` works and you are not forced to quote every key the
 * way `{"columns": 3}` demanded. Same dialect as the frontmatter above it.
 */
function parseProps(componentName: string, propsStr: string): Record<string, any> {
  try {
    const parsed = yaml.load(`{${propsStr}}`)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
      return parsed as Record<string, any>

    console.warn(`Props for component ${componentName} are not a mapping, ignoring them`)
  }
  catch (e) {
    console.warn(`Failed to parse props for component ${componentName}:`, e)
  }

  return {}
}

// Parse component directives from markdown
function parseComponents(content: string): { content: string, components: ContentDirective[] } {
  const components: ContentDirective[] = []
  const componentRegex = /::(\w+)(?:\{([^}]*)\})?(?:\n([\s\S]*?)\n)?::/g

  let componentCounter = 0
  const processedContent = content.replace(componentRegex, (_match, componentName, propsStr, children) => {
    const id = `component-${componentCounter++}`
    const props: Record<string, any> = propsStr ? parseProps(componentName, propsStr) : {}

    // Add children as a prop if present
    if (children && children.trim()) {
      props.children = children.trim()
    }

    components.push({
      name: componentName,
      props,
      id,
    })

    // Replace with placeholder
    return `<div class="component-placeholder" data-component-id="${id}"></div>`
  })

  return { content: processedContent, components }
}

/**
 * Unwrap links that point at a page this build left out.
 *
 * A published page can reference a draft while the draft is being written. The
 * anchor becomes plain text rather than a link to a URL that will 404, which
 * also keeps the strict prerender from failing on a dead internal link. The
 * words stay, so the sentence still reads.
 */
function softenDraftLinks(html: string, drafts: Set<string>): string {
  if (drafts.size === 0)
    return html

  return [...drafts].reduce((acc, slug) => {
    const href = pagePath(slug)
    // Match the path with or without its trailing slash
    const pattern = new RegExp(
      `<a[^>]*href="${href.replace(/\/$/, '')}/?"[^>]*>([\\s\\S]*?)</a>`,
      'g',
    )

    return acc.replace(pattern, '$1')
  }, html)
}

/**
 * Gallery sections as written in frontmatter. `name` is optional, and leaving
 * it off renders the group without a heading. Sections with no usable items are
 * dropped so a half-written block does not render an empty grid.
 */
function parseGallery(gallery: Frontmatter['gallery']): GallerySection[] {
  if (!Array.isArray(gallery))
    return []

  return gallery
    .filter(section => section && Array.isArray(section.items))
    .map(section => ({
      name: section.name,
      items: section.items.filter(item => item && typeof item.image === 'string'),
    }))
    .filter(section => section.items.length > 0)
}

export async function loadContent(slug: string): Promise<ContentData> {
  // A page is either `rox.md` or `rox/index.md`. The second form is what lets
  // a page have sub-pages sitting beside it in the same directory.
  let raw: string | undefined
  for (const candidate of resolveContentFile(slug)) {
    try {
      raw = await fs.readFile(candidate, 'utf-8')
      break
    }
    catch {
      continue
    }
  }

  if (raw === undefined)
    throw error(404, 'Markdown file not found')

  const { data, content } = matter(raw)
  const frontmatter = data as Frontmatter // Cast to Frontmatter type

  // A draft is not part of a production build. It is never in the prerender
  // entry list, so this is only reached if something asks for it directly.
  if (isDraft(frontmatter))
    throw error(404, 'Markdown file not found')

  // Parse components before processing markdown
  const { content: contentWithPlaceholders, components } = parseComponents(content)

  marked.use(markedKatex())

  const parsed = await marked.parse(contentWithPlaceholders, {}) // Await the promise from marked.parse
  const html = softenDraftLinks(parsed, await draftSlugs())

  const scene = frontmatter.scene ?? null
  const links = frontmatter.links ?? []
  return { html, gallery: parseGallery(frontmatter.gallery), frontmatter, scene, links, components }
}

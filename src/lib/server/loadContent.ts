import type { ContentData, ContentDirective, Frontmatter, GallerySection } from '$types/Content'
import fs from 'node:fs/promises'
import path from 'node:path'
import { error } from '@sveltejs/kit'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'

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
  const mdPath = path.resolve('content', `${slug}.md`)
  let raw
  try {
    raw = await fs.readFile(mdPath, 'utf-8')
  }
  catch {
    throw error(404, 'Markdown file not found')
  }
  const { data, content } = matter(raw)
  const frontmatter = data as Frontmatter // Cast to Frontmatter type

  // Parse components before processing markdown
  const { content: contentWithPlaceholders, components } = parseComponents(content)

  marked.use(markedKatex())

  const html = await marked.parse(contentWithPlaceholders, {}) // Await the promise from marked.parse

  const scene = frontmatter.scene ?? null
  const links = frontmatter.links ?? []
  return { html, gallery: parseGallery(frontmatter.gallery), frontmatter, scene, links, components }
}

import type { ContentData, Frontmatter, GallerySection } from '$types/Content'
import fs from 'node:fs/promises'
import path from 'node:path'
import { error } from '@sveltejs/kit'
import matter from 'gray-matter'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'

// Component support
interface ComponentDirective {
  name: string
  props: Record<string, any>
  id: string
}

// Parse component directives from markdown
function parseComponents(content: string): { content: string, components: ComponentDirective[] } {
  const components: ComponentDirective[] = []
  const componentRegex = /::(\w+)(?:\{([^}]*)\})?(?:\n([\s\S]*?)\n)?::/g

  let componentCounter = 0
  const processedContent = content.replace(componentRegex, (_match, componentName, propsStr, children) => {
    const id = `component-${componentCounter++}`
    const props: Record<string, any> = {}

    // Parse props from simple key: value pairs
    if (propsStr) {
      try {
        // Safer parsing using JSON.parse approach
        const jsonString = `{${propsStr}}`
        const propsObj = JSON.parse(jsonString)
        Object.assign(props, propsObj)
      }
      catch (e) {
        console.warn(`Failed to parse props for component ${componentName}:`, e)
      }
    }

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

export async function loadContent(slug: string): Promise<ContentData & { components?: ComponentDirective[] }> {
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

  // Process gallery sections
  const gallerySections: GallerySection[] = []

  if (frontmatter.gallery && Array.isArray(frontmatter.gallery)) {
    // Process the new array format where each item is an object with a single key (section name)
    // and the value is an array of gallery items
    for (const sectionObj of frontmatter.gallery) {
      // Each object should have only one key (the section title)
      const entries = Object.entries(sectionObj)
      if (entries.length > 0) {
        const [name, items] = entries[0]

        // Check if this is a special "no-name" section
        const showName = name !== 'no-name'
        const displayName = showName ? name : ''

        // Process items if they exist and are in array format
        if (Array.isArray(items)) {
          gallerySections.push({
            name: displayName,
            showName,
            items,
          })
        }
      }
    }
  }

  const scene = frontmatter.scene ?? null
  const links = frontmatter.links ?? []
  return { html, gallery: gallerySections, frontmatter, scene, links, components }
}

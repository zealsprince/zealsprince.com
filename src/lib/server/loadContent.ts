import type { ContentData, Frontmatter, GallerySection } from '$types/Content' // Added GallerySection type
import fs from 'node:fs/promises'
import path from 'node:path'
import { error } from '@sveltejs/kit'
import matter from 'gray-matter'
import { marked } from 'marked'

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

  const html = await marked.parse(content) // Await the promise from marked.parse

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
  return { html, gallery: gallerySections, frontmatter, scene, links }
}

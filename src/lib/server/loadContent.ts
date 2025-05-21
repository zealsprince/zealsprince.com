import fs from 'node:fs/promises'
import path from 'node:path'
import { error } from '@sveltejs/kit'
import matter from 'gray-matter'
import { marked } from 'marked'

export async function loadContent(slug: string) {
  const mdPath = path.resolve('content', `${slug}.md`)
  let raw
  try {
    raw = await fs.readFile(mdPath, 'utf-8')
  }
  catch {
    throw error(404, 'Markdown file not found')
  }
  const { data: frontmatter, content } = matter(raw)
  const html = marked.parse(content)
  const gallery = frontmatter.gallery ?? []
  const scene = frontmatter.scene ?? null
  return { html, gallery, frontmatter, scene }
}

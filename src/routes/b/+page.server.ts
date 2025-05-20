import fs from 'node:fs/promises'
import path from 'node:path'
import { error } from '@sveltejs/kit'
import matter from 'gray-matter'
import { marked } from 'marked'

export async function load() {
  const mdPath = path.resolve('content/landing/b.md')
  let raw
  try {
    raw = await fs.readFile(mdPath, 'utf-8')
  }
  catch {
    throw error(404, 'Markdown file not found')
  }
  const { data, content: md } = matter(raw)
  const html = marked.parse(md)
  return {
    html,
    gallery: data.gallery || [],
    frontmatter: data,
  }
}

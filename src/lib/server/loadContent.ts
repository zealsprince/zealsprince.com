import fs from 'node:fs/promises';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { ContentData, Frontmatter, GalleryItem } from '$types/Content'; // Added GalleryItem type

export async function loadContent(slug: string): Promise<ContentData> {
  const mdPath = path.resolve('content', `${slug}.md`);
  let raw;
  try {
    raw = await fs.readFile(mdPath, 'utf-8');
  }
  catch {
    throw error(404, 'Markdown file not found');
  }
  const { data, content } = matter(raw);
  const frontmatter = data as Frontmatter; // Cast to Frontmatter type

  const html = await marked.parse(content); // Await the promise from marked.parse
  // Ensure gallery is an array of GalleryItem objects
  let gallery: GalleryItem[] = [];
  if (Array.isArray(frontmatter.gallery)) {
    gallery = frontmatter.gallery.map((item: any) => {
      if (typeof item === 'string') {
        return {
          title: '',
          image: item,
          url: item,
          link: item
        };
      } else {
        return {
          title: item.title ?? '',
          image: item.image ?? item.url ?? '',
          url: item.url ?? item.image ?? '',
          link: typeof item.link === 'string' ? item.link : (item.url ?? item.image ?? '')
        };
      }
    });
  }
  const scene = frontmatter.scene ?? null;
  const links = frontmatter.links ?? [];
  return { html, gallery, frontmatter, scene, links };
}

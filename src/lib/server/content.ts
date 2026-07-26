import type { Frontmatter, NavItem } from '$types/Content'
import fs from 'node:fs/promises'
import path from 'node:path'
import { dev } from '$app/environment'
import { HOME_SLUG } from '$lib/site'
import matter from 'gray-matter'

export const CONTENT_DIR = path.resolve('content')

export { HOME_SLUG }

/**
 * A draft is visible while developing and absent from a production build.
 *
 * `dev` is true under `npm run dev` and false under `npm run build`, so an
 * unfinished page can sit in the repository and be pushed freely without ever
 * reaching the deployed site.
 */
export function isDraft(frontmatter: Frontmatter): boolean {
  return frontmatter.draft === true && !dev
}

export interface ContentEntry {
  /** Path-shaped: `index`, `me`, `rox`, `rox/nekorox`. */
  slug: string
  /** Absolute path to the markdown file. */
  file: string
  frontmatter: Frontmatter
}

/**
 * Turn a file path relative to `content/` into a slug.
 *
 * The directory layout is the URL layout, so `rox/nekorox.md` is `/rox/nekorox/`.
 * A directory's `index.md` is the directory itself, which is what lets a page
 * have sub-pages without inventing a separate parent field.
 */
function toSlug(relative: string): string {
  const withoutExtension = relative.slice(0, -'.md'.length)
  const segments = withoutExtension.split(path.sep)

  if (segments.at(-1) === 'index')
    segments.pop()

  return segments.length === 0 ? HOME_SLUG : segments.join('/')
}

async function walk(dir: string, into: string[]): Promise<void> {
  const dirents = await fs.readdir(dir, { withFileTypes: true })

  for (const dirent of dirents) {
    const full = path.join(dir, dirent.name)

    if (dirent.isDirectory())
      await walk(full, into)
    else if (dirent.name.endsWith('.md'))
      into.push(full)
  }
}

/**
 * Every publishable content file, parsed once.
 *
 * Nav, the sitemap and the prerender entry list all read from here. They each
 * used to do their own `readdir` plus frontmatter parse, which is how the three
 * of them managed to disagree about `hidden`. Filtering drafts in one place is
 * the same argument: a draft cannot leak into one of them and not the others.
 */
export async function contentIndex(): Promise<ContentEntry[]> {
  const files: string[] = []
  await walk(CONTENT_DIR, files)

  const entries = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(file, 'utf-8')
      const { data } = matter(raw)

      return {
        slug: toSlug(path.relative(CONTENT_DIR, file)),
        file,
        frontmatter: data as Frontmatter,
      }
    }),
  )

  return entries
    .filter(entry => !isDraft(entry.frontmatter))
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

/**
 * Slugs excluded from this build. Empty in dev.
 *
 * Published pages link into these while they are being written, and a link to a
 * page that does not exist would both fail the prerender (adapter-static runs
 * strict) and ship a dead link. Knowing which slugs vanished lets those links
 * be softened rather than left dangling.
 */
export async function draftSlugs(): Promise<Set<string>> {
  if (dev)
    return new Set()

  const files: string[] = []
  await walk(CONTENT_DIR, files)

  const drafts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(file, 'utf-8')
      const { data } = matter(raw)

      return (data as Frontmatter).draft === true
        ? toSlug(path.relative(CONTENT_DIR, file))
        : null
    }),
  )

  return new Set(drafts.filter((slug): slug is string => slug !== null))
}

/**
 * Resolve a slug to its candidate files, accepting both `rox.md` and
 * `rox/index.md`.
 *
 * The slug is normalised first. It arrives straight off a catch-all route, and
 * `trailingSlash: 'always'` means the rest parameter keeps the trailing slash,
 * so `/rox/nekorox/` hands us `rox/nekorox/`. That has to be trimmed before it
 * reaches `path.join`, which quietly collapses the resulting `//` and made the
 * directory form resolve while the file form did not.
 *
 * Empty segments and `..` are dropped rather than escaped, so a crafted URL
 * cannot climb out of the content directory.
 */
export function resolveContentFile(slug: string): string[] {
  const segments = slug
    .split('/')
    .filter(segment => segment !== '' && segment !== '.' && segment !== '..')

  const normalised = segments.length === 0 ? 'index' : segments.join('/')

  return [
    path.join(CONTENT_DIR, `${normalised}.md`),
    path.join(CONTENT_DIR, normalised, 'index.md'),
  ]
}

/** `rox/nekorox` has parent `rox`. Top level pages have no parent. */
export function parentSlug(slug: string): string | null {
  const cut = slug.lastIndexOf('/')
  return cut === -1 ? null : slug.slice(0, cut)
}

export function toNavItem(entry: ContentEntry): NavItem {
  const { slug, frontmatter } = entry

  return {
    slug,
    // The menu wants the short name, so it falls back to the hero heading
    // rather than `title`, which is the long SEO one.
    heading: frontmatter.heading ?? '',
    navigation: frontmatter.navigation ?? '',
    order: frontmatter.order ?? 999,
    style: frontmatter.style ?? '',
    category: frontmatter.category ?? 'About',
    parent: parentSlug(slug),
  }
}

/** Visible pages as nav items, ordered by `order` then slug. */
export async function navigationItems(): Promise<NavItem[]> {
  const entries = await contentIndex()

  return entries
    .filter(entry => entry.frontmatter.hidden !== true)
    .map(toNavItem)
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
}

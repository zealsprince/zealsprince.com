import type { Component } from 'svelte'

export interface RawLink {
  name: string
  icon?: string // Icon name, e.g., "github", "linkedin"
  url: string
}

export interface GalleryItem {
  name?: string
  image: string
  url?: string // Optional URL for the item
}

/** A titled group of gallery items. Omit `name` for an untitled group. */
export interface GallerySection {
  name?: string
  items: GalleryItem[]
}

export type Category = 'About' | 'Projects' | 'Blog'

export interface Frontmatter {
  /** Document title, used verbatim. Falls back to `heading` plus the site name. */
  title?: string
  /** Menu label. The shortest of the three names a page has. */
  navigation?: string
  /** Hero type on the page itself. */
  heading?: string
  description?: string // Meta description used for SEO and social embeds
  image?: string // Social card, root-relative or absolute. Falls back to SITE_IMAGE
  date?: string | Date // Unquoted in YAML this arrives as a Date, quoted as a string
  scene?: string | null
  style?: string
  order?: number
  category?: Category // Category field for content organization
  hidden?: boolean // Keeps the page out of navigation, the sitemap and search results
  links?: RawLink[]
  gallery?: GallerySection[]
  [key: string]: any // For any other properties in frontmatter
}

/** A page as the navigation menu sees it, built from frontmatter at build time. */
export interface NavItem {
  slug: string
  heading: string
  navigation: string
  order: number
  style: string
  category: Category
}

export interface ContentDirective {
  name: string
  props: Record<string, any>
  id: string
}

export interface ContentData {
  html: string
  gallery: GallerySection[]
  frontmatter: Frontmatter
  scene: string | null
  links: RawLink[] // Raw links from frontmatter
  components?: ContentDirective[] // Dynamic components embedded in the markdown
}

// Data structure for page components, extending ContentData
export interface PageData extends ContentData {
  navItems: NavItem[]
}

// A link after it has been assigned an icon component
export interface ProcessedLink {
  href: string
  label: string
  iconComponent: Component | null
}

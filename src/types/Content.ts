// filepath: /Users/andrew/Projects/zealsprince/zealsprince.com/src/types/Content.ts
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

// New type for gallery sections with title and items
export interface GallerySection {
  name: string
  showName?: boolean // Added to control title visibility
  items: GalleryItem[]
}

export interface Frontmatter {
  navigation?: string
  heading?: string
  date?: string // Consider using Date if parsed and formatting in component
  scene?: string | null
  style?: string
  order?: number
  category?: 'About' | 'Projects' | 'Blog' // Category field for content organization
  hidden?: boolean // Whether to hide the item from navigation
  links?: RawLink[]
  gallery?: Array<Record<string, Array<GalleryItem>>> // Only support sectioned galleries now
  [key: string]: any // For any other properties in frontmatter
}

export interface ContentData {
  html: string
  gallery: GallerySection[] // Changed from GalleryItem[] to GallerySection[]
  frontmatter: Frontmatter
  scene: string | null
  links: RawLink[] // Raw links from frontmatter
  components?: Array<{ name: string, props: Record<string, any>, id: string }> // Dynamic components
}

// Data structure for page components, extending ContentData
export interface PageData extends ContentData {
  navItems: any[]
}

// A link after it has been assigned an icon component
export interface ProcessedLink {
  href: string
  label: string
  iconComponent: Component | null
}

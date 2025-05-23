// filepath: /Users/andrew/Projects/zealsprince/zealsprince.com/src/types/Content.ts
import type { Component } from 'svelte'

export interface RawLink {
  title: string
  icon?: string // Icon name, e.g., "github", "linkedin"
  url: string
}

export interface GalleryItem {
  title?: string
  image: string
  url: string
  link?: string // Optional: link to open when image is clicked
}

export interface Frontmatter {
  navigation?: string
  title?: string
  date?: string // Consider using Date if parsed and formatting in component
  scene?: string | null
  style?: string
  order?: number
  category?: 'About' | 'Projects' | 'Blog' // Category field for content organization
  hidden?: boolean // Whether to hide the item from navigation
  links?: RawLink[]
  gallery?: GalleryItem[]
  [key: string]: any // For any other properties in frontmatter
}

export interface ContentData {
  html: string
  gallery: GalleryItem[]
  frontmatter: Frontmatter
  scene: string | null
  links: RawLink[] // Raw links from frontmatter
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

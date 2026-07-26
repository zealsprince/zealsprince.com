export type Theme = 'light' | 'dark'

/**
 * Every colour a page can theme. Anything not listed here stays fixed in
 * app.scss. Keys map to `--color-<key>` custom properties, except the two
 * gallery entries which keep their existing variable names.
 */
export interface Palette {
  background: string
  text: string
  link: string
  primary: string
  secondary: string
  /** Hue-blend layer over gallery thumbnails. `none` disables the tint. */
  galleryMix: string
  galleryPadding: string
  borderRadius: string
  /** Base colour for meshes in cube scenes. */
  scene: string
}

export interface PalettePair {
  light: Palette
  dark: Palette
}

const defaults = {
  galleryMix: 'none',
  galleryPadding: '0',
  borderRadius: '0.5rem',
}

export const palettes: Record<string, PalettePair> = {
  // Used by any page that doesn't set `style` in its frontmatter
  default: {
    light: {
      ...defaults,
      background: '#ffffff',
      text: '#191a19',
      link: '#ee184a',
      primary: '#000000',
      secondary: '#191a19',
      galleryMix: 'color-mix(in srgb, var(--color-background) 100%, transparent)',
      galleryPadding: '0.4rem',
      scene: '#212429',
    },
    dark: {
      ...defaults,
      background: '#0d0e10',
      text: '#e6e7e8',
      link: '#ff3d6b',
      primary: '#ffffff',
      secondary: '#e6e7e8',
      galleryMix: 'color-mix(in srgb, var(--color-background) 100%, transparent)',
      galleryPadding: '0.4rem',
      scene: '#e6e7e8',
    },
  },

  index: {
    light: {
      ...defaults,
      background: '#ffffff',
      text: '#212429',
      link: '#f31554',
      primary: '#212429',
      secondary: '#e4e4e4',
      scene: '#212429',
    },
    dark: {
      ...defaults,
      background: '#0d0e10',
      text: '#e8e9ea',
      link: '#ff3d6b',
      primary: '#e8e9ea',
      secondary: '#2a2c30',
      scene: '#e8e9ea',
    },
  },

  me: {
    light: {
      ...defaults,
      background: '#e7a539',
      text: '#212429',
      link: '#ffffff',
      primary: '#212429',
      secondary: '#997b4a',
      borderRadius: '0',
      scene: '#212429',
    },
    dark: {
      ...defaults,
      background: '#2a1d08',
      text: '#f0d9ac',
      link: '#e7a539',
      primary: '#f0d9ac',
      secondary: '#6b5326',
      borderRadius: '0',
      scene: '#f0d9ac',
    },
  },
}

export function getPalette(style: string | undefined, theme: Theme): Palette {
  const pair = (style && palettes[style]) || palettes.default
  return pair[theme]
}

/**
 * Both themes for a page, scoped to the class the pre-paint script in app.html
 * stamps on <html>. Emitting both means the correct theme is right on first
 * paint and toggling is a class swap rather than a re-render.
 */
export function paletteStyleTag(style: string | undefined): string {
  const pair = (style && palettes[style]) || palettes.default

  return `<style>`
    + `:root.light{${paletteToCss(pair.light)}}`
    + `:root.dark{${paletteToCss(pair.dark)}}`
    + `</style>`
}

/** Serialise a palette into a CSS custom property declaration block. */
export function paletteToCss(palette: Palette): string {
  return [
    `--color-background:${palette.background}`,
    `--color-text:${palette.text}`,
    `--color-link:${palette.link}`,
    `--color-primary:${palette.primary}`,
    `--color-secondary:${palette.secondary}`,
    `--gallery-mix-expression:${palette.galleryMix}`,
    `--gallery-img-padding:${palette.galleryPadding}`,
    `--border-radius:${palette.borderRadius}`,
  ].join(';')
}

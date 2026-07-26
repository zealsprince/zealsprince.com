# zealsprince.com

My portfolio website, built with SvelteKit and Vite. Using Threlte for scenes and sketches.

## Functional Motivations

- Svelte-based frontend because it's fast and doesn't have a large footprint
- No UI framework because most content is going to be centered around full screen visuals
- Threlte because it's a Svelte wrapper around Three.js and I need more control than p5.js
- Markdown content support because creating a new page should be as easy as writing a markdown file
- SCSS because media breakpoints as variables are nice
- ESLint only because it can do everything Prettier can and more

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Development

The usual steps.

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Project Structure

```text
content/         # Markdown content files
src/             # Source code
  components/    # Svelte components
  lib/           # Shared libraries and utilities
  routes/        # SvelteKit routes
  scenes/        # Scene components
  shaders/       # GLSL
  types/         # TypeScript types
static/          # Static assets (favicon, robots.txt, social cards, CNAME)
```

## Content

Content pages are written in Markdown and stored in the `content/` directory. Each file begins with a frontmatter block that defines metadata and configuration for the page.

### Frontmatter

- `navigation` (string): Navigation label for the page.
- `title` (string): Page title.
- `date` (string): Date for the page (YYYY-MM-DD).
- `scene` (string): Svelte scene component to use.
- `style` (string): Optional palette key for the page, defined in `src/lib/palettes.ts`.
- `order` (number): Used for sorting navigation.
- `description` (string, optional): Meta description used for SEO and social embeds.
- `image` (string, optional): Social card, root-relative or absolute. Falls back to `/og/default.jpg`. Should be 1200x630.
- `links` (array of objects): List of external links. Each link has:
  - `name` (string): Link label
  - `icon` (string, optional): Icon name (e.g., "github", "linkedin")
  - `url` (string): Link URL
- `gallery` (array of objects, optional): List of gallery items. Each item has:
  - `image` (string): Image path
  - `title` (string, optional): Image title
  - `url` (string): Image URL
  - `link` (string, optional): Link to open when image is clicked

Write your content below the frontmatter using Markdown. All content files are automatically loaded and rendered by the site.

The `index.md` file is the main entry point for the site and serves as the homepage.

You can also use Svelte components directly in your Markdown via the `::component{props}::` syntax. You'll need to make sure to register any components you want to use in the `src/components/Content.svelte` component.

## Theming

Palettes live in `src/lib/palettes.ts` as light/dark pairs keyed by the `style` frontmatter field. A page emits both themes inline in its head, scoped to `:root.light` and `:root.dark`, and an inline script in `src/app.html` picks one before first paint from `?theme=`, a stored choice, or the OS setting. Switching is a class swap, so scenes and chrome change without a reload.

Adding a palette means adding a key to that map and pointing a content file's `style` at it. Scene mesh colour comes from the palette's `scene` value and is passed down through `SceneProps`.

## License

[MIT](LICENSE)

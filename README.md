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
  types/         # TypeScript types
static/          # Static assets (images, styles, favicon, etc.)
```

## Content

Content pages are written in Markdown and stored in the `content/` directory. Each file begins with a frontmatter block that defines metadata and configuration for the page.

### Frontmatter

- `navigation` (string): Navigation label for the page.
- `title` (string): Page title.
- `date` (string): Date for the page (YYYY-MM-DD).
- `scene` (string): Svelte scene component to use.
- `style` (string): Optional style or CSS class for the page.
- `order` (number): Used for sorting navigation.
- `links` (array of objects): List of external links. Each link has:
  - `title` (string): Link label
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

## License

[MIT](LICENSE)

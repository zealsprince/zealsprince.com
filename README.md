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
    data/        # Content for the embeddable components
  routes/        # SvelteKit routes
  scenes/        # Scene components
  shaders/       # GLSL
  types/         # TypeScript types
static/          # Static assets (favicon, robots.txt, social cards, CNAME)
```

## Content

Content pages are written in Markdown and stored in the `content/` directory. Each file begins with a frontmatter block that defines metadata and configuration for the page.

### Frontmatter

A page names itself three times, and the three fields are separate on purpose:

- `title` (string, optional): The document title, used verbatim for the browser tab, search results and social embeds. Spend the whole slot on words worth ranking for. Falls back to `heading` plus the site name.
- `heading` (string): The hero type on the page itself. Keep it short, it renders large.
- `navigation` (string): The menu label. Shorter still. Falls back to `heading`.

The rest:

- `date` (string): Date for the page (YYYY-MM-DD).
- `scene` (string): Svelte scene component to use.
- `style` (string): Optional palette key for the page, defined in `src/lib/palettes.ts`.
- `order` (number): Used for sorting navigation.
- `category` (string, optional): `About`, `Projects` or `Blog`. Groups the page in the menu and defaults to `About`. `Blog` also switches the page to article metadata.
- `description` (string, optional): Meta description used for SEO and social embeds.
- `image` (string, optional): Social card, root-relative or absolute. Falls back to `/og/default.jpg`. Should be 1200x630.
- `hidden` (boolean, optional): Keeps the page out of the menu, the sitemap and search results. The page is still built and reachable by URL.
- `links` (array of objects): List of external links. Each link has:
  - `name` (string): Link label
  - `icon` (string, optional): Icon name (e.g., "github", "linkedin")
  - `url` (string): Link URL
- `gallery` (array of objects, optional): List of gallery sections. Each section has:
  - `name` (string, optional): Section heading. Omit it for an untitled section.
  - `items` (array of objects): The images, each with:
    - `image` (string): Image path
    - `name` (string, optional): Image label, also used as alt text
    - `url` (string, optional): Where clicking the image goes. Defaults to the image itself.

```yaml
gallery:
  - name: Artwork
    items:
      - name: Some Piece
        image: https://example.com/piece.png
```

Write your content below the frontmatter using Markdown. All content files are automatically loaded and rendered by the site.

The `index.md` file is the main entry point for the site and serves as the homepage.

You can also use Svelte components directly in your Markdown via the `::component{props}::` syntax. Props are a YAML flow mapping, the same dialect as the frontmatter above them, so `::technologies{columns: 3}::` works without quoting the keys. Register any component you want to use in `src/components/Content.svelte`.

The data behind the `languages` and `technologies` embeds lives in `src/lib/data/`, so editing the lists does not mean touching the components.

## Theming

Palettes live in `src/lib/palettes.ts` as light/dark pairs keyed by the `style` frontmatter field. A page emits both themes inline in its head, scoped to `:root.light` and `:root.dark`, and an inline script in `src/app.html` picks one before first paint from `?theme=`, a stored choice, or the OS setting. Switching is a class swap, so scenes and chrome change without a reload.

Adding a palette means adding a key to that map and pointing a content file's `style` at it. Scene mesh colour comes from the palette's `scene` value and is passed down through `SceneProps`.

The `--level-*` ramp in `src/app.scss` is mixed from the active palette and drives the proficiency bars in both embeds, so it follows the theme and the page style.

## Metadata

Canonical URLs, Open Graph, Twitter cards and the `theme-color` pair are built in `src/components/Main.svelte` from the frontmatter. JSON-LD lives in `src/lib/schema.ts`, which emits a `Person` and a `WebSite` node on the homepage and links every other page to them by id.

`SITE_PROFILES` in `src/lib/site.ts` is the profile list for the `sameAs` field. It is a list rather than something derived from page links, because the Person entity has to stay the same on every page and project pages link to repos and store pages that are not Andrew.

## License

[MIT](LICENSE)

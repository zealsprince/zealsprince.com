<script lang="ts">
  import type { ContentData, ContentDirective, GallerySection } from '$types/Content'
  import { theme } from '$/lib/client/theme.svelte'
  import { getPalette, getPalettePair, paletteStyleTag } from '$/lib/palettes'
  import { structuredDataTag } from '$/lib/schema'
  import {
    absolute,
    isoDate,
    resolvePageTitle,
    SITE_AUTHOR,
    SITE_DESCRIPTION,
    SITE_IMAGE,
    SITE_LOCALE,
    SITE_NAME,
    SITE_ORIGIN,
    SITE_TWITTER,
  } from '$/lib/site'
  import { SceneName } from '$/types/Scene'
  import { page } from '$app/state'
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import Content from './Content.svelte'
  import Gallery from './Gallery.svelte'
  import Links from './Links.svelte'
  import ThemeToggle from './ThemeToggle.svelte'
  import Threalte from './Threlte.svelte'

  interface Props {
    data: ContentData
    editor?: boolean
  }

  const { data, editor = false }: Props = $props()

  const pageTitle = $derived(resolvePageTitle(data.frontmatter))
  const pageDescription = $derived(
    data.frontmatter?.description ?? SITE_DESCRIPTION,
  )
  const pageImage = $derived(absolute(data.frontmatter?.image ?? SITE_IMAGE))
  // page.url.pathname already carries the trailing slash from the kit config
  const canonical = $derived(`${SITE_ORIGIN}${page.url.pathname}`)
  const isHome = $derived(page.url.pathname === '/')

  // `hidden` keeps a page out of the menu and the sitemap, but the page is
  // still prerendered and reachable, so it needs telling not to be indexed too.
  const noindex = $derived(data.frontmatter?.hidden === true)

  const isPost = $derived(data.frontmatter?.category === 'Blog')
  const published = $derived(isoDate(data.frontmatter?.date))

  const jsonLd = $derived(structuredDataTag({
    frontmatter: data.frontmatter ?? {},
    canonical,
    title: pageTitle,
    description: pageDescription,
    image: pageImage,
    isHome,
  }))

  // Derived, not copied into $state by an effect. Effects do not run during
  // SSR, so the effect version prerendered every page with an empty body and
  // only filled it in once the client hydrated.
  const content = $derived(editor ? '' : (data.html ?? ''))
  const components: ContentDirective[] = $derived(editor ? [] : (data.components ?? []))
  const gallery: GallerySection[] = $derived(editor ? [] : (data.gallery ?? []))

  let minifyHeader: boolean = $state(false)
  let contentBody: HTMLElement | undefined = $state() // Reference to the content body element

  const styleClass = $derived(data.frontmatter?.style ?? '')

  // Scene is used in both modes
  const scene: SceneName = $derived((data.scene as SceneName) ?? SceneName.SceneIndex)

  // Drives the scene mesh colour. The CSS custom properties come from
  // paletteStyleTag, which emits both themes at once.
  const palette = $derived(getPalette(data.frontmatter?.style, theme.current))

  // theme-color is emitted per scheme rather than following the toggle, because
  // the pages are prerendered and a single reactive tag bakes in whichever
  // theme the server happened to render. Media-scoped tags are right from first
  // paint for anyone on their OS setting, which is nearly everyone. Someone who
  // pins the opposite theme gets a browser chrome colour that lags the page.
  const palettePair = $derived(getPalettePair(data.frontmatter?.style))

  function handleScroll() {
    if (editor)
      return // No scroll handling for header in editor mode
    const scrollY = window.scrollY || window.pageYOffset
    const hideThreshold = window.innerHeight * 0.8
    minifyHeader = scrollY > hideThreshold
  }

  function scrollToContent(event: MouseEvent) {
    event.preventDefault()

    if (contentBody) {
      contentBody.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  onMount(() => {
    if (editor)
      return // No scroll listener setup in editor mode

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="author" content={SITE_AUTHOR} />
  <link rel="canonical" href={canonical} />
  {#if noindex}
    <meta name="robots" content="noindex, follow" />
  {/if}

  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content={isPost ? 'article' : 'website'} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:locale" content={SITE_LOCALE} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={pageImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={pageTitle} />
  {#if isPost}
    <meta property="article:author" content={SITE_AUTHOR} />
    {#if published}
      <meta property="article:published_time" content={published} />
    {/if}
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content={SITE_TWITTER} />
  <meta name="twitter:creator" content={SITE_TWITTER} />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content={pageImage} />

  <meta name="theme-color" content={palettePair.light.background} media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content={palettePair.dark.background} media="(prefers-color-scheme: dark)" />

  <!-- Page palette, both themes. Inline so it lands before first paint,
       unlike the stylesheet link this replaced. -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- generated from a static palette map -->
  {@html paletteStyleTag(styleClass)}

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON.stringify output with `<` escaped -->
  {@html jsonLd}
</svelte:head>

{#if editor}
  <!-- Editor Mode: Only Threalte, configured for editing -->
  <main class="editor-mode">
    <Threalte {scene} editorModeActive={true} sceneColor={palette.scene} />
  </main>
{:else}
  <!-- Default Content Display -->
  <main class={styleClass}>
    <div class="scene">
      <Threalte {scene} sceneColor={palette.scene} />
    </div>
    <div class="theme-control">
      <ThemeToggle />
    </div>
    {#if !minifyHeader}
      <div
        class="header"
        in:fly={{ y: -60, duration: 700, opacity: 0 }}
        out:fly={{ y: -60, duration: 200, opacity: 0 }}
      >
        <a href="#content" type="button" onclick={scrollToContent}>
          <h1 class="heading">{data.frontmatter.heading}</h1>
        </a>
      </div>
    {:else}
      <h1
        class="heading-fixed"
        transition:fly={{ y: 20, duration: 200, opacity: 0 }}
      >
        {data.frontmatter?.heading}
      </h1>
    {/if}
    <div style="position: relative; height: 100vh;"></div>
    <!-- Spacer for visualization and title overlay -->
    <div id="content" class="content" bind:this={contentBody}>
      <div class="markdown markdown">
        <Content html={content} {components} />
      </div>
      <div class="gallery">
        <Gallery images={gallery} />
      </div>
    </div>
    <!-- Social Links: bottom right -->
    {#if !minifyHeader && !editor}
      <Links links={data.links} />
    {/if}
  </main>
{/if}

<style lang="scss">
  @use "@/vars.scss" as vars;

  /* Base content styles */
  main {
    z-index: 1;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .scene {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  .header {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    color: var(--color-primary);
    text-align: left;
    max-width: 80vw;
  }

  .heading {
    color: var(--color-primary);
    font-size: var(--font-size-xl);
    font-weight: 100;
    line-height: 1.2;
    text-transform: uppercase;
    margin: 0;
    width: 100%;
    max-width: var(--text-max-width);
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;

    transition: all 0.2s ease;

    &:hover {
      color: var(--color-link);
    }
  }

  .theme-control {
    position: fixed;
    top: 1.5rem;
    right: 1.75rem;
    z-index: 26;
  }

  .heading-fixed {
    position: fixed;
    top: 1.5rem;
    /* Clears the theme toggle sitting in the same corner */
    right: 4.75rem;
    color: var(--color-primary);
    text-align: right;
    max-width: 70vw;
    font-size: var(--font-size-md);
    font-weight: 100;
    line-height: var(--font-size-subtitle);
    text-transform: uppercase;
    margin: 0;
    z-index: 100;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .content {
    min-height: 90vh;
    border-top: 1px solid var(--color-secondary);
    background: color-mix(in srgb, var(--color-background) 70%, transparent);
    backdrop-filter: blur(16px);
    z-index: 5;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 1.5rem;
  }

  .markdown {
    flex: 2 1 0;
    max-width: var(--content-text-max-width);
    text-align: justify;
    color: var(--color-text);
    border-radius: 1rem;
    padding: 0 2rem;
  }

  .gallery {
    flex: 1 1 0;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  /* Styles for editor mode to ensure Threalte can take full space if needed */
  .editor-mode {
    width: 100vw;
    height: 100vh;
    display: flex; /* Ensure Threalte can expand */
    align-items: stretch;
    justify-content: stretch;
  }
  .editor-mode > :global(div) {
    /* Target Threalte's wrapper */
    flex-grow: 1;
  }

  @media (max-width: vars.$breakpoint-xl) {
    .content {
      flex-direction: column;
      align-items: stretch;
      gap: 2rem;
    }

    .markdown {
      max-width: 100vw;
    }
  }

  @media (max-width: vars.$breakpoint-lg) {
    .heading {
      font-size: var(--font-size-lg);
    }

    .content {
      flex-direction: column;
      align-items: stretch;
      gap: 1.5rem;
    }

    .markdown {
      max-width: none;
    }
  }

  @media (max-width: vars.$breakpoint-md) {
    .content {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
  }

  @media (max-width: vars.$breakpoint-sm) {
    .heading {
      font-size: var(--font-size-md);
    }
  }
</style>

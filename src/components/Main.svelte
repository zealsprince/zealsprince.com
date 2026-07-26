<script lang="ts">
  import type { ContentData, ContentDirective, GallerySection, NavItem } from '$types/Content'
  import { theme } from '$/lib/client/theme.svelte'
  import { buildCrumbs, slugFromPath } from '$/lib/navigation'
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
  import Footer from './Footer.svelte'
  import Gallery from './Gallery.svelte'
  import Links from './Links.svelte'
  import Navigation from './Navigation.svelte'
  import ThemeToggle from './ThemeToggle.svelte'
  import Threalte from './Threlte.svelte'
  import Trail from './Trail.svelte'

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

  // Layout data, so it is here on the error page too
  const navItems: NavItem[] = $derived(page.data?.navItems ?? [])
  const slug = $derived(slugFromPath(page.url.pathname))
  const crumbs = $derived(buildCrumbs(slug, navItems))
  const currentLabel = $derived(
    data.frontmatter?.navigation || data.frontmatter?.heading || '',
  )

  const jsonLd = $derived(structuredDataTag({
    frontmatter: data.frontmatter ?? {},
    canonical,
    title: pageTitle,
    description: pageDescription,
    image: pageImage,
    isHome,
    crumbs,
    currentLabel,
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

    <!-- Three slots: menu, where you are, appearance. The trail takes the
         middle so it stays centred regardless of how wide either control is. -->
    <div class="chrome">
      <div class="chrome-left">
        <Navigation items={navItems} />
      </div>
      <div class="chrome-center">
        {#if minifyHeader}
          <!-- Rises from below, following the direction the page just scrolled,
               rather than dropping in against it. -->
          <div transition:fly={{ y: 20, duration: 200, opacity: 0 }}>
            <Trail {crumbs} current={currentLabel} />
          </div>
        {/if}
      </div>
      <div class="chrome-right">
        <ThemeToggle />
      </div>
    </div>

    <section class="hero">
      {#if !minifyHeader}
        <div
          class="hero-inner shell"
          in:fly={{ y: -60, duration: 700, opacity: 0 }}
          out:fly={{ y: -60, duration: 200, opacity: 0 }}
        >
          <a class="hero-title" href="#content" onclick={scrollToContent}>
            <h1 class="heading">{data.frontmatter.heading}</h1>
          </a>
        </div>
      {/if}

      <!-- Inside the hero, so they scroll away with it. Fixed positioning left
           them floating over the article the whole way down. -->
      <div class="hero-links">
        <Links links={data.links} />
      </div>
    </section>

    <div id="content" class="content" bind:this={contentBody}>
      <article class="shell">
        <div class="markdown prose">
          <Content html={content} {components} />
        </div>

        {#if gallery.length > 0}
          <div class="gallery">
            <Gallery images={gallery} />
          </div>
        {/if}
      </article>

      <Footer links={data.links} />
    </div>
  </main>
{/if}

<style lang="scss">
  @use "@/vars.scss" as vars;

  main {
    z-index: 1;
    width: 100%;
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

  /* Fixed control bar. Menu and theme toggle group on the left, the trail rides
     in on the right once the hero is gone. */
  .chrome {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
    /* Equal outer columns, so the middle one is centred on the viewport rather
       than on whatever space the controls happen to leave. */
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    pointer-events: none;

    > * {
      pointer-events: auto;
    }

    /* Its own layer rather than a background on the bar, so the blur sits
       behind the controls without the dropdown inheriting it. */
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: color-mix(in srgb, var(--color-background) 45%, transparent);
      border-bottom: 1px solid color-mix(in srgb, var(--color-secondary) 70%, transparent);
      backdrop-filter: blur(16px);
      pointer-events: none;
      z-index: -1;
    }
  }

  .chrome-left {
    display: flex;
    align-items: center;
    justify-self: start;
  }

  .chrome-center {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
  }

  .chrome-right {
    display: flex;
    align-items: center;
    justify-self: end;
  }

  /* Hero. Centered rather than pinned to a corner, so the scene reads as a
     backdrop for something instead of empty space with a label on it. */
  .hero {
    position: relative;
    z-index: 5;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Bottom weighted rather than dead centre. Perfectly centred type left the
       block floating with nothing under it; sitting it above the links makes
       the two read as one group and gives the scene the room instead. */
    justify-content: flex-end;
    padding-bottom: calc(var(--space-lg) + 4.5rem);
    text-align: center;

    /* The scene runs behind the type and the cube scenes in particular drift
       right through it. A soft scrim guarantees the words read on every seed
       and every frame, without flattening the scene at the edges. */
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse 70% 45% at 50% 78%,
        color-mix(in srgb, var(--color-background) 82%, transparent) 0%,
        color-mix(in srgb, var(--color-background) 55%, transparent) 45%,
        transparent 78%
      );
      pointer-events: none;
    }
  }

  .hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2xs);
  }

  /* The title is the scroll affordance, same as it was before. */
  .hero-title {
    display: block;
    color: inherit;

    &:hover .heading {
      color: var(--color-link);
    }
  }

  .heading {
    color: var(--color-primary);
    /* Half of --font-size-xl. The hero is the one place the scene gets to be
       the subject, and at 8rem the type was taking the room it needed. */
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-light);
    line-height: 1.05;
    text-transform: uppercase;
    margin: 0;
    max-width: 100%;
    overflow-wrap: break-word;
    hyphens: auto;
    transition: color 0.2s ease;
  }

  .hero-links {
    position: absolute;
    bottom: var(--space-lg);
    left: 50%;
    transform: translateX(-50%);
    z-index: 6;
  }

  .content {
    position: relative;
    width: 100%;
    min-height: 60vh;
    border-top: 1px solid var(--color-secondary);
    background: color-mix(in srgb, var(--color-background) 88%, transparent);
    backdrop-filter: blur(20px);
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: var(--space-2xl);
  }

  /* Single centered column. The gallery used to be a 250px sidebar next to the
     prose, which squeezed both; it now runs the full width below it. */
  .prose {
    max-width: var(--measure);
    margin-inline: auto;
    color: var(--color-text);
  }

  .gallery {
    width: 100%;
    margin-top: var(--space-2xl);
  }

  .editor-mode {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
  }
  .editor-mode > :global(div) {
    flex-grow: 1;
  }

  @media (max-width: vars.$breakpoint-lg) {
    .chrome {
      padding: var(--space-sm) var(--space-md);
    }

    /* No heading step here any more. It used to drop 8rem to 4rem, and 4rem is
       now the desktop size, so the small screens are unchanged. */

    .content {
      padding-top: var(--space-xl);
    }
  }

  @media (max-width: vars.$breakpoint-sm) {
    .heading {
      font-size: var(--font-size-md);
    }
  }
</style>

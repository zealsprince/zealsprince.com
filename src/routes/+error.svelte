<script lang="ts">
  import { theme } from '$/lib/client/theme.svelte'
  import { getPalette, paletteStyleTag } from '$/lib/palettes'
  import { SITE_NAME } from '$/lib/site'
  import { SceneName } from '$/types/Scene'
  import { page } from '$app/state'
  import Navigation from '$components/Navigation.svelte'
  import ThemeToggle from '$components/ThemeToggle.svelte'
  import Threlte from '$components/Threlte.svelte'

  const palette = $derived(getPalette('index', theme.current))

  // Layout data survives a failed page load, so the menu still works here
  const navItems = $derived(page.data?.navItems ?? [])

  const status = $derived(page.status)
  const heading = $derived(status === 404 ? 'Lost' : 'Broken')
  const message = $derived(
    status === 404
      ? 'There\'s nothing at this address. It may have moved, or never existed.'
      : (page.error?.message ?? 'Something went wrong on the way here.'),
  )
</script>

<svelte:head>
  <title>{status} - {SITE_NAME}</title>
  <meta name="robots" content="noindex" />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- generated from a static palette map -->
  {@html paletteStyleTag('index')}
</svelte:head>

<main>
  <div class="scene">
    <Threlte scene={SceneName.SceneCubes} sceneColor={palette.scene} />
  </div>

  <div class="chrome">
    <div class="chrome-left">
      <Navigation items={navItems} />
    </div>
    <div></div>
    <div class="chrome-right">
      <ThemeToggle />
    </div>
  </div>

  <div class="panel">
    <p class="status">{status}</p>
    <h1 class="heading">{heading}</h1>
    <p class="message">{message}</p>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="home" href="/">Back to the start</a>
  </div>
</main>

<style lang="scss">
  @use "@/vars.scss" as vars;

  main {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .scene {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  /* Same bar as every other page, so a 404 does not feel like a different site */
  .chrome {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: var(--space-md) var(--space-lg);
    pointer-events: none;

    > * {
      pointer-events: auto;
    }

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

  .chrome-right {
    display: flex;
    align-items: center;
    justify-self: end;
  }

  .panel {
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: min(40rem, 85vw);
  }

  .status {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-light);
    color: var(--color-link);
    margin: 0;
    letter-spacing: 0.1em;
  }

  .heading {
    color: var(--color-primary);
    /* Matches the hero heading on every other page */
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-light);
    line-height: 1.2;
    text-transform: uppercase;
    margin: 0;
  }

  .message {
    color: var(--color-text);
    font-size: var(--font-size-sm);
    line-height: 1.6;
    margin: 1rem 0 1.5rem;
  }

  .home {
    display: inline-block;
    color: var(--color-link);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid currentColor;
    padding-bottom: 0.15rem;
    transition: letter-spacing 0.2s ease;

    &:hover {
      letter-spacing: 0.12em;
    }
  }

  @media (max-width: vars.$breakpoint-sm) {
    .heading {
      font-size: var(--font-size-md);
    }
  }
</style>

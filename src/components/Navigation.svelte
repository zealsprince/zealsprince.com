<script lang="ts">
  import type { NavItem, NavNode } from '$/types/Content'
  import { pagePath } from '$/lib/site'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { Box, Rss, UserRound } from '@lucide/svelte'
  import { onDestroy, onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  interface Props {
    items?: NavItem[]
  }

  const { items = [] }: Props = $props()
  let open = $state(false)
  let isPointer = $state(false)
  let pointerListener: ((e: MediaQueryListEvent) => void) | null = null

  const SECTIONS = [
    { name: 'About', icon: UserRound },
    { name: 'Projects', icon: Box },
    { name: 'Blog', icon: Rss },
  ] as const

  // One level of nesting. A child whose parent is hidden or missing is promoted
  // to the top rather than dropped, so a page can never vanish from the menu.
  const nodes = $derived.by(() => {
    const present = new Set(items.map(item => item.slug))
    const isTop = (item: NavItem) => !item.parent || !present.has(item.parent)

    return items.filter(isTop).map(item => ({
      ...item,
      children: items.filter(child => !isTop(child) && child.parent === item.slug),
    })) satisfies NavNode[]
  })

  const sections = $derived(
    SECTIONS
      .map(section => ({
        ...section,
        nodes: nodes.filter(node => (node.category ?? 'About') === section.name),
      }))
      .filter(section => section.nodes.length > 0),
  )

  function label(item: NavItem): string {
    return item.navigation || item.heading || item.slug
  }

  onMount(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    isPointer = mq.matches
    pointerListener = (e) => {
      isPointer = e.matches
    }
    mq.addEventListener('change', pointerListener)
  })

  onDestroy(() => {
    if (pointerListener) {
      const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
      mq.removeEventListener('change', pointerListener)
    }
  })

  function navTo(slug: string) {
    goto(pagePath(slug))
    open = false
  }

  function isActive(slug: string): boolean {
    return page.url.pathname === pagePath(slug)
  }
</script>

{#snippet navLink(item: NavItem, child: boolean)}
  <!-- eslint-disable svelte/no-navigation-without-resolve -->
  <a
    class="nav-link {isActive(item.slug) ? 'active' : ''} {child ? 'child' : ''}"
    href={pagePath(item.slug)}
    aria-current={isActive(item.slug) ? 'page' : undefined}
    onclick={(e) => {
      e.preventDefault()
      navTo(item.slug)
    }}>{label(item)}</a
  >
  <!-- eslint-enable svelte/no-navigation-without-resolve -->
{/snippet}

{#if open}
  <div class="nav-overlay" transition:fade={{ duration: 100 }}></div>
{/if}

<nav
  class="nav-menu"
  aria-label="Main navigation"
  onmouseenter={() => {
    if (isPointer)
      open = true
  }}
  onmouseleave={() => {
    if (isPointer)
      open = false
  }}
  onfocusin={() => {
    if (isPointer)
      open = true
  }}
  onfocusout={() => {
    if (isPointer)
      open = false
  }}
>
  <button
    class="nav-toggle {open ? 'open' : ''}"
    onclick={() => (open = !open)}
    aria-label="Open navigation"
    aria-expanded={open}
  >
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <g class="icon-lines {open ? 'open' : ''}">
        <line x1="20" y1="30" x2="80" y2="30" />
        <line x1="20" y1="50" x2="80" y2="50" />
        <line x1="20" y1="70" x2="80" y2="70" />
      </g>
    </svg>
  </button>
  {#if open}
    <div class="nav-list open" transition:fly={{ y: -10, duration: 200 }}>
      {#each sections as section (section.name)}
        {@const Icon = section.icon}
        <div class="nav-category">
          <h3 class="category-title">
            <Icon />
            {section.name}
          </h3>
          {#each section.nodes as node (node.slug)}
            {@render navLink(node, false)}
            {#each node.children as child (child.slug)}
              {@render navLink(child, true)}
            {/each}
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</nav>

<style lang="scss">
  @use "@/vars.scss" as vars;

  .nav-overlay {
    position: fixed;
    inset: 0;
    background-color: color-mix(in srgb, var(--color-background) 55%, transparent);
    backdrop-filter: blur(20px);
    z-index: 20;
    pointer-events: auto;
  }

  /* In the flow of the chrome bar now, not fixed to the viewport itself. The
     bar owns the position; the menu only owns its own dropdown. */
  .nav-menu {
    position: relative;
    z-index: 25;
    font-weight: var(--font-weight-light);
    text-transform: uppercase;
    display: flex;
    align-items: center;
  }

  .nav-toggle {
    position: relative;
    z-index: 26;
    width: 2rem;
    height: 2rem;
    background: none;
    color: var(--color-primary);
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover {
      color: var(--color-link);
    }

    &:focus-visible {
      outline: 2px solid var(--color-link);
      outline-offset: 4px;
    }
  }

  .nav-toggle svg {
    display: block;
  }

  /* Geometry is measured against the viewBox, not each line's own bounding box.
     A horizontal line has zero-height bounds, so a percentage origin resolves
     inconsistently and the X came out lopsided. Rotating all three about the
     fixed centre of the 100x100 viewBox makes the two strokes meet exactly. */
  .icon-lines line {
    stroke: currentColor;
    stroke-width: 6;
    stroke-linecap: round;
    transform-box: view-box;
    transform-origin: 50px 50px;
    transition:
      transform 0.3s ease-in-out,
      opacity 0.3s ease-in-out;
  }

  /* Order matters, and getting it backwards is what bent the X. A transform
     list applies right to left, so the line has to be moved onto the centre
     line first and only then rotated about it. Rotating first swung each line's
     midpoint off centre, and the later translate could not bring it back, so
     the two strokes crossed off centre with uneven arms. */
  .icon-lines.open line:nth-child(1) {
    transform: rotate(45deg) translateY(20px);
  }

  .icon-lines.open line:nth-child(2) {
    opacity: 0;
  }

  .icon-lines.open line:nth-child(3) {
    transform: rotate(-45deg) translateY(-20px);
  }

  /* Columns. Three shallow lists side by side read as a map of the site, where
     one long stack just read as a list you have to get to the bottom of. */
  .nav-list {
    position: absolute;
    /* Flush against the toggle, with the visual gap made of padding. Offsetting
       with `top` instead left a dead strip belonging to neither element, and
       moving the cursor down through it counted as leaving the menu. */
    top: 100%;
    left: 0;
    padding-top: var(--space-md);
    z-index: 25;
    /* A definite width is what makes the columns equal. Sized in max-content
       the tracks take their own content width, so the rule under each label
       came out a different length in every column. */
    width: min(46rem, calc(100vw - var(--space-xl)));
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
    gap: var(--space-lg) var(--space-xl);
    align-items: start;
  }

  .nav-category {
    min-width: 0;
  }

  /* Sits above the links it labels, so it reads quieter than them, not louder. */
  .category-title {
    display: flex;
    align-items: center;
    gap: var(--space-3xs);
    font-size: 0.7rem;
    color: var(--color-text);
    opacity: 0.6;
    margin: 0 0 var(--space-2xs) 0;
    padding-bottom: var(--space-2xs);
    border-bottom: 1px solid color-mix(in srgb, var(--color-secondary) 60%, transparent);
    font-weight: var(--font-weight-normal);
    letter-spacing: 0.16em;

    :global(svg) {
      width: 0.85rem;
      height: 0.85rem;
    }
  }

  .nav-link {
    position: relative;
    display: block;
    color: var(--color-primary);
    text-decoration: none;
    letter-spacing: 0.03em;
    font-size: var(--font-size-md);
    line-height: 1.25;
    padding: var(--space-3xs) 0;
    /* Labels are short by design. Letting them wrap produced ragged two-line
       entries and, with the old overflow, clipped ones. */
    white-space: nowrap;
    transition:
      color 0.2s,
      letter-spacing 0.2s;
  }

  .nav-link:hover,
  .nav-link:focus-visible {
    color: var(--color-link) !important;
    letter-spacing: 0.07em;
  }

  /* Colour alone marks the current page. The leading dot read as a stray
     bullet against the label rather than as a marker. */
  .nav-link.active {
    color: var(--color-link);
    font-weight: var(--font-weight-normal);
  }

  /* Nesting is unused by the current content but the routing still supports it,
     so a sub-page still renders sensibly if one is ever added back. */
  .nav-link.child {
    font-size: calc(var(--font-size-md) * 0.55);
    padding-left: var(--space-sm);
    color: var(--color-text);
  }

  @media (max-width: vars.$breakpoint-lg) {
    .nav-link {
      font-size: calc(var(--font-size-md) * 0.8);
    }

    .nav-list {
      gap: var(--space-md) var(--space-xl);
    }
  }

  @media (max-width: vars.$breakpoint-md) {
    .nav-list {
      grid-template-columns: 1fr;
      gap: var(--space-md);
      min-width: 60vw;
    }

    .nav-link {
      font-size: calc(var(--font-size-md) * 0.7);
    }
  }
</style>

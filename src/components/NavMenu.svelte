<script lang="ts">
  import { goto } from "$app/navigation";
  import { fly, fade } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/state";
  import { Box, Rss, UserRound } from "@lucide/svelte";
  import type { Frontmatter } from "$/types/Content";
  export let items: Frontmatter[] = [];
  let open = false;
  let isPointer = false;
  let pointerListener: ((e: MediaQueryListEvent) => void) | null = null;

  // Organize items by category
  $: categories = {
    About: items.filter((item) => item.category === "About" || !item.category),
    Projects: items.filter((item) => item.category === "Projects"),
    Blog: items.filter((item) => item.category === "Blog"),
  };

  onMount(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    isPointer = mq.matches;
    pointerListener = (e) => {
      isPointer = e.matches;
    };
    mq.addEventListener("change", pointerListener);
  });

  onDestroy(() => {
    if (pointerListener) {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      mq.removeEventListener("change", pointerListener);
    }
  });

  function navTo(slug: string) {
    goto(slug === "index" ? "/" : `/${slug}`);
    open = false;
  }

  // Check if a route is currently active
  function isActive(slug: string): boolean {
    const currentPath = page.url.pathname;
    if (slug === "index") {
      return currentPath === "/" || currentPath === "";
    }
    return currentPath === `/${slug}` || currentPath === `/${slug}/`;
  }

  $: navToggle;
  $: navToggle = open;
</script>

{#if open}
  <div class="nav-overlay" transition:fade={{ duration: 100 }}></div>
{/if}

<nav
  class="nav-menu"
  aria-label="Main navigation"
  on:mouseenter={() => {
    if (isPointer) open = true;
  }}
  on:mouseleave={() => {
    if (isPointer) open = false;
  }}
  on:focusin={() => {
    if (isPointer) open = true;
  }}
  on:focusout={() => {
    if (isPointer) open = false;
  }}
>
  <div class="nav-background"></div>
  <button
    class="nav-toggle {open ? 'open' : ''}"
    on:click={() => (open = !open)}
    aria-label="Open navigation"
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
      <!-- About section -->
      {#if categories.About.length > 0}
        <div class="nav-category">
          <h3 class="category-title">
            <UserRound />
            About
          </h3>
          {#each categories.About as item}
            <a
              class="nav-link {isActive(item.slug) ? 'active' : ''}"
              href={item.slug === "index" ? "/" : `/${item.slug}`}
              on:click|preventDefault={() => navTo(item.slug)}
              >{item.navigation ?? item.title}</a
            >
          {/each}
        </div>
      {/if}

      <!-- Projects section -->
      {#if categories.Projects.length > 0}
        <div class="nav-category">
          <h3 class="category-title">
            <Box />
            Projects
          </h3>
          {#each categories.Projects as item}
            <a
              class="nav-link {isActive(item.slug) ? 'active' : ''}"
              href={item.slug === "index" ? "/" : `/${item.slug}`}
              on:click|preventDefault={() => navTo(item.slug)}
              >{item.navigation ?? item.title}</a
            >
          {/each}
        </div>
      {/if}

      <!-- Blog section -->
      {#if categories.Blog.length > 0}
        <div class="nav-category">
          <h3 class="category-title">
            <Rss />
            Blog
          </h3>
          {#each categories.Blog as item}
            <a
              class="nav-link {isActive(item.slug) ? 'active' : ''}"
              href={item.slug === "index" ? "/" : `/${item.slug}`}
              on:click|preventDefault={() => navTo(item.slug)}
              >{item.navigation ?? item.title}</a
            >
          {/each}
        </div>
      {/if}

      <div class="nav-fade"></div>
    </div>
  {/if}
</nav>

<style lang="scss">
  @use "@/vars.scss" as vars;

  .nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: color-mix(
      in srgb,
      var(--color-background) 60%,
      transparent
    );
    backdrop-filter: blur(16px);
    z-index: 20;
    pointer-events: auto;
    transition: opacity 0.3s;
  }

  .nav-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 5.5rem;
    background: color-mix(in srgb, var(--color-background) 40%, transparent);
    border-bottom: 1px solid var(--color-secondary);
    backdrop-filter: blur(16px);
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .nav-menu {
    position: fixed;
    top: 0.5rem;
    left: 1.25rem;
    z-index: 25;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-light);
    text-transform: uppercase;
  }

  .nav-toggle {
    position: relative;
    z-index: 20;
    width: var(--font-size-lg);
    height: var(--font-size-lg);
    background: none;
    color: var(--color-primary);
    border: none;
    border-radius: var(--border-radius-sm);
    padding: 0rem; /* Adjusted padding for SVG */
    cursor: pointer;
    box-shadow: none;
    transition: background 0.2s;
    /* font-size and line-height are not needed for SVG */
    /* font-weight is not needed for SVG */
  }

  .nav-toggle svg {
    display: block; /* Remove extra space below SVG */
  }

  .icon-lines line {
    stroke: var(--color-primary);
    stroke-width: 3;
    stroke-linecap: round;
    transform-origin: 50% 50%; /* Center the transform origin */
    transition:
      transform 0.3s ease-in-out,
      opacity 0.3s ease-in-out,
      stroke-width 0.3s;
  }

  .icon-lines.open line:nth-child(1) {
    transform: translateY(32px) rotate(45deg) translateX(-24px);
  }

  .icon-lines.open line:nth-child(2) {
    opacity: 0;
  }

  .icon-lines.open line:nth-child(3) {
    transform: translateY(-30px) rotate(-45deg) translateX(-24px);
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    background: none;
    border-radius: 0;
    box-shadow: none;
    min-width: 220px;
    max-height: 80vh;
    padding: 0;
    margin-top: 1rem;
    overflow-y: auto;
    position: relative;
    scrollbar-width: thin;
    scrollbar-color: #eee #fff;
  }

  .nav-list::-webkit-scrollbar {
    width: 8px;
  }

  .nav-list::-webkit-scrollbar-thumb {
    border-radius: 4px;
  }

  .nav-list::-webkit-scrollbar-track {
    border-radius: 4px;
  }

  .nav-category {
    margin-bottom: 1rem;
  }

  .category-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--font-size-md);
    color: var(--color-text);
    margin: 0.5rem 0 0.25rem 0.5rem;
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.05em;
  }

  .nav-link {
    color: var(--color-primary);
    text-decoration: none;
    letter-spacing: 0.04em;
    padding: 0.5rem 1.2rem 0.5rem 0;
    border-radius: 0;
    background: none;
    transition:
      color 0.2s,
      letter-spacing 0.2s;
    margin-left: 0.5rem;
    line-height: var(--font-size-lg);
    display: block;
  }

  .nav-link:hover,
  .nav-link:focus {
    color: var(--color-link) !important;
    letter-spacing: 0.08em !important;
    background: none;
  }

  .nav-link.active {
    color: var(--color-link);
    letter-spacing: 0.06em;
    font-weight: var(--font-weight-medium);
    position: relative;
  }

  .nav-link.active::after {
    content: "";
    position: absolute;
    left: -0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.25rem;
    height: 0.25rem;
    border-radius: 50%;
    background-color: var(--color);
  }

  .nav-fade {
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50vh;
    border-radius: 0 0 1rem 1rem;
  }

  @media (max-width: vars.$breakpoint-md) {
    .nav-list {
      margin-top: 1rem;
    }

    .nav-link {
      font-size: var(--font-size-md);
      line-height: var(--font-size-md);
    }

    .category-title {
      font-size: calc(var(--font-size-sm) * 0.9);
    }
  }
</style>

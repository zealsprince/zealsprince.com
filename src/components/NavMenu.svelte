<script lang="ts">
  import { goto } from "$app/navigation";
  import { fly, fade } from "svelte/transition";
  export let items: Array<{
    slug: string;
    title: string;
    navigation?: string;
    order?: number;
    style?: string;
  }> = [];
  let open = false;
  function navTo(slug: string) {
    goto(slug === "index" ? "/" : `/${slug}`);
    open = false;
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
  on:mouseenter={() => (open = true)}
  on:mouseleave={() => (open = false)}
  on:focusin={() => (open = true)}
  on:focusout={() => (open = false)}
>
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
      {#each items as item}
        <a
          class="nav-link"
          href={item.slug === "index" ? "/" : `/${item.slug}`}
          on:click|preventDefault={() => navTo(item.slug)}
          >{item.navigation ?? item.title}</a
        >
      {/each}
      <div class="nav-fade"></div>
    </div>
  {/if}
</nav>

<style>
  .nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(var(--color-background), 0.8);
    backdrop-filter: blur(16px);
    z-index: 20;
    pointer-events: auto;
    transition: opacity 0.3s;
  }

  .nav-menu {
    width: 100%;
    border-bottom: 1px solid var(--color-secondary);
    position: fixed;
    top: 0.5rem;
    left: 1.25rem;
    z-index: 25;
    font-size: var(--font-size-header);
    font-weight: var(--font-weight-light);
    text-transform: uppercase;
  }

  .nav-toggle {
    width: var(--font-size-header);
    height: var(--font-size-header);
    background: none;
    color: var(--color-primary);
    border: none;
    border-radius: var(--border-radius-small);
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
    margin-top: -1.2rem;
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
    line-height: 1.1;
    display: block;
  }

  .nav-link:hover,
  .nav-link:focus {
    color: var(--color);
    letter-spacing: 0.08em;
    background: none;
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
</style>

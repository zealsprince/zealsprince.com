<script lang="ts">
  import { fade } from "svelte/transition";
  import { page } from "$app/state";
  // No longer exporting data, since layout no longer receives navItems
</script>

<div class="layout-root">
  {#key page.url.pathname}
    <div transition:fade={{ duration: 100 }}>
      <slot />
    </div>
  {/key}
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Commissioner:wght@100..900&display=swap");

  /* Global styles */
  :global(:root) {
    --color-background: #fff;
    --color-text: #111;
    --color-primary: #333;
    --color-secondary: #257;
    --font-family: "Commissioner", sans-serif;
    --font-size-title: 8rem;
    --font-size-subtitle: 2rem;
    --font-size-header: 4rem;
    --font-size-text: 0.5rem;
    --font-weight-light: 100;
    --font-weight-normal: 400;
    --font-weight-bold: 700;
    --font-weight-black: 900;
    --border-radius-small: 0.5rem;
    --border-radius-medium: 1rem;
    --border-radius-large: 1.5rem;
    --border-radius-full: 50%;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: var(--font-family);
  }

  :global(a) {
    color: var(--color-primary);
    text-decoration: none;
  }

  :global(.tp-dfwv) {
    position: fixed !important;
    z-index: 100;
  }

  .layout-root {
    font-size: var(--font-size-medium);
    font-family: var(--font-family);

    background: var(--color-background);
    color: var(--color-text);

    z-index: -10;
  }
</style>

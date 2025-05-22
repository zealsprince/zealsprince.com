<script lang="ts">
  import "../app.scss";

  import { fade } from "svelte/transition";
  import { page } from "$app/state";
  // No longer exporting data, since layout no longer receives navItems

  let { children } = $props();
</script>

<div class="layout-root">
  {#key page.url.pathname}
    <div transition:fade={{ duration: 200 }}>
      {@render children()}
    </div>
  {/key}
</div>

<style>
  .layout-root {
    font-size: var(--font-size-medium);
    font-family: var(--font-family);

    background: var(--color-background);
    color: var(--color-text);

    transition:
      background 0.2s ease-in-out,
      color 0.2s ease-in-out;

    z-index: -10;
  }
</style>

<script lang="ts">
  import { side } from "@/lib/store/side";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  function toggleSide() {
    const current = get(side);
    const next = current === "A" ? "B" : "A";
    side.set(next);

    const path = `/${next.toLowerCase()}`;

    if (path === "/a") {
      // If the path is "/a", redirect to "/"
      goto("/");
      return;
    }

    goto(path);
  }
</script>

<button class="side-toggle" on:click={toggleSide} aria-label="Toggle A/B Side">
  {#if $side === "A"}
    <span>A-Side</span>
  {:else}
    <span>B-Side</span>
  {/if}
</button>

<style>
  .side-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    background: var(--toggle-bg, #fff);
    color: var(--toggle-fg, #111);
    border: none;
    border-radius: 2rem;
    padding: 0.5rem 1.5rem;
    font-size: 1.1rem;
    font-family: inherit;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition:
      background 0.2s,
      color 0.2s;
  }
</style>

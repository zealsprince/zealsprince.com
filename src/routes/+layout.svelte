<script lang="ts">
  import SideToggle from "@/components/ToggleSide.svelte";
  import { side } from "@/lib/store/side";
  $: currentSide = $side;
</script>

<div class={currentSide === "A" ? "side-a" : "side-b"}>
  <SideToggle />
  <slot />
</div>

<style>
  .side-a {
    --bg: #f8f9fa;
    --fg: #181a1b;

    background: var(--bg);
    color: var(--fg);
    min-height: 100vh;
    transition:
      background 0.3s,
      color 0.3s;
  }

  .side-b {
    --bg: #101014;
    --fg: #f8f9fa;

    background: var(--bg);
    color: var(--fg);
    min-height: 100vh;
    transition:
      background 0.3s,
      color 0.3s;
  }
</style>

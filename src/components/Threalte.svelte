<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { Studio } from "@threlte/studio";
  import { Theatre } from "@threlte/theatre";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { writable } from "svelte/store";
  import { onDestroy } from "svelte";

  // Accept a scene import path (relative to src)
  export let scenePath: string; // e.g. '@/scenes/SceneA.svelte'
  export let initialMode: "studio" | "theatre" | "viewer" = "viewer";

  const mode = writable(initialMode);
  let showDevBar = false;
  let containerVisible = false;

  let Scene: any = null;
  let loading = false;
  let scrollY = 0;

  async function loadScene() {
    loading = true;
    // Vite alias @/ resolves to /src
    const mod = await import(
      /* @vite-ignore */ scenePath.replace("@/", "/src/")
    );
    Scene = mod.default;
    loading = false;
  }

  function switchMode(newMode: "viewer" | "studio" | "theatre") {
    // Save the mode to localStorage so it persists across reloads
    mode.set(newMode);
    if (browser && window.location.hostname === "localhost") {
      localStorage.setItem("threalte-mode", newMode);
      // Only reload if switching away from 'viewer'
      if (currentMode !== "viewer" && newMode === "viewer") {
        window.location.reload();
      } else if (currentMode === "studio" && newMode === "theatre") {
        window.location.reload();
      } else if (currentMode === "theatre" && newMode === "studio") {
        window.location.reload();
      }
      // No reload if switching from viewer to studio/theatre
    }
  }

  function handleScroll() {
    scrollY = window.scrollY || window.pageYOffset;
  }

  onMount(() => {
    if (browser && window.location.hostname === "localhost") {
      showDevBar = true;
      // Restore mode from localStorage if present
      const saved = localStorage.getItem("threalte-mode");
      if (saved === "studio" || saved === "theatre" || saved === "viewer") {
        mode.set(saved);
      }
    }
    loadScene();
    setTimeout(() => {
      containerVisible = true;
    }, 10); // allow DOM to render, then fade in
    if (browser) {
      window.addEventListener("scroll", handleScroll);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("scroll", handleScroll);
    }
  });

  $: currentMode = $mode;
</script>

{#if showDevBar}
  <div class="threalte-dev-bar">
    <button
      on:click={() => switchMode("viewer")}
      class:active={currentMode === "viewer"}>Viewer</button
    >
    <button
      on:click={() => switchMode("studio")}
      class:active={currentMode === "studio"}>Studio</button
    >
    <button
      on:click={() => switchMode("theatre")}
      class:active={currentMode === "theatre"}>Theatre</button
    >
  </div>
{/if}

<div
  class="threalte-fade-container"
  class:visible={containerVisible}
  style="width:100vw; height:100vh; position:relative);"
>
  {#if loading}
    <div
      style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;"
    >
      Loading scene...
    </div>
  {:else if Scene}
    {#key currentMode + "-" + scenePath}
      {#if currentMode === "studio"}
        <Canvas>
          <Studio>
            <svelte:component this={Scene} editor />
          </Studio>
        </Canvas>
      {:else if currentMode === "theatre"}
        <Canvas>
          <Theatre>
            <svelte:component this={Scene} editor />
          </Theatre>
        </Canvas>
      {:else}
        <Canvas>
          <svelte:component this={Scene} cameraY={scrollY} />
        </Canvas>
      {/if}
    {/key}
  {/if}
</div>

<style>
  .threalte-dev-bar {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    background: rgba(30, 30, 30, 0.9);
    color: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    padding: 0.5rem 0.5rem;
    display: flex;
    gap: 0.5rem;
    z-index: 100;
  }

  .threalte-fade-container {
    opacity: 0;
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .threalte-fade-container.visible {
    opacity: 1;
  }

  .threalte-dev-bar button {
    background: none;
    border: none;
    color: inherit;
    font-weight: bold;
    padding: 0.3rem 1rem;
    border-radius: 1rem;
    cursor: pointer;
    opacity: 0.7;
    transition:
      background 0.2s,
      opacity 0.2s;
  }

  .threalte-dev-bar button.active,
  .threalte-dev-bar button:focus {
    background: #fff;
    color: #222;
    opacity: 1;
  }
</style>

<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { Studio } from "@threlte/studio";
  import { Theatre } from "@threlte/theatre";
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { writable } from "svelte/store";

  import Spinner from "./Spinner.svelte";
  import { sceneMap } from "../scenes/index";
  import type { SceneName } from "$/types/Scene";

  // Accept a scene import path (relative to src)
  export let scene: SceneName = "SceneIndex" as SceneName; // scene name, not path
  export let initialMode: "studio" | "theatre" | "viewer" = "viewer";
  export let editorModeActive: boolean = false; // New prop to indicate if editor context is active

  const mode = writable(initialMode);
  let showDevBar = false;
  let containerVisible = false;

  let Scene: (typeof sceneMap)[typeof scene] | null = null;
  let loading = false;
  let scrollY = 0;

  // Add mouseX and mouseY state and event handling
  let mouseX: number = 0;
  let mouseY: number = 0;

  async function loadScene() {
    loading = true;
    // Use static mapping instead of dynamic import
    Scene = sceneMap[scene] || sceneMap["SceneIndex"];
    loading = false;
  }

  function switchMode(newMode: "viewer" | "studio" | "theatre") {
    // Save the mode to localStorage so it persists across reloads
    mode.set(newMode);
    if (browser && window.location.hostname === "localhost") {
      localStorage.setItem("threalte-mode", newMode);
      // Reload logic based on mode switching (can be kept or adjusted)
      if (currentMode !== "viewer" && newMode === "viewer") {
        window.location.reload();
      } else if (currentMode === "studio" && newMode === "theatre") {
        window.location.reload();
      } else if (currentMode === "theatre" && newMode === "studio") {
        window.location.reload();
      }
    }
  }

  function exitEditorMode() {
    if (browser) {
      // Reset the mode to viewer
      localStorage.setItem("threalte-mode", "viewer");

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("editor");
      window.location.href = currentUrl.toString();
    }
  }

  function handleScroll() {
    scrollY = window.scrollY || window.pageYOffset;
  }

  function handleMouseMove(event: MouseEvent) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  onMount(() => {
    if (browser && window.location.hostname === "localhost") {
      // Dev bar is shown only if editorModeActive is true
      showDevBar = editorModeActive;

      if (editorModeActive) {
        // If not in active editor mode, restore mode from localStorage if present
        const saved = localStorage.getItem("threalte-mode");
        if (saved === "studio" || saved === "theatre" || saved === "viewer") {
          mode.set(saved);
        }
      }
    }
    loadScene();
    setTimeout(() => {
      containerVisible = true;
    }, 10); // allow DOM to render, then fade in
    if (browser) {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("mousemove", handleMouseMove);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    }
  });

  $: currentMode = $mode;
  // Pass mouseX and mouseY to all scenes
  $: sceneProps = { editor: editorModeActive, scrollY, mouseX, mouseY };
</script>

{#if showDevBar}
  <div class="threalte-dev-bar">
    <button on:click={exitEditorMode}>Exit Editor</button>
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
  class="threalte-container"
  class:visible={containerVisible}
  style="width:100vw; height:100vh; position:relative);"
>
  {#if loading}
    <div
      style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;"
    >
      <Spinner size={32} />
    </div>
  {:else if Scene}
    {#key currentMode + "-" + scene}
      {#if currentMode === "studio"}
        <Canvas>
          <Studio>
            <svelte:component this={Scene} props={sceneProps} />
          </Studio>
        </Canvas>
      {:else if currentMode === "theatre"}
        <Canvas>
          <Theatre>
            <svelte:component this={Scene} props={sceneProps} />
          </Theatre>
        </Canvas>
      {:else}
        <Canvas>
          <svelte:component this={Scene} props={sceneProps} />
        </Canvas>
      {/if}
    {/key}
  {/if}
</div>

<style>
  .threalte-dev-bar {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(30, 30, 30, 0.9);
    color: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    padding: 0.5rem 0.5rem;
    display: flex;
    gap: 0.5rem;
    z-index: 100;
  }

  .threalte-container {
    opacity: 0;
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--color-background);
  }
  .threalte-container.visible {
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

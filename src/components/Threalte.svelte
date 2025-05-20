<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { Studio } from '@threlte/studio';
  import { Theatre } from '@threlte/theatre';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { writable } from 'svelte/store';

  // Accept a scene import path (relative to src)
  export let scenePath: string; // e.g. '@/scenes/SceneA.svelte'
  export let initialMode: 'studio' | 'theatre' | 'viewer' = 'viewer';

  const mode = writable(initialMode);
  let showDevBar = false;

  let Scene: any = null;
  let loading = false;

  async function loadScene() {
    loading = true;
    // Vite alias @/ resolves to /src
    const mod = await import(/* @vite-ignore */ scenePath.replace('@/', '/src/'));
    Scene = mod.default;
    loading = false;
  }

  function switchMode(newMode: 'viewer' | 'studio' | 'theatre') {
    // Save the mode to localStorage so it persists across reloads
    mode.set(newMode);
    if (browser && window.location.hostname === 'localhost') {
      localStorage.setItem('threalte-mode', newMode);
      window.location.reload();
    }
  }

  onMount(() => {
    if (browser && window.location.hostname === 'localhost') {
      showDevBar = true;
      // Restore mode from localStorage if present
      const saved = localStorage.getItem('threalte-mode');
      if (saved === 'studio' || saved === 'theatre' || saved === 'viewer') {
        mode.set(saved);
      }
    }
    loadScene();
  });

  $: currentMode = $mode;
</script>

<div style="width:100vw; height:100vh; position:relative;">
  {#if loading}
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;">Loading scene...</div>
  {:else if Scene}
    {#key currentMode + '-' + scenePath}
      {#if currentMode === 'studio'}
        <Canvas>
          <Studio>
            <svelte:component this={Scene} />
          </Studio>
        </Canvas>
      {:else if currentMode === 'theatre'}
        <Canvas>
          <Theatre>
            <svelte:component this={Scene} />
          </Theatre>
        </Canvas>
      {:else}
        <Canvas>
          <svelte:component this={Scene} />
        </Canvas>
      {/if}
    {/key}
  {/if}

  {#if showDevBar}
    <div class="threalte-dev-bar">
      <button on:click={() => switchMode('viewer')} class:active={currentMode==='viewer'}>Viewer</button>
      <button on:click={() => switchMode('studio')} class:active={currentMode==='studio'}>Studio</button>
      <button on:click={() => switchMode('theatre')} class:active={currentMode==='theatre'}>Theatre</button>
    </div>
  {/if}
</div>

<style>
.threalte-dev-bar {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 10000;
  background: rgba(30,30,30,0.9);
  color: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  padding: 0.5rem .5rem;
  display: flex;
  gap: 0.5rem;
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
  transition: background 0.2s, opacity 0.2s;
}

.threalte-dev-bar button.active, .threalte-dev-bar button:focus {
  background: #fff;
  color: #222;
  opacity: 1;
}
</style>

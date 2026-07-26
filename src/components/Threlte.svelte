<script lang="ts">
  import type { SceneName } from '$/types/Scene'
  import { browser } from '$app/environment'
  import { Canvas } from '@threlte/core'
  import { onDestroy, onMount } from 'svelte'
  import { sceneMap } from '../scenes/index'
  import Spinner from './Spinner.svelte'

  interface Props {
    scene?: SceneName
    initialMode?: 'studio' | 'theatre' | 'viewer'
    editorModeActive?: boolean
    /** Mesh colour, driven by the page palette and active theme */
    sceneColor?: string
  }

  const {
    scene = 'SceneIndex' as SceneName,
    initialMode = 'viewer',
    editorModeActive = false,
    sceneColor = '#212429',
  }: Props = $props()

  // Deliberately $state + $effect rather than a writable $derived. The derived
  // form builds fine but leaves Scene null in a production build, so the canvas
  // never mounts. Dev is unaffected, which is what makes it easy to miss.
  // eslint-disable-next-line svelte/prefer-writable-derived
  let mode = $state(initialMode)

  $effect(() => {
    mode = initialMode
  })

  let showDevBar = $state(false)
  let containerVisible = $state(false)

  let Scene: (typeof sceneMap)[typeof scene] | null = $state(null)
  let loading = $state(false)
  let scrollY = $state(0)

  // Add mouseX and mouseY state and event handling
  let mouseX: number = $state(0)
  let mouseY: number = $state(0)

  async function loadScene() {
    loading = true
    // Use static mapping instead of dynamic import
    Scene = sceneMap[scene] || sceneMap.SceneIndex
    loading = false
  }

  function switchMode(newMode: 'viewer' | 'studio' | 'theatre') {
    const oldMode = mode
    mode = newMode
    if (browser && window.location.hostname === 'localhost') {
      localStorage.setItem('threalte-mode', newMode)
      if (oldMode !== 'viewer' && newMode === 'viewer') {
        window.location.reload()
      }
      else if (oldMode === 'studio' && newMode === 'theatre') {
        window.location.reload()
      }
      else if (oldMode === 'theatre' && newMode === 'studio') {
        window.location.reload()
      }
    }
  }

  function exitEditorMode() {
    if (browser) {
      // Reset the mode to viewer
      localStorage.setItem('threalte-mode', 'viewer')

      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.delete('editor')
      window.location.href = currentUrl.toString()
    }
  }

  function handleScroll() {
    scrollY = window.scrollY || window.pageYOffset
  }

  function handleMouseMove(event: MouseEvent) {
    mouseX = event.clientX
    mouseY = event.clientY
  }

  onMount(() => {
    if (browser && window.location.hostname === 'localhost') {
      // Dev bar is shown only if editorModeActive is true
      showDevBar = editorModeActive

      if (editorModeActive) {
        // If not in active editor mode, restore mode from localStorage if present
        const saved = localStorage.getItem('threalte-mode')
        if (saved === 'studio' || saved === 'theatre' || saved === 'viewer') {
          mode = saved
        }
      }
    }
    loadScene()
    setTimeout(() => {
      containerVisible = true
    }, 10) // allow DOM to render, then fade in
    if (browser) {
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('mousemove', handleMouseMove)
    }
  })

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  })

  const currentMode = $derived(mode)
  const sceneProps = $derived({ editor: editorModeActive, scrollY, mouseX, mouseY, color: sceneColor })
</script>

{#if showDevBar}
  <div class="threalte-dev-bar">
    <button onclick={exitEditorMode}>Exit Editor</button>
    <button
      onclick={() => switchMode('viewer')}
      class:active={currentMode === 'viewer'}>Viewer</button
    >
    <button
      onclick={() => switchMode('studio')}
      class:active={currentMode === 'studio'}>Studio</button
    >
    <button
      onclick={() => switchMode('theatre')}
      class:active={currentMode === 'theatre'}>Theatre</button
    >
  </div>
{/if}

<div
  class="threalte-container"
  class:visible={containerVisible}
  style="width:100vw; height:100vh; position:relative;"
>
  {#if loading}
    <div
      style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;"
    >
      <Spinner size={32} />
    </div>
  {:else if Scene}
    {#key `${currentMode}-${scene}`}
      {#if currentMode === 'studio'}
        {#await import('@threlte/studio') then { Studio }}
          <Canvas>
            <Studio>
              <Scene props={sceneProps} />
            </Studio>
          </Canvas>
        {/await}
      {:else if currentMode === 'theatre'}
        {#await import('@threlte/theatre') then { Theatre }}
          <Canvas>
            <Theatre>
              <Scene props={sceneProps} />
            </Theatre>
          </Canvas>
        {/await}
      {:else}
        <Canvas>
          <Scene props={sceneProps} />
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

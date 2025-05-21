<script lang="ts">
  import Gallery from "./Gallery.svelte";
  import Threalte from "./Threalte.svelte";
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  export let data: { html: string; gallery: string[]; frontmatter: any; scene: string | null };
  let content = data.html;
  let gallery = data.gallery;
  let scene = data.scene;
  let styleClass = data.frontmatter?.style ? `content-${data.frontmatter.style}` : '';
  let customStyle = data.frontmatter?.style ? `/styles/content/${data.frontmatter.style}.css` : '';
  let showHeader = false;
  onMount(() => {
    showHeader = true;
  });
</script>

{#if customStyle}
  <link rel="stylesheet" href={customStyle} />
{/if}

<div class="content-root {styleClass}">
  <div class="content-scene">
    <Threalte scenePath={`@/scenes/${scene ?? 'SceneIndex'}.svelte`} />
  </div>
  {#if showHeader}
    <div class="content-header" in:fly={{ y: 60, duration: 700, opacity: 0 }}>
      <h1 class="content-title">{data.frontmatter?.title}</h1>
      {#if data.frontmatter?.subtitle}
        <h2 class="content-subtitle">{data.frontmatter.subtitle}</h2>
      {/if}
    </div>
  {/if}
  <div style="position: relative; height: 100vh;"></div> <!-- Spacer for visualization and title overlay -->
  <div class="content-body">
    <div class="content-markdown">
      {@html content}
    </div>
      <div class="content-gallery">
        <Gallery images={gallery} />
      </div>
  </div>
</div>

<style>
  /* Base content styles */
  .content-root {
    z-index: 1;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .content-scene {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
  }

  .content-header {
    position: absolute;
    bottom: 2rem; left: 2rem;
    color: var(--color-primary);
    text-align: left;
    max-width: 80vw;
  }

  .content-title {
    font-size: var(--font-size-title);
    font-weight: 100;
    line-height: 1.2;
    text-transform: uppercase;
    margin: 0;
  }

  .content-subtitle {
    font-size: var(--font-size-subtitle);
    margin: 0.2rem 0 2rem 0;
    font-weight: 400;
  }

  .content-body {
    z-index: 5;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 1.5rem;
  }

  .content-markdown {
    flex: 2 1 0;
    max-width: 50vw;
    text-align: justify;
    color: var(--color-text);
    border-radius: 1rem;
    padding: 2rem;
  }

  .content-gallery {
    flex: 1 1 0;
    min-width: 250px;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 1200px) {
    .content-header {
      max-width: 60vw;
    }

    .content-body {
      flex-direction: column;
      align-items: stretch;
      gap: 2rem;
    }

    .content-markdown {
      max-width: 60vw;
    }
  }


  @media (max-width: 900px) {
    .content-header {
      max-width: none;
    }

    .content-body {
      flex-direction: column;
      align-items: stretch;
      gap: 1.5rem;
    }

    .content-markdown {
      max-width: none;
    }
  }

  @media (max-width: 600px) {
    .content-title {
      font-size: var(--font-size-header);
    }

    .content-subtitle {
      font-size: var(--font-size-text);
    }

    .content-body {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
  }

  @media (max-width: 400px) {
    .content-title {
      font-size: var(--font-size-subtitle);
    }

    .content-subtitle {
      font-size: var(--font-size-text);
    }
  }
</style>

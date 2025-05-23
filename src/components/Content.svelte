<script lang="ts">
  import Gallery from "./Gallery.svelte";
  import Threalte from "./Threlte.svelte";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import Links from "./Links.svelte";
  import type { RawLink, GalleryItem } from "$types/Content";
  import { base } from "$app/paths";
  import { SceneName } from "$/types/Scene";

  export let data: {
    html: string;
    gallery: GalleryItem[];
    frontmatter: any;
    scene: string | null;
    links: RawLink[];
  };
  export let editor: boolean = false; // New prop to control editor mode

  // Variables for non-editor mode
  let content = "";
  let gallery: GalleryItem[] = [];
  let styleClass = "";
  let customStyle = "";
  let minifyHeader: boolean = false;

  // Scene is used in both modes
  let scene: SceneName = (data.scene as SceneName) ?? SceneName.SceneIndex;

  $: {
    styleClass = data.frontmatter?.style
      ? `content-${data.frontmatter.style}`
      : "";

    customStyle = data.frontmatter?.style
      ? `${base}/styles/content/${data.frontmatter.style}.css`
      : "";

    if (!editor) {
      content = data.html || "";
      gallery = data.gallery || [];
    } else {
      // Reset or set defaults for editor mode if necessary
      content = "";
      gallery = [];
    }
  }

  function handleScroll() {
    if (editor) return; // No scroll handling for header in editor mode
    const scrollY = window.scrollY || window.pageYOffset;
    const hideThreshold = window.innerHeight * 0.8;
    minifyHeader = scrollY > hideThreshold;
  }

  onMount(() => {
    if (editor) return; // No scroll listener setup in editor mode

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

{#if customStyle}
  <link rel="stylesheet" href={customStyle} />
{/if}

{#if editor}
  <!-- Editor Mode: Only Threalte, configured for editing -->
  <div class="content-root content-editor-mode">
    <Threalte {scene} editorModeActive={true} />
  </div>
{:else}
  <!-- Default Content Display -->
  <div class="content-root {styleClass}">
    <div class="content-scene">
      <Threalte {scene} />
    </div>
    {#if !minifyHeader}
      <div
        class="content-header"
        in:fly={{ y: -60, duration: 700, opacity: 0 }}
        out:fly={{ y: -60, duration: 200, opacity: 0 }}
      >
        <h1 class="content-title">{data.frontmatter?.title}</h1>
        {#if data.frontmatter?.subtitle}
          <h2 class="content-subtitle">{data.frontmatter.subtitle}</h2>
        {/if}
      </div>
    {:else}
      <h1
        class="content-title-fixed"
        transition:fly={{ y: 20, duration: 200, opacity: 0 }}
      >
        {data.frontmatter?.title}
      </h1>
    {/if}
    <div style="position: relative; height: 100vh;"></div>
    <!-- Spacer for visualization and title overlay -->
    <div class="content-body">
      <div class="content-markdown">
        {@html content}
      </div>
      <div class="content-gallery">
        <Gallery images={gallery} />
      </div>
    </div>
    <!-- Social Links: bottom right -->
    {#if !minifyHeader && !editor}
      <Links links={data.links} />
    {/if}
  </div>
{/if}

<style lang="scss">
  @use "@/vars.scss" as vars;

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
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  .content-header {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    color: var(--color-primary);
    text-align: left;
    max-width: 80vw;
  }

  .content-title {
    font-size: var(--font-size-xl);
    font-weight: 100;
    line-height: 1.2;
    text-transform: uppercase;
    margin: 0;
    width: 100%;
    max-width: var(--content-text-max-width);
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    filter: drop-shadow(16px 4px 0 var(--color-background));
  }

  .content-title-fixed {
    position: fixed;
    top: 1.5rem;
    right: 2rem;
    color: var(--color-primary);
    text-align: right;
    max-width: 70vw;
    font-size: var(--font-size-md);
    font-weight: 100;
    line-height: var(--font-size-subtitle);
    text-transform: uppercase;
    margin: 0;
    z-index: 100;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .content-subtitle {
    font-weight: var(--font-weight-light);
    font-size: var(--font-size-md);
    margin: 0.2rem 0 0 0;
    font-weight: 400;
  }

  .content-body {
    border-top: 1px solid var(--color-secondary);
    background: color-mix(in srgb, var(--color-background) 60%, transparent);
    backdrop-filter: blur(16px);
    z-index: 5;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    min-height: calc(100vh - 128px);
    width: 100%;
    gap: 1.5rem;
  }

  .content-markdown {
    flex: 2 1 0;
    max-width: var(--content-text-max-width);
    text-align: justify;
    color: var(--color-text);
    border-radius: 1rem;
    padding: 2rem;
  }

  .content-gallery {
    flex: 1 1 0;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Styles for editor mode to ensure Threalte can take full space if needed */
  .content-editor-mode {
    width: 100vw;
    height: 100vh;
    display: flex; /* Ensure Threalte can expand */
    align-items: stretch;
    justify-content: stretch;
  }
  .content-editor-mode > :global(div) {
    /* Target Threalte's wrapper */
    flex-grow: 1;
  }

  @media (max-width: vars.$breakpoint-xl) {
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

  @media (max-width: vars.$breakpoint-lg) {
    .content-title {
      font-size: var(--font-size-lg);
    }

    .content-subtitle {
      font-size: var(--font-size-sm);
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

  @media (max-width: vars.$breakpoint-md) {
    .content-body {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
  }

  @media (max-width: vars.$breakpoint-sm) {
    .content-title {
      font-size: var(--font-size-md);
    }
  }
</style>

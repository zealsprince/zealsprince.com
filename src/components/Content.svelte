<script lang="ts">
  import { page } from "$app/stores";
  import { onDestroy } from "svelte";
  import { get } from "svelte/store";
  import Gallery from "./Gallery.svelte";
  export let data: { html: string; gallery: string[]; frontmatter: any };

  let content = data.html;
  let gallery = data.gallery;
</script>

{#if gallery.length}
  <Gallery images={gallery} />
{/if}

<div class="markdown-content">
  {@html content}
</div>

<style>
  .markdown-content {
    text-align: left;
    max-width: 800px;
    margin: 0 auto;
  }
</style>

<script lang="ts">
  import type { GalleryItem } from "@/types/Content";
  export let images: GalleryItem[] = [];
</script>

{#if images.length}
  <div class="gallery">
    {#each images as img}
      <a href={img.link ?? img.url} target="_blank" rel="noopener">
        <img src={img.image} alt={img.title || "Gallery"} />
      </a>
    {/each}
  </div>
{/if}

<style lang="scss">
  @use "@/vars.scss" as vars;
  .gallery {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin: 2rem 0;
    gap: 1rem 1rem;
    max-width: 1100px;
  }

  .gallery a {
    display: block;
  }

  .gallery a:last-child {
    align-self: flex-start;
  }

  .gallery img {
    padding: 0.5rem;
    max-width: 360px;
    min-width: 360px;
    min-height: 224px;
    height: 224px;
    width: 360px;
    object-fit: cover;
    margin: 0;
    display: block;
    filter: drop-shadow(8px 8px 0.5rem rgba(0, 0, 0, 0.1));
  }

  @media (max-width: vars.$breakpoint-lg) {
    .gallery {
      justify-content: center;
      margin: 0;
    }

    .gallery a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    .gallery img {
      max-width: 100%;
      min-width: 100%;
      width: inherit;
      height: inherit;
      padding: 0;
    }
  }
</style>

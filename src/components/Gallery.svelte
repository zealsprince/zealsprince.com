<script lang="ts">
  import type { GalleryItem } from "$types/Content";
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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    align-items: flex-start;
    padding: 0 2rem;
    margin: 2rem 0;
  }

  .gallery a {
    position: relative;
    display: block;

    &::last-child {
      align-self: flex-start;
    }

    &:before {
      content: "";
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      position: absolute;
      background: color-mix(in srgb, var(--color-background) 100%, transparent);
      mix-blend-mode: hue;
      transition: all 0.2s ease-in-out;
      z-index: 10;
    }

    &:hover:before {
      background: none;
    }
  }

  .gallery img {
    border: 1px solid var(--color-primary);
    padding: 0.4rem;
    aspect-ratio: 16 / 10;
    height: 100%;
    width: 100%;
    object-fit: cover;
    margin: 0;
    display: block;
    filter: drop-shadow(8px 8px 0.5rem rgba(0, 0, 0, 0.1));
  }

  @media (max-width: vars.$breakpoint-xl) {
    .gallery {
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      justify-content: space-between;
    }

    .gallery img {
      padding: 0rem;
    }
  }

  @media (max-width: vars.$breakpoint-lg) {
    .gallery {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0;
      padding: 0;
    }

    .gallery a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      &:before {
        background: none;
      }
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

<script lang="ts">
  import type { GallerySection } from "$types/Content";
  export let images: GallerySection[] = [];
</script>

{#if images.length}
  {#each images as section}
    <div class="gallery">
      {#if section.name && section.showName !== false}
        <h1 class="gallery-name">{section.name}</h1>
      {/if}
      <div class="gallery-section">
        {#each section.items as img}
          <a href={img.url ?? img.image} target="_blank" rel="noopener">
            <img src={img.image} alt={img.name || "Gallery"} />
          </a>
        {/each}
      </div>
    </div>
  {/each}
{/if}

<style lang="scss">
  @use "@/vars.scss" as vars;

  .gallery-name {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-light);
    margin: 1rem 0 0 2rem;
    color: var(--color-primary);
    text-transform: uppercase;

    display: flex;
    align-items: center;

    &::after {
      content: "";
      flex: 1;
      height: 1px;
      background-color: var(--color-secondary);
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }

  .gallery-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    align-items: flex-start;
    padding: 0 2rem;
    margin: 1rem 0;
  }

  .gallery-section a {
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

  .gallery-section img {
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
    .gallery-name {
      margin-bottom: 1rem;

      &::after {
        margin-right: 2rem;
      }
    }

    .gallery-section {
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      justify-content: space-between;
    }

    .gallery-section img {
      padding: 0rem;
    }
  }

  @media (max-width: vars.$breakpoint-lg) {
    .gallery-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0;
      padding: 0;
    }

    .gallery-section a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      &:before {
        background: none;
      }
    }

    .gallery-section img {
      max-width: 100%;
      min-width: 100%;
      width: inherit;
      height: inherit;
      padding: 0;
    }
  }
</style>

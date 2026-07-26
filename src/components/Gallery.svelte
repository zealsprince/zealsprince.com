<script lang="ts">
  import type { GallerySection } from '$types/Content'

  interface Props {
    images?: GallerySection[]
  }

  const { images = [] }: Props = $props()
</script>

{#if images.length}
  {#each images as section, index (section.name ?? index)}
    <div class="gallery">
      {#if section.name}
        <h2 class="gallery-name">{section.name}</h2>
      {/if}
      <div class="gallery-section">
        {#each section.items as img (img.image)}
          <a href={img.url ?? img.image} target="_blank" rel="noopener">
            <img src={img.image} alt={img.name || 'Gallery'} />
          </a>
        {/each}
      </div>
    </div>
  {/each}
{/if}

<style lang="scss">
  @use "@/vars.scss" as vars;

  .gallery-name {
    font-size: calc(var(--font-size-md) * 0.72);
    font-weight: var(--font-weight-light);
    margin: 0 0 var(--space-md);
    color: var(--color-text);
    text-transform: uppercase;

    display: flex;
    align-items: center;

    &::after {
      content: "";
      flex: 1;
      height: 1px;
      background-color: var(--color-secondary);
      margin-left: var(--space-sm);
    }
  }

  /* No padding of its own: the shell around it already provides the gutter, and
     adding more here is what pushed the grid past the edge of the page. The
     track minimum is capped at 100% so a column can never be wider than the
     column it has to fit in. */
  .gallery-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: var(--space-md);
    align-items: flex-start;
    margin: 0 0 var(--space-lg);
  }

  .gallery-section a {
    position: relative;
    display: block;

    &:last-child {
      align-self: flex-start;
    }

    &:before {
      content: "";
      padding: 0.5rem;
      width: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      position: absolute;
      background: var(--gallery-mix-expression);
      mix-blend-mode: hue;
      transition: all 0.2s ease-in-out;
      z-index: 10;
    }

    &:hover:before {
      background: none;
    }
  }

  .gallery-section img {
    border-radius: var(--border-radius);
    border: 1px solid var(--color-primary);
    padding: var(--gallery-img-padding);
    aspect-ratio: 16 / 10;
    height: 100%;
    width: 100%;
    object-fit: cover;
    margin: 0;
    display: block;
    filter: drop-shadow(8px 8px 0.5rem rgba(0, 0, 0, 0.1));
  }

  @media (max-width: vars.$breakpoint-lg) {
    .gallery-section {
      grid-template-columns: 1fr;
    }

    .gallery-section a:before {
      background: none;
    }

    .gallery-section img {
      padding: 0;
    }
  }
</style>

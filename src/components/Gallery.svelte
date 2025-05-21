<script lang="ts">
  export let images: string[] = [];
</script>

{#if images.length}
  <div class="gallery">
    {#each images as img}
      <img src={img} alt="Gallery" />
    {/each}
  </div>
{/if}

<style>
  .gallery {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 2rem 0;
  }

  .gallery img {
    border: 1px solid var(--color-primary);
    padding: 0.5rem;
    max-width: 100%;
    min-width: 320px;
    min-height: 224px;
    height: auto;
    margin: 0.5rem;
  }
</style>

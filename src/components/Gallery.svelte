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
    max-width: 100%;
    height: auto;
    margin: 0.5rem;
    border-radius: 8px;
  }
</style>

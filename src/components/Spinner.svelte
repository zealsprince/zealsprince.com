<script lang="ts">
  export let size: number = 40;
</script>

<div
  class="spinner"
  style="--size: {size}px;"
  aria-label="Loading..."
  role="status"
></div>

<style>
  .spinner {
    display: inline-block;
    width: var(--size);
    height: var(--size);
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>

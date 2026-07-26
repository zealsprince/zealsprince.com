<script lang="ts">
  import { theme } from '$/lib/client/theme.svelte'
  import { browser } from '$app/environment'
  import { Moon, Sun } from '@lucide/svelte'
  import { onMount } from 'svelte'

  const isDark = $derived(theme.current === 'dark')

  onMount(() => {
    if (!browser)
      return

    // Track the OS setting until the visitor picks a side themselves
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => theme.follow(e.matches ? 'dark' : 'light')

    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  })
</script>

<button
  class="theme-toggle"
  onclick={() => theme.toggle()}
  aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
  aria-pressed={isDark}
  title={isDark ? 'Light' : 'Dark'}
>
  {#if isDark}
    <Sun size={16} />
  {:else}
    <Moon size={16} />
  {/if}
</button>

<style lang="scss">
  /* Bare, like the menu toggle opposite it. The disc and its blur were there
     from when this floated over the scene; inside the chrome bar the bar
     already provides the backdrop and the disc just read as a stray chip. */
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;

    color: var(--color-primary);
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-link);
    }

    &:focus-visible {
      outline: 2px solid var(--color-link);
      outline-offset: 4px;
    }
  }
</style>

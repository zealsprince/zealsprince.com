<script lang="ts">
  import type { Crumb } from '$types/Content'

  interface Props {
    crumbs?: Crumb[]
    /** The current page, the last and unlinked step. */
    current?: string
  }

  const { crumbs = [], current = '' }: Props = $props()
</script>

<!--
  The trail that rides in the top bar once the hero has scrolled away. It
  replaces what used to be a lone repeated heading: same job of telling you
  where you are, but it also says what this page sits under and gives you a way
  back up without opening the menu.
-->
<nav class="trail" aria-label="Breadcrumb">
  <ol>
    {#each crumbs as crumb (crumb.slug)}
      <li>
        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
        <a href={crumb.href}>{crumb.label}</a>
        <span class="sep" aria-hidden="true">/</span>
      </li>
    {/each}
    {#if current}
      <li class="current" aria-current="page">{current}</li>
    {/if}
  </ol>
</nav>

<style lang="scss">
  @use "@/vars.scss" as vars;

  .trail {
    max-width: min(60vw, 40rem);
    min-width: 0;
  }

  ol {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    gap: var(--space-2xs);
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-light);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
    overflow: hidden;
  }

  li {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    min-width: 0;
  }

  .sep {
    color: var(--color-secondary);
  }

  .current {
    color: var(--color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a {
    color: var(--color-text);
    opacity: 0.7;
    transition: opacity 0.2s ease, color 0.2s ease;

    &:hover {
      opacity: 1;
      color: var(--color-link) !important;
    }
  }

  // On small screens the ancestors are the first thing to go, not the page name
  @media (max-width: vars.$breakpoint-md) {
    li:not(.current) {
      display: none;
    }
  }
</style>

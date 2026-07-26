<script lang="ts">
  import type { RawLink } from '$types/Content'
  import { SITE_AUTHOR, SITE_NAME } from '$/lib/site'
  import Links from './Links.svelte'

  interface Props {
    links?: RawLink[]
  }

  const { links = [] }: Props = $props()
</script>

<!--
  The page used to simply stop after the last paragraph. The links appear twice
  on purpose: once under the hero for anyone who never scrolls, and again here
  for anyone who read to the end and is deciding where to go next.

  No year. A bare year is not a copyright notice, it is just a date sitting
  there, and the page already carries a real one in its metadata.
-->
<footer class="footer">
  <div class="shell inner">
    <p class="brand">
      <span class="name">{SITE_NAME}</span>
      <span class="sep">&middot;</span>
      <span class="meta">{SITE_AUTHOR}</span>
    </p>

    {#if links.length > 0}
      <Links {links} inline />
    {/if}
  </div>
</footer>

<style lang="scss">
  @use "@/vars.scss" as vars;

  .footer {
    width: 100%;
    border-top: 1px solid var(--color-secondary);
    padding-block: var(--space-md);
    margin-top: var(--space-2xl);
  }

  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    margin: 0;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  .name {
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .sep,
  .meta {
    color: var(--color-text);
    opacity: 0.6;
  }

  @media (max-width: vars.$breakpoint-md) {
    .inner {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-sm);
    }
  }
</style>

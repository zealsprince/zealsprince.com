<script lang="ts">
  import type { RawLink } from '$types/Content'

  import type { Component } from 'svelte'

  import {
    Si500px,
    SiArtstation,
    SiDeviantart,
    SiGithub,
    SiInstagram,
    SiSteam,
    SiX,
  } from '@icons-pack/svelte-simple-icons'
  import {
    Box,
    FileUser,
    Globe,
    Link,
    Mail,
    Rss,
  } from '@lucide/svelte'

  interface Props {
    links?: RawLink[]
  }

  const { links = [] }: Props = $props()

  interface ProcessedLink {
    href: string
    label: string
    iconComponent: any | null
  }

  // Map icon names to actual Svelte components
  const iconMap: Record<string, Component | any> = {
    'default': Globe,
    '500px': Si500px,
    'artstation': SiArtstation,
    'blog': Rss,
    'box': Box,
    'cv': FileUser,
    'deviantart': SiDeviantart,
    'email': Mail,
    'github': SiGithub,
    'instagram': SiInstagram,
    'linkedin': Link,
    'steam': SiSteam,
    'twitter': SiX,
    'x': SiX,
  }

  const processedLinks: ProcessedLink[] = $derived.by(() => {
    if (!links)
      return []

    const result = links
      .map((link) => {
        let iconComponent = iconMap[link.icon ? link.icon.toLowerCase() : 'default']
        if (!iconComponent)
          iconComponent = iconMap.default
        return {
          href: link.url,
          label: link.name,
          iconComponent: iconComponent || null,
        }
      })
      .filter(link => link.iconComponent !== null)

    // Add custom editor link in development mode
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('editor', 'true')
      result.push({
        href: url.toString(),
        label: 'Editor',
        iconComponent: Box,
      })
    }

    return result
  })
</script>

{#if processedLinks.length > 0}
  <div class="social-links">
    {#each processedLinks as link (link.href)}
      <a
        href={link.href}
        target="_blank"
        rel="noopener"
        aria-label={link.label}
      >
        {#if link.iconComponent}
          {@const IconComponent = link.iconComponent}
          <IconComponent size={16} title={link.label} />
        {/if}
      </a>
    {/each}
  </div>
{/if}

<style lang="scss">
  .social-links {
    position: absolute;
    bottom: 3rem;
    right: 3rem;
    display: flex;
    flex-direction: row;
    gap: 1.2rem;
    z-index: 10;
    background: none;
    pointer-events: auto;
  }
  .social-links a {
    color: var(--color-primary);
    opacity: 0.8;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background-color: var(--color-background);
    backdrop-filter: blur(16px);
    border-radius: 50%;
    width: 32px;
    height: 32px;
  }
  .social-links a:hover {
    opacity: 1;
    transform: scale(1.1);
    color: var(--color-link) !important;
    background-color: rgba(255, 255, 255, 0.25);
  }

  @media (max-width: 900px) {
    .social-links {
      bottom: 2.25rem;
      right: 2.25rem;
      flex-direction: column;
    }
  }
</style>

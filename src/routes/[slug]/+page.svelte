<script lang="ts">
  import type { PageData } from '$types/Content'
  import Content from '$/components/Main.svelte'
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import Navigation from '$components/Navigation.svelte'

  const { data }: { data: PageData } = $props()
  const navItems = $derived(data?.navItems ?? [])

  const editor = browser
    ? page.url.searchParams.get('editor') === 'true'
    : false
</script>

{#if !editor}
  <Navigation items={navItems} />
{/if}
<Content {data} {editor} />

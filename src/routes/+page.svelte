<script lang="ts">
  import NavMenu from "$components/NavMenu.svelte";
  import Content from "$components/Content.svelte";
  import type { PageData } from "$types/Content";

  export let data: PageData;
  let navItems = data?.navItems ?? [];

  import { page } from "$app/state";
  import { browser } from "$app/environment";

  const editor = browser
    ? page.url.searchParams.get("editor") === "true"
    : false;
</script>

{#if !editor}
  <NavMenu items={navItems} />
{/if}
<Content {data} {editor} />

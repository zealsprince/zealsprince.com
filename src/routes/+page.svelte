<script lang="ts">
  import Navigation from "$components/Navigation.svelte";
  import Main from "$/components/Main.svelte";
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
  <Navigation items={navItems} />
{/if}
<Main {data} {editor} />

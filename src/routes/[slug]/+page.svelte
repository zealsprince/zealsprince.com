<script lang="ts">
  import NavMenu from "$components/NavMenu.svelte";
  import Content from "$components/Content.svelte";

  import type { PageData } from "$types/Content";

  export let data: PageData;
  let navItems = data?.navItems ?? [];
</script>

{#if !data.editor}
  <NavMenu items={navItems} />
{/if}
<Content {data} editor={data.editor} />

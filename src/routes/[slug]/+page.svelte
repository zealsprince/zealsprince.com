<script lang="ts">
  import NavMenu from "@/components/NavMenu.svelte";
  import Content from "@/components/Content.svelte";
  export let data: {
    html: string;
    gallery: string[];
    frontmatter: any;
    scene: string | null;
    navItems: any[];
    editor: boolean;
  };
  let navItems = data?.navItems ?? [];
</script>

{#if !data.editor}
  <NavMenu items={navItems} />
{/if}
<Content {data} editor={data.editor} />

<script lang="ts">
  import NavMenu from "@/components/NavMenu.svelte";
  import Content from "@/components/Content.svelte";
  export let data: { html: string; gallery: string[]; frontmatter: any; scene: string | null; navItems: any[] };
  let navItems = data?.navItems ?? [];
</script>

<NavMenu items={navItems} />
<Content {data} />

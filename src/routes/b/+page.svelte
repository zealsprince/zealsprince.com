<script lang="ts">
  import Content from "@/components/Content.svelte";
  export let data: { html: string; gallery: string[]; frontmatter: any };
</script>

<div id="landing-visual"></div>

<Content {data} />

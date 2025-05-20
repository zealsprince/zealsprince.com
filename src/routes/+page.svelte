<script lang="ts">
  import Content from "@/components/Content.svelte";
  import Threalte from "@/components/Threalte.svelte";
  export let data: { html: string; gallery: string[]; frontmatter: any };
</script>

<div id="landing-visual" style="width:100vw; height:100vh; position:relative;">
  <Threalte scenePath="@/scenes/SceneA.svelte" />
</div>
<Content {data} />

<script lang="ts">
  import type { SceneProps } from "$/types/Scene";
  import { T } from "@threlte/core";

  // svelte-ignore export_let_unused
  export let props: SceneProps;
</script>

<T.PerspectiveCamera
  position={[10, 10, 10]}
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0);
  }}
/>

<script lang="ts">
  import { T } from "@threlte/core";
</script>

<T.PerspectiveCamera
  position={[10, 10, 10]}
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0);
  }}
/>

<script lang="ts">
  import { T } from '@threlte/core'
</script>

<T.PerspectiveCamera
  position={[10, 10, 10]}
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0)
  }}
/>

<T.Mesh position={[ -2.7, 1.1, -0.2 ]}>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshBasicMaterial color="red" />
</T.Mesh>

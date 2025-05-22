<script lang="ts">
  import { T } from '@threlte/core'
</script>

<T.PerspectiveCamera
  position={[10, 10, 10]}
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0)
  }}
/>

<T.Mesh position={[ -2.2, 1.3, 1.3 ]} receiveShadow castShadow>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshBasicMaterial color="#80ff00" transparent={false} reflectivity={1} alphaHash={false} />
</T.Mesh>

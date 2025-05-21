<script lang="ts">
  import { T } from "@threlte/core";
  import { useThrelte } from "@threlte/core";
  import { onMount, onDestroy } from "svelte";

  export let cameraY: number = 0;
  export let editor: boolean = false;

  let mouseX: number = 0;
  let mouseY: number = 0;

  const { invalidate, size } = useThrelte();

  function handleMouseMove(event: MouseEvent) {
    if (editor) return;
    mouseX = event.clientX;
    mouseY = event.clientY;
    invalidate();
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      // Listener is always active, but handleMouseMove checks editor mode
      window.addEventListener("mousemove", handleMouseMove);
    }
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", handleMouseMove);
    }
  });

  $: if (cameraY && !editor) {
    invalidate();
  }

  $: cameraX = editor ? 0 : mouseX / $size.width - 0.5;

  $: cameraMouseOffsetY = editor ? 0 : mouseY / $size.height - 0.5;

  // When in editor mode, Y is fixed. Otherwise, it combines scroll and mouse.
  $: finalCameraY = editor ? 1 : 1 + cameraY / 500 + cameraMouseOffsetY;
</script>

<T.PerspectiveCamera
  makeDefault
  position={[cameraX, finalCameraY, 5]}
  lookAt={[0, 0, 0]}
  visible
  frustumCulled
/>

<T.Scene position={[0, 0, 0]}>
  <T.Light
    color="white"
    intensity={1}
    distance={10}
    decay={2}
    angle={0.15}
    penumbra={1}
    castShadow={true}
    position={[3.6, 3.7, 3]}
  />

  <T.Mesh position={[1.5, 1.5, 0]} receiveShadow castShadow>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshBasicMaterial color="red" transparent={false} reflectivity={1} />
  </T.Mesh>
</T.Scene>

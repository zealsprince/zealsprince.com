<script lang="ts">
  import { lerp } from "$/lib/client/math";
  import type { SceneProps } from "$/types/Scene";
  import { T } from "@threlte/core";
  import { useThrelte, useTask } from "@threlte/core";
  import { onMount } from "svelte";

  export let props: SceneProps;

  const { size } = useThrelte();

  let cubeRotation = 0;

  let smoothMouseX = 0;
  let smoothMouseY = 0;
  const smoothFactor = 0.001; // Lower is slower, higher is snappier

  function initalizeScene() {
    const numCubes = Math.floor(randomBetween(8, 32));
    cubes = Array.from({ length: numCubes }, () => ({
      position: [
        randomBetween(-6, 6),
        randomBetween(-6, 6),
        randomBetween(-4, -12),
      ],
      color: "black",
      size: randomBetween(0.25, 1.5),
    }));
  }

  // Create an animation task using Threlte's scheduler
  const { start } = useTask("cube-animation", (delta) => {
    if (props.editor) return;

    smoothMouseX = lerp(smoothMouseX, props.mouseX, smoothFactor);
    smoothMouseY = lerp(smoothMouseY, props.mouseY, smoothFactor);

    // Use delta time to make rotation frame-rate independent
    cubeRotation += 0.05 * delta;
  });

  onMount(() => {
    if (typeof window !== "undefined") {
      initalizeScene();
      start();
    }
  });

  $: cameraX = props.editor ? 0 : smoothMouseX / $size.width - 0.5;

  $: cameraMouseOffsetY = props.editor ? 0 : smoothMouseY / $size.height - 0.5;

  // When in editor mode, Y is fixed. Otherwise, it combines scroll and mouse.
  $: finalCameraY = props.editor
    ? 1
    : 1 + props.scrollY / 500 + cameraMouseOffsetY;

  // Generate random cubes on mount
  type Cube = {
    position: [number, number, number];
    color: string;
    size: number;
  };

  let cubes: Cube[] = [];

  function randomBetween(a: number, b: number) {
    return Math.random() * (b - a) + a;
  }
</script>

<T.PerspectiveCamera
  makeDefault
  position={[cameraX, finalCameraY, 0]}
  lookAt={[0, 0, 0]}
  visible
  frustumCulled
  scale={[1, 1, 1.3]}
/>

<T.Scene position={[0, 0, 0]}>
  {#each cubes as cube, i}
    <T.Mesh
      position={cube.position}
      rotation={[0, i + cubeRotation * (i / 10), i + cubeRotation * (i / 10)]}
      scale={[cube.size, cube.size, cube.size]}
      receiveShadow
      castShadow
    >
      <T.BoxGeometry args={[1, 1, 1]} />
      <T.MeshBasicMaterial
        color={cube.color}
        transparent={false}
        reflectivity={1}
      />
    </T.Mesh>
  {/each}
</T.Scene>

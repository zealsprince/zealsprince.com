<script lang="ts">
  import { lerp } from "$/lib/client/math";
  import type { SceneProps } from "$/types/Scene";
  import { T } from "@threlte/core";
  import { useThrelte } from "@threlte/core";
  import { onMount, onDestroy } from "svelte";

  export let props: SceneProps;

  const { invalidate, size } = useThrelte();

  let cubeRotation = 0;
  let animationFrameId: number;

  let smoothMouseX = 0;
  let smoothMouseY = 0;
  const smoothFactor = 0.001; // Lower is slower, higher is snappier

  function start() {
    // Generate random number of cubes (3-15)
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

  function animate() {
    if (props.editor) return;

    smoothMouseX = lerp(smoothMouseX, props.mouseX, smoothFactor);
    smoothMouseY = lerp(smoothMouseY, props.mouseY, smoothFactor);

    cubeRotation += 0.0005;

    invalidate();

    animationFrameId = requestAnimationFrame(animate);
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      start();

      animationFrameId = requestAnimationFrame(animate);
    }
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      cancelAnimationFrame(animationFrameId);
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

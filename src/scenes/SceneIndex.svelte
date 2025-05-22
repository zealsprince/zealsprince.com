<script lang="ts">
  import { T } from "@threlte/core";
  import { useThrelte } from "@threlte/core";
  import { onMount, onDestroy } from "svelte";
  import type { SceneProps } from ".";

  export let props: SceneProps;

  let mouseX: number = 0;
  let mouseY: number = 0;

  const { invalidate, size } = useThrelte();

  function handleMouseMove(event: MouseEvent) {
    if (props.editor) return;
    mouseX = event.clientX;
    mouseY = event.clientY;
    invalidate();
  }

  let cubeRotation = 0;
  let animationFrameId: number;

  function animate() {
    cubeRotation += 0.0005;
    invalidate();
    animationFrameId = requestAnimationFrame(animate);
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      // Listener is always active, but handleMouseMove checks editor mode
      window.addEventListener("mousemove", handleMouseMove);

      // Generate random number of cubes (3-15)
      const numCubes = Math.floor(randomBetween(8, 32));
      cubes = Array.from({ length: numCubes }, () => ({
        position: [
          randomBetween(-6, 6),
          randomBetween(-6, 6),
          randomBetween(-4, -12),
        ],
        color: "red",
        size: randomBetween(0.25, 1.5),
      }));
      animationFrameId = requestAnimationFrame(animate);
    }
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    }
  });

  $: if (props.scrollY && !props.editor) {
    invalidate();
  }

  $: cameraX = props.editor ? 0 : mouseX / $size.width - 0.5;

  $: cameraMouseOffsetY = props.editor ? 0 : mouseY / $size.height - 0.5;

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
  <T.AmbientLight color="white" intensity={0.42} position={[ 0, 0, 0 ]} />

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

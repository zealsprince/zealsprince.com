<script lang="ts">
  import type { SceneProps } from "$/types/Scene";
  import { T } from "@threlte/core";
  import { useThrelte, useTask } from "@threlte/core";
  import { onMount } from "svelte";

  export let props: SceneProps;

  const { size } = useThrelte();

  let cubeRotation = 0;

  let mouseInfluence = 4;
  let smoothMouseX = 0;
  let smoothMouseY = 0;
  let velocityX = 0;
  let velocityY = 0;
  const friction = 0.9; // Higher values (closer to 1) mean less friction
  const acceleration = 0.01; // How quickly to accelerate toward the target

  function initalizeScene() {
    const numCubes = 48;
    cubes = Array.from({ length: numCubes }, () => ({
      position: [
        randomBetween(-6, 6),
        randomBetween(-8, 8),
        randomBetween(-4, -16),
      ],
      color: "#212429",
      size: randomBetween(0.25, 1.5),
      wireframe: Math.random() > 0.5, // Randomly determine if wireframe or solid
    }));
  }

  // Create an animation task using Threlte's scheduler
  const { start } = useTask("cube-animation", (delta) => {
    if (props.editor) return;

    // Calculate distance between current and target position
    const distanceX = props.mouseX - smoothMouseX;
    const distanceY = props.mouseY - smoothMouseY;

    // Add acceleration to velocity based on distance
    velocityX += distanceX * acceleration;
    velocityY += distanceY * acceleration;

    // Apply friction to slow down movement
    velocityX *= friction;
    velocityY *= friction;

    // Update position with velocity
    smoothMouseX += velocityX;
    smoothMouseY += velocityY;

    // Use delta time to make rotation frame-rate independent
    cubeRotation += 0.05 * delta;
  });

  onMount(() => {
    if (typeof window !== "undefined") {
      initalizeScene();
      start();
    }
  });

  $: cameraX = props.editor
    ? 0
    : smoothMouseX / $size.width - 0.5 * mouseInfluence;

  $: cameraMouseOffsetY = props.editor
    ? 0
    : smoothMouseY / $size.height - 0.5 * mouseInfluence;

  // When in editor mode, Y is fixed. Otherwise, it combines scroll and mouse.
  $: finalCameraY = props.editor
    ? 1
    : 1 + props.scrollY / 500 + cameraMouseOffsetY;

  // Generate random cubes on mount
  type Cube = {
    position: [number, number, number];
    color: string;
    size: number;
    wireframe: boolean;
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
        wireframe={cube.wireframe}
      />
    </T.Mesh>
  {/each}
</T.Scene>

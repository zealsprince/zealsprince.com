<script lang="ts">
  import type { SceneProps } from "$/types/Scene";
  import { T } from "@threlte/core";
  import { useThrelte, useTask } from "@threlte/core";
  import { onMount } from "svelte";

  // Import the shaders
  import fragmentShader from "$/shaders/index.glsl";
  import { randomBetween } from "$/lib/client/math";

  export let props: SceneProps;

  const { size } = useThrelte();

  let smoothMouseX = 0;
  let smoothMouseY = 0;

  const softVariation = randomBetween(0, 1) > 0.2;

  // Shader uniforms
  let shaderUniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: [2048, 1024] },
    u_iterations: { value: softVariation ? 12 : 6 },
    u_offset_skew: {
      value: softVariation
        ? randomBetween(0.15, 0.8) * (randomBetween(0, 1.0) > 0.5 ? -1 : 1)
        : randomBetween(2, 4),
    },
    u_offset_waves: { value: randomBetween(0, 1) },
    u_red: { value: randomBetween(-0.5, 1) },
    u_green: { value: randomBetween(-2, 0) },
    u_blue: { value: randomBetween(-4, 1) },
  };

  // Refractive sphere uniforms
  let refractiveUniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: [2048, 1024] },
  };

  // Create an animation task using Threlte's scheduler
  const { start } = useTask("cube-animation", (delta) => {
    if (props.editor) return;
    // Update shader time uniform
    shaderUniforms.u_time.value += delta;
    refractiveUniforms.u_time.value += delta;
  });

  onMount(() => {
    if (typeof window !== "undefined") {
      start();
    }
  });

  $: cameraX = props.editor ? 0 : smoothMouseX / $size.width - 0.5;

  $: cameraMouseOffsetY = props.editor ? 0 : smoothMouseY / $size.height - 0.5;

  // When in editor mode, Y is fixed. Otherwise, it combines scroll and mouse.
  $: finalCameraY = props.editor
    ? 1
    : 1 + props.scrollY / 500 + cameraMouseOffsetY;
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
  <!-- Background shader plane -->
  <T.Mesh position={[0, 0, -20]} scale={[50, 50, 1]}>
    <T.PlaneGeometry args={[1, 1]} />
    <T.ShaderMaterial
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      {fragmentShader}
      uniforms={shaderUniforms}
      side={2}
    />
  </T.Mesh>
</T.Scene>

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

  let zoomFactor = 1.2; // Add zoom control
  let offsetX = 0.0; // Add X offset control
  let offsetY = 0.0; // Add Y offset control

  // $: offsetX = -props.mouseX / $size.width / 20;
  // $: offsetY = -props.mouseY / $size.height / 20;

  const softVariation = $size.width < 768 ? false : randomBetween(0, 1) > 0.2;

  // Shader uniforms
  let shaderUniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: [$size.width, $size.height] },
    u_zoom: { value: zoomFactor },
    u_offset: { value: [offsetX, offsetY] },
    u_iterations: { value: softVariation ? 14 : 6 },
    u_offset_skew: {
      value: softVariation
        ? randomBetween(0.15, 0.8) * (randomBetween(0, 1.0) > 0.5 ? -1 : 1)
        : randomBetween(2, 4),
    },
    u_offset_waves: { value: randomBetween(0, 1) },
    u_red: { value: randomBetween(-0.5, 0) },
    u_green: { value: 0 },
    u_blue: { value: randomBetween(-4, 0) },
  };

  // Update resolution, zoom, and offset when values change
  $: if (shaderUniforms) {
    shaderUniforms.u_resolution.value = [$size.width, $size.height];
    shaderUniforms.u_zoom.value = zoomFactor;
    shaderUniforms.u_offset.value = [offsetX, offsetY];
  }

  // Create an animation task using Threlte's scheduler
  const { start } = useTask("cube-animation", (delta) => {
    if (props.editor) return;
    // Update shader time uniform
    shaderUniforms.u_time.value += delta;
  });

  onMount(() => {
    if (typeof window !== "undefined") {
      start();
    }
  });

  // Calculate the plane size to exactly fill the viewport
  $: aspect = $size.width / $size.height;
  $: fov = 75; // Field of view in degrees
  $: distance = 1; // Distance from camera to plane
  $: planeHeight = 2 * Math.tan((fov * Math.PI) / 360) * distance * zoomFactor;
  $: planeWidth = planeHeight * aspect;
</script>

<T.PerspectiveCamera
  makeDefault
  position={[0, 0, distance]}
  lookAt={[0, 0, 0]}
  {fov}
  visible
  frustumCulled
  scale={[1, 1, 1]}
/>

<T.Scene position={[0, 0, 0]}>
  <!-- Background shader plane pinned to window corners -->
  <T.Mesh position={[0, 0, 0]} scale={[planeWidth, planeHeight, 1]}>
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

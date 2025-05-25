<script lang="ts">
  import type { SceneProps } from "$/types/Scene";
  import { T } from "@threlte/core";
  import { useThrelte, useTask } from "@threlte/core";
  import { onMount } from "svelte";

  // Import the shader
  import fragmentShader from "$/shaders/index.glsl";
  import { randomBetween } from "$/lib/client/math";

  export let props: SceneProps;

  const { size } = useThrelte();

  let smoothMouseX = 0;
  let smoothMouseY = 0;

  // Shader uniforms
  let shaderUniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: [1920, 1080] },
    u_offset_skew: { value: randomBetween(-4, 6) },
    u_offset_waves: { value: randomBetween(-2, 1) },
    u_red: { value: randomBetween(-0.5, 1) },
    u_green: { value: randomBetween(0, 1.5) },
    u_blue: { value: randomBetween(-0.5, 1) },
    u_scroll: { value: 0 },
  };

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

  // Update resolution when size changes
  $: if ($size) {
    shaderUniforms.u_resolution.value = [$size.width, $size.height];
  }

  // Update scroll uniform
  $: shaderUniforms.u_scroll.value = props.scrollY || 0;

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

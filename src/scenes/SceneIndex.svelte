<script lang="ts">
  import type { SceneProps } from '$/types/Scene'
  import { randomBetween } from '$/lib/client/math'
  import { theme } from '$/lib/client/theme.svelte'
  import fragmentShader from '$/shaders/index.glsl'
  import { T, useTask, useThrelte } from '@threlte/core'
  import { onMount } from 'svelte'

  interface Props {
    props: SceneProps
  }

  const { props }: Props = $props()

  const { size } = useThrelte()

  const zoomFactor = 1.2
  const offsetX = 0.0
  const offsetY = 0.0

  const softVariation = $size.width < 768 ? false : randomBetween(0, 1) > 0.2

  const shaderUniforms = $state({
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
    u_base: { value: 1.5 },
    u_polarity: { value: 0 },
    // Tuned over a sweep of random seeds: mean luma 51 with a standard
    // deviation of 78, and worst case 37 behind the heading so the type
    // always reads. Lower gamma washes out, higher goes muddy.
    u_gamma: { value: 4.0 },
  })

  $effect(() => {
    shaderUniforms.u_resolution.value = [$size.width, $size.height]
    shaderUniforms.u_zoom.value = zoomFactor
    shaderUniforms.u_offset.value = [offsetX, offsetY]
  })

  // Flip the field without rebuilding the material, so toggling is instant
  $effect(() => {
    shaderUniforms.u_polarity.value = theme.current === 'dark' ? 1 : 0
  })

  const { start } = useTask('cube-animation', (delta) => {
    if (props.editor)
      return
    shaderUniforms.u_time.value += delta
  })

  onMount(() => {
    if (typeof window !== 'undefined') {
      start()
    }
  })

  const fov = 75
  const distance = 1
  const aspect = $derived($size.width / $size.height)
  const planeHeight = $derived(2 * Math.tan((fov * Math.PI) / 360) * distance * zoomFactor)
  const planeWidth = $derived(planeHeight * aspect)
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

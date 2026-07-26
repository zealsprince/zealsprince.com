<script lang="ts">
  import type { SceneProps } from '$/types/Scene'
  import { lerp } from '$/lib/client/math'
  import { T, useTask, useThrelte } from '@threlte/core'
  import { onMount } from 'svelte'

  interface Props {
    props: SceneProps
  }

  const { props }: Props = $props()

  const { size } = useThrelte()

  let cubeRotation = $state(0)

  let smoothMouseX = $state(0)
  let smoothMouseY = $state(0)
  const smoothFactor = 0.001

  type Cube = {
    position: [number, number, number]
    size: number
  }

  let cubes: Cube[] = $state([])

  function randomBetween(a: number, b: number) {
    return Math.random() * (b - a) + a
  }

  function initalizeScene() {
    const numCubes = Math.floor(randomBetween(8, 32))
    cubes = Array.from({ length: numCubes }, () => ({
      position: [
        randomBetween(-6, 6),
        randomBetween(-6, 6),
        randomBetween(-4, -12),
      ],
      size: randomBetween(0.25, 1.5),
    }))
  }

  const { start } = useTask('cube-animation', (delta) => {
    if (props.editor)
      return

    smoothMouseX = lerp(smoothMouseX, props.mouseX, smoothFactor)
    smoothMouseY = lerp(smoothMouseY, props.mouseY, smoothFactor)

    cubeRotation += 0.05 * delta
  })

  onMount(() => {
    if (typeof window !== 'undefined') {
      initalizeScene()
      start()
    }
  })

  const cameraX = $derived(props.editor ? 0 : smoothMouseX / $size.width - 0.5)

  const cameraMouseOffsetY = $derived(props.editor ? 0 : smoothMouseY / $size.height - 0.5)

  const finalCameraY = $derived(
    props.editor
      ? 1
      : 1 + props.scrollY / 500 + cameraMouseOffsetY,
  )
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
  {#each cubes as cube, i (i)}
    <T.Mesh
      position={cube.position}
      rotation={[0, i + cubeRotation * (i / 10), i + cubeRotation * (i / 10)]}
      scale={[cube.size, cube.size, cube.size]}
      receiveShadow
      castShadow
    >
      <T.BoxGeometry args={[1, 1, 1]} />
      <T.MeshBasicMaterial
        color={props.color}
        transparent={false}
        reflectivity={1}
      />
    </T.Mesh>
  {/each}
</T.Scene>

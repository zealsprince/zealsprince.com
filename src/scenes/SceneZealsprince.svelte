<script lang="ts">
  import type { SceneProps } from '$/types/Scene'
  import { T, useTask, useThrelte } from '@threlte/core'
  import { onMount } from 'svelte'

  interface Props {
    props: SceneProps
  }

  const { props }: Props = $props()

  const { size } = useThrelte()

  let cubeRotation = $state(0)

  const mouseInfluence = 4
  let smoothMouseX = $state(0)
  let smoothMouseY = $state(0)
  let velocityX = $state(0)
  let velocityY = $state(0)
  const friction = 0.9
  const acceleration = 0.01

  type Cube = {
    position: [number, number, number]
    color: string
    size: number
    wireframe: boolean
  }

  let cubes: Cube[] = $state([])

  function randomBetween(a: number, b: number) {
    return Math.random() * (b - a) + a
  }

  function initalizeScene() {
    const numCubes = 48
    cubes = Array.from({ length: numCubes }, () => ({
      position: [
        randomBetween(-6, 6),
        randomBetween(-8, 8),
        randomBetween(-4, -16),
      ],
      color: '#212429',
      size: randomBetween(0.25, 1.5),
      wireframe: Math.random() > 0.5,
    }))
  }

  const { start } = useTask('cube-animation', (delta) => {
    if (props.editor)
      return

    const distanceX = props.mouseX - smoothMouseX
    const distanceY = props.mouseY - smoothMouseY

    velocityX += distanceX * acceleration
    velocityY += distanceY * acceleration

    velocityX *= friction
    velocityY *= friction

    smoothMouseX += velocityX
    smoothMouseY += velocityY

    cubeRotation += 0.05 * delta
  })

  onMount(() => {
    if (typeof window !== 'undefined') {
      initalizeScene()
      start()
    }
  })

  const cameraX = $derived(
    props.editor
      ? 0
      : smoothMouseX / $size.width - 0.5 * mouseInfluence,
  )

  const cameraMouseOffsetY = $derived(
    props.editor
      ? 0
      : smoothMouseY / $size.height - 0.5 * mouseInfluence,
  )

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
        color={cube.color}
        transparent={false}
        reflectivity={1}
        wireframe={cube.wireframe}
      />
    </T.Mesh>
  {/each}
</T.Scene>

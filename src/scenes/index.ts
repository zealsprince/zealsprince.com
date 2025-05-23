import { SceneName } from '$/types/Scene'

import SceneCubes from './SceneCubes.svelte'
import SceneIndex from './SceneIndex.svelte'
import SceneZealsprince from './SceneZealsprince.svelte'

// These need to be mapped and correlated with the SceneName enum.
export const sceneMap = {
  [SceneName.SceneIndex]: SceneIndex,
  [SceneName.SceneCubes]: SceneCubes,
  [SceneName.SceneZealsprince]: SceneZealsprince,
}

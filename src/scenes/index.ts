import { SceneName } from '$/types/Scene';
import SceneIndex from './SceneIndex.svelte';
import SceneZealsprince from './SceneZealsprince.svelte';

// These need to be mapped and correlated with the SceneName enum.
export const sceneMap = {
  [SceneName.SceneIndex]: SceneIndex,
  [SceneName.SceneZealsprince]: SceneZealsprince,
};


import { SceneName } from '$/types/Scene';
import SceneIndex from './SceneIndex.svelte';
import SceneZealsprince from './SceneZealsprince.svelte';

export const sceneMap = {
  [SceneName.SceneIndex]: SceneIndex,
  [SceneName.SceneZealsprince]: SceneZealsprince,
};


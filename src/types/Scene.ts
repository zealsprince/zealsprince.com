export enum SceneName {
  SceneIndex = 'SceneIndex',
  SceneCubes = 'SceneCubes',
  SceneZealsprince = 'SceneZealsprince',
}

export interface SceneProps {
  scrollY: number
  editor?: boolean
  mouseX: number
  mouseY: number
  /** Mesh colour for the current page palette and theme */
  color: string
}

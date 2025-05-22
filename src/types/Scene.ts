export enum SceneName {
  SceneIndex = 'SceneIndex',
  SceneZealsprince = 'SceneZealsprince',
}

export type SceneProps = {
  scrollY: number;
  editor?: boolean;
  mouseX: number;
  mouseY: number;
};

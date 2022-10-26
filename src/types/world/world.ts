import { World } from '~scene/world';

export enum WorldEvents {
  GAMEOVER = 'gameover',
}

declare global {
  interface Window {
    WORLD: World
  }
}

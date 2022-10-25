import { World } from '~scene/world';

export enum WorldTexture {
  BLOOD = 'effect/blood',
  GLOW = 'effect/glow',
}

export enum WorldEvents {
  GAMEOVER = 'gameover',
}

declare global {
  interface Window {
    WORLD: World
  }
}

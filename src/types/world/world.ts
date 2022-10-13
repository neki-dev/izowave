import { World } from '~scene/world';

export enum WorldTexture {
  BLOOD = 'effect/blood',
  GLOW = 'effect/glow',
}

export enum WorldEvents {
  GAMEOVER = 'gameover',
}

export enum WorldDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  UNREAL = 'UNREAL',
}

export type WorldDifficultyPowers = Record<WorldDifficulty, number>;

declare global {
  interface Window {
    WORLD: World
  }
}

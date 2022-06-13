import { EnemyVariant, EnemyTexture } from '~type/enemy';

export const ENEMY_SPAWN_POSITIONS = 16;
export const ENEMY_SPAWN_DISTANCE_FROM_BUILDING = 10;

export const ENEMY_PATH_BREAKPOINT = 32;
export const ENEMY_PATH_RATE = 300;

export const ENEMY_SPECIE_PARAMS: {
  [value in EnemyTexture]: {
    frameRate: number
    size: number
  }
} = {
  [EnemyTexture.BAT]: {
    frameRate: 4,
    size: 16,
  },
  [EnemyTexture.DEMON]: {
    frameRate: 4,
    size: 16,
  },
  [EnemyTexture.UNDEAD]: {
    frameRate: 4,
    size: 16,
  },
  [EnemyTexture.OVERLORD]: {
    frameRate: 8,
    size: 32,
  },
  [EnemyTexture.IMPURE]: {
    frameRate: 8,
    size: 32,
  },
  [EnemyTexture.BOUCHE]: {
    frameRate: 8,
    size: 32,
  },
};

export const ENEMY_VARIANTS_BY_WAVE: {
  [value in EnemyVariant]?: [
    number, // Minimal wave number
    number, // Frequency
  ]
} = {
  [EnemyVariant.BAT]: [1, 3],
  [EnemyVariant.DEMON]: [1, 5],
  [EnemyVariant.OVERLORD]: [3, 3],
  [EnemyVariant.UNDEAD]: [5, 2],
  [EnemyVariant.IMPURE]: [7, 3],
  [EnemyVariant.BOUCHE]: [11, 2],
};

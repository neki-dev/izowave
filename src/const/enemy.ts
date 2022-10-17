import {
  EnemyTexture, EnemyTexturesMeta, EnemyVariant, EnemyVariantsMeta,
} from '~type/world/entities/enemy';

export const ENEMY_SPAWN_POSITIONS = 10;
export const ENEMY_SPAWN_DISTANCE_FROM_PLAYER = 16;
export const ENEMY_SPAWN_DISTANCE_FROM_BUILDING = 8;

export const ENEMY_PATH_BREAKPOINT = 32;

export const ENEMY_TEXTURE_META: EnemyTexturesMeta = {
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

export const ENEMY_VARIANTS_META: EnemyVariantsMeta = {
  [EnemyVariant.BAT]: {
    spawnMinWave: 1,
    spawnFrequency: 3,
  },
  [EnemyVariant.DEMON]: {
    spawnMinWave: 1,
    spawnFrequency: 5,
  },
  [EnemyVariant.OVERLORD]: {
    spawnMinWave: 3,
    spawnFrequency: 3,
  },
  [EnemyVariant.UNDEAD]: {
    spawnMinWave: 5,
    spawnFrequency: 2,
  },
  [EnemyVariant.IMPURE]: {
    spawnMinWave: 7,
    spawnFrequency: 3,
  },
  [EnemyVariant.BOUCHE]: {
    spawnMinWave: 11,
    spawnFrequency: 2,
  },
};

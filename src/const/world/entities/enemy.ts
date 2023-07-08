import { EnemyTexture, EnemyTexturesMeta } from '~type/world/entities/npc/enemy';

export const ENEMY_SPAWN_POSITIONS = 10;
export const ENEMY_SPAWN_DISTANCE_FROM_PLAYER = 16;
export const ENEMY_SPAWN_DISTANCE_FROM_BUILDING = 8;

export const ENEMY_PATH_BREAKPOINT = 32;

export const ENEMY_TEXTURE_META: EnemyTexturesMeta = {
  [EnemyTexture.BAT]: {
    frameRate: 4,
    size: {
      width: 12,
      height: 18,
      gamut: 4,
    },
  },
  [EnemyTexture.DEMON]: {
    frameRate: 4,
    size: {
      width: 16,
      height: 24,
      gamut: 4,
    },
  },
  [EnemyTexture.SPIKE]: {
    frameRate: 4,
    size: {
      width: 16,
      height: 26,
      gamut: 4,
    },
  },
  [EnemyTexture.UNDEAD]: {
    frameRate: 4,
    size: {
      width: 18,
      height: 26,
      gamut: 4,
    },
  },
  [EnemyTexture.OVERLORD]: {
    frameRate: 8,
    size: {
      width: 32,
      height: 40,
      gamut: 6,
    },
  },
  [EnemyTexture.IMPURE]: {
    frameRate: 8,
    size: {
      width: 32,
      height: 40,
      gamut: 6,
    },
  },
  [EnemyTexture.TERMER]: {
    frameRate: 4,
    size: {
      width: 32,
      height: 40,
      gamut: 6,
    },
  },
  [EnemyTexture.BOSS]: {
    frameRate: 4,
    size: {
      width: 64,
      height: 80,
      gamut: 12,
    },
  },
};

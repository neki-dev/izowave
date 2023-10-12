import { EnemyTexture, EnemyTexturesMeta } from '~type/world/entities/npc/enemy';

export const ENEMY_BOSS_SPAWN_WAVE_RATE = 5;

export const ENEMY_SPAWN_POSITIONS = 10;

export const ENEMY_SPAWN_DISTANCE_FROM_PLAYER = 16;

export const ENEMY_SPAWN_DISTANCE_FROM_BUILDING = 8;

export const ENEMY_PATH_BREAKPOINT = 32;

export const ENEMY_SPAWN_POSITIONS_GRID = 4;

export const ENEMY_TEXTURE_META: EnemyTexturesMeta = {
  [EnemyTexture.BAT]: {
    frameRate: 4,
    size: {
      width: 12,
      height: 18,
      gamut: 4,
    },
  },
  [EnemyTexture.RISPER]: {
    frameRate: 4,
    size: {
      width: 16,
      height: 24,
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
  [EnemyTexture.ADHERENT]: {
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
  [EnemyTexture.TANK]: {
    frameRate: 8,
    size: {
      width: 32,
      height: 40,
      gamut: 6,
    },
  },
  [EnemyTexture.GHOST]: {
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
  [EnemyTexture.STRANGER]: {
    frameRate: 4,
    size: {
      width: 32,
      height: 40,
      gamut: 6,
    },
  },
  [EnemyTexture.EXPLOSIVE]: {
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

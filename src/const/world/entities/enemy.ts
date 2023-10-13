import { EnemyTexture, EnemyTexturesMeta } from '~type/world/entities/npc/enemy';

export const ENEMY_BOSS_SPAWN_WAVE_RATE = 5;

export const ENEMY_SPAWN_POSITIONS = 10;

export const ENEMY_SPAWN_DISTANCE_FROM_PLAYER = 16;

export const ENEMY_SPAWN_DISTANCE_FROM_BUILDING = 8;

export const ENEMY_PATH_BREAKPOINT = 32;

export const ENEMY_SPAWN_POSITIONS_GRID = 4;

export const ENEMY_TEXTURE_META: EnemyTexturesMeta = {
  [EnemyTexture.RISPER]: {
    width: 16,
    height: 24,
    gamut: 4,
  },
  [EnemyTexture.DEMON]: {
    width: 16,
    height: 24,
    gamut: 4,
  },
  [EnemyTexture.UNDEAD]: {
    width: 16,
    height: 24,
    gamut: 4,
  },
  [EnemyTexture.ADHERENT]: {
    width: 16,
    height: 24,
    gamut: 4,
  },
  [EnemyTexture.SPIKE]: {
    width: 16,
    height: 26,
    gamut: 4,
  },
  [EnemyTexture.TANK]: {
    width: 32,
    height: 40,
    gamut: 6,
  },
  [EnemyTexture.GHOST]: {
    width: 32,
    height: 40,
    gamut: 6,
  },
  [EnemyTexture.TERMER]: {
    width: 32,
    height: 40,
    gamut: 6,
  },
  [EnemyTexture.STRANGER]: {
    width: 32,
    height: 40,
    gamut: 6,
  },
  [EnemyTexture.EXPLOSIVE]: {
    width: 32,
    height: 40,
    gamut: 6,
  },
  [EnemyTexture.BOSS]: {
    width: 64,
    height: 80,
    gamut: 12,
  },
};

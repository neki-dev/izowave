import { EnemyTexture, EnemyTexturesMeta } from '~type/world/entities/npc/enemy';

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
  [EnemyTexture.JELLYFISH]: {
    frameRate: 5,
    size: 32,
  },
  [EnemyTexture.UNDEAD]: {
    frameRate: 4,
    size: 18,
  },
  [EnemyTexture.OVERLORD]: {
    frameRate: 8,
    size: 32,
  },
  [EnemyTexture.IMPURE]: {
    frameRate: 8,
    size: 32,
  },
  [EnemyTexture.BOSS]: {
    frameRate: 4,
    size: 50,
  },
};

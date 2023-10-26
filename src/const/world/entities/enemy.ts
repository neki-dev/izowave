import { EnemyTexture, EnemySize, EnemySizeParams } from '~type/world/entities/npc/enemy';

export const ENEMY_BOSS_SPAWN_WAVE_RATE = 5;

export const ENEMY_PATH_BREAKPOINT = 32;

export const ENEMY_SIZE_PARAMS: Record<EnemySize, EnemySizeParams> = {
  [EnemySize.SMALL]: {
    width: 16,
    height: 24,
    gamut: 4,
  },
  [EnemySize.MEDIUM]: {
    width: 32,
    height: 40,
    gamut: 6,
  },
  [EnemySize.LARGE]: {
    width: 64,
    height: 80,
    gamut: 12,
  },
};

export const ENEMY_TEXTURE_SIZE: Record<EnemyTexture, EnemySize> = {
  [EnemyTexture.RISPER]: EnemySize.SMALL,
  [EnemyTexture.DEMON]: EnemySize.SMALL,
  [EnemyTexture.UNDEAD]: EnemySize.SMALL,
  [EnemyTexture.ADHERENT]: EnemySize.SMALL,
  [EnemyTexture.SPIKE]: EnemySize.SMALL,
  [EnemyTexture.TANK]: EnemySize.MEDIUM,
  [EnemyTexture.GHOST]: EnemySize.MEDIUM,
  [EnemyTexture.TERMER]: EnemySize.MEDIUM,
  [EnemyTexture.TELEPATH]: EnemySize.MEDIUM,
  [EnemyTexture.STRANGER]: EnemySize.MEDIUM,
  [EnemyTexture.EXPLOSIVE]: EnemySize.MEDIUM,
  [EnemyTexture.BOSS]: EnemySize.LARGE,
};

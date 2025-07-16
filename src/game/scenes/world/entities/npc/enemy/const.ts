import { EnemySize, EnemyTexture } from './types';
import type { EnemySizeParams } from './types';

export const ENEMY_PATH_BREAKPOINT = 32;

export const ENEMY_SPREAD_DAMAGE_RADIUS = 60;

export const ENEMY_FIRE_DAMAGE_FORCE = 1.5;

export const ENEMY_HEALTH = 60; // Health

export const ENEMY_HEALTH_GROWTH = 0.35; // Health growth by wave number (Quadratic)

export const ENEMY_HEALTH_GROWTH_RETARDATION_LEVEL = 12; // Level for health growth retardation

export const ENEMY_SPEED = 60; // Movement speed

export const ENEMY_SPEED_GROWTH = 0.06; // Speed growth by wave number (Linear)

export const ENEMY_SPEED_GROWTH_MAX_LEVEL = 15; // Level for limit speed growth

export const ENEMY_DAMAGE = 90; // Attack damage

export const ENEMY_DAMAGE_GROWTH = 0.32; // Damage growth by wave number (Linear)

export const ENEMY_KILL_EXPERIENCE = 10; // Gained experience per kill enemy

export const ENEMY_KILL_EXPERIENCE_GROWTH = 0.28; // Experience growth by wave number (Linear)

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
  [EnemyTexture.BERSERK]: EnemySize.MEDIUM,
  [EnemyTexture.TERMER]: EnemySize.MEDIUM,
  [EnemyTexture.TELEPATH]: EnemySize.MEDIUM,
  [EnemyTexture.STRANGER]: EnemySize.MEDIUM,
  [EnemyTexture.EXPLOSIVE]: EnemySize.MEDIUM,
  [EnemyTexture.BOSS]: EnemySize.LARGE,
};

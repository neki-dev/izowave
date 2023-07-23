import { DIFFICULTY } from '~const/world/difficulty';
import { WorldFeature, WorldFeatureData } from '~type/world';

export const WORLD_COLLIDE_SPEED_FACTOR = 0.002;

export const WORLD_DEPTH_DEBUG = 9999;

export const WORLD_DEPTH_EFFECT = 9998;

export const WORLD_FIND_PATH_RATE = 300;

export const WORLD_FEATURES: Record<WorldFeature, WorldFeatureData> = {
  [WorldFeature.FROST]: {
    description: 'Freezes all spawned enemies',
    cost: DIFFICULTY.FEATURE_FROST_COST,
    duration: DIFFICULTY.FEATURE_FROST_DURATION,
  },
  [WorldFeature.RAGE]: {
    description: 'Doubles towers damage',
    cost: DIFFICULTY.FEATURE_RAGE_COST,
    duration: DIFFICULTY.FEATURE_RAGE_DURATION,
  },
  [WorldFeature.SHIELD]: {
    description: 'Prevents damage to all buildings',
    cost: DIFFICULTY.FEATURE_SHIELD_COST,
    duration: DIFFICULTY.FEATURE_SHIELD_DURATION,
  },
  [WorldFeature.FIRE]: {
    description: 'Deals damage to all enemies',
    cost: DIFFICULTY.FEATURE_FIRE_COST,
    duration: DIFFICULTY.FEATURE_FIRE_DURATION,
  },
};

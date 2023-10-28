import { WorldLayerParams } from 'gen-biome';

import { LEVEL_BIOMES_EARTH } from '~const/world/level/planets/earth';
import { LEVEL_BIOMES_MARS } from '~const/world/level/planets/mars';
import { LEVEL_BIOMES_MOON } from '~const/world/level/planets/moon';
import { LevelBiomes, LevelPlanet } from '~type/world/level';

export const LEVEL_MAP_SIZE = 100;

export const LEVEL_MAP_TILE_SIZE = {
  width: 42,
  height: 48,
};

export const LEVEL_MAP_PERSPECTIVE = (LEVEL_MAP_TILE_SIZE.height / 2) / LEVEL_MAP_TILE_SIZE.width;

export const LEVEL_MAP_TILE = {
  ...LEVEL_MAP_TILE_SIZE,
  origin: 0.75,
  edgeLength: 24.6,
  margin: 1,
  spacing: 2,
};

export const LEVEL_MAP_MAX_HEIGHT = 4;

export const LEVEL_SEED_SIZE = 128;

export const LEVEL_SCENERY_TILE = {
  width: 42,
  height: 72,
  origin: 61 / 72,
};

export const LEVEL_BIOME_PARAMETERS: WorldLayerParams = {
  frequencyChange: 0.2,
  heightRedistribution: 0.7,
  borderSmoothness: 0.8,
  falloff: 0.3,
};

export const LEVEL_PLANETS: Record<LevelPlanet, {
  BIOMES: LevelBiomes
  SCENERY_DENSITY: number
  SCENERY_VARIANTS_COUNT: number
  CRYSTAL_VARIANTS: number[]
}> = {
  [LevelPlanet.EARTH]: {
    BIOMES: LEVEL_BIOMES_EARTH,
    SCENERY_DENSITY: 2.0,
    SCENERY_VARIANTS_COUNT: 4,
    CRYSTAL_VARIANTS: [1],
  },
  [LevelPlanet.MOON]: {
    BIOMES: LEVEL_BIOMES_MOON,
    SCENERY_DENSITY: 1.5,
    SCENERY_VARIANTS_COUNT: 8,
    CRYSTAL_VARIANTS: [3],
  },
  [LevelPlanet.MARS]: {
    BIOMES: LEVEL_BIOMES_MARS,
    SCENERY_DENSITY: 1.5,
    SCENERY_VARIANTS_COUNT: 8,
    CRYSTAL_VARIANTS: [0, 2],
  },
};

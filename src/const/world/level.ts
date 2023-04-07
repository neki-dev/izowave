import { WorldBiomeParams, WorldLayerParams } from 'gen-biome';

import { getPerformance } from '~lib/optimize';
import { PerformanceLevel } from '~type/optimize';
import {
  BiomeType, LevelBiome, SpawnTarget, TileMeta,
} from '~type/world/level';

export const TILE_META: TileMeta = {
  width: 42,
  height: 48,
  origin: 0.25,
  persperctive: 0.571,
  deg: 29.726,
};

export const LEVEL_MAP_SIZE = (() => {
  switch (getPerformance()) {
    case PerformanceLevel.HIGH: return 110;
    case PerformanceLevel.MEDIUM: return 100;
    default: return 90;
  }
})();
export const LEVEL_MAP_HEIGHT = 4;
export const LEVEL_MAP_VISIBLE_PART = 0.8;
export const LEVEL_MAP_VISITED_TILE_TINT = 0xDDDDDD;
export const LEVEL_MAP_Z_WEIGHT = 999;

export const LEVEL_TREES_COUNT = LEVEL_MAP_SIZE * 2;

export const LEVEL_BUILDING_PATH_COST = 16.0;

export const LEVEL_SPAWN_POSITIONS_STEP = 4;

export const LEVEL_BIOMES: Array<{
  params?: WorldBiomeParams
  data: LevelBiome
}> = [{
  params: { upperBound: 0.12 },
  data: {
    type: BiomeType.WATER,
    tileIndex: 0,
    z: 0,
    collide: false,
    solid: false,
    friction: 5.0,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.12, upperBound: 0.15 },
  data: {
    type: BiomeType.WATER,
    tileIndex: 1,
    z: 0,
    collide: false,
    solid: false,
    friction: 5.0,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.15, upperBound: 0.17 },
  data: {
    type: BiomeType.WATER,
    tileIndex: 2,
    z: 0,
    collide: false,
    solid: false,
    friction: 5.0,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.17, upperBound: 0.20 },
  data: {
    type: BiomeType.SAND,
    tileIndex: 6,
    z: 0,
    collide: false,
    solid: true,
    friction: 1.2,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.CHEST],
  },
}, {
  params: { lowerBound: 0.20, upperBound: 0.24 },
  data: {
    type: BiomeType.SAND,
    tileIndex: [7, 8],
    z: 0,
    collide: false,
    solid: true,
    friction: 1.2,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.PLAYER, SpawnTarget.CHEST],
  },
}, {
  params: { lowerBound: 0.24, upperBound: 0.34 },
  data: {
    type: BiomeType.GRASS,
    tileIndex: 12,
    z: 0,
    collide: false,
    solid: true,
    friction: 1.0,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.PLAYER, SpawnTarget.CHEST, SpawnTarget.TREE],
  },
}, {
  params: { lowerBound: 0.34, upperBound: 0.44 },
  data: {
    type: BiomeType.GRASS,
    tileIndex: [13, 14],
    z: 0,
    collide: false,
    solid: true,
    friction: 1.0,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.PLAYER, SpawnTarget.CHEST, SpawnTarget.TREE],
  },
}, {
  params: { lowerBound: 0.44, upperBound: 0.54 },
  data: {
    type: BiomeType.GRASS,
    tileIndex: [15, 17],
    z: 0,
    collide: false,
    solid: true,
    friction: 1.0,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.CHEST, SpawnTarget.TREE],
  },
}, {
  params: { lowerBound: 0.54, upperBound: 0.59 },
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 24,
    z: 1,
    collide: true,
    solid: false,
    friction: 1.0,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.59, upperBound: 0.63 },
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 25,
    z: 1,
    collide: true,
    solid: false,
    friction: 1.0,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.63, upperBound: 0.70 },
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 26,
    z: 2,
    collide: true,
    solid: false,
    friction: 1.0,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.70 },
  data: {
    type: BiomeType.SNOW,
    tileIndex: 30,
    z: 3,
    collide: true,
    solid: false,
    friction: 1.0,
    spawn: [],
  },
}, {
  data: {
    type: BiomeType.RUBBLE,
    tileIndex: [18, 19],
    z: 0,
    collide: false,
    solid: true,
    friction: 0.8,
    spawn: [SpawnTarget.PLAYER],
  },
}];

export const LEVEL_BIOME_PARAMETERS: WorldLayerParams = {
  frequencyChange: 0.2,
  heightRedistribution: 0.7,
  borderSmoothness: 0.8,
};

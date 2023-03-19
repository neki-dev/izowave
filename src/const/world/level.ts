import { Biome, LayerParameters } from 'gen-biome';

import { getPerformance } from '~lib/optimize';
import { PerformanceLevel } from '~type/optimize';
import {
  BiomeType, LevelBiome, SpawnTarget, TileMeta,
} from '~type/world/level';

export const TILE_META: TileMeta = {
  width: 42,
  halfWidth: 21,
  height: 48,
  halfHeight: 24,
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

export const LEVEL_BUILDING_PATH_COST = 16.0;

export const LEVEL_SPAWN_POSITIONS_STEP = 4;

export const LEVEL_BIOMES: Biome<LevelBiome>[] = [{
  breakpoint: { max: 0.14 },
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
  breakpoint: { min: 0.14, max: 0.17 },
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
  breakpoint: { min: 0.17, max: 0.20 },
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
  breakpoint: { min: 0.20, max: 0.24 },
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
  breakpoint: { min: 0.24, max: 0.28 },
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
  breakpoint: { min: 0.28, max: 0.36 },
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
  breakpoint: { min: 0.36, max: 0.44 },
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
  breakpoint: { min: 0.44, max: 0.54 },
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
  breakpoint: { min: 0.54, max: 0.59 },
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
  breakpoint: { min: 0.59, max: 0.63 },
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
  breakpoint: { min: 0.63, max: 0.70 },
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
  breakpoint: { min: 0.70 },
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

export const LEVEL_BIOME_PARAMETERS: LayerParameters = {
  frequencyChange: 8,
  sizeDifference: 1.2,
  bordersPurity: 10,
};

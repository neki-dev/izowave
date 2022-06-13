import { Biome, BiomeLayer } from 'gen-biome';

import { BiomeType, LevelBiome, TileMeta } from '~type/level';

export const TILE_META: TileMeta = {
  width: 42,
  halfWidth: 21,
  height: 48,
  halfHeight: 24,
  origin: 0.25,
  persperctive: 0.571,
  deg: 29.726,
};

// Get level size by max browser memory usage.
// @ts-ignore
const maxMem = Math.round((window.performance?.memory?.jsHeapSizeLimit || 0) / 1024 / 1024);
let MAP_SIZE = 110;
if (maxMem <= 1024) {
  MAP_SIZE = 90;
} else if (maxMem <= 2048) {
  MAP_SIZE = 100;
}
export const LEVEL_MAP_SIZE = MAP_SIZE;
export const LEVEL_MAP_HEIGHT = 4;
export const LEVEL_MAP_TREES_COUNT = MAP_SIZE * 2;
export const LEVEL_MAP_VISIBLE_PART = 0.75;
export const LEVEL_MAP_VISITED_TILE_TINT = 0xDDDDDD;

export const LEVEL_CORNER_PATH_COST = 8.0;
export const LEVEL_BUILDING_PATH_COST = 16.0;

export const LEVEL_SPAWN_POSITIONS_STEP = 4;

export const LEVEL_BIOMES: Biome<LevelBiome>[] = [{
  breakpoint: [undefined, 0.14],
  data: {
    type: BiomeType.WATER,
    tileIndex: 0,
    z: 0,
    collide: false,
    solid: false,
    friction: 5.0,
  },
}, {
  breakpoint: [0.14, 0.17],
  data: {
    type: BiomeType.WATER,
    tileIndex: 1,
    z: 0,
    collide: false,
    solid: false,
    friction: 5.0,
  },
}, {
  breakpoint: [0.17, 0.20],
  data: {
    type: BiomeType.WATER,
    tileIndex: 2,
    z: 0,
    collide: false,
    solid: false,
    friction: 5.0,
  },
}, {
  breakpoint: [0.20, 0.24],
  data: {
    type: BiomeType.SAND,
    tileIndex: 6,
    z: 0,
    collide: false,
    solid: true,
    friction: 1.2,
  },
}, {
  breakpoint: [0.24, 0.28],
  data: {
    type: BiomeType.SAND,
    tileIndex: [7, 8],
    z: 0,
    collide: false,
    solid: true,
    friction: 1.2,
  },
}, {
  breakpoint: [0.28, 0.36],
  data: {
    type: BiomeType.GRASS,
    tileIndex: 12,
    z: 0,
    collide: false,
    solid: true,
    friction: 1.0,
  },
}, {
  breakpoint: [0.36, 0.44],
  data: {
    type: BiomeType.GRASS,
    tileIndex: [13, 14],
    z: 0,
    collide: false,
    solid: true,
    friction: 1.0,
  },
}, {
  breakpoint: [0.44, 0.54],
  data: {
    type: BiomeType.GRASS,
    tileIndex: [15, 17],
    z: 0,
    collide: false,
    solid: true,
    friction: 1.0,
  },
}, {
  breakpoint: [0.54, 0.59],
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 24,
    z: 1,
    collide: true,
    solid: false,
    friction: 1.0,
  },
}, {
  breakpoint: [0.59, 0.63],
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 25,
    z: 1,
    collide: true,
    solid: false,
    friction: 1.0,
  },
}, {
  breakpoint: [0.63, 0.70],
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 26,
    z: 2,
    collide: true,
    solid: false,
    friction: 1.0,
  },
}, {
  breakpoint: [0.70],
  data: {
    type: BiomeType.SNOW,
    tileIndex: 30,
    z: 3,
    collide: true,
    solid: false,
    friction: 1.0,
  },
}, {
  breakpoint: [Number.MAX_SAFE_INTEGER],
  data: {
    type: BiomeType.RUBBLE,
    tileIndex: [18, 19],
    z: 0,
    collide: false,
    solid: true,
    friction: 1.0,
  },
}];

export const LEVEL_BIOME_LAYERS: BiomeLayer[] = [{
  parameters: {
    frequencyChange: 8,
    sizeDifference: 1.2,
    bordersPuriry: 10,
  },
  biomes: LEVEL_BIOMES,
}];

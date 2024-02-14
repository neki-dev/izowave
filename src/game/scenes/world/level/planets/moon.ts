import type { LevelBiomes } from '~scene/world/level/types';
import { BiomeType, SpawnTarget } from '~scene/world/level/types';

export const LEVEL_BIOMES_MOON: LevelBiomes = [{
  params: { upperBound: 0.09 },
  data: {
    type: BiomeType.WATER,
    tileIndex: 0,
    z: 0,
    collide: false,
    solid: false,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.09, upperBound: 0.12 },
  data: {
    type: BiomeType.WATER,
    tileIndex: 1,
    z: 0,
    collide: false,
    solid: false,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.12, upperBound: 0.14 },
  data: {
    type: BiomeType.WATER,
    tileIndex: 2,
    z: 0,
    collide: false,
    solid: false,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.14, upperBound: 0.18 },
  data: {
    type: BiomeType.SAND,
    tileIndex: 3,
    z: 0,
    collide: false,
    solid: true,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.CRYSTAL],
  },
}, {
  params: { lowerBound: 0.18, upperBound: 0.22 },
  data: {
    type: BiomeType.SAND,
    tileIndex: [4, 5],
    z: 0,
    collide: false,
    solid: true,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.CRYSTAL, SpawnTarget.SCENERY],
  },
}, {
  params: { lowerBound: 0.22, upperBound: 0.32 },
  data: {
    type: BiomeType.GRASS,
    tileIndex: 6,
    z: 0,
    collide: false,
    solid: true,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.PLAYER, SpawnTarget.SCENERY],
  },
}, {
  params: { lowerBound: 0.32, upperBound: 0.54 },
  data: {
    type: BiomeType.GRASS,
    tileIndex: [7, 8],
    z: 0,
    collide: false,
    solid: true,
    spawn: [SpawnTarget.ENEMY, SpawnTarget.PLAYER, SpawnTarget.SCENERY],
  },
}, {
  params: { lowerBound: 0.54, upperBound: 0.64 },
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 12,
    z: 1,
    collide: true,
    solid: false,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.64, upperBound: 0.72 },
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 13,
    z: 2,
    collide: true,
    solid: false,
    spawn: [],
  },
}, {
  params: { lowerBound: 0.72 },
  data: {
    type: BiomeType.MOUNT,
    tileIndex: 14,
    z: 3,
    collide: true,
    solid: false,
    spawn: [],
  },
}, {
  data: {
    type: BiomeType.RUBBLE,
    tileIndex: [9, 10],
    z: 0,
    collide: false,
    solid: true,
    friction: 0.8,
    spawn: [SpawnTarget.PLAYER],
  },
}];

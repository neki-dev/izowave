import type { WorldBiomeParams } from 'gen-biome';

export enum TileType {
  MAP = 'MAP',
  BUILDING = 'BUILDING',
  CRYSTAL = 'CRYSTAL',
  SCENERY = 'SCENERY',
}

export enum SpawnTarget {
  ENEMY = 'ENEMY',
  PLAYER = 'PLAYER',
  SCENERY = 'SCENERY',
  CRYSTAL = 'CRYSTAL',
}

export type LevelBiomes = Array<{
  params?: WorldBiomeParams
  data: LevelBiome
}>;

export type LevelBiome = {
  type: BiomeType
  tileIndex: number | [number, number]
  z: number
  collide: boolean
  solid: boolean
  friction?: number
  spawn: SpawnTarget[]
};

export type LevelData = {
  planet?: LevelPlanet
  seed?: number[]
};

export type LevelSavePayload = {
  planet: LevelPlanet
  seed: number[]
};

export enum LevelPlanet {
  EARTH = 'EARTH',
  MOON = 'MOON',
  MARS = 'MARS',
}

export enum LevelSceneryTexture {
  EARTH = 'LevelSceneryTexture:EARTH',
  MOON = 'LevelSceneryTexture:MOON',
  MARS = 'LevelSceneryTexture:MARS',
}

export enum LevelTilesetTexture {
  EARTH = 'LevelTilesetTexture:EARTH',
  MOON = 'LevelTilesetTexture:MOON',
  MARS = 'LevelTilesetTexture:MARS',
}

export enum BiomeType {
  WATER = 'WATER',
  SAND = 'SAND',
  GRASS = 'GRASS',
  RUBBLE = 'RUBBLE',
  MOUNT = 'MOUNT',
  SNOW = 'SNOW',
}

export type PositionAtWorld = {
  x: number
  y: number
};

export type PositionAtWorldTransform = PositionAtWorld & {
  getBottomEdgePosition?: () => PositionAtWorld
};

export type PositionAtMatrix = {
  x: number
  y: number
};

export type TilePosition = {
  x: number
  y: number
  z: number
};

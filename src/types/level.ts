export enum TileType {
  MAP = 'MAP',
  BUILDING = 'BUILDING',
  CHEST = 'CHEST',
  TREE = 'TREE',
}

export type TileMeta = {
  origin: number
  persperctive: number
  width: number
  height: number
  halfWidth: number
  halfHeight: number
  deg: number
};

export enum SpawnTarget {
  ENEMY = 'ENEMY',
  PLAYER = 'PLAYER',
  TREE = 'TREE',
  CHEST = 'CHEST',
}

export type LevelBiome = {
  type: BiomeType
  tileIndex: number | [number, number]
  z: number
  collide: boolean
  solid: boolean
  friction: number
  spawn: SpawnTarget[]
};

export enum LevelTexture {
  TILES = 'level/tileset',
  TREE = 'level/tree',
}

export enum BiomeType {
  WATER = 'WATER',
  SAND = 'SAND',
  GRASS = 'GRASS',
  RUBBLE = 'RUBBLE',
  MOUNT = 'MOUNT',
  SNOW = 'SNOW',
}

declare global {
  namespace Phaser {
    namespace GameObjects {
      interface Image {
        biome?: LevelBiome
        tileType?: TileType
      }
    }
  }
}

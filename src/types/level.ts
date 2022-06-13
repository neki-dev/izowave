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

export type LevelBiome = {
  type: BiomeType
  tileIndex: number | [number, number]
  z: number
  collide: boolean
  solid: boolean
  friction: number
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
        positionAtMatrix?: Phaser.Types.Math.Vector2Like
        onCollide?(object: any): void
      }
    }
  }
}

import { INavigator } from '~type/world/level/navigator';
import { ITileMatrix } from '~type/world/level/tile-matrix';

export interface ILevel extends ITileMatrix {
  /**
   * Path finder.
   */
  readonly navigator: INavigator

  /**
   * Update area of visible tiles.
   */
  updateVisibleTiles(): void

  /**
   * Hide all tiles.
   */
  hideTiles(): void

  /**
   * Check is position doesn`t have tile.
   * @param position - Tile position
   */
  isFreePoint(position: Vector3D): boolean

  /**
   * Get spawn positions at matrix.
   * @param target - Spawn target
   */
  readSpawnPositions(target: SpawnTarget): Vector2D[]

  /**
   * Update navigation points costs.
   */
  refreshNavigationMeta(): void

  /**
   * Check is presence of tile between world positions.
   * @param positionA - Position at world
   * @param positionB - Position at world
   */
  hasTilesBetweenPositions(positionA: Vector2D, positionB: Vector2D): boolean
}

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
  TILESET = 'level/tileset',
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

export type Vector2D = {
  x: number
  y: number
};

export type Vector3D = {
  x: number
  y: number
  z: number
};

// declare global {
//   namespace Phaser {
//     namespace GameObjects {
//       interface Image {
//         biome?: LevelBiome
//         shape?: Phaser.Geom.Polygon
//         tileType: TileType
//       }
//     }
//   }
// }

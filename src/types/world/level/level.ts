import { World } from 'gen-biome';

import { Effect } from '~scene/world/effects';
import { IWorld } from '~type/world';
import { INavigator } from '~type/world/level/navigator';
import { ITileMatrix } from '~type/world/level/tile-matrix';

export interface ILevel extends ITileMatrix {
  readonly scene: IWorld

  /**
   * Path finder.
   */
  readonly navigator: INavigator

  /**
   * Map manager.
   */
  readonly map: World<LevelBiome>

  /**
   * Effects on ground.
   */
  readonly effectsOnGround: Effect[]

  /**
   * Tilemap ground layer.
   */
  readonly groundLayer: Phaser.Tilemaps.TilemapLayer

  /**
   * Let loose map tiles effects.
   */
  looseEffects(): void

  /**
   * Get spawn positions at matrix.
   * @param target - Spawn target
   */
  readSpawnPositions(target: SpawnTarget): Vector2D[]

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
  CRYSTAL = 'CRYSTAL',
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
  CRYSTAL = 'CRYSTAL',
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

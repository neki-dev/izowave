import Phaser from 'phaser';

import { TileType, Vector3D } from '~type/world/level';

export interface ITileMatrix {
  /**
   * Level tiles matrix.
   * Indexes: z, y, x
   */
  readonly tiles: ITile[][][]

  /**
   * Matrix size (x, y)
   */
  readonly size: number

  /**
   * Matrix height (z)
   */
  readonly height: number

  /**
   * Check is position doesn`t have tile.
   * @param position - Tile position
   */
  isFreePoint(position: Vector3D): boolean

  /**
   * Get tile from map data.
   * @param position - Tile position
   */
  getTile(position: Vector3D): Nullable<ITile>

  /**
   * Get tile with strict type.
   * @param position - Tile position
   * @param type - Tile type or types
   */
  getTileWithType(position: Vector3D, type: TileType | TileType[]): Nullable<ITile>

  /**
   * Check tile type.
   * @param position - Tile position
   * @param type - Tile type or types
   */
  tileIs(position: Vector3D, type: TileType | TileType[]): boolean

  /**
   * Put tile into map data.
   * @param tile - Tile object
   * @param position - Tile position
   * @param destroyable - Tile can be destroy
   */
  putTile(tile: ITile, position: Vector3D, destroyable?: boolean): void

  /**
   * Remove tile from map data.
   * @param position - Tile position
   */
  removeTile(position: Vector3D): void
}

export interface ITile extends Phaser.GameObjects.Image {
  tileType: TileType
  clearable?: boolean
}

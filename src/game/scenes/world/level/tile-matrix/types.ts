import type Phaser from 'phaser';

import type { TilePosition, TileType } from '../types';

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
  isFreePoint(position: TilePosition): boolean

  /**
   * Get tile from map data.
   * @param position - Tile position
   */
  getTile(position: TilePosition): Nullable<ITile>

  /**
   * Get tile with strict type.
   * @param position - Tile position
   * @param type - Tile type or types
   */
  getTileWithType(position: TilePosition, type: TileType | TileType[]): Nullable<ITile>

  /**
   * Check tile type.
   * @param position - Tile position
   * @param type - Tile type or types
   */
  tileIs(position: TilePosition, type: TileType | TileType[]): boolean

  /**
   * Put tile into map data.
   * @param tile - Tile object
   * @param position - Tile position
   * @param destroyable - Tile can be destroy
   */
  putTile(tile: ITile, position: TilePosition, destroyable?: boolean): void

  /**
   * Remove tile from map data.
   * @param position - Tile position
   */
  removeTile(position: TilePosition): void
}

export interface ITile extends Phaser.GameObjects.Image {
  tileType: TileType
  clearable?: boolean
}

import Phaser from 'phaser';

import { TileType, Vector3D } from '~type/world/level';

export class TileMatrix {
  /**
   * Level tiles matrix.
   * Indexes: z, y, x
   */
  readonly tiles: Phaser.GameObjects.Image[][][] = [];

  /**
   * Matrix size (x, y)
   */
  readonly size: number;

  /**
   * Matrix height (z)
   */
  readonly height: number;

  /**
   * Tile matrix constructor.
   */
  constructor(size: number, height: number) {
    this.size = size;
    this.height = height;

    for (let z = 0; z < height; z++) {
      this.tiles[z] = [];
      for (let y = 0; y < size; y++) {
        this.tiles[z][y] = [];
      }
    }
  }

  /**
   * Get tile from map data.
   *
   * @param position - Tile position
   */
  public getTile(position: Vector3D): Nullable<Phaser.GameObjects.Image> {
    const { x, y, z } = position;

    return this.tiles[z]?.[y]?.[x] || null;
  }

  /**
   * Check if tile is visible.
   *
   * @param position - Tile position
   */
  public isVisibleTile(position: Vector3D): boolean {
    return this.getTile(position)?.visible ?? false;
  }

  /**
   * Get tile with strict type.
   *
   * @param position - Tile position
   * @param type - Tile type or types
   */
  public getTileWithType(
    position: Vector3D,
    type: TileType | TileType[],
  ): Nullable<Phaser.GameObjects.Image> {
    if (!this.tileIs(position, type)) {
      return null;
    }

    return this.getTile(position);
  }

  /**
   * Check tile type.
   *
   * @param position - Tile position
   * @param type - Tile type or types
   */
  public tileIs(
    position: Vector3D,
    type: TileType | TileType[],
  ): boolean {
    const tile = this.getTile(position);

    if (!tile) {
      return false;
    }

    if (type instanceof Array) {
      return type.includes(tile.tileType);
    }

    return (type === tile.tileType);
  }

  /**
   * Put tile into map data.
   *
   * @param tile - Image
   * @param type - Tile type
   * @param position - Tile position
   */
  public putTile(
    tile: Phaser.GameObjects.Image,
    type: TileType,
    position: Vector3D,
  ) {
    const existsTile = this.getTile(position);

    if (existsTile) {
      existsTile.destroy();
    }

    // eslint-disable-next-line no-param-reassign
    tile.tileType = type;

    const { x, y, z } = position;

    this.tiles[z][y][x] = tile;
  }

  /**
   * Remove tile from map data.
   *
   * @param position - Tile position
   */
  public removeTile(position: Vector3D) {
    const tile = this.getTile(position);

    if (!tile) {
      return;
    }

    const { x, y, z } = position;

    delete this.tiles[z][y][x];
  }
}

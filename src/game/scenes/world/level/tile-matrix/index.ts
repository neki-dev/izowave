import Phaser from 'phaser';

import type { TilePosition, TileType } from '../types';

import type { ITileMatrix, ITile } from './types';

export class TileMatrix implements ITileMatrix {
  readonly tiles: ITile[][][] = [];

  readonly size: number;

  readonly height: number;

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

  public isFreePoint(position: TilePosition) {
    const tile = this.getTile(position);

    return !tile || Boolean(tile.clearable);
  }

  public getTile(position: TilePosition): Nullable<ITile> {
    const { x, y, z } = position;

    return this.tiles[z]?.[y]?.[x] ?? null;
  }

  public getTileWithType(position: TilePosition, type: TileType | TileType[]): Nullable<ITile> {
    if (!this.tileIs(position, type)) {
      return null;
    }

    return this.getTile(position);
  }

  public tileIs(position: TilePosition, type: TileType | TileType[]) {
    const tile = this.getTile(position);

    if (!tile) {
      return false;
    }

    if (type instanceof Array) {
      return type.includes(tile.tileType);
    }

    return (type === tile.tileType);
  }

  public putTile(tile: ITile, position: TilePosition, destroyable = true) {
    const existsTile = this.getTile(position);

    if (existsTile) {
      existsTile.destroy();
    }

    const { x, y, z } = position;

    this.tiles[z][y][x] = tile;

    if (destroyable) {
      tile.once(Phaser.GameObjects.Events.DESTROY, () => {
        this.removeTile(position);
      });
    }
  }

  public removeTile(position: TilePosition) {
    const tile = this.getTile(position);

    if (!tile) {
      return;
    }

    const { x, y, z } = position;

    delete this.tiles[z][y][x];
  }
}

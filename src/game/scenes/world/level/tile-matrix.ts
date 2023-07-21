import Phaser from 'phaser';

import { TileType, Vector3D } from '~type/world/level';
import { ITileMatrix, ITile } from '~type/world/level/tile-matrix';

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

  public getTile(position: Vector3D): Nullable<ITile> {
    const { x, y, z } = position;

    return this.tiles[z]?.[y]?.[x] ?? null;
  }

  public getTileWithType(position: Vector3D, type: TileType | TileType[]): Nullable<ITile> {
    if (!this.tileIs(position, type)) {
      return null;
    }

    return this.getTile(position);
  }

  public isVisibleTile(position: Vector3D) {
    return this.getTile(position)?.visible ?? false;
  }

  public tileIs(position: Vector3D, type: TileType | TileType[]) {
    const tile = this.getTile(position);

    if (!tile) {
      return false;
    }

    if (type instanceof Array) {
      return type.includes(tile.tileType);
    }

    return (type === tile.tileType);
  }

  public putTile(tile: ITile, position: Vector3D, destroyable = true) {
    const existsTile = this.getTile(position);

    if (existsTile) {
      existsTile.destroy();
    }

    const { x, y, z } = position;

    this.tiles[z][y][x] = tile;

    if (destroyable) {
      tile.on(Phaser.GameObjects.Events.DESTROY, () => {
        this.removeTile(position);
      });
    }
  }

  public removeTile(position: Vector3D) {
    const tile = this.getTile(position);

    if (!tile) {
      return;
    }

    const { x, y, z } = position;

    delete this.tiles[z][y][x];
  }
}

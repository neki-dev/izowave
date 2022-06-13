import assert from 'assert';
import { TileType } from '~type/level';
import TileMatrix from '../tile-matrix';

let matrix: TileMatrix;

// @ts-ignore
const tile: Phaser.GameObjects.Image = {};

describe('tile-matrix.ts', () => {
  before(() => {
    matrix = new TileMatrix(10, 2);
  });

  it('should put tile', () => {
    matrix.putTile(tile, TileType.MAP, { x: 0, y: 0, z: 0 });
    assert.equal(tile.tileType, TileType.MAP);
  });

  it('should check tile type', () => {
    assert.equal(matrix.tileIs({ x: 0, y: 0, z: 0 }, [TileType.MAP]), true);
  });

  it('should return tile', () => {
    assert.equal(matrix.getTile({ x: 0, y: 0, z: 0 }), tile);
  });

  it('should return tile with allowed types', () => {
    assert.equal(matrix.getTileWithType({ x: 0, y: 0, z: 0 }, [TileType.MAP, TileType.BUILDING]), tile);
    assert.equal(matrix.getTileWithType({ x: 0, y: 0, z: 0 }, [TileType.BUILDING]), null);
  });

  it('should not return tile for emtpy position', () => {
    assert.equal(matrix.getTile({ x: 1, y: 1, z: 0 }), null);
    assert.equal(matrix.getTile({ x: 1, y: 1, z: -999 }), null);
  });

  it('should remove tile', () => {
    const position = { x: 0, y: 0, z: 0 };
    matrix.removeTile(position);
    assert.equal(matrix.getTile(position), null);
  });
});

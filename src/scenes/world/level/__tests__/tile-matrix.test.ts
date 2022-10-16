import tile from '../__mocks__/tile';
import { TileMatrix } from '../tile-matrix';
import { TileType } from '~type/world/level';

describe('tile-matrix.ts', () => {
  let matrix: TileMatrix;

  beforeAll(() => {
    matrix = new TileMatrix(10, 2);
  });

  it('should put tile', () => {
    matrix.putTile(tile, TileType.MAP, { x: 0, y: 0, z: 0 });
    expect(tile.tileType).toEqual(TileType.MAP);
  });

  it('should check tile type', () => {
    expect(matrix.tileIs({ x: 0, y: 0, z: 0 }, [TileType.MAP])).toEqual(true);
  });

  it('should return tile', () => {
    expect(matrix.getTile({ x: 0, y: 0, z: 0 })).toEqual(tile);
  });

  it('should return tile with allowed types', () => {
    expect(matrix.getTileWithType({ x: 0, y: 0, z: 0 }, [TileType.MAP])).toEqual(tile);
    expect(matrix.getTileWithType({ x: 0, y: 0, z: 0 }, [TileType.MAP, TileType.BUILDING])).toEqual(tile);
    expect(matrix.getTileWithType({ x: 0, y: 0, z: 0 }, [TileType.BUILDING])).toEqual(null);
  });

  it('should not return tile for emtpy position', () => {
    expect(matrix.getTile({ x: 1, y: 1, z: 0 })).toEqual(null);
    expect(matrix.getTile({ x: 1, y: 1, z: -999 })).toEqual(null);
  });

  it('should remove tile', () => {
    const position = { x: 0, y: 0, z: 0 };

    matrix.removeTile(position);
    expect(matrix.getTile(position)).toEqual(null);
  });
});

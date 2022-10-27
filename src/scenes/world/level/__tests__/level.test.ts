import 'jest-canvas-mock';

import { BiomeType } from '~type/world/level';

import { Level } from '../level';

describe('level.ts', () => {
  it('should return biome data', () => {
    const biome = Level.GetBiome(BiomeType.SNOW);

    expect(biome.collide).toEqual(true);
    expect(biome.solid).toEqual(false);
  });

  it('should return depth', () => {
    expect(Level.GetDepth(100, 1, 16)).toEqual(1091);
    expect(Level.GetDepth(100, 2, 16)).toEqual(2090);
  });

  it('should return tile depth', () => {
    expect(Level.GetTileDepth(100, 1)).toEqual(1099);
    expect(Level.GetTileDepth(100, 2)).toEqual(2098);
  });

  it('should convert matrix position to world position', () => {
    expect(Level.ToWorldPosition({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(Level.ToWorldPosition({ x: 1, y: 1 })).toEqual({ x: 0, y: 24 });
  });

  it('should convert world position to matrix position', () => {
    expect(Level.ToMatrixPosition({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(Level.ToMatrixPosition({ x: 0, y: 24 })).toEqual({ x: 1, y: 1 });
  });
});

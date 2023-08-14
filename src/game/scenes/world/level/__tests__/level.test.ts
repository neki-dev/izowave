import 'jest-canvas-mock';

import { Level } from '../level';

describe('level.ts', () => {
  it('should return depth', () => {
    expect(Level.GetDepth(100, 1, 16)).toEqual(164);
    expect(Level.GetDepth(100, 2, 16)).toEqual(212);
  });

  it('should return tile depth', () => {
    expect(Level.GetTileDepth(100, 1)).toEqual(172);
    expect(Level.GetTileDepth(100, 2)).toEqual(220);
  });

  it('should convert matrix position to world position', () => {
    expect(Level.ToWorldPosition({ x: 0, y: 0, z: 0 })).toEqual({ x: 0, y: 0 });
    expect(Level.ToWorldPosition({ x: 1, y: 1, z: 0 })).toEqual({ x: 0, y: 24 });
  });

  it('should convert world position to matrix position', () => {
    expect(Level.ToMatrixPosition({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(Level.ToMatrixPosition({ x: 0, y: 24 })).toEqual({ x: 1, y: 1 });
  });
});

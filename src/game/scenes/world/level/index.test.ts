import 'jest-canvas-mock';

import { Level } from '.';

describe('world / level', () => {
  it('should convert matrix position to world position', () => {
    expect(Level.ToWorldPosition({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(Level.ToWorldPosition({ x: 1, y: 1 })).toEqual({ x: 0, y: 24 });
  });

  it('should convert world position to matrix position', () => {
    expect(Level.ToMatrixPosition({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(Level.ToMatrixPosition({ x: 0, y: 24 })).toEqual({ x: 1, y: 1 });
  });
});

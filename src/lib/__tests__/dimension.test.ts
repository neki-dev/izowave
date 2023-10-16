import {
  aroundPosition,
  getIsometricDistance,
  isPositionsEqual,
  getClosest,
  getIsometricAngle,
  excludePosition,
} from '../dimension';

describe('dimension.ts / isPositionsEqual', () => {
  it('should equal positions', () => {
    expect(isPositionsEqual({ x: 1, y: 1 }, { x: 1, y: 1 })).toEqual(true);
  });

  it('should not equal positions', () => {
    expect(isPositionsEqual({ x: 1, y: 1 }, { x: 2, y: 2 })).toEqual(false);
  });
});

describe('dimension.ts / excludePosition', () => {
  it('should exclude exist position', () => {
    const positions = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ];

    excludePosition(positions, { x: 0, y: 0 });
    expect(positions.length).toEqual(2);
  });

  it('should don`t exclude not exist position', () => {
    const positions = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ];

    excludePosition(positions, { x: 1, y: 1 });
    expect(positions.length).toEqual(3);
  });
});

describe('dimension.ts / getIsometricDistance', () => {
  it('should return correct distance', () => {
    expect(getIsometricDistance({ x: 0, y: 0 }, { x: 10, y: 0 })).toEqual(10);
    expect(getIsometricDistance({ x: 0, y: 0 }, { x: 0, y: 10 })).toEqual(17.5);
  });
});

describe('dimension.ts / getIsometricAngle', () => {
  it('should return correct angle', () => {
    expect(getIsometricAngle({ x: 0, y: 0 }, { x: 10, y: 0 })).toEqual(0);
    expect(getIsometricAngle({ x: 10, y: 0 }, { x: 0, y: 0 })).toEqual(Math.PI);
    expect(getIsometricAngle({ x: 0, y: 0 }, { x: 10, y: 10 })).toEqual(1.0516502125483738);
  });
});

describe('dimension.ts / getClosest', () => {
  it('should return closes position', () => {
    const positions = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: -10 },
      { x: 10, y: 0 },
    ];

    const closest = getClosest(positions, { x: 4, y: 4 });

    expect(`${closest?.x},${closest?.y}`).toEqual('0,0');
  });

  it('should return empty positions', () => {
    const closest = getClosest([], { x: 4, y: 4 });

    expect(closest).toEqual(null);
  });
});

describe('dimension.ts / aroundPosition', () => {
  it('should return correct around positions', () => {
    expect(aroundPosition({ x: 0, y: 0 }).length).toEqual(8);
  });
});

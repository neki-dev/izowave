import positions from '../__mocks__/positions';
import {
  aroundPosition,
  progressionQuadratic,
  equalPositions,
  formatTime,
  getClosest,
  progressionLinear,
  progressionLinearFrom,
} from '../utils';

describe('utils.ts / progression', () => {
  it('should return correct value growth', () => {
    expect(progressionQuadratic(100, 0.1, 1)).toEqual(100);
    expect(progressionQuadratic(100, 0.1, 3)).toEqual(122);
  });

  it('should return correct negative value growth', () => {
    expect(progressionQuadratic(100, -0.1, 1)).toEqual(100);
    expect(progressionQuadratic(100, -0.1, 3)).toEqual(81);
  });

  it('should return correct linear value growth', () => {
    expect(progressionLinear(100, 1.0, 2)).toEqual(200);
    expect(progressionLinear(100, 1.0, 3)).toEqual(300);
    expect(progressionLinearFrom(50, 100, 1.0, 2)).toEqual(150);
    expect(progressionLinearFrom(50, 100, 1.0, 3)).toEqual(250);
  });

  it('should return rounded value', () => {
    expect(progressionQuadratic(100, 0.1, 3, 10)).toEqual(130);
  });
});

describe('utils.ts / equalPositions', () => {
  it('should equal 2D positions', () => {
    expect(equalPositions({ x: 1, y: 1 }, { x: 1, y: 1 })).toEqual(true);
    expect(equalPositions({ x: 1, y: 1 }, { x: 2, y: 2 })).toEqual(false);
  });

  it('should equal 3D positions', () => {
    expect(equalPositions({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 })).toEqual(
      true,
    );
    expect(equalPositions({ x: 1, y: 1, z: 1 }, { x: 1, y: 1 })).toEqual(false);
  });
});

describe('utils.ts / formatTime', () => {
  it('should convert timestamp seconds to string time', () => {
    expect(formatTime(0)).toEqual('00:00');
    expect(formatTime(125000)).toEqual('02:05');
    expect(formatTime(124100)).toEqual('02:05');
  });
});

describe('utils.ts / getClosest', () => {
  it('should return closes position', () => {
    const closest = getClosest(positions, { x: 4, y: 4 });

    expect(`${closest?.x},${closest?.y}`).toEqual('0,0');
  });

  it('should return empty positions', () => {
    const closest = getClosest([], { x: 4, y: 4 });

    expect(closest).toEqual(null);
  });
});

describe('utils.ts / aroundPosition', () => {
  it('should return correct around positions', () => {
    expect(aroundPosition(positions[0]).length).toEqual(8);
  });
});

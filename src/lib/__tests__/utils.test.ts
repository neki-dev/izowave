import positions from '../__mocks__/positions';
import {
  aroundPosition,
  calcGrowth, equalPositions, formatTime, selectClosest,
} from '../utils';

describe('utils.ts / calcGrowth', () => {
  it('should return correct value growth', () => {
    expect(calcGrowth(100, 0.1, 1)).toEqual(100);
    expect(calcGrowth(100, 0.1, 3)).toEqual(121);
  });

  it('should return correct negative value growth', () => {
    expect(calcGrowth(100, -0.1, 1)).toEqual(100);
    expect(calcGrowth(100, -0.1, 3)).toEqual(79);
  });
});

describe('utils.ts / equalPositions', () => {
  it('should equal 2D positions', () => {
    expect(equalPositions({ x: 1, y: 1 }, { x: 1, y: 1 })).toEqual(true);
    expect(equalPositions({ x: 1, y: 1 }, { x: 2, y: 2 })).toEqual(false);
  });

  it('should equal 3D positions', () => {
    expect(equalPositions({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 })).toEqual(true);
    expect(equalPositions({ x: 1, y: 1, z: 1 }, { x: 1, y: 1 })).toEqual(false);
  });
});

describe('utils.ts / formatTime', () => {
  it('should convert timestamp seconds to string time', () => {
    expect(formatTime(0)).toEqual('00:00');
    expect(formatTime(125000)).toEqual('02:05');
  });
});

describe('utils.ts / selectClosest', () => {
  it('should returns specified count positions', () => {
    expect(selectClosest(positions, { x: 4, y: 4 }, 2).length).toEqual(2);
    expect(selectClosest(positions, { x: 4, y: 4 }).length).toEqual(1);
  });

  it('should returns sorted positions', () => {
    const [closest] = selectClosest(positions, { x: 4, y: 4 });

    expect(`${closest.x},${closest.y}`).toEqual('0,0');
  });
});

describe('utils.ts / aroundPosition', () => {
  it('should returns correct around positions', () => {
    expect(aroundPosition(positions[0]).length).toEqual(8);
    expect(aroundPosition(positions[0], 1).length).toEqual(16);
  });
});

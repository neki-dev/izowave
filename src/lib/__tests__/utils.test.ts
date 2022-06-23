import assert from 'assert';
import {
  calcGrowth, equalPositions, formatTime, selectClosest,
} from '../utils';

describe('utils.ts / calcGrowth', () => {
  it('should return correct value growth', () => {
    assert.equal(calcGrowth(100, 0.1, 1), 100);
    assert.equal(calcGrowth(100, 0.1, 3), 121);
  });

  it('should return correct negative value growth', () => {
    assert.equal(calcGrowth(100, -0.1, 1), 100);
    assert.equal(calcGrowth(100, -0.1, 3), 79);
  });
});

describe('utils.ts / equalPositions', () => {
  it('should equal 2D positions', () => {
    assert.equal(equalPositions({ x: 1, y: 1 }, { x: 1, y: 1 }), true);
    assert.equal(equalPositions({ x: 1, y: 1 }, { x: 2, y: 2 }), false);
  });

  it('should equal 3D positions', () => {
    assert.equal(equalPositions({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }), true);
    assert.equal(equalPositions({ x: 1, y: 1, z: 1 }, { x: 1, y: 1 }), false);
  });
});

describe('utils.ts / formatTime', () => {
  it('should convert timestamp seconds to string time', () => {
    assert.equal(formatTime(0), '00:00');
    assert.equal(formatTime(125), '02:05');
  });
});

const positions = [
  { x: 0, y: 0 },
  { x: 10, y: 10 },
  { x: 20, y: -10 },
  { x: 10, y: 0 },
];

describe('utils.ts / selectClosest', () => {
  it('should returns specified count positions', () => {
    let closests = selectClosest(positions, { x: 4, y: 4 }, 2);
    assert.equal(closests.length, 2);
    closests = selectClosest(positions, { x: 4, y: 4 });
    assert.equal(closests.length, 1);
  });

  it('should returns sorted positions', () => {
    const [closest] = selectClosest(positions, { x: 4, y: 4 });
    assert.equal(`${closest.x},${closest.y}`, '0,0');
  });
});

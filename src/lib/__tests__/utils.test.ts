import assert from 'assert';
import { calcGrowth, equalPositions } from '../utils';

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

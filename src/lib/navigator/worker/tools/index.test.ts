import grid from '../__mocks__/grid';
import points from '../__mocks__/points';
import { PathNode } from '../node';

import { isDiagonalShift, getCost, getSimpleCost, getDirections } from '.';

describe('lib / navigator / tools', () => {
  describe('isDiagonalShift', () => {
    it('should return false for straight shift', () => {
      expect(isDiagonalShift({ x: 1, y: 0 })).toEqual(false);
      expect(isDiagonalShift({ x: 0, y: 1 })).toEqual(false);
    });

    it('should return true for diagonal shift', () => {
      expect(isDiagonalShift({ x: 1, y: 1 })).toEqual(true);
      expect(isDiagonalShift({ x: -1, y: -1 })).toEqual(true);
    });
  });

  describe('getCost', () => {
    let node: PathNode;

    beforeAll(() => {
      node = new PathNode({
        position: { x: 0, y: 0 },
        distance: 0,
      });
    });

    it('should return cost for straight shift', () => {
      expect(getCost(node, { x: 1, y: 0 }, points)).toEqual(2);
    });

    it('should return cost for diagonal shift', () => {
      expect(getCost(node, { x: 1, y: 1 }, points)).toEqual(6.82842712474619);
    });
  });

  describe('getSimpleCost', () => {
    it('should return simple cost for straight shift', () => {
      expect(getSimpleCost({ x: 1, y: 0 })).toEqual(1);
    });

    it('should return simple cost for diagonal shift', () => {
      expect(getSimpleCost({ x: 1, y: 1 })).toEqual(Math.SQRT2);
    });
  });

  describe('getDirections', () => {
    it('should return possible directions from current node', () => {
      const node1 = new PathNode({
        position: { x: 0, y: 0 },
        distance: 0,
      });

      expect(getDirections(grid, node1)).toEqual([
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ]);

      const node2 = new PathNode({
        position: { x: 0, y: 2 },
        distance: 0,
      });

      expect(getDirections(grid, node2)).toEqual([
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
      ]);
    });
  });
});

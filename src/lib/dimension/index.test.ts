import {
  aroundPosition,
  getIsometricDistance,
  isPositionsEqual,
  getClosestByIsometricDistance,
  getIsometricAngle,
  excludePosition,
  sortByMatrixDistance,
  getDistance,
} from '.';

describe('lib / dimension', () => {
  describe('isPositionsEqual', () => {
    it('should equal positions', () => {
      expect(isPositionsEqual({ x: 1, y: 1 }, { x: 1, y: 1 })).toEqual(true);
    });

    it('should not equal positions', () => {
      expect(isPositionsEqual({ x: 1, y: 1 }, { x: 2, y: 2 })).toEqual(false);
    });
  });

  describe('excludePosition', () => {
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

  describe('getDistance', () => {
    it('should return correct distance', () => {
      expect(getDistance({ x: 0, y: 0 }, { x: 0, y: 0 })).toEqual(0);
      expect(getDistance({ x: 0, y: 0 }, { x: 0, y: 10 })).toEqual(10);
      expect(getDistance({ x: 0, y: 0 }, { x: 2, y: 2 })).toEqual(2.8284271247461903);
    });
  });

  describe('getIsometricDistance', () => {
    it('should return correct distance', () => {
      expect(getIsometricDistance({ x: 0, y: 0 }, { x: 0, y: 0 })).toEqual(0);
      expect(getIsometricDistance({ x: 0, y: 0 }, { x: 0, y: 10 })).toEqual(17.5);
    });
  });

  describe('getIsometricAngle', () => {
    it('should return correct angle', () => {
      expect(getIsometricAngle({ x: 0, y: 0 }, { x: 10, y: 0 })).toEqual(0);
      expect(getIsometricAngle({ x: 10, y: 0 }, { x: 0, y: 0 })).toEqual(Math.PI);
      expect(getIsometricAngle({ x: 0, y: 0 }, { x: 10, y: 10 })).toEqual(1.0516502125483738);
    });
  });

  describe('getClosest', () => {
    it('should return closes position', () => {
      const positions = [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 20, y: -10 },
        { x: 10, y: 0 },
      ];

      const closest = getClosestByIsometricDistance(positions, { x: 4, y: 4 });

      expect(`${closest?.x},${closest?.y}`).toEqual('0,0');
    });

    it('should return empty positions', () => {
      const closest = getClosestByIsometricDistance([], { x: 4, y: 4 });

      expect(closest).toEqual(null);
    });
  });

  describe('sortByMatrixDistance', () => {
    it('should return sorted positions', () => {
      expect(
        sortByMatrixDistance([
          { x: 0, y: 100 },
          { x: 100, y: 50 },
          { x: 60, y: 100 },
          { x: 5, y: 5 },
        ], { x: 0, y: 0 }),
      ).toEqual([
        { x: 5, y: 5 },
        { x: 0, y: 100 },
        { x: 100, y: 50 },
        { x: 60, y: 100 },
      ]);
    });
  });

  describe('aroundPosition', () => {
    it('should return correct around positions', () => {
      expect(aroundPosition({ x: 0, y: 0 }).length).toEqual(8);
    });
  });
});

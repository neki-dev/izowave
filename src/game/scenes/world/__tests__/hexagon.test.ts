import 'jest-canvas-mock';

import { Hexagon } from '../hexagon';

describe('hexagon.ts', () => {
  let hexagon: Hexagon;

  beforeAll(() => {
    hexagon = new Hexagon(0, 0, 10);
  });

  it('should return current polygons count', () => {
    expect(hexagon.points.length).toEqual(6);
  });

  it('should contain point', () => {
    expect(hexagon.contains(5, 5)).toEqual(true);
  });

  it('should not contain point', () => {
    expect(hexagon.contains(15, 5)).toEqual(true);
  });
});

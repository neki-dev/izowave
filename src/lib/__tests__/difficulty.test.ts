import { progressionQuadratic, progressionLinear } from '../difficulty';

describe('difficulty.ts', () => {
  it('should return correct value growth', () => {
    expect(progressionQuadratic({ defaultValue: 100, scale: 0.1, level: 1 })).toEqual(100);
    expect(progressionQuadratic({ defaultValue: 100, scale: 0.1, level: 3 })).toEqual(121);
  });

  it('should return correct value growth with retardation', () => {
    expect(progressionQuadratic({
      defaultValue: 90, scale: 0.3, level: 15,
    })).toEqual(3543);
    expect(progressionQuadratic({
      defaultValue: 90, scale: 0.3, level: 15, retardationLevel: 15,
    })).toEqual(3543);
    expect(progressionQuadratic({
      defaultValue: 90, scale: 0.3, level: 20,
    })).toEqual(13157);
    expect(progressionQuadratic({
      defaultValue: 90, scale: 0.3, level: 20, retardationLevel: 15,
    })).toEqual(8857);
  });

  it('should return correct negative value growth', () => {
    expect(progressionQuadratic({ defaultValue: 100, scale: -0.1, level: 1 })).toEqual(100);
    expect(progressionQuadratic({ defaultValue: 100, scale: -0.1, level: 3 })).toEqual(81);
  });

  it('should return correct linear value growth', () => {
    expect(progressionLinear({ defaultValue: 100, scale: 1.0, level: 2 })).toEqual(200);
    expect(progressionLinear({ defaultValue: 100, scale: 1.0, level: 3 })).toEqual(300);
  });

  it('should return rounded value', () => {
    expect(progressionQuadratic({
      defaultValue: 100, scale: 0.1, level: 3, roundTo: 10,
    })).toEqual(120);
  });
});

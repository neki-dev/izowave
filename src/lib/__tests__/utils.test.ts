import {
  getStage,
  formatTime,
  hashString,
  formatAmount,
  rawAmount,
} from '../utils';

describe('lib / utils', () => {
  describe('formatTime', () => {
    it('should convert timestamp seconds to string time', () => {
      expect(formatTime(0)).toEqual('00:00');
      expect(formatTime(125000)).toEqual('02:05');
      expect(formatTime(124100)).toEqual('02:05');
    });
  });

  describe('formatAmount', () => {
    it('should format positive amount', () => {
      expect(formatAmount(5)).toEqual('+5');
    });

    it('should format negative amount', () => {
      expect(formatAmount(-5)).toEqual('-5');
    });
  });

  describe('rawAmount', () => {
    it('should get raw positive amount', () => {
      expect(rawAmount('+5')).toEqual(5);
    });

    it('should get raw negative amount', () => {
      expect(rawAmount('-5')).toEqual(-5);
    });
  });

  describe('hashString', () => {
    it('should get string hash', () => {
      expect(hashString('a')).toEqual('97');
    });

    it('should get similar hash for similar string', () => {
      const string = 'test';

      expect(hashString(string)).toEqual(hashString(string));
    });
  });

  describe('getStage', () => {
    it('should calculate stage', () => {
      expect(getStage(1, 1)).toEqual(1);
      expect(getStage(1, 2)).toEqual(2);
      expect(getStage(1, 3)).toEqual(2);
      expect(getStage(1, 4)).toEqual(3);

      expect(getStage(8, 8)).toEqual(1);
      expect(getStage(8, 9)).toEqual(2);
      expect(getStage(8, 10)).toEqual(2);
      expect(getStage(8, 11)).toEqual(3);
    });
  });
});

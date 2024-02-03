import { Utils } from '.';

describe('lib / utils', () => {
  describe('formatTime', () => {
    it('should convert timestamp seconds to string time', () => {
      expect(Utils.FormatTime(0)).toEqual('00:00');
      expect(Utils.FormatTime(125000)).toEqual('02:05');
      expect(Utils.FormatTime(124100)).toEqual('02:05');
    });
  });

  describe('formatAmount', () => {
    it('should format positive amount', () => {
      expect(Utils.FormatAmount(5)).toEqual('+5');
    });

    it('should format negative amount', () => {
      expect(Utils.FormatAmount(-5)).toEqual('-5');
    });
  });

  describe('hashString', () => {
    it('should get string hash', () => {
      expect(Utils.HashString('a')).toEqual('97');
    });

    it('should get similar hash for similar string', () => {
      const string = 'test';

      expect(Utils.HashString(string)).toEqual(Utils.HashString(string));
    });
  });

  describe('getStage', () => {
    it('should calculate stage', () => {
      expect(Utils.GetStage(1, 1)).toEqual(1);
      expect(Utils.GetStage(1, 2)).toEqual(2);
      expect(Utils.GetStage(1, 3)).toEqual(2);
      expect(Utils.GetStage(1, 4)).toEqual(3);

      expect(Utils.GetStage(8, 8)).toEqual(1);
      expect(Utils.GetStage(8, 9)).toEqual(2);
      expect(Utils.GetStage(8, 10)).toEqual(2);
      expect(Utils.GetStage(8, 11)).toEqual(3);
    });
  });
});

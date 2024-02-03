export {};

declare global {
  namespace Phaser {
    namespace Utils {
      namespace Array {
        // PR: [https://github.com/photonstorm/phaser/pull/6660]
        // Incorrect original return type
        function GetRandom<T>(array: T[], startIndex?: number, length?: number): T;
      }
    }
  }
}

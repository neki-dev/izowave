import Phaser from 'phaser';

/**
 * Quadratic equation for calculating difficulty
 * relative to the specified level.
 *
 * @param startValue - Default value for first level
 * @param growthScale - Part of start value for growth
 * @param level - Difficulty level
 */
export function calcGrowth(
  startValue: number,
  growthScale: number,
  level: number,
): number {
  return Math.round(startValue + (((level - 1) ** 1.1) * (startValue * growthScale)));
}

/**
 * Check positions is equals.
 *
 * @param a - First position
 * @param b - Second position
 */
export function equalPositions(
  a: Phaser.Types.Math.Vector3Like,
  b: Phaser.Types.Math.Vector3Like,
): boolean {
  return (a.x === b.x && a.y === b.y && a.z === b.z);
}

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

/**
 * Format timestamp to string time.
 *
 * @param value - Timestamp
 */
export function formatTime(value: number): string {
  const h = Math.floor(value / 60);
  const m = value % 60;
  return `${(h < 10 ? '0' : '')}${h}:${(m < 10 ? '0' : '')}${m}`;
}

/**
 * To even number.
 *
 * @param value - Number
 * @param shift - Inc or dec value
 */
export function toEven(value: number, shift: (-1 | 1) = 1): number {
  if (value % 2 === 0) {
    return value;
  }
  return value + shift;
}

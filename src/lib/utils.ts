import { MIN_VALID_SCREEN_SIZE } from '~const/game';
import { Vector2D, Vector3D } from '~type/world/level';

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
export function equalPositions(a: Vector2D | Vector3D, b: Vector2D | Vector3D): boolean {
  if ('z' in a) {
    if ('z' in b) {
      return (a.x === b.x && a.y === b.y && a.z === b.z);
    }

    return false;
  }

  return (a.x === b.x && a.y === b.y);
}

/**
 * Format timestamp to string time.
 *
 * @param value - Timestamp in seconds
 */
export function formatTime(value: number): string {
  const h = Math.floor(value / 60);
  const m = value % 60;

  return `${(h < 10 ? '0' : '')}${h}:${(m < 10 ? '0' : '')}${m}`;
}

/**
 * Select closest positions to target.
 *
 * @param positions - Positions list
 * @param target - Target position
 * @param count - Count return positions
 */
export function selectClosest<T extends Vector2D>(
  positions: T[],
  target: Vector2D,
  count: number = 1,
): T[] {
  let meta = positions.map((position) => {
    const dx = position.x - target.x;
    const dy = position.y - target.y;

    return {
      position,
      distance: Math.sqrt(dx * dx + dy * dy),
    };
  });

  // Sort by distance to target
  meta = meta.sort((a, b) => (a.distance - b.distance))
    .slice(0, count);

  return meta.map(({ position }) => position);
}

/**
 * Get array of positions around source position.
 *
 * @param position - Source position
 * @param space - Space between source position and around positions
 */
export function aroundPosition(
  position: Vector2D,
  space: number = 0,
): Vector2D[] {
  const list = [];
  const shift = space + 1;

  for (let y = position.y - shift; y <= position.y + shift; y++) {
    for (let x = position.x - shift; x <= position.x + shift; x++) {
      if (
        x === position.x - shift
        || x === position.x + shift
        || y === position.y - shift
        || y === position.y + shift
      ) {
        list.push({ x, y });
      }
    }
  }

  return list;
}

/**
 * Add sign to amount.
 *
 * @param value - Amount
 */
export function formatAmount(value: number): string {
  return `${(value > 0) ? '+' : ''}${value}`;
}

/**
 * Remove sign from amount.
 *
 * @param value - Amount
 */
export function rawAmount(value: string): number {
  return Number(value.replace('+', ''));
}

/**
 * Call function with frequency limit.
 *
 * @param fn - Function
 * @param delay - Call delay
 */
export function debounce(fn: (...params: any[]) => void, delay: number) {
  let timeout: Nullable<NodeJS.Timeout> = null;

  return {
    call(this: any, ...args: any[]) {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        fn.apply(this, args);
        timeout = null;
      }, delay);
    },
    reject() {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    },
  };
}

/**
 * Check device screen size.
 */
export function isValidScreenSize() {
  return (
    window.innerWidth >= MIN_VALID_SCREEN_SIZE[0]
    && window.innerHeight >= MIN_VALID_SCREEN_SIZE[1]
  );
}

/**
 * Check device OS.
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

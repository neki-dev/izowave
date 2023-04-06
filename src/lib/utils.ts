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
) {
  return Math.round(startValue + (((level - 1) ** 1.1) * (startValue * growthScale)));
}

/**
 * Check positions is equals.
 *
 * @param a - First position
 * @param b - Second position
 */
export function equalPositions(a: Vector2D | Vector3D, b: Vector2D | Vector3D) {
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
 * @param value - Timestamp in miliseconds
 */
export function formatTime(value: number) {
  const s = Math.floor(value / 1000);
  const h = Math.floor(s / 60);
  const m = s % 60;

  return `${(h < 10 ? '0' : '')}${h}:${(m < 10 ? '0' : '')}${m}`;
}

/**
 * Get closest position to target.
 *
 * @param positions - Positions list
 * @param target - Target position
 */
export function getClosest<T extends Vector2D>(
  positions: T[],
  target: Vector2D,
): Nullable<T> {
  let closest: {
    distance: number
    position: T
  } = {
    distance: Infinity,
    position: null,
  };

  for (const position of positions) {
    const dx = position.x - target.x;
    const dy = position.y - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < closest.distance) {
      closest = { position, distance };
    }
  }

  return closest.position;
}

/**
 * Sort position by distance to target.
 *
 * @param positions - Positions list
 * @param target - Target position
 */
export function sortByDistance<T extends Vector2D>(
  positions: T[],
  target: Vector2D,
) {
  let meta = positions.map((position) => {
    const dx = position.x - target.x;
    const dy = position.y - target.y;

    return {
      position,
      distance: Math.sqrt(dx * dx + dy * dy),
    };
  });

  meta = meta.sort((a, b) => (a.distance - b.distance));

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
) {
  const list: Vector2D[] = [];
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
export function formatAmount(value: number) {
  return `${(value > 0) ? '+' : ''}${value}`;
}

/**
 * Remove sign from amount.
 *
 * @param value - Amount
 */
export function rawAmount(value: string) {
  return Number(value.replace('+', ''));
}

/**
 * Get mutable array.
 *
 * @param current - Current array
 * @param target - New array
 * @param keys - Keys to compare
 */
export function getMutable<T>(current: T[], target: T[], keys: (keyof T)[]) {
  if (current.length !== target.length) {
    return target;
  }

  for (let i = 0; i < current.length; i++) {
    for (const key of keys) {
      if (current[i][key] !== target[i][key]) {
        return target;
      }
    }
  }

  return current;
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

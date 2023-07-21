import { MIN_VALID_SCREEN_SIZE } from '~const/game';
import { Vector2D, Vector3D } from '~type/world/level';

/**
 * Round number to specified scale.
 * @param value - Number
 * @param scale - Scale
 */
export function roundToScale(value: number, scale?: number) {
  return scale ? Math.ceil(value / scale) * scale : Math.ceil(value);
}

/**
 * Function to quadratic progressively increase value,
 * relative to specified level.
 * @param defaultValue - Default value for first level
 * @param scale - Part of default value for growth
 * @param level - Difficulty level
 * @param roundTo - Round value
 */
export function progressionQuadratic(
  defaultValue: number,
  scale: number,
  level: number,
  roundTo?: number,
) {
  const value = defaultValue * (scale + 1) ** (level - 1);

  return roundToScale(value, roundTo);
}

/**
 * Function to force quadratic progressively increase value,
 * relative to specified level.
 * @param defaultValue - Default value for first level
 * @param scale - Part of default value for growth
 * @param level - Difficulty level
 * @param roundTo - Round value
 */
export function progressionQuadraticForce(
  defaultValue: number,
  scale: number,
  level: number,
  roundTo?: number,
) {
  const value = defaultValue * level ** (scale + 1);

  return roundToScale(value, roundTo);
}

/**
 * Function to linear progressively increase value,
 * relative to specified level.
 * @param defaultValue - Default value for first level
 * @param scale - Part of default value for growth
 * @param level - Difficulty level
 * @param roundTo - Round value
 */
export function progressionLinear(
  defaultValue: number,
  scale: number,
  level: number,
  roundTo?: number,
) {
  const value = defaultValue + defaultValue * scale * (level - 1);

  return roundToScale(value, roundTo);
}

/**
 * Function to linear progressively increase value,
 * relative to current value and specified level.
 * @param currentValue - Current value
 * @param defaultValue - Default value for first level
 * @param scale - Part of default value for growth
 * @param level - Difficulty level
 * @param roundTo - Round value
 */
export function progressionLinearFrom(
  currentValue: number,
  defaultValue: number,
  scale: number,
  level: number,
  roundTo?: number,
) {
  const value = currentValue + defaultValue * scale * (level - 1);

  return roundToScale(value, roundTo);
}

/**
 * Check positions is equals.
 * @param a - First position
 * @param b - Second position
 */
export function equalPositions(a: Vector2D | Vector3D, b: Vector2D | Vector3D) {
  if ('z' in a) {
    if ('z' in b) {
      return a.x === b.x && a.y === b.y && a.z === b.z;
    }

    return false;
  }

  return a.x === b.x && a.y === b.y;
}

/**
 * Format timestamp to string time.
 * @param value - Timestamp in miliseconds
 */
export function formatTime(value: number) {
  const m = Math.floor(value / 1000 / 60);
  const s = Math.ceil(value / 1000) % 60;

  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Get closest position to target.
 * @param positions - Positions list
 * @param target - Target position
 */
export function getClosest<T extends Vector2D>(
  positions: T[],
  target: Vector2D,
): Nullable<T> {
  let closest: {
    distance: number
    position: Nullable<T>
  } = {
    distance: Infinity,
    position: null,
  };

  positions.forEach((position) => {
    const dx = position.x - target.x;
    const dy = position.y - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < closest.distance) {
      closest = { position, distance };
    }
  });

  return closest.position;
}

/**
 * Sort position by distance to target.
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

  meta = meta.sort((a, b) => a.distance - b.distance);

  return meta.map(({ position }) => position);
}

/**
 * Get array of positions around source position.
 * @param position - Source position
 */
export function aroundPosition(position: Vector2D) {
  const list: Vector2D[] = [];

  for (let y = position.y - 1; y <= position.y + 1; y++) {
    for (let x = position.x - 1; x <= position.x + 1; x++) {
      if (!equalPositions({ x, y }, position)) {
        list.push({ x, y });
      }
    }
  }

  return list;
}

/**
 * Add sign to amount.
 * @param value - Amount
 */
export function formatAmount(value: number) {
  return `${value > 0 ? '+' : ''}${value}`;
}

/**
 * Remove sign from amount.
 * @param value - Amount
 */
export function rawAmount(value: string) {
  return Number(value.replace('+', ''));
}

/**
 * Call function with frequency limit.
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
 * Each object entries.
 * @param obj - Object
 * @param callback - Callback
 */
export function eachEntries<T extends Record<string, any>>(
  obj: T,
  callback: (key: keyof T, value: T[keyof T], index: number) => void,
) {
  Object.entries(obj).forEach(([key, value], index) => {
    callback(key, value, index);
  });
}

/**
 * Map object entries.
 * @param obj - Object
 * @param callback - Callback
 */
export function mapEntries<T extends Record<string, any>>(
  obj: T,
  callback: (key: keyof T, value: T[keyof T], index: number) => any,
) {
  return Object.entries(obj).map(([key, value], index) => callback(key, value, index));
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
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

import { LEVEL_MAP_TILE } from '~const/world/level';
import { Vector2D } from '~type/world/level';

/**
 * Check positions is equals.
 * @param a - First position
 * @param b - Second position
 */
export function isPositionsEqual(a: Vector2D, b: Vector2D) {
  return a.x === b.x && a.y === b.y;
}

/**
 * Remove target position from positions list.
 * @param positions - Positions list
 * @param target - Target position
 */
export function excludePosition(positions: Vector2D[], target: Vector2D) {
  const index = positions.findIndex((position) => isPositionsEqual(position, target));

  if (index !== -1) {
    positions.splice(index, 1);
  }
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
 * Get distance between points on isometric grid.
 * @param pointA - First position
 * @param pointB - Second position
 */
export function getIsometricDistance(
  pointA: Vector2D,
  pointB: Vector2D,
) {
  return Math.sqrt(
    (pointB.x - pointA.x) ** 2
    + ((pointB.y - pointA.y) / LEVEL_MAP_TILE.persperctive) ** 2,
  );
}

/**
 * Get angle between points on isometric grid.
 * @param pointA - First position
 * @param pointB - Second position
 */
export function getIsometricAngle(
  pointA: Vector2D,
  pointB: Vector2D,
) {
  return Math.atan2(
    (pointB.y - pointA.y) / LEVEL_MAP_TILE.persperctive,
    pointB.x - pointA.x,
  );
}

/**
 * Sort position by distance to target.
 * @param positions - Positions list
 * @param target - Target position
 */
export function sortByMatrixDistance<T extends Vector2D>(
  positions: T[],
  target: Vector2D,
) {
  return positions
    .map((position) => ({
      position,
      distance: Phaser.Math.Distance.BetweenPoints(target, position),
    }))
    .sort((a, b) => (a.distance - b.distance))
    .map(({ position }) => position);
}

/**
 * Get array of positions around source position.
 * @param position - Source position
 */
export function aroundPosition(position: Vector2D) {
  const list: Vector2D[] = [];

  for (let y = position.y - 1; y <= position.y + 1; y++) {
    for (let x = position.x - 1; x <= position.x + 1; x++) {
      if (!isPositionsEqual({ x, y }, position)) {
        list.push({ x, y });
      }
    }
  }

  return list;
}

/**
 * Get all points on matrix between two given points.
 * @param beg - Start position
 * @param end - End posotion
 */
export function interpolate(beg: Vector2D, end: Vector2D) {
  const line: Vector2D[] = [];

  const current = { ...beg };
  const dx = Math.abs(end.x - beg.x);
  const dy = Math.abs(end.y - beg.y);
  const sx = (beg.x < end.x) ? 1 : -1;
  const sy = (beg.y < end.y) ? 1 : -1;

  let err = dx - dy;
  let shift;

  line.push({ ...current });

  while (!isPositionsEqual(current, end)) {
    shift = 2 * err;

    if (shift > -dy) {
      err -= dy;
      current.x += sx;
    }
    if (shift < dx) {
      err += dx;
      current.y += sy;
    }

    line.push({ ...current });
  }

  return line;
}

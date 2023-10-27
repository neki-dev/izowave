import { LEVEL_MAP_PERSPECTIVE } from '~const/world/level';
import { PositionAtWorld, PositionAtMatrix } from '~type/world/level';

/**
 * Check positions is equals.
 * @param pointA - First position
 * @param pointB - Second position
 */
export function isPositionsEqual(pointA: PositionAtWorld, pointB: PositionAtWorld) {
  return pointA.x === pointB.x && pointA.y === pointB.y;
}

/**
 * Remove target position from positions list.
 * @param positions - Positions list
 * @param target - Target position
 */
export function excludePosition(positions: PositionAtWorld[], target: PositionAtWorld) {
  const index = positions.findIndex((position) => isPositionsEqual(position, target));

  if (index !== -1) {
    positions.splice(index, 1);
  }
}

/**
 * Get distance between points on matrix.
 * @param pointA - First position
 * @param pointB - Second position
 */
export function getDistance(
  pointA: PositionAtMatrix,
  pointB: PositionAtMatrix,
) {
  return Math.hypot(
    pointB.x - pointA.x,
    pointB.y - pointA.y,
  );
}

/**
 * Get distance between points on isometric.
 * @param pointA - First position
 * @param pointB - Second position
 */
export function getIsometricDistance(
  pointA: PositionAtWorld,
  pointB: PositionAtWorld,
) {
  return Math.hypot(
    pointB.x - pointA.x,
    (pointB.y - pointA.y) / LEVEL_MAP_PERSPECTIVE,
  );
}

/**
 * Get angle between points on isometric.
 * @param pointA - First position
 * @param pointB - Second position
 */
export function getIsometricAngle(
  pointA: PositionAtWorld,
  pointB: PositionAtWorld,
) {
  return Math.atan2(
    (pointB.y - pointA.y) / LEVEL_MAP_PERSPECTIVE,
    pointB.x - pointA.x,
  );
}

/**
 * Get closest position to target.
 * @param positions - Positions list
 * @param target - Target position
 */
export function getClosestByIsometricDistance<T extends PositionAtWorld>(
  positions: T[],
  target: PositionAtWorld,
): Nullable<T> {
  let closest: {
    distance: number
    position: Nullable<T>
  } = {
    distance: Infinity,
    position: null,
  };

  positions.forEach((position) => {
    const distance = getIsometricDistance(target, position);

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
export function sortByMatrixDistance<T extends PositionAtMatrix>(
  positions: T[],
  target: PositionAtMatrix,
) {
  return positions
    .map((position) => ({
      position,
      distance: getDistance(position, target),
    }))
    .sort((a, b) => (a.distance - b.distance))
    .map(({ position }) => position);
}

/**
 * Get array of positions around source position.
 * @param position - Source position
 */
export function aroundPosition(position: PositionAtMatrix) {
  const list: PositionAtMatrix[] = [];

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
export function interpolate(beg: PositionAtMatrix, end: PositionAtMatrix) {
  const line: PositionAtMatrix[] = [];

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

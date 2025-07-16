import { LEVEL_MAP_PERSPECTIVE } from '~scene/world/level/const';
import type { PositionAtWorld, PositionAtMatrix, PositionAtWorldTransform } from '~scene/world/level/types';

/**
 * Check positions is equals.
 * @param pointA - First position
 * @param pointB - Second position
 */
export function isPositionsEqual(pointA: PositionAtWorld, pointB: PositionAtWorld) {
  return (
    pointA.x === pointB.x &&
    pointA.y === pointB.y
  );
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
export function getClosestByIsometricDistance<T extends PositionAtWorldTransform>(
  positions: T[],
  target: PositionAtWorldTransform,
): Nullable<T> {
  if (positions.length === 0) {
    return null;
  }

  let closest: {
    distance: number
    position: Nullable<T>
  } = {
    distance: Infinity,
    position: null,
  };

  const targetPosition = target.getBottomEdgePosition?.() ?? target;

  positions.forEach((position) => {
    const currentPosition = position.getBottomEdgePosition?.() ?? position;
    const distance = getIsometricDistance(targetPosition, currentPosition);

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

import type { PathNode } from '../node';

import { Utils } from '~lib/utils';
import type { PositionAtMatrix } from '~scene/world/level/types';

export function isDiagonalShift(shift: PositionAtMatrix) {
  return Math.abs(shift.x) + Math.abs(shift.y) !== 1;
}

export function getCost(
  currentNode: PathNode,
  shift: PositionAtMatrix,
  points: number[][],
) {
  const position: PositionAtMatrix = {
    x: currentNode.position.x + shift.x,
    y: currentNode.position.y + shift.y,
  };
  const cost = points[position.y]?.[position.x] ?? 1.0;

  if (isDiagonalShift(shift)) {
    return (
      cost * Math.SQRT2
      + (points[currentNode.position.y]?.[position.x] ?? 0.0)
      + (points[position.y]?.[currentNode.position.x] ?? 0.0)
    );
  }

  return cost;
}

export function getSimpleCost(shift: PositionAtMatrix) {
  return isDiagonalShift(shift) ? Math.SQRT2 : 1.0;
}

export function getDirections(grid: boolean[][], currentNode: PathNode) {
  const straightFlags: Record<string, boolean> = {};
  const straightDirs: Record<string, PositionAtMatrix> = {
    R: { x: 1, y: 0 }, // →
    L: { x: -1, y: 0 }, // ←
    D: { x: 0, y: 1 }, // ↓
    U: { x: 0, y: -1 }, // ↑
  };
  const diagonalDirs: Record<string, PositionAtMatrix> = {
    RD: { x: 1, y: 1 }, // ↘
    RU: { x: 1, y: -1 }, // ↗
    LU: { x: -1, y: -1 }, // ↖
    LD: { x: -1, y: 1 }, // ↙
  };

  const allowedDirs: PositionAtMatrix[] = [];

  Utils.EachObject(straightDirs, (key, dir) => {
    const x = currentNode.position.x + dir.x;
    const y = currentNode.position.y + dir.y;

    if (grid[y]?.[x] === false) {
      straightFlags[key] = true;
      allowedDirs.push(dir);
    }
  });

  Utils.EachObject(diagonalDirs, (key, dir) => {
    const dontCross = key.split('').every((flag) => straightFlags[flag]);
    const x = currentNode.position.x + dir.x;
    const y = currentNode.position.y + dir.y;

    if (dontCross && grid[y]?.[x] === false) {
      allowedDirs.push(dir);
    }
  });

  return allowedDirs;
}

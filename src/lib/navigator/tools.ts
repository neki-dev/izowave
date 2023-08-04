import { eachEntries } from '~lib/utils';
import { Vector2D } from '~type/world/level';

import { PathNode } from './node';

export function getDistance(point1: Vector2D, point2: Vector2D) {
  const a = point2.x - point1.x;
  const b = point2.y - point1.y;
  const distance = Math.sqrt(a * a + b * b);

  return distance;
}

export function getDirections(grid: boolean[][], currentNode: PathNode) {
  const straightFlags: Record<string, boolean> = {};
  const straightDirs: Record<string, Vector2D> = {
    R: { x: 1, y: 0 }, // →
    L: { x: -1, y: 0 }, // ←
    D: { x: 0, y: 1 }, // ↓
    U: { x: 0, y: -1 }, // ↑
  };
  const diagonalDirs: Record<string, Vector2D> = {
    RD: { x: 1, y: 1 }, // ↘
    RU: { x: 1, y: -1 }, // ↗
    LU: { x: -1, y: -1 }, // ↖
    LD: { x: -1, y: 1 }, // ↙
  };

  const allowedDirs: Vector2D[] = [];

  eachEntries(straightDirs, (key, dir) => {
    const x = currentNode.x + dir.x;
    const y = currentNode.y + dir.y;

    if (grid[y]?.[x] === false) {
      straightFlags[key] = true;
      allowedDirs.push(dir);
    }
  });

  eachEntries(diagonalDirs, (key, dir) => {
    const dontCross = key.split('').every((flag) => straightFlags[flag]);
    const x = currentNode.x + dir.x;
    const y = currentNode.y + dir.y;

    if (dontCross && grid[y]?.[x] === false) {
      allowedDirs.push(dir);
    }
  });

  return allowedDirs;
}

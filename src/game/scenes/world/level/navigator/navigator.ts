/* eslint-disable no-continue */

import { eachEntries } from '~lib/system';
import { equalPositions } from '~lib/utils';
import { Vector2D } from '~type/world/level';
import { NavigatorTaskState } from '~type/world/level/navigator';

import { PathNode } from './node';
import { NavigatorTask } from './task';

export class Navigator {
  readonly matrix: number[][] = [];

  private pointsToCost: number[][] = [];

  private taskQueue: NavigatorTask[] = [];

  constructor(matrix: number[][]) {
    this.matrix = matrix;
  }

  public setPointCost(x: number, y: number, cost: number) {
    if (!this.pointsToCost[y]) {
      this.pointsToCost[y] = [];
    }
    this.pointsToCost[y][x] = cost;
  }

  public resetPointCost(x: number, y: number) {
    if (!this.pointsToCost[y]) {
      return;
    }
    delete this.pointsToCost[y][x];
  }

  public resetPointsCost() {
    this.pointsToCost = [];
  }

  public getPointCost(x: number, y: number) {
    return this.pointsToCost[y]?.[x] ?? 1.0;
  }

  public createTask(
    from: Vector2D,
    to: Vector2D,
    callback: (path: Nullable<Vector2D[]>) => void,
  ) {
    const task = new NavigatorTask(from, to, callback);
    const node = new PathNode(null, {
      position: task.from,
      cost: 1.0,
      distance: Phaser.Math.Distance.BetweenPoints(task.from, task.to),
    });

    task.addNode(node);

    this.taskQueue.push(task);

    return task;
  }

  public processing() {
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue[0];

      if (task.state === NavigatorTaskState.CANCELED) {
        this.taskQueue.shift();
        continue;
      }

      if (task.state === NavigatorTaskState.IDLE) {
        task.state = NavigatorTaskState.PROCESSING;
      }

      const currentNode = task.takeLastNode();

      if (!currentNode) {
        this.taskQueue.shift();
        task.failure();
        continue;
      }

      if (equalPositions(task.to, currentNode)) {
        this.taskQueue.shift();
        task.complete(currentNode);
        continue;
      }

      currentNode.closeList();
      for (const offset of this.getAllowedDirections(currentNode)) {
        this.checkAdjacentNode(task, currentNode, offset);
      }
    }
  }

  private getAllowedDirections(currentNode: PathNode) {
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
      if (this.isWalkable(currentNode.x + dir.x, currentNode.y + dir.y)) {
        straightFlags[key] = true;
        allowedDirs.push(dir);
      }
    });

    eachEntries(diagonalDirs, (key, dir) => {
      const dontCross = key.split('').every((flag) => straightFlags[flag]);

      if (dontCross && this.isWalkable(currentNode.x + dir.x, currentNode.y + dir.y)) {
        allowedDirs.push(dir);
      }
    });

    return allowedDirs;
  }

  private checkAdjacentNode(task: NavigatorTask, currentNode: PathNode, shift: Vector2D) {
    const x = currentNode.x + shift.x;
    const y = currentNode.y + shift.y;

    const c = (Math.abs(shift.x) + Math.abs(shift.y) === 1) ? 1.0 : Math.SQRT2;
    const cost = currentNode.getCost() + (this.getPointCost(x, y) * c);

    const existNode = task.pickNode(x, y);

    if (existNode) {
      if (cost < existNode.getCost()) {
        existNode.setCost(cost);
        existNode.setParent(currentNode);
        task.upNode(existNode);
      }
    } else {
      const node = new PathNode(currentNode, {
        position: { x, y },
        cost,
        distance: Phaser.Math.Distance.BetweenPoints({ x, y }, task.to),
      });

      node.openList();
      task.addNode(node);
    }
  }

  private isWalkable(x: number, y: number) {
    return (this.matrix[y]?.[x] === 0);
  }
}

/* eslint-disable no-continue */
import { eachEntries, equalPositions } from '~lib/utils';
import { Vector2D } from '~type/world/level';
import { INavigator, NavigatorTaskState, TaskData } from '~type/world/level/navigator';

import { PathNode } from './node';
import { NavigatorTask } from './task';

export class Navigator implements INavigator {
  private pointsToCost: number[][] = [];

  private taskQueue: NavigatorTask[] = [];

  public setPointCost(position: Vector2D, cost: number) {
    if (!this.pointsToCost[position.y]) {
      this.pointsToCost[position.y] = [];
    }
    this.pointsToCost[position.y][position.x] = cost;
  }

  public resetPointCost(position: Vector2D) {
    if (!this.pointsToCost[position.y]) {
      return;
    }

    delete this.pointsToCost[position.y][position.x];
  }

  public getPointCost(position: Vector2D) {
    return this.pointsToCost[position.y]?.[position.x] ?? 1.0;
  }

  public createTask(data: TaskData) {
    const task = new NavigatorTask(data);
    const node = new PathNode(null, {
      position: task.from,
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

      Navigator.GetAllowedDirections(task.grid, currentNode).forEach((offset) => {
        this.checkAdjacentNode(task, currentNode, offset);
      });
    }
  }

  private checkAdjacentNode(task: NavigatorTask, currentNode: PathNode, shift: Vector2D) {
    const position: Vector2D = {
      x: currentNode.x + shift.x,
      y: currentNode.y + shift.y,
    };

    const c = (Math.abs(shift.x) + Math.abs(shift.y) === 1) ? 1.0 : Math.SQRT2;
    const cost = currentNode.getCost() + (this.getPointCost(position) * c);

    const existNode = task.pickNode(position);

    if (existNode) {
      if (cost < existNode.getCost()) {
        existNode.setCost(cost);
        existNode.setParent(currentNode);
        task.upNode(existNode);
      }
    } else {
      const node = new PathNode(currentNode, {
        position,
        cost,
        distance: Phaser.Math.Distance.BetweenPoints(position, task.to),
      });

      node.openList();
      task.addNode(node);
    }
  }

  static GetAllowedDirections(grid: boolean[][], currentNode: PathNode) {
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
}

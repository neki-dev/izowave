/* eslint-disable no-continue */

import { equalPositions } from '~lib/utils';
import PathNode from './node';
import NavigatorTask from './task';

import { NavigatorTaskState } from '~type/navigator';

const ADJACENT_DIRECTIONS = [
  { x: 0, y: 1 }, { x: 1, y: 0 },
  { x: 0, y: -1 }, { x: -1, y: 0 },
  { x: 1, y: 1 }, { x: 1, y: -1 },
  { x: -1, y: 1 }, { x: -1, y: -1 },
];

export default class Navigator {
  readonly matrix: number[][];

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

  public getPointCost(x: number, y: number): number {
    return this.pointsToCost[y]?.[x] || 1.0;
  }

  public createTask(
    from: Phaser.Types.Math.Vector2Like,
    to: Phaser.Types.Math.Vector2Like,
    callback: (path: Phaser.Types.Math.Vector2Like[]) => void,
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
      for (const offset of ADJACENT_DIRECTIONS) {
        this.checkAdjacentNode(task, currentNode, offset);
      }
    }
  }

  private checkAdjacentNode(task: NavigatorTask, currentNode: PathNode, shift: Phaser.Types.Math.Vector2Like) {
    const x = currentNode.x + shift.x;
    const y = currentNode.y + shift.y;
    if (!this.isWalkable(x, y)) {
      return;
    }

    const C = (Math.abs(shift.x) + Math.abs(shift.y) === 1) ? 1.0 : 1.4;
    const cost = currentNode.getCost() + (this.getPointCost(x, y) * C);

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

  private isWalkable(x: number, y: number): boolean {
    return (this.matrix[y]?.[x] === 0);
  }
}

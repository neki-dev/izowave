/* eslint-disable no-continue */
import type { NavigatorTask } from './task';
import { getDirections } from './tools';

import { isPositionsEqual } from '~lib/dimension';
import type { PositionAtMatrix } from '~scene/world/level/types';

export class NavigatorProcess {
  private pointsCost: number[][] = [];

  public taskQueue: NavigatorTask[] = [];

  public createTask(task: NavigatorTask) {
    this.taskQueue.push(task);
  }

  public cancelTask(id: string) {
    const taskIndex = this.taskQueue.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      this.taskQueue.splice(taskIndex, 1);
    }
  }

  public setPointCost(position: PositionAtMatrix, cost: Nullable<number>) {
    if (cost === null) {
      if (!this.pointsCost[position.y]) {
        return;
      }

      delete this.pointsCost[position.y][position.x];
    } else {
      if (!this.pointsCost[position.y]) {
        this.pointsCost[position.y] = [];
      }
      this.pointsCost[position.y][position.x] = cost;
    }
  }

  public processing() {
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue[0];
      const currentNode = task.takeLastNode();

      if (!currentNode) {
        this.taskQueue.shift();
        task.failure();
        continue;
      }

      if (isPositionsEqual(task.to, currentNode.position)) {
        this.taskQueue.shift();
        task.complete(currentNode);
        continue;
      }

      currentNode.closeList();

      getDirections(task.grid, currentNode).forEach((offset) => {
        task.checkAdjacentNode(currentNode, offset, this.pointsCost);
      });
    }
  }
}

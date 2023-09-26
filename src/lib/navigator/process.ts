/* eslint-disable no-continue */
import { equalPositions } from '~lib/utils';

import { NavigatorTask } from './task';
import { getDirections } from './tools';

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

  public updatePointsCost(matrix: number[][]) {
    this.pointsCost = matrix;
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

      if (equalPositions(task.to, currentNode.position)) {
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

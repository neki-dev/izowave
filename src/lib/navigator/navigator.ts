import { v4 as uuidv4 } from 'uuid';

import {
  INavigator,
  NavigatorTaskInfo,
  NavigatorWorkerResult,
  NavigatorTaskData,
  NavigatorEvent,
} from '~type/navigator';
import { Vector2D } from '~type/world/level';

import NavigatorWorker from './worker.ts?worker';

export class Navigator implements INavigator {
  private pointsCost: number[][] = [];

  private tasks: NavigatorTaskInfo[] = [];

  private worker: Worker;

  constructor() {
    this.worker = new NavigatorWorker();

    this.worker.addEventListener('message', ({ data }: NavigatorWorkerResult) => {
      const task = this.tasks.find((info) => info.id === data.payload.id);

      if (task) {
        switch (data.event) {
          case NavigatorEvent.COMPLETE_TASK:
            task.callback(data.payload.result.path, data.payload.result.cost);
            break;
        }
      }
    });
  }

  public setPointCost(position: Vector2D, cost: number) {
    if (this.getPointCost(position) === cost) {
      return;
    }

    if (!this.pointsCost[position.y]) {
      this.pointsCost[position.y] = [];
    }
    this.pointsCost[position.y][position.x] = cost;

    this.worker.postMessage({
      event: NavigatorEvent.UPDATE_POINT_COST,
      payload: {
        position,
        cost,
      },
    });
  }

  public getPointCost(position: Vector2D) {
    return this.pointsCost[position.y]?.[position.x] ?? 1.0;
  }

  public resetPointCost(position: Vector2D) {
    if (!this.pointsCost[position.y]) {
      return;
    }

    delete this.pointsCost[position.y][position.x];

    this.worker.postMessage({
      event: NavigatorEvent.UPDATE_POINT_COST,
      payload: {
        position,
        cost: null,
      },
    });
  }

  public createTask(
    data: NavigatorTaskData,
    callback: (path: Nullable<Vector2D[]>, cost: number) => void,
  ) {
    const payload = { ...data };

    payload.id = payload.id ?? uuidv4();

    this.worker.postMessage({
      event: NavigatorEvent.CREATE_TASK,
      payload,
    });

    this.tasks.push({
      id: payload.id,
      callback,
    });

    return payload.id;
  }

  public cancelTask(id: string) {
    this.worker.postMessage({
      event: NavigatorEvent.CANCEL_TASK,
      payload: { taskId: id },
    });

    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
    }
  }
}

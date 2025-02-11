import { v4 as uuidv4 } from 'uuid';

import { NavigatorEvent } from './types';
import type {
  INavigator,
  NavigatorTaskInfo,
  NavigatorWorkerResult,
  NavigatorPayloadCompleteTask,
  NavigatorPayloadUpdatePointCost,
  NavigatorTaskData,
  NavigatorTaskCallback,
  NavigatorPayloadCreateTask,
  NavigatorPayloadCancelTask,
} from './types';
import NavigatorWorker from './worker/index.ts?worker';

import type { PositionAtMatrix } from '~scene/world/level/types';

export class Navigator implements INavigator {
  private pointsCost: number[][] = [];

  private tasks: NavigatorTaskInfo[] = [];

  private worker: Worker;

  constructor() {
    this.worker = new NavigatorWorker();

    this.worker.addEventListener('message', ({ data }: NavigatorWorkerResult) => {
      switch (data.event) {
        case NavigatorEvent.COMPLETE_TASK: {
          const payload = data.payload as NavigatorPayloadCompleteTask;
          const task = this.tasks.find((info) => info.id === payload.id);

          if (task) {
            task.callback(payload.result.path, payload.result.cost);
          } else {
            // Events occurs for canceled tasks, since the path calculation occurs sequentially in single process.
            // Need to figure out how to interrupt the calculation for a canceled task.
          }
          break;
        }
      }
    });
  }

  public setPointCost(position: PositionAtMatrix, cost: number) {
    if (this.getPointCost(position) === cost) {
      return;
    }

    if (!this.pointsCost[position.y]) {
      this.pointsCost[position.y] = [];
    }
    this.pointsCost[position.y][position.x] = cost;

    const payload: NavigatorPayloadUpdatePointCost = {
      position,
      cost,
    };

    this.worker.postMessage({
      event: NavigatorEvent.UPDATE_POINT_COST,
      payload,
    });
  }

  public getPointCost(position: PositionAtMatrix) {
    return this.pointsCost[position.y]?.[position.x] ?? 1.0;
  }

  public resetPointCost(position: PositionAtMatrix) {
    if (!this.pointsCost[position.y]) {
      return;
    }

    delete this.pointsCost[position.y][position.x];

    const payload: NavigatorPayloadUpdatePointCost = {
      position,
      cost: null,
    };

    this.worker.postMessage({
      event: NavigatorEvent.UPDATE_POINT_COST,
      payload,
    });
  }

  public createTask(data: NavigatorTaskData, callback: NavigatorTaskCallback) {
    const payload: NavigatorPayloadCreateTask = {
      ...data,
      id: data.id ?? uuidv4(),
    };

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
    const payload: NavigatorPayloadCancelTask = { id };

    this.worker.postMessage({
      event: NavigatorEvent.CANCEL_TASK,
      payload,
    });

    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
    }
  }
}

import type { PathNode } from './worker/node';

import type { PositionAtMatrix } from '~scene/world/level/types';

export interface INavigator {
  /**
   * Set point cost.
   * @param position - Position at matrix
   * @param cost - Cost
   */
  setPointCost(position: PositionAtMatrix, cost: number): void

  /**
   * Get point cost.
   * @param position - Position at matrix
   */
  getPointCost(position: PositionAtMatrix): number

  /**
   * Reset point cost.
   * @param position - Position at matrix
   */
  resetPointCost(position: PositionAtMatrix): void

  /**
   * Create navigation task.
   * @param data - Task data
   * @param callback - Complete callback
   */
  createTask(data: NavigatorTaskData, callback: NavigatorTaskCallback): string

  /**
   * Cancel navigation task.
   * @param id - Task id
   */
  cancelTask(id: string): void
}

export enum NavigatorEvent {
  CREATE_TASK = 'create_task',
  COMPLETE_TASK = 'complete_task',
  CANCEL_TASK = 'cancel_task',
  UPDATE_POINT_COST = 'update_point_cost',
}

export type NavigatorTaskData = {
  id?: string
  from: PositionAtMatrix
  to: PositionAtMatrix
  grid: boolean[][]
  ignoreCosts?: boolean
};

export type NavigatorPathNodeData = {
  position: PositionAtMatrix
  parent?: Nullable<PathNode>
  cost?: number
  distance: number
};

export type NavigatorWorkerResult = {
  data: {
    event: string
    payload: any
  }
};

export type NavigatorTaskInfo = {
  id: string
  callback: NavigatorTaskCallback
};

export type NavigatorPayloadCreateTask = NavigatorTaskData & {
  id: string
};

export type NavigatorPayloadCompleteTask = {
  id: string
  result: {
    path: Nullable<PositionAtMatrix[]>
    cost: number
  }
};

export type NavigatorPayloadCancelTask = {
  id: string
};

export type NavigatorPayloadUpdatePointCost = {
  position: PositionAtMatrix
  cost: Nullable<number>
};

export type NavigatorTaskCallback = (path: Nullable<PositionAtMatrix[]>, cost: number) => void;

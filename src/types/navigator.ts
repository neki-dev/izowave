import { Vector2D } from '~type/world/level';

export interface INavigator {
  /**
   * Set point cost.
   * @param position - Position at matrix
   * @param cost - Cost
   */
  setPointCost(position: Vector2D, cost: number): void

  /**
   * Reset point cost.
   * @param position - Position at matrix
   */
  resetPointCost(position: Vector2D): void

  /**
   * Create navigation task.
   * @param data - Task data
   * @param callback - Complete callback
   */
  createTask(
    data: NavigatorTaskData,
    callback: (path: Nullable<Vector2D[]>) => void
  ): string

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
  UPDATE_POINTS_COST = 'update_points_cost',
}

export enum NavigatorTaskState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

export type NavigatorTaskData = {
  id?: string
  from: Vector2D
  to: Vector2D
  grid: boolean[][]
  compress?: boolean
};

export type NavigatorPathNodeData = {
  position: Vector2D
  cost?: number
  distance: number
};

export type NavigatorWorkerResult = {
  data: {
    event: string
    payload: Record<string, any>
  }
};

export type NavigatorTaskInfo = {
  id: string
  state: NavigatorTaskState
  callback: (path: Nullable<Vector2D[]>) => void
};

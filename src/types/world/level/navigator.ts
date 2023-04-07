import { NavigatorTask } from '~scene/world/level/navigator/task';

import { Vector2D } from './level';

export interface INavigator {
  setPointCost(position: Vector2D, cost: number): void

  getPointCost(position: Vector2D): number

  resetPointCost(position: Vector2D): void

  resetPointsCost(): void

  createTask(from: Vector2D, to: Vector2D, callback: (path: Nullable<Vector2D[]>) => void): NavigatorTask

  processing(): void
}

export enum NavigatorTaskState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

export type PathNodeData = {
  position: Vector2D
  cost: number
  distance: number
};

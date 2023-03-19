import { Vector2D } from './level';

export enum NavigatorTaskState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

export type PathNodeParams = {
  position: Vector2D
  cost: number
  distance: number
};

export enum NavigatorTaskState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

export type PathNodeParams = {
  position: Phaser.Types.Math.Vector2Like
  cost: number
  distance: number
};

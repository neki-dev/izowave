import { Vector2D } from '../level';

export enum PlayerEvents {
  UPDATE_EXPERIENCE = 'update_experience',
  UPDATE_RESOURCE = 'update_resource',
}

export enum PlayerTexture {
  PLAYER = 'player',
}

export enum PlayerAudio {
  LEVEL_UP = 'player/level_up',
  MOVE = 'player/move',
  DEAD = 'player/dead',
}

export enum MovementDirection {
  LEFT = -1,
  RIGHT = 1,
  UP = -1,
  DOWN = 1,
  NONE = 0,
}

export type PlayerData = {
  positionAtMatrix: Vector2D
};

export enum PlayerEvents {
  UPDATE_EXPERIENCE = 'update_experience',
  UPDATE_RESOURCE = 'update_resource',
}

export enum PlayerTexture {
  PLAYER = 'player',
}

export type PlayerStat = {
  waves?: number
  kills?: number
  level?: number
  lived?: number
};

export enum MovementDirection {
  LEFT = -1,
  RIGHT = 1,
  UP = -1,
  DOWN = 1,
  NONE = 0,
}

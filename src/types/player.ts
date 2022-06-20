export enum PlayerEvents {
  LEVEL_UP = 'levelup',
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

export enum MovementDirectionValue {
  LEFT = -1,
  RIGHT = 1,
  UP = -1,
  DOWN = 1,
  NONE = 0,
}

export type MovementDirection = {
  x: MovementDirectionValue
  y: MovementDirectionValue
};

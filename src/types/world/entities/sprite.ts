import { Vector2D } from '~type/world/level';

export type SpriteData = {
  texture: string
  positionAtMatrix: Vector2D
  frame?: number
  health: number
};

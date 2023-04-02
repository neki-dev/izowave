import { Vector2D } from '~type/world/level';

export enum ChestTexture {
  CHEST = 'chest',
}

export enum ChestAudio {
  OPEN = 'chest/open',
}

export type ChestData = {
  positionAtMatrix: Vector2D
  variant?: number
};

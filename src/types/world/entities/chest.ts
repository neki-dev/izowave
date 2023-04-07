import Phaser from 'phaser';

import { Vector2D } from '~type/world/level';

import { IWorld } from '../world';

export interface IChest extends Phaser.GameObjects.Image {
  readonly scene: IWorld

  /**
   * Take resources from chest and destroy him.
   */
  open(): void
}

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

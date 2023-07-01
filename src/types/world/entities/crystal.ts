import Phaser from 'phaser';

import { Vector2D } from '~type/world/level';

import { IWorld } from '../world';

export interface ICrystal extends Phaser.GameObjects.Image {
  readonly scene: IWorld

  /**
   * Take resources from crystal and destroy him.
   */
  pickup(): void
}

export enum CrystalTexture {
  CRYSTAL = 'crystal',
}

export enum CrystalAudio {
  PICKUP = 'crystal/pickup',
}

export type CrystalData = {
  positionAtMatrix: Vector2D
  variant?: number
};

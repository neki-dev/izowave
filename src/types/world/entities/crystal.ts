import Phaser from 'phaser';

import { IWorld } from '~type/world';
import { Vector2D } from '~type/world/level';

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

import Phaser from 'phaser';

import { IWorld } from '~type/world';
import { Vector2D } from '~type/world/level';

export interface ICrystal extends Phaser.GameObjects.Image {
  readonly scene: IWorld

  /**
   * Position at matrix.
   */
  readonly positionAtMatrix: Vector2D

  /**
   * Take resources from crystal and destroy him.
   */
  pickup(): void

  /**
   * Get data for saving.
   */
  getSavePayload(): CrystalSavePayload
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

export type CrystalSavePayload = {
  position: Vector2D
};

import type Phaser from 'phaser';

import type { PositionAtMatrix, PositionAtWorld } from '~scene/world/level/types';
import type { IWorld } from '~scene/world/types';

export interface ICrystal extends Phaser.GameObjects.Image {
  readonly scene: IWorld

  /**
   * Position at matrix.
   */
  readonly positionAtMatrix: PositionAtMatrix

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
  CRYSTAL = 'crystal/crystal',
}

export enum CrystalAudio {
  PICKUP = 'crystal/pickup',
}

export enum CrystalEvents {
  PICKUP = 'pickup',
}

export type CrystalData = {
  positionAtMatrix: PositionAtMatrix
  variant?: number
};

export type CrystalAmount = {
  position: PositionAtWorld
  value: number
};

export type CrystalSavePayload = {
  position: PositionAtMatrix
};

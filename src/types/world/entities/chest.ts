import Phaser from 'phaser';

export enum ChestTexture {
  CHEST = 'chest',
}

export enum ChestAudio {
  OPEN = 'chest/open',
}

export type ChestData = {
  positionAtMatrix: Phaser.Types.Math.Vector2Like
  variant?: number
};

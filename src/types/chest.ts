import Phaser from 'phaser';

export enum ChestTexture {
  DEFAULT = 'chest',
}

export type ChestData = {
  positionAtMatrix: Phaser.Types.Math.Vector2Like
  variant?: number
};

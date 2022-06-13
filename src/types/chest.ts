import Phaser from 'phaser';

export enum ChestTexture {
  DEFAULT = 'chest',
}

export type ChestData = {
  position: Phaser.Types.Math.Vector2Like // Position at matrix
  variant?: number
};

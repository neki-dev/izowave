import Phaser from 'phaser';

export type SpriteData = {
  texture: string
  position: Phaser.Types.Math.Vector2Like // Position at matrix
  frame?: number
};

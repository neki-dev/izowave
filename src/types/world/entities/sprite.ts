import Phaser from 'phaser';

export type SpriteData = {
  texture: string
  positionAtMatrix: Phaser.Types.Math.Vector2Like
  frame?: number
  health: number
};

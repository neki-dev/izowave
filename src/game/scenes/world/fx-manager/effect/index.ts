import Phaser from 'phaser';

import type { WorldScene } from '../..';

import type { EffectData } from './types';

import './resources';

export class Effect extends Phaser.GameObjects.Sprite {
  declare public readonly scene: WorldScene;

  constructor(scene: WorldScene, {
    texture, position, staticFrame, depth, rate = 16,
  }: EffectData) {
    super(scene, position.x, position.y, texture, staticFrame ?? 0);
    scene.add.existing(this);

    if (depth) {
      this.setDepth(depth);
    }

    if (staticFrame === undefined) {
      this.anims.create({
        key: 'effect',
        frames: this.anims.generateFrameNumbers(texture, {}),
        frameRate: rate,
      });
      this.anims.play('effect');

      this.on('animationcomplete', () => {
        this.destroy();
      });
    }
  }
}

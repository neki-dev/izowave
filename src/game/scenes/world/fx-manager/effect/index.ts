import Phaser from 'phaser';

import type { WorldScene } from '../..';

import { EffectAudio, EffectTexture } from './types';
import type { EffectData } from './types';

import { Assets } from '~lib/assets';

Assets.RegisterAudio(EffectAudio);
Assets.RegisterSprites(EffectTexture, {
  width: 32,
  height: 32,
});

export class Effect extends Phaser.GameObjects.Sprite {
  readonly scene: WorldScene;

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

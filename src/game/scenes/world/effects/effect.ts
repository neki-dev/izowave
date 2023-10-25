import Phaser from 'phaser';

import { Assets } from '~lib/assets';
import { IWorld } from '~type/world';
import {
  EffectAudio, EffectData, EffectTexture, IEffect,
} from '~type/world/effects';

Assets.RegisterAudio(EffectAudio);
Assets.RegisterSprites(EffectTexture, {
  width: 32,
  height: 32,
});

export class Effect extends Phaser.GameObjects.Sprite implements IEffect {
  readonly scene: IWorld;

  constructor(scene: IWorld, {
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

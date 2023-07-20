import Phaser from 'phaser';

import { registerSpriteAssets } from '~lib/assets';
import { IWorld } from '~type/world';
import { EffectData, EffectTexture, IEffect } from '~type/world/effects';

export class Effect extends Phaser.GameObjects.Sprite implements IEffect {
  readonly scene: IWorld;

  constructor(scene: IWorld, {
    texture, position, staticFrame, depth, rate = 16,
  }: EffectData) {
    super(scene, position.x, position.y, texture, staticFrame ?? 0);
    scene.add.existing(this);

    this.setDepth(depth);

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

registerSpriteAssets(EffectTexture, {
  width: 32,
  height: 32,
});

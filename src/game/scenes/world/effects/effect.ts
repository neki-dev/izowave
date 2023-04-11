import Phaser from 'phaser';

import { registerSpriteAssets } from '~lib/assets';
import { Level } from '~scene/world/level';
import { IWorld } from '~type/world';
import { EffectData, EffectTexture, IEffect } from '~type/world/effects';

export class Effect extends Phaser.GameObjects.Sprite implements IEffect {
  readonly scene: IWorld;

  constructor(scene: IWorld, {
    texture, position, audio, permanentFrame, depth, scale = 1.0, rate = 16,
  }: EffectData) {
    super(scene, position.x, position.y, texture, permanentFrame ?? 0);
    scene.add.existing(this);

    this.setDepth(depth ?? Level.GetTileDepth(this.y, 1));
    this.setScale(scale);

    if (audio) {
      this.scene.sound.play(audio);
    }

    if (permanentFrame === undefined) {
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

import Phaser from 'phaser';

import { registerSpriteAssets } from '~lib/assets';
import { World } from '~game/scenes/world';
import { Level } from '~game/scenes/world/level';
import { EffectData, EffectTexture } from '~type/world/effects';

export class Effect extends Phaser.GameObjects.Sprite {
  constructor(scene: World, {
    texture, position, audio, rate = 16,
  }: EffectData) {
    super(scene, position.x, position.y, texture);
    scene.add.existing(this);

    this.setDepth(Level.GetTileDepth(this.y, 1));

    if (audio) {
      this.scene.sound.play(audio);
    }

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

registerSpriteAssets(EffectTexture, {
  width: 32,
  height: 32,
});

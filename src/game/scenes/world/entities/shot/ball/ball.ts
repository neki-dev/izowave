import Phaser from 'phaser';

import { registerAudioAssets, registerImageAssets } from '~lib/assets';
import { Particles } from '~scene/world/effects';
import { Level } from '~scene/world/level';
import { IWorld } from '~type/world';
import { ParticlesType } from '~type/world/effects';
import { IEnemy } from '~type/world/entities/npc/enemy';
import {
  ShotParams, ShotBallData, ShotBallAudio, ShotBallTexture, IShotInitiator, IShotBall,
} from '~type/world/entities/shot';
import { Vector2D } from '~type/world/level';

export class ShotBall extends Phaser.Physics.Arcade.Image implements IShotBall {
  readonly scene: IWorld;

  readonly body: Phaser.Physics.Arcade.Body;

  public params: ShotParams;

  private initiator: Nullable<IShotInitiator> = null;

  private audio: ShotBallAudio;

  private effect: Nullable<Particles> = null;

  private startPosition: Nullable<Vector2D> = null;

  private glowColor: Nullable<number> = null;

  constructor(scene: IWorld, params: ShotParams, {
    texture, audio, glowColor = null,
  }: ShotBallData) {
    super(scene, null, null, texture);
    scene.add.existing(this);
    scene.entityGroups.shots.add(this);

    this.params = params;
    this.audio = audio;
    this.glowColor = glowColor;

    this.setActive(false);
    this.setVisible(false);

    this.scene.physics.add.collider(this, this.scene.entityGroups.enemies, (_, enemy: IEnemy) => {
      this.hit(enemy);
    });
  }

  public setInitiator(initiator: IShotInitiator) {
    this.initiator = initiator;

    initiator.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.destroy();
    });
  }

  public update() {
    const distance = Phaser.Math.Distance.BetweenPoints(this, this.startPosition);

    if (distance > this.params.maxDistance) {
      this.stop();

      return;
    }

    const isVisibleTile = this.scene.level.isVisibleTile({
      ...Level.ToMatrixPosition(this),
      z: 0,
    });

    this.setVisible(isVisibleTile);
    if (this.effect) {
      this.effect.setVisible(isVisibleTile);
    }

    if (isVisibleTile) {
      const depth = Level.GetDepth(this.y, 1, this.displayHeight);

      this.setDepth(depth);
    }
  }

  public shoot(target: IEnemy) {
    if (!this.initiator) {
      return;
    }

    this.setVisible(this.initiator.visible);
    this.setPosition(this.initiator.x, this.initiator.y);
    this.setActive(true);

    if (this.glowColor) {
      this.effect = new Particles(this, {
        type: ParticlesType.GLOW,
        params: {
          follow: this,
          lifespan: { min: 100, max: 200 },
          scale: { start: 0.25, end: 0.0 },
          quantity: 2,
          blendMode: 'ADD',
          tint: this.glowColor,
        },
      });
      this.effect.setVisible(this.visible);
    }

    this.startPosition = { x: this.x, y: this.y };

    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.scene.physics.moveTo(this, target.x, target.y, this.params.speed);

    if (this.scene.sound.getAll(this.audio).length < 3) {
      this.scene.sound.play(this.audio);
    }
  }

  private hit(target: IEnemy) {
    if (this.params.freeze) {
      target.freeze(this.params.freeze);
    }
    if (this.params.damage) {
      target.live.damage(this.params.damage);
    }

    this.stop();
  }

  private stop() {
    if (this.effect) {
      this.effect.destroy();
      this.effect = null;
    }

    this.setActive(false);
    this.setVisible(false);

    this.startPosition = null;

    this.scene.physics.world.disable(this);
  }
}

registerAudioAssets(ShotBallAudio);
registerImageAssets(ShotBallTexture);

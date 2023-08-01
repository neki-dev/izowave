import Phaser from 'phaser';

import { Enemy } from '~entity/npc/variants/enemy';
import { registerAudioAssets, registerImageAssets } from '~lib/assets';
import { Particles } from '~scene/world/effects';
import { Level } from '~scene/world/level';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
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

  private positionCallback: Nullable<() => Vector2D> = null;

  private audio: ShotBallAudio;

  private effect: Nullable<Particles> = null;

  private startPosition: Nullable<Vector2D> = null;

  private glowColor: Nullable<number> = null;

  constructor(scene: IWorld, params: ShotParams, {
    texture, audio, glowColor = null,
  }: ShotBallData) {
    super(scene, 0, 0, texture);
    scene.addEntity(EntityType.SHOT, this);

    this.params = params;
    this.audio = audio;
    this.glowColor = glowColor;

    this.setActive(false);
    this.setVisible(false);

    this.scene.physics.add.collider(
      this,
      this.scene.getEntitiesGroup(EntityType.ENEMY),
      (_, subject) => {
        if (subject instanceof Enemy) {
          this.hit(subject);
        }
      },
    );
  }

  public setInitiator(initiator: IShotInitiator, positionCallback: Nullable<() => Vector2D> = null) {
    this.initiator = initiator;
    this.positionCallback = positionCallback;

    initiator.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.destroy();
    });
  }

  public update() {
    if (!this.params.maxDistance || !this.startPosition) {
      return;
    }

    const distance = Phaser.Math.Distance.BetweenPoints(this, this.startPosition);

    if (distance > this.params.maxDistance) {
      this.stop();

      return;
    }

    const depth = Level.GetDepth(this.y, 1);

    this.setDepth(depth);
  }

  public shoot(target: IEnemy) {
    if (!this.initiator || !this.params.speed) {
      return;
    }

    const position = this.positionCallback?.() ?? this.initiator;

    this.setPosition(position.x, position.y);
    this.setActive(true);
    this.setVisible(true);

    if (
      this.glowColor
      && this.scene.game.isSettingEnabled(GameSettings.EFFECTS)
    ) {
      this.effect = new Particles(this, {
        key: 'glow',
        texture: ParticlesTexture.GLOW,
        params: {
          follow: this,
          lifespan: { min: 100, max: 200 },
          scale: { start: 0.25, end: 0.0 },
          quantity: 2,
          blendMode: 'ADD',
          tint: this.glowColor,
        },
      });
    }

    this.startPosition = { x: this.x, y: this.y };

    const distanceToTarget = Phaser.Math.Distance.BetweenPoints(this, target.body.center);
    const speed = Math.min(this.params.speed, 1200);
    const timeToTarget = (distanceToTarget / speed);
    const targetPosition = this.scene.getFuturePosition(target, timeToTarget);

    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.scene.physics.moveTo(this, targetPosition.x, targetPosition.y, speed);

    if (this.scene.game.sound.getAll(this.audio).length < 3) {
      this.scene.game.sound.play(this.audio);
    }
  }

  private hit(target: IEnemy) {
    if (this.params.freeze && target.live.armour <= 0) {
      const duration = this.params.freeze / this.scale;

      target.freeze(duration, true);
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

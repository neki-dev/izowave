import Phaser from 'phaser';

import { Analytics } from '~lib/analytics';
import { Assets } from '~lib/assets';
import { getIsometricDistance } from '~lib/dimension';
import { Particles } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
import { IEnemy } from '~type/world/entities/npc/enemy';
import {
  ShotParams, ShotBallData, ShotBallAudio, IShotInitiator, IShotBall, ShotTexture,
} from '~type/world/entities/shot';
import { PositionAtWorld } from '~type/world/level';

Assets.RegisterAudio(ShotBallAudio);
Assets.RegisterImages(ShotTexture);

export class ShotBall extends Phaser.Physics.Arcade.Image implements IShotBall {
  readonly scene: IWorld;

  readonly body: Phaser.Physics.Arcade.Body;

  public params: ShotParams;

  private initiator: Nullable<IShotInitiator> = null;

  private positionCallback: Nullable<() => PositionAtWorld> = null;

  private audio: ShotBallAudio;

  private effect: Nullable<Particles> = null;

  private startPosition: Nullable<PositionAtWorld> = null;

  private color: number = 0xffffff;

  private glow: boolean = false;

  private altitude: number = 0;

  constructor(scene: IWorld, params: ShotParams, {
    audio, color, glow = false, scale = 1.0,
  }: ShotBallData) {
    super(scene, 0, 0, ShotTexture.BALL);
    scene.add.existing(this);
    scene.addEntityToGroup(this, EntityType.SHOT);

    this.color = color;
    this.glow = glow;
    this.params = params;
    this.audio = audio;

    this.setActive(false);
    this.setVisible(false);
    this.setScale(scale);
    this.setTint(color);

    this.scene.physics.add.collider(
      this,
      this.scene.getEntitiesGroup(EntityType.ENEMY),
      (_, enemy) => {
        try {
          this.hit(enemy as IEnemy);
        } catch (error) {
          Analytics.TrackError(error as TypeError);
        }
      },
    );
  }

  public setInitiator(
    initiator: IShotInitiator,
    positionCallback: Nullable<() => PositionAtWorld> = null,
  ) {
    this.initiator = initiator;
    this.positionCallback = positionCallback;

    initiator.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.effect?.destroy();
      this.destroy();
    });
  }

  public update() {
    if (!this.params.maxDistance || !this.startPosition) {
      return;
    }

    const distance = getIsometricDistance(this, this.startPosition);

    if (distance > this.params.maxDistance) {
      this.stop();

      return;
    }

    this.setDepth(this.y + this.altitude);
  }

  public shoot(target: IEnemy, params?: ShotParams) {
    if (!this.initiator) {
      return;
    }

    if (params) {
      this.params = params;
    }

    if (!this.params.speed) {
      return;
    }

    const position = this.positionCallback?.() ?? this.initiator;

    this.setPosition(position.x, position.y);
    this.setActive(true);
    this.setVisible(true);

    if (this.glow && this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      this.effect = new Particles(this, {
        key: 'glow',
        texture: ParticlesTexture.GLOW,
        dynamic: true,
        params: {
          scale: 0.2 * this.scale,
          alpha: { start: 1.0, end: 0.0 },
          lifespan: 20000 / this.params.speed,
          frequency: 10000 / this.params.speed,
          tint: this.color,
          blendMode: 'ADD',
        },
      });
    }

    this.altitude = this.initiator.getBottomFace().y - position.y;
    this.startPosition = {
      x: position.x,
      y: position.y,
    };

    const distanceToTarget = getIsometricDistance(position, target.body.center);
    const timeToTarget = distanceToTarget / this.params.speed;
    const targetPosition = this.scene.getFuturePosition(target, timeToTarget);

    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.scene.physics.moveTo(this, targetPosition.x, targetPosition.y, this.params.speed);

    if (this.scene.game.sound.getAll(this.audio).length < 3) {
      this.scene.game.sound.play(this.audio);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public hit(target: IEnemy) {
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

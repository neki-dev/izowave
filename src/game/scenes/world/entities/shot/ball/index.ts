import Phaser from 'phaser';

import type { Enemy } from '../../npc/enemy';
import { EntityType } from '../../types';
import { ShotTexture } from '../types';
import type { ShotParams, IShotInitiator, IShot } from '../types';

import type { ShotBallAudio, ShotBallData } from './types';

import { getIsometricDistance } from '~core/dimension';
import type { WorldScene } from '~game/scenes/world';
import type { Particles } from '~game/scenes/world/fx-manager/particles';
import type { PositionAtWorld } from '~scene/world/level/types';

import './resources';

export abstract class ShotBall extends Phaser.Physics.Arcade.Image implements IShot {
  declare public readonly scene: WorldScene;

  declare public readonly body: Phaser.Physics.Arcade.Body;

  public params: ShotParams;

  public effects: Map<string, Particles> = new Map();

  private initiator: Nullable<IShotInitiator> = null;

  private positionCallback: Nullable<() => PositionAtWorld> = null;

  private audio: ShotBallAudio;

  private effect: Nullable<Particles> = null;

  private startPosition: Nullable<PositionAtWorld> = null;

  private color: number = 0xffffff;

  private glow: boolean = false;

  private altitude: number = 0;

  constructor(scene: WorldScene, params: ShotParams, {
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
          this.hit(enemy as Enemy);
        } catch (error) {
          console.warn('Failed to handle ball shot collider', error as TypeError);
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

    initiator.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.effect?.destroy();
      this.destroy();
    });
  }

  public update() {
    try {
      this.updateFlyDistance();
    } catch (error) {
      console.warn('Failed to update ball shot', error as TypeError);
    }
  }

  private updateFlyDistance() {
    if (!this.params.maxDistance || !this.startPosition) {
      this.stop();

      return;
    }

    const distance = getIsometricDistance(this, this.startPosition);

    if (distance > this.params.maxDistance) {
      this.stop();

      return;
    }

    this.setDepth(this.y + this.altitude);
  }

  public shoot(target: Enemy, params?: ShotParams) {
    if (!this.initiator || this.active) {
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

    if (this.glow) {
      this.effect = this.scene.fx.createGlowEffect(this, {
        speed: this.params.speed,
        color: this.color,
      });
    }

    this.altitude = this.initiator.getBottomEdgePosition().y - position.y;
    this.startPosition = {
      x: position.x,
      y: position.y,
    };

    const distanceToTarget = getIsometricDistance(position, target.body.center);
    const timeToTarget = distanceToTarget / this.params.speed;
    const targetPosition = this.scene.getFuturePosition(target, timeToTarget);

    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.scene.physics.moveTo(this, targetPosition.x, targetPosition.y, this.params.speed);

    this.scene.fx.playSound(this.audio, {
      limit: 3,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hit(target: Enemy) {
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

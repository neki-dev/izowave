import Phaser from 'phaser';

import { Enemy } from '~game/scenes/world/entities/npc/variants/enemy';
import { registerAudioAssets, registerImageAssets } from '~lib/assets';
import { World } from '~game/scenes/world';
import { Particles } from '~game/scenes/world/effects';
import { Level } from '~game/scenes/world/level';
import { ParticlesType } from '~type/world/effects';
import {
  ShotParams, ShotBallData, ShotParent, ShotBallAudio, ShotBallTexture,
} from '~type/world/entities/shot';

export class ShotBall extends Phaser.Physics.Arcade.Image {
  readonly scene: World;

  readonly body: Phaser.Physics.Arcade.Body;

  /**
   * Shot owner.
   */
  private readonly parent: ShotParent;

  /**
   * Shot audio.
   */
  private readonly audio: ShotBallAudio;

  /**
   * Shoot effect.
   */
  private effect: Nullable<Particles> = null;

  /**
   * Damage of hit.
   */
  private damage: Nullable<number> = null;

  /**
   * Freeze of hit.
   */
  private freeze: Nullable<number> = null;

  /**
   * Max shot distance.
   */
  private maxDistance: Nullable<number> = null;

  /**
   * Start shoot position.
   */
  private startPosition: Nullable<Phaser.Types.Math.Vector2Like> = null;

  /**
   * Color for parent glow effect.
   */
  private glowColor: Nullable<number> = null;

  /**
   * Shot constructor.
   */
  constructor(parent: ShotParent, {
    texture, audio, glowColor = null,
  }: ShotBallData) {
    super(parent.scene, parent.x, parent.y, texture);
    parent.scene.add.existing(this);
    parent.scene.entityGroups.shots.add(this);

    this.parent = parent;
    this.audio = audio;
    this.glowColor = glowColor;

    this.setActive(false);
    this.setVisible(false);

    this.parent.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.destroy();
    });
  }

  /**
   * Check shoot distance and update visible state and depth.
   */
  public update() {
    const distance = Phaser.Math.Distance.BetweenPoints(this, this.startPosition);

    if (distance > this.maxDistance) {
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

  /**
   * Handle collision of bullet to enemy.
   *
   * @param target - Enemy
   */
  public hit(target: Enemy) {
    if (this.freeze) {
      target.freeze(this.freeze);
    }
    if (this.damage) {
      target.live.damage(this.damage);
    }

    this.stop();
  }

  /**
   * Make shoot to target.
   *
   * @param target - Enemy
   * @param data - Shot params
   */
  public shoot(target: Enemy, {
    maxDistance, speed, damage = null, freeze = null,
  }: ShotParams) {
    if (!damage && !freeze) {
      console.warn('ShotBall has no damage or freeze parameter');

      return;
    }

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
    }

    this.setPosition(this.parent.x, this.parent.y);
    this.setActive(true);
    this.setVisible(true);

    this.startPosition = { x: this.x, y: this.y };
    this.damage = damage;
    this.freeze = freeze;
    this.maxDistance = maxDistance;

    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.scene.physics.moveTo(this, target.x, target.y, speed);

    if (this.scene.sound.getAll(this.audio).length < 3) {
      this.scene.sound.play(this.audio);
    }
  }

  /**
   * Stop shooting.
   */
  private stop() {
    if (this.effect) {
      this.effect.destroy();
      this.effect = null;
    }

    this.setActive(false);
    this.setVisible(false);

    this.startPosition = null;
    this.damage = null;
    this.freeze = null;
    this.maxDistance = null;

    this.scene.physics.world.disable(this);
  }
}

registerAudioAssets(ShotBallAudio);
registerImageAssets(ShotBallTexture);

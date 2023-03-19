import Phaser from 'phaser';

import { Enemy } from '~entity/npc/variants/enemy';
import { registerAudioAssets, registerImageAssets } from '~lib/assets';
import { World } from '~scene/world';
import { Particles } from '~scene/world/effects';
import { Level } from '~scene/world/level';
import { ParticlesType } from '~type/world/effects';
import {
  ShotParams, ShotBallData, ShotBallAudio, ShotBallTexture, IShotInitiator, IShot,
} from '~type/world/entities/shot';

export class ShotBall extends Phaser.Physics.Arcade.Image implements IShot {
  readonly scene: World;

  readonly body: Phaser.Physics.Arcade.Body;

  /**
   * Shot initiator.
   */
  private initiator: Nullable<IShotInitiator> = null;

  /**
   * Shot params.
   */
  public params: ShotParams;

  /**
   * Shot audio.
   */
  private readonly audio: ShotBallAudio;

  /**
   * Shoot effect.
   */
  private effect: Nullable<Particles> = null;

  /**
   * Start shoot position.
   */
  private startPosition: Nullable<Phaser.Types.Math.Vector2Like> = null;

  /**
   * Color for initiator glow effect.
   */
  private glowColor: Nullable<number> = null;

  /**
   * Shot constructor.
   */
  constructor(scene: World, params: ShotParams, {
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
  }

  /**
   * Set initiator for next shoots.
   *
   * @param initiator - Initiator
   */
  public setInitiator(initiator: IShotInitiator) {
    this.initiator = initiator;
    this.setPosition(initiator.x, initiator.y);

    initiator.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.destroy();
    });
  }

  /**
   * Check shoot distance and update visible state and depth.
   */
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

  /**
   * Handle collision of bullet to enemy.
   *
   * @param target - Enemy
   */
  public hit(target: Enemy) {
    if (this.params.freeze) {
      target.freeze(this.params.freeze);
    }
    if (this.params.damage) {
      target.live.damage(this.params.damage);
    }

    this.stop();
  }

  /**
   * Make shoot to target.
   *
   * @param target - Enemy
   */
  public shoot(target: Enemy) {
    if (!this.initiator) {
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

    this.setPosition(this.initiator.x, this.initiator.y);
    this.setActive(true);
    this.setVisible(true);

    this.startPosition = { x: this.x, y: this.y };

    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.scene.physics.moveTo(this, target.x, target.y, this.params.speed);

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

    this.scene.physics.world.disable(this);
  }
}

registerAudioAssets(ShotBallAudio);
registerImageAssets(ShotBallTexture);

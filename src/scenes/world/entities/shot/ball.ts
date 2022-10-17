import Phaser from 'phaser';
import { Enemy } from '~entity/npc/variants/enemy';
import { registerAssets } from '~lib/assets';
import { World } from '~scene/world';
import { Level } from '~scene/world/level';
import { WorldEffect } from '~type/world/effects';
import {
  ShotParams, ShotTexture, ShotData, ShotParent,
} from '~type/world/entities/shot';

export class ShotBall extends Phaser.Physics.Arcade.Image {
  // @ts-ignore
  readonly scene: World;

  // @ts-ignore
  readonly body: Phaser.Physics.Arcade.Body;

  /**
   * Shot owner.
   */
  private readonly parent: ShotParent;

  /**
   * Shoot effect.
   */
  private effect?: Phaser.GameObjects.Particles.ParticleEmitter;

  /**
   * Damage of hit.
   */
  private damage: number;

  /**
   * Freeze of hit.
   */
  private freeze: number;

  /**
   * Max shot distance.
   */
  private maxDistance: number;

  /**
   * Start shoot position.
   */
  private startPosition: Phaser.Types.Math.Vector2Like;

  private glowColor?: number;

  /**
   * Shot constructor.
   */
  constructor(parent: ShotParent, {
    texture, glowColor,
  }: ShotData) {
    super(parent.scene, parent.x, parent.y, texture);
    parent.scene.add.existing(this);
    parent.scene.shots.add(this);

    this.parent = parent;
    this.glowColor = glowColor;

    this.setActive(false);
    this.setVisible(false);
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

    const tileGround = this.scene.level.getTile({
      ...Level.ToMatrixPosition(this),
      z: 0,
    });

    this.setDepth(Level.GetDepth(this.y, 1, this.displayHeight));
    this.setVisible(tileGround?.visible || false);
    if (this.effect) {
      this.effect.setVisible(this.visible);
    }
  }

  /**
   * Make shoot to target.
   *
   * @param target - Enemy
   * @param data - Shot params
   */
  public shoot(target: Enemy, {
    speed, damage = 0, freeze = 0, maxDistance,
  }: ShotParams) {
    if (this.glowColor) {
      this.effect = this.scene.effects.emit(WorldEffect.GLOW, this.parent, {
        follow: this,
        lifespan: { min: 100, max: 200 },
        scale: { start: 0.25, end: 0.0 },
        quantity: 2,
        blendMode: 'ADD',
        tint: this.glowColor,
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
  }

  /**
   * Stop shooting.
   */
  public stop() {
    this.setActive(false);
    this.setVisible(false);

    if (this.effect) {
      this.scene.effects.stop(this.parent, this.effect);
      delete this.effect;
    }

    this.scene.physics.world.disable(this);
  }

  /**
   * Handle collision of bullet to enemy.
   *
   * @param target - Enemy
   */
  public hit(target: Enemy) {
    this.stop();

    if (this.freeze) {
      target.freeze(this.freeze);
    }
    if (this.damage) {
      target.live.damage(this.damage);
    }
  }
}

registerAssets(Object.values(ShotTexture).map((texture) => ({
  key: texture,
  type: 'image',
  url: `assets/sprites/${texture}.png`,
})));

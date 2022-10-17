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
  private effect: Nullable<Phaser.GameObjects.Particles.ParticleEmitter> = null;

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
    texture, glowColor = null,
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
    const visible = tileGround ? tileGround.visible : false;

    this.setVisible(visible);
    if (this.effect) {
      this.effect.setVisible(visible);
    }

    if (visible) {
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
    this.stop();

    if (this.freeze) {
      target.freeze(this.freeze);
    }
    if (this.damage) {
      target.live.damage(this.damage);
    }
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
      console.warn('Shot has no damage or freeze parameter');

      return;
    }

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
  private stop() {
    if (this.effect) {
      this.scene.effects.stop(this.parent, this.effect);
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

registerAssets(Object.values(ShotTexture).map((texture) => ({
  key: texture,
  type: 'image',
  url: `assets/sprites/${texture}.png`,
})));

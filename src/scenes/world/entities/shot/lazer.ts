import Phaser from 'phaser';
import { WORLD_DEPTH_EFFECT } from '~const/world';
import { BuildingTower } from '~entity/building/variants/tower';
import { Enemy } from '~entity/npc/variants/enemy';
import { World } from '~scene/world';
import { WorldEffect } from '~type/world/effects';
import { ShotParams } from '~type/world/entities/shot';

export class ShotLazer extends Phaser.GameObjects.Line {
  // @ts-ignore
  readonly scene: World;

  /**
   * Shot owner.
   */
  private readonly parent: BuildingTower;

  /**
   * Timer of shoot processing.
   */
  private timer?: Phaser.Time.TimerEvent;

  /**
   * Damage of hit.
   */
  private damage: number;

  /**
   * Max shot distance.
   */
  private maxDistance: number;

  /**
   * Target enemy.
   */
  private target: Enemy;

  /**
   * Shot constructor.
   */
  constructor(parent: BuildingTower) {
    super(parent.scene);
    parent.scene.add.existing(this);
    parent.scene.shots.add(this);

    this.parent = parent;

    this.setVisible(false);
    this.setStrokeStyle(2, 0xb136ff, 0.5);
    this.setDepth(WORLD_DEPTH_EFFECT);
    this.setOrigin(0.0, 0.0);

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.timer) {
        this.timer.destroy();
      }
    });
  }

  /**
   * Update lazer target position.
   */
  public update() {
    if (!this.target) {
      return;
    }

    this.setTo(this.parent.x, this.parent.y, this.target.x, this.target.y);
  }

  /**
   * Make shoot to target.
   *
   * @param target - Enemy
   * @param data - Shot params
   */
  public shoot(target: Enemy, {
    damage, maxDistance,
  }: ShotParams) {
    this.target = target;
    this.damage = damage;
    this.maxDistance = maxDistance;

    this.timer = this.scene.time.addEvent({
      delay: 80,
      repeat: 5,
      callback: () => this.processing(),
    });

    this.setTo(this.parent.x, this.parent.y, target.x, target.y);
    this.setVisible(this.parent.visible && target.visible);
  }

  /**
   * Stop shooting.
   */
  public stop() {
    this.setVisible(false);
    this.timer.destroy();
    delete this.timer;
    delete this.target;
  }

  /**
   * Handle hit to target.
   */
  private hit() {
    this.target.live.damage(this.damage);
    this.scene.effects.emit(WorldEffect.GLOW, this.target, {
      follow: this.target,
      lifespan: { min: 100, max: 150 },
      scale: { start: 0.2, end: 0.1 },
      speed: 80,
      tint: 0xb136ff,
    }, 150);
  }

  /**
   * Process of shooting.
   */
  private processing() {
    if (
      this.target.live.isDead()
      || Phaser.Math.Distance.BetweenPoints(this, this.target) > this.maxDistance
    ) {
      this.stop();

      return;
    }

    this.hit();

    if (this.timer.repeatCount === 0) {
      this.stop();
    }
  }
}

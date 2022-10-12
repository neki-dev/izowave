import Phaser from 'phaser';

import { WORLD_DEPTH_EFFECT } from '~const/world';
import { World } from '~scene/world';
import { BuildingTower } from '~scene/world/entities/buildings/tower';
import { Enemy } from '~scene/world/entities/enemy';
import { ShotParams } from '~type/shot';
import { WorldEffect } from '~type/world';

export class Lazer extends Phaser.GameObjects.Line {
  // @ts-ignore
  readonly scene: World;

  /**
   * Parent tower.
   */
  private readonly tower: BuildingTower;

  /**
   * Timer of shoot processing.
   */
  private timer?: Phaser.Time.TimerEvent;

  /**
   * Damage of hit.
   */
  private damage: number;

  /**
   * Target enemy.
   */
  private target: Enemy;

  /**
   * Lazer constructor.
   */
  constructor(tower: BuildingTower) {
    super(tower.scene);
    tower.scene.add.existing(this);
    tower.scene.shots.add(this);

    this.tower = tower;

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

    this.setTo(this.tower.x, this.tower.y, this.target.x, this.target.y);
  }

  /**
   * Make shoot to target.
   *
   * @param target - Enemy
   * @param data - Shot params
   */
  public shoot(target: Enemy, {
    damage,
  }: ShotParams) {
    this.target = target;
    this.damage = damage;

    this.timer = this.scene.time.addEvent({
      delay: 80,
      repeat: 5,
      callback: () => this.processing(),
    });

    this.setTo(this.tower.x, this.tower.y, target.x, target.y);
    this.setVisible(this.tower.visible && target.visible);
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
      || !this.tower.actionsAreaContains(this.target)
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

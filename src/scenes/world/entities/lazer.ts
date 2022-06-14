import Phaser from 'phaser';
import BuildingTower from '~scene/world/entities/buildings/tower';
import Enemy from '~scene/world/entities/enemy';

import { ShotParams } from '~type/shot';
import { WorldEffect } from '~type/world';

export default class Lazer extends Phaser.GameObjects.Line {
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
    tower.scene.getShots().add(this);

    this.tower = tower;

    this.setVisible(false);
    this.setStrokeStyle(2, 0xb136ff, 0.5);
    this.setDepth(9998);
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

    this.timer = this.tower.scene.time.addEvent({
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
    this.tower.scene.effects.emit(WorldEffect.LAZER, this.target, {
      follow: this.target,
      lifespan: { min: 100, max: 150 },
      scale: { start: 0.2, end: 0.1 },
      frequency: 2,
      speed: 80,
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

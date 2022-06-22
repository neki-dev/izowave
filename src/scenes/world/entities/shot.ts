import Phaser from 'phaser';
import { registerAssets } from '~lib/assets';
import Level from '~scene/world/level';
import Enemy from '~scene/world/entities/enemy';
import BuildingTower from '~scene/world/entities/buildings/tower';

import { ShotParams, ShotType, ShotTexture } from '~type/shot';
import { WorldEffect } from '~type/world';

export default class Shot extends Phaser.Physics.Arcade.Image {
  // @ts-ignore
  readonly body: Phaser.Physics.Arcade.Body;

  /**
   * Parent tower.
   */
  private readonly tower: BuildingTower;

  /**
   * Shoot effect.
   */
  private effect: Phaser.GameObjects.Particles.ParticleEmitter;

  /**
   * Damage of hit.
   */
  private damage: number;

  /**
   * Freeze of hit.
   */
  private freeze: number;

  /**
   * Shot constructor.
   */
  constructor(tower: BuildingTower) {
    super(tower.scene, tower.x, tower.y, ShotTexture[tower.shotType]);
    tower.scene.add.existing(this);
    tower.scene.getShots().add(this);

    this.tower = tower;

    this.setActive(false);
    this.setVisible(false);
  }

  /**
   * Update depth and check shot fly distance.
   */
  public update() {
    if (!this.tower.actionsAreaContains(this)) {
      this.stop();
      return;
    }

    this.setDepth(Level.GetDepth(this.y, 1, this.displayHeight));

    const tilePosition = { ...Level.ToMatrixPosition(this), z: 0 };
    const tileGround = this.tower.scene.level.getTile(tilePosition);
    this.setVisible(tileGround?.visible || false);
    this.effect.setVisible(this.visible);
  }

  /**
   * Make shoot to target.
   *
   * @param target - Enemy
   * @param data - Shot params
   */
  public shoot(target: Enemy, {
    speed, damage, freeze,
  }: ShotParams) {
    this.damage = damage;
    this.freeze = freeze;

    const effect = (this.tower.shotType === ShotType.FIRE) ? WorldEffect.FIRE : WorldEffect.GLOW;
    this.effect = this.tower.scene.effects.emit(effect, this.tower, {
      follow: this,
      lifespan: { min: 100, max: 150 },
      frequency: 2,
      scale: { start: 0.1, end: 0.0 },
      quantity: 2,
      speed: 200,
      blendMode: 'ADD',
    });

    this.setPosition(this.tower.x, this.tower.y);
    this.setActive(true);
    this.setVisible(true);

    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.scene.physics.moveToObject(this, target, speed);
  }

  /**
   * Stop shooting.
   */
  public stop() {
    this.setActive(false);
    this.setVisible(false);

    this.tower.scene.effects.stop(this.tower, this.effect);

    this.scene.physics.world.disable(this);
  }

  /**
   * Handle collision of bullet to enemy.
   *
   * @param enemy - Enemy
   */
  public hit(enemy: Enemy) {
    this.stop();

    switch (this.tower.shotType) {
      case ShotType.FROZEN: {
        enemy.freeze(this.freeze);
        break;
      }
      case ShotType.FIRE: {
        enemy.live.damage(this.damage);
        break;
      }
      default: break;
    }
  }
}

registerAssets(Object.values(ShotTexture).map((texture) => ({
  key: texture,
  type: 'image',
  url: `assets/sprites/${texture}.png`,
})));

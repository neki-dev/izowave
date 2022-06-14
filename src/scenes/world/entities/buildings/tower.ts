import Phaser from 'phaser';
import { calcGrowth } from '~lib/utils';
import World from '~scene/world';
import Shot from '~scene/world/entities/shot';
import Building from '~scene/world/entities/building';
import Enemy from '~scene/world/entities/enemy';
import Lazer from '~scene/world/entities/lazer';

import { BuildingData } from '~type/building';
import { ShotParams, ShotType } from '~type/shot';

import {
  TOWER_SHOT_DAMAGE_GROWTH,
  TOWER_SHOT_FREEZE_GROWTH,
  TOWER_SHOT_SPEED_GROWTH,
} from '~const/difficulty';

type BuildingTowerData = BuildingData & {
  shotType: ShotType
  shotData: ShotParams
};

export default class BuildingTower extends Building {
  /**
   * Shot type.
   */
  readonly shotType: ShotType;

  /**
   * Shot params.
   */
  readonly shotData: ShotParams;

  /**
   * Tower shot item.
   */
  readonly shot: Shot | Lazer;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, {
    shotType, shotData, ...data
  }: BuildingTowerData) {
    super(scene, data);

    this.shotType = shotType;
    this.shotData = shotData;

    if (this.shotType === ShotType.LAZER) {
      this.shot = new Lazer(this);
    } else {
      this.shot = new Shot(this);
    }

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.shot.destroy();
    });
  }

  /**
   * Find target and shoot.
   */
  public update() {
    super.update();

    if (!this.isAllowActions()) {
      return;
    }

    const target = this.getTarget();
    if (!target) {
      return;
    }

    this.shoot(target);
    this.pauseActions();
  }

  /**
   * Find nearby enemy for shoot.
   */
  private getTarget(): Enemy {
    const enemies = (<Enemy[]> this.scene.getEnemies().getChildren()).filter((enemy) => (
      !enemy.live.isDead()
      && this.actionsAreaContains(enemy)
    ));

    if (enemies.length === 0) {
      return null;
    }

    const [nearby] = enemies.map((enemy) => ({
      enemy,
      distance: Phaser.Math.Distance.BetweenPoints(enemy, this),
    }))
      .sort((a, b) => (a.distance - b.distance));

    return nearby.enemy;
  }

  /**
   * Shoot to enemy.
   *
   * @param target - Enemy
   */
  private shoot(target: Enemy) {
    const data: ShotParams = {};
    if (this.shotData.speed) {
      data.speed = calcGrowth(this.shotData.speed, TOWER_SHOT_SPEED_GROWTH, this.upgradeLevel);
    }
    if (this.shotData.damage) {
      data.damage = calcGrowth(this.shotData.damage, TOWER_SHOT_DAMAGE_GROWTH, this.upgradeLevel);
    }
    if (this.shotData.freeze) {
      data.freeze = calcGrowth(this.shotData.freeze, TOWER_SHOT_FREEZE_GROWTH, this.upgradeLevel);
    }
    this.shot.shoot(target, data);
  }
}

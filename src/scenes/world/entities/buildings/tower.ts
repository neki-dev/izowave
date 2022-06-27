import Phaser from 'phaser';
import { calcGrowth, selectClosest } from '~lib/utils';
import World from '~scene/world';
import Shot from '~scene/world/entities/shot';
import Building from '~scene/world/entities/building';
import Enemy from '~scene/world/entities/enemy';
import Lazer from '~scene/world/entities/lazer';
import BuildingAmmunition from '~scene/world/entities/buildings/ammunition';

import { NoticeType, ScreenTexture } from '~type/interface';
import {
  BuildingData, BuildingDescriptionItem, BuildingEvents, BuildingVariant,
} from '~type/building';
import { ShotParams, ShotType } from '~type/shot';

import { TILE_META } from '~const/level';
import { WORLD_DEPTH_EFFECT } from '~const/world';
import {
  TOWER_SHOT_DAMAGE_GROWTH, TOWER_SHOT_FREEZE_GROWTH,
  TOWER_SHOT_SPEED_GROWTH, TOWER_AMMO_AMOUNT,
} from '~const/difficulty';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';

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
   * Ammo left in clip.
   */
  private ammoLeft: number = TOWER_AMMO_AMOUNT;

  /**
   * Reload alert.
   */
  private alert: Phaser.GameObjects.Image;

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

    scene.input.keyboard.on('keyup-R', this.reload, this);
    this.on(BuildingEvents.UPGRADE, this.upgradeAmmo, this);
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.shot.destroy();
      if (this.alert) {
        this.alert.destroy();
      }
    });
  }

  /**
   * Add ammo left and reload to building info.
   */
  public getInfo(): BuildingDescriptionItem[] {
    const nextAmmo = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
      ? TOWER_AMMO_AMOUNT * (this.upgradeLevel + 1)
      : null;
    const nextSpeed = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
      ? this.getShotParams(this.upgradeLevel + 1).speed / 10
      : null;
    const info = [
      ...super.getInfo(),
      { text: `Ammo: ${this.ammoLeft}/${this.getMaxAmmo()}`, post: nextAmmo && `→ ${nextAmmo}`, icon: 2 },
    ];
    if (this.ammoLeft < this.getMaxAmmo()) {
      info.push({ text: 'PRESS < R > TO RELOAD', type: 'hint' });
    }
    const { speed } = this.getShotParams();
    if (speed) {
      info.push({
        text: `Speed: ${speed / 10}`,
        post: nextSpeed && `→ ${Math.round(nextSpeed)}`,
        icon: 7,
      });
    }
    return info;
  }

  /**
   * Find target and shoot.
   */
  public update() {
    super.update();

    if (this.alert) {
      this.alert.setVisible(this.visible);
    }

    if (
      this.ammoLeft === 0
      || !this.isAllowActions()
    ) {
      return;
    }

    const target = this.getTarget();
    if (!target) {
      return;
    }

    this.shoot(target);
    this.pauseActions();

    this.ammoLeft--;
    if (this.ammoLeft === 0) {
      this.addAlert();
    }
  }

  /**
   * Get shot params.
   */
  public getShotParams(level?: number) {
    const data: ShotParams = {};
    if (this.shotData.speed) {
      data.speed = calcGrowth(this.shotData.speed, TOWER_SHOT_SPEED_GROWTH, level || this.upgradeLevel);
    }
    if (this.shotData.damage) {
      data.damage = calcGrowth(this.shotData.damage, TOWER_SHOT_DAMAGE_GROWTH, level || this.upgradeLevel);
    }
    if (this.shotData.freeze) {
      data.freeze = calcGrowth(this.shotData.freeze, TOWER_SHOT_FREEZE_GROWTH, level || this.upgradeLevel);
    }
    return data;
  }

  /**
   *
   */
  private getAmmunition(): BuildingAmmunition {
    const ammunitions = <BuildingAmmunition[]> this.scene.getBuildings().getChildren().filter((building: Building) => (
      building.variant === BuildingVariant.AMMUNITION
      && building.actionsAreaContains(this)
    ));
    if (ammunitions.length === 0) {
      return null;
    }

    const ammunition = ammunitions.sort((a, b) => (b.amountLeft - a.amountLeft))[0];
    if (ammunition.amountLeft === 0) {
      return null;
    }

    return ammunition;
  }

  /**
   * Reload ammo.
   */
  private reload() {
    if (!this.isSelected()) {
      return;
    }

    const needAmmo = this.getMaxAmmo() - this.ammoLeft;
    if (needAmmo <= 0) {
      return;
    }

    const ammunition = this.getAmmunition();
    if (!ammunition) {
      this.scene.screen.message(NoticeType.ERROR, 'NO AMMUNITION NEARBY');
      return;
    }

    const ammo = ammunition.use(needAmmo);
    this.ammoLeft += ammo;

    if (this.alert) {
      this.alert.destroy();
      delete this.alert;
    }
  }

  /**
   * Get maximum ammo in clip.
   */
  private getMaxAmmo(): number {
    return TOWER_AMMO_AMOUNT * this.upgradeLevel;
  }

  /**
   * Update ammo left.
   */
  private upgradeAmmo() {
    this.ammoLeft = this.getMaxAmmo();
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

    return selectClosest<Enemy>(enemies, this)[0];
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

  /**
   * Add alert sign.
   */
  private addAlert() {
    this.alert = this.scene.add.image(this.x, this.y + TILE_META.halfHeight, ScreenTexture.ALERT);
    this.alert.setDepth(WORLD_DEPTH_EFFECT);
    this.alert.setVisible(this.visible);
    this.scene.tweens.add({
      targets: this.alert,
      scale: 0.8,
      duration: 500,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
    });
  }
}

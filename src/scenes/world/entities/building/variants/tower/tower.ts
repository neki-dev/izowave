import Phaser from 'phaser';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';
import { DIFFICULTY } from '~const/difficulty';
import { INPUT_KEY } from '~const/keyboard';
import { Building } from '~entity/building';
import { BuildingAmmunition } from '~entity/building/variants/ammunition';
import { Enemy } from '~entity/npc/variants/enemy';
import { ShotBall, ShotLazer } from '~entity/shot';
import { calcGrowth, selectClosest } from '~lib/utils';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { NoticeType } from '~type/screen/notice';
import {
  BuildingDescriptionItem, BuildingEvents, BuildingTowerData, BuildingTowerShotParams, BuildingVariant,
} from '~type/world/entities/building';
import { ShotParams, ShotType } from '~type/world/entities/shot';

export class BuildingTower extends Building {
  /**
   * Shot params.
   */
  readonly shotParams: BuildingTowerShotParams;

  /**
   * Tower shot item.
   */
  readonly shot: ShotBall | ShotLazer;

  /**
   * Ammo left in clip.
   */
  private ammoLeft: number = DIFFICULTY.TOWER_AMMO_AMOUNT;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, {
    shotData, ...data
  }: BuildingTowerData) {
    super(scene, data);

    this.shotParams = shotData.params;

    if (shotData.type === ShotType.LAZER) {
      this.shot = new ShotLazer(this);
    } else {
      this.shot = new ShotBall(this, {
        texture: shotData.texture,
        glowColor: shotData.glowColor,
      });
    }

    // Add keyboard events
    scene.input.keyboard.on(INPUT_KEY.BUILDING_RELOAD, this.reload, this);

    // Add events callbacks
    this.on(BuildingEvents.UPGRADE, this.upgradeAmmo, this);
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.shot.destroy();
    });
  }

  /**
   * Add ammo left and reload to building info.
   */
  public getInfo(): BuildingDescriptionItem[] {
    const nextAmmo = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
      ? DIFFICULTY.TOWER_AMMO_AMOUNT * (this.upgradeLevel + 1)
      : null;
    const info = [
      ...super.getInfo(), {
        text: `Ammo: ${this.ammoLeft}/${this.getMaxAmmo()}`,
        post: nextAmmo && `→ ${nextAmmo}`,
        icon: ScreenIcon.AMMO,
      },
    ];

    // if (this.ammoLeft < this.getMaxAmmo()) {
    //   info.push({ text: 'PRESS |R| TO RELOAD', type: 'hint' });
    // }

    const { speed } = this.getShotParams();

    if (speed) {
      const nextSpeed = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
        ? this.getShotParams(this.upgradeLevel + 1).speed / 10
        : null;

      info.push({
        text: `Speed: ${speed / 10}`,
        post: nextSpeed && `→ ${Math.round(nextSpeed)}`,
        icon: ScreenIcon.SPEED,
      });
    }

    return info;
  }

  /**
   * Find target and shoot.
   */
  public update() {
    super.update();

    if (
      this.ammoLeft === 0
      || !this.isAllowAction()
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
    const params: ShotParams = {
      maxDistance: this.getActionsRadius(),
    };

    if (this.shotParams.speed) {
      params.speed = calcGrowth(
        this.shotParams.speed,
        DIFFICULTY.TOWER_SHOT_SPEED_GROWTH,
        level || this.upgradeLevel,
      );
    }

    if (this.shotParams.damage) {
      params.damage = calcGrowth(
        this.shotParams.damage,
        DIFFICULTY.TOWER_SHOT_DAMAGE_GROWTH,
        level || this.upgradeLevel,
      );
    }

    if (this.shotParams.freeze) {
      params.freeze = calcGrowth(
        this.shotParams.freeze,
        DIFFICULTY.TOWER_SHOT_FREEZE_GROWTH,
        level || this.upgradeLevel,
      );
    }

    return params;
  }

  /**
   * Get nearby ammunition.
   */
  private getAmmunition(): BuildingAmmunition {
    const ammunitions = <BuildingAmmunition[]> this.scene.selectBuildings(BuildingVariant.AMMUNITION);
    const nearby = ammunitions.filter((building: Building) => building.actionsAreaContains(this));

    if (nearby.length === 0) {
      return null;
    }

    const ammunition = nearby.sort((a, b) => (b.amountLeft - a.amountLeft))[0];

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

    this.removeAlert();
  }

  /**
   * Get maximum ammo in clip.
   */
  private getMaxAmmo(): number {
    return DIFFICULTY.TOWER_AMMO_AMOUNT * this.upgradeLevel;
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
    const enemies = (<Enemy[]> this.scene.enemies.getChildren()).filter((enemy) => (
      !enemy.live.isDead()
      && this.actionsAreaContains(enemy)
    ));

    if (enemies.length === 0) {
      return null;
    }

    return selectClosest(enemies, this)[0];
  }

  /**
   * Shoot to enemy.
   *
   * @param target - Enemy
   */
  private shoot(target: Enemy) {
    const params = this.getShotParams();

    this.shot.shoot(target, params);
  }
}

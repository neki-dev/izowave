import { Building } from '../..';
import type { Enemy } from '../../../npc/enemy';
import {
  BuildingIcon,
  BuildingVariant,
  BuildingAudio,
  BuildingEvent,
} from '../../types';
import type {
  BuildingData,
  BuildingParam,
  BuildingSavePayload,
} from '../../types';
import type { BuildingAmmunition } from '../ammunition';
import type { BuildingBooster } from '../booster';

import { BUIDLING_TOWER_AMMO_AMOUNT, BUIDLING_TOWER_SHOT_SPEED_GROWTH, BUIDLING_TOWER_SHOT_DAMAGE_GROWTH, BUIDLING_TOWER_SHOT_FREEZE_GROWTH } from './const';

import { getClosestByIsometricDistance } from '~core/dimension';
import { progressionLinear } from '~core/progression';
import { Tutorial } from '~core/tutorial';
import { TutorialStep } from '~core/tutorial/types';
import type { WorldScene } from '~game/scenes/world';
import { PlayerSuperskill } from '~scene/world/entities/player/types';
import type { IShot, ShotParams } from '~scene/world/entities/shot/types';
import { EntityType } from '~scene/world/entities/types';

export abstract class BuildingTower extends Building {
  private shot: Nullable<IShot> = null;

  private shotDefaultParams: Nullable<ShotParams> = null;

  private needReload: boolean = false;

  private _power: number = 1.0;

  public get power() { return this._power; }

  private set power(v) { this._power = v; }

  private _ammo: number = BUIDLING_TOWER_AMMO_AMOUNT;

  public get ammo() { return this._ammo; }

  private set ammo(v) { this._ammo = v; }

  constructor(scene: WorldScene, data: BuildingData, shot?: IShot) {
    super(scene, data);

    if (shot) {
      shot.setInitiator(this, () => this.getTopEdgePosition());
      this.shot = shot;
      this.shotDefaultParams = shot.params;
    }

    this.handleBuildingRelease();

    this.calculatePower();

    this.on(BuildingEvent.UPGRADE, this.onUpgrade.bind(this));
  }

  public update() {
    super.update();

    try {
      if (this.isCanAttack()) {
        this.attack();
      }
    } catch (error) {
      console.warn('Failed to update tower building', error as TypeError);
    }
  }

  public getInfo() {
    const info: BuildingParam[] = [];
    const params = this.getShotCurrentParams();

    if (params.damage) {
      info.push({
        label: 'BUILDING_DAMAGE',
        icon: BuildingIcon.DAMAGE,
        value: Math.round(params.damage * this.power),
      });
    }

    if (params.freeze) {
      info.push({
        label: 'BUILDING_FREEZE',
        icon: BuildingIcon.FREEZE,
        value: `${((params.freeze * this.power) / 1000).toFixed(1)} s`,
      });
    }

    if (params.speed) {
      info.push({
        label: 'BUILDING_SPEED',
        icon: BuildingIcon.SPEED,
        value: params.speed,
      });
    }

    info.push({
      label: 'BUILDING_AMMO',
      icon: BuildingIcon.AMMO,
      attention: (this.ammo === 0),
      value: `${this.ammo}/${BUIDLING_TOWER_AMMO_AMOUNT}`,
    });

    return info.concat(super.getInfo());
  }

  public getTopEdgePosition() {
    const position = super.getTopEdgePosition();

    position.y -= 5;

    return position;
  }

  private isCanAttack() {
    return (
      this.ammo > 0
      && this.isActionAllowed()
      && !this.scene.player.live.isDead()
    );
  }

  private attack() {
    const targets = this.getTargets();

    if (targets.length === 0) {
      return;
    }

    this.shoot(targets);
    this.pauseActions();

    this.ammo--;

    if (this.ammo === 0) {
      this.reload();
    }
  }

  private getShotCurrentParams() {
    const params: ShotParams = {
      maxDistance: this.getActionsRadius(),
    };

    if (this.shotDefaultParams?.speed) {
      params.speed = progressionLinear({
        defaultValue: this.shotDefaultParams.speed,
        scale: BUIDLING_TOWER_SHOT_SPEED_GROWTH,
        level: this.upgradeLevel,
      });
    }

    if (this.shotDefaultParams?.damage) {
      const rage = this.scene.player.activeSuperskills[PlayerSuperskill.RAGE];

      params.damage = progressionLinear({
        defaultValue: this.shotDefaultParams.damage,
        scale: BUIDLING_TOWER_SHOT_DAMAGE_GROWTH,
        level: this.upgradeLevel,
      }) * (rage ? 2 : 1);
    }

    if (this.shotDefaultParams?.freeze) {
      params.freeze = progressionLinear({
        defaultValue: this.shotDefaultParams.freeze,
        scale: BUIDLING_TOWER_SHOT_FREEZE_GROWTH,
        level: this.upgradeLevel,
      });
    }

    return params;
  }

  private getAmmunition() {
    const ammunitions = this.scene.builder.getBuildingsByVariant<BuildingAmmunition>(BuildingVariant.AMMUNITION)
      .filter((building) => (building.ammo > 0 && building.actionsAreaContains(this.getBottomEdgePosition())));

    if (ammunitions.length === 0) {
      return null;
    }

    const priorityAmmunition = ammunitions.reduce((max, current) => (
      max.ammo > current.ammo ? max : current
    ));

    return priorityAmmunition;
  }

  private reload() {
    const ammunition = this.getAmmunition();

    if (ammunition) {
      this.ammo += ammunition.use(BUIDLING_TOWER_AMMO_AMOUNT);

      Tutorial.Complete(TutorialStep.RELOAD_TOWER);

      if (this.needReload) {
        this.removeAlertIcon();
        this.needReload = false;

        this.scene.fx.playSound(BuildingAudio.RELOAD, {
          limit: 1,
        });
      }
    } else if (!this.needReload) {
      this.addAlertIcon();
      this.needReload = true;

      this.scene.fx.playSound(BuildingAudio.OVER, {
        limit: 1,
      });

      Tutorial.Start(TutorialStep.RELOAD_TOWER);
    }
  }

  public getTargets() {
    const towerPosition = this.getBottomEdgePosition();

    return this.scene.getEntities<Enemy>(EntityType.ENEMY).filter((enemy) => {
      if (
        enemy.alpha >= 1.0
        && !enemy.live.isDead()
        && (!this.shotDefaultParams?.freeze || !enemy.isFreezed(true))
      ) {
        const enemyPosition = enemy.getBottomEdgePosition();

        return (
          this.actionsAreaContains(enemyPosition)
          && !this.scene.level.hasTilesBetweenPositions(enemyPosition, towerPosition)
        );
      }

      return false;
    });
  }

  public shoot(targets: Enemy[]) {
    if (!this.shot) {
      return;
    }

    const target = getClosestByIsometricDistance(targets, this);

    if (!target) {
      return;
    }

    const params = this.getShotCurrentParams();

    if (this.power > 1.0) {
      if (params.damage) {
        params.damage *= this.power;
      }
      if (params.freeze) {
        params.freeze *= this.power;
      }
    }

    this.shot?.shoot(target, params);
  }

  private getBooster() {
    const boosters = this.scene.builder.getBuildingsByVariant<BuildingBooster>(BuildingVariant.BOOSTER)
      .filter((building) => building.actionsAreaContains(this.getBottomEdgePosition()));

    if (boosters.length === 0) {
      return null;
    }

    const priorityBooster = boosters.reduce((max, current) => (
      max.power > current.power ? max : current
    ));

    return priorityBooster;
  }

  private calculatePower() {
    const booster = this.getBooster();

    this.power = 1.0 + (booster?.power ?? 0.0);
  }

  private onUpgrade() {
    this.ammo = BUIDLING_TOWER_AMMO_AMOUNT;

    if (this.needReload) {
      this.removeAlertIcon();
      this.needReload = false;
    }
  }

  private handleBuildingRelease() {
    const handler = (building: Building) => {
      if (building.variant === BuildingVariant.AMMUNITION) {
        if (this.needReload) {
          this.reload();
        }
      } else if (building.variant === BuildingVariant.BOOSTER) {
        this.calculatePower();
      }
    };

    const buidingsGroup = this.scene.getEntitiesGroup(EntityType.BUILDING);

    buidingsGroup.on(BuildingEvent.CREATE, handler);
    buidingsGroup.on(BuildingEvent.UPGRADE, handler);
    buidingsGroup.on(BuildingEvent.BUY_AMMO, handler);
    buidingsGroup.on(BuildingEvent.BREAK, handler);

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      buidingsGroup.off(BuildingEvent.CREATE, handler);
      buidingsGroup.off(BuildingEvent.UPGRADE, handler);
      buidingsGroup.off(BuildingEvent.BUY_AMMO, handler);
      buidingsGroup.off(BuildingEvent.BREAK, handler);
    });
  }

  public getSavePayload() {
    return {
      ...super.getSavePayload(),
      ammo: this.ammo,
    };
  }

  public loadSavePayload(data: BuildingSavePayload) {
    super.loadSavePayload(data);

    if (data.ammo !== undefined) {
      this.ammo = data.ammo;
    }
  }
}

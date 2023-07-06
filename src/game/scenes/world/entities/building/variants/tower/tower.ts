import { CONTROL_KEY } from '~const/controls';
import { DIFFICULTY } from '~const/world/difficulty';
import { Building } from '~entity/building';
import { progression, getClosest } from '~lib/utils';
import { NoticeType } from '~type/screen';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import {
  BuildingAudio, BuildingData, BuildingIcon, BuildingVariant, IBuildingAmmunition, IBuildingTower,
} from '~type/world/entities/building';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { IShot, ShotParams } from '~type/world/entities/shot';

export class BuildingTower extends Building implements IBuildingTower {
  private shot: IShot;

  private shotDefaultParams: ShotParams;

  private _ammo: number = DIFFICULTY.BUIDLING_TOWER_AMMO_AMOUNT;

  public get ammo() { return this._ammo; }

  private set ammo(v) { this._ammo = v; }

  constructor(scene: IWorld, data: BuildingData, shot: IShot) {
    super(scene, data);

    shot.setInitiator(this);
    this.shot = shot;
    this.shotDefaultParams = shot.params;

    this.scene.input.keyboard.on(CONTROL_KEY.BUILDING_RELOAD, () => {
      if (this.isFocused) {
        this.reload();
      }
    });
  }

  public getInfo() {
    const info: BuildingParam[] = [];
    const params = this.getShotCurrentParams();

    if (params.damage) {
      info.push({
        label: 'DAMAGE',
        icon: BuildingIcon.DAMAGE,
        value: params.damage,
      });
    }

    if (params.freeze) {
      info.push({
        label: 'FREEZE',
        icon: BuildingIcon.DAMAGE,
        value: (params.freeze / 1000).toFixed(1),
      });
    }

    if (params.speed) {
      info.push({
        label: 'SPEED',
        icon: BuildingIcon.SPEED,
        value: params.speed,
      });
    }

    info.push({
      label: 'AMMO',
      icon: BuildingIcon.AMMO,
      attention: (this.ammo === 0),
      value: `${this.ammo}/${this.getMaxAmmo()}`,
    });

    return super.getInfo().concat(info);
  }

  public getControls() {
    const actions = super.getControls();

    if (this.ammo < this.getMaxAmmo()) {
      actions.push({
        label: 'RELOAD',
        onClick: () => this.reload(),
      });
    }

    return actions;
  }

  public update() {
    super.update();

    if (this.isCanAttack()) {
      this.attack();
    }
  }

  private isCanAttack() {
    return (
      this.ammo > 0
      && this.isActionAllowed()
      && !this.scene.player.live.isDead()
    );
  }

  private attack() {
    const target = this.getTarget();

    if (!target) {
      return;
    }

    this.shoot(target);
    this.pauseActions();

    this.ammo--;

    if (this.ammo === 0) {
      this.hasAlert = true;

      this.scene.game.tutorial.start(TutorialStep.RELOAD_BUILDING);
    }
  }

  private getShotCurrentParams(level?: number) {
    const params: ShotParams = {
      maxDistance: this.getActionsRadius(),
    };

    if (this.shotDefaultParams.speed) {
      params.speed = progression(
        this.shotDefaultParams.speed,
        DIFFICULTY.BUIDLING_TOWER_SHOT_SPEED_GROWTH,
        level || this.upgradeLevel,
      );
    }

    if (this.shotDefaultParams.damage) {
      params.damage = progression(
        this.shotDefaultParams.damage,
        DIFFICULTY.BUIDLING_TOWER_SHOT_DAMAGE_GROWTH,
        level || this.upgradeLevel,
      );
    }

    if (this.shotDefaultParams.freeze) {
      params.freeze = progression(
        this.shotDefaultParams.freeze,
        DIFFICULTY.BUIDLING_TOWER_SHOT_FREEZE_GROWTH,
        level || this.upgradeLevel,
      );
    }

    return params;
  }

  private getAmmunition() {
    const ammunitions = (<IBuildingAmmunition[]> this.scene.getBuildingsByVariant(BuildingVariant.AMMUNITION))
      .filter((building) => building.actionsAreaContains(this));

    if (ammunitions.length === 0) {
      return null;
    }

    let priorityAmmunition: IBuildingAmmunition = null;

    for (const ammunition of ammunitions) {
      if (!priorityAmmunition || ammunition.ammo > priorityAmmunition.ammo) {
        priorityAmmunition = ammunition;
      }
    }

    if (priorityAmmunition.ammo === 0) {
      return null;
    }

    return priorityAmmunition;
  }

  private reload() {
    const needAmmo = this.getMaxAmmo() - this.ammo;

    if (needAmmo <= 0) {
      return;
    }

    const ammunition = this.getAmmunition();

    if (!ammunition) {
      this.scene.game.screen.notice(NoticeType.ERROR, 'NO AMMUNITION NEARBY');

      return;
    }

    this.ammo += ammunition.use(needAmmo);
    this.hasAlert = false;

    this.scene.game.sound.play(BuildingAudio.RELOAD);
    this.scene.game.tutorial.complete(TutorialStep.RELOAD_BUILDING);
  }

  private getMaxAmmo() {
    return DIFFICULTY.BUIDLING_TOWER_AMMO_AMOUNT * this.upgradeLevel;
  }

  private getTarget() {
    const enemies = this.scene.getEnemies().filter((enemy) => (
      !enemy.live.isDead()
      && this.actionsAreaContains(enemy.body.position)
      && !this.scene.level.hasTilesBetweenPositions(this, enemy.body.position)
    ));

    return getClosest(enemies, this);
  }

  private shoot(target: IEnemy) {
    this.shot.params = this.getShotCurrentParams();
    this.shot.shoot(target);
  }
}

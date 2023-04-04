import { CONTROL_KEY } from '~const/controls';
import { INTERFACE_TEXT_COLOR } from '~const/interface';
import { DIFFICULTY } from '~const/world/difficulty';
import { Building } from '~entity/building';
import { BuildingAmmunition } from '~entity/building/variants/ammunition';
import { Enemy } from '~entity/npc/variants/enemy';
import { calcGrowth, selectClosest } from '~lib/utils';
import { World } from '~scene/world';
import { NoticeType, ScreenIcon } from '~type/screen';
import { TutorialStep } from '~type/tutorial';
import { BuildingAudio, BuildingData, BuildingVariant } from '~type/world/entities/building';
import { IShot, ShotParams } from '~type/world/entities/shot';

export class BuildingTower extends Building {
  /**
   * Tower shot item.
   */
  readonly shot: IShot;

  /**
   * Default shot params.
   */
  readonly shotDefaultParams: ShotParams;

  /**
   * Ammo left in clip.
   */
  private _ammoLeft: number = DIFFICULTY.BUIDLING_TOWER_AMMO_AMOUNT;

  public get ammoLeft() { return this._ammoLeft; }

  private set ammoLeft(v) { this._ammoLeft = v; }

  /**
   * Building variant constructor.
   */
  constructor(scene: World, data: BuildingData, shot: IShot) {
    super(scene, data);

    shot.setInitiator(this);
    this.shot = shot;
    this.shotDefaultParams = shot.params;

    scene.input.keyboard.on(CONTROL_KEY.BUILDING_RELOAD, () => {
      if (this.isFocused) {
        this.reload();
      }
    });
  }

  /**
   * Add ammo left and reload to building info.
   */
  public getInfo() {
    const info = super.getInfo();
    const params = this.getShotCurrentParams();

    if (params.damage) {
      info.push({
        label: 'DAMAGE',
        icon: ScreenIcon.DAMAGE,
        value: params.damage,
      });
    }

    if (params.freeze) {
      info.push({
        label: 'FREEZE',
        icon: ScreenIcon.DAMAGE,
        value: (params.freeze / 1000).toFixed(1),
      });
    }

    if (params.speed) {
      info.push({
        label: 'SPEED',
        icon: ScreenIcon.SPEED,
        value: params.speed,
      });
    }

    info.push({
      label: 'AMMO',
      icon: ScreenIcon.AMMO,
      attention: (this.ammoLeft === 0),
      value: `${this.ammoLeft}/${this.getMaxAmmo()}`,
    });

    return info;
  }

  /**
   * Add reload to building actions.
   */
  public getActions() {
    const actions = super.getActions();

    if (this.ammoLeft < this.getMaxAmmo()) {
      actions.push({
        label: 'RELOAD',
        onClick: () => this.reload(),
      });
    }

    return actions;
  }

  /**
   * Find target and shoot.
   */
  public update() {
    super.update();

    if (
      this.ammoLeft === 0
      || !this.isAllowAction()
      || this.scene.player.live.isDead()
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
      this.alert = true;

      this.scene.game.tutorial.beg(TutorialStep.RELOAD_BUILDING);
    }
  }

  /**
   * Get shot params.
   */
  private getShotCurrentParams(level?: number) {
    const params: ShotParams = {
      maxDistance: this.getActionsRadius(),
    };

    if (this.shotDefaultParams.speed) {
      params.speed = calcGrowth(
        this.shotDefaultParams.speed,
        DIFFICULTY.BUIDLING_TOWER_SHOT_SPEED_GROWTH,
        level || this.upgradeLevel,
      );
    }

    if (this.shotDefaultParams.damage) {
      params.damage = calcGrowth(
        this.shotDefaultParams.damage,
        DIFFICULTY.BUIDLING_TOWER_SHOT_DAMAGE_GROWTH,
        level || this.upgradeLevel,
      );
    }

    if (this.shotDefaultParams.freeze) {
      params.freeze = calcGrowth(
        this.shotDefaultParams.freeze,
        DIFFICULTY.BUIDLING_TOWER_SHOT_FREEZE_GROWTH,
        level || this.upgradeLevel,
      );
    }

    return params;
  }

  /**
   * Get nearby ammunition.
   */
  private getAmmunition() {
    const ammunitions = <BuildingAmmunition[]> this.scene.getBuildingsByVariant(BuildingVariant.AMMUNITION);
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
    const needAmmo = this.getMaxAmmo() - this.ammoLeft;

    if (needAmmo <= 0) {
      return;
    }

    const ammunition = this.getAmmunition();

    if (!ammunition) {
      this.scene.game.screen.notice(NoticeType.ERROR, 'NO AMMUNITION NEARBY');

      return;
    }

    const ammo = ammunition.use(needAmmo);

    this.ammoLeft += ammo;

    this.scene.sound.play(BuildingAudio.RELOAD);
    this.alert = false;

    this.scene.game.tutorial.end(TutorialStep.RELOAD_BUILDING);
  }

  /**
   * Get maximum ammo in clip.
   */
  private getMaxAmmo() {
    return DIFFICULTY.BUIDLING_TOWER_AMMO_AMOUNT * this.upgradeLevel;
  }

  /**
   * Find nearby enemy for shoot.
   */
  private getTarget() {
    const enemies = this.scene.getEnemies().filter((enemy) => (
      !enemy.live.isDead()
      && this.actionsAreaContains(enemy)
      && !this.scene.level.hasTilesBetweenPositions(this, enemy)
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
    this.shot.params = this.getShotCurrentParams();
    this.shot.shoot(target);
  }
}

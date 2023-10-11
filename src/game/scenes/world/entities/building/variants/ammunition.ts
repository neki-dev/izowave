import { CONTROL_KEY } from '~const/controls';
import { DIFFICULTY } from '~const/world/difficulty';
import { LEVEL_TILE_SIZE } from '~const/world/level';
import { progressionQuadratic } from '~lib/difficulty';
import { Tutorial } from '~lib/tutorial';
import { NoticeType } from '~type/screen';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import {
  BuildingAudio, BuildingParam, BuildingEvents, BuildingTexture,
  BuildingVariant, BuildingVariantData, BuildingIcon, IBuildingAmmunition, BuildingSavePayload, BuildingControl,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingAmmunition extends Building implements IBuildingAmmunition {
  static Name = 'Ammunition';

  static Description = 'Reloads towers ammo within building radius';

  static Category = 'Resources';

  static Params: BuildingParam[] = [
    { label: 'Health', value: DIFFICULTY.BUILDING_AMMUNITION_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'Ammo', value: DIFFICULTY.BUILDING_AMMUNITION_AMMO, icon: BuildingIcon.AMMO },
  ];

  static Texture = BuildingTexture.AMMUNITION;

  static Cost = DIFFICULTY.BUILDING_AMMUNITION_COST;

  static Health = DIFFICULTY.BUILDING_AMMUNITION_HEALTH;

  static AllowByWave = DIFFICULTY.BUILDING_AMMUNITION_ALLOW_BY_WAVE;

  static MaxLevel = 4;

  private maxAmmo: number = DIFFICULTY.BUILDING_AMMUNITION_AMMO;

  private _ammo: number = DIFFICULTY.BUILDING_AMMUNITION_AMMO;

  public get ammo() { return this._ammo; }

  private set ammo(v) { this._ammo = v; }

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.AMMUNITION,
      health: BuildingAmmunition.Health,
      texture: BuildingAmmunition.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_AMMUNITION_RADIUS,
        growth: DIFFICULTY.BUILDING_AMMUNITION_RADIUS_GROWTH,
      },
    });

    this.addIndicator({
      color: 0xfcb97e,
      size: LEVEL_TILE_SIZE.width / 2,
      value: () => this.ammo / this.maxAmmo,
    });

    Tutorial.Complete(TutorialStep.BUILD_AMMUNITION);

    this.on(BuildingEvents.UPGRADE, this.onUpgrade.bind(this));

    this.bindTutorialHint(
      TutorialStep.BUY_AMMO,
      this.scene.game.device.os.desktop
        ? 'Hover and press [F]\nto buy ammo'
        : 'Click to buy ammo',
      () => this.ammo === 0,
    );

    this.bindHotKey(CONTROL_KEY.BUILDING_BUY_AMMO, () => this.buyAmmo());
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'Ammo',
      icon: BuildingIcon.AMMO,
      value: `${this.ammo}/${this.maxAmmo}`,
    }];

    return super.getInfo().concat(info);
  }

  public getControls() {
    const actions: BuildingControl[] = [{
      label: 'Buy ammo',
      cost: this.getAmmoCost(),
      disabled: (this.ammo >= this.maxAmmo),
      hotkey: 'F',
      onClick: () => {
        this.buyAmmo();
      },
    }];

    return super.getControls().concat(actions);
  }

  public use(amount: number) {
    const totalAmount = (this.ammo < amount) ? this.ammo : amount;

    this.ammo -= totalAmount;

    if (this.ammo === 0) {
      if (this.scene.game.sound.getAll(BuildingAudio.OVER).length === 0) {
        this.scene.game.sound.play(BuildingAudio.OVER);
      }

      this.addAlertIcon();

      Tutorial.Start(TutorialStep.BUY_AMMO);
    }

    return totalAmount;
  }

  private getAmmoCost() {
    const needAmmo = this.maxAmmo - this.ammo;
    const costPerAmmo = (DIFFICULTY.BUILDING_AMMUNITION_COST / DIFFICULTY.BUILDING_AMMUNITION_AMMO) * 0.5;

    return Math.ceil(costPerAmmo * needAmmo);
  }

  private buyAmmo() {
    if (this.ammo >= this.maxAmmo) {
      return;
    }

    const cost = this.getAmmoCost();

    if (this.scene.player.resources < cost) {
      this.scene.game.screen.notice(NoticeType.ERROR, 'Not enough resources');

      return;
    }

    this.ammo = this.maxAmmo;

    this.scene.player.takeResources(cost);
    this.removeAlertIcon();

    this.scene.getEntitiesGroup(EntityType.BUILDING)
      .emit(BuildingEvents.BUY_AMMO, this);

    this.scene.sound.play(BuildingAudio.RELOAD);

    Tutorial.Complete(TutorialStep.BUY_AMMO);
  }

  private onUpgrade() {
    const maxAmmo = progressionQuadratic({
      defaultValue: DIFFICULTY.BUILDING_AMMUNITION_AMMO,
      scale: DIFFICULTY.BUILDING_AMMUNITION_AMMO_GROWTH,
      level: this.upgradeLevel,
      roundTo: 10,
    });
    const addedAmmo = maxAmmo - this.maxAmmo;

    this.maxAmmo = maxAmmo;
    this.ammo += addedAmmo;
  }

  public getSavePayload() {
    return {
      ...super.getSavePayload(),
      ammo: this.ammo,
    };
  }

  public loadSavePayload(data: BuildingSavePayload) {
    super.loadSavePayload(data);

    if (data.ammo) {
      this.ammo = data.ammo;
    }
  }
}

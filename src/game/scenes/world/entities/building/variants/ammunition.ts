import { DIFFICULTY } from '~const/world/difficulty';
import { NoticeType } from '~type/screen';
import { IWorld } from '~type/world';
import {
  BuildingAudio, BuildingParam, BuildingEvents, BuildingTexture,
  BuildingVariant, BuildingVariantData, BuildingIcon, IBuildingAmmunition,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingAmmunition extends Building implements IBuildingAmmunition {
  static Name = 'Ammunition';

  static Description = 'Reloading towers ammo, that are in radius of this building';

  static Params: BuildingParam[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_AMMUNITION_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'AMMO', value: DIFFICULTY.BUILDING_AMMUNITION_AMMO, icon: BuildingIcon.AMMO },
  ];

  static Texture = BuildingTexture.AMMUNITION;

  static Cost = DIFFICULTY.BUILDING_AMMUNITION_COST;

  static Health = DIFFICULTY.BUILDING_AMMUNITION_HEALTH;

  static Limit = DIFFICULTY.BUILDING_AMMUNITION_LIMIT;

  static AllowByWave = DIFFICULTY.BUILDING_AMMUNITION_ALLOW_BY_WAVE;

  private _ammo: number = DIFFICULTY.BUILDING_AMMUNITION_AMMO;

  public get ammo() { return this._ammo; }

  private set ammo(v) { this._ammo = v; }

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.AMMUNITION,
      health: BuildingAmmunition.Health,
      texture: BuildingAmmunition.Texture,
      actions: {
        radius: DIFFICULTY.BUILDING_AMMUNITION_RELOAD_RADIUS,
      },
    });

    this.on(BuildingEvents.UPGRADE, () => {
      this.upgradeAmmoCount();
    });
  }

  public getInfo() {
    return [
      ...super.getInfo(), {
        label: 'AMMO',
        icon: BuildingIcon.AMMO,
        value: this.ammo,
      },
    ];
  }

  public use(amount: number) {
    if (this.ammo <= amount) {
      const left = this.ammo;

      this.scene.game.sound.play(BuildingAudio.OVER);
      this.scene.game.screen.notice(NoticeType.WARN, `${this.getMeta().Name} ARE OVER`);

      this.destroy();

      return left;
    }

    this.ammo -= amount;

    return amount;
  }

  private upgradeAmmoCount() {
    this.ammo += DIFFICULTY.BUILDING_AMMUNITION_AMMO_UPGRADE * (this.upgradeLevel - 1);
  }
}

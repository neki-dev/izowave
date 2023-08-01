import { DIFFICULTY } from '~const/world/difficulty';
import { progressionQuadratic } from '~lib/difficulty';
import { NoticeType } from '~type/screen';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import {
  BuildingAudio, BuildingParam, BuildingEvents, BuildingTexture,
  BuildingVariant, BuildingVariantData, BuildingIcon, IBuildingAmmunition,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingAmmunition extends Building implements IBuildingAmmunition {
  static Name = 'Ammunition';

  static Description = 'Reloads towers ammo within building radius';

  static Params: BuildingParam[] = [
    { label: 'Health', value: DIFFICULTY.BUILDING_AMMUNITION_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'Ammo', value: DIFFICULTY.BUILDING_AMMUNITION_AMMO, icon: BuildingIcon.AMMO },
  ];

  static Texture = BuildingTexture.AMMUNITION;

  static Cost = DIFFICULTY.BUILDING_AMMUNITION_COST;

  static Health = DIFFICULTY.BUILDING_AMMUNITION_HEALTH;

  static Limit = true;

  static AllowByWave = DIFFICULTY.BUILDING_AMMUNITION_ALLOW_BY_WAVE;

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
      actions: {
        radius: DIFFICULTY.BUILDING_AMMUNITION_RELOAD_RADIUS,
      },
    });

    this.scene.game.tutorial.complete(TutorialStep.BUILD_AMMUNITION);

    this.on(BuildingEvents.UPGRADE, this.onUpgrade.bind(this));
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'Ammo',
      icon: BuildingIcon.AMMO,
      value: this.ammo,
    }];

    return super.getInfo().concat(info);
  }

  public use(amount: number) {
    if (this.ammo <= amount) {
      const left = this.ammo;

      this.scene.game.screen.notice(NoticeType.WARN, `${this.getMeta().Name} are over`);
      if (this.scene.game.sound.getAll(BuildingAudio.OVER).length === 0) {
        this.scene.game.sound.play(BuildingAudio.OVER);
      }

      this.destroy();

      return left;
    }

    this.ammo -= amount;

    return amount;
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
}

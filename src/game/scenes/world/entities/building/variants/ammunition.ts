import { DIFFICULTY } from '~const/world/difficulty';
import { progressionLinearFrom } from '~lib/utils';
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

    this.scene.game.tutorial.complete(TutorialStep.BUILD_AMMUNITION);

    this.on(BuildingEvents.UPGRADE, this.onUpgrade.bind(this));
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'AMMO',
      icon: BuildingIcon.AMMO,
      value: this.ammo,
    }];

    return super.getInfo().concat(info);
  }

  public use(amount: number) {
    if (this.ammo <= amount) {
      const left = this.ammo;

      this.scene.game.sound.play(BuildingAudio.OVER);

      this.destroy();

      return left;
    }

    this.ammo -= amount;

    return amount;
  }

  private onUpgrade() {
    this.ammo = progressionLinearFrom(
      this.ammo,
      DIFFICULTY.BUILDING_AMMUNITION_AMMO,
      DIFFICULTY.BUILDING_AMMUNITION_AMMO_GROWTH,
      this.upgradeLevel,
    );
  }
}

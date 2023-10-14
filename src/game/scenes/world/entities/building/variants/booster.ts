import { DIFFICULTY } from '~const/world/difficulty';
import { progressionLinear } from '~lib/difficulty';
import { LangPhrase } from '~type/lang';
import { IWorld } from '~type/world';
import {
  BuildingVariant,
  BuildingTexture,
  BuildingParam,
  BuildingVariantData,
  BuildingIcon,
  BuildingEvents,
  IBuildingBooster,
  BuildingCategory,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingBooster extends Building implements IBuildingBooster {
  static Name: LangPhrase = 'BUILDING_NAME_BOOSTER';

  static Description: LangPhrase = 'BUILDING_DESCRIPTION_BOOSTER';

  static Category = BuildingCategory.OTHER;

  static Texture = BuildingTexture.BOOSTER;

  static Cost = DIFFICULTY.BUILDING_BOOSTER_COST;

  static Health = DIFFICULTY.BUILDING_BOOSTER_HEALTH;

  static AllowByWave = DIFFICULTY.BUILDING_BOOSTER_ALLOW_BY_WAVE;

  static MaxLevel = 3;

  private _power: number = DIFFICULTY.BUILDING_BOOSTER_POWER;

  public get power() { return this._power; }

  private set power(v) { this._power = v; }

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.BOOSTER,
      health: BuildingBooster.Health,
      texture: BuildingBooster.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_BOOSTER_RADIUS,
        growth: DIFFICULTY.BUILDING_BOOSTER_RADIUS_GROWTH,
      },
    });

    this.on(BuildingEvents.UPGRADE, this.onUpgrade.bind(this));
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'BUILDING_POWER',
      icon: BuildingIcon.POWER,
      value: `+${this.power}%`,
    }];

    return super.getInfo().concat(info);
  }

  private onUpgrade() {
    this.power = progressionLinear({
      defaultValue: DIFFICULTY.BUILDING_BOOSTER_POWER,
      scale: DIFFICULTY.BUILDING_BOOSTER_POWER_GROWTH,
      level: this.upgradeLevel,
    });
  }
}

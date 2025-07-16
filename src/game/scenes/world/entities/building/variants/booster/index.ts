import { Building } from '../..';
import {
  BuildingCategory,
  BuildingTexture,
  BuildingVariant,
  BuildingEvent,
  BuildingIcon,
} from '../../types';
import type {
  BuildingVariantData,
  BuildingParam,
} from '../../types';

import { BUILDING_BOOSTER_COST, BUILDING_BOOSTER_RADIUS, BUILDING_BOOSTER_ALLOW_BY_WAVE, BUILDING_BOOSTER_POWER, BUILDING_BOOSTER_HEALTH, BUILDING_BOOSTER_RADIUS_GROWTH, BUILDING_BOOSTER_POWER_GROWTH } from './const';

import { progressionLinear } from '~core/progression';
import type { WorldScene } from '~game/scenes/world';

export class BuildingBooster extends Building {
  static Category = BuildingCategory.OTHER;

  static Texture = BuildingTexture.BOOSTER;

  static Cost = BUILDING_BOOSTER_COST;

  static Radius = BUILDING_BOOSTER_RADIUS;

  static AllowByWave = BUILDING_BOOSTER_ALLOW_BY_WAVE;

  static MaxLevel = 3;

  private _power: number = BUILDING_BOOSTER_POWER;

  public get power() { return this._power; }

  private set power(v) { this._power = v; }

  constructor(scene: WorldScene, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.BOOSTER,
      health: BUILDING_BOOSTER_HEALTH,
      texture: BuildingBooster.Texture,
      radius: {
        default: BUILDING_BOOSTER_RADIUS,
        growth: BUILDING_BOOSTER_RADIUS_GROWTH,
      },
    });

    this.on(BuildingEvent.UPGRADE, this.onUpgrade.bind(this));
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'BUILDING_POWER',
      icon: BuildingIcon.POWER,
      value: `+${this.power * 100}%`,
    }];

    return super.getInfo().concat(info);
  }

  public getTopEdgePosition() {
    const position = super.getTopEdgePosition();

    position.y -= 6;

    return position;
  }

  private onUpgrade() {
    this.power = progressionLinear({
      defaultValue: BUILDING_BOOSTER_POWER * 100,
      scale: BUILDING_BOOSTER_POWER_GROWTH,
      level: this.upgradeLevel,
    }) / 100;
  }
}

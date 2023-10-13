import { DIFFICULTY } from '~const/world/difficulty';
import { ShotBallFrozen } from '~entity/shot/ball/variants/frozen';
import { LangPhrase } from '~type/lang';
import { IWorld } from '~type/world';
import {
  BuildingCategory,
  BuildingIcon,
  BuildingParam,
  BuildingTexture,
  BuildingVariant,
  BuildingVariantData,
} from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerFrozen extends BuildingTower {
  static Name: LangPhrase = 'BUILDING_NAME_TOWER_FROZEN';

  static Description: LangPhrase = 'BUILDING_DESCRIPTION_TOWER_FROZEN';

  static Category = BuildingCategory.ATTACK;

  static Params: BuildingParam[] = [
    { label: 'BUILDING_HEALTH', value: DIFFICULTY.BUILDING_TOWER_FROZEN_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'BUILDING_RADIUS', value: DIFFICULTY.BUILDING_TOWER_FROZEN_RADIUS, icon: BuildingIcon.RADIUS },
    // eslint-disable-next-line max-len
    { label: 'BUILDING_FREEZE', value: `${(DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_DURATION / 1000).toFixed(1)} s`, icon: BuildingIcon.DAMAGE },
    { label: 'BUILDING_SPEED', value: DIFFICULTY.BUILDING_TOWER_FROZEN_SHOT_SPEED, icon: BuildingIcon.SPEED },
  ];

  static Texture = BuildingTexture.TOWER_FROZEN;

  static Cost = DIFFICULTY.BUILDING_TOWER_FROZEN_COST;

  static Health = DIFFICULTY.BUILDING_TOWER_FROZEN_HEALTH;

  static AllowByWave = DIFFICULTY.BUILDING_TOWER_FROZEN_ALLOW_BY_WAVE;

  static MaxLevel = 5;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotBallFrozen(scene, {
      freeze: DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_DURATION,
      speed: DIFFICULTY.BUILDING_TOWER_FROZEN_SHOT_SPEED,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_FROZEN,
      health: BuildingTowerFrozen.Health,
      texture: BuildingTowerFrozen.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_TOWER_FROZEN_RADIUS,
        growth: DIFFICULTY.BUILDING_TOWER_FROZEN_RADIUS_GROWTH,
      },
      delay: {
        default: DIFFICULTY.BUILDING_TOWER_FROZEN_DELAY,
        growth: DIFFICULTY.BUILDING_TOWER_FROZEN_DELAY_GROWTH,
      },
    }, shot);
  }
}

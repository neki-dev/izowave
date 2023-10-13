import { DIFFICULTY } from '~const/world/difficulty';
import { ShotLazer } from '~entity/shot/lazer';
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

export class BuildingTowerLazer extends BuildingTower {
  static Name: LangPhrase = 'BUILDING_NAME_TOWER_LAZER';

  static Description: LangPhrase = 'BUILDING_DESCRIPTION_TOWER_LAZER';

  static Category = BuildingCategory.ATTACK;

  static Params: BuildingParam[] = [
    { label: 'BUILDING_HEALTH', value: DIFFICULTY.BUILDING_TOWER_LAZER_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'BUILDING_RADIUS', value: DIFFICULTY.BUILDING_TOWER_LAZER_RADIUS, icon: BuildingIcon.RADIUS },
    { label: 'BUILDING_DAMAGE', value: DIFFICULTY.BUILDING_TOWER_LAZER_DAMAGE, icon: BuildingIcon.DAMAGE },
  ];

  static Texture = BuildingTexture.TOWER_LAZER;

  static Cost = DIFFICULTY.BUILDING_TOWER_LAZER_COST;

  static Health = DIFFICULTY.BUILDING_TOWER_LAZER_HEALTH;

  static AllowByWave = DIFFICULTY.BUILDING_TOWER_LAZER_ALLOW_BY_WAVE;

  static MaxLevel = 5;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotLazer(scene, {
      damage: DIFFICULTY.BUILDING_TOWER_LAZER_DAMAGE,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_LAZER,
      health: BuildingTowerLazer.Health,
      texture: BuildingTowerLazer.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_TOWER_LAZER_RADIUS,
        growth: DIFFICULTY.BUILDING_TOWER_LAZER_RADIUS_GROWTH,
      },
      delay: {
        default: DIFFICULTY.BUILDING_TOWER_LAZER_DELAY,
        growth: DIFFICULTY.BUILDING_TOWER_LAZER_DELAY_GROWTH,
      },
    }, shot);
  }
}

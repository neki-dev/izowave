import { DIFFICULTY } from '~const/world/difficulty';
import { ShotLazer } from '~entity/shot/lazer';
import { IWorld } from '~type/world';
import {
  BuildingCategory,
  BuildingTexture,
  BuildingVariant,
  BuildingVariantData,
} from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerLazer extends BuildingTower {
  static Category = BuildingCategory.ATTACK;

  static Texture = BuildingTexture.TOWER_LAZER;

  static Cost = DIFFICULTY.BUILDING_TOWER_LAZER_COST;

  static Radius = DIFFICULTY.BUILDING_TOWER_LAZER_RADIUS;

  static AllowByWave = DIFFICULTY.BUILDING_TOWER_LAZER_ALLOW_BY_WAVE;

  static MaxLevel = 5;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotLazer(scene, {
      damage: DIFFICULTY.BUILDING_TOWER_LAZER_DAMAGE,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_LAZER,
      health: DIFFICULTY.BUILDING_TOWER_LAZER_HEALTH,
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

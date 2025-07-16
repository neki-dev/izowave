import { BuildingTower } from '..';
import { BuildingCategory, BuildingTexture, BuildingVariant } from '../../../types';
import type { BuildingVariantData } from '../../../types';

import { BUILDING_TOWER_LAZER_COST, BUILDING_TOWER_LAZER_RADIUS, BUILDING_TOWER_LAZER_ALLOW_BY_WAVE, BUILDING_TOWER_LAZER_DAMAGE, BUILDING_TOWER_LAZER_HEALTH, BUILDING_TOWER_LAZER_RADIUS_GROWTH, BUILDING_TOWER_LAZER_DELAY, BUILDING_TOWER_LAZER_DELAY_GROWTH } from './const';

import type { WorldScene } from '~scene/world';
import { ShotLazer } from '~scene/world/entities/shot/lazer';

export class BuildingTowerLazer extends BuildingTower {
  static Category = BuildingCategory.ATTACK;

  static Texture = BuildingTexture.TOWER_LAZER;

  static Cost = BUILDING_TOWER_LAZER_COST;

  static Radius = BUILDING_TOWER_LAZER_RADIUS;

  static AllowByWave = BUILDING_TOWER_LAZER_ALLOW_BY_WAVE;

  static MaxLevel = 5;

  constructor(scene: WorldScene, data: BuildingVariantData) {
    const shot = new ShotLazer(scene, {
      damage: BUILDING_TOWER_LAZER_DAMAGE,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_LAZER,
      health: BUILDING_TOWER_LAZER_HEALTH,
      texture: BuildingTowerLazer.Texture,
      radius: {
        default: BUILDING_TOWER_LAZER_RADIUS,
        growth: BUILDING_TOWER_LAZER_RADIUS_GROWTH,
      },
      delay: {
        default: BUILDING_TOWER_LAZER_DELAY,
        growth: BUILDING_TOWER_LAZER_DELAY_GROWTH,
      },
    }, shot);
  }
}

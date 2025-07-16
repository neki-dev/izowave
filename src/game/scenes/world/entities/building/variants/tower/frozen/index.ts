import { BuildingTower } from '..';
import { BuildingCategory, BuildingTexture, BuildingVariant } from '../../../types';
import type { BuildingVariantData } from '../../../types';

import { BUILDING_TOWER_FROZEN_COST, BUILDING_TOWER_FROZEN_RADIUS, BUILDING_TOWER_FROZEN_ALLOW_BY_WAVE, BUILDING_TOWER_FROZEN_FREEZE_DURATION, BUILDING_TOWER_FROZEN_SHOT_SPEED, BUILDING_TOWER_FROZEN_HEALTH, BUILDING_TOWER_FROZEN_RADIUS_GROWTH, BUILDING_TOWER_FROZEN_DELAY, BUILDING_TOWER_FROZEN_DELAY_GROWTH } from './const';

import type { WorldScene } from '~scene/world';
import { ShotBallFrozen } from '~scene/world/entities/shot/ball/variants/frozen';

export class BuildingTowerFrozen extends BuildingTower {
  static Category = BuildingCategory.DEFENSE;

  static Texture = BuildingTexture.TOWER_FROZEN;

  static Cost = BUILDING_TOWER_FROZEN_COST;

  static Radius = BUILDING_TOWER_FROZEN_RADIUS;

  static AllowByWave = BUILDING_TOWER_FROZEN_ALLOW_BY_WAVE;

  static MaxLevel = 5;

  constructor(scene: WorldScene, data: BuildingVariantData) {
    const shot = new ShotBallFrozen(scene, {
      freeze: BUILDING_TOWER_FROZEN_FREEZE_DURATION,
      speed: BUILDING_TOWER_FROZEN_SHOT_SPEED,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_FROZEN,
      health: BUILDING_TOWER_FROZEN_HEALTH,
      texture: BuildingTowerFrozen.Texture,
      radius: {
        default: BUILDING_TOWER_FROZEN_RADIUS,
        growth: BUILDING_TOWER_FROZEN_RADIUS_GROWTH,
      },
      delay: {
        default: BUILDING_TOWER_FROZEN_DELAY,
        growth: BUILDING_TOWER_FROZEN_DELAY_GROWTH,
      },
    }, shot);
  }
}

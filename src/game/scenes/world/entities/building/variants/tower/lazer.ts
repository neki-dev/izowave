import { DIFFICULTY } from '../../../../../../../const/difficulty';
import { BuildingCategory, BuildingTexture, BuildingVariant } from '../../types';
import { BuildingTower } from '.';
import type { BuildingVariantData } from '../../types';
import type { IWorld } from '~scene/world/types';
import { ShotLazer } from '~scene/world/entities/shot/lazer';

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

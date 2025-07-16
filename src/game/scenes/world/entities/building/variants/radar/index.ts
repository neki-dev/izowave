import { Building } from '../..';
import { BuildingCategory, BuildingTexture, BuildingVariant } from '../../types';
import type { BuildingVariantData } from '../../types';

import { BUILDING_RADAR_COST, BUILDING_RADAR_RADIUS, BUILDING_RADAR_ALLOW_BY_WAVE, BUILDING_RADAR_HEALTH, BUILDING_RADAR_RADIUS_GROWTH } from './const';

import { Tutorial } from '~core/tutorial';
import { TutorialStep } from '~core/tutorial/types';
import type { WorldScene } from '~scene/world';

export class BuildingRadar extends Building {
  static Category = BuildingCategory.OTHER;

  static Texture = BuildingTexture.RADAR;

  static Cost = BUILDING_RADAR_COST;

  static Radius = BUILDING_RADAR_RADIUS;

  static AllowByWave = BUILDING_RADAR_ALLOW_BY_WAVE;

  static MaxLevel = 4;

  constructor(scene: WorldScene, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.RADAR,
      health: BUILDING_RADAR_HEALTH,
      texture: BuildingRadar.Texture,
      radius: {
        default: BUILDING_RADAR_RADIUS,
        growth: BUILDING_RADAR_RADIUS_GROWTH,
      },
    });

    Tutorial.Complete(TutorialStep.BUILD_RADAR);
  }

  public getTopEdgePosition() {
    const position = super.getTopEdgePosition();

    position.y -= (this.upgradeLevel === 1) ? 2 : 8;

    return position;
  }
}

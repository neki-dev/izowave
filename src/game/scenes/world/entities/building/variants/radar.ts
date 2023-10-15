import { DIFFICULTY } from '~const/world/difficulty';
import { Tutorial } from '~lib/tutorial';
import { LangPhrase } from '~type/lang';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import {
  BuildingVariant,
  BuildingTexture,
  BuildingVariantData,
  BuildingCategory,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingRadar extends Building {
  static Name: LangPhrase = 'BUILDING_NAME_RADAR';

  static Description: LangPhrase = 'BUILDING_DESCRIPTION_RADAR';

  static Category = BuildingCategory.OTHER;

  static Texture = BuildingTexture.RADAR;

  static Cost = DIFFICULTY.BUILDING_RADAR_COST;

  static Radius = DIFFICULTY.BUILDING_RADAR_RADIUS;

  static AllowByWave = DIFFICULTY.BUILDING_RADAR_ALLOW_BY_WAVE;

  static MaxLevel = 4;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.RADAR,
      health: DIFFICULTY.BUILDING_RADAR_HEALTH,
      texture: BuildingRadar.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_RADAR_RADIUS,
        growth: DIFFICULTY.BUILDING_RADAR_RADIUS_GROWTH,
      },
    });

    Tutorial.Complete(TutorialStep.BUILD_RADAR);
  }
}

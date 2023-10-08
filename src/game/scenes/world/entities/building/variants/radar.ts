import { DIFFICULTY } from '~const/world/difficulty';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import {
  BuildingVariant, BuildingTexture, BuildingParam, BuildingVariantData, BuildingIcon,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingRadar extends Building {
  static Name = 'Radar';

  static Description = 'Makes hidden enemies visible within building radius';

  static Params: BuildingParam[] = [
    { label: 'Health', value: DIFFICULTY.BUILDING_RADAR_HEALTH, icon: BuildingIcon.HEALTH },
  ];

  static Texture = BuildingTexture.RADAR;

  static Cost = DIFFICULTY.BUILDING_RADAR_COST;

  static Health = DIFFICULTY.BUILDING_RADAR_HEALTH;

  static AllowByWave = DIFFICULTY.BUILDING_RADAR_ALLOW_BY_WAVE;

  static MaxLevel = 4;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.RADAR,
      health: BuildingRadar.Health,
      texture: BuildingRadar.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_RADAR_RADIUS,
        growth: DIFFICULTY.BUILDING_RADAR_RADIUS_GROWTH,
      },
    });

    this.scene.game.tutorial.complete(TutorialStep.BUILD_RADAR);
  }
}

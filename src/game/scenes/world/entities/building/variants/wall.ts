import { DIFFICULTY } from '~const/world/difficulty';
import { LangPhrase } from '~type/lang';
import { IWorld } from '~type/world';
import {
  BuildingVariant,
  BuildingTexture,
  BuildingParam,
  BuildingVariantData,
  BuildingIcon,
  BuildingCategory,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingWall extends Building {
  static Name: LangPhrase = 'BUILDING_NAME_WALL';

  static Description: LangPhrase = 'BUILDING_DESCRIPTION_WALL';

  static Category = BuildingCategory.DEFENSE;

  static Params: BuildingParam[] = [
    { label: 'BUILDING_HEALTH', value: DIFFICULTY.BUILDING_WALL_HEALTH, icon: BuildingIcon.HEALTH },
  ];

  static Texture = BuildingTexture.WALL;

  static Cost = DIFFICULTY.BUILDING_WALL_COST;

  static Health = DIFFICULTY.BUILDING_WALL_HEALTH;

  static AllowByWave = DIFFICULTY.BUILDING_WALL_ALLOW_BY_WAVE;

  static MaxLevel = 3;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.WALL,
      health: BuildingWall.Health,
      texture: BuildingWall.Texture,
    });
  }
}

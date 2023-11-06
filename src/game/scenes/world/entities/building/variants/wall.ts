import { DIFFICULTY } from '~const/world/difficulty';
import { IWorld } from '~type/world';
import {
  BuildingVariant,
  BuildingTexture,
  BuildingVariantData,
  BuildingCategory,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingWall extends Building {
  static Category = BuildingCategory.DEFENSE;

  static Texture = BuildingTexture.WALL;

  static Cost = DIFFICULTY.BUILDING_WALL_COST;

  static AllowByWave = DIFFICULTY.BUILDING_WALL_ALLOW_BY_WAVE;

  static MaxLevel = 3;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.WALL,
      health: DIFFICULTY.BUILDING_WALL_HEALTH,
      texture: BuildingWall.Texture,
    });
  }

  public getTopEdgePosition() {
    const position = super.getTopEdgePosition();

    position.y += (this.upgradeLevel === 1) ? 6 : -2;

    return position;
  }
}

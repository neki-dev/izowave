import { Building } from '../..';
import { BuildingCategory, BuildingTexture, BuildingVariant } from '../../types';
import type { BuildingVariantData } from '../../types';

import { BUILDING_WALL_COST, BUILDING_WALL_ALLOW_BY_WAVE, BUILDING_WALL_HEALTH } from './const';

import type { WorldScene } from '~scene/world';

export class BuildingWall extends Building {
  static Category = BuildingCategory.DEFENSE;

  static Texture = BuildingTexture.WALL;

  static Cost = BUILDING_WALL_COST;

  static AllowByWave = BUILDING_WALL_ALLOW_BY_WAVE;

  static MaxLevel = 3;

  constructor(scene: WorldScene, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.WALL,
      health: BUILDING_WALL_HEALTH,
      texture: BuildingWall.Texture,
    });
  }

  public getTopEdgePosition() {
    const position = super.getTopEdgePosition();

    position.y += (this.upgradeLevel === 1) ? 6 : -2;

    return position;
  }
}

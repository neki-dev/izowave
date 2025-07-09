import type { Building } from '..';
import type { BuildingCategory, BuildingTexture, BuildingVariantData } from '../types';

import type { WorldScene } from '~game/scenes/world';

export interface IBuildingFactory {
  Category: BuildingCategory
  Texture: BuildingTexture
  Cost: number
  Radius?: number
  Limit?: boolean
  AllowByWave?: number
  MaxLevel: number
  new (scene: WorldScene, data: BuildingVariantData): Building
}

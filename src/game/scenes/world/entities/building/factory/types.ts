import { IWorld } from '~scene/world/types';

import {
  BuildingCategory, BuildingTexture, BuildingVariantData, IBuilding,
} from '../types';

export interface IBuildingFactory {
  Category: BuildingCategory
  Texture: BuildingTexture
  Cost: number
  Radius?: number
  Limit?: boolean
  AllowByWave?: number
  MaxLevel: number
  new (scene: IWorld, data: BuildingVariantData): IBuilding
}

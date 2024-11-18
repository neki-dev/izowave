import type {
  BuildingCategory, BuildingTexture, BuildingVariantData, IBuilding,
} from '../types';
import type { IWorld } from '~scene/world/types';

export interface IBuildingFactory {
  Category: BuildingCategory
  Texture: BuildingTexture
  Cost: number
  Radius?: number
  Limit?: boolean
  AllowByWave?: number
  MaxLevel: number
  CityRequired: boolean
  new (scene: IWorld, data: BuildingVariantData): IBuilding
}

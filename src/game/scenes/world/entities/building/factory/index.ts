import { BUILDINGS } from './const';
import type { BuildingVariant, BuildingVariantData } from '../types';
import type { IWorld } from '~scene/world/types';

export class BuildingFactory {
  public static create(scene: IWorld, variant: BuildingVariant, data: BuildingVariantData) {
    const BuildingInstance = BUILDINGS[variant];

    return new BuildingInstance(scene, data);
  }
}

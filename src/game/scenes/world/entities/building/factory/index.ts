import type { BuildingVariant, BuildingVariantData } from '../types';

import { BUILDINGS } from './const';

import type { WorldScene } from '~scene/world';

export class BuildingFactory {
  public static create(scene: WorldScene, variant: BuildingVariant, data: BuildingVariantData) {
    const BuildingInstance = BUILDINGS[variant];

    return new BuildingInstance(scene, data);
  }
}

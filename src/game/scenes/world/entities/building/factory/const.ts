import type { IBuildingFactory } from './types';

import { BuildingVariant } from '~scene/world/entities/building/types';
import { BuildingAmmunition } from '~scene/world/entities/building/variants/ammunition';
import { BuildingBooster } from '~scene/world/entities/building/variants/booster';
import { BuildingGenerator } from '~scene/world/entities/building/variants/generator';
import { BuildingRadar } from '~scene/world/entities/building/variants/radar';
import { BuildingTowerElectro } from '~scene/world/entities/building/variants/tower/electro';
import { BuildingTowerFire } from '~scene/world/entities/building/variants/tower/fire';
import { BuildingTowerFrozen } from '~scene/world/entities/building/variants/tower/frozen';
import { BuildingTowerLazer } from '~scene/world/entities/building/variants/tower/lazer';
import { BuildingWall } from '~scene/world/entities/building/variants/wall';
import { BuildingCityCenter } from '~scene/world/entities/building/variants/citycenter';

export const BUILDINGS: Record<BuildingVariant, IBuildingFactory> = {
  [BuildingVariant.WALL]: BuildingWall,
  [BuildingVariant.TOWER_FROZEN]: BuildingTowerFrozen,
  [BuildingVariant.TOWER_FIRE]: BuildingTowerFire,
  [BuildingVariant.TOWER_LAZER]: BuildingTowerLazer,
  [BuildingVariant.TOWER_ELECTRO]: BuildingTowerElectro,
  [BuildingVariant.GENERATOR]: BuildingGenerator,
  [BuildingVariant.AMMUNITION]: BuildingAmmunition,
  [BuildingVariant.BOOSTER]: BuildingBooster,
  [BuildingVariant.RADAR]: BuildingRadar,
  [BuildingVariant.CITYCENTER]: BuildingCityCenter,
};

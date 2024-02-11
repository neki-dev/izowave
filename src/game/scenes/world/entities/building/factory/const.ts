import { BuildingVariant } from '~scene/world/entities/building/types';
import { BuildingAmmunition } from '~scene/world/entities/building/variants/ammunition';
import { BuildingBooster } from '~scene/world/entities/building/variants/booster';
import { BuildingGenerator } from '~scene/world/entities/building/variants/generator';
import { BuildingRadar } from '~scene/world/entities/building/variants/radar';
import { BuildingTowerElectro } from '~scene/world/entities/building/variants/tower/variants/electro';
import { BuildingTowerFire } from '~scene/world/entities/building/variants/tower/variants/fire';
import { BuildingTowerFrozen } from '~scene/world/entities/building/variants/tower/variants/frozen';
import { BuildingTowerLazer } from '~scene/world/entities/building/variants/tower/variants/lazer';
import { BuildingWall } from '~scene/world/entities/building/variants/wall';

import type { IBuildingFactory } from './types';

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
};

import type { IBuildingFactory } from './types';

import { BuildingAmmunition } from '~game/scenes/world/entities/building/variants/ammunition';
import { BuildingBooster } from '~game/scenes/world/entities/building/variants/booster';
import { BuildingGenerator } from '~game/scenes/world/entities/building/variants/generator';
import { BuildingRadar } from '~game/scenes/world/entities/building/variants/radar';
import { BuildingTowerElectro } from '~game/scenes/world/entities/building/variants/tower/electro';
import { BuildingTowerFire } from '~game/scenes/world/entities/building/variants/tower/fire';
import { BuildingTowerFrozen } from '~game/scenes/world/entities/building/variants/tower/frozen';
import { BuildingTowerLazer } from '~game/scenes/world/entities/building/variants/tower/lazer';
import { BuildingWall } from '~game/scenes/world/entities/building/variants/wall';
import { BuildingVariant } from '~scene/world/entities/building/types';

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

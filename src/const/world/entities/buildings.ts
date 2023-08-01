import { BuildingAmmunition } from '~entity/building/variants/ammunition';
import { BuildingGenerator } from '~entity/building/variants/generator';
import { BuildingMedic } from '~entity/building/variants/medic';
import { BuildingRadar } from '~entity/building/variants/radar';
import { BuildingTowerFire } from '~entity/building/variants/tower/variants/fire';
import { BuildingTowerFrozen } from '~entity/building/variants/tower/variants/frozen';
import { BuildingTowerLazer } from '~entity/building/variants/tower/variants/lazer';
import { BuildingWall } from '~entity/building/variants/wall';
import { BuildingVariant, IBuildingFactory } from '~type/world/entities/building';

export const BUILDINGS: Record<BuildingVariant, IBuildingFactory> = {
  [BuildingVariant.WALL]: BuildingWall,
  [BuildingVariant.TOWER_FIRE]: BuildingTowerFire,
  [BuildingVariant.TOWER_FROZEN]: BuildingTowerFrozen,
  [BuildingVariant.TOWER_LAZER]: BuildingTowerLazer,
  [BuildingVariant.GENERATOR]: BuildingGenerator,
  [BuildingVariant.AMMUNITION]: BuildingAmmunition,
  [BuildingVariant.MEDIC]: BuildingMedic,
  [BuildingVariant.RADAR]: BuildingRadar,
};

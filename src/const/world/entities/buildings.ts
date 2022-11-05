import { BuildingAmmunition } from '~game/scenes/world/entities/building/variants/ammunition';
import { BuildingGenerator } from '~game/scenes/world/entities/building/variants/generator';
import { BuildingMedic } from '~game/scenes/world/entities/building/variants/medic';
import { BuildingTowerFire } from '~game/scenes/world/entities/building/variants/tower/variants/fire';
import { BuildingTowerFrozen } from '~game/scenes/world/entities/building/variants/tower/variants/frozen';
import { BuildingTowerLazer } from '~game/scenes/world/entities/building/variants/tower/variants/lazer';
import { BuildingWall } from '~game/scenes/world/entities/building/variants/wall';
import { BuildingVariant } from '~type/world/entities/building';

export const BUILDINGS: Record<BuildingVariant, any> = {
  [BuildingVariant.WALL]: BuildingWall,
  [BuildingVariant.TOWER_FIRE]: BuildingTowerFire,
  [BuildingVariant.TOWER_FROZEN]: BuildingTowerFrozen,
  [BuildingVariant.TOWER_LAZER]: BuildingTowerLazer,
  [BuildingVariant.GENERATOR]: BuildingGenerator,
  [BuildingVariant.AMMUNITION]: BuildingAmmunition,
  [BuildingVariant.MEDIC]: BuildingMedic,
};

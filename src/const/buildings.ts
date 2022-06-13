import BuildingMedic from '~scene/world/entities/buildings/medic';
import BuildingTowerFire from '~scene/world/entities/buildings/towers/fire';
import BuildingTowerFrozen from '~scene/world/entities/buildings/towers/frozen';
import BuildingTowerLazer from '~scene/world/entities/buildings/towers/lazer';
import BuildingMineSilver from '~scene/world/entities/buildings/mines/silver';
import BuildingMineGold from '~scene/world/entities/buildings/mines/gold';
import BuildingMineBronze from '~scene/world/entities/buildings/mines/bronze';
import BuildingWall from '~scene/world/entities/buildings/wall';

import { BuildingVariant } from '~type/building';

const BUILDINGS: {
  [value in BuildingVariant]: any
} = {
  [BuildingVariant.WALL]: BuildingWall,
  [BuildingVariant.TOWER_FIRE]: BuildingTowerFire,
  [BuildingVariant.TOWER_FROZEN]: BuildingTowerFrozen,
  [BuildingVariant.TOWER_LAZER]: BuildingTowerLazer,
  [BuildingVariant.MINE_BRONZE]: BuildingMineBronze,
  [BuildingVariant.MINE_SILVER]: BuildingMineSilver,
  [BuildingVariant.MINE_GOLD]: BuildingMineGold,
  [BuildingVariant.MEDIC]: BuildingMedic,
};

export default BUILDINGS;

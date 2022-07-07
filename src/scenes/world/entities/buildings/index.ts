import BuildingMedic from './medic';
import BuildingTowerFire from './towers/fire';
import BuildingTowerFrozen from './towers/frozen';
import BuildingTowerLazer from './towers/lazer';
import BuildingMineSilver from './mines/silver';
import BuildingMineGold from './mines/gold';
import BuildingMineBronze from './mines/bronze';
import BuildingWall from './wall';
import BuildingAmmunition from './ammunition';

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
  [BuildingVariant.AMMUNITION]: BuildingAmmunition,
  [BuildingVariant.MEDIC]: BuildingMedic,
};

export default BUILDINGS;

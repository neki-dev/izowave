import { BuildingAmmunition } from '~entity/building/variants/ammunition';
import { BuildingMedic } from '~entity/building/variants/medic';
import { BuildingMineBronze } from '~entity/building/variants/mine/variants/bronze';
import { BuildingMineGold } from '~entity/building/variants/mine/variants/gold';
import { BuildingMineSilver } from '~entity/building/variants/mine/variants/silver';
import { BuildingTowerFire } from '~entity/building/variants/tower/variants/fire';
import { BuildingTowerFrozen } from '~entity/building/variants/tower/variants/frozen';
import { BuildingTowerLazer } from '~entity/building/variants/tower/variants/lazer';
import { BuildingWall } from '~entity/building/variants/wall';
import { BuildingVariant } from '~type/world/entities/building';

export const BUILDINGS: Record<BuildingVariant, any> = {
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

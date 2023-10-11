import { DIFFICULTY } from '~const/world/difficulty';
import { ShotBallFrozen } from '~entity/shot/ball/variants/frozen';
import { IWorld } from '~type/world';
import {
  BuildingIcon,
  BuildingParam, BuildingTexture, BuildingVariant, BuildingVariantData,
} from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerFrozen extends BuildingTower {
  static Name = 'Frozen tower';

  static Description = 'Freezing enemies for some time';

  static Category = 'Attack';

  static Params: BuildingParam[] = [
    { label: 'Health', value: DIFFICULTY.BUILDING_TOWER_FROZEN_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'Radius', value: DIFFICULTY.BUILDING_TOWER_FROZEN_RADIUS, icon: BuildingIcon.RADIUS },
    // eslint-disable-next-line max-len
    { label: 'Freeze', value: `${(DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_DURATION / 1000).toFixed(1)} s`, icon: BuildingIcon.DAMAGE },
    { label: 'Speed', value: DIFFICULTY.BUILDING_TOWER_FROZEN_SHOT_SPEED, icon: BuildingIcon.SPEED },
  ];

  static Texture = BuildingTexture.TOWER_FROZEN;

  static Cost = DIFFICULTY.BUILDING_TOWER_FROZEN_COST;

  static Health = DIFFICULTY.BUILDING_TOWER_FROZEN_HEALTH;

  static AllowByWave = DIFFICULTY.BUILDING_TOWER_FROZEN_ALLOW_BY_WAVE;

  static MaxLevel = 5;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotBallFrozen(scene, {
      freeze: DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_DURATION,
      speed: DIFFICULTY.BUILDING_TOWER_FROZEN_SHOT_SPEED,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_FROZEN,
      health: BuildingTowerFrozen.Health,
      texture: BuildingTowerFrozen.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_TOWER_FROZEN_RADIUS,
        growth: DIFFICULTY.BUILDING_TOWER_FROZEN_RADIUS_GROWTH,
      },
      delay: {
        default: DIFFICULTY.BUILDING_TOWER_FROZEN_DELAY,
        growth: DIFFICULTY.BUILDING_TOWER_FROZEN_DELAY_GROWTH,
      },
    }, shot);
  }
}

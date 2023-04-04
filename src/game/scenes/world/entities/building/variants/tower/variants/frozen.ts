import { DIFFICULTY } from '~const/world/difficulty';
import { ShotBallFrozen } from '~entity/shot/ball/variants/frozen';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import {
  BuildingParam, BuildingTexture, BuildingVariant, BuildingVariantData,
} from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerFrozen extends BuildingTower {
  static Name = 'Frozen tower';

  static Description = 'Freezing enemies for some time';

  static Params: BuildingParam[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_TOWER_FROZEN_HEALTH, icon: ScreenIcon.HEALTH },
    { label: 'RADIUS', value: DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_RADIUS, icon: ScreenIcon.RADIUS },
    // eslint-disable-next-line max-len
    { label: 'FREEZE', value: `${(DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_DURATION / 1000).toFixed(1)} s`, icon: ScreenIcon.DAMAGE },
    { label: 'SPEED', value: DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_SPEED, icon: ScreenIcon.SPEED },
  ];

  static Texture = BuildingTexture.TOWER_FROZEN;

  static Cost = DIFFICULTY.BUILDING_TOWER_FROZEN_COST;

  static Health = DIFFICULTY.BUILDING_TOWER_FROZEN_HEALTH;

  static AllowByWave = DIFFICULTY.BUILDING_TOWER_FROZEN_ALLOW_BY_WAVE;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, data: BuildingVariantData) {
    const shot = new ShotBallFrozen(scene, {
      freeze: DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_DURATION,
      speed: DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_SPEED,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_FROZEN,
      health: BuildingTowerFrozen.Health,
      texture: BuildingTowerFrozen.Texture,
      actions: {
        radius: DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_RADIUS,
        pause: DIFFICULTY.BUILDING_TOWER_FROZEN_FREEZE_PAUSE,
      },
    }, shot);
  }
}

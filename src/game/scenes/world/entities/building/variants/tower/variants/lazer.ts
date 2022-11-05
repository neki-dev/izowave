import { DIFFICULTY } from '~const/world/difficulty';
import { ShotLazer } from '~entity/shot/lazer';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingParamItem, BuildingTexture, BuildingVariant } from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerLazer extends BuildingTower {
  static Name = 'Lazer tower';

  static Description = 'Instant and continuous laser attack of enemies';

  static Params: BuildingParamItem[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_TOWER_LAZER_HEALTH, icon: ScreenIcon.HEALTH },
    { label: 'RADIUS', value: DIFFICULTY.BUILDING_TOWER_LAZER_ATTACK_RADIUS, icon: ScreenIcon.RADIUS },
    { label: 'DAMAGE', value: DIFFICULTY.BUILDING_TOWER_LAZER_ATTACK_DAMAGE, icon: ScreenIcon.DAMAGE },
  ];

  static Texture = BuildingTexture.TOWER_LAZER;

  static Cost = DIFFICULTY.BUILDING_TOWER_LAZER_COST;

  static Health = DIFFICULTY.BUILDING_TOWER_LAZER_HEALTH;

  static AllowByWave = DIFFICULTY.BUILDING_TOWER_LAZER_ALLOW_BY_WAVE;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_LAZER,
      health: BuildingTowerLazer.Health,
      texture: BuildingTowerLazer.Texture,
      actions: {
        radius: DIFFICULTY.BUILDING_TOWER_LAZER_ATTACK_RADIUS,
        pause: DIFFICULTY.BUILDING_TOWER_LAZER_ATTACK_PAUSE,
      },
      shotData: {
        instance: ShotLazer,
        params: {
          damage: DIFFICULTY.BUILDING_TOWER_LAZER_ATTACK_DAMAGE,
        },
      },
    });
  }
}

import { ShotBallFrozen } from '~entity/shot/ball/variants/frozen';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingParamItem, BuildingTexture, BuildingVariant } from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerFrozen extends BuildingTower {
  static Name = 'Frozen tower';

  static Description = 'Freezing enemies for some time';

  static Params: BuildingParamItem[] = [
    { label: 'HEALTH', value: 900, icon: ScreenIcon.HEALTH },
    { label: 'RADIUS', value: 190, icon: ScreenIcon.RADIUS },
    { label: 'FREEZE', value: '1.0 s', icon: ScreenIcon.DAMAGE },
    { label: 'SPEED', value: 55, icon: ScreenIcon.SPEED },
  ];

  static Texture = BuildingTexture.TOWER_FROZEN;

  static Cost = 35;

  static Health = 900;

  static WaveAllowed = 3;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_FROZEN,
      health: BuildingTowerFrozen.Health,
      texture: BuildingTowerFrozen.Texture,
      actions: {
        radius: 190, // Attack radius
        pause: 1400, // Pause between shoots
      },
      shotData: {
        instance: ShotBallFrozen,
        params: {
          freeze: 1000,
          speed: 550,
        },
      },
    });
  }

  /**
   * Add freeze to building info.
   */
  public getInfo(): BuildingParamItem[] {
    return [
      ...super.getInfo(), {
        label: 'FREEZE',
        icon: ScreenIcon.DAMAGE,
        value: (this.getShotParams().freeze / 1000).toFixed(1),
      },
    ];
  }
}

import { ShotLazer } from '~entity/shot/lazer';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingParamItem, BuildingTexture, BuildingVariant } from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerLazer extends BuildingTower {
  static Name = 'Lazer tower';

  static Description = 'Instant and continuous laser attack of enemies';

  static Params: BuildingParamItem[] = [
    { label: 'HEALTH', value: 300, icon: ScreenIcon.HEALTH },
    { label: 'RADIUS', value: 180, icon: ScreenIcon.RADIUS },
    { label: 'DAMAGE', value: 75, icon: ScreenIcon.DAMAGE },
  ];

  static Texture = BuildingTexture.TOWER_LAZER;

  static Cost = 60;

  static Health = 300;

  static WaveAllowed = 5;

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
        radius: 180, // Attack radius
        pause: 1600, // Pause between shoots
      },
      shotData: {
        instance: ShotLazer,
        params: {
          damage: 15,
        },
      },
    });
  }

  /**
   * Add damage to building info.
   */
  public getInfo(): BuildingParamItem[] {
    return [
      ...super.getInfo(), {
        label: 'DAMAGE',
        icon: ScreenIcon.DAMAGE,
        value: this.getShotParams().damage * 5,
      },
    ];
  }
}

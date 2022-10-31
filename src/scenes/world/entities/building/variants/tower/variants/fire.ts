import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingParamItem, BuildingTexture, BuildingVariant } from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerFire extends BuildingTower {
  static Name = 'Fire tower';

  static Description = 'Basic fire attack of enemies';

  static Params: BuildingParamItem[] = [
    { label: 'HEALTH', value: 600, icon: ScreenIcon.HEALTH },
    { label: 'RADIUS', value: 215, icon: ScreenIcon.RADIUS },
    { label: 'DAMAGE', value: 35, icon: ScreenIcon.DAMAGE },
    { label: 'SPEED', value: 55, icon: ScreenIcon.SPEED },
  ];

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = 30;

  static Health = 600;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_FIRE,
      health: BuildingTowerFire.Health,
      texture: BuildingTowerFire.Texture,
      actions: {
        radius: 215, // Attack radius
        pause: 1400, // Pause between shoots
      },
      shotData: {
        instance: ShotBallFire,
        params: {
          damage: 35,
          speed: 550,
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
        value: this.getShotParams().damage,
      },
    ];
  }
}

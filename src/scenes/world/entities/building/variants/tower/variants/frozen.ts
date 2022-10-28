import { ShotBallFrozen } from '~entity/shot/ball/variants/frozen';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingDescriptionItem, BuildingTexture, BuildingVariant } from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerFrozen extends BuildingTower {
  static Name = 'Frozen tower';

  static Description = [
    { text: 'Freezing enemies for some time', type: 'text' },
    { text: 'HEALTH: 700', icon: ScreenIcon.HEALTH },
    { text: 'RADIUS: 210', icon: ScreenIcon.RADIUS },
    { text: 'PAUSE: 1.4 s', icon: ScreenIcon.PAUSE },
    { text: 'SPEED: 55', icon: ScreenIcon.SPEED },
    { text: 'FREEZE: 1.0 s', icon: ScreenIcon.DAMAGE },
  ];

  static Texture = BuildingTexture.TOWER_FROZEN;

  static Cost = { bronze: 35, silver: 30 };

  static UpgradeCost = { bronze: 35, silver: 30, gold: 70 };

  static Health = 900;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_FROZEN,
      health: BuildingTowerFrozen.Health,
      texture: BuildingTowerFrozen.Texture,
      upgradeCost: BuildingTowerFrozen.UpgradeCost,
      actions: {
        radius: 210, // Attack radius
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
  public getInfo(): BuildingDescriptionItem[] {
    const nextFreeze = this.isAllowUpgrade()
      ? this.getShotParams(this.upgradeLevel + 1).freeze / 1000
      : null;

    return [
      ...super.getInfo(), {
        text: `FREEZE: ${(this.getShotParams().freeze / 1000).toFixed(1)} s`,
        post: nextFreeze && `${nextFreeze.toFixed(1)} s`,
        icon: ScreenIcon.DAMAGE,
      },
    ];
  }
}

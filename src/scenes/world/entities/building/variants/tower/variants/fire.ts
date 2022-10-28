import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingDescriptionItem, BuildingTexture, BuildingVariant } from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerFire extends BuildingTower {
  static Name = 'Fire tower';

  static Description = [
    { text: 'Basic fire attack of enemies', type: 'text' },
    { text: 'HEALTH: 600', icon: ScreenIcon.HEALTH },
    { text: 'RADIUS: 215', icon: ScreenIcon.RADIUS },
    { text: 'PAUSE: 1.4 s', icon: ScreenIcon.PAUSE },
    { text: 'SPEED: 55', icon: ScreenIcon.SPEED },
    { text: 'DAMAGE: 35', icon: ScreenIcon.DAMAGE },
  ];

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = { bronze: 35, silver: 20 };

  static UpgradeCost = { bronze: 35, silver: 20, gold: 70 };

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
      upgradeCost: BuildingTowerFire.UpgradeCost,
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
  public getInfo(): BuildingDescriptionItem[] {
    const nextDamage = this.isAllowUpgrade()
      ? this.getShotParams(this.upgradeLevel + 1).damage
      : null;

    return [
      ...super.getInfo(), {
        text: `DAMAGE: ${this.getShotParams().damage}`,
        post: nextDamage,
        icon: ScreenIcon.DAMAGE,
      },
    ];
  }
}

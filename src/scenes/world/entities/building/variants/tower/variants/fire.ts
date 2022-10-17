import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingDescriptionItem, BuildingTexture, BuildingVariant } from '~type/world/entities/building';
import { ShotTexture, ShotType } from '~type/world/entities/shot';

import { BuildingTower } from '../tower';

export class BuildingTowerFire extends BuildingTower {
  static Name = 'Fire tower';

  static Description = [
    { text: 'Basic attack of enemy\nwith a fireball.', type: 'text' },
    { text: 'Health: 600', icon: ScreenIcon.HEALTH },
    { text: 'Radius: 215', icon: ScreenIcon.RADIUS },
    { text: 'Pause: 1.4 s', icon: ScreenIcon.PAUSE },
    { text: 'Speed: 55', icon: ScreenIcon.SPEED },
    { text: 'Damage: 35', icon: ScreenIcon.DAMAGE },
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
        type: ShotType.BALL,
        texture: ShotTexture.FIRE,
        glowColor: 0xff5400,
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
    const nextDamage = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
      ? this.getShotParams(this.upgradeLevel + 1).damage
      : null;

    return [
      ...super.getInfo(), {
        text: `Damage: ${this.getShotParams().damage}`,
        post: nextDamage && `→ ${nextDamage}`,
        icon: ScreenIcon.DAMAGE,
      },
    ];
  }
}

import BuildingTower from '~scene/world/entities/buildings/tower';
import World from '~scene/world';

import { BuildingTexture, BuildingVariant } from '~type/building';
import { ShotType } from '~type/shot';

export default class BuildingTowerFire extends BuildingTower {
  static Name = 'Fire tower';

  static Description = 'Attack enemies\nHP: 1000\nDamage: 35';

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = { bronze: 35, silver: 20 };

  static UpgradeCost = { bronze: 35, silver: 20, gold: 70 };

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_FIRE,
      health: 600,
      texture: BuildingTowerFire.Texture,
      upgradeCost: BuildingTowerFire.UpgradeCost,
      actions: {
        radius: 215, // Attack radius
        pause: 1400, // Pause between shoots
      },
      shotType: ShotType.FIRE,
      shotData: {
        damage: 35,
        speed: 550,
      },
    });
  }

  /**
   * Add damage to building info.
   */
  public getInfo(): string[] {
    return [
      ...super.getInfo(),
      `Damage: ${this.getShotParams().damage}`,
    ];
  }
}

import BuildingTower from '~scene/world/entities/buildings/tower';
import World from '~scene/world';

import { BuildingTexture, BuildingVariant } from '~type/building';
import { ShotType } from '~type/shot';

export default class BuildingTowerLazer extends BuildingTower {
  static Name = 'Lazer tower';

  static Description = 'Attack enemies\nHP: 600\nDamage: 75';

  static Texture = BuildingTexture.TOWER_LAZER;

  static Cost = { bronze: 45, silver: 40, gold: 40 };

  static UpgradeCost = { bronze: 45, silver: 40, gold: 80 };

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector3Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_LAZER,
      health: 600,
      texture: BuildingTowerLazer.Texture,
      upgradeCost: BuildingTowerLazer.UpgradeCost,
      actions: {
        radius: 180, // Attack radius
        pause: 1600, // Pause between shoots
      },
      shotType: ShotType.LAZER,
      shotData: {
        damage: 15,
      },
    });
  }

  /**
   * Add damage to building info.
   */
  public getInfo(): string[] {
    return [
      ...super.getInfo(),
      `Damage: ${this.getShotParams().damage * 5}`,
    ];
  }
}

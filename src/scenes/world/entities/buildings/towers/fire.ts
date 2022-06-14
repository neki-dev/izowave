import BuildingTower from '~scene/world/entities/buildings/tower';
import World from '~scene/world';

import { BuildingTexture, BuildingVariant } from '~type/building';
import { ShotType } from '~type/shot';

export default class BuildingTowerFire extends BuildingTower {
  static Name = 'Fire tower';

  static Description = 'For attack enemies';

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = { bronze: 35, silver: 20 };

  static UpgradeCost = { bronze: 35, silver: 20, gold: 70 };

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector3Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_FIRE,
      health: 1000,
      texture: BuildingTowerFire.Texture,
      upgradeCost: BuildingTowerFire.UpgradeCost,
      actions: {
        radius: 220, // Attack radius
        pause: 1400, // Pause between shoots
      },
      shotType: ShotType.FIRE,
      shotData: {
        damage: 35,
        speed: 550,
      },
    });
  }
}

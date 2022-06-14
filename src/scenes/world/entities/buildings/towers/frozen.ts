import BuildingTower from '~scene/world/entities/buildings/tower';
import World from '~scene/world';

import { BuildingTexture, BuildingVariant } from '~type/building';
import { ShotType } from '~type/shot';

export default class BuildingTowerFrozen extends BuildingTower {
  static Name = 'Frozen tower';

  static Description = 'For stop enemies';

  static Texture = BuildingTexture.TOWER_FROZEN;

  static Cost = { bronze: 35, silver: 30 };

  static UpgradeCost = { bronze: 35, silver: 30, gold: 70 };

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector3Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_FROZEN,
      health: 1200,
      texture: BuildingTowerFrozen.Texture,
      upgradeCost: BuildingTowerFrozen.UpgradeCost,
      actions: {
        radius: 220, // Attack radius
        pause: 1400, // Pause between shoots
      },
      shotType: ShotType.FROZEN,
      shotData: {
        freeze: 1400,
        speed: 550,
      },
    });
  }
}

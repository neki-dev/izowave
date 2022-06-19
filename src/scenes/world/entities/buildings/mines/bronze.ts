import BuildingMine from '~scene/world/entities/buildings/mine';
import World from '~scene/world';

import { BuildingTexture, BuildingVariant, ResourceType } from '~type/building';

export default class BuildingMineBronze extends BuildingMine {
  static Name = 'Bronze mine';

  static Description = 'Generation bronze\nHP: 1000';

  static Texture = BuildingTexture.MINE_BRONZE;

  static Cost = { bronze: 20, silver: 20 };

  static UpgradeCost = { bronze: 10, silver: 10, gold: 30 };

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector3Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.MINE_BRONZE,
      health: 1000,
      texture: BuildingMineBronze.Texture,
      upgradeCost: BuildingMineBronze.UpgradeCost,
      actions: {
        pause: 2000, // Pause between generations
      },
      resourceType: ResourceType.BRONZE,
    });
  }
}

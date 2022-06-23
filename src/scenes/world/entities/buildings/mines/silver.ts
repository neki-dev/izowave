import BuildingMine from '~scene/world/entities/buildings/mine';
import World from '~scene/world';

import { BuildingVariant, BuildingTexture, ResourceType } from '~type/building';

export default class BuildingMineSilver extends BuildingMine {
  static Name = 'Silver mine';

  static Description = 'Generation silver';

  static Texture = BuildingTexture.MINE_SILVER;

  static Cost = { bronze: 20, silver: 20 };

  static UpgradeCost = { bronze: 10, silver: 20, gold: 10 };

  static Health = 500;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.MINE_SILVER,
      health: BuildingMineSilver.Health,
      texture: BuildingMineSilver.Texture,
      upgradeCost: BuildingMineSilver.UpgradeCost,
      actions: {
        pause: 2000, // Pause between generations
      },
      resourceType: ResourceType.SILVER,
    });
  }
}

import BuildingMine from '~scene/world/entities/buildings/mine';
import World from '~scene/world';

import { BuildingVariant, BuildingTexture, ResourceType } from '~type/building';

export default class BuildingMineSilver extends BuildingMine {
  static Name = 'Sikver mine';

  static Description = 'For generation silver';

  static Texture = BuildingTexture.MINE_SILVER;

  static Cost = { bronze: 20, silver: 20 };

  static UpgradeCost = { bronze: 10, silver: 10, gold: 30 };

  /**
   * Building variant constructor.
   */
  constructor(scene: World, position: Phaser.Types.Math.Vector3Like) {
    super(scene, {
      position,
      variant: BuildingVariant.MINE_SILVER,
      health: 1000,
      texture: BuildingMineSilver.Texture,
      upgradeCost: BuildingMineSilver.UpgradeCost,
      actions: {
        pause: 2000, // Pause between generations
      },
      resourceType: ResourceType.SILVER,
    });
  }
}

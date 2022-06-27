import BuildingMine from '~scene/world/entities/buildings/mine';
import World from '~scene/world';

import { BuildingTexture, BuildingVariant, ResourceType } from '~type/building';

import { MINE_RESOURCES_LIMIT } from '~const/difficulty';

export default class BuildingMineBronze extends BuildingMine {
  static Name = 'Bronze mine';

  static Description = [
    { text: 'Bronze resource generation\nfor builds and upgrades.', type: 'text' },
    { text: 'Health: 400', icon: 0 },
    { text: 'Pause: 2.0 s', icon: 6 },
    { text: `Limit: ${MINE_RESOURCES_LIMIT}`, icon: 5 },
  ];

  static Texture = BuildingTexture.MINE_BRONZE;

  static Cost = { bronze: 20, silver: 20 };

  static UpgradeCost = { bronze: 20, silver: 10, gold: 10 };

  static Health = 400;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.MINE_BRONZE,
      health: BuildingMineBronze.Health,
      texture: BuildingMineBronze.Texture,
      upgradeCost: BuildingMineBronze.UpgradeCost,
      actions: {
        pause: 2000, // Pause between generations
      },
      resourceType: ResourceType.BRONZE,
    });
  }
}

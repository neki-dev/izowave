import BuildingMine from '~scene/world/entities/buildings/mine';
import World from '~scene/world';

import { BuildingTexture, BuildingVariant, ResourceType } from '~type/building';

import { MINE_RESOURCES_LIMIT } from '~const/difficulty';

export default class BuildingMineGold extends BuildingMine {
  static Name = 'Gold mine';

  static Description = [
    { text: 'Gold resource generation\nfor builds and upgrades.', type: 'text' },
    { text: 'Health: 400', icon: 0 },
    { text: 'Pause: 2.0 s', icon: 6 },
    { text: `Limit: ${MINE_RESOURCES_LIMIT}`, icon: 5 },
  ];

  static Texture = BuildingTexture.MINE_GOLD;

  static Cost = { bronze: 30, silver: 35 };

  static UpgradeCost = { bronze: 10, silver: 10, gold: 20 };

  static Health = 400;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.MINE_GOLD,
      health: BuildingMineGold.Health,
      texture: BuildingMineGold.Texture,
      upgradeCost: BuildingMineGold.UpgradeCost,
      actions: {
        pause: 2000, // Pause between generations
      },
      resourceType: ResourceType.GOLD,
    });
  }
}

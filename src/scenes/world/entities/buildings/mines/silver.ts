import { MINE_LIMIT, MINE_RESOURCES_LIMIT } from '~const/difficulty';
import { World } from '~scene/world';
import { BuildingMine } from '~scene/world/entities/buildings/mine';
import { BuildingVariant, BuildingTexture } from '~type/world/entities/building';
import { ResourceType } from '~type/world/resources';

export class BuildingMineSilver extends BuildingMine {
  static Name = 'Silver mine';

  static Description = [
    { text: 'Silver resource generation\nfor builds and upgrades.', type: 'text' },
    { text: 'Health: 400', icon: 0 },
    { text: 'Pause: 2.0 s', icon: 6 },
    { text: `Limit: ${MINE_RESOURCES_LIMIT}`, icon: 5 },
  ];

  static Texture = BuildingTexture.MINE_SILVER;

  static Cost = { bronze: 20, silver: 20 };

  static UpgradeCost = { bronze: 10, silver: 20, gold: 10 };

  static Health = 400;

  static Limit = MINE_LIMIT;

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

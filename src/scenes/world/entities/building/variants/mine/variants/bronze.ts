import { DIFFICULTY } from '~const/difficulty';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingTexture, BuildingVariant } from '~type/world/entities/building';
import { ResourceType } from '~type/world/resources';

import { BuildingMine } from '../mine';

export class BuildingMineBronze extends BuildingMine {
  static Name = 'Bronze mine';

  static Description = [
    { text: 'Bronze resource generation for builds and upgrades', type: 'text' },
    { text: 'HEALTH: 400', icon: ScreenIcon.HEALTH },
    { text: 'PAUSE: 2.0 s', icon: ScreenIcon.PAUSE },
    { text: `RESOURCES: ${DIFFICULTY.MINE_RESOURCES}`, icon: ScreenIcon.RESOURCES },
  ];

  static Texture = BuildingTexture.MINE_BRONZE;

  static Cost = { bronze: 20, silver: 20 };

  static UpgradeCost = { bronze: 20, silver: 10, gold: 10 };

  static Health = 400;

  static Limit = DIFFICULTY.MINE_LIMIT;

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

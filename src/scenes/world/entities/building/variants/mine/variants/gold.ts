import { DIFFICULTY } from '~const/difficulty';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingTexture, BuildingVariant } from '~type/world/entities/building';
import { ResourceType } from '~type/world/resources';

import { BuildingMine } from '../mine';

export class BuildingMineGold extends BuildingMine {
  static Name = 'Gold mine';

  static Description = [
    { text: 'Gold resource generation for builds and upgrades', type: 'text' },
    { text: 'Health: 400', icon: ScreenIcon.HEALTH },
    { text: 'Pause: 2.0 s', icon: ScreenIcon.PAUSE },
    { text: `Resources: ${DIFFICULTY.MINE_RESOURCES}`, icon: ScreenIcon.RESOURCES },
  ];

  static Texture = BuildingTexture.MINE_GOLD;

  static Cost = { bronze: 30, silver: 35 };

  static UpgradeCost = { bronze: 10, silver: 10, gold: 20 };

  static Health = 400;

  static Limit = DIFFICULTY.MINE_LIMIT;

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

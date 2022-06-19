import Building from '~scene/world/entities/building';
import World from '~scene/world';

import {
  BuildingEvents, BuildingVariant, BuildingTexture,
} from '~type/building';

import { WALL_HEALTH_AMOUNT } from '~const/difficulty';

export default class BuildingWall extends Building {
  static Name = 'Wall';

  static Description = `Basic defence\nHP: ${WALL_HEALTH_AMOUNT}`;

  static Texture = BuildingTexture.WALL;

  static Cost = { bronze: 10, silver: 10 };

  static UpgradeCost = { bronze: 5, silver: 5, gold: 10 };

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector3Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.WALL,
      health: WALL_HEALTH_AMOUNT,
      texture: BuildingWall.Texture,
      upgradeCost: BuildingWall.UpgradeCost,
    });

    this.on(BuildingEvents.UPGRADE, this.upgradeHealth, this);
  }

  /**
   * Update health by upgrade level.
   *
   * @param level - Upgrade level
   */
  private upgradeHealth(level: number) {
    this.live.setMaxHealth(WALL_HEALTH_AMOUNT * level);
  }
}

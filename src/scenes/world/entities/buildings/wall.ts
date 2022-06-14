import { calcGrowth } from '~lib/utils';
import Building from '~scene/world/entities/building';
import World from '~scene/world';

import {
  BuildingEvents, BuildingVariant, BuildingTexture,
} from '~type/building';

import { WALL_HEALTH_GROWTH } from '~const/difficulty';

export default class BuildingWall extends Building {
  static Name = 'Wall';

  static Description = 'For basic defence';

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
      health: 3000,
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
    const health = Math.ceil(calcGrowth(3000, WALL_HEALTH_GROWTH, level) / 100) * 100;
    this.live.setMaxHealth(health);
  }
}

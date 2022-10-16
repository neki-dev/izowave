import { World } from '~scene/world';
import { Building } from '~scene/world/entities/building';
import { ScreenIcon } from '~type/screen';
import {
  BuildingEvents, BuildingVariant, BuildingTexture,
} from '~type/world/entities/building';

export class BuildingWall extends Building {
  static Name = 'Wall';

  static Description = [
    { text: 'Wall with more health to\ndefend other buildings.', type: 'text' },
    { text: 'Health: 2000', icon: ScreenIcon.HEALTH },
  ];

  static Texture = BuildingTexture.WALL;

  static Cost = { bronze: 10, silver: 10 };

  static UpgradeCost = { bronze: 5, silver: 5, gold: 10 };

  static Health = 2000;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.WALL,
      health: BuildingWall.Health,
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
    this.live.setMaxHealth(BuildingWall.Health * level);
  }
}

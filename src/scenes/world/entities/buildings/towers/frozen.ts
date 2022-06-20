import BuildingTower from '~scene/world/entities/buildings/tower';
import World from '~scene/world';

import { BuildingTexture, BuildingVariant } from '~type/building';
import { ShotType } from '~type/shot';

export default class BuildingTowerFrozen extends BuildingTower {
  static Name = 'Frozen tower';

  static Description = 'Stop enemies\nFreeze: 1.4 s';

  static Texture = BuildingTexture.TOWER_FROZEN;

  static Cost = { bronze: 35, silver: 30 };

  static UpgradeCost = { bronze: 35, silver: 30, gold: 70 };

  static Health = 900;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_FROZEN,
      health: BuildingTowerFrozen.Health,
      texture: BuildingTowerFrozen.Texture,
      upgradeCost: BuildingTowerFrozen.UpgradeCost,
      actions: {
        radius: 220, // Attack radius
        pause: 1400, // Pause between shoots
      },
      shotType: ShotType.FROZEN,
      shotData: {
        freeze: 1400,
        speed: 550,
      },
    });
  }

  /**
   * Add freeze to building info.
   */
  public getInfo(): string[] {
    return [
      ...super.getInfo(),
      `Freeze: ${(this.getShotParams().freeze / 1000).toFixed(1)} s`,
    ];
  }
}

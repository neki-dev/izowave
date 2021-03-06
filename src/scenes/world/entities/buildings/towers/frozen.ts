import BuildingTower from '~scene/world/entities/buildings/tower';
import World from '~scene/world';

import { BuildingDescriptionItem, BuildingTexture, BuildingVariant } from '~type/building';
import { ShotType } from '~type/shot';

import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';

export default class BuildingTowerFrozen extends BuildingTower {
  static Name = 'Frozen tower';

  static Description = [
    { text: 'Freeze and stop enemies\nfor some time.', type: 'text' },
    { text: 'Health: 700', icon: 0 },
    { text: 'Radius: 210', icon: 1 },
    { text: 'Pause: 1.4 s', icon: 6 },
    { text: 'Speed: 55', icon: 7 },
    { text: 'Freeze: 1.0 s', icon: 4 },
  ];

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
        radius: 210, // Attack radius
        pause: 1400, // Pause between shoots
      },
      shotType: ShotType.FROZEN,
      shotData: {
        freeze: 1000,
        speed: 550,
      },
    });
  }

  /**
   * Add freeze to building info.
   */
  public getInfo(): BuildingDescriptionItem[] {
    const nextFreeze = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
      ? this.getShotParams(this.upgradeLevel + 1).freeze / 1000
      : null;
    return [
      ...super.getInfo(), {
        text: `Freeze: ${(this.getShotParams().freeze / 1000).toFixed(1)} s`,
        post: nextFreeze && `→ ${nextFreeze.toFixed(1)} s`,
        icon: 4,
      },
    ];
  }
}
